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