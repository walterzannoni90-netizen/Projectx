import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

export enum TransactionStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export enum WalletChain {
  TRC20 = 'TRC20',
  BEP20 = 'BEP20',
  ERC20 = 'ERC20',
  POLYGON = 'POLYGON',
  ARBITRUM = 'ARBITRUM',
  SOLANA = 'SOLANA',
}

@Entity('withdrawals')
export class Withdrawal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (user) => user.withdrawals)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'wallet_id' })
  walletId: string;

  @Column({ type: 'enum', enum: WalletChain })
  chain: WalletChain;

  @Column({ name: 'to_address', type: 'text' })
  toAddress: string;

  @Column({ type: 'decimal', precision: 20, scale: 8 })
  amount: number;

  @Column({ name: 'amount_usd', type: 'decimal', precision: 20, scale: 8, nullable: true })
  amountUsd: number;

  @Column({ type: 'decimal', precision: 20, scale: 8, default: 0 })
  fee: number;

  @Column({ name: 'fee_percent', type: 'decimal', precision: 5, scale: 2, default: 15.00 })
  feePercent: number;

  @Column({ name: 'pin_verified', default: false })
  pinVerified: boolean;

  @Column({ name: 'pin_verified_at', type: 'timestamptz', nullable: true })
  pinVerifiedAt: Date;

  @Column({ name: 'admin_approved_by', nullable: true })
  adminApprovedBy: string;

  @Column({ name: 'admin_approved_at', type: 'timestamptz', nullable: true })
  adminApprovedAt: Date;

  @Column({ name: 'tx_hash', nullable: true })
  txHash: string;

  @Column({ type: 'enum', enum: TransactionStatus, default: TransactionStatus.PENDING })
  status: TransactionStatus;

  @Column({ name: 'rejection_reason', nullable: true })
  rejectionReason: string;

  @Column({ name: 'completed_at', type: 'timestamptz', nullable: true })
  completedAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
