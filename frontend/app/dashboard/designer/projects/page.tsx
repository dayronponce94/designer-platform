'use client';

import { useState, useEffect } from 'react';
import { useAuthContext } from '@/app/providers/AuthProvider';
import { projectAPI } from '@/app/lib/api/endpoints';
import { FiBriefcase, FiFilter, FiUpload, FiCheckCircle, FiClock, FiAlertCircle, FiEye, FiMessageSquare, FiCalendar } from 'react-icons/fi';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';

interface Project {
    _id: string;
    title: string;
    description: string;
    client: {
        _id: string;
        name: string;
        email: string;
    };
    clientView: {
        description: string;
        budget: number;
        deadline: any;
    };
    designerView: {
        description: string;
        earnings: number;
        internalDeadline: any;
    };
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
    messages: Array<any>;
    createdAt: string;
    updatedAt: string;
}

interface ProjectWithDeliverables extends Project {
    deliverables?: Array<{
        _id: string;
        url: string;
        filename: string;
        description: string;
        uploadedAt: string;
    }>;
}

export default function DesignerProjectsPage() {
    const { user } = useAuthContext();
    const [projects, setProjects] = useState<ProjectWithDeliverables[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<any>(null);

    const [filters, setFilters] = useState({
        status: 'all',
        search: '',
        page: 1,
        limit: 3
    });

    const [stats, setStats] = useState({
        active: 0,
        completed: 0,
        upcoming: 0,
        overdue: 0
    });

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const response = await projectAPI.getProjects(filters);
            const data = response.data?.data; // Accedemos al objeto data

            setProjects(data?.projects || []);
            setPagination(data?.pagination);

            // 2. Guardamos las estadísticas globales que vienen del backend
            if (data?.stats) {
                setStats(data.stats);
            }

            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al cargar proyectos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, [filters]);

    const formatDate = (dateInput: any) => {
        if (!dateInput) return 'Sin fecha definida';

        // Si recibimos el objeto completo de MongoDB { $date: ... }
        const dateValue = dateInput?.$date ? dateInput.$date : dateInput;

        try {
            const date = new Date(dateValue);
            return format(date, "dd 'de' MMM", { locale: es }); // Formato corto para miniaturas
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
                    label: 'Aprobado',
                    nextAction: 'Iniciar trabajo'
                };
            case 'in-progress':
                return {
                    icon: FiClock,
                    color: 'text-purple-600 bg-purple-100',
                    label: 'En Progreso',
                    nextAction: 'Marcar para revisión'
                };
            case 'review':
                return {
                    icon: FiAlertCircle,
                    color: 'text-orange-600 bg-orange-100',
                    label: 'En Revisión',
                    nextAction: 'Esperando feedback'
                };
            case 'completed':
                return {
                    icon: FiCheckCircle,
                    color: 'text-green-600 bg-green-100',
                    label: 'Completado',
                    nextAction: 'Proyecto finalizado'
                };
            default:
                return {
                    icon: FiClock,
                    color: 'text-gray-600 bg-gray-100',
                    label: status,
                    nextAction: 'Ver detalles'
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

    const handleStatusChange = async (projectId: string, newStatus: string) => {
        try {
            await projectAPI.updateProject(projectId, { status: newStatus });
            fetchProjects(); // Refrescar la lista
        } catch (err: any) {
            setError('Error al actualizar el estado del proyecto');
        }
    };

    const getNextStatus = (currentStatus: string) => {
        switch (currentStatus) {
            case 'approved':
                return 'in-progress';
            case 'in-progress':
                return 'review';
            case 'review':
                return 'completed';
            default:
                return currentStatus;
        }
    };

    const getNextStatusLabel = (currentStatus: string) => {
        switch (currentStatus) {
            case 'approved':
                return 'Iniciar Trabajo';
            case 'in-progress':
                return 'Marcar para Revisión';
            case 'review':
                return 'Completar Proyecto';
            default:
                return 'Ver Detalles';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-100">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando proyectos asignados...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <p>{error}</p>
                <button
                    onClick={fetchProjects}
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
                            <FiBriefcase className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Proyectos Asignados</h1>
                            <p className="text-gray-600 mt-1">
                                Gestiona los proyectos que te han sido asignados
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <FiFilter className="text-gray-400" />
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">Todos los Proyectos</option>
                        <option value="active">Proyectos Activos</option>
                        <option value="completed">Proyectos Completados</option>
                        <option value="overdue">Proyectos Vencidos</option>
                    </select>
                </div>
            </div>

            {/* Estadísticas rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg mr-4">
                            <FiBriefcase className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Proyectos Activos</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-green-100 text-green-600 rounded-lg mr-4">
                            <FiCheckCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Proyectos Completados</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-red-100 text-red-600 rounded-lg mr-4">
                            <FiCalendar className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Proyectos Vencidos</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.overdue}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lista de proyectos */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
                {projects.length === 0 ? (
                    <div className="text-center py-12">
                        <FiBriefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-900 mb-2">
                            No tienes proyectos asignados
                        </h3>
                        <p className="text-gray-500">
                            Los proyectos que te sean asignados aparecerán aquí
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {projects.map((project) => {
                            const statusConfig = getStatusConfig(project.status);
                            const StatusIcon = statusConfig.icon;
                            const nextStatus = getNextStatus(project.status);
                            const nextStatusLabel = getNextStatusLabel(project.status);

                            return (
                                <div key={project._id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                                        {/* Información del proyecto */}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-900">
                                                        {project.title}
                                                    </h3>
                                                    <div className="flex items-center space-x-3 mt-1">
                                                        <span className="text-sm text-gray-500">
                                                            {getServiceTypeLabel(project.serviceType)}
                                                        </span>
                                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color}`}>
                                                            <StatusIcon className="w-3 h-3 mr-1" />
                                                            {statusConfig.label}
                                                        </span>
                                                        {/* Ganancias para el diseñador */}
                                                        {project.designerView?.earnings > 0 && (
                                                            <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                                                                ${project.designerView.earnings.toLocaleString()}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="text-gray-600 mb-4 line-clamp-2 text-sm italic">
                                                {project.designerView?.description || project.clientView?.description}
                                            </p>

                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="flex items-center text-gray-500 text-sm">
                                                        <span>Cliente: </span>
                                                        <span className="font-medium ml-1">{project.client?.name || 'Cliente'}</span>
                                                        {project.client?.email && (
                                                            <span className="text-gray-400 ml-2">({project.client.email})</span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    <Link
                                                        href={`/dashboard/projects/${project._id}`}
                                                        className="flex items-center px-3 py-2 text-blue-600 hover:text-blue-900 hover:bg-blue-100 rounded-lg"
                                                    >
                                                        <FiEye className="mr-1" />
                                                        Ver Detalles
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Acciones del proyecto  y Fecha */}
                                        <div className="lg:w-48 flex flex-col justify-between">
                                            {/* Contenedor de Fecha: Ahora vive aquí arriba del botón */}
                                            {project.designerView?.internalDeadline && (
                                                <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 mb-3 text-center">
                                                    <div className="flex items-center justify-center text-gray-700 text-sm font-semibold">
                                                        <FiCalendar className="mr-1 text-orange-500" />
                                                        {formatDate(project.designerView.internalDeadline?.$date || project.designerView.internalDeadline)}
                                                    </div>
                                                    <div className="text-[10px] uppercase tracking-wider text-orange-600 font-bold mt-1">
                                                        Fecha Entrega
                                                    </div>
                                                </div>
                                            )}

                                            {/* Cambiar estado */}
                                            <div className="space-y-3">
                                                {['approved', 'in-progress', 'review'].includes(project.status) && (
                                                    <button
                                                        onClick={() => handleStatusChange(project._id, nextStatus)}
                                                        className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                                    >
                                                        <FiCheckCircle className="mr-2" />
                                                        {nextStatusLabel}
                                                    </button>
                                                )}
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
            {pagination && pagination.total > 0 && (
                <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                        Mostrando {((filters.page - 1) * filters.limit) + 1} - {Math.min(filters.page * filters.limit, pagination.total)} de {pagination.total} resultados
                    </div>
                    {pagination.pages > 1 && (
                        <div className="flex space-x-2">
                            <button
                                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                disabled={filters.page === 1}
                                onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                            >
                                Anterior
                            </button>
                            <span className="px-4 py-2">
                                Página {filters.page} de {pagination.pages}
                            </span>
                            <button
                                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                disabled={filters.page === pagination.pages}
                                onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                            >
                                Siguiente
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Guía rápida */}
            <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl shadow p-6">
                <div className="flex items-start">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg mr-4">
                        <FiBriefcase className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Flujo de trabajo recomendado
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-white p-4 rounded-lg">
                                <div className="flex items-center mb-2">
                                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-2">
                                        1
                                    </div>
                                    <h4 className="font-medium text-gray-900">Proyecto Aprobado</h4>
                                </div>
                                <p className="text-sm text-gray-600">
                                    Revisa los requerimientos y comunícate con el cliente para aclarar dudas
                                </p>
                            </div>

                            <div className="bg-white p-4 rounded-lg">
                                <div className="flex items-center mb-2">
                                    <div className="w-8 h-8 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mr-2">
                                        2
                                    </div>
                                    <h4 className="font-medium text-gray-900">En Progreso</h4>
                                </div>
                                <p className="text-sm text-gray-600">
                                    Desarrolla el diseño y muestra imágenes parciales para feedback
                                </p>
                            </div>

                            <div className="bg-white p-4 rounded-lg">
                                <div className="flex items-center mb-2">
                                    <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mr-2">
                                        3
                                    </div>
                                    <h4 className="font-medium text-gray-900">En Revisión</h4>
                                </div>
                                <p className="text-sm text-gray-600">
                                    El cliente revisa el trabajo final. Responde preguntas y realiza ajustes
                                </p>
                            </div>

                            <div className="bg-white p-4 rounded-lg">
                                <div className="flex items-center mb-2">
                                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-2">
                                        4
                                    </div>
                                    <h4 className="font-medium text-gray-900">Completado</h4>
                                </div>
                                <p className="text-sm text-gray-600">
                                    Entrega archivos finales y cierra el proyecto. ¡Buen trabajo!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}