import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Referral } from './referral.entity';
import { ReferralReward } from './referral-reward.entity';

@Injectable()
export class ReferralService {
  constructor(
    @InjectRepository(Referral) private referralRepository: Repository<Referral>,
    @InjectRepository(ReferralReward) private rewardRepository: Repository<ReferralReward>,
    @InjectRepository(Referral) private userRepository: any,
  ) {}

  async getTeam(userId: string) {
    const referrals = await this.referralRepository.find({
      where: { referrerId: userId },
      relations: ['referred'],
      order: { createdAt: 'DESC' },
    });

    return {
      total: referrals.length,
      active: referrals.filter(r => r.isActive).length,
      members: await Promise.all(referrals.map(async (ref) => {
        const user = ref.referred;
        const wallet = await this.userRepository.manager.getRepository('Wallet')
          .findOne({ where: { userId: user.id } });
        return {
          id: user.id,
          nickname: user.nickname,
          email: user.email.replace(/(?<=.{3}).(?=.*@)/g, '*'),
          level: ref.level,
          joinedAt: ref.createdAt,
          operatingCapital: wallet?.operatingCapital || 0,
          commissionsEarned: ref.commissionEarned,
          isActive: ref.isActive,
        };
      })),
    };
  }

  async getRewards(userId: string) {
    const rewards = await this.rewardRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    const total = rewards.reduce((sum, r) => sum + Number(r.amount), 0);
    return { total, rewards };
  }

  async getReferralTree(userId: string) {
    const level1 = await this.referralRepository.find({
      where: { referrerId: userId },
      relations: ['referred'],
    });

    const tree = await Promise.all(level1.map(async (l1) => {
      const level2 = await this.referralRepository.find({
        where: { referrerId: l1.referredId },
        relations: ['referred'],
      });
      return {
        user: { id: l1.referred.id, nickname: l1.referred.nickname, email: l1.referred.email },
        level: 1,
        children: level2.map(l2 => ({
          user: { id: l2.referred.id, nickname: l2.referred.nickname, email: l2.referred.email },
          level: 2,
        })),
      };
    }));

    return tree;
  }

  async distributeCommission(transactionId: string, userId: string, amount: number) {
    // Get referrer chain (up to 3 levels)
    const user = await this.userRepository.manager.getRepository('User')
      .findOne({ where: { id: userId } });
    if (!user?.referredById) return;

    const levelConfigs = [
      { level: 1, percent: 0.08 },
      { level: 2, percent: 0.05 },
      { level: 3, percent: 0.03 },
    ];

    let currentReferrerId = user.referredById;
    for (let i = 0; i < 3 && currentReferrerId; i++) {
      const config = levelConfigs[i];
      const commission = amount * config.percent;

      // Create reward
      await this.rewardRepository.save({
        referralId: '', // Set actual referral ID
        userId: currentReferrerId,
        fromUserId: userId,
        amount: commission,
        level: config.level,
        percent: config.percent * 100,
        sourceTransactionId: transactionId,
      });

      // Update referral commission earned
      await this.referralRepository.update(
        { referrerId: currentReferrerId, referredId: userId },
        { commissionEarned: () => `commission_earned + ${commission}` },
      );

      // Get next referrer
      const referrer = await this.userRepository.manager.getRepository('User')
        .findOne({ where: { id: currentReferrerId } });
      currentReferrerId = referrer?.referredById || null;
    }
  }
}
