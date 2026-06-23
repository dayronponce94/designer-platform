'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthContext } from '@/app/providers/AuthProvider';
import Alert from '@/components/ui/Alert';
import ConfirmModal from '@/components/modals/ConfirmModal';
import {
    FiBriefcase,
    FiPlus,
    FiClock,
    FiAlertCircle,
    FiEdit,
    FiEye,
    FiTrash2,
    FiDollarSign,
    FiFileText,
    FiFilter,
    FiChevronLeft,
    FiChevronRight,
    FiSearch,
    FiClipboard,
    FiCalendar
} from 'react-icons/fi';
import { Request } from '@/app/types/request';

const SERVICE_TYPE_LABELS: Record<string, string> = {
    'branding': 'Diseño de Marca',
    'ux-ui': 'Diseño UX/UI',
    'graphic': 'Diseño Gráfico',
    'web': 'Diseño Web',
    'motion': 'Animación Gráfica',
    'illustration': 'Ilustración',
    'other': 'Otro'
};

const STATUS_CONFIG: Record<string, { color: string; icon: React.ReactNode; text: string }> = {
    'requested': { color: 'bg-yellow-100 text-yellow-800', icon: <FiClock />, text: 'Solicitado' },
    'quoted': { color: 'bg-green-100 text-green-800', icon: <FiFileText />, text: 'Cotizado' },
    'cancelled': { color: 'bg-red-100 text-red-800', icon: <FiAlertCircle />, text: 'Cancelado' },
};

