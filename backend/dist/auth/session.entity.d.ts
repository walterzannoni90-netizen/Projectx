import { User } from '../users/user.entity';
export declare class Session {
    id: string;
    userId: string;
    user: User;
    refreshToken: string;
    userAgent: string;
    ipAddress: string;
    deviceName: string;
    isActive: boolean;
    lastActivityAt: Date;
    expiresAt: Date;
    createdAt: Date;
}
