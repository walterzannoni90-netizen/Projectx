import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Transaction } from './transaction.entity';

@Entity('wallets')
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @OneToOne(() => User, (user) => user.wallet)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'total_balance', type: 'decimal', precision: 20, scale: 8, default: 0 })
  totalBalance: number;

  @Column({ name: 'operating_capital', type: 'decimal', precision: 20, scale: 8, default: 0 })
  operatingCapital: number;

  @Column({ name: 'available_balance', type: 'decimal', precision: 20, scale: 8, default: 0 })
  availableBalance: number;

  @Column({ name: 'total_deposited', type: 'decimal', precision: 20, scale: 8, default: 0 })
  totalDeposited: number;

  @Column({ name: 'total_withdrawn', type: 'decimal', precision: 20, scale: 8, default: 0 })
  totalWithdrawn: number;

  @Column({ name: 'total_earned', type: 'decimal', precision: 20, scale: 8, default: 0 })
  totalEarned: number;

  @Column({ name: 'total_fees', type: 'decimal', precision: 20, scale: 8, default: 0 })
  totalFees: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Transaction, (tx) => tx.wallet)
  transactions: Transaction[];
}
