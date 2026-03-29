'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthContext } from '@/app/providers/AuthProvider';
import Alert from '@/components/ui/Alert';
import {
    FiArrowLeft, FiClock, FiCheckCircle, FiAlertCircle,
    FiBriefcase, FiDollarSign, FiUser, FiCalendar,
    FiFile, FiMessageSquare, FiEdit, FiDownload,
    FiPhone, FiGlobe, FiEye,
    FiPaperclip, FiExternalLink, FiTag,
    FiFileText, FiUpload,
    FiLink
} from 'react-icons/fi';
import Link from 'next/dist/client/link';

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
    // Estos son los archivos generales (brief del cliente)
    attachments: Array<{
        url: string;
        filename: string;
        filetype: string;
        size: number;
        uploadedAt: string;
    }>;

    clientView: {
        description: string;
        budget: number;
        deadline: string;
        attachments: Array<{
            url: string;
            filename: string;
            filetype: string;
            size: number;
            uploadedAt: string;
        }>;
    };

    // Agregamos la vista específica para el diseñador
    designerView: {
        description: string;
        earnings: number;
        internalDeadline: string;
        attachments: Array<any>; // Archivos que el diseñador suba después
    };

    // Dentro de interface Project
    deliverables?: Array<{
        url: string;
        filename: string;
        filetype: string;
        size: number;
        uploadedAt: string;
        version: number;
        _id: string;
    }>;
}

