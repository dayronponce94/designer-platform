'use client';

import { useState, useEffect } from 'react';
import { useAdmin } from '@/app/lib/hooks/useAdmin';
import { FiBriefcase, FiFilter, FiSearch, FiUserPlus, FiCheck, FiX, FiEye, FiEdit } from 'react-icons/fi';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function AdminProjectsPage() {
    const { fetchProjects, assignDesigner, updateProjectStatus, loading } = useAdmin();
    const [projects, setProjects] = useState<any[]>([]);
    const [designers, setDesigners] = useState<any[]>([]);
    const [filters, setFilters] = useState({
        status: '',
        serviceType: '',
        hasDesigner: '',
        search: '',
        page: 1,
        limit: 20
    });
    const [pagination, setPagination] = useState<any>({});

    useEffect(() => {
        loadProjects();
        loadDesigners();
    }, [filters]);

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
            const response = await fetch('/api/admin/users?role=designer&isActive=true');
            const data = await response.json();
            setDesigners(data.users || []);
        } catch (error) {
            console.error('Error loading designers:', error);
        }
    };

    const handleAssignDesigner = async (projectId: string, designerId: string) => {
        try {
            await assignDesigner(projectId, designerId);
            loadProjects();
        } catch (error) {
            console.error('Error assigning designer:', error);
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
        return format(new Date(dateString), "dd/MM/yyyy", { locale: es });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'requested': return 'bg-gray-100 text-gray-800';
            case 'quoted': return 'bg-blue-100 text-blue-800';
            case 'approved': return 'bg-green-100 text-green-800';
            case 'in-progress': return 'bg-yellow-100 text-yellow-800';
            case 'review': return 'bg-purple-100 text-purple-800';
            case 'completed': return 'bg-indigo-100 text-indigo-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getServiceTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            'branding': 'Branding',
            'ux-ui': 'UX/UI',
            'graphic': 'Gráfico',
            'web': 'Web',
            'motion': 'Motion',
            'illustration': 'Ilustración',
            'other': 'Otro'
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
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Gestión de Proyectos</h1>
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
                                onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <select
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
                        >
                            <option value="">Todos los estados</option>
                            <option value="requested">Solicitado</option>
                            <option value="quoted">Cotizado</option>
                            <option value="approved">Aprobado</option>
                            <option value="in-progress">En progreso</option>
                            <option value="review">En revisión</option>
                            <option value="completed">Completado</option>
                            <option value="cancelled">Cancelado</option>
                        </select>
                        <select
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={filters.hasDesigner}
                            onChange={(e) => setFilters({ ...filters, hasDesigner: e.target.value, page: 1 })}
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
                        <h3 className="text-xl font-medium text-gray-900 mb-2">No hay proyectos</h3>
                        <p className="text-gray-500">No se encontraron proyectos con los filtros seleccionados.</p>
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
                                        Presupuesto
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
                                                <div className="font-medium text-gray-900">{project.title}</div>
                                                <div className="text-sm text-gray-500">{getServiceTypeLabel(project.serviceType)}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{project.client?.name}</div>
                                            <div className="text-xs text-gray-500">{project.client?.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                                                {project.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {project.designer ? (
                                                <div className="text-sm text-gray-900">{project.designer.name}</div>
                                            ) : (
                                                <select
                                                    className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    value=""
                                                    onChange={(e) => handleAssignDesigner(project._id, e.target.value)}
                                                >
                                                    <option value="">Asignar diseñador...</option>
                                                    {designers.map((designer) => (
                                                        <option key={designer._id} value={designer._id}>
                                                            {designer.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            ${project.budget?.toLocaleString() || '0'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {formatDate(project.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <Link
                                                    href={`/dashboard/projects/${project._id}`}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    <FiEye className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    className="text-green-600 hover:text-green-900"
                                                    onClick={() => handleUpdateStatus(project._id, 'approved')}
                                                    disabled={project.status !== 'requested'}
                                                >
                                                    <FiCheck className="w-4 h-4" />
                                                </button>
                                                <button
                                                    className="text-red-600 hover:text-red-900"
                                                    onClick={() => handleUpdateStatus(project._id, 'cancelled')}
                                                    disabled={project.status === 'completed' || project.status === 'cancelled'}
                                                >
                                                    <FiX className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Paginación */}
            {pagination && pagination.pages > 1 && (
                <div className="flex justify-center">
                    <div className="flex space-x-2">
                        <button
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                            disabled={filters.page === 1}
                            onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                        >
                            Anterior
                        </button>
                        <span className="px-4 py-2">
                            Página {filters.page} de {pagination.pages}
                        </span>
                        <button
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
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