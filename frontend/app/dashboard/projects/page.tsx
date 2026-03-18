'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthContext } from '@/app/providers/AuthProvider';
import Alert from '@/components/ui/Alert';
import ConfirmModal from '@/components/modals/ConfirmModal';
import {
    FiBriefcase,
    FiPlus,
    FiClock,
    FiCheckCircle,
    FiAlertCircle,
    FiEdit,
    FiEye,
    FiTrash2,
    FiPackage,
    FiDollarSign,
    FiUser
} from 'react-icons/fi';

interface Project {
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
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch('/api/projects', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Error al cargar proyectos');

            const data = await response.json();
            setProjects(data.data.projects || []);
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

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-100">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Mis Proyectos</h1>
                    <p className="text-gray-600 mt-2">
                        Gestiona y sigue el progreso de todos tus proyectos de diseño
                    </p>
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
                                        {project.description}
                                    </p>

                                    <div className="space-y-3 text-sm text-gray-500 mb-6">
                                        <div className="flex items-center">
                                            <FiPackage className="mr-2" />
                                            <span>
                                                {project.budget && project.budget > 0
                                                    ? `Costo: $${project.budget.toLocaleString()}`
                                                    : 'Presupuesto por definir'}
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <FiClock className="mr-2" />
                                            <span>Creado: {formatDate(project.createdAt)}</span>
                                        </div>
                                        {project.deadline && (
                                            <div className="flex items-center">
                                                <FiClock className="mr-2" />
                                                <span>Entrega: {formatDate(project.deadline)}</span>
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

                    {/* Estadísticas rápidas */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-xl shadow p-4">
                            <p className="text-sm text-gray-500">Total Proyectos</p>
                            <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
                        </div>
                        <div className="bg-white rounded-xl shadow p-4">
                            <p className="text-sm text-gray-500">En Progreso</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {projects.filter(p => p.status === 'in-progress').length}
                            </p>
                        </div>
                        <div className="bg-white rounded-xl shadow p-4">
                            <p className="text-sm text-gray-500">En Revisión</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {projects.filter(p => p.status === 'requested' || p.status === 'review').length}
                            </p>
                        </div>
                        <div className="bg-white rounded-xl shadow p-4">
                            <p className="text-sm text-gray-500">Completados</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {projects.filter(p => p.status === 'completed').length}
                            </p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}