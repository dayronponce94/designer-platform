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
    FiSearch,
    FiFilter,
    FiChevronLeft,
    FiChevronRight,
} from 'react-icons/fi';

interface Quote {
    _id: string;
    request: {
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

    const [filters, setFilters] = useState({
        search: '',
        status: 'all',
        page: 1
    });
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchQuotes();
    }, [filters]);

    const fetchQuotes = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            // Construcción de la URL con filtros
            const queryParams = new URLSearchParams({
                page: filters.page.toString(),
                search: filters.search,
                status: filters.status,
                limit: '6'
            });

            const res = await fetch(`/api/quotes?${queryParams}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();

            if (data.success) {
                setQuotes(data.data.quotes || []);
                setTotalPages(data.data.pagination?.pages || 1);
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

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                        <FiFileText className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Mis Cotizaciones</h1>
                        <p className="text-gray-600 text-sm mt-1">Revisa y gestiona las cotizaciones de tus proyectos.</p>
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
                            <option value="pending">Pendientes</option>
                            <option value="accepted">Aceptadas</option>
                            <option value="rejected">Rechazadas</option>
                            <option value="expired">Expiradas</option>
                        </select>
                    </div>
                </div>
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
                                    <h3 className="text-lg font-semibold text-gray-900 wrap-break-word hyphens-auto line-clamp-2">{quote.request.title}</h3>
                                    <p className="text-sm text-gray-500 mt-1">{getServiceTypeLabel(quote.request.serviceType)} </p>
                                </div>
                                {getStatusBadge(quote.status)}
                            </div>

                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{quote.description}</p>

                            <div className="space-y-2 text-sm">
                                <div className="flex items-center text-gray-700">
                                    <FiDollarSign className="mr-2 text-gray-400" />
                                    <span className="font-medium">{quote.amount.toLocaleString()}</span>
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

            {/* Paginación */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-4 mt-10">
                    <button
                        onClick={() => setFilters(f => ({ ...f, page: Math.max(f.page - 1, 1) }))}
                        disabled={filters.page === 1}
                        className="p-2 rounded-lg border border-gray-300 disabled:opacity-30 hover:bg-gray-50"
                    >
                        <FiChevronLeft />
                    </button>
                    <span className="text-sm font-medium">Página {filters.page} de {totalPages}</span>
                    <button
                        onClick={() => setFilters(f => ({ ...f, page: Math.min(f.page + 1, totalPages) }))}
                        disabled={filters.page === totalPages}
                        className="p-2 rounded-lg border border-gray-300 disabled:opacity-30 hover:bg-gray-50"
                    >
                        <FiChevronRight />
                    </button>
                </div>
            )}
        </div>
    );
}