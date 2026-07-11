import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Profile } from './profile.entity';
export declare class UsersService {
    private userRepository;
    private profileRepository;
    constructor(userRepository: Repository<User>, profileRepository: Repository<Profile>);
    findById(id: string): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    updateProfile(userId: string, data: Partial<Profile>): Promise<Profile>;
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
