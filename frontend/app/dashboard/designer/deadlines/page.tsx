'use client';

import { useMemo, useState } from 'react';
import { useDeadlines } from '@/app/lib/hooks/useDeadlines';
import { FiCalendar, FiClock, FiAlertCircle, FiCheckCircle, FiBriefcase, FiFilter, FiChevronRight } from 'react-icons/fi';
import { format, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';

export default function DesignerDeadlinesPage() {
    const [timeframeFilter, setTimeframeFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('active');

    const filters = useMemo(() => ({
        timeframe: timeframeFilter !== 'all' ? timeframeFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined
    }), [timeframeFilter, statusFilter]);

    const { projects, stats, loading, error, refetch } = useDeadlines(filters);

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Sin fecha definida';
        try {
            const date = new Date(dateString);
            return format(date, "EEE dd 'de' MMMM, yyyy", { locale: es });
        } catch (error) {
            return 'Fecha inválida';
        }
    };

    const formatTime = (dateString?: string) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return format(date, "hh:mm a", { locale: es });
        } catch (error) {
            return '';
        }
    };

    const getDaysText = (project: any) => {
        if (!project.deadline || project.status === 'completed') return '';

        const deadline = new Date(project.deadline);
        const now = new Date();
        const days = differenceInDays(deadline, now);

        if (days < 0) {
            return `Vencido hace ${Math.abs(days)} ${Math.abs(days) === 1 ? 'día' : 'días'}`;
        } else if (days === 0) {
            return 'Vence hoy';
        } else if (days === 1) {
            return 'Vence mañana';
        } else {
            return `Vence en ${days} días`;
        }
    };

    const getStatusColor = (project: any) => {
        if (project.status === 'completed') return 'bg-green-100 text-green-800';
        if (project.isOverdue) return 'bg-red-100 text-red-800';
        if (project.isUrgent) return 'bg-yellow-100 text-yellow-800';
        if (project.daysUntilDeadline && project.daysUntilDeadline <= 7) return 'bg-blue-100 text-blue-800';
        return 'bg-gray-100 text-gray-800';
    };

    const getStatusIcon = (project: any) => {
        if (project.status === 'completed') return FiCheckCircle;
        if (project.isOverdue) return FiAlertCircle;
        if (project.isUrgent) return FiAlertCircle;
        if (project.daysUntilDeadline && project.daysUntilDeadline <= 7) return FiClock;
        return FiCalendar;
    };

    const getServiceTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            'branding': 'Diseño de Marca',
            'ux-ui': 'Diseño UX/UI',
            'graphic': 'Diseño Gráfico',
            'web': 'Diseño Web',
            'motion': 'Animación Gráfica',
            'illustration': 'Ilustración',
            'other': 'Otro'
        };
        return labels[type] || type;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-96">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando plazos...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <div className="flex items-center">
                    <FiAlertCircle className="mr-2" />
                    <p>{error}</p>
                </div>
                <button
                    onClick={() => refetch()}
                    className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">
                            <FiCalendar className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Mis Plazos</h1>
                            <p className="text-gray-600 mt-1">
                                Fechas de entrega de proyectos asignados
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Estadísticas */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center">
                            <FiClock className="w-8 h-8 text-blue-600 mr-3" />
                            <div>
                                <div className="font-medium text-gray-900">Próximos</div>
                                <div className="text-2xl font-bold text-gray-900">{stats.upcoming}</div>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg">
                        <div className="flex items-center">
                            <FiAlertCircle className="w-8 h-8 text-yellow-600 mr-3" />
                            <div>
                                <div className="font-medium text-gray-900">Urgentes</div>
                                <div className="text-2xl font-bold text-gray-900">{stats.urgent}</div>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center">
                            <FiCheckCircle className="w-8 h-8 text-green-600 mr-3" />
                            <div>
                                <div className="font-medium text-gray-900">Completados</div>
                                <div className="text-2xl font-bold text-gray-900">{stats.completed}</div>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                            <FiCalendar className="w-8 h-8 text-gray-600 mr-3" />
                            <div>
                                <div className="font-medium text-gray-900">Total</div>
                                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Filtros */}
            <div className="bg-white rounded-xl shadow p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center">
                        <FiFilter className="text-gray-400 mr-2" />
                        <span className="text-gray-600 mr-3">Filtrar por:</span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <select
                            value={timeframeFilter}
                            onChange={(e) => setTimeframeFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">Todos los períodos</option>
                            <option value="today">Hoy</option>
                            <option value="week">Esta semana</option>
                            <option value="month">Este mes</option>
                            <option value="overdue">Vencidos</option>
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">Todos los estados</option>
                            <option value="active">Activos</option>
                            <option value="in-progress">En progreso</option>
                            <option value="review">En revisión</option>
                            <option value="completed">Completados</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Lista de proyectos con plazos */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
                {projects.length === 0 ? (
                    <div className="text-center py-12">
                        <FiCalendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-900 mb-2">
                            No hay plazos próximos
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Aquí aparecerán las fechas de entrega de tus proyectos asignados.
                        </p>
                        <Link
                            href="/dashboard/designer/projects"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            <FiBriefcase className="mr-2" />
                            Ver proyectos asignados
                        </Link>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {projects.map((project) => {
                            const StatusIcon = getStatusIcon(project);
                            const statusColor = getStatusColor(project);
                            const daysText = getDaysText(project);

                            return (
                                <div key={project._id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                                        {/* Información del proyecto */}
                                        <div className="flex-1">
                                            <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
                                                <div className="mb-3 md:mb-0">
                                                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                                                        {project.title}
                                                    </h3>
                                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
                                                            <StatusIcon className="w-3 h-3 mr-1" />
                                                            {project.status === 'completed' ? 'Completado' :
                                                                project.isOverdue ? 'Vencido' :
                                                                    project.isUrgent ? 'Urgente' : 'Próximo'}
                                                        </span>
                                                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                                            {getServiceTypeLabel(project.serviceType)}
                                                        </span>
                                                        {project.budget > 0 && (
                                                            <span className="text-sm font-medium text-gray-900 bg-blue-50 px-3 py-1 rounded-full">
                                                                ${project.budget.toLocaleString()}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Fecha de entrega */}
                                                <div className="text-right">
                                                    <div className="flex flex-col md:items-end">
                                                        <div className="text-sm text-gray-500 mb-1">Fecha límite</div>
                                                        <div className={`text-lg font-bold ${project.isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                                                            {formatDate(project.deadline)}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {formatTime(project.deadline)}
                                                        </div>
                                                        {daysText && (
                                                            <div className={`text-sm font-medium mt-1 ${project.isOverdue ? 'text-red-600' : project.isUrgent ? 'text-yellow-600' : 'text-gray-600'}`}>
                                                                {daysText}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="text-gray-600 mb-4 line-clamp-2">
                                                {project.description}
                                            </p>

                                            <div className="flex flex-col md:flex-row md:items-center justify-between">
                                                <div className="mb-3 md:mb-0">
                                                    <div className="flex items-center text-gray-500">
                                                        <span>Cliente: </span>
                                                        <span className="font-medium ml-1">
                                                            {typeof project.client === 'object' ? project.client.name : 'Cliente'}
                                                        </span>
                                                        {typeof project.client === 'object' && project.client.company && (
                                                            <span className="text-gray-400 ml-2">
                                                                ({project.client.company})
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-3">
                                                    <Link
                                                        href={`/dashboard/projects/${project._id}`}
                                                        className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                                                    >
                                                        Ver detalles del proyecto
                                                        <FiChevronRight className="ml-1" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Guía de colores y estados */}
            <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl shadow p-6">
                <div className="flex items-start">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg mr-4">
                        <FiCalendar className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 mb-3">
                            Interpretación de plazos
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-white p-4 rounded-lg">
                                <div className="flex items-center mb-2">
                                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                                    <h4 className="font-medium text-gray-900">Vencido</h4>
                                </div>
                                <p className="text-sm text-gray-600">
                                    La fecha límite ya pasó y el proyecto no está completado
                                </p>
                            </div>
                            <div className="bg-white p-4 rounded-lg">
                                <div className="flex items-center mb-2">
                                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                                    <h4 className="font-medium text-gray-900">Urgente</h4>
                                </div>
                                <p className="text-sm text-gray-600">
                                    Vence en los próximos 2 días. ¡Prioridad máxima!
                                </p>
                            </div>
                            <div className="bg-white p-4 rounded-lg">
                                <div className="flex items-center mb-2">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                                    <h4 className="font-medium text-gray-900">Próximo</h4>
                                </div>
                                <p className="text-sm text-gray-600">
                                    Vence en los próximos 7 días. Planifica tu trabajo
                                </p>
                            </div>
                            <div className="bg-white p-4 rounded-lg">
                                <div className="flex items-center mb-2">
                                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                    <h4 className="font-medium text-gray-900">Completado</h4>
                                </div>
                                <p className="text-sm text-gray-600">
                                    Proyecto entregado y aprobado por el cliente
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}