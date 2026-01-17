import { useState, useEffect, useCallback } from 'react';
import { projectAPI } from '../api/endpoints';
import { Project } from './useProjects';


export interface DeadlineProject extends Project {
    daysUntilDeadline?: number;
    isOverdue?: boolean;
    isUrgent?: boolean;
}

export interface DeadlineStats {
    upcoming: number;
    urgent: number;
    completed: number;
    overdue: number;
    total: number;
}

export function useDeadlines(filters?: { timeframe?: string; status?: string }) {
    const [projects, setProjects] = useState<DeadlineProject[]>([]);
    const [stats, setStats] = useState<DeadlineStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDeadlines = useCallback(async () => {
        try {
            setLoading(true);
            const params: any = {};
            if (filters?.timeframe) params.timeframe = filters.timeframe;
            if (filters?.status) params.status = filters.status;

            const response = await projectAPI.getDesignerDeadlines(params);

            // Procesar proyectos para agregar metadatos de plazos
            const rawProjects: Project[] = response.data.data.projects || [];
            const processedProjects: DeadlineProject[] = rawProjects.map(project => {
                const deadlineDate = project.deadline ? new Date(project.deadline) : null;
                const now = new Date();

                let daysUntilDeadline: number | undefined;
                let isOverdue = false;
                let isUrgent = false;

                if (deadlineDate) {
                    const diffTime = deadlineDate.getTime() - now.getTime();
                    daysUntilDeadline = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    isOverdue = daysUntilDeadline < 0 && project.status !== 'completed';
                    isUrgent = daysUntilDeadline >= 0 && daysUntilDeadline <= 2 && project.status !== 'completed';
                }

                return {
                    ...project,
                    daysUntilDeadline,
                    isOverdue,
                    isUrgent
                };
            });

            // Ordenar por urgencia: primero vencidos, luego urgentes, luego por fecha
            processedProjects.sort((a, b) => {
                if (a.isOverdue && !b.isOverdue) return -1;
                if (!a.isOverdue && b.isOverdue) return 1;
                if (a.isUrgent && !b.isUrgent) return -1;
                if (!a.isUrgent && b.isUrgent) return 1;

                const deadlineA = a.deadline ? new Date(a.deadline).getTime() : Infinity;
                const deadlineB = b.deadline ? new Date(b.deadline).getTime() : Infinity;
                return deadlineA - deadlineB;
            });

            setProjects(processedProjects);
            setStats(response.data.data.stats || null);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al cargar los plazos');
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchDeadlines();
    }, [fetchDeadlines]);

    return { projects, stats, loading, error, refetch: fetchDeadlines };
}