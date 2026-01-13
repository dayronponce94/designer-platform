import { useState, useEffect, useCallback } from 'react';
import { paymentAPI } from '../api/endpoints';
import { Payment, PaymentSummary, PaymentMethod } from '@/app/types/payment';

interface UsePaymentsReturn {
    payments: Payment[];
    paymentMethods: PaymentMethod[];
    summary: PaymentSummary | null;
    loading: boolean;
    error: string | null;
    fetchPayments: () => Promise<void>;
    fetchPaymentMethods: () => Promise<void>;
    fetchSummary: () => Promise<void>;
    createPaymentIntent: (amount: number, projectId?: string) => Promise<any>;
}

export function usePayments(): UsePaymentsReturn {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [summary, setSummary] = useState<PaymentSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPayments = useCallback(async () => {
        try {
            setLoading(true);
            const response = await paymentAPI.getPayments();
            setPayments((response.data?.data?.payments ?? []) as Payment[]);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Error al cargar pagos');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchPaymentMethods = useCallback(async () => {
        try {
            const response = await paymentAPI.getPaymentMethods();
            setPaymentMethods(response.data.data as PaymentMethod[]);
        } catch (err: any) {
            console.error('Error al cargar métodos de pago:', err);
        }
    }, []);

    const fetchSummary = useCallback(async () => {
        try {
            const response = await paymentAPI.getPaymentSummary();
            setSummary(response.data.data);
        } catch (err: any) {
            console.error('Error al cargar resumen de pagos:', err);
        }
    }, []);

    const createPaymentIntent = useCallback(async (amount: number, projectId?: string) => {
        try {
            const response = await paymentAPI.createPaymentIntent(amount, projectId);
            return response.data.data;
        } catch (err: any) {
            throw new Error(err.message || 'Error al crear intención de pago');
        }
    }, []);

    // Cargar datos iniciales
    useEffect(() => {
        const loadData = async () => {
            await Promise.all([
                fetchPayments(),
                fetchPaymentMethods(),
                fetchSummary()
            ]);
        };

        loadData();
    }, [fetchPayments, fetchPaymentMethods, fetchSummary]);

    return {
        payments,
        paymentMethods,
        summary,
        loading,
        error,
        fetchPayments,
        fetchPaymentMethods,
        fetchSummary,
        createPaymentIntent
    };
}