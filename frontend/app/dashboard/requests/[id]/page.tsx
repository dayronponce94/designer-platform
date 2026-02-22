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

interface Request {
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
    attachments: Array<{
        url: string;
        filename: string;
        filetype: string;
        size: number;
        uploadedAt: string;
    }>;
}
const STATUS_CONFIG: Record<string, { color: string; icon: React.ReactNode; label: string; desc: string }> = {
    'requested': {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: <FiClock className="w-4 h-4" />,
        label: 'Solicitado',
        desc: 'Tu solicitud está pendiente de revisión. Pronto recibirás una cotización.'
    },
    'quoted': {
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: <FiFileText className="w-4 h-4" />,
        label: 'Cotizado',
        desc: 'Ya tienes una cotización disponible. Revisa los detalles y decide si deseas continuar.'
    },
    'cancelled': {
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: <FiAlertCircle className="w-4 h-4" />,
        label: 'Cancelado',
        desc: 'Esta solicitud ha sido cancelada.'
    }
};

export default function RequestDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuthContext();

    const [request, setRequest] = useState<Request | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState<'overview' | 'files' | 'timeline'>('overview');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const requestId = params.id as string;

    useEffect(() => {
        fetchRequest();
    }, [requestId]);

    const fetchRequest = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/requests/${requestId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al cargar solicitud');
            }

            const data = await response.json();
            if (data.success) {
                setRequest(data.data.request);
            } else {
                setError(data.message);
            }
        } catch (err: any) {
            setError(err.message || 'Error al cargar la solicitud');
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
                desc: 'Tu solicitud está pendiente de revisión. Pronto recibirás una cotización.'
            },
            'quoted': {
                color: 'bg-blue-100 text-blue-800 border-blue-200',
                icon: <FiFileText className="w-4 h-4" />,
                label: 'Cotizado',
                desc: 'Ya tienes una cotización disponible. Revisa los detalles y decide si deseas continuar.'
            },
            'cancelled': {
                color: 'bg-red-100 text-red-800 border-red-200',
                icon: <FiAlertCircle className="w-4 h-4" />,
                label: 'Cancelado',
                desc: 'Esta solicitud ha sido cancelada.'
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

    const handleDeleteClick = () => {
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        setDeleteLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/requests/${requestId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al eliminar solicitud');
            }

            router.push('/dashboard/requests');
        } catch (err: any) {
            setError(err.message || 'Error al eliminar solicitud');
        } finally {
            setDeleteLoading(false);
            setDeleteModalOpen(false);
        }
    };

    if (!request) {
        return (
            <div className="text-center py-12">
                <FiAlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Solicitud no encontrada</h3>
                <p className="text-gray-600 mb-6">La solicitud que buscas no existe o no tienes acceso.</p>
                <button
                    onClick={() => router.push('/dashboard/requests')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    Volver a Mis Solicitudes
                </button>
            </div>
        );
    }

    const statusConfig = getStatusConfig(request.status);

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={() => {
                        if (user?.role === 'admin') {
                            router.push('/dashboard/admin/requests');
                        } else {
                            router.push('/dashboard/requests');
                        }
                    }}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
                >
                    <FiArrowLeft className="mr-2" />
                    Volver a Mis Solicitudes
                </button>


                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{request.title}</h1>
                        <div className="flex items-center flex-wrap gap-2 mt-2">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusConfig.color}`}>
                                {statusConfig.icon}
                                <span className="ml-1">{statusConfig.label}</span>
                            </span>
                            <span className="text-gray-600">•</span>
                            <span className="text-gray-600">{getServiceTypeLabel(request.serviceType)}</span>
                            <span className="text-gray-600">•</span>
                            <span className="text-gray-600">Creado: {formatDate(request.createdAt)}</span>
                        </div>
                        <p className="text-gray-600 mt-2">{statusConfig.desc}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {user?.role === 'client' && request.status === 'requested' && (
                            <button
                                onClick={() => router.push(`/dashboard/requests/${requestId}/edit`)}
                                className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                            >
                                <FiEdit className="mr-2" />
                                Editar
                            </button>
                        )}

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
                                    Archivos ({request.attachments.length})
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
                                                {request.description}
                                            </div>
                                        </div>
                                    </div>

                                    {request.references && (
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                                <FiGlobe className="mr-2" />
                                                Referencias y Enlaces
                                            </h3>
                                            <div className="bg-blue-50 p-6 rounded-lg">
                                                <div className="whitespace-pre-line text-blue-700">
                                                    {request.references}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Contenido: Archivos */}
                            {activeTab === 'files' && (
                                <div>
                                    {request.attachments.length === 0 ? (
                                        <div className="text-center py-12">
                                            <FiFile className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay archivos adjuntos</h3>
                                            <p className="text-gray-600">No se han subido archivos de referencia para este proyecto.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {request.attachments.map((file, index) => (
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
                                    {getServiceTypeLabel(request.serviceType)}
                                </p>
                            </div>

                            {request.budget && request.budget > 0 ? (
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Presupuesto Máximo</p>
                                    <p className="font-medium flex items-center">
                                        <FiDollarSign className="mr-2 text-gray-400" />
                                        {`${request.budget.toLocaleString()}`}
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

                            {request.deadline && (
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Fecha Límite</p>
                                    <p className="font-medium flex items-center">
                                        <FiCalendar className="mr-2 text-gray-400" />
                                        {formatDate(request.deadline)}
                                    </p>
                                </div>
                            )}

                            <div>
                                <p className="text-sm text-gray-500 mb-1">Creado el</p>
                                <p className="font-medium">{formatDateTime(request.createdAt)}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500 mb-1">Última actualización</p>
                                <p className="font-medium">{formatDateTime(request.updatedAt)}</p>
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
                                    {request.client.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{request.client.name}</p>
                                    <p className="text-sm text-gray-500">{request.client.email}</p>
                                </div>
                            </div>

                            {request.client.company && (
                                <div className="flex items-center text-gray-600">
                                    <FiBriefcase className="mr-2 text-gray-400" />
                                    <span>{request.client.company}</span>
                                </div>
                            )}

                            {request.client.phone && (
                                <div className="flex items-center text-gray-600">
                                    <FiPhone className="mr-2 text-gray-400" />
                                    <span>{request.client.phone}</span>
                                </div>
                            )}
                        </div>
                    </div>



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