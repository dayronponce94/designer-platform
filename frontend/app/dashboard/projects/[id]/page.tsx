'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthContext } from '@/app/providers/AuthProvider';
import Alert from '@/components/ui/Alert';
import ConfirmModal from '@/components/modals/ConfirmModal';
import {
    FiArrowLeft, FiClock, FiCheckCircle, FiAlertCircle,
    FiBriefcase, FiDollarSign, FiUser, FiCalendar,
    FiFile, FiMessageSquare, FiEdit, FiDownload,
    FiTrash2, FiMail, FiPhone, FiGlobe, FiEye,
    FiPaperclip, FiExternalLink, FiTag,
    FiFileText
} from 'react-icons/fi';

interface Project {
    _id: string;
    title: string;
    description: string;
    serviceType: string;
    status: string;
    budget: number;
    deadline: string;
    references: string;
    createdAt: string;
    updatedAt: string;
    client: {
        _id: string;
        name: string;
        email: string;
        company: string;
        phone: string;
    };
    designer?: {
        _id: string;
        name: string;
        email: string;
        specialty: string;
        bio: string;
        portfolio: string;
    };
    attachments: Array<{
        url: string;
        filename: string;
        filetype: string;
        size: number;
        uploadedAt: string;
    }>;
}

export default function ProjectDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuthContext();

    const [project, setProject] = useState<Project | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState<'overview' | 'files' | 'timeline'>('overview');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const projectId = params.id as string;

    useEffect(() => {
        fetchProject();
    }, [projectId]);

    const fetchProject = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/projects/${projectId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al cargar proyecto');
            }

            const data = await response.json();
            if (data.success) {
                setProject(data.data.project);
            } else {
                setError(data.message);
            }
        } catch (err: any) {
            setError(err.message || 'Error al cargar el proyecto');
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusConfig = (status: string) => {
        const configs: Record<string, { color: string; icon: React.ReactNode; label: string; desc: string }> = {
            'requested': {
                color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                icon: <FiClock className="w-4 h-4" />,
                label: 'Solicitado',
                desc: 'Tu proyecto está en revisión por nuestro equipo.'
            },
            'quoted': {
                color: 'bg-blue-100 text-blue-800 border-blue-200',
                icon: <FiDollarSign className="w-4 h-4" />,
                label: 'Cotizado',
                desc: 'Hemos enviado una cotización. Revisa y aprueba para continuar.'
            },
            'approved': {
                color: 'bg-green-100 text-green-800 border-green-200',
                icon: <FiCheckCircle className="w-4 h-4" />,
                label: 'Aprobado',
                desc: 'Proyecto aprobado. Pronto te asignaremos un diseñador.'
            },
            'in-progress': {
                color: 'bg-purple-100 text-purple-800 border-purple-200',
                icon: <FiBriefcase className="w-4 h-4" />,
                label: 'En Progreso',
                desc: 'Tu proyecto está siendo trabajado por un diseñador.'
            },
            'review': {
                color: 'bg-orange-100 text-orange-800 border-orange-200',
                icon: <FiEye className="w-4 h-4" />,
                label: 'En Revisión',
                desc: 'El diseñador ha subido entregables para tu revisión.'
            },
            'completed': {
                color: 'bg-green-100 text-green-800 border-green-200',
                icon: <FiCheckCircle className="w-4 h-4" />,
                label: 'Completado',
                desc: 'Proyecto finalizado y entregado satisfactoriamente.'
            },
            'cancelled': {
                color: 'bg-red-100 text-red-800 border-red-200',
                icon: <FiAlertCircle className="w-4 h-4" />,
                label: 'Cancelado',
                desc: 'Este proyecto ha sido cancelado.'
            }
        };

        return configs[status] || {
            color: 'bg-gray-100 text-gray-800 border-gray-200',
            icon: <FiAlertCircle className="w-4 h-4" />,
            label: status,
            desc: 'Estado desconocido'
        };
    };

    const getServiceTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            'branding': 'Branding & Identidad',
            'ux-ui': 'Diseño UX/UI',
            'graphic': 'Diseño Gráfico',
            'web': 'Diseño Web',
            'motion': 'Motion Graphics',
            'other': 'Otro'
        };
        return labels[type] || type;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleDeleteClick = () => {
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        setDeleteLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/projects/${projectId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al eliminar proyecto');
            }

            router.push('/dashboard/projects');
        } catch (err: any) {
            setError(err.message || 'Error al eliminar proyecto');
        } finally {
            setDeleteLoading(false);
            setDeleteModalOpen(false);
        }
    };

    if (!project) {
        return (
            <div className="text-center py-12">
                <FiAlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Proyecto no encontrado</h3>
                <p className="text-gray-600 mb-6">El proyecto que buscas no existe o no tienes acceso.</p>
                <button
                    onClick={() => router.push('/dashboard/projects')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    Volver a Mis Proyectos
                </button>
            </div>
        );
    }

    const statusConfig = getStatusConfig(project.status);

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={() => router.push('/dashboard/projects')}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
                >
                    <FiArrowLeft className="mr-2" />
                    Volver a Mis Proyectos
                </button>

                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
                        <div className="flex items-center flex-wrap gap-2 mt-2">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusConfig.color}`}>
                                {statusConfig.icon}
                                <span className="ml-1">{statusConfig.label}</span>
                            </span>
                            <span className="text-gray-600">•</span>
                            <span className="text-gray-600">{getServiceTypeLabel(project.serviceType)}</span>
                            <span className="text-gray-600">•</span>
                            <span className="text-gray-600">Creado: {formatDate(project.createdAt)}</span>
                        </div>
                        <p className="text-gray-600 mt-2">{statusConfig.desc}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {user?.role === 'client' && project.status === 'requested' && (
                            <button
                                onClick={() => router.push(`/dashboard/projects/${projectId}/edit`)}
                                className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                            >
                                <FiEdit className="mr-2" />
                                Editar
                            </button>
                        )}

                        <button
                            onClick={() => window.print()}
                            className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                        >
                            <FiFile className="mr-2" />
                            Imprimir
                        </button>

                        {user?.role === 'client' && (
                            <button
                                onClick={handleDeleteClick}
                                className="flex items-center px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition"
                            >
                                <FiTrash2 className="mr-2" />
                                Eliminar
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {error && <Alert type="error" message={error} onClose={() => setError('')} className="mb-6" />}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Columna principal */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Pestañas */}
                    <div className="bg-white rounded-xl shadow">
                        <div className="border-b border-gray-200">
                            <nav className="flex space-x-8 px-6">
                                <button
                                    onClick={() => setActiveTab('overview')}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'overview'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    Resumen
                                </button>
                                <button
                                    onClick={() => setActiveTab('files')}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'files'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    Archivos ({project.attachments.length})
                                </button>
                                <button
                                    onClick={() => setActiveTab('timeline')}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'timeline'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    Cronograma
                                </button>
                            </nav>
                        </div>

                        <div className="p-6">
                            {/* Contenido: Resumen */}
                            {activeTab === 'overview' && (
                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                            <FiFileText className="mr-2" />
                                            Descripción del Proyecto
                                        </h3>
                                        <div className="prose max-w-none">
                                            <div className="whitespace-pre-line text-gray-700 bg-gray-50 p-6 rounded-lg">
                                                {project.description}
                                            </div>
                                        </div>
                                    </div>

                                    {project.references && (
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                                <FiGlobe className="mr-2" />
                                                Referencias y Enlaces
                                            </h3>
                                            <div className="bg-blue-50 p-6 rounded-lg">
                                                <div className="whitespace-pre-line text-blue-700">
                                                    {project.references}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Contenido: Archivos */}
                            {activeTab === 'files' && (
                                <div>
                                    {project.attachments.length === 0 ? (
                                        <div className="text-center py-12">
                                            <FiFile className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay archivos adjuntos</h3>
                                            <p className="text-gray-600">No se han subido archivos de referencia para este proyecto.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {project.attachments.map((file, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                                                >
                                                    <div className="flex items-center flex-1 min-w-0">
                                                        <FiPaperclip className="text-gray-400 mr-3 shrink-0" />
                                                        <div className="min-w-0">
                                                            <p className="font-medium text-gray-900 truncate">
                                                                {file.filename}
                                                            </p>
                                                            <div className="flex items-center text-sm text-gray-500">
                                                                <span>{formatFileSize(file.size)}</span>
                                                                <span className="mx-2">•</span>
                                                                <span>{file.filetype}</span>
                                                                <span className="mx-2">•</span>
                                                                <span>Subido: {formatDateTime(file.uploadedAt)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <a
                                                            href={file.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition"
                                                            title="Ver archivo"
                                                        >
                                                            <FiEye />
                                                        </a>
                                                        <a
                                                            href={file.url}
                                                            download
                                                            className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition"
                                                            title="Descargar"
                                                        >
                                                            <FiDownload />
                                                        </a>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Contenido: Cronograma */}
                            {activeTab === 'timeline' && (
                                <div>
                                    <div className="space-y-6">
                                        <div className="relative pl-8 pb-8">
                                            <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                                            <div className="relative mb-6">
                                                <div className="absolute -left-6.5 top-0 w-4 h-4 bg-blue-600 rounded-full border-4 border-white"></div>
                                                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h4 className="font-semibold text-gray-900">Solicitud de Proyecto</h4>
                                                        <span className="text-sm text-gray-500">{formatDateTime(project.createdAt)}</span>
                                                    </div>
                                                    <p className="text-gray-600">Creaste la solicitud del proyecto "{project.title}"</p>
                                                </div>
                                            </div>

                                            <div className="relative mb-6">
                                                <div className="absolute -left-6.5 top-0 w-4 h-4 bg-green-600 rounded-full border-4 border-white"></div>
                                                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h4 className="font-semibold text-gray-900">Revisión por nuestro equipo</h4>
                                                        <span className="text-sm text-gray-500">Próximamente</span>
                                                    </div>
                                                    <p className="text-gray-600">Nuestro equipo revisará tu proyecto y te contactará.</p>
                                                </div>
                                            </div>

                                            {project.designer && (
                                                <div className="relative">
                                                    <div className="absolute -left-6.5 top-0 w-4 h-4 bg-purple-600 rounded-full border-4 border-white"></div>
                                                    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <h4 className="font-semibold text-gray-900">Asignación de Diseñador</h4>
                                                            <span className="text-sm text-gray-500">Pendiente</span>
                                                        </div>
                                                        <p className="text-gray-600">Te asignaremos un diseñador especializado en {getServiceTypeLabel(project.serviceType)}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {project.deadline && (
                                                <div className="relative mt-8">
                                                    <div className="absolute -left-6.5 top-0 w-4 h-4 bg-orange-600 rounded-full border-4 border-white"></div>
                                                    <div className="bg-white border border-orange-200 rounded-lg p-4 shadow-sm">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <h4 className="font-semibold text-gray-900">Fecha Límite</h4>
                                                            <span className="text-sm text-orange-600 font-medium">{formatDate(project.deadline)}</span>
                                                        </div>
                                                        <p className="text-gray-600">Fecha estimada de entrega del proyecto</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Información del proyecto */}
                    <div className="bg-white rounded-xl shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <FiTag className="mr-2" />
                            Detalles del Proyecto
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Tipo de Servicio</p>
                                <p className="font-medium flex items-center">
                                    <FiBriefcase className="mr-2 text-gray-400" />
                                    {getServiceTypeLabel(project.serviceType)}
                                </p>
                            </div>

                            {project.budget && project.budget > 0 ? (
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Presupuesto Máximo</p>
                                    <p className="font-medium flex items-center">
                                        <FiDollarSign className="mr-2 text-gray-400" />
                                        {`${project.budget.toLocaleString()}`}
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Presupuesto</p>
                                    <p className="font-medium flex items-center">
                                        <FiDollarSign className="mr-2 text-gray-400" />
                                        Presupuesto por definir
                                    </p>
                                </div>
                            )}

                            {project.deadline && (
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Fecha Límite</p>
                                    <p className="font-medium flex items-center">
                                        <FiCalendar className="mr-2 text-gray-400" />
                                        {formatDate(project.deadline)}
                                    </p>
                                </div>
                            )}

                            <div>
                                <p className="text-sm text-gray-500 mb-1">Creado el</p>
                                <p className="font-medium">{formatDateTime(project.createdAt)}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500 mb-1">Última actualización</p>
                                <p className="font-medium">{formatDateTime(project.updatedAt)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Información del cliente */}
                    <div className="bg-white rounded-xl shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <FiUser className="mr-2" />
                            Información del Cliente
                        </h3>

                        <div className="space-y-3">
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-3">
                                    {project.client.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{project.client.name}</p>
                                    <p className="text-sm text-gray-500">{project.client.email}</p>
                                </div>
                            </div>

                            {project.client.company && (
                                <div className="flex items-center text-gray-600">
                                    <FiBriefcase className="mr-2 text-gray-400" />
                                    <span>{project.client.company}</span>
                                </div>
                            )}

                            {project.client.phone && (
                                <div className="flex items-center text-gray-600">
                                    <FiPhone className="mr-2 text-gray-400" />
                                    <span>{project.client.phone}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Diseñador asignado */}
                    {project.designer && (
                        <div className="bg-white rounded-xl shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <FiUser className="mr-2" />
                                Diseñador Asignado
                            </h3>

                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold mr-3">
                                        {project.designer.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{project.designer.name}</p>
                                        <p className="text-sm text-gray-500">{project.designer.email}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Especialidad</p>
                                    <p className="font-medium capitalize">
                                        {project.designer.specialty.replace('-', ' ')}
                                    </p>
                                </div>

                                {project.designer.bio && (
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Biografía</p>
                                        <p className="text-sm text-gray-700 line-clamp-3">{project.designer.bio}</p>
                                    </div>
                                )}

                                {project.designer.portfolio && (
                                    <a
                                        href={project.designer.portfolio}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center text-blue-600 hover:text-blue-700"
                                    >
                                        <FiExternalLink className="mr-2" />
                                        Ver portafolio del diseñador
                                    </a>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Acciones rápidas */}
                    <div className="bg-white rounded-xl shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones</h3>

                        <div className="space-y-3">
                            <button
                                onClick={() => setActiveTab('files')}
                                className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                <FiFile className="mr-2" />
                                Ver Archivos
                            </button>

                            <button
                                onClick={() => {
                                    // Aquí se implementaría la función de contacto
                                    alert('Función de contacto por implementar');
                                }}
                                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                            >
                                <FiMessageSquare className="mr-2" />
                                Contactar Soporte
                            </button>

                            {project.status === 'quoted' && (
                                <button
                                    onClick={() => {
                                        // Aquí se implementaría la aprobación de cotización
                                        alert('Función de aprobación de cotización por implementar');
                                    }}
                                    className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                                >
                                    <FiCheckCircle className="mr-2" />
                                    Aprobar Cotización
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <ConfirmModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="¿Eliminar proyecto?"
                message="Esta acción no se puede deshacer. El proyecto y todos sus datos asociados serán eliminados permanentemente."
                confirmText={deleteLoading ? "Eliminando..." : "Eliminar Proyecto"}
                cancelText="Cancelar"
                type="danger"
            />
        </div>
    );
}