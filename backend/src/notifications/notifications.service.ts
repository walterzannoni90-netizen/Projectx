import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from './notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification) private notificationRepository: Repository<Notification>,
  ) {}

  async getUserNotifications(userId: string, page = 1, limit = 20) {
    const [notifications, total] = await this.notificationRepository.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const unreadCount = await this.notificationRepository.count({
      where: { userId, isRead: false },
    });

    return { notifications, total, unreadCount, page, limit };
  }

  async markAsRead(notificationId: string, userId: string) {
    return this.notificationRepository.update(
      { id: notificationId, userId },
      { isRead: true, readAt: new Date() },
    );
  }

  async markAllAsRead(userId: string) {
    return this.notificationRepository.update(
      { userId, isRead: false },
      { isRead: true, readAt: new Date() },
    );
  }

  async create(data: {
    userId: string;
    type: NotificationType;
    title: string;
    body?: string;
    data?: any;
  }) {
    const notification = this.notificationRepository.create(data);
    return this.notificationRepository.save(notification);
  }

  async delete(notificationId: string, userId: string) {
    return this.notificationRepository.delete({ id: notificationId, userId });
  }
}
