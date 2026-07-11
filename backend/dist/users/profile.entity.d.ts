import { User } from './user.entity';
export declare class Profile {
    id: string;
    userId: string;
    user: User;
    fullName: string;
    avatarUrl: string;
    bio: string;
    language: string;
    theme: string;
    notificationsEnabled: boolean;
    emailNotifications: boolean;
    pushNotifications: boolean;
    createdAt: Date;
    updatedAt: Date;
}
