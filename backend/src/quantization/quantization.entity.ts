import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';

export enum QuantizationStatus {
  IDLE = 'idle',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

@Entity('quantizations')
export class Quantization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (user) => user.quantizations)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'wallet_id' })
  walletId: string;

  @Column({ name: 'level_id' })
  levelId: string;

  @Column({ name: 'amount_invested', type: 'decimal', precision: 20, scale: 8 })
  amountInvested: number;

  @Column({ name: 'expected_return', type: 'decimal', precision: 20, scale: 8 })
  expectedReturn: number;

  @Column({ name: 'actual_return', type: 'decimal', precision: 20, scale: 8, nullable: true })
  actualReturn: number;

  @Column({ name: 'daily_yield', type: 'decimal', precision: 20, scale: 8, default: 0 })
  dailyYield: number;

  @Column({ type: 'varchar', default: 'idle' })
  status: string;

  @Column({ name: 'started_at', type: 'timestamptz', nullable: true })
  startedAt: Date;

  @Column({ name: 'completed_at', type: 'timestamptz', nullable: true })
  completedAt: Date;

  @Column({ name: 'duration_seconds', nullable: true })
  durationSeconds: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
