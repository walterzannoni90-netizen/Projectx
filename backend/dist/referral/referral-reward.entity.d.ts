import { User } from '../users/user.entity';
import { Referral } from './referral.entity';
export declare class ReferralReward {
    id: string;
    referralId: string;
    referral: Referral;
    userId: string;
    user: User;
    fromUserId: string;
    amount: number;
    level: number;
    percent: number;
    sourceTransactionId: string;
    createdAt: Date;
}
