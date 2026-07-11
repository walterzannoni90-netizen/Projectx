import { User } from '../users/user.entity';
export declare class Referral {
    id: string;
    referrerId: string;
    referrer: User;
    referredId: string;
    referred: User;
    level: number;
    commissionEarned: number;
    isActive: boolean;
    createdAt: Date;
}
