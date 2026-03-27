'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { designerQuoteAPI } from '@/app/lib/api/endpoints';
import Alert from '@/components/ui/Alert';
import ConfirmModal from '@/components/modals/ConfirmModal';
import {
    FiArrowLeft,
    FiDollarSign,
    FiCalendar,
    FiClock,
    FiCheckCircle,
    FiXCircle,
    FiFileText,
    FiUser,
    FiBriefcase,
    FiMessageSquare,
    FiTag
} from 'react-icons/fi';
import { useAuth } from '@/app/lib/hooks/useAuth';

export default function DesignerQuoteDetailPage() {
    const params = useParams();
    const router = useRouter();
    const quoteId = params.id as string;

    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';

    const backPath = isAdmin
        ? '/dashboard/admin/designer-quotes'
        : '/dashboard/designer/quotes';

    const [quote, setQuote] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const [showAcceptModal, setShowAcceptModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [notes, setNotes] = useState('');
    const [activeTab, setActiveTab] = useState<'overview' | 'details'>('overview');

    useEffect(() => {
        fetchQuote();
    }, [quoteId]);

    const fetchQuote = async () => {
        try {
            setLoading(true);
            const response = await designerQuoteAPI.getQuoteById(quoteId);
            setQuote(response.data.data.quote);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async () => {
        setActionLoading(true);
        setError('');
        try {
            await designerQuoteAPI.acceptQuote(quoteId, notes);
            setShowAcceptModal(false);
            setNotes('');
            await fetchQuote();
        } catch (err: any) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async () => {
        setActionLoading(true);
        try {
            await designerQuoteAPI.rejectQuote(quoteId, notes);
            setShowRejectModal(false);
            fetchQuote();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const getStatusConfig = (status: string) => {
        const configs: Record<string, { color: string; icon: React.ReactNode; label: string; desc: string }> = {
            pending: {
                color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                icon: <FiClock className="w-4 h-4" />,
                label: 'Pendiente',
                desc: 'Esta cotización está pendiente de tu respuesta.'
            },
            accepted: {
                color: 'bg-green-100 text-green-800 border-green-200',
                icon: <FiCheckCircle className="w-4 h-4" />,
                label: 'Aceptada',
                desc: 'Aceptaste esta cotización. Se ha creado un proyecto en tu área.'
            },
            rejected: {
                color: 'bg-red-100 text-red-800 border-red-200',
                icon: <FiXCircle className="w-4 h-4" />,
                label: 'Rechazada',
                desc: 'Rechazaste esta cotización.'
            }
        };
        return configs[status] || configs.pending;
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatDateTime = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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
            <div className="flex justify-center items-center min-h-64">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!quote) {
        return (
            <div className="text-center py-12">
                <FiFileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">Cotización no encontrada</h3>
                <button
                    onClick={() => router.push(backPath)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    Volver a Mis Cotizaciones
                </button>
            </div>
        );
    }

    const statusConfig = getStatusConfig(quote.status);

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={() => router.push(backPath)}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
                >
                    <FiArrowLeft className="mr-2" />
                    Volver a Mis Cotizaciones
                </button>

                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {quote.clientQuote?.request?.title || 'Cotización'}
                        </h1>
                        <div className="flex items-center flex-wrap gap-2 mt-2">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusConfig.color}`}>
                                {statusConfig.icon}
                                <span className="ml-1">{statusConfig.label}</span>
                            </span>
                            <span className="text-gray-600">•</span>
                            <span className="text-gray-600">Recibida: {formatDate(quote.createdAt)}</span>
                        </div>
                        <p className="text-gray-600 mt-2">{statusConfig.desc}</p>
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
                            </nav>
                        </div>

                        <div className="p-6">
                            {/* Resumen */}
                            {activeTab === 'overview' && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                            <FiFileText className="mr-2" />
                                            Descripción
                                        </h3>
                                        <div className="whitespace-pre-line text-gray-700 bg-gray-50 p-6 rounded-lg">
                                            {quote.description}
                                        </div>
                                    </div>

                                    {/* Notas del administrador */}
                                    {quote.adminNotes && (
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                                <FiMessageSquare className="mr-2" />
                                                Notas del administrador
                                            </h3>
                                            <div className="bg-blue-50 p-6 rounded-lg text-blue-700">
                                                {quote.adminNotes}
                                            </div>
                                        </div>
                                    )}
                                    {/* Notas del diseñador */}
                                    {quote.designerNotes && (
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                                <FiMessageSquare className="mr-2" />
                                                Notas del diseñador
                                            </h3>
                                            <div className="bg-green-50 p-6 rounded-lg text-green-700">
                                                {quote.designerNotes}
                                            </div>
                                        </div>
                                    )}

                                    {/* Si eres Admin, podrías mostrar algo informativo en lugar de acciones */}
                                    {isAdmin && (
                                        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                                            <h3 className="text-lg font-semibold text-blue-900 mb-2">Vista de Administrador</h3>
                                            <p className="text-blue-700 text-sm">
                                                Estás visualizando los detalles de una cotización enviada a un diseñador. Como administrador, solo puedes supervisar el contenido y el estado de la misma.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>
                    </div>
                </div>


                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Información de la cotización */}
                    <div className="bg-white rounded-xl shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <FiTag className="mr-2" />
                            Detalles de la Cotización
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Monto</p>
                                <p className="font-medium flex items-center">
                                    <FiDollarSign className="mr-2 text-gray-400" />
                                    {quote.amount.toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Tipo de servicio</p>
                                <p className="font-medium flex items-center">
                                    <FiBriefcase className="mr-2 text-gray-400" />
                                    {quote.clientQuote?.request?.serviceType
                                        ? getServiceTypeLabel(quote.clientQuote.request.serviceType)
                                        : 'No especificado'}
                                </p>
                            </div>
                            {quote.deadline && (
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Fecha de entrega</p>
                                    <p className="font-medium flex items-center">
                                        <FiCalendar className="mr-2 text-gray-400" />
                                        {formatDate(quote.deadline)}
                                    </p>
                                </div>
                            )}
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Creada el</p>
                                <p className="font-medium flex items-center">
                                    <FiClock className="mr-2 text-gray-400" />
                                    {formatDateTime(quote.createdAt)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Cliente */}
                    {quote.clientQuote?.request?.client && (
                        <div className="bg-white rounded-xl shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <FiUser className="mr-2" />
                                Cliente
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-3">
                                        {quote.clientQuote.request.client.name?.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {quote.clientQuote.request.client.name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {quote.clientQuote.request.client.email}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Acciones */}
                    {!isAdmin && (
                        <div className="bg-white rounded-xl shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones</h3>
                            <div className="space-y-3">
                                {quote.status === 'pending' && (
                                    <>
                                        <button
                                            onClick={() => setShowAcceptModal(true)}
                                            className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                                        >
                                            <FiCheckCircle className="mr-2" />
                                            Aceptar Cotización
                                        </button>
                                        <button
                                            onClick={() => setShowRejectModal(true)}
                                            className="w-full flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                        >
                                            <FiXCircle className="mr-2" />
                                            Rechazar Cotización
                                        </button>
                                    </>
                                )}

                                {quote.status === 'accepted' && (
                                    <div className="bg-green-50 p-4 rounded-lg text-green-700 flex items-center">
                                        <FiCheckCircle className="mr-2 shrink-0" />
                                        <span>Cotización aceptada.</span>
                                    </div>
                                )}

                                {quote.status === 'rejected' && (
                                    <div className="bg-red-50 p-4 rounded-lg text-red-700 flex items-center">
                                        <FiXCircle className="mr-2 shrink-0" />
                                        <span>Cotización rechazada.</span>
                                    </div>
                                )}

                                <button
                                    onClick={() => router.push(`/dashboard/designer/projects?quote=${quote._id}`)}
                                    className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                                >
                                    <FiBriefcase className="mr-2" />
                                    Ver Proyectos
                                </button>
                            </div>
                        </div>
                    )}
                </div>

            </div>


            {/* Modales */}
            {!isAdmin && (
                <>
                    <ConfirmModal
                        isOpen={showAcceptModal}
                        onClose={() => {
                            setShowAcceptModal(false);
                            setNotes('');
                        }}
                        onConfirm={handleAccept}
                        title="Aceptar cotización"
                        message={
                            <div>
                                <p className="mb-4">Al aceptar, se creará un proyecto en tu panel. Puedes agregar notas.</p>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Puedes agregar notas o comentarios (opcional)"
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={3}
                                    maxLength={500}
                                />
                                <div className="flex justify-between items-center mt-2">
                                    <p className="text-xs text-gray-500">
                                        {notes.length}/500 caracteres
                                    </p>
                                </div>
                            </div>
                        }
                        confirmText={actionLoading ? 'Aceptando...' : 'Sí, aceptar'}
                        cancelText="Cancelar"
                        type="success"
                    />

                    <ConfirmModal
                        isOpen={showRejectModal}
                        onClose={() => {
                            setShowRejectModal(false);
                            setNotes('');
                        }}
                        onConfirm={handleReject}
                        title="Rechazar cotización"
                        message={
                            <div>
                                <p className="mb-4">¿Estás seguro? Puedes indicar el motivo.</p>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Motivo del rechazo (opcional)"
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={3}
                                    maxLength={500}
                                />
                                <div className="flex justify-between items-center mt-2">
                                    <p className="text-xs text-gray-500">
                                        {notes.length}/500 caracteres
                                    </p>
                                </div>
                            </div>
                        }
                        confirmText={actionLoading ? 'Rechazando...' : 'Sí, rechazar'}
                        cancelText="Cancelar"
                        type="danger"
                    />
                </>
            )}
        </div>
    );
}