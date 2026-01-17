import { useState, useEffect, useCallback } from 'react';
import { projectAPI } from '../api/endpoints';

export interface Project {
    _id: string;
    title: string;
    description: string;
    client: string | { _id: string; name: string; email: string; company?: string; };
    designer?: string | { _id: string; name: string; email: string };
    serviceType: string;
    status: 'requested' | 'quoted' | 'approved' | 'in-progress' | 'review' | 'completed' | 'cancelled';
    attachments: Array<{
        url: string;
        filename: string;
        filetype: string;
        size: number;
        uploadedAt: string;
    }>;
    budget: number;
    deadline?: string;
    messages: Array<{
        sender: string | { _id: string; name: string };
        message: string;
        attachments: Array<{ url: string; filename: string }>;
        sentAt: string;
    }>;
    createdAt: string;
    updatedAt: string;
}

export function useProjects(filters?: { status?: string | string[] }) {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProjects = useCallback(async () => {
        try {
            setLoading(true);
            const params: any = {};
            if (filters?.status) {
                params.status = filters.status;
            }
            const response = await projectAPI.getProjects(params);
            setProjects(Array.isArray(response.data.data.projects) ? response.data.data.projects : []);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al cargar proyectos');
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    return { projects, loading, error, refetch: fetchProjects };
}