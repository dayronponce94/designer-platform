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
    FiCheckCircle,
    FiAlertCircle,
    FiEdit,
    FiEye,
    FiTrash2,
    FiPackage,
    FiDollarSign,
    FiUser,
    FiFileText
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
    'quoted': { color: 'bg-blue-100 text-blue-800', icon: <FiFileText />, text: 'Cotizado' },
    'cancelled': { color: 'bg-red-100 text-red-800', icon: <FiAlertCircle />, text: 'Cancelado' },
};

export default function RequestsPage() {
    const { user } = useAuthContext();
    const [requests, setRequests] = useState<Request[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [requestToDelete, setRequestToDelete] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch('/api/requests', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Error al cargar solicitudes');
            const data = await response.json();
            setRequests(data.data.requests || []);
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
            const response = await fetch(`/api/requests/${requestToDelete}`, {
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

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-100">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Mis Solicitudes</h1>
                    <p className="text-gray-600 mt-2">
                        Gestiona tus solicitudes de diseño. Una vez cotizadas, podrás aprobarlas para comenzar el proyecto.
                    </p>
                </div>
                <Link
                    href="/dashboard/requests/new"
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    <FiPlus className="mr-2" />
                    Nueva Solicitud
                </Link>
            </div>

            {error && <Alert type="error" message={error} onClose={() => setError('')} className="mb-6" />}

            {requests.length === 0 ? (
                <div className="bg-white rounded-xl shadow p-12 text-center">
                    <FiBriefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No tienes solicitudes aún</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Comienza solicitando tu primer proyecto de diseño. Nuestro equipo te enviará una cotización personalizada.
                    </p>
                    <Link
                        href="/dashboard/requests/new"
                        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        <FiPlus className="mr-2" />
                        Crear Primera Solicitud
                    </Link>
                </div>
            ) : (
                <>
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
                                                <FiPackage className="mr-2" />
                                                <span>
                                                    {req.budget && req.budget > 0
                                                        ? `Presupuesto: $${req.budget.toLocaleString()}`
                                                        : 'Presupuesto por definir'}
                                                </span>
                                            </div>
                                            <div className="flex items-center">
                                                <FiClock className="mr-2" />
                                                <span>Creado: {formatDate(req.createdAt)}</span>
                                            </div>
                                            {req.deadline && (
                                                <div className="flex items-center">
                                                    <FiClock className="mr-2" />
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

                    {/* Estadísticas rápidas */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-xl shadow p-4">
                            <p className="text-sm text-gray-500">Total Solicitudes</p>
                            <p className="text-2xl font-bold text-gray-900">{requests.length}</p>
                        </div>
                        <div className="bg-white rounded-xl shadow p-4">
                            <p className="text-sm text-gray-500">Pendientes</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {requests.filter(r => r.status === 'requested').length}
                            </p>
                        </div>
                        <div className="bg-white rounded-xl shadow p-4">
                            <p className="text-sm text-gray-500">Cotizadas</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {requests.filter(r => r.status === 'quoted').length}
                            </p>
                        </div>
                        <div className="bg-white rounded-xl shadow p-4">
                            <p className="text-sm text-gray-500">Canceladas</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {requests.filter(r => r.status === 'cancelled').length}
                            </p>
                        </div>
                    </div>
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