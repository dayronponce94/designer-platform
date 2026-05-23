'use client';

import { useState, useEffect } from 'react';
import { useAdmin } from '@/app/lib/hooks/useAdmin';
import {
    FiBriefcase,
    FiSearch,
    FiX,
    FiEye,
    FiCheckCircle,
    FiAlertCircle,
} from 'react-icons/fi';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useSearchParams } from 'next/navigation';
import { adminAPI } from '@/app/lib/api/endpoints';

export default function AdminProjectsPage() {
    const { fetchProjects, assignDesigner, updateProjectStatus, fetchUsers, loading } = useAdmin();
    const [projects, setProjects] = useState<any[]>([]);
    const [designers, setDesigners] = useState<any[]>([]);
    const [filters, setFilters] = useState({
        status: '',
        serviceType: '',
        hasDesigner: '',
        search: '',
        page: 1,
        limit: 5,
    });
    const [pagination, setPagination] = useState<any>({});

    const params = useSearchParams();
    const clientId = params.get('clientId');

    useEffect(() => {
        const fetchProjects = async () => {
            const response = await adminAPI.getAllProjects({
                clientId,
                ...filters,
            });
            setProjects(response.data.data.projects);
            setPagination(response.data.data.pagination || {});
        };

        fetchProjects();
        loadDesigners();
    }, [clientId, filters]);

    const loadProjects = async () => {
        try {
            const data = await fetchProjects(filters);
            setProjects(data.projects || []);
            setPagination(data.pagination || {});
        } catch (error) {
            console.error('Error loading projects:', error);
        }
    };

    const loadDesigners = async () => {
        try {
            const data = await fetchUsers({ role: 'designer', isActive: true });
            setDesigners(data.users || []);
        } catch (error) {
            console.error('Error loading designers:', error);
        }
    };

    const handleUpdateStatus = async (projectId: string, status: string) => {
        try {
            await updateProjectStatus(projectId, status);
            loadProjects();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };


    const formatDate = (dateString: string) => {
        return format(new Date(dateString), 'dd/MM/yyyy', { locale: es });
    };

    const getStatusBadge = (status: string) => {
        const statusConfig: Record<string, { color: string; icon: React.ReactNode; text: string }> = {
            'approved': { color: 'bg-blue-100 text-blue-800', icon: <FiCheckCircle />, text: 'Aprobado' },
            'in-progress': { color: 'bg-purple-100 text-purple-800', icon: <FiBriefcase />, text: 'En Progreso' },
            'review': { color: 'bg-orange-100 text-orange-800', icon: <FiEye />, text: 'En Revisión' },
            'completed': { color: 'bg-green-100 text-green-800', icon: <FiCheckCircle />, text: 'Completado' },
            'cancelled': { color: 'bg-red-100 text-red-800', icon: <FiAlertCircle />, text: 'Cancelado' },
        };

        const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', icon: <FiAlertCircle />, text: status };

        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
                {config.icon}
                <span className="ml-1">{config.text}</span>
            </span>
        );
    };

    const getServiceTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            branding: 'Diseño de Marca',
            'ux-ui': 'Diseño UX/UI',
            graphic: 'Diseño Gráfico',
            web: 'Diseño Web',
            motion: 'Animación Gráfica',
            illustration: 'Ilustración',
            other: 'Otro',
        };
        return labels[type] || type;
    };

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
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                Gestión de Proyectos
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Administra y asigna todos los proyectos de la plataforma
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filtros */}
            <div className="bg-white rounded-xl shadow p-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar proyectos..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={filters.search}
                                onChange={(e) =>
                                    setFilters({ ...filters, search: e.target.value, page: 1 })
                                }
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <select
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={filters.status}
                            onChange={(e) =>
                                setFilters({ ...filters, status: e.target.value, page: 1 })
                            }
                        >
                            <option value="">Todos los estados</option>
                            <option value="approved">Aprobado</option>
                            <option value="in-progress">En progreso</option>
                            <option value="review">En revisión</option>
                            <option value="completed">Completado</option>
                            <option value="cancelled">Cancelado</option>
                        </select>
                        <select
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={filters.hasDesigner}
                            onChange={(e) =>
                                setFilters({ ...filters, hasDesigner: e.target.value, page: 1 })
                            }
                        >
                            <option value="">Todos</option>
                            <option value="true">Con diseñador</option>
                            <option value="false">Sin diseñador</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Tabla de proyectos */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Cargando proyectos...</p>
                    </div>
                ) : projects.length === 0 ? (
                    <div className="text-center py-12">
                        <FiBriefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-900 mb-2">
                            No hay proyectos
                        </h3>
                        <p className="text-gray-500">
                            No se encontraron proyectos con los filtros seleccionados.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Proyecto
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Cliente
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Diseñador
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Fecha
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {projects.map((project) => (
                                    <tr key={project._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div>
                                                {project.title.length > 30
                                                    ? project.title.substring(0, 30) + '...'
                                                    : project.title}
                                                <div className="text-sm text-gray-500">
                                                    {getServiceTypeLabel(project.serviceType)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">
                                                {project.client?.name}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {project.client?.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(project.status)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">
                                                {project.designer ? project.designer.name : 'Sin diseñador asignado'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {formatDate(project.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium">
                                            <div className="flex space-x-2">
                                                {/* Botón de Ver Detalles */}
                                                <Link
                                                    href={`/dashboard/projects/${project._id}`}
                                                    className="text-blue-600 hover:text-blue-900 transition-colors"
                                                    title="Detalles"
                                                >
                                                    <FiEye className="w-4 h-4" />
                                                </Link>

                                                {/* Botón de Cancelar con UI/UX Condicional */}
                                                {project.status !== 'completed' && project.status !== 'cancelled' ? (
                                                    <button
                                                        className="text-red-600 hover:text-red-900 transition-colors"
                                                        onClick={() => handleUpdateStatus(project._id, 'cancelled')}
                                                        title="Cancelar Proyecto"
                                                    >
                                                        <FiX className="w-4 h-4" />
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="text-gray-300 cursor-not-allowed"
                                                        disabled={true}
                                                        title={`No se puede cancelar un proyecto ${project.status === 'completed' ? 'completado' : 'ya cancelado'
                                                            }`}
                                                    >
                                                        <FiX className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {pagination && pagination.pages > 1 && (
                <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                        Mostrando {((filters.page - 1) * filters.limit) + 1} - {Math.min(filters.page * filters.limit, pagination.total)} de {pagination.total} resultados
                    </div>
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
                </div>
            )}
        </div>
    );
}