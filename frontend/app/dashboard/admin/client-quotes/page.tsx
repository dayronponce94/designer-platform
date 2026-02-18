'use client';

import { useState, useEffect } from 'react';
import { adminAPI } from '@/app/lib/api/endpoints';
import Alert from '@/components/ui/Alert';
import { FiFileText, FiClock, FiCheckCircle, FiXCircle, FiEye, FiUser, FiDollarSign, FiCalendar, FiUserPlus } from 'react-icons/fi';
import Link from 'next/link';
import CreateDesignerQuoteModal from '@/components/modals/CreateDesignerQuoteModal';

interface ClientQuote {
    _id: string;
    project: {
        _id: string;
        title: string;
        serviceType: string;
        client: { _id: string; name: string; email: string };
    };
    createdBy: { name: string; email: string };
    amount: number;
    deadline?: string;
    description: string;
    status: 'pending' | 'accepted' | 'rejected' | 'expired';
    createdAt: string;
    validUntil?: string;
}

export default function AdminClientQuotesPage() {
    const [quotes, setQuotes] = useState<ClientQuote[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedQuote, setSelectedQuote] = useState<ClientQuote | null>(null);
    const [showDesignerModal, setShowDesignerModal] = useState(false);

    useEffect(() => {
        fetchQuotes();
    }, []);

    const fetchQuotes = async () => {
        try {
            setLoading(true);
            const response = await adminAPI.getAllQuotes(); // We'll need to add this method to adminAPI
            setQuotes(response.data.data.quotes || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
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

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const handleAssignDesigner = (quote: ClientQuote) => {
        setSelectedQuote(quote);
        setShowDesignerModal(true);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-64">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Cotizaciones de Clientes</h1>
                <p className="text-gray-600 mt-2">Gestiona las cotizaciones enviadas a los clientes</p>
            </div>

            {error && <Alert type="error" message={error} onClose={() => setError('')} className="mb-6" />}

            <div className="bg-white rounded-xl shadow overflow-hidden">
                {quotes.length === 0 ? (
                    <div className="text-center py-12">
                        <FiFileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-900 mb-2">No hay cotizaciones</h3>
                        <p className="text-gray-500">No se encontraron cotizaciones de clientes.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Proyecto / Cliente
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Monto
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Fecha Límite
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Creada por
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {quotes.map((quote) => (
                                    <tr key={quote._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{quote.project.title}</div>
                                            <div className="text-sm text-gray-500">{quote.project.client.name}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            ${quote.amount.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {quote.deadline ? formatDate(quote.deadline) : '—'}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(quote.status)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {quote.createdBy.name}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <Link
                                                    href={`/dashboard/admin/client-quotes/${quote._id}`}
                                                    className="text-blue-600 hover:text-blue-900"
                                                    title="Ver detalles"
                                                >
                                                    <FiEye className="w-4 h-4" />
                                                </Link>
                                                {quote.status === 'accepted' && (
                                                    <button
                                                        onClick={() => handleAssignDesigner(quote)}
                                                        className="text-green-600 hover:text-green-900"
                                                        title="Asignar a diseñador"
                                                    >
                                                        <FiUserPlus className="w-4 h-4" />
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

            {showDesignerModal && selectedQuote && (
                <CreateDesignerQuoteModal
                    quote={selectedQuote}
                    onClose={() => setShowDesignerModal(false)}
                    onSuccess={() => {
                        setShowDesignerModal(false);
                        fetchQuotes(); // refresh maybe
                    }}
                />
            )}
        </div>
    );
}