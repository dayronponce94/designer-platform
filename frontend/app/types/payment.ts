export interface Payment {
    _id: string;
    userId: string;
    projectId: {
        _id: string;
        title: string;
    };
    amount: number;
    currency: string;
    status: 'pending' | 'completed' | 'failed' | 'refunded' | 'processing';
    type: 'project_payment' | 'subscription' | 'commission' | 'refund';
    description: string;
    stripePaymentId?: string;
    invoiceUrl?: string;
    receiptUrl?: string;
    dueDate?: string;
    paidAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface PaymentSummary {
    totalPaid: number;
    pendingAmount: number;
    upcomingPayments: number;
    lastPaymentDate?: string;
    paymentStats: {
        month: string;
        total: number;
    }[];
}

export interface PaymentMethod {
    id: string;
    type: 'card' | 'bank_transfer';
    last4?: string;
    brand?: string;
    expiryMonth?: number;
    expiryYear?: number;
    isDefault: boolean;
}