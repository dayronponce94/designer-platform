'use client';

import { useState, useEffect } from 'react';
import { useAdmin } from '@/app/lib/hooks/useAdmin';
import { FiUsers, FiUserCheck, FiUserX, FiFilter, FiSearch, FiMail, FiPhone, FiBriefcase, FiCheckCircle, FiAlertCircle, FiFolder } from 'react-icons/fi';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useRouter } from 'next/navigation';



export default function AdminClientsPage() {
    const { fetchUsers, toggleUserStatus, verifyUser, loading } = useAdmin();
    const [clients, setClients] = useState<any[]>([]);
    const [filters, setFilters] = useState({
        isActive: '',
        isVerified: '',
        search: '',
        page: 1,
        limit: 20
    });
    const [pagination, setPagination] = useState<any>({});
    const router = useRouter();

    useEffect(() => {
        loadClients();
    }, [filters]);

    const loadClients = async () => {
        try {
            const data = await fetchUsers({ ...filters, role: 'client' });
            setClients(data.users || []);
            setPagination(data.pagination || {});
        } catch (error) {
            console.error('Error loading clients:', error);
        }
    };

    const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
        try {
            await toggleUserStatus(userId, !currentStatus);
            loadClients();
        } catch (error) {
            console.error('Error toggling client status:', error);
        }
    };

    const handleVerifyUser = async (userId: string, currentVerified: boolean) => {
        try {
            await verifyUser(userId, !currentVerified);
            loadClients();
        } catch (error) {
            console.error('Error verifying client:', error);
        }
    };

    const handleViewProjects = (clientId: string) => {
        router.push(`/dashboard/admin/projects?clientId=${clientId}`);
    };

    const formatDate = (dateString: string) => {
        return format(new Date(dateString), "dd/MM/yyyy", { locale: es });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <FiUsers className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Gestión de Clientes</h1>
                            <p className="text-gray-600 mt-1">
                                Administra la base de datos de clientes
                            </p>
                        </div>
                    </div>
                </div>
                <div className="text-sm text-gray-500">
                    Total: {pagination.total || 0} clientes
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
                                placeholder="Buscar clientes por nombre, email o empresa..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <select
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={filters.isActive}
                            onChange={(e) => setFilters({ ...filters, isActive: e.target.value, page: 1 })}
                        >
                            <option value="">Todos los estados</option>
                            <option value="true">Activos</option>
                            <option value="false">Inactivos</option>
                        </select>
                        <select
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={filters.isVerified}
                            onChange={(e) => setFilters({ ...filters, isVerified: e.target.value, page: 1 })}
                        >
                            <option value="">Verificación</option>
                            <option value="true">Verificados</option>
                            <option value="false">No verificados</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Tarjetas de clientes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full text-center py-12">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Cargando clientes...</p>
                    </div>
                ) : clients.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                        <FiUsers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-900 mb-2">No hay clientes</h3>
                        <p className="text-gray-500">No se encontraron clientes con los filtros seleccionados.</p>
                    </div>
                ) : (
                    clients.map((client) => (
                        <div key={client._id} className="bg-white rounded-xl shadow p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3">
                                        <FiUsers className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{client.name}</h3>
                                        <p className="text-sm text-gray-500">{client.email}</p>
                                    </div>
                                </div>

                            </div>

                            <div className="space-y-3 mb-6">
                                {client.company && (
                                    <div className="flex items-center text-gray-600">
                                        <FiBriefcase className="w-4 h-4 mr-2" />
                                        <span className="text-sm">{client.company}</span>
                                    </div>
                                )}
                                {client.phone && (
                                    <div className="flex items-center text-gray-600">
                                        <FiPhone className="w-4 h-4 mr-2" />
                                        <span className="text-sm">{client.phone}</span>
                                    </div>
                                )}
                                <div className="flex items-center text-gray-600">
                                    <FiMail className="w-4 h-4 mr-2" />
                                    <span className={`text-sm ${client.isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                                        {client.isVerified ? 'Verificado' : 'No verificado'}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <div className="text-xs text-gray-500">
                                    Registrado: {formatDate(client.createdAt)}
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleToggleStatus(client._id, client.isActive)}
                                        className={`p-2 rounded-lg ${client.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
                                        title={client.isActive ? 'Desactivar' : 'Activar'}
                                    >
                                        {client.isActive ? <FiUserCheck /> : <FiUserX />}
                                    </button>
                                    <button
                                        onClick={() => handleVerifyUser(client._id, client.isVerified)}
                                        className={`p-2 rounded-lg ${client.isVerified
                                            ? 'bg-green-100 text-green-600'
                                            : 'bg-yellow-100 text-yellow-600'
                                            }`}
                                        title={client.isVerified ? 'Quitar verificación' : 'Verificar'}
                                    >
                                        {client.isVerified ? <FiCheckCircle /> : <FiAlertCircle />}
                                    </button>
                                    <button
                                        onClick={() => handleViewProjects(client._id)}
                                        className="p-2 rounded-lg bg-blue-100 text-blue-600"
                                        title="Ver proyectos"
                                    >
                                        <FiFolder />
                                    </button>


                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Paginación */}
            {pagination && pagination.pages > 1 && (
                <div className="flex justify-center">
                    <div className="flex space-x-2">
                        <button
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                            disabled={filters.page === 1}
                            onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                        >
                            Anterior
                        </button>
                        <span className="px-4 py-2">
                            Página {filters.page} de {pagination.pages}
                        </span>
                        <button
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
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