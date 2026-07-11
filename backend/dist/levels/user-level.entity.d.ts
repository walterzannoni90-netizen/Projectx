import { User } from '../users/user.entity';
import { Level } from './level.entity';
export declare class UserLevel {
    id: string;
    userId: string;
    user: User;
    currentLevelId: string;
    currentLevel: Level;
    nextLevelId: string | null;
    currentCapital: number;
    targetCapital: number;
    currentReferrals: number;
    targetReferrals: number;
    progressPercent: number;
    upgradedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
