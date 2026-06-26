'use client';

import { useState, useEffect } from 'react';
import { useAdmin } from '@/app/lib/hooks/useAdmin';
import {
    FiFileText,
    FiSearch,
    FiX,
    FiEye,
    FiClock,
    FiXCircle,
    FiClipboard,
} from 'react-icons/fi';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useSearchParams } from 'next/navigation';
import { adminAPI } from '@/app/lib/api/endpoints';
import CreateQuoteModal from '@/components/modals/CreateQuoteModal';
import { Request } from '@/app/types/request';
import Alert from '@/components/ui/Alert';

export default function AdminRequestsPage() {
    const [requests, setRequests] = useState<Request[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        status: '',
        serviceType: '',
        search: '',
        page: 1,
        limit: 5,
    });
    const [pagination, setPagination] = useState<any>({});

    // Estados para el modal de cotización
    const [quoteModalOpen, setQuoteModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<{ id: string; title: string } | null>(null);

    const params = useSearchParams();
    const clientId = params.get('clientId');



    useEffect(() => {
        fetchRequests();
    }, [filters.status, filters.serviceType, filters.page, filters.search]);
    // Se dispara cuando cualquiera de estos cambie

    const fetchRequests = async () => {
        setIsLoading(true); // Mostrar loader al filtrar
        try {
            const token = localStorage.getItem('token');

            // Construir los parámetros de la URL
            const queryParams = new URLSearchParams();
            if (filters.status) queryParams.append('status', filters.status);
            if (filters.serviceType) queryParams.append('serviceType', filters.serviceType);
            if (filters.search) queryParams.append('search', filters.search);
            queryParams.append('page', filters.page.toString());
            queryParams.append('limit', filters.limit.toString());

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${apiUrl}/admin/requests?${queryParams.toString()}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = await response.json();

            if (data.success) {
                setRequests(data.data.requests || []);
                setPagination(data.data.pagination || {});
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateStatus = async (requestId: string, status: string) => {
        try {
            await adminAPI.updateRequestStatus(requestId, status);
            fetchRequests();
        } catch (error) {
            console.error('Error updating request status:', error);
        }
    };

    // Función para abrir el modal de cotización
    const handleOpenQuoteModal = (requestId: string, requestTitle: string) => {
        setSelectedRequest({ id: requestId, title: requestTitle });
        setQuoteModalOpen(true);
    };

    // Función para enviar la cotización
    const handleCreateQuote = async (quoteData: any) => {
        if (!selectedRequest) return;

        const token = localStorage.getItem('token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${apiUrl}/admin/requests/${selectedRequest.id}/quote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(quoteData),
        });

        const data = await res.json();
        if (!data.success) {
            throw new Error(data.message || 'Error al crear cotización');
        }

        // Recargar solicitudes después de crear la cotización
        fetchRequests();
    };

    const formatDate = (dateString: string) => {
        return format(new Date(dateString), 'dd/MM/yyyy', { locale: es });
    };

    const getStatusLabel = (status: string) => {
        const config: Record<string, { color: string; icon: React.ReactNode; text: string }> = {
            requested: { color: 'bg-yellow-100 text-yellow-800', icon: <FiClock />, text: 'Solicitado' },
            quoted: { color: 'bg-green-100 text-green-800', icon: <FiFileText />, text: 'Cotizado' },
            cancelled: { color: 'bg-red-100 text-red-800', icon: <FiXCircle />, text: 'Cancelado' },

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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                            <FiClipboard className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                Gestión de Solicitudes
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Administra las solicitudes de clientes y crea cotizaciones
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
                                placeholder="Buscar solicitudes..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                value={filters.search}
                                onChange={(e) =>
                                    setFilters({ ...filters, search: e.target.value, page: 1 })
                                }
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <select
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            value={filters.status}
                            onChange={(e) =>
                                setFilters({ ...filters, status: e.target.value, page: 1 })
                            }
                        >
                            <option value="">Todos los estados</option>
                            <option value="requested">Solicitado</option>
                            <option value="quoted">Cotizado</option>
                            <option value="cancelled">Cancelado</option>
                        </select>
                        <select
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            value={filters.serviceType}
                            onChange={(e) =>
                                setFilters({ ...filters, serviceType: e.target.value, page: 1 })
                            }
                        >
                            <option value="">Todos los servicios</option>
                            <option value="branding">Diseño de Marca</option>
                            <option value="ux-ui">Diseño UX/UI</option>
                            <option value="graphic">Diseño Gráfico</option>
                            <option value="web">Diseño Web</option>
                            <option value="motion">Animación</option>
                            <option value="illustration">Ilustración</option>
                            <option value="other">Otro</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Tabla de solicitudes */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
                {isLoading ? (
                    <div className="text-center py-12">
                        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Cargando solicitudes...</p>
                    </div>
                ) : requests.length === 0 ? (
                    <div className="text-center py-12">
                        <FiFileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-900 mb-2">
                            No hay solicitudes
                        </h3>
                        <p className="text-gray-500">
                            No se encontraron solicitudes con los filtros seleccionados.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Solicitud
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Cliente
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Presupuesto (cliente)
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Fecha de creación
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {requests.map((request) => (
                                    <tr key={request._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div>
                                                {request.title.length > 30
                                                    ? request.title.substring(0, 30) + '...'
                                                    : request.title}
                                                <div className="text-sm text-gray-500">
                                                    {getServiceTypeLabel(request.serviceType)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">
                                                {request.client?.name}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {request.client?.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span>
                                                {getStatusLabel(request.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {request.budget ? `$${request.budget.toLocaleString()}` : 'No especificado'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {formatDate(request.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <Link
                                                    href={`/dashboard/requests/${request._id}`}
                                                    className="text-blue-600 hover:text-blue-900"
                                                    title="Detalles"
                                                >
                                                    <FiEye className="w-4 h-4" />
                                                </Link>

                                                {/* Botón para crear cotización (solo si está en 'requested') */}
                                                {request.status === 'requested' && (
                                                    <button
                                                        className="text-purple-600 hover:text-purple-900"
                                                        onClick={() =>
                                                            handleOpenQuoteModal(request._id, request.title)
                                                        }
                                                        title="Crear cotización"
                                                    >
                                                        <FiFileText className="w-4 h-4" />
                                                    </button>
                                                )}

                                                {/* Botón para cancelar solicitud (solo si no está cancelada ni cotizada?) 
                                                    Podemos permitir cancelar incluso si está cotizada, pero tal vez no. 
                                                    Por simplicidad, permitimos cancelar en cualquier estado excepto cancelado. */}
                                                {request.status !== 'cancelled' && (
                                                    <button
                                                        className="text-red-600 hover:text-red-900"
                                                        onClick={() =>
                                                            handleUpdateStatus(request._id, 'cancelled')
                                                        }
                                                        title="Cancelar solicitud"
                                                    >
                                                        <FiX className="w-4 h-4" />
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

            {/* Paginación */}
            {pagination && pagination.pages > 1 && (
                <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                        Mostrando {((filters.page - 1) * filters.limit) + 1} - {Math.min(filters.page * filters.limit, pagination.total)} de {pagination.total} resultados
                    </div>
                    <div className="flex space-x-2">
                        <button
                            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                            disabled={filters.page === 1}
                            onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                        >
                            Anterior
                        </button>
                        <span className="px-4 py-2">
                            Página {filters.page} de {pagination.pages}
                        </span>
                        <button
                            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                            disabled={filters.page === pagination.pages}
                            onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            )}

            {/* Modal de creación de cotización */}
            <CreateQuoteModal
                isOpen={quoteModalOpen}
                onClose={() => {
                    setQuoteModalOpen(false);
                    setSelectedRequest(null);
                }}
                onSubmit={handleCreateQuote}
                requestId={selectedRequest?.id || ''}
                requestTitle={selectedRequest?.title || ''}
            />
        </div>
    );
}