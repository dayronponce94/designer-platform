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
    createPaymentIntent: (quoteId: string) => Promise<any>;
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
            setPayments(response.data.data.payments);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al cargar pagos');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchPaymentMethods = useCallback(async () => {
        try {
            const response = await paymentAPI.getPaymentMethods();
            setPaymentMethods(response.data.data);
        } catch (err: any) {
            console.error('Error al cargar métodos de pago:', err);
        }
    }, []);

    const fetchSummary = useCallback(async () => {
        try {
            const response = await paymentAPI.getPaymentSummary();
            setSummary(response.data.data);
        } catch (err: any) {
            console.error('Error al cargar resumen:', err);
        }
    }, []);

    const createPaymentIntent = useCallback(async (quoteId: string) => {
        try {
            const response = await paymentAPI.createPaymentIntent(quoteId);
            return response.data.data; // { clientSecret, paymentId }
        } catch (err: any) {
            throw new Error(err.response?.data?.message || 'Error al iniciar pago');
        }
    }, []);

    useEffect(() => {
        fetchPayments();
        fetchPaymentMethods();
        fetchSummary();
    }, []);

    return {
        payments,
        paymentMethods,
        summary,
        loading,
        error,
        fetchPayments,
        fetchPaymentMethods,
        fetchSummary,
        createPaymentIntent,
    };
}