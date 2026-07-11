import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('referrals')
export class Referral {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'referrer_id' })
  referrerId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'referrer_id' })
  referrer: User;

  @Column({ name: 'referred_id' })
  referredId: string;

  @ManyToOne(() => User, (user) => user.referrals)
  @JoinColumn({ name: 'referred_id' })
  referred: User;

  @Column({ default: 1 })
  level: number;

  @Column({ name: 'commission_earned', type: 'decimal', precision: 20, scale: 8, default: 0 })
  commissionEarned: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
