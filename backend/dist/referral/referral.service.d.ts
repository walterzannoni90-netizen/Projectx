import { Repository } from 'typeorm';
import { Referral } from './referral.entity';
import { ReferralReward } from './referral-reward.entity';
export declare class ReferralService {
    private referralRepository;
    private rewardRepository;
    private userRepository;
    constructor(referralRepository: Repository<Referral>, rewardRepository: Repository<ReferralReward>, userRepository: any);
    getTeam(userId: string): Promise<{
        total: number;
        active: number;
        members: {
            id: string;
            nickname: string;
            email: string;
            level: number;
            joinedAt: Date;
            operatingCapital: any;
            commissionsEarned: number;
            isActive: boolean;
        }[];
    }>;
    getRewards(userId: string): Promise<{
        total: number;
        rewards: ReferralReward[];
    }>;
    getReferralTree(userId: string): Promise<{
        user: {
            id: string;
            nickname: string;
            email: string;
        };
        level: number;
        children: {
            user: {
                id: string;
                nickname: string;
                email: string;
            };
            level: number;
        }[];
    }[]>;
    distributeCommission(transactionId: string, userId: string, amount: number): Promise<void>;
}
