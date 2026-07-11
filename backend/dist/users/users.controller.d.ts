import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(userId: string): Promise<import("./user.entity").User>;
    updateProfile(userId: string, data: any): Promise<import("./profile.entity").Profile>;
    getSessions(userId: string): Promise<import("typeorm").ObjectLiteral[]>;
    getDashboard(userId: string): Promise<{
        totalBalance: number;
        operatingCapital: number;
        availableBalance: number;
        dailyEarnings: number;
        totalEarnings: number;
        currentLevel: string | null;
        levelProgress: number;
        activeReferrals: number;
        nextQuantizationAt: any;
        lastTransactions: import("typeorm").ObjectLiteral[];
    }>;
}