export default function ProjectDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuthContext();

    const [project, setProject] = useState<Project | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState<'overview' | 'files' | 'timeline' | 'final-files'>('overview');


    const projectId = params.id as string;

    const isAdmin = user?.role === 'admin';
    const isDesigner = user?.role === 'designer';
    const isClient = user?.role === 'client';

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
                desc: 'El proyecto está en revisión por el equipo administrativo.'
            },
            'quoted': {
                color: 'bg-blue-100 text-blue-800 border-blue-200',
                icon: <FiDollarSign className="w-4 h-4" />,
                label: 'Cotizado',
                desc: 'Se ha enviado una cotización al cliente.'
            },
            'approved': {
                color: 'bg-blue-100 text-blue-800 border-blue-200',
                icon: <FiCheckCircle className="w-4 h-4" />,
                label: 'Aprobado',
                desc: 'Proyecto aprobado. Listo para comenzar el trabajo de diseño.'
            },
            'in-progress': {
                color: 'bg-purple-100 text-purple-800 border-purple-200',
                icon: <FiBriefcase className="w-4 h-4" />,
                label: 'En Progreso',
                desc: 'El diseñador está trabajando actualmente en los entregables.'
            },
            'review': {
                color: 'bg-orange-100 text-orange-800 border-orange-200',
                icon: <FiEye className="w-4 h-4" />,
                label: 'En Revisión',
                desc: 'El proyecto está siendo revisado por el cliente o el equipo administrativo.'
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

    if (isLoading) return <div className="p-8 text-center">Cargando detalles del proyecto...</div>;

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


    // 1. Archivos: Queremos ver los que subió el cliente (clientView) 
    // y, si existen, los que subió el diseñador (designerView)
    const clientFiles = project.clientView?.attachments || [];
    const designerFiles = project.designerView?.attachments || [];
    const allAttachments = [...clientFiles, ...designerFiles];

    // 2. Descripción: Mostramos su "Propuesta Estética" (designerView)
    const displayDescription = project.designerView?.description || 'Sin descripción';

    // Extraemos la fecha correcta dependiendo de si es diseñador o no
    const rawDeadline = isDesigner
        ? project.designerView?.internalDeadline
        : project.clientView?.deadline;

    // Función para limpiar el formato de MongoDB si es necesario
    const displayDeadline = typeof rawDeadline === 'object' && rawDeadline !== null && '$date' in rawDeadline
        ? (rawDeadline as any).$date
        : rawDeadline;

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={() => {
                        if (isAdmin) {
                            router.push('/dashboard/admin/projects');
                        } else if (isDesigner) {
                            router.push('/dashboard/designer/projects');
                        } else {
                            // Para clientes o cualquier otro rol base
                            router.push('/dashboard/projects');
                        }
                    }}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
                >
                    <FiArrowLeft className="mr-2" />
                    {isDesigner
                        ? 'Volver a Proyectos Asignados'
                        : isAdmin
                            ? 'Volver a Proyectos'
                            : 'Volver a Mis Proyectos'}
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
                        {/* Botón Editar: Solo Admin */}
                        {isAdmin && (
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
                                    Archivos ({allAttachments.length})
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
                                {/* Nueva pestaña: Solo visible si hay entregables o si no es cliente en fase inicial */}
                                <button
                                    onClick={() => setActiveTab('final-files')}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'final-files' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                                >
                                    Entregable ({project.deliverables?.length || 0})
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
                                                {displayDescription}
                                            </div>
                                        </div>
                                    </div>

                                    {(isDesigner || isAdmin) && project.references && (
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
                                    <div className="flex justify-between items-center mb-6">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">Archivos de Ejemplos</h3>
                                            <p className="text-sm text-gray-500">Aquí encontrarás los archivos de ejemplo para este proyecto.</p>
                                        </div>
                                    </div>

                                    {allAttachments.length === 0 ? (
                                        <div className="text-center py-12">
                                            <FiFile className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay archivos adjuntos</h3>
                                            <p className="text-gray-600">No se han subido archivos para este proyecto.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {allAttachments.map((file, index) => (
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
                                                                <span>{formatDateTime(file.uploadedAt)}</span>
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
                                <div className="space-y-6">
                                    <div className="relative pl-8 pb-8">
                                        <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                                        <div className="relative mb-6">
                                            <div className="absolute -left-[1.35rem] top-0 w-4 h-4 bg-blue-600 rounded-full border-4 border-white"></div>
                                            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="font-semibold text-gray-900">Solicitud de Proyecto</h4>
                                                    <span className="text-sm text-gray-500">{formatDateTime(project.createdAt)}</span>
                                                </div>
                                                <p className="text-gray-600">El cliente creó la solicitud del proyecto "{project.title}"</p>
                                            </div>
                                        </div>

                                        <div className="relative mb-6">
                                            <div className={`absolute -left-[1.35rem] top-0 w-4 h-4 rounded-full border-4 border-white ${['quoted', 'approved', 'in-progress', 'review', 'completed'].includes(project.status) ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                                            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="font-semibold text-gray-900">Revisión y Cotización</h4>
                                                    <span className="text-sm text-gray-500">{project.status === 'requested' ? 'Pendiente' : 'Completado'}</span>
                                                </div>
                                                <p className="text-gray-600">Revisión administrativa y emisión de presupuesto.</p>
                                            </div>
                                        </div>

                                        {project.designer && (
                                            <div className="relative">
                                                <div className="absolute -left-[1.35rem] top-0 w-4 h-4 bg-purple-600 rounded-full border-4 border-white"></div>
                                                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h4 className="font-semibold text-gray-900">Asignación de Diseñador</h4>
                                                        <span className="text-sm text-gray-500">Asignado</span>
                                                    </div>
                                                    <p className="text-gray-600">Diseñador asignado: {project.designer.name}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                            {/* Contenido: Entregable Final */}
                            {activeTab === 'final-files' && (
                                <div>
                                    <div className="flex justify-between items-center mb-6">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">Entregables Finales del Proyecto</h3>
                                            <p className="text-sm text-gray-500">Aquí encontrarás los productos terminados listos para descargar.</p>
                                        </div>
                                    </div>

                                    {!project.deliverables || project.deliverables.length === 0 ? (
                                        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                            <FiBriefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                            <h3 className="text-md font-medium text-gray-900">Aún no hay entregables</h3>
                                            <p className="text-gray-500 text-sm">El diseñador subirá los archivos finales una vez completado el trabajo.</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 gap-4">
                                            {project.deliverables.map((file) => (
                                                <div
                                                    key={file._id}
                                                    className="flex items-center justify-between p-5 border border-blue-100 bg-blue-50/30 rounded-xl hover:bg-blue-50 transition"
                                                >
                                                    <div className="flex items-center min-w-0">
                                                        <div className="p-3 bg-blue-100 rounded-lg mr-4">
                                                            <FiLink className="text-blue-600 w-6 h-6" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-bold text-gray-900 truncate">{file.filename}</p>
                                                            <div className="flex items-center text-xs text-gray-500 mt-1">
                                                                <span className="bg-blue-600 text-white px-2 py-0.5 rounded mr-2">Versión {file.version}</span>
                                                                <span>{formatFileSize(file.size)}</span>
                                                                <span className="mx-2">•</span>
                                                                <span>Subido el {formatDate(file.uploadedAt)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <a
                                                        href={file.url}
                                                        download

                                                        className="p-2 text-green-600 hover:text-green-700 hover:bg-green-200 rounded-lg transition"
                                                        title="Descargar entregable"
                                                    >
                                                        <FiDownload />
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    )}
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

                            {/* Costo: Solo visible Cliente */}
                            {isClient && (
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Costo</p>
                                    <p className="font-medium flex items-center">
                                        <FiDollarSign className="mr-2 text-gray-400" />
                                        {project.clientView?.budget && project.clientView.budget > 0
                                            ? `${project.clientView.budget.toLocaleString()}`
                                            : 'Costo por definir'}
                                    </p>
                                </div>
                            )}

                            {/* Pago: Solo visible Diseñador */}
                            {isDesigner && (
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Pago</p>
                                    <p className="font-medium flex items-center">
                                        <FiDollarSign className="mr-2" />
                                        {project.designerView?.earnings
                                            ? `${project.designerView.earnings.toLocaleString()}`
                                            : 'No asignado'}
                                    </p>
                                </div>
                            )}

                            {/* Presupuesto Total(Costo Cliente, Pago Diseñador, Ganacias Netas): Solo visible Admin */}
                            {isAdmin && (
                                <>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Costo Cliente</p>
                                        <p className="font-medium flex items-center">
                                            <FiDollarSign className="mr-2 text-gray-400" />
                                            {project.clientView?.budget && project.clientView.budget > 0
                                                ? `${project.clientView.budget.toLocaleString()}`
                                                : 'Costo por definir'}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Pago Diseñador</p>
                                        <p className="font-medium flex items-center">
                                            <FiDollarSign className="mr-2 text-gray-400" />
                                            {project.designerView?.earnings
                                                ? `${project.designerView.earnings.toLocaleString()}`
                                                : 'No asignado'}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Ganancia Neta</p>
                                        <p className="font-medium flex items-center">
                                            <FiDollarSign className="mr-2 text-gray-400" />
                                            {project.clientView?.budget && project.designerView?.earnings
                                                ? (project.clientView.budget - project.designerView.earnings).toLocaleString()
                                                : 'Ganancia por definir'}
                                        </p>
                                    </div>
                                </>
                            )}

                            {displayDeadline && (
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">
                                        {isDesigner ? 'Fecha de Entrega' : 'Fecha Límite'}
                                    </p>
                                    <p className="font-medium flex items-center">
                                        <FiCalendar className="mr-2 text-gray-400" />
                                        {formatDate(displayDeadline)}
                                    </p>
                                </div>
                            )}

                            <div>
                                <p className="text-sm text-gray-500 mb-1">Última actualización</p>
                                <p className="font-medium">{formatDateTime(project.updatedAt)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Información del cliente: Solo visible para Admin o Diseñador Asignado */}
                    {(user?.role === 'admin' || user?.role === 'designer') && (
                        <div className="bg-white rounded-xl shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <FiUser className="mr-2" />
                                Información del Cliente
                            </h3>

                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-3">
                                        {project.client?.name?.charAt(0) || 'C'}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{project.client.name}</p>
                                        <p className="text-sm text-gray-500">{project.client.email}</p>
                                    </div>
                                </div>
                                {project.client.company && (
                                    <div className="flex items-center text-gray-600 text-sm">
                                        <FiBriefcase className="mr-2 text-gray-400" />
                                        <span>{project.client.company}</span>
                                    </div>
                                )}
                                {project.client.phone && (
                                    <div className="flex items-center text-gray-600 text-sm">
                                        <FiPhone className="mr-2 text-gray-400" />
                                        <span>{project.client.phone}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Diseñador asignado: Visible para Admin y Cliente, pero oculto para el propio Diseñador */}
                    {user?.role !== 'designer' && project.designer && (
                        <div className="bg-white rounded-xl shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <FiUser className="mr-2" />
                                Diseñador Asignado
                            </h3>

                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold mr-3">
                                        {project.designer.name?.charAt(0) || 'D'}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{project.designer.name}</p>
                                        <p className="text-sm text-gray-500">{project.designer.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center text-gray-600 text-sm">
                                    <FiTag className="mr-2 text-gray-400" />
                                    <span>
                                        {project.designer.specialty
                                            ? getServiceTypeLabel(project.designer.specialty)
                                            : 'Sin especialidad'}</span>
                                </div>

                                {project.designer.portfolio && (
                                    <a
                                        href={project.designer.portfolio}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center text-sm text-blue-600 hover:text-blue-700"
                                    >
                                        <FiExternalLink className="mr-2" />
                                        Ver portafolio
                                    </a>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Acciones Rápidas */}
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

                            <Link
                                href="/contact"
                                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                            >
                                <FiMessageSquare className="mr-2" /> Contactar Soporte
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}