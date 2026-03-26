'use client';

import { useEffect, useMemo, useState } from 'react';
import { useDeadlines } from '@/app/lib/hooks/useDeadlines';
import { FiCalendar, FiClock, FiAlertCircle, FiCheckCircle, FiBriefcase, FiFilter, FiChevronRight } from 'react-icons/fi';
import { format, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';

export interface LocalProject {
    _id: string;
    title: string;
    serviceType: string;
    status: string;
    description?: string;
    client?: {
        _id: string;
        name: string;
        company?: string;
    };
    clientView?: {
        description?: string;
        clientName?: string;
    };
    designerView?: {
        description?: string;
        earnings?: number;
        internalDeadline?: string;
    };
    deadline?: string;
    budget: number;
    // Campos del hook
    isOverdue?: boolean;
    isUrgent?: boolean;
    daysUntilDeadline?: number;
}

export default function DesignerDeadlinesPage() {
    // 1. Primero los estados de los selectores
    const [timeframeFilter, setTimeframeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const projectsPerPage = 5;

    // 2. Definimos el objeto 'filters' que necesita el Hook
    const filters = useMemo(() => ({
        timeframe: timeframeFilter !== 'all' ? timeframeFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined
    }), [timeframeFilter, statusFilter]);


    const { projects, stats, loading, error, refetch } = useDeadlines(filters);

    // 4. Finalmente, procesamos los proyectos que el Hook nos devolvió
    const filteredProjects = useMemo(() => {
        return projects.filter((project: any) => {
            const p = project as LocalProject;

            // En page.tsx, dentro del filter de filteredProjects:

            // Lógica de Filtro de Tiempo corregida
            let matchesTimeframe = true;

            if (timeframeFilter === 'today') {
                matchesTimeframe = p.daysUntilDeadline === 0;
            } else if (timeframeFilter === 'week') {
                // Definimos "Semana" como: venció hace hasta 7 días O vence en los próximos 7 días
                // Esto asegura que tu proyecto de ayer ( -1 ) aparezca.
                matchesTimeframe = !!(
                    p.daysUntilDeadline !== undefined &&
                    p.daysUntilDeadline >= -7 && // <--- Permitimos que haya vencido hace poco
                    p.daysUntilDeadline <= 7
                );
            } else if (timeframeFilter === 'month') {
                matchesTimeframe = !!(p.daysUntilDeadline !== undefined && p.daysUntilDeadline <= 30);
            } else if (timeframeFilter === 'overdue') {
                matchesTimeframe = p.isOverdue === true;
            }

            let matchesStatus = true;
            if (statusFilter === 'active') {
                // Incluimos los estados de trabajo real
                matchesStatus = ['approved', 'in-progress', 'review'].includes(p.status);
            } else if (statusFilter !== 'all') {
                // Si es 'completed', 'approved', etc., comparamos directo
                matchesStatus = p.status === statusFilter;
            }
            // Si statusFilter es 'all', matchesStatus se queda en true.

            return matchesTimeframe && matchesStatus;
        });
    }, [projects, timeframeFilter, statusFilter]);

    // 5. Paginación basada en el resultado filtrado
    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
    const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

    // Resetear página cuando cambien los filtros
    useEffect(() => {
        setCurrentPage(1);
    }, [timeframeFilter, statusFilter]);


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
        // Usamos 'deadline' que ya viene procesado por el hook (es el internalDeadline)
        if (project.status === 'completed') return 'Entrega finalizada';
        if (!project.deadline) return '';

        const deadline = new Date(project.deadline);
        const now = new Date();
        // differenceInDays es perfecto aquí
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

    const getStatusStyles = (p: LocalProject): string => {
        if (p.status === 'completed') return 'bg-green-50 text-green-700 border-green-200';
        if (p.isOverdue) return 'bg-red-50 text-red-700 border-red-200';
        if (p.isUrgent) return 'bg-yellow-50 text-yellow-700 border-yellow-200';
        if (p.daysUntilDeadline && p.daysUntilDeadline <= 7) return 'bg-blue-50 text-blue-700 border-blue-200';
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
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
                            <option value="active">Activos (Pendientes)</option>
                            <option value="approved">Aprobados</option>
                            <option value="in-progress">En progreso</option>
                            <option value="review">En revisión</option>
                            <option value="completed">Completados</option>
                            <option value="cancelled">Cancelados</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Lista de Proyectos o Estados Vacíos */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
                {filteredProjects.length === 0 ? (
                    <div className="bg-white rounded-xl shadow p-12 text-center">
                        <FiBriefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />

                        {/* Si hay proyectos totales pero el filtro está vacío */}
                        {projects && projects.length > 0 ? (
                            <>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Sin resultados para este filtro
                                </h3>
                                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                    No encontramos proyectos que coincidan con los criterios seleccionados. Prueba cambiando el período o el estado.
                                </p>
                            </>
                        ) : (
                            <>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    No tienes proyectos aún
                                </h3>
                                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                    Actualmente no tienes plazos de entrega asignados. Cuando aceptes un proyecto, aparecerá aquí con su cronograma.
                                </p>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {currentProjects.map((project: any) => {
                            const p = project as LocalProject;
                            const StatusIcon = getStatusIcon(p);
                            const daysText = getDaysText(p);

                            return (
                                <div key={p._id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                                        {/* Información del proyecto */}
                                        <div className="flex-1">
                                            <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
                                                <div className="mb-3 md:mb-0">
                                                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                                                        {p.title}
                                                    </h3>
                                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                                        {/* Nuevo Badge de Estado según Plazo */}
                                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold border ${getStatusStyles(p)}`}>
                                                            <StatusIcon className="w-4 h-4 mr-2" />
                                                            {p.status === 'completed' ? 'Completado' :
                                                                p.isOverdue ? 'Vencido' :
                                                                    p.isUrgent ? 'Urgente' :
                                                                        (p.daysUntilDeadline && p.daysUntilDeadline <= 7) ? 'Próximo' : 'En Tiempo'}
                                                        </span>

                                                        {/* Estado real del proyecto (workflow) */}
                                                        {p.status !== 'completed' && (
                                                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 bg-white border border-gray-200 px-3 py-1 rounded-full shadow-sm">
                                                                {p.status === 'in-progress' ? 'En Progreso' :
                                                                    p.status === 'review' ? 'En Revisión' :
                                                                        p.status === 'approved' ? 'Aprobado' :
                                                                            p.status === 'cancelled' ? 'Cancelado' :
                                                                                p.status}
                                                            </span>
                                                        )}

                                                        {/* Tipo de Servicio */}
                                                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                                            {getServiceTypeLabel(p.serviceType)}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Fecha de entrega */}
                                                <div className="text-right">
                                                    <div className="flex flex-col md:items-end">
                                                        <div className="text-sm text-gray-500 mb-1 font-medium">Fecha límite</div>
                                                        <div className={`text-lg font-bold ${p.isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                                                            {formatDate(p.deadline)}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {formatTime(p.deadline)}
                                                        </div>
                                                        {daysText && (
                                                            <div className={`text-sm font-medium mt-1 ${p.isOverdue ? 'text-red-600' : p.isUrgent ? 'text-yellow-600' : 'text-blue-600'}`}>
                                                                {daysText}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Descripción: Buscamos en la vista del diseñador, si no, la general */}
                                            <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
                                                {p.designerView?.description || p.description || 'Sin descripción de propuesta técnica.'}
                                            </p>

                                            <div className="flex flex-col md:flex-row md:items-center justify-between border-t border-gray-50 pt-4">
                                                <div className="mb-3 md:mb-0">
                                                    <div className="flex items-center text-gray-500 text-sm">
                                                        <FiBriefcase className="mr-2" />
                                                        <span>Cliente: </span>
                                                        <span className="font-semibold ml-1 text-gray-900">
                                                            {/* Verificamos si el cliente está populado o si viene dentro de clientView */}
                                                            {p.client?.name || p.clientView?.clientName || 'Cliente no asignado'}
                                                        </span>
                                                        {p.client?.company && (
                                                            <span className="text-gray-400 ml-2 italic">
                                                                — {p.client.company}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-3">
                                                    <Link
                                                        href={`/dashboard/projects/${p._id}`}
                                                        className="flex items-center text-blue-600 hover:text-blue-700 font-bold text-sm transition-all hover:translate-x-1"
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

            {/* Paginación */}
            {filteredProjects.length > projectsPerPage && (
                <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4 rounded-lg shadow">
                    <div className="flex flex-1 justify-between sm:hidden">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            Anterior
                        </button>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            Siguiente
                        </button>
                    </div>
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Mostrando <span className="font-medium">{indexOfFirstProject + 1}</span> a{' '}
                                <span className="font-medium">
                                    {Math.min(indexOfLastProject, filteredProjects.length)}
                                </span> de{' '}
                                <span className="font-medium">{filteredProjects.length}</span> resultados
                            </p>
                        </div>
                        <div>
                            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                                    <button
                                        key={number}
                                        onClick={() => setCurrentPage(number)}
                                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${currentPage === number
                                            ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                                            : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                                            }`}
                                    >
                                        {number}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>
                </div>
            )}

            {/* Guía de colores y estados */}
            <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl shadow p-6">
                <div className="flex items-start">
                    {/* Ocultamos el icono en tablets para ganar espacio si es necesario, pero lo dejamos en desktop */}
                    <div className="hidden xl:block p-3 bg-blue-100 text-blue-600 rounded-lg mr-4">
                        <FiCalendar className="w-6 h-6" />
                    </div>

                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                            Interpretación de plazos
                        </h3>

                        {/* Ajuste clave: lg:grid-cols-5 para una sola fila en escritorio */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">

                            {/* 1. Vencido */}
                            <div className="bg-white p-3 rounded-lg border border-red-100 shadow-sm">
                                <div className="flex items-center mb-1">
                                    <div className="w-2.5 h-2.5 bg-red-500 rounded-full mr-2"></div>
                                    <h4 className="font-bold text-sm text-gray-900">Vencido</h4>
                                </div>
                                <p className="text-[11px] leading-tight text-gray-600">
                                    La fecha límite ya pasó y el proyecto no está completado.
                                </p>
                            </div>

                            {/* 2. Urgente */}
                            <div className="bg-white p-3 rounded-lg border border-yellow-100 shadow-sm">
                                <div className="flex items-center mb-1">
                                    <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full mr-2"></div>
                                    <h4 className="font-bold text-sm text-gray-900">Urgente</h4>
                                </div>
                                <p className="text-[11px] leading-tight text-gray-600">
                                    Vence en los próximos 2 días. ¡Prioridad máxima!
                                </p>
                            </div>

                            {/* 3. Próximo */}
                            <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm">
                                <div className="flex items-center mb-1">
                                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full mr-2"></div>
                                    <h4 className="font-bold text-sm text-gray-900">Próximo</h4>
                                </div>
                                <p className="text-[11px] leading-tight text-gray-600">
                                    Vence en los próximos 7 días. Planifica tu entrega.
                                </p>
                            </div>

                            {/* 4. En Cronograma (El nuevo estado Violeta) */}
                            <div className="bg-white p-3 rounded-lg border border-indigo-100 shadow-sm">
                                <div className="flex items-center mb-1">
                                    <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full mr-2"></div>
                                    <h4 className="font-bold text-sm text-gray-900">En Tiempo</h4>
                                </div>
                                <p className="text-[11px] leading-tight text-gray-600">
                                    Plazo saludable. Sigue tu ritmo.
                                </p>
                            </div>

                            {/* 5. Completado */}
                            <div className="bg-white p-3 rounded-lg border border-green-100 shadow-sm">
                                <div className="flex items-center mb-1">
                                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full mr-2"></div>
                                    <h4 className="font-bold text-sm text-gray-900">Completado</h4>
                                </div>
                                <p className="text-[11px] leading-tight text-gray-600">
                                    Proyecto entregado y aprobado por el cliente.
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}