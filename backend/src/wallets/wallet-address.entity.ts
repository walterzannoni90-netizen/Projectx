import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

export enum WalletChain {
  TRC20 = 'TRC20',
  BEP20 = 'BEP20',
  ERC20 = 'ERC20',
  POLYGON = 'POLYGON',
  ARBITRUM = 'ARBITRUM',
  SOLANA = 'SOLANA',
}

@Entity('wallet_addresses')
export class WalletAddress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (user) => user.walletAddresses)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'enum', enum: WalletChain })
  chain: WalletChain;

  @Column({ type: 'text' })
  address: string;

  @Column({ length: 100, nullable: true })
  label: string;

  @Column({ name: 'is_default', default: false })
  isDefault: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
