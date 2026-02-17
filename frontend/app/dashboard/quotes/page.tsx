'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthContext } from '@/app/providers/AuthProvider';
import Alert from '@/components/ui/Alert';
import {
    FiFileText,
    FiClock,
    FiCheckCircle,
    FiXCircle,
    FiDollarSign,
    FiCalendar,
    FiEye,
} from 'react-icons/fi';

interface Quote {
    _id: string;
    project: {
        _id: string;
        title: string;
        description: string;
        serviceType: string;
        status: string;
    };
    amount: number;
    deadline: string;
    description: string;
    status: 'pending' | 'accepted' | 'rejected' | 'expired';
    createdAt: string;
    validUntil?: string;
}

export default function QuotesPage() {
    const { user } = useAuthContext();
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchQuotes();
    }, []);

    const fetchQuotes = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            const res = await fetch('/api/quotes', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) {
                setQuotes(data.data.quotes || []);
            } else {
                setError(data.message || 'Error al cargar cotizaciones');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
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
        if (!dateStr) return 'No definida';
        return new Date(dateStr).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
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

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-64">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Mis Cotizaciones</h1>
                <p className="text-gray-600 mt-2">
                    Revisa y gestiona las cotizaciones de tus proyectos
                </p>
            </div>

            {error && <Alert type="error" message={error} onClose={() => setError('')} className="mb-6" />}

            {quotes.length === 0 ? (
                <div className="bg-white rounded-xl shadow p-12 text-center">
                    <FiFileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No tienes cotizaciones</h3>
                    <p className="text-gray-600">
                        Cuando un administrador genere una cotización para alguno de tus proyectos, aparecerá aquí.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {quotes.map((quote) => (
                        <div key={quote._id} className="bg-white rounded-xl shadow hover:shadow-md transition p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 wrap-break-word hyphens-auto line-clamp-2">{quote.project.title}</h3>
                                    <p className="text-sm text-gray-500 mt-1">{getServiceTypeLabel(quote.project.serviceType)} </p>
                                </div>
                                {getStatusBadge(quote.status)}
                            </div>

                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{quote.description}</p>

                            <div className="space-y-2 text-sm">
                                <div className="flex items-center text-gray-700">
                                    <FiDollarSign className="mr-2 text-gray-400" />
                                    <span className="font-medium">${quote.amount.toLocaleString()}</span>
                                </div>
                                {quote.deadline && (
                                    <div className="flex items-center text-gray-600">
                                        <FiCalendar className="mr-2 text-gray-400" />
                                        <span>Entrega: {formatDate(quote.deadline)}</span>
                                    </div>
                                )}
                                {quote.validUntil && (
                                    <div className="flex items-center text-gray-600">
                                        <FiClock className="mr-2 text-gray-400" />
                                        <span>Válido hasta: {formatDate(quote.validUntil)}</span>
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <Link
                                    href={`/dashboard/quotes/${quote._id}`}
                                    className="flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                >
                                    <FiEye className="mr-2" />
                                    Ver detalles
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}