'use client';

import { useState, useEffect } from 'react';
import { designerQuoteAPI } from '@/app/lib/api/endpoints';
import Alert from '@/components/ui/Alert';
import {
    FiFileText,
    FiClock,
    FiCheckCircle,
    FiXCircle,
    FiEye,
    FiSearch,
    FiCalendar,
    FiDollarSign
} from 'react-icons/fi';
import Link from 'next/link';

interface DesignerQuote {
    _id: string;
    clientQuote: {
        request: {
            title: string;
            serviceType: string;
            client: { name: string; email: string };
        };
    };
    amount: number;
    deadline: string;
    description: string;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: string;
}

export default function DesignerQuotesPage() {
    const [quotes, setQuotes] = useState<DesignerQuote[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Filtros y paginación
    const [filters, setFilters] = useState({
        search: '',
        status: '',
        page: 1,
        limit: 10
    });
    const [pagination, setPagination] = useState<any>({});

    useEffect(() => {
        fetchQuotes();
    }, [filters]);

    console.log("Primera cotización:", quotes[0]);

    const fetchQuotes = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await designerQuoteAPI.getMyQuotes(filters);
            const data = response.data.data;
            setQuotes(data.quotes || []);
            setPagination(data.pagination || {});

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
        };
        const c = config[status] || config.pending;
        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${c.color}`}>
                {c.icon}
                <span className="ml-1">{c.text}</span>
            </span>
        );
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters({ ...filters, search: e.target.value, page: 1 });
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilters({ ...filters, status: e.target.value, page: 1 });
    };

    const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilters({ ...filters, limit: parseInt(e.target.value), page: 1 });
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
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <FiFileText className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                Mis Cotizaciones
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Revisa y gestiona las cotizaciones que te han enviado
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filtros */}
            <div className="bg-white rounded-xl shadow p-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar por título de proyecto..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={filters.search}
                                onChange={handleSearchChange}
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <select
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={filters.status}
                            onChange={handleStatusChange}
                        >
                            <option value="">Todos los estados</option>
                            <option value="pending">Pendiente</option>
                            <option value="accepted">Aceptada</option>
                            <option value="rejected">Rechazada</option>
                        </select>
                    </div>
                </div>
            </div>


            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-500">Cargando cotizaciones...</p>
                    </div>
                </div>
            ) : quotes.length === 0 ? (
                <div className="bg-white rounded-xl shadow p-12 text-center">
                    <FiFileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay cotizaciones</h3>
                    <p className="text-gray-600">
                        No se encontraron cotizaciones con los filtros seleccionados.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {quotes.map((q) => (
                        <div key={q._id} className="bg-white rounded-xl shadow hover:shadow-md transition p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                                        {q.clientQuote?.request?.title || 'Cotización'}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {getServiceTypeLabel(q.clientQuote?.request?.serviceType)}
                                    </p>
                                </div>
                                {getStatusBadge(q.status)}
                            </div>

                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{q.description}</p>

                            <div className="space-y-2 text-sm">
                                <div className="flex items-center text-gray-700">
                                    <FiDollarSign className="mr-2 text-gray-400" />
                                    <span>Pago: {q.amount.toLocaleString()}</span>
                                </div>
                                {q.deadline && (
                                    <div className="flex items-center text-gray-600">
                                        <FiCalendar className="mr-2 text-gray-400" />
                                        <span>Entrega: {formatDate(q.deadline)}</span>
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <Link
                                    href={`/dashboard/designer/quotes/${q._id}`}
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
            {pagination && pagination.pages > 1 && (
                <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                        Mostrando {((filters.page - 1) * filters.limit) + 1} - {Math.min(filters.page * filters.limit, pagination.total)} de {pagination.total} resultados
                    </div>
                    <div className="flex space-x-2">
                        <button
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                            disabled={filters.page === 1}
                            onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                        >
                            Anterior
                        </button>
                        <span className="px-4 py-2">
                            Página {filters.page} de {pagination.pages}
                        </span>
                        <button
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                            disabled={filters.page === pagination.pages}
                            onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}