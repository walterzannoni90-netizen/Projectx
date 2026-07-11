import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Profile } from './profile.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
  ) {}

  async findById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['profile', 'wallet', 'userLevels'],
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async updateProfile(userId: string, data: Partial<Profile>) {
    let profile = await this.profileRepository.findOne({ where: { userId } });
    if (!profile) {
      profile = this.profileRepository.create({ userId, ...data });
    } else {
      Object.assign(profile, data);
    }
    return this.profileRepository.save(profile);
  }

  async getSessions(userId: string) {
    const repo = this.userRepository.manager.getRepository('Session');
    return repo.find({
      where: { userId, isActive: true },
      order: { lastActivityAt: 'DESC' },
    });
  }

  async getDashboard(userId: string) {
    const user = await this.findById(userId);
    const wallet = user.wallet;
    const level = user.userLevels?.[0];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get today's earnings
    const txRepo = this.userRepository.manager.getRepository('Transaction');
    const todayEarnings = await txRepo
      .createQueryBuilder('tx')
      .where('tx.user_id = :userId', { userId })
      .andWhere('tx.type = :type', { type: 'quantization_earning' })
      .andWhere('tx.created_at >= :today', { today })
      .select('COALESCE(SUM(tx.amount), 0)', 'total')
      .getRawOne();

    // Get recent transactions
    const recentTransactions = await txRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 10,
    });

    // Get active quantization
    const quantRepo = this.userRepository.manager.getRepository('Quantization');
    const activeQuantization = await quantRepo.findOne({
      where: { userId, status: 'running' },
    });

    return {
      totalBalance: wallet?.totalBalance || 0,
      operatingCapital: wallet?.operatingCapital || 0,
      availableBalance: wallet?.availableBalance || 0,
      dailyEarnings: Number(todayEarnings?.total || 0),
      totalEarnings: wallet?.totalEarned || 0,
      currentLevel: level?.currentLevelId || null,
      levelProgress: level?.progressPercent || 0,
      activeReferrals: level?.currentReferrals || 0,
      nextQuantizationAt: activeQuantization?.completedAt || null,
      lastTransactions: recentTransactions,
    };
  }
}
