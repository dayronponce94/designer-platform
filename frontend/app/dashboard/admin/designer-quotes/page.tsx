'use client';

import { useState, useEffect } from 'react';
import { adminAPI } from '@/app/lib/api/endpoints';
import Alert from '@/components/ui/Alert';
import {
    FiFileText, FiClock, FiCheckCircle, FiXCircle, FiEye,
    FiUser, FiDollarSign, FiCalendar, FiSearch
} from 'react-icons/fi';
import Link from 'next/link';

interface DesignerQuote {
    _id: string;
    clientQuote: { request: { title: string } };
    designer: { name: string; email: string };
    amount: number;
    deadline: string;
    status: string;
    createdAt: string;
}

export default function AdminDesignerQuotesPage() {
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

    const fetchQuotes = async () => {
        try {
            setLoading(true);
            const params = {
                search: filters.search || undefined,
                status: filters.status || undefined,
                page: filters.page,
                limit: filters.limit
            };
            const response = await adminAPI.getAllDesignerQuotes(params);
            setQuotes(response.data.data.quotes || []);
            setPagination(response.data.data.pagination || {});
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

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilters({ ...filters, limit: parseInt(e.target.value), page: 1 });
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters({ ...filters, search: e.target.value, page: 1 });
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilters({ ...filters, status: e.target.value, page: 1 });
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
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Cotizaciones a Diseñadores</h1>
                            <p className="text-gray-600 mt-1">
                                Gestiona las cotizaciones enviadas a los diseñadores
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
                                placeholder="Buscar por proyecto o diseñador..."
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
                        <select
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={filters.limit}
                            onChange={handleLimitChange}
                        >
                            <option value="10">10 por página</option>
                            <option value="20">20 por página</option>
                            <option value="50">50 por página</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Cargando cotizaciones...</p>
                    </div>
                ) : quotes.length === 0 ? (
                    <div className="text-center py-12">
                        <FiFileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-900 mb-2">No hay cotizaciones</h3>
                        <p className="text-gray-500">No se encontraron cotizaciones con los filtros seleccionados.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Proyecto
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Diseñador
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
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {quotes.map((q) => (
                                    <tr key={q._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {q.clientQuote?.request?.title
                                                ? q.clientQuote.request.title.length > 30
                                                    ? q.clientQuote.request.title.substring(0, 30) + '...'
                                                    : q.clientQuote.request.title
                                                : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{q.designer.name}</div>
                                            <div className="text-sm text-gray-500">{q.designer.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            ${q.amount.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {q.deadline ? formatDate(q.deadline) : '—'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(q.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <Link
                                                href={`/dashboard/admin/designer-quotes/${q._id}`}
                                                className="text-blue-600 hover:text-blue-900"
                                                title="Ver detalles"
                                            >
                                                <FiEye className="w-4 h-4" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

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