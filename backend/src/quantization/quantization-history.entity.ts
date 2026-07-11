import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Quantization } from './quantization.entity';

export enum QuantizationStatus {
  IDLE = 'idle',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

@Entity('quantization_history')
export class QuantizationHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'quantization_id' })
  quantizationId: string;

  @ManyToOne(() => Quantization)
  @JoinColumn({ name: 'quantization_id' })
  quantization: Quantization;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'cycle_number' })
  cycleNumber: number;

  @Column({ type: 'decimal', precision: 20, scale: 8 })
  amount: number;

  @Column({ name: 'return_amount', type: 'decimal', precision: 20, scale: 8 })
  returnAmount: number;

  @Column({ name: 'yield_percent', type: 'decimal', precision: 10, scale: 6 })
  yieldPercent: number;

  @Column({ type: 'enum', enum: QuantizationStatus })
  status: QuantizationStatus;

  @Column({ name: 'completed_at', type: 'timestamptz' })
  completedAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
