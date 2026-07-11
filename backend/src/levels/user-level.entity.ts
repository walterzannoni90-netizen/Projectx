import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Level } from './level.entity';

@Entity('user_levels')
export class UserLevel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (user) => user.userLevels)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'current_level_id' })
  currentLevelId: string;

  @ManyToOne(() => Level)
  @JoinColumn({ name: 'current_level_id' })
  currentLevel: Level;

  @Column({ name: 'next_level_id', nullable: true })
@Column({ name: 'next_level_id', type: 'varchar', nullable: true })
  nextLevelId: string | null;

  @Column({ name: 'current_capital', type: 'decimal', precision: 20, scale: 8, default: 0 })
  currentCapital: number;

  @Column({ name: 'target_capital', type: 'decimal', precision: 20, scale: 8, default: 0 })
  targetCapital: number;

  @Column({ name: 'current_referrals', default: 0 })
  currentReferrals: number;

  @Column({ name: 'target_referrals', default: 0 })
  targetReferrals: number;

  @Column({ name: 'progress_percent', type: 'decimal', precision: 5, scale: 2, default: 0 })
  progressPercent: number;

  @Column({ name: 'upgraded_at', type: 'timestamptz', nullable: true })
  upgradedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