export default function RequestsPage() {
    const { user, isLoading: authLoading } = useAuthContext();
    const [requests, setRequests] = useState<Request[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Modal states
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [requestToDelete, setRequestToDelete] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const [filters, setFilters] = useState({
        search: '',
        status: '',
        page: 1
    });

    const [totalResults, setTotalResults] = useState(0);

    useEffect(() => {
        if (user) fetchRequests();
    }, [user, currentPage, statusFilter, filters.search]);

    const fetchRequests = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('token');

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const url = `${apiUrl}/requests?page=${currentPage}&status=${statusFilter}&limit=3&search=${filters.search}`;

            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const resData = await response.json();

            if (resData.success) {
                setRequests(resData.data?.requests || []);
                setTotalPages(resData.data?.pagination?.pages || 1);
                setTotalResults(resData.data?.pagination?.total || 0);
            } else {
                throw new Error(resData.message || 'Error al cargar');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteClick = (id: string) => {
        setRequestToDelete(id);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!requestToDelete) return;
        setDeleteLoading(true);
        try {
            const token = localStorage.getItem('token');
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${apiUrl}/requests/${requestToDelete}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Error al eliminar solicitud');
            setRequests(prev => prev.filter(r => r._id !== requestToDelete));
            setDeleteModalOpen(false);
            setRequestToDelete(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setDeleteLoading(false);
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('es-ES', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    };


    return (
        <div className="space-y-8">
            {/* Cabecera */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                        <FiClipboard className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Mis Solicitudes</h1>
                        <p className="text-gray-600 text-sm mt-1">Gestiona tus solicitudes de diseño. Una vez cotizadas, podrás aprobarlas para comenzar el proyecto.</p>
                    </div>
                </div>
                <Link
                    href="/dashboard/requests/new"
                    className="flex items-center justify-center px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
                >
                    <FiPlus className="mr-2" />
                    Nueva Solicitud
                </Link>
            </div>

            {/* Filtros */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por título de proyecto..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <FiFilter className="text-gray-600 w-5 h-5" />
                        <select
                            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer"
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                        >
                            <option value="all">Todos los estados</option>
                            <option value="requested">Solicitados</option>
                            <option value="quoted">Cotizados</option>
                            <option value="cancelled">Cancelados</option>
                        </select>
                    </div>
                </div>
            </div>

            {error && <Alert type="error" message={error} onClose={() => setError('')} />}

            {isLoading ? (
                <div className="flex justify-center items-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-500">Cargando solicitudes...</p>
                    </div>
                </div>
            ) : (
                <>
                    {requests.length === 0 ? (
                        // Si NO hay resultados, revisamos POR QUÉ
                        (statusFilter !== 'all' || filters.search !== '') ? (
                            // Caso A: El usuario aplicó un filtro o buscó algo y no hubo coincidencias
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                                <FiBriefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Sin resultados</h3>
                                <p className="text-gray-500 mb-6">
                                    No hallamos solicitudes que coincidan con los criterios de búsqueda o el filtro actual.
                                </p>
                            </div>
                        ) : (
                            // Caso B: La cuenta está totalmente vacía (sin filtros aplicados)
                            <div className="bg-white rounded-xl shadow p-12 text-center">
                                <FiBriefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No tienes solicitudes aún</h3>
                                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                    Comienza solicitando tu primer proyecto de diseño.
                                </p>
                                <Link
                                    href="/dashboard/requests/new"
                                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                >
                                    <FiPlus className="mr-2" />
                                    Crear Primera Solicitud
                                </Link>
                            </div>
                        )
                    ) : (
                        // Caso 3: sí hay solicitudes
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {requests.map((req) => {
                                const statusConf = STATUS_CONFIG[req.status] || STATUS_CONFIG['requested'];
                                return (
                                    <div key={req._id} className="bg-white rounded-xl shadow hover:shadow-md transition-shadow">
                                        <div className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900 wrap-break-word line-clamp-2">
                                                        {req.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {SERVICE_TYPE_LABELS[req.serviceType]}
                                                    </p>
                                                </div>
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConf.color}`}>
                                                    {statusConf.icon}
                                                    <span className="ml-1">{statusConf.text}</span>
                                                </span>
                                            </div>

                                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                {req.description}
                                            </p>

                                            <div className="space-y-3 text-sm text-gray-500 mb-6">
                                                <div className="flex items-center">
                                                    <FiDollarSign className="mr-2" />
                                                    <span>
                                                        {req.budget && req.budget > 0
                                                            ? `Presupuesto: ${req.budget.toLocaleString()}`
                                                            : 'Presupuesto por definir'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center">
                                                    <FiClock className="mr-2" />
                                                    <span>Creado: {formatDate(req.createdAt)}</span>
                                                </div>
                                                {req.deadline && (
                                                    <div className="flex items-center">
                                                        <FiCalendar className="mr-2" />
                                                        <span>Entrega deseada: {formatDate(req.deadline)}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                                <Link
                                                    href={`/dashboard/requests/${req._id}`}
                                                    className="flex items-center text-blue-600 hover:text-blue-700"
                                                >
                                                    <FiEye className="mr-1" />
                                                    Ver detalles
                                                </Link>
                                                <div className="flex space-x-2">
                                                    {req.status === 'requested' && (
                                                        <Link
                                                            href={`/dashboard/requests/${req._id}/edit`}
                                                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                            title="Editar solicitud"
                                                        >
                                                            <FiEdit />
                                                        </Link>
                                                    )}
                                                    {req.status === 'requested' && (
                                                        <button
                                                            onClick={() => handleDeleteClick(req._id)}
                                                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                                            title="Eliminar solicitud"
                                                        >
                                                            <FiTrash2 />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Paginación */}
                    {totalPages > 1 && (
                        <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-500">
                                Mostrando {(requests.length > 0) ? ((currentPage - 1) * 6 + 1) : 0} –{" "}
                                {(requests.length > 0) ? ((currentPage - 1) * 6 + requests.length) : 0}{" "}
                                de {totalResults} resultados
                            </div>

                            <div className="flex space-x-2">
                                <button
                                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                >
                                    Anterior
                                </button>

                                <span className="px-4 py-2">
                                    Página {currentPage} de {totalPages}
                                </span>

                                <button
                                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}

                                >
                                    Siguiente
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            <ConfirmModal
                isOpen={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setRequestToDelete(null);
                }}
                onConfirm={handleDeleteConfirm}
                title="¿Eliminar solicitud?"
                message="Esta acción no se puede deshacer. La solicitud será eliminada permanentemente."
                confirmText={deleteLoading ? "Eliminando..." : "Eliminar Solicitud"}
                cancelText="Cancelar"
                type="danger"
            />
        </div>
    );
}