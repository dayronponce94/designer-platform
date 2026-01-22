'use client';

import { useState, useEffect } from 'react';
import { useAdmin } from '@/app/lib/hooks/useAdmin';
import { FiUsers, FiUserCheck, FiUserX, FiFilter, FiSearch, FiMail, FiAward, FiBriefcase } from 'react-icons/fi';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function AdminDesignersPage() {
    const { fetchUsers, toggleUserStatus, verifyUser, loading } = useAdmin();
    const [designers, setDesigners] = useState<any[]>([]);
    const [filters, setFilters] = useState({
        isActive: '',
        isVerified: '',
        search: '',
        page: 1,
        limit: 20
    });
    const [pagination, setPagination] = useState<any>({});

    useEffect(() => {
        loadDesigners();
    }, [filters]);

    const loadDesigners = async () => {
        try {
            const data = await fetchUsers({ ...filters, role: 'designer' });
            setDesigners(data.users || []);
            setPagination(data.pagination || {});
        } catch (error) {
            console.error('Error loading designers:', error);
        }
    };

    const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
        try {
            await toggleUserStatus(userId, !currentStatus);
            loadDesigners();
        } catch (error) {
            console.error('Error toggling designer status:', error);
        }
    };

    const handleVerifyUser = async (userId: string, currentVerified: boolean) => {
        try {
            await verifyUser(userId, !currentVerified);
            loadDesigners();
        } catch (error) {
            console.error('Error verifying designer:', error);
        }
    };

    const formatDate = (dateString: string) => {
        return format(new Date(dateString), "dd/MM/yyyy", { locale: es });
    };

    const getSpecialtyLabel = (specialty: string) => {
        const labels: Record<string, string> = {
            'branding': 'Branding',
            'ux-ui': 'UX/UI Design',
            'graphic': 'Diseño Gráfico',
            'web': 'Diseño Web',
            'motion': 'Motion Graphics',
            'illustration': 'Ilustración',
            'other': 'Otro'
        };
        return labels[specialty] || specialty;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                            <FiUsers className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Gestión de Diseñadores</h1>
                            <p className="text-gray-600 mt-1">
                                Administra la red interna de diseñadores colaboradores
                            </p>
                        </div>
                    </div>
                </div>
                <div className="text-sm text-gray-500">
                    Total: {pagination.total || 0} diseñadores
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
                                placeholder="Buscar diseñadores por nombre, email o especialidad..."
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

            {/* Tarjetas de diseñadores */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full text-center py-12">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Cargando diseñadores...</p>
                    </div>
                ) : designers.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                        <FiUsers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-900 mb-2">No hay diseñadores</h3>
                        <p className="text-gray-500">No se encontraron diseñadores con los filtros seleccionados.</p>
                    </div>
                ) : (
                    designers.map((designer) => (
                        <div key={designer._id} className="bg-white rounded-xl shadow p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mr-3">
                                        <FiUsers className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{designer.name}</h3>
                                        <p className="text-sm text-gray-500">{designer.email}</p>
                                        <div className="flex items-center mt-1">
                                            <FiAward className="w-3 h-3 text-yellow-500 mr-1" />
                                            <span className="text-xs text-gray-600">
                                                {designer.experience || 0} años de experiencia
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleToggleStatus(designer._id, designer.isActive)}
                                        className={`p-2 rounded-lg ${designer.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
                                        title={designer.isActive ? 'Desactivar' : 'Activar'}
                                    >
                                        {designer.isActive ? <FiUserCheck /> : <FiUserX />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center text-gray-600">
                                    <FiBriefcase className="w-4 h-4 mr-2" />
                                    <span className="text-sm">{getSpecialtyLabel(designer.specialty || 'other')}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <FiMail className="w-4 h-4 mr-2" />
                                    <span className={`text-sm ${designer.isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                                        {designer.isVerified ? 'Verificado' : 'No verificado'}
                                    </span>
                                </div>
                                {designer.skills && designer.skills.length > 0 && (
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Habilidades:</p>
                                        <div className="flex flex-wrap gap-1">
                                            {designer.skills.slice(0, 3).map((skill: string, index: number) => (
                                                <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                                                    {skill}
                                                </span>
                                            ))}
                                            {designer.skills.length > 3 && (
                                                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                                                    +{designer.skills.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {designer.bio && (
                                <div className="mb-6">
                                    <p className="text-xs text-gray-500 mb-1">Biografía:</p>
                                    <p className="text-sm text-gray-700 line-clamp-2">{designer.bio}</p>
                                </div>
                            )}

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <div className="text-xs text-gray-500">
                                    Registrado: {formatDate(designer.createdAt)}
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleVerifyUser(designer._id, designer.isVerified)}
                                        className={`px-3 py-1 text-xs rounded-full ${designer.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                                    >
                                        {designer.isVerified ? 'Quitar verificación' : 'Verificar'}
                                    </button>
                                    <button
                                        className="px-3 py-1 text-xs bg-purple-100 text-purple-800 rounded-full"
                                        onClick={() => {
                                            // Ver portafolio del diseñador
                                        }}
                                    >
                                        Portafolio
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