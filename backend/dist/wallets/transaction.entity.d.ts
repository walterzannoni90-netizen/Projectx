import { User } from '../users/user.entity';
import { Wallet } from './wallet.entity';
export declare enum TransactionType {
    DEPOSIT = "deposit",
    WITHDRAWAL = "withdrawal",
    QUANTIZATION_EARNING = "quantization_earning",
    REFERRAL_REWARD = "referral_reward",
    FEE = "fee",
    BONUS = "bonus"
}
export declare class Transaction {
    id: string;
    userId: string;
    user: User;
    walletId: string;
    wallet: Wallet;
    type: TransactionType;
    amount: number;
    fee: number;
    balanceBefore: number;
    balanceAfter: number;
    referenceType: string;
    referenceId: string;
    description: string;
    metadata: any;
    createdAt: Date;
}
