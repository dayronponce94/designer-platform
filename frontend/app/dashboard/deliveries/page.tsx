'use client';

import { useMemo, useState } from 'react';
import { useProjects } from '@/app/lib/hooks/useProjects';
import { FiCalendar, FiClock, FiAlertCircle, FiCheckCircle, FiActivity, FiAlertTriangle, FiTrendingUp, FiEye } from 'react-icons/fi';
import { format, differenceInDays, isPast, isToday } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';

export default function DeliveriesPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState<'all' | 'upcoming' | 'overdue'>('all');

    const limit = 3;
    const { projects, pagination, loading, error, stats } = useProjects({
        page: currentPage,
        limit
    });


    const getDaysLeft = (deadline?: string) => {
        if (!deadline) return null;
        try {
            const today = new Date();
            const deadlineDate = new Date(deadline);
            return differenceInDays(deadlineDate, today);
        } catch (error) {
            return null;
        }
    };


    // Función auxiliar para extraer la fecha sin importar si es objeto $date o string
    const getRawDeadline = (project: any) => {
        // Prioridad a la fecha del cliente, que es la oficial para esta vista
        const deadline = project.clientView?.deadline;
        return deadline?.$date || deadline;
    };

    // 1. Definimos qué proyectos queremos mostrar según el filtro seleccionado
    const projectsToDisplay = useMemo(() => {
        // Primero, filtramos por los estados que te interesan (verificados)
        const baseProjects = projects.filter(project =>
            ['approved', 'in-progress', 'review', 'completed'].includes(project.status)
        );

        if (filter === 'all') {
            // Ordenamos todos los que tienen fecha
            return [...baseProjects].sort((a, b) => {
                const dateA = new Date(getRawDeadline(a) || 0).getTime();
                const dateB = new Date(getRawDeadline(b) || 0).getTime();
                return dateA - dateB;
            });
        }

        if (filter === 'overdue') {
            return baseProjects.filter(project => {
                const daysLeft = getDaysLeft(getRawDeadline(project));
                return project.status !== 'completed' && daysLeft !== null && daysLeft < 0;
            });
        }

        if (filter === 'upcoming') {
            return baseProjects.filter(project => {
                const daysLeft = getDaysLeft(getRawDeadline(project));
                return project.status !== 'completed' && daysLeft !== null && daysLeft >= 0 && daysLeft <= 7;
            });
        }

        return baseProjects;
    }, [projects, filter]);

    // Mapeo de nombres para las tarjetas 
    const activeCount = projects.filter(p => ['approved', 'in-progress', 'review'].includes(p.status)).length;

    const upcomingCount = projects.filter(p => {
        const date = p.clientView?.deadline?.$date || p.clientView?.deadline;
        const days = getDaysLeft(date);
        return p.status !== 'completed' && days !== null && days >= 0 && days <= 7;
    }).length;

    const overdueCount = projects.filter(p => {
        const date = p.clientView?.deadline?.$date || p.clientView?.deadline;
        const days = getDaysLeft(date);
        return p.status !== 'completed' && days !== null && days < 0;
    }).length;

    const projectsWithoutDeadline = useMemo(() => {
        return projects.filter(project =>
            ['approved', 'in-progress', 'review'].includes(project.status) && !getRawDeadline(project)
        );
    }, [projects]);


    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Sin fecha definida';
        try {
            const date = new Date(dateString);
            return format(date, "dd 'de' MMMM, yyyy", { locale: es });
        } catch (error) {
            return 'Fecha inválida';
        }
    };

    const formatShortDate = (dateString?: string) => {
        if (!dateString) return 'Sin fecha';
        try {
            const date = new Date(dateString);
            const today = new Date();
            const diff = differenceInDays(date, today);

            if (diff === 0) return 'Hoy';
            if (diff === 1) return 'Mañana';
            if (diff === -1) return 'Ayer';
            if (diff < 0 && diff >= -7) return `Hace ${Math.abs(diff)} días`;
            if (diff > 0 && diff <= 7) return `En ${diff} días`;

            return format(date, "dd MMM", { locale: es });
        } catch (error) {
            return 'Fecha inválida';
        }
    };



    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'approved':
                return {
                    icon: FiCheckCircle,
                    color: 'text-blue-600 bg-blue-100',
                    borderColor: 'border-blue-200',
                    label: 'Aprobado',
                    bgColor: 'bg-blue-50'
                };
            case 'in-progress':
                return {
                    icon: FiClock,
                    color: 'text-purple-600 bg-purple-100',
                    borderColor: 'border-purple-200',
                    label: 'En Progreso',
                    bgColor: 'bg-purple-50'
                };
            case 'review':
                return {
                    icon: FiEye,
                    color: 'text-orange-600 bg-orange-100',
                    borderColor: 'border-orange-200',
                    label: 'En Revisión',
                    bgColor: 'bg-orange-50'
                };
            case 'completed':
                return {
                    icon: FiCheckCircle,
                    color: 'text-green-600 bg-green-100',
                    borderColor: 'border-green-200',
                    label: 'Completado',
                    bgColor: 'bg-green-50'
                };
            default:
                return {
                    icon: FiClock,
                    color: 'text-gray-600 bg-gray-100',
                    borderColor: 'border-gray-200',
                    label: status,
                    bgColor: 'bg-gray-50'
                };
        }
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
            <div className="flex justify-center items-center min-h-100">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando próximas entregas...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <p>{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
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
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <FiCalendar className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Próximas Entregas</h1>
                            <p className="text-gray-600 mt-1">
                                Fechas importantes de tus proyectos activos
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <select
                        value={filter} // Cambiado de statusFilter a filter
                        onChange={(e) => {
                            setFilter(e.target.value as any); // Cambiado de setStatusFilter a setFilter
                            setCurrentPage(1); // Esto es clave para que al filtrar reinicie a la página 1
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">Todas las Entregas</option>
                        <option value="upcoming">Próximas (7 días)</option>
                        <option value="overdue">Vencidas</option>
                    </select>
                </div>
            </div>

            {/* Resumen Rápido */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow p-4 border-l-4 border-blue-500">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg mr-4 ">
                            <FiActivity className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Proyectos Activos</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow p-4 border-l-4 border-green-500">
                    <div className="flex items-center">
                        <div className="p-3 bg-green-100 text-green-600 rounded-lg mr-4">
                            <FiCalendar className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Próximos 7 días</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.upcoming}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow p-4 border-l-4 border-red-500">
                    <div className="flex items-center">
                        <div className="p-3 bg-red-100 text-red-600 rounded-lg mr-4">
                            <FiAlertTriangle className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Vencidos</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.overdue}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow p-4 border-l-4 border-gray-500">
                    <div className="flex items-center">
                        <div className="p-3 bg-gray-100 text-gray-600 rounded-lg mr-4">
                            <FiClock className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Sin fecha</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.noDeadline}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lista Principal de Entregas */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Calendario de Entregas</h2>
                    <p className="text-gray-600 mt-1">
                        {filter === 'all' && 'Todos tus proyectos con fechas de entrega'}
                        {filter === 'upcoming' && 'Proyectos con entrega en los próximos 7 días'}
                        {filter === 'overdue' && 'Proyectos con fechas de entrega vencidas'}
                    </p>
                </div>

                {projectsToDisplay.length === 0 ? (
                    <div className="text-center py-12">
                        <FiCalendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-900 mb-2">
                            {filter === 'all'
                                ? 'No hay proyectos con fechas de entrega'
                                : filter === 'upcoming'
                                    ? 'No hay entregas próximas'
                                    : 'No hay proyectos vencidos'}
                        </h3>
                        <p className="text-gray-500">
                            {filter === 'all'
                                ? 'Todos tus proyectos activos están sin fecha de entrega definida.'
                                : '¡Genial! Estás al día con todas tus entregas.'
                            }
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {projectsToDisplay.map((project) => {
                            // Extraer la fecha correctamente (considerando el formato de MongoDB $date)
                            const currentDeadline = project.clientView?.deadline?.$date || project.clientView?.deadline;

                            const daysLeft = getDaysLeft(currentDeadline);
                            const statusConfig = getStatusConfig(project.status);
                            const StatusIcon = statusConfig.icon;
                            const isOverdue = daysLeft !== null && daysLeft < 0;
                            const isToday = daysLeft === 0;
                            const isUpcoming = daysLeft !== null && daysLeft > 0 && daysLeft <= 3;

                            return (
                                <div
                                    key={project._id}
                                    className={`p-6 transition-colors hover:bg-gray-50 ${isOverdue ? 'bg-red-50/50' : ''}`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-start space-x-4">
                                                <div className={`p-3 rounded-xl ${statusConfig.color} border ${statusConfig.borderColor}`}>
                                                    <StatusIcon className="w-6 h-6" />
                                                </div>

                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div>
                                                            <h3 className="text-lg font-bold text-gray-900">
                                                                {project.title}
                                                            </h3>
                                                            <div className="flex items-center space-x-3 mt-1">
                                                                <span className="text-sm text-gray-500">
                                                                    {getServiceTypeLabel(project.serviceType)}
                                                                </span>
                                                                <span className="text-sm px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                                                                    {statusConfig.label}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="text-right">
                                                            {currentDeadline && (
                                                                project.status === 'completed' ? (
                                                                    /* Mensaje para proyectos terminados */
                                                                    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 whitespace-nowrap">
                                                                        <FiCheckCircle className="shrink-0 w-4 h-4 mr-2" />
                                                                        <span>Listo para descargar</span>
                                                                    </div>
                                                                ) : (
                                                                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${isOverdue ? 'bg-red-100 text-red-800'
                                                                        : isToday ? 'bg-yellow-100 text-yellow-800'
                                                                            : isUpcoming ? 'bg-orange-100 text-orange-800'
                                                                                : 'bg-green-100 text-green-800'
                                                                        }`}>
                                                                        {isOverdue && <FiAlertCircle className="mr-1 w-4 h-4" />}
                                                                        {formatShortDate(currentDeadline)}
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-4">
                                                            {currentDeadline && (
                                                                <div className="flex items-center text-gray-500">
                                                                    <FiCalendar className="mr-2" />
                                                                    <span className="text-sm">
                                                                        Fecha límite: {formatDate(currentDeadline)}
                                                                    </span>
                                                                </div>
                                                            )}

                                                            {daysLeft !== null && (
                                                                <div className={`text-sm font-medium ${project.status === 'completed' ? 'text-green-600' // Siempre verde si está completado
                                                                    : isOverdue ? 'text-red-600'
                                                                        : isToday ? 'text-yellow-600'
                                                                            : 'text-green-600'
                                                                    }`}>
                                                                    {project.status === 'completed' ? (
                                                                        "Proyecto finalizado con éxito"
                                                                    ) : isOverdue ? (
                                                                        `Vencido hace ${Math.abs(daysLeft)} ${Math.abs(daysLeft) === 1 ? 'día' : 'días'}`
                                                                    ) : isToday ? (
                                                                        'Vence hoy'
                                                                    ) : (
                                                                        `Faltan ${daysLeft} ${daysLeft === 1 ? 'día' : 'días'}`
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="flex space-x-2">
                                                            <Link
                                                                href={`/dashboard/projects/${project._id}`}
                                                                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                                            >
                                                                Ver Detalles
                                                            </Link>
                                                        </div>
                                                    </div>
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

            {/* Proyectos sin fecha de entrega */}
            {projectsWithoutDeadline.length > 0 && filter === 'all' && (
                <div className="bg-white rounded-xl shadow">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900">Proyectos sin fecha de entrega</h2>
                        <p className="text-gray-600 mt-1">Estos proyectos no tienen fecha límite definida</p>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {projectsWithoutDeadline.map((project) => {
                                const statusConfig = getStatusConfig(project.status);
                                const StatusIcon = statusConfig.icon;

                                return (
                                    <div key={project._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                                        <div className="flex items-center space-x-4">
                                            <div className={`p-3 rounded-lg ${statusConfig.color}`}>
                                                <StatusIcon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900">{project.title}</h3>
                                                <p className="text-sm text-gray-500">{statusConfig.label}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <span className="text-sm text-gray-400 flex items-center">
                                                <FiClock className="mr-1" />
                                                Sin fecha definida
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* PAGINACIÓN */}
            {pagination && pagination.pages > 1 && projectsToDisplay.length > 0 && (
                <div className="flex justify-between items-center mt-6">
                    {/* Texto con rango de resultados */}
                    <div className="text-sm text-gray-500">
                        Mostrando {((pagination.page - 1) * limit) + 1} - {Math.min(pagination.page * limit, pagination.total)} de {pagination.total} resultados
                    </div>

                    <div className="flex space-x-2">
                        <button
                            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                            disabled={pagination.page === 1}
                            onClick={() => {
                                setCurrentPage(prev => prev - 1);
                            }}
                        >
                            Anterior
                        </button>

                        <span className="px-4 py-2 text-gray-700 font-medium">
                            Página {pagination.page} de {pagination.pages}
                        </span>

                        <button
                            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                            disabled={pagination.page >= pagination.pages}
                            onClick={() => {
                                setCurrentPage(prev => prev + 1);
                            }}
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            )}

            {/* Consejos */}
            <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl shadow p-6">
                <div className="flex items-start">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg mr-4">
                        <FiTrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No pierdas de vista los plazos de entrega
                        </h3>
                        <ul className="text-gray-600 space-y-2">
                            <li className="flex items-center">
                                <FiCheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                Revisa regularmente las fechas de entrega
                            </li>
                            <li className="flex items-center">
                                <FiCheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                Comunícate con tu diseñador si necesitas ajustar fechas
                            </li>
                            <li className="flex items-center">
                                <FiCheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                Los proyectos vencidos aparecen en rojo para mayor visibilidad
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}