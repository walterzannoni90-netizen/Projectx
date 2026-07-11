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
export declare enum UserStatus {
    PENDING = "pending",
    ACTIVE = "active",
    SUSPENDED = "suspended",
    BANNED = "banned",
    DELETED = "deleted"
}
export declare class User {
    id: string;
    email: string;
    phone: string;
    passwordHash: string;
    nickname: string;
    referralCode: string;
    referredById: string;
    status: UserStatus;
    emailVerifiedAt: Date;
    phoneVerifiedAt: Date;
    twoFactorEnabled: boolean;
    twoFactorSecret: string | null;
    pinHash: string;
    pinSetAt: Date;
    lastLoginAt: Date;
    lastLoginIp: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    profile: Profile;
    wallet: Wallet;
    walletAddresses: WalletAddress[];
    deposits: Deposit[];
    withdrawals: Withdrawal[];
    transactions: Transaction[];
    quantizations: Quantization[];
    referrals: Referral[];
    userLevels: UserLevel[];
    notifications: Notification[];
    sessions: Session[];
}
