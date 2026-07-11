import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Level } from './level.entity';
import { UserLevel } from './user-level.entity';

@Injectable()
export class LevelsService {
  constructor(
    @InjectRepository(Level) private levelRepository: Repository<Level>,
    @InjectRepository(UserLevel) private userLevelRepository: Repository<UserLevel>,
  ) {}

  async getAllLevels() {
    return this.levelRepository.find({ where: { isActive: true }, order: { levelNumber: 'ASC' } });
  }

  async getUserLevel(userId: string) {
    const userLevel = await this.userLevelRepository.findOne({
      where: { userId },
      relations: ['currentLevel'],
    });
    if (!userLevel) return null;

    let nextLevel: Level | null = null;
    if (userLevel.nextLevelId) {
      nextLevel = await this.levelRepository.findOne({ where: { id: userLevel.nextLevelId } });
    }

    return {
      current: userLevel.currentLevel,
      next: nextLevel,
      progress: {
        capital: { current: userLevel.currentCapital, target: userLevel.targetCapital },
        referrals: { current: userLevel.currentReferrals, target: userLevel.targetReferrals },
        percent: userLevel.progressPercent,
      },
      upgradedAt: userLevel.upgradedAt,
    };
  }

  async checkUpgrade(userId: string) {
    const userLevel = await this.userLevelRepository.findOne({
      where: { userId },
      relations: ['currentLevel'],
    });
    if (!userLevel || !userLevel.nextLevelId) return { canUpgrade: false };

    const nextLevel = await this.levelRepository.findOne({ where: { id: userLevel.nextLevelId } });
    if (!nextLevel) return { canUpgrade: false };

    const wallet = await this.userLevelRepository.manager.getRepository('Wallet')
      .findOne({ where: { userId } });

    const capital = Number(wallet?.operatingCapital || 0);
    const referralCount = userLevel.currentReferrals;

    const canUpgrade = 
      capital >= Number(nextLevel.minOperatingCapital) &&
      referralCount >= nextLevel.minReferrals;

    return {
      canUpgrade,
      requirements: {
        capital: { current: capital, needed: Number(nextLevel.minOperatingCapital) },
        referrals: { current: referralCount, needed: nextLevel.minReferrals },
        accountDays: { current: 0, needed: nextLevel.minAccountDays },
      },
    };
  }

  async performUpgrade(userId: string) {
    const userLevel = await this.userLevelRepository.findOne({
      where: { userId },
    });
    if (!userLevel || !userLevel.nextLevelId) {
      throw new BadRequestException('Cannot upgrade: no next level');
    }

    const nextLevel = await this.levelRepository.findOne({ where: { id: userLevel.nextLevelId } });
    if (!nextLevel) throw new BadRequestException('Next level not found');

    const nextNextLevel = await this.levelRepository.findOne({
      where: { levelNumber: nextLevel.levelNumber + 1 },
    });

    userLevel.currentLevelId = userLevel.nextLevelId;
    userLevel.nextLevelId = nextNextLevel?.id || null;
    userLevel.upgradedAt = new Date();
    userLevel.progressPercent = 0;

    return this.userLevelRepository.save(userLevel);
  }
}
