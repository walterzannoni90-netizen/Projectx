import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    getNotifications(userId: string, page?: number, limit?: number): Promise<{
        notifications: import("./notification.entity").Notification[];
        total: number;
        unreadCount: number;
        page: number;
        limit: number;
    }>;
    markAsRead(userId: string, id: string): Promise<import("typeorm").UpdateResult>;
    markAllAsRead(userId: string): Promise<import("typeorm").UpdateResult>;
    delete(userId: string, id: string): Promise<import("typeorm").DeleteResult>;
}
