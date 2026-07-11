import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('levels')
export class Level {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'level_number', unique: true })
  levelNumber: number;

  @Column({ length: 100 })
  name: string;

  @Column({ name: 'min_operating_capital', type: 'decimal', precision: 20, scale: 8, default: 0 })
  minOperatingCapital: number;

  @Column({ name: 'min_referrals', default: 0 })
  minReferrals: number;

  @Column({ name: 'min_account_days', default: 0 })
  minAccountDays: number;

  @Column({ name: 'daily_yield_percent', type: 'decimal', precision: 10, scale: 6 })
  dailyYieldPercent: number;

  @Column({ name: 'quantizations_per_day', default: 1 })
  quantizationsPerDay: number;

  @Column({ name: 'fee_reduction_percent', type: 'decimal', precision: 5, scale: 2, default: 0 })
  feeReductionPercent: number;

  @Column({ name: 'referral_bonus_percent', type: 'decimal', precision: 5, scale: 2, default: 0 })
  referralBonusPercent: number;

  @Column({ name: 'referral_level1_percent', type: 'decimal', precision: 5, scale: 2, default: 8.00 })
  referralLevel1Percent: number;

  @Column({ name: 'referral_level2_percent', type: 'decimal', precision: 5, scale: 2, default: 5.00 })
  referralLevel2Percent: number;

  @Column({ name: 'referral_level3_percent', type: 'decimal', precision: 5, scale: 2, default: 3.00 })
  referralLevel3Percent: number;

  @Column({ name: 'withdrawal_fee_percent', type: 'decimal', precision: 5, scale: 2, default: 15.00 })
  withdrawalFeePercent: number;

  @Column({ type: 'jsonb', nullable: true })
  benefits: any;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
