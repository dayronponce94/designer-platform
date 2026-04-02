import { useState, useEffect, useCallback } from 'react';
import { projectAPI } from '../api/endpoints';

export interface Project {
    clientView: any;
    designerView: any;
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

export interface PaginationData {
    total: number;
    page: number;
    pages: number;
}

// 1. Actualizamos la interfaz para incluir stats
export interface ProjectStats {
    active: number;
    upcoming: number;
    overdue: number;
    noDeadline: number;
}

export function useProjects(filters?: { status?: string | string[], page?: number, limit?: number, search?: string }) {
    const [projects, setProjects] = useState<any[]>([]);
    const [pagination, setPagination] = useState<PaginationData>({ total: 0, page: 1, pages: 1 });
    // Nuevo estado para las estadísticas
    const [stats, setStats] = useState<ProjectStats>({ active: 0, upcoming: 0, overdue: 0, noDeadline: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProjects = useCallback(async () => {
        try {
            setLoading(true);
            const response = await projectAPI.getProjects(filters);

            // Extraemos projects, pagination y STATS
            const {
                projects: fetchedProjects,
                pagination: fetchedPagination,
                stats: fetchedStats
            } = response.data.data;

            setProjects(Array.isArray(fetchedProjects) ? fetchedProjects : []);

            if (fetchedPagination) setPagination(fetchedPagination);
            if (fetchedStats) setStats(fetchedStats); // Guardamos las estadísticas globales

            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al cargar proyectos');
        } finally {
            setLoading(false);
        }
    }, [JSON.stringify(filters)]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    return { projects, pagination, stats, loading, error, refetch: fetchProjects };
    //       ^ Añadimos stats al retorno
}