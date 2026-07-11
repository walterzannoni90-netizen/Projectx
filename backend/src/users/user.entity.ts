import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn,
  OneToOne, OneToMany
} from 'typeorm';
import { Profile } from './profile.entity';
import { Wallet } from '../wallets/wallet.entity';
import { WalletAddress } from '../wallets/wallet-address.entity';
import { Deposit } from '../deposits/deposit.entity';
import { Withdrawal } from '../withdrawals/withdrawal.entity';
import { Transaction } from '../wallets/transaction.entity';
import { Quantization } from '../quantization/quantization.entity';
import { Referral } from '../referral/referral.entity';
import { UserLevel } from '../levels/user-level.entity';
import { Notification } from '../notifications/notification.entity';
import { Session } from '../auth/session.entity';

export enum UserStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  BANNED = 'banned',
  DELETED = 'deleted',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ length: 50, nullable: true })
  phone: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ length: 100, nullable: true })
  nickname: string;

  @Column({ name: 'referral_code', unique: true, length: 20 })
  referralCode: string;

  @Column({ name: 'referred_by', nullable: true })
  referredById: string;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.PENDING })
  status: UserStatus;

  @Column({ name: 'email_verified_at', type: 'timestamptz', nullable: true })
  emailVerifiedAt: Date;

  @Column({ name: 'phone_verified_at', type: 'timestamptz', nullable: true })
  phoneVerifiedAt: Date;

  @Column({ name: 'two_factor_enabled', default: false })
  twoFactorEnabled: boolean;

  @Column({ name: 'two_factor_secret', nullable: true })
  twoFactorSecret: string | null;

  @Column({ name: 'pin_hash', nullable: true })
  pinHash: string;

  @Column({ name: 'pin_set_at', type: 'timestamptz', nullable: true })
  pinSetAt: Date;

  @Column({ name: 'last_login_at', type: 'timestamptz', nullable: true })
  lastLoginAt: Date;

  @Column({ name: 'last_login_ip', type: 'inet', nullable: true })
  lastLoginIp: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  // Relations
  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile;

  @OneToOne(() => Wallet, (wallet) => wallet.user)
  wallet: Wallet;

  @OneToMany(() => WalletAddress, (addr) => addr.user)
  walletAddresses: WalletAddress[];

  @OneToMany(() => Deposit, (deposit) => deposit.user)
  deposits: Deposit[];

  @OneToMany(() => Withdrawal, (withdrawal) => withdrawal.user)
  withdrawals: Withdrawal[];

  @OneToMany(() => Transaction, (tx) => tx.user)
  transactions: Transaction[];

  @OneToMany(() => Quantization, (q) => q.user)
  quantizations: Quantization[];

  @OneToMany(() => Referral, (ref) => ref.referred)
  referrals: Referral[];

  @OneToMany(() => UserLevel, (ul) => ul.user)
  userLevels: UserLevel[];

  @OneToMany(() => Notification, (notif) => notif.user)
  notifications: Notification[];

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];
}
