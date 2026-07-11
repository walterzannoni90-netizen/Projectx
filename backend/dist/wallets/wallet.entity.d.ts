import { User } from '../users/user.entity';
import { Transaction } from './transaction.entity';
export declare class Wallet {
    id: string;
    userId: string;
    user: User;
    totalBalance: number;
    operatingCapital: number;
    availableBalance: number;
    totalDeposited: number;
    totalWithdrawn: number;
    totalEarned: number;
    totalFees: number;
    createdAt: Date;
    updatedAt: Date;
    transactions: Transaction[];
}
