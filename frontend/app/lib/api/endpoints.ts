import apiClient from './client';

export const authAPI = {
    register: (data: any) => apiClient.post('/auth/register', data),
    login: (data: any) => apiClient.post('/auth/login', data),
    logout: () => apiClient.get('/auth/logout'),
    getMe: () => apiClient.get('/auth/me'),
};

export const userAPI = {
    getUsers: () => apiClient.get('/users'),
    getUserById: (id: string) => apiClient.get(`/users/${id}`),
    updateUser: (id: string, data: any) => apiClient.put(`/users/${id}`, data),
    getDesigners: () => apiClient.get('/users/designers'),
};

export const notificationAPI = {
    getNotifications: (params?: any) => apiClient.get('/notifications', { params }),
    markAsRead: (id: string) => apiClient.patch(`/notifications/${id}/read`),
    markAllAsRead: () => apiClient.patch('/notifications/mark-all-read'),
    deleteNotification: (id: string) => apiClient.delete(`/notifications/${id}`),
    deleteAllRead: () => apiClient.delete('/notifications/read'),
    getUnreadCount: () => apiClient.get('/notifications/unread-count'),
};