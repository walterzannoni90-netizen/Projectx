import { Repository } from 'typeorm';
import { Level } from './level.entity';
import { UserLevel } from './user-level.entity';
export declare class LevelsService {
    private levelRepository;
    private userLevelRepository;
    constructor(levelRepository: Repository<Level>, userLevelRepository: Repository<UserLevel>);
    getAllLevels(): Promise<Level[]>;
    getUserLevel(userId: string): Promise<{
        current: Level;
        next: Level | null;
        progress: {
            capital: {
                current: number;
                target: number;
            };
            referrals: {
                current: number;
                target: number;
            };
            percent: number;
        };
        upgradedAt: Date;
    } | null>;
    checkUpgrade(userId: string): Promise<{
        canUpgrade: boolean;
        requirements?: undefined;
    } | {
        canUpgrade: boolean;
        requirements: {
            capital: {
                current: number;
                needed: number;
            };
            referrals: {
                current: number;
                needed: number;
            };
            accountDays: {
                current: number;
                needed: number;
            };
        };
    }>;
    performUpgrade(userId: string): Promise<UserLevel>;
}
