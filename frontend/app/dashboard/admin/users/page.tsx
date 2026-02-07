'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/app/lib/hooks/useAdmin';
import { useAuthContext } from '@/app/providers/AuthProvider';
import { FiUsers, FiUserCheck, FiUserX, FiTrash2, FiSearch, FiEdit, FiEye, FiFilter } from 'react-icons/fi';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import ConfirmModal from '@/components/modals/ConfirmModal';

export default function AdminUsersPage() {
    const router = useRouter();
    const { user: currentUser } = useAuthContext();
    const {
        fetchUsers,
        toggleUserStatus,
        verifyUser,
        updateUserRole,
        deleteUser,
        loading
    } = useAdmin();

    const [users, setUsers] = useState<any[]>([]);
    const [filters, setFilters] = useState({
        role: '',
        isActive: '',
        isVerified: '',
        search: '',
        page: 1,
        limit: 20
    });
    const [pagination, setPagination] = useState<any>({});

    // Estados para el modal de confirmación
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState<any>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    useEffect(() => {
        loadUsers();
    }, [filters]);

    const loadUsers = async () => {
        try {
            const data = await fetchUsers(filters);
            setUsers(data.users || []);
            setPagination(data.pagination || {});
        } catch (error) {
            console.error('Error loading users:', error);
        }
    };

    const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
        try {
            await toggleUserStatus(userId, !currentStatus);
            loadUsers();
        } catch (error) {
            console.error('Error toggling user status:', error);
        }
    };

    const handleVerifyUser = async (userId: string, currentVerified: boolean) => {
        try {
            await verifyUser(userId, !currentVerified);
            loadUsers();
        } catch (error) {
            console.error('Error verifying user:', error);
        }
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
        try {
            await updateUserRole(userId, newRole);
            loadUsers();
        } catch (error) {
            console.error('Error updating user role:', error);
        }
    };

    // Función para ver detalles del usuario
    const handleViewDetails = (userId: string) => {
        router.push(`/dashboard/admin/users/${userId}`);
    };

    // Función para editar usuario
    const handleEditUser = (userId: string) => {
        router.push(`/dashboard/admin/users/${userId}/edit`);
    };

    // Función para preparar la eliminación
    const handlePrepareDelete = (user: any) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
        setDeleteError(null);
    };

    // Función para confirmar eliminación
    const handleConfirmDelete = async () => {
        if (!userToDelete) return;

        setDeleteLoading(true);
        setDeleteError(null);

        try {
            await deleteUser(userToDelete._id);
            setShowDeleteModal(false);
            setUserToDelete(null);
            loadUsers(); // Recargar la lista
        } catch (error: any) {
            setDeleteError(error.message || 'Error al eliminar el usuario');
        } finally {
            setDeleteLoading(false);
        }
    };

    // Función para cancelar eliminación
    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setUserToDelete(null);
        setDeleteError(null);
    };

    const formatDate = (dateString: string) => {
        return format(new Date(dateString), "dd/MM/yyyy", { locale: es });
    };

    // Verificar si es el usuario admin principal
    const isMainAdmin = (user: any) => {
        return user.email === 'verallero@gmail.com';
    };

    // Verificar si es el usuario actual
    const isCurrentUser = (user: any) => {
        return currentUser?._id === user._id;
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
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
                            <p className="text-gray-600 mt-1">
                                Administra todos los usuarios de la plataforma
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
                                placeholder="Buscar por nombre o email..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <select
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={filters.role}
                            onChange={(e) => setFilters({ ...filters, role: e.target.value, page: 1 })}
                        >
                            <option value="">Todos los roles</option>
                            <option value="client">Clientes</option>
                            <option value="designer">Diseñadores</option>
                            <option value="admin">Administradores</option>
                        </select>
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

            {/* Tabla de usuarios */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Cargando usuarios...</p>
                    </div>
                ) : users.length === 0 ? (
                    <div className="text-center py-12">
                        <FiUsers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-900 mb-2">No hay usuarios</h3>
                        <p className="text-gray-500">No se encontraron usuarios con los filtros seleccionados.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Usuario
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Rol
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Verificación
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Fecha Registro
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map((user) => {
                                    const isMainAdminUser = isMainAdmin(user);
                                    const isCurrentUserUser = isCurrentUser(user);

                                    return (
                                        <tr key={user._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${user.role === 'admin' ? 'bg-indigo-100 text-indigo-600' : user.role === 'designer' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                                        <FiUsers className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900">{user.name}</div>
                                                        <div className="text-sm text-gray-500">{user.email}</div>
                                                        {user.company && (
                                                            <div className="text-xs text-gray-400">{user.company}</div>
                                                        )}
                                                        {isMainAdminUser && (
                                                            <div className="text-xs text-indigo-600 font-medium">
                                                                Administrador Principal
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <select
                                                    className={`px-3 py-1 text-sm font-medium rounded-full border ${user.role === 'admin' ? 'bg-indigo-100 text-indigo-800 border-indigo-200' : user.role === 'designer' ? 'bg-purple-100 text-purple-800 border-purple-200' : 'bg-blue-100 text-blue-800 border-blue-200'} ${isMainAdminUser ? 'cursor-not-allowed opacity-50' : ''}`}
                                                    value={user.role}
                                                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                    disabled={isMainAdminUser}
                                                >
                                                    <option value="client">Cliente</option>
                                                    <option value="designer">Diseñador</option>
                                                    <option value="admin">Administrador</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => !isMainAdminUser && handleToggleStatus(user._id, user.isActive)}
                                                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} ${isMainAdminUser ? 'cursor-not-allowed opacity-50' : ''}`}
                                                    disabled={isMainAdminUser}
                                                    title={isMainAdminUser ? "No se puede desactivar al administrador principal" : ""}
                                                >
                                                    {user.isActive ? (
                                                        <>
                                                            <FiUserCheck className="w-3 h-3 mr-1" />
                                                            Activo
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FiUserX className="w-3 h-3 mr-1" />
                                                            Inactivo
                                                        </>
                                                    )}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => handleVerifyUser(user._id, user.isVerified)}
                                                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${user.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                                                >
                                                    {user.isVerified ? 'Verificado' : 'No Verificado'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(user.createdAt)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <button
                                                        className="text-green-600 hover:text-green-900 transition-colors"
                                                        onClick={() => handleViewDetails(user._id)}
                                                        title="Ver detalles del usuario"
                                                    >
                                                        <FiEye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        className="text-blue-600 hover:text-blue-900 transition-colors"
                                                        onClick={() => handleEditUser(user._id)}
                                                        title="Editar usuario"
                                                    >
                                                        <FiEdit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        className={`${isMainAdminUser || isCurrentUserUser ? 'text-gray-400 cursor-not-allowed' : 'text-red-600 hover:text-red-900 transition-colors'}`}
                                                        onClick={() => !isMainAdminUser && !isCurrentUserUser && handlePrepareDelete(user)}
                                                        disabled={isMainAdminUser || isCurrentUserUser}
                                                        title={
                                                            isMainAdminUser ? "No se puede eliminar al administrador principal" :
                                                                isCurrentUserUser ? "No puedes eliminar tu propia cuenta" :
                                                                    "Eliminar usuario"
                                                        }
                                                    >
                                                        <FiTrash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Paginación */}
            {pagination && pagination.pages > 1 && (
                <div className="flex justify-center">
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

            {/* Modal de confirmación para eliminar */}
            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title="Eliminar Usuario"
                message={
                    userToDelete ?
                        `¿Estás seguro de que deseas eliminar al usuario "${userToDelete.name}"? Esta acción eliminará todos los datos relacionados (proyectos, portafolios, etc.) y no se puede deshacer.`
                        : ''
                }
                confirmText={deleteLoading ? "Eliminando..." : "Eliminar"}
                cancelText="Cancelar"
                type="danger"
            />
        </div>
    );
}