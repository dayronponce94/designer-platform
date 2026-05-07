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
    // Crear PaymentIntent para una cotización
    createPaymentIntent: (quoteId: string) =>
        apiClient.post(`/payments/create-payment-intent/${quoteId}`),

    // Obtener pagos del usuario
    getPayments: (params?: any) =>
        apiClient.get('/payments/my-payments', { params }),

    // Obtener resumen
    getPaymentSummary: () =>
        apiClient.get('/payments/my-summary'),

    // Obtener métodos de pago
    getPaymentMethods: () =>
        apiClient.get('/payments/my-methods'),

    createConnectAccountLink: () =>
        apiClient.post('/payments/designer/create-connect-link'),

    // Consultar estado de la cuenta de Stripe
    getConnectAccountStatus: () =>
        apiClient.get('/payments/designer/account-status'),

    // Admin: obtener todos los pagos
    adminGetAllPayments: (params?: any) =>
        apiClient.get('/payments/admin/all', { params }),

    // Admin: estadísticas de plataforma
    adminGetPlatformStats: () =>
        apiClient.get('/payments/admin/platform-stats'),

    // Admin: pagar a diseñador
    adminPayDesigner: (designerQuoteId: string) =>
        apiClient.post(`/payments/admin/pay-designer/${designerQuoteId}`),

    // Admin: obtener proyectos pendientes de pago a diseñadores (NUEVO)
    adminGetPendingDesignerPayouts: () =>
        apiClient.get('/payments/admin/pending-designer-payouts'), // Ajusta la ruta a como la nombraste en el backend

    // Admin: obtener proyectos COMPLETADOS que han sido liquidados al diseñador 
    adminGetCompletedDesignerPayouts: () =>
        apiClient.get('/payments/admin/completed-payouts'),
};

export const projectAPI = {
    getProjects: (params?: any) => apiClient.get('/projects', { params }),
    getProjectById: (id: string) => apiClient.get(`/projects/${id}`),
    createProject: (data: any) => apiClient.post('/projects', data),
    updateProject: (id: string, data: any) => apiClient.put(`/projects/${id}`, data),
    deleteProject: (id: string) => apiClient.delete(`/projects/${id}`),
    addMessage: (id: string, data: any) => apiClient.post(`/projects/${id}/messages`, data),
    getDesignerDeadlines: (params?: any) => apiClient.get('/projects/designer/deadlines', { params }),
};

export const portfolioAPI = {
    getPortfolio: (params?: any) => apiClient.get('/portfolio', { params }),
    getMyPortfolio: (params?: any) => apiClient.get('/portfolio/my-portfolio', { params }),
    getPortfolioItem: (id: string) => apiClient.get(`/portfolio/${id}`),
    createPortfolioItem: (data: any) => apiClient.post('/portfolio', data),
    updatePortfolioItem: (id: string, data: any) => apiClient.put(`/portfolio/${id}`, data),
    deletePortfolioItem: (id: string) => apiClient.delete(`/portfolio/${id}`),
    uploadPortfolioImages: (formData: FormData) => apiClient.post('/portfolio/upload-images', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }),
};

export const adminAPI = {
    // Gestión de usuarios
    getAllUsers: (params?: any) => apiClient.get('/admin/users', { params }),
    getUserStats: () => apiClient.get('/admin/users/stats'),
    updateUser: (id: string, data: any) => apiClient.put(`/admin/users/${id}`, data),
    deleteUser: (id: string) => apiClient.delete(`/admin/users/${id}`),
    getUserById: (id: string) => apiClient.get(`/admin/users/${id}`),

    // Gestión de proyectos
    getAllProjects: (params?: any) => apiClient.get('/admin/projects', { params }),
    assignDesigner: (projectId: string, designerId: string) =>
        apiClient.put(`/admin/projects/${projectId}/assign`, { designerId }),
    updateProjectStatus: (projectId: string, status: string, reason?: string) =>
        apiClient.put(`/admin/projects/${projectId}/status`, { status, reason }),

    // Reportes
    getReports: (params?: any) => apiClient.get('/admin/reports', { params }),

    // Portafolio de diseñador
    getDesignerPortfolio: (designerId: string, params?: any) => apiClient.get(`/admin/designers/${designerId}/portfolio`, { params }),

    // Cotizaciones
    getAllQuotes: (params?: any) => apiClient.get('/admin/quotes', { params }),
    getQuoteById: (id: string) => apiClient.get(`/admin/quotes/${id}`),
    createDesignerQuote: (quoteId: string, data: any) => apiClient.post(`/admin/quotes/${quoteId}/designer-quote`, data),
    getAllDesignerQuotes: (params?: any) => apiClient.get('/admin/designer-quotes', { params }),

    // Gestión de solicitudes
    getAllRequests: (params?: any) => apiClient.get('/admin/requests', { params }),
    updateRequestStatus: (requestId: string, status: string, reason?: string) =>
        apiClient.put(`/admin/requests/${requestId}/status`, { status, reason }),
};

export const designerQuoteAPI = {
    getMyQuotes: (params?: any) => apiClient.get('/designer/quotes', { params }),
    getQuoteById: (id: string) => apiClient.get(`/designer/quotes/${id}`),
    acceptQuote: (id: string, notes?: string) => apiClient.post(`/designer/quotes/${id}/accept`, { designerNotes: notes }),
    rejectQuote: (id: string, notes?: string) => apiClient.post(`/designer/quotes/${id}/reject`, { designerNotes: notes }),
};

export const requestAPI = {
    getRequests: (params?: any) => apiClient.get('/requests', { params }),
    getRequestById: (id: string) => apiClient.get(`/requests/${id}`),
    createRequest: (data: any) => apiClient.post('/requests', data),
    updateRequest: (id: string, data: any) => apiClient.put(`/requests/${id}`, data),
    deleteRequest: (id: string) => apiClient.delete(`/requests/${id}`),
};