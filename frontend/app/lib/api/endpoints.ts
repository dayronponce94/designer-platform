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

export const paymentAPI = {
    // Datos simulados - luego se conectará a API real
    getPayments: (params?: any) => Promise.resolve({
        data: {
            success: true,
            data: {
                payments: getMockPayments(),
                summary: getMockPaymentSummary(),
                pagination: {
                    page: 1,
                    limit: 10,
                    total: 8,
                    pages: 1
                }
            }
        }
    }),

    getPaymentById: (id: string) => Promise.resolve({
        data: {
            success: true,
            data: getMockPayments().find(p => p._id === id)
        }
    }),

    getPaymentMethods: () => Promise.resolve({
        data: {
            success: true,
            data: getMockPaymentMethods()
        }
    }),

    createPaymentIntent: (amount: number, projectId?: string) => Promise.resolve({
        data: {
            success: true,
            data: {
                clientSecret: 'pi_mock_secret_' + Date.now(),
                paymentIntentId: 'pi_mock_' + Date.now(),
                amount: amount
            }
        }
    }),

    getPaymentSummary: () => Promise.resolve({
        data: {
            success: true,
            data: getMockPaymentSummary()
        }
    })
};

// Datos de ejemplo para desarrollo
function getMockPayments() {
    const projects = [
        { _id: '1', title: 'Logo para Startup Tech' },
        { _id: '2', title: 'Rediseño App Móvil' },
        { _id: '3', title: 'Branding Corporativo' },
        { _id: '4', title: 'Diseño Web E-commerce' },
        { _id: '5', title: 'Ilustraciones para App' }
    ];

    return [
        {
            _id: 'pay_001',
            userId: 'user_001',
            projectId: projects[0],
            amount: 1500,
            currency: 'USD',
            status: 'completed',
            type: 'project_payment',
            description: 'Pago inicial proyecto Logo',
            stripePaymentId: 'pi_mock_001',
            invoiceUrl: '#',
            receiptUrl: '#',
            paidAt: '2024-01-15T10:30:00Z',
            createdAt: '2024-01-10T09:00:00Z',
            updatedAt: '2024-01-15T10:30:00Z'
        },
        {
            _id: 'pay_002',
            userId: 'user_001',
            projectId: projects[0],
            amount: 1500,
            currency: 'USD',
            status: 'completed',
            type: 'project_payment',
            description: 'Pago final proyecto Logo',
            stripePaymentId: 'pi_mock_002',
            invoiceUrl: '#',
            receiptUrl: '#',
            paidAt: '2024-02-01T14:45:00Z',
            createdAt: '2024-01-25T11:00:00Z',
            updatedAt: '2024-02-01T14:45:00Z'
        },
        {
            _id: 'pay_003',
            userId: 'user_001',
            projectId: projects[1],
            amount: 2500,
            currency: 'USD',
            status: 'pending',
            type: 'project_payment',
            description: 'Depósito proyecto Rediseño App',
            dueDate: '2024-03-10T23:59:59Z',
            createdAt: '2024-02-20T09:30:00Z',
            updatedAt: '2024-02-20T09:30:00Z'
        },
        {
            _id: 'pay_004',
            userId: 'user_001',
            projectId: projects[1],
            amount: 3750,
            currency: 'USD',
            status: 'processing',
            type: 'project_payment',
            description: 'Segundo pago proyecto Rediseño',
            stripePaymentId: 'pi_mock_003',
            createdAt: '2024-02-28T16:20:00Z',
            updatedAt: '2024-02-28T16:20:00Z'
        },
        {
            _id: 'pay_005',
            userId: 'user_001',
            projectId: projects[2],
            amount: 5000,
            currency: 'USD',
            status: 'completed',
            type: 'project_payment',
            description: 'Pago único Branding',
            stripePaymentId: 'pi_mock_004',
            invoiceUrl: '#',
            receiptUrl: '#',
            paidAt: '2024-01-30T11:15:00Z',
            createdAt: '2024-01-28T10:00:00Z',
            updatedAt: '2024-01-30T11:15:00Z'
        },
        {
            _id: 'pay_006',
            userId: 'user_001',
            projectId: projects[3],
            amount: 3200,
            currency: 'USD',
            status: 'failed',
            type: 'project_payment',
            description: 'Pago Web E-commerce',
            createdAt: '2024-02-15T14:00:00Z',
            updatedAt: '2024-02-15T14:30:00Z'
        },
        {
            _id: 'pay_007',
            userId: 'user_001',
            projectId: projects[4],
            amount: 1800,
            currency: 'USD',
            status: 'pending',
            type: 'project_payment',
            description: 'Anticipo Ilustraciones',
            dueDate: '2024-03-05T23:59:59Z',
            createdAt: '2024-02-25T09:00:00Z',
            updatedAt: '2024-02-25T09:00:00Z'
        },
        {
            _id: 'pay_008',
            userId: 'user_001',
            amount: 120,
            currency: 'USD',
            status: 'completed',
            type: 'commission',
            description: 'Comisión plataforma',
            stripePaymentId: 'pi_mock_005',
            invoiceUrl: '#',
            paidAt: '2024-02-28T12:00:00Z',
            createdAt: '2024-02-28T12:00:00Z',
            updatedAt: '2024-02-28T12:00:00Z'
        }
    ];
}

function getMockPaymentSummary() {
    return {
        totalPaid: 10120,
        pendingAmount: 6950,
        upcomingPayments: 2,
        lastPaymentDate: '2024-02-28T12:00:00Z',
        paymentStats: [
            { month: 'Ene 2024', total: 6500 },
            { month: 'Feb 2024', total: 3620 },
            { month: 'Mar 2024', total: 0 },
            { month: 'Abr 2024', total: 0 }
        ]
    };
}

function getMockPaymentMethods() {
    return [
        {
            id: 'pm_001',
            type: 'card',
            last4: '4242',
            brand: 'visa',
            expiryMonth: 12,
            expiryYear: 2025,
            isDefault: true
        },
        {
            id: 'pm_002',
            type: 'card',
            last4: '5555',
            brand: 'mastercard',
            expiryMonth: 6,
            expiryYear: 2024,
            isDefault: false
        }
    ];
}