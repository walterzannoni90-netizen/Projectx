import { Repository } from 'typeorm';
import { Notification, NotificationType } from './notification.entity';
export declare class NotificationsService {
    private notificationRepository;
    constructor(notificationRepository: Repository<Notification>);
    getUserNotifications(userId: string, page?: number, limit?: number): Promise<{
        notifications: Notification[];
        total: number;
        unreadCount: number;
        page: number;
        limit: number;
    }>;
    markAsRead(notificationId: string, userId: string): Promise<import("typeorm").UpdateResult>;
    markAllAsRead(userId: string): Promise<import("typeorm").UpdateResult>;
    create(data: {
        userId: string;
        type: NotificationType;
        title: string;
        body?: string;
        data?: any;
    }): Promise<Notification>;
    delete(notificationId: string, userId: string): Promise<import("typeorm").DeleteResult>;
}
