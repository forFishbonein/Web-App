package com.gym.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.gym.entity.Notification;

public interface NotificationService extends IService<Notification> {
    /**
     * Send a notification and persist the notification record
     *
     * @param notification Notification entity
     */
    void sendNotification(Notification notification);

    /**
     * Paginate and query notifications for a specific user
     *
     * @param userId   User ID
     * @param page     Page number
     * @param pageSize Number of items per page
     * @return Paginated notification data
     */
    Page<Notification> getNotificationsByUser(Long userId, int page, int pageSize);

    /**
     * Mark a specific notification as read
     *
     * @param notificationId Notification ID
     * @param userId         Current user ID
     */
    void markAsRead(Long notificationId, Long userId);

    /**
     * Delete a specific notification, provided it has been marked as read
     *
     * @param notificationId Notification ID
     * @param userId         Current user ID
     */
    void deleteNotification(Long notificationId, Long userId);
}

