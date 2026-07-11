import { ReferralService } from './referral.service';
export declare class ReferralController {
    private readonly referralService;
    constructor(referralService: ReferralService);
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
        rewards: import("./referral-reward.entity").ReferralReward[];
    }>;
    getTree(userId: string): Promise<{
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
}
