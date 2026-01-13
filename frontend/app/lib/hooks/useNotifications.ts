import { useState, useEffect, useCallback } from 'react';
import { notificationAPI } from '../api/endpoints';

export interface Notification {
    _id: string;
    userId: string;
    type: string;
    title: string;
    message: string;
    read: boolean;
    data: Record<string, any>;
    projectId?: {
        _id: string;
        title: string;
    };
    relatedUserId?: {
        _id: string;
        name: string;
        email: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface NotificationsResponse {
    notifications: Notification[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
    unreadCount: number;
}

export function useNotifications(pollingInterval = 30000) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        pages: 0
    });

    const fetchNotifications = useCallback(async (page = 1, limit = 20, unreadOnly = false) => {
        try {
            setLoading(true);
            const response = await notificationAPI.getNotifications({
                page,
                limit,
                unreadOnly: unreadOnly ? 'true' : 'false'
            });

            const data: NotificationsResponse = response.data.data ?? response.data;
            setNotifications(data?.notifications ?? []);
            setUnreadCount(data?.unreadCount ?? 0);
            setPagination(data?.pagination ?? { page: 1, limit: 20, total: 0, pages: 0 });
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al cargar notificaciones');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchUnreadCount = useCallback(async () => {
        try {
            const response = await notificationAPI.getUnreadCount();
            const unread = response?.data?.data?.unreadCount
                ?? response?.data?.unreadCount
                ?? 0; // fallback seguro
            setUnreadCount(unread);
        } catch (err) {
            console.error('Error al obtener contador de no leídas:', err);
            setUnreadCount(0); // fallback para evitar crash
        }
    }, []);

    const markAsRead = async (id: string) => {
        try {
            await notificationAPI.markAsRead(id);
            setNotifications(prev =>
                prev.map(notification =>
                    notification._id === id ? { ...notification, read: true } : notification
                )
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err: any) {
            console.error('Error al marcar como leída:', err);
            throw err;
        }
    };

    const markAllAsRead = async () => {
        try {
            await notificationAPI.markAllAsRead();
            setNotifications(prev =>
                prev.map(notification => ({ ...notification, read: true }))
            );
            setUnreadCount(0);
        } catch (err: any) {
            console.error('Error al marcar todas como leídas:', err);
            throw err;
        }
    };

    const deleteNotification = async (id: string) => {
        try {
            await notificationAPI.deleteNotification(id);
            const deletedNotification = notifications.find(n => n._id === id);
            setNotifications(prev => prev.filter(notification => notification._id !== id));

            if (deletedNotification && !deletedNotification.read) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (err: any) {
            console.error('Error al eliminar notificación:', err);
            throw err;
        }
    };

    const deleteAllRead = async () => {
        try {
            await notificationAPI.deleteAllRead();
            setNotifications(prev => prev.filter(notification => !notification.read));
        } catch (err: any) {
            console.error('Error al eliminar notificaciones leídas:', err);
            throw err;
        }
    };

    // Polling para actualizar contador de no leídas
    useEffect(() => {
        fetchUnreadCount();

        const interval = setInterval(fetchUnreadCount, pollingInterval);
        return () => clearInterval(interval);
    }, [fetchUnreadCount, pollingInterval]);

    return {
        notifications,
        unreadCount,
        loading,
        error,
        pagination,
        fetchNotifications,
        fetchUnreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        deleteAllRead
    };
}