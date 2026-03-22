'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthContext } from '@/app/providers/AuthProvider';
import Alert from '@/components/ui/Alert';
import {
    FiBriefcase,
    FiClock,
    FiCheckCircle,
    FiAlertCircle,
    FiEdit,
    FiEye,
    FiUser,
    FiSearch,
    FiFilter,
    FiChevronLeft,
    FiChevronRight,
    FiDollarSign
} from 'react-icons/fi';

interface Project {
    clientView: any;
    _id: string;
    title: string;
    description: string;
    serviceType: string;
    status: string;
    budget: number;
    deadline: string;
    createdAt: string;
    client: {
        _id: string;
        name: string;
        email: string;
    };
    designer?: {
        _id: string;
        name: string;
        email: string;
    };
}

export default function ProjectsPage() {
    const { user } = useAuthContext();
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const [filters, setFilters] = useState({
        search: '',
        status: 'all',
        page: 1,
        limit: 6 // Ajusta el límite según prefieras
    });
    const [totalPages, setTotalPages] = useState(1);

    // 2. useEffect escucha cambios en el objeto filters
    useEffect(() => {
        fetchProjects();
    }, [filters]);

    const fetchProjects = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('token');

            // Construimos la URL con los parámetros actuales
            const queryParams = new URLSearchParams({
                search: filters.search,
                status: filters.status === 'all' ? '' : filters.status,
                page: filters.page.toString(),
                limit: filters.limit.toString()
            });

            const response = await fetch(`/api/projects?${queryParams}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Error al cargar proyectos');

            const data = await response.json();

            if (data.success) {
                setProjects(data.data.projects || []);
                setTotalPages(data.data.pagination?.pages || 1);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const statusConfig: Record<string, { color: string; icon: React.ReactNode; text: string }> = {
            'approved': { color: 'bg-green-100 text-green-800', icon: <FiCheckCircle />, text: 'Aprobado' },
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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };



    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                        <FiBriefcase className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Mis Proyectos</h1>
                        <p className="text-gray-600 text-sm mt-1"> Gestiona y sigue el progreso de todos tus proyectos de diseño.</p>
                    </div>
                </div>
            </div>

            {/* Bloque de Filtros */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por título de proyecto..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <FiFilter className="text-gray-600 w-5 h-5" />
                        <select
                            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer"
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
                        >
                            <option value="all">Todos los estados</option>
                            <option value="approved">Aprobados</option>
                            <option value="in-progress">En Progreso</option>
                            <option value="review">En Revisión</option>
                            <option value="completed">Completados</option>
                            <option value="cancelled">Cancelados</option>
                        </select>
                    </div>
                </div>
            </div>

            {error && <Alert type="error" message={error} onClose={() => setError('')} className="mb-6" />}

            {projects.length === 0 ? (
                <div className="bg-white rounded-xl shadow p-12 text-center">
                    <FiBriefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No tienes proyectos aún</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Comienza solicitando tu primer proyecto de diseño. Nuestro equipo estará encantado de ayudarte a convertir tus ideas en realidad.
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <div key={project._id} className="bg-white rounded-xl shadow hover:shadow-md transition-shadow">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 wrap-break-word hyphens-auto line-clamp-2">{project.title}</h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {getServiceTypeLabel(project.serviceType)}
                                            </p>
                                        </div>
                                        {getStatusBadge(project.status)}
                                    </div>

                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                        {project.clientView?.description || 'Sin descripción'}
                                    </p>
                                    <div className="space-y-3 text-sm text-gray-500 mb-6">
                                        <div className="flex items-center">
                                            <FiDollarSign className="mr-2" />
                                            <span>
                                                {project.clientView?.budget && project.clientView.budget > 0
                                                    ? `Costo: $${project.clientView.budget.toLocaleString()}`
                                                    : 'Presupuesto por definir'}
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <FiClock className="mr-2" />
                                            <span>Creado: {formatDate(project.createdAt)}</span>
                                        </div>
                                        {project.clientView?.deadline && (
                                            <div className="flex items-center">
                                                <FiClock className="mr-2" />
                                                <span>Entrega: {formatDate(project.clientView.deadline)}</span>
                                            </div>
                                        )}
                                        {project.designer && (
                                            <div className="flex items-center">
                                                <FiUser className="mr-2" />
                                                <span>Diseñador: {project.designer.name}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                        <Link
                                            href={`/dashboard/projects/${project._id}`}
                                            className="flex items-center text-blue-600 hover:text-blue-700"
                                        >
                                            <FiEye className="mr-1" />
                                            Ver detalles
                                        </Link>
                                        <div className="flex space-x-2">
                                            {user?.role === 'client' && project.status === 'requested' && (
                                                <Link
                                                    href={`/dashboard/projects/${project._id}/edit`}
                                                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                    title="Editar proyecto"
                                                >
                                                    <FiEdit />
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Paginación */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-4 pt-8">
                    <button
                        onClick={() => setFilters(f => ({ ...f, page: Math.max(f.page - 1, 1) }))}
                        disabled={filters.page === 1}
                        className="p-2 rounded-lg border border-gray-300 disabled:opacity-30 hover:bg-gray-50 transition"
                    >
                        <FiChevronLeft />
                    </button>
                    <span className="text-sm font-medium text-gray-700">
                        Página {filters.page} de {totalPages}
                    </span>
                    <button
                        onClick={() => setFilters(f => ({ ...f, page: Math.min(f.page + 1, totalPages) }))}
                        disabled={filters.page === totalPages}
                        className="p-2 rounded-lg border border-gray-300 disabled:opacity-30 hover:bg-gray-50 transition"
                    >
                        <FiChevronRight />
                    </button>
                </div>
            )}
        </div>
    );
}