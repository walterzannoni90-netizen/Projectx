import { LevelsService } from './levels.service';
export declare class LevelsController {
    private readonly levelsService;
    constructor(levelsService: LevelsService);
    getAll(): Promise<import("./level.entity").Level[]>;
    getMyLevel(userId: string): Promise<{
        current: import("./level.entity").Level;
        next: import("./level.entity").Level | null;
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
    upgrade(userId: string): Promise<import("./user-level.entity").UserLevel>;
}
