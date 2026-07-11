import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Referral } from './referral.entity';

@Entity('referral_rewards')
export class ReferralReward {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'referral_id' })
  referralId: string;

  @ManyToOne(() => Referral)
  @JoinColumn({ name: 'referral_id' })
  referral: Referral;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'from_user_id' })
  fromUserId: string;

  @Column({ type: 'decimal', precision: 20, scale: 8 })
  amount: number;

  @Column()
  level: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  percent: number;

  @Column({ name: 'source_transaction_id', nullable: true })
  sourceTransactionId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
