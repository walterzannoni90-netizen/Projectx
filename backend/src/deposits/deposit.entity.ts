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

@Entity('deposits')
export class Deposit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (user) => user.deposits)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'wallet_id' })
  walletId: string;

  @Column({ type: 'varchar' })
  chain: string;

  @Column({ name: 'tx_hash', nullable: true, unique: true })
  txHash: string;

  @Column({ name: 'from_address', type: 'text' })
  fromAddress: string;

  @Column({ name: 'to_address', type: 'text' })
  toAddress: string;

  @Column({ type: 'decimal', precision: 20, scale: 8 })
  amount: number;

  @Column({ name: 'amount_usd', type: 'decimal', precision: 20, scale: 8, nullable: true })
  amountUsd: number;

  @Column({ type: 'decimal', precision: 20, scale: 8, default: 0 })
  fee: number;

  @Column({ default: 0 })
  confirmations: number;

  @Column({ name: 'required_confirmations', default: 12 })
  requiredConfirmations: number;

  @Column({ type: 'varchar', default: 'pending' })
  status: string;

  @Column({ name: 'completed_at', type: 'timestamptz', nullable: true })
  completedAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
