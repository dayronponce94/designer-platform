'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthContext } from '@/app/providers/AuthProvider';
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
    FiMail,
} from 'react-icons/fi';

interface Quote {
    _id: string;
    request: {
        _id: string;
        title: string;
        description: string;
        serviceType: string;
        status: string;
        client: { _id: string; name: string; email: string };
    };
    createdBy: { _id: string; name: string; email: string };
    amount: number;
    deadline: string;
    description: string;
    adminNotes?: string;
    clientNotes?: string;
    status: 'pending' | 'accepted' | 'rejected' | 'expired';
    validUntil?: string;
    createdAt: string;
    acceptedAt?: string;
    rejectedAt?: string;
}

export default function QuoteDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuthContext();
    const quoteId = params.id as string;

    // Lógica de roles
    const isAdmin = user?.role === 'admin';
    const backPath = isAdmin ? '/dashboard/admin/client-quotes' : '/dashboard/quotes';

    const [quote, setQuote] = useState<Quote | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const [showAcceptModal, setShowAcceptModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [clientNotes, setClientNotes] = useState('');

    useEffect(() => {
        fetchQuote();
    }, [quoteId]);

    const fetchQuote = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/quotes/${quoteId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) {
                setQuote(data.data.quote);
            } else {
                setError(data.message || 'Error al cargar cotización');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAccept = async () => {
        setActionLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/quotes/${quoteId}/accept`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ clientNotes }),
            });
            const data = await res.json();
            if (data.success) {
                setShowAcceptModal(false);
                fetchQuote(); // recargar
            } else {
                setError(data.message || 'Error al aceptar');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async () => {
        setActionLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/quotes/${quoteId}/reject`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ clientNotes }),
            });
            const data = await res.json();
            if (data.success) {
                setShowRejectModal(false);
                fetchQuote();
            } else {
                setError(data.message || 'Error al rechazar');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return 'No definida';
        return new Date(dateStr).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const getStatusBadge = (status: string) => {
        const config: Record<string, { color: string; icon: React.ReactNode; text: string }> = {
            pending: { color: 'bg-yellow-100 text-yellow-800', icon: <FiClock />, text: 'Pendiente' },
            accepted: { color: 'bg-green-100 text-green-800', icon: <FiCheckCircle />, text: 'Aceptada' },
            rejected: { color: 'bg-red-100 text-red-800', icon: <FiXCircle />, text: 'Rechazada' },
            expired: { color: 'bg-gray-100 text-gray-800', icon: <FiClock />, text: 'Expirada' },
        };
        const c = config[status] || config.pending;
        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${c.color}`}>
                {c.icon}
                <span className="ml-1">{c.text}</span>
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

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-64">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!quote) {
        return (
            <div className="text-center py-12">
                <FiFileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900">Cotización no encontrada</h3>
                <button
                    onClick={() => router.push(backPath)}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Volver a cotizaciones
                </button>
            </div>
        );
    }

    return (
        <div>
            <button
                onClick={() => router.push(backPath)}
                className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
            >
                <FiArrowLeft className="mr-2" />
                Volver a cotizaciones
            </button>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Cotización para "{quote.request.title}"</h1>
                            <p className="text-sm text-gray-500 mt-1">{getServiceTypeLabel(quote.request.serviceType)} </p>
                        </div>
                        {getStatusBadge(quote.status)}
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Detalles principales */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Monto</p>
                                <p className="text-2xl font-bold text-gray-900 flex items-center">
                                    <FiDollarSign className="mr-1 text-gray-400" />
                                    {quote.amount.toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Fecha límite de entrega</p>
                                <p className="flex items-center text-gray-700">
                                    <FiCalendar className="mr-2 text-gray-400" />
                                    {formatDate(quote.deadline)}
                                </p>
                            </div>
                            {quote.validUntil && (
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Válido hasta</p>
                                    <p className="flex items-center text-gray-700">
                                        <FiClock className="mr-2 text-gray-400" />
                                        {formatDate(quote.validUntil)}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Creada por</p>
                                <p className="flex items-center text-gray-700">
                                    <FiUser className="mr-2 text-gray-400" />
                                    {quote.createdBy.name}
                                </p>
                                <p className="flex items-center text-gray-600 text-sm mt-1">
                                    <FiMail className="mr-2 text-gray-400" />
                                    {quote.createdBy.email}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Fecha de creación</p>
                                <p className="text-gray-700">{formatDate(quote.createdAt)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Descripción de la cotización */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Descripción de la cotización</h3>
                        <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-line text-gray-700">
                            {quote.description}
                        </div>
                    </div>

                    {/* Notas del admin */}
                    {quote.adminNotes && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Notas del administrador</h3>
                            <div className="bg-blue-50 p-4 rounded-lg text-blue-700">
                                {quote.adminNotes}
                            </div>
                        </div>
                    )}

                    {/* Notas del cliente (si ya respondió) */}
                    {quote.clientNotes && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Notas del cliente</h3>
                            <div className="bg-green-50 p-4 rounded-lg text-green-700">
                                {quote.clientNotes}
                            </div>
                        </div>
                    )}

                    {/* Acciones para cotización pendiente */}
                    {!isAdmin && quote.status === 'pending' && (
                        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
                            <button
                                onClick={() => setShowAcceptModal(true)}
                                className="flex-1 flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                            >
                                <FiCheckCircle className="mr-2" />
                                Aceptar cotización
                            </button>
                            <button
                                onClick={() => setShowRejectModal(true)}
                                className="flex-1 flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                            >
                                <FiXCircle className="mr-2" />
                                Rechazar cotización
                            </button>
                        </div>
                    )}

                    {/* Mensaje si ya fue aceptada o rechazada */}
                    {quote.status === 'accepted' && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700">
                            <FiCheckCircle className="inline mr-2" />
                            Cotización aceptada el {formatDate(quote.acceptedAt)}. El proyecto pasará a estado "Aprobado".
                        </div>
                    )}
                    {quote.status === 'rejected' && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                            <FiXCircle className="inline mr-2" />
                            Cotización rechazada el {formatDate(quote.rejectedAt)}. El administrador puede generar una nueva.
                        </div>
                    )}
                </div>
            </div>

            {/* Si eres Admin, podrías mostrar algo informativo en lugar de acciones */}
            {isAdmin && (
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Vista de Administrador</h3>
                    <p className="text-blue-700 text-sm">
                        Estás visualizando los detalles de una cotización enviada a un cliente. Como administrador, solo puedes supervisar el contenido y el estado de la misma.
                    </p>
                </div>
            )}
            {/* Modal de confirmación para aceptar */}
            {!isAdmin && (
                <>
                    <ConfirmModal
                        isOpen={showAcceptModal}
                        onClose={() => setShowAcceptModal(false)}
                        onConfirm={handleAccept}
                        title="Aceptar cotización"
                        message={
                            <div>
                                <p className="mb-4">¿Estás seguro de que deseas aceptar esta cotización? Esta acción no se puede deshacer.</p>
                                <textarea
                                    value={clientNotes}
                                    onChange={(e) => setClientNotes(e.target.value)}
                                    placeholder="Puedes agregar notas o comentarios (opcional)"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={3}
                                    maxLength={500}
                                />
                                <div className="flex justify-between items-center mt-2">
                                    <p className="text-xs text-gray-500">
                                        {clientNotes.length}/500 caracteres
                                    </p>
                                </div>
                            </div>
                        }
                        confirmText={actionLoading ? 'Aceptando...' : 'Sí, aceptar'}
                        cancelText="Cancelar"
                        type="success"
                    />

                    {/* Modal de confirmación para rechazar */}
                    <ConfirmModal
                        isOpen={showRejectModal}
                        onClose={() => setShowRejectModal(false)}
                        onConfirm={handleReject}
                        title="Rechazar cotización"
                        message={
                            <div>
                                <p className="mb-4">¿Estás seguro de que deseas rechazar esta cotización? Puedes indicar el motivo.</p>
                                <textarea
                                    value={clientNotes}
                                    onChange={(e) => setClientNotes(e.target.value)}
                                    placeholder="Motivo del rechazo (opcional)"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={3}
                                    maxLength={500}
                                />
                                <div className="flex justify-between items-center mt-2">
                                    <p className="text-xs text-gray-500">
                                        {clientNotes.length}/500 caracteres
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