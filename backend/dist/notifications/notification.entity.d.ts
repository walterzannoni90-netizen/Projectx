import { User } from '../users/user.entity';
export declare enum NotificationType {
    DEPOSIT = "deposit",
    WITHDRAWAL = "withdrawal",
    REFERRAL = "referral",
    LEVEL_UP = "level_up",
    QUANTIZATION = "quantization",
    ADMIN_MESSAGE = "admin_message",
    SYSTEM_UPDATE = "system_update"
}
export declare class Notification {
    id: string;
    userId: string;
    user: User;
    type: NotificationType;
    title: string;
    body: string;
    data: any;
    isRead: boolean;
    readAt: Date;
    createdAt: Date;
}
