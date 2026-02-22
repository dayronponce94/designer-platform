import { useState, useEffect, useCallback } from 'react';
import { requestAPI } from '../api/endpoints';
import { Request } from '@/app/types/request';

export function useRequests(filters?: { status?: string | string[] }) {
    const [requests, setRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRequests = useCallback(async () => {
        try {
            setLoading(true);
            const params: any = {};
            if (filters?.status) {
                params.status = filters.status;
            }
            const response = await requestAPI.getRequests(params);
            setRequests(Array.isArray(response.data.data.requests) ? response.data.data.requests : []);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al cargar solicitudes');
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    return { requests, loading, error, refetch: fetchRequests };
}