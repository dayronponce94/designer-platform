'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAdmin } from '@/app/lib/hooks/useAdmin';
import { FiUsers, FiBriefcase, FiDollarSign, FiCheckCircle, FiClock, FiAlertTriangle, FiTrendingUp, FiBarChart2, FiSettings, FiPieChart } from 'react-icons/fi';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAuthContext } from '@/app/providers/AuthProvider';
import { adminAPI } from '@/app/lib/api/endpoints';

export default function AdminDashboardPage() {
    const { fetchReports, loading } = useAdmin();
    const [stats, setStats] = useState<any>(null);
    const [recentUsers, setRecentUsers] = useState<any[]>([]);
    const [recentProjects, setRecentProjects] = useState<any[]>([]);
    const { user, isLoading } = useAuthContext();

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const reports = await fetchReports();
            setStats(reports);

            // Obtener usuarios recientes
            const usersData = await adminAPI.getAllUsers({ limit: 3, sort: '-createdAt' });
            setRecentUsers(usersData.data.data.users || []);

            // Obtener proyectos recientes
            const projectsData = await adminAPI.getAllProjects({ sort: '-createdAt' });
            setRecentProjects(projectsData.data.data.projects || []);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    };

    const formatDate = (dateString: string) => {
        return format(new Date(dateString), "dd/MM/yyyy", { locale: es });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('pt-PT', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    // Obtener iniciales del usuario
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    const ROLE_CONFIG: Record<string, { label: string, classes: string }> = {
        admin: { label: 'Administrador', classes: 'bg-green-100 text-green-800' },
        designer: { label: 'Diseñador', classes: 'bg-purple-100 text-purple-800' },
        client: { label: 'Cliente', classes: 'bg-blue-100 text-blue-800' }
    };

    const STATUS_CONFIG: Record<string, { label: string, classes: string }> = {
        requested: { label: 'Solicitado', classes: 'bg-gray-100 text-gray-800' },
        quoted: { label: 'Cotizado', classes: 'bg-yellow-100 text-yellow-800' },
        approved: { label: 'Aprobado', classes: 'bg-blue-100 text-blue-800' },
        'in-progress': { label: 'En Progreso', classes: 'bg-purple-100 text-purple-800' },
        review: { label: 'En Revisión', classes: 'bg-orange-100 text-orange-800' },
        completed: { label: 'Completado', classes: 'bg-green-100 text-green-800' },
        cancelled: { label: 'Cancelado', classes: 'bg-red-100 text-red-800' }
    };

    const totalAdminEarnings = useMemo(() => {
        return recentProjects.reduce((acc, project) => {
            const clientBudget = project.clientView?.budget || 0;
            const designerEarnings = project.designerView?.earnings || 0;
            return acc + (clientBudget - designerEarnings);
        }, 0);
    }, [recentProjects]);

    const completionRate = useMemo(() => {
        if (recentProjects.length === 0) return 0;

        // Contamos cuántos proyectos tienen el estado 'completed'
        const completedProjects = recentProjects.filter(
            project => project.status === 'completed'
        ).length;

        // Calculamos el porcentaje: (completados / total) * 100
        const rate = (completedProjects / recentProjects.length) * 100;

        // Retornamos con un decimal para que se vea más profesional
        return Math.round(rate * 10) / 10;
    }, [recentProjects]);

    return (
        <div className="space-y-6">
            {/* Header con Bienvenida */}
            <div className="bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">
                            ¡Bienvenida de vuelta, Verónica!
                        </h1>
                        <p className="mt-2 opacity-90">
                            Aquí puedes gestionar toda la plataforma.
                        </p>
                        <div className="flex items-center mt-4 space-x-4 text-sm">
                            <div className="flex items-center">
                                <FiClock className="mr-2" />
                                <span>Última actualización: {new Date().toLocaleDateString('es-ES')}</span>
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:flex">
                        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold">
                            {getInitials(user?.name || 'U')}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tarjetas de estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-xl shadow p-6 border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Usuarios</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {stats?.overview?.totalUsers || 0}
                            </p>
                            <div className="flex items-center text-xs text-gray-500 mt-2">
                                <span className="mr-3">Clientes: {stats?.overview?.totalClients || 0}</span>
                                <span>Diseñadores: {stats?.overview?.totalDesigners || 0}</span>
                            </div>
                        </div>
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                            <FiUsers className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow p-6 border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Proyectos</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {stats?.overview?.totalProjects || 0}
                            </p>
                            <div className="text-xs text-gray-500 mt-2">
                                Sin asignar: {stats?.overview?.unassignedProjects || 0}
                            </div>
                        </div>
                        <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                            <FiBriefcase className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow p-6 border-l-4 border-purple-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Ganancia Neta</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {formatCurrency(totalAdminEarnings)}
                            </p>
                            <div className="flex items-center text-xs text-green-600 mt-2">
                                <FiTrendingUp className="mr-1" />
                                <span>No incluye comisiones de Stripe</span>
                            </div>
                        </div>
                        <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                            <FiDollarSign className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow p-6 border-l-4 border-yellow-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Tasa de Completación</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {completionRate}%
                            </p>
                            <div className="flex items-center text-xs text-gray-500 mt-2">
                                <FiCheckCircle className="mr-1 text-green-600" />
                                <span>
                                    {recentProjects.filter(p => p.status === 'completed').length} de {recentProjects.length} proyectos
                                </span>
                            </div>
                        </div>
                        <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg">
                            <FiBarChart2 className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Información del Administrador */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Información de la Cuenta</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-500">Nombre completo</p>
                                <p className="font-medium">{user?.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-medium">{user?.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Teléfono</p>
                                <p className="font-medium">{user?.phone || 'No especificado'}</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-500">Tipo de cuenta</p>
                                <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                                    Administrador
                                </span>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Miembro desde</p>
                                <p className="font-medium">
                                    {user?.createdAt ? formatDate(user.createdAt) : 'Recientemente'}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <a
                            href="/dashboard/profile"
                            className="inline-flex items-center text-blue-600 hover:text-blue-700"
                        >
                            <FiSettings className="mr-2" />
                            Editar información del perfil
                        </a>
                    </div>
                </div>

                {/* Estado de la Cuenta */}
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Estado de la Cuenta</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                                <p className="font-medium">Verificación</p>
                                <p className="text-sm text-gray-500">Estado de la cuenta</p>
                            </div>
                            <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${user?.isVerified
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                    }`}
                            >
                                {user?.isVerified ? 'Verificada' : 'Pendiente'}
                            </span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                                <p className="font-medium">Actividad</p>
                                <p className="text-sm text-gray-500">Último acceso</p>
                            </div>
                            <span className="text-sm text-gray-600">
                                {user?.lastLogin ? formatDate(user.lastLogin) : 'Hoy'}
                            </span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                                <p className="font-medium">Estado</p>
                                <p className="text-sm text-gray-500">Cuenta activa</p>
                            </div>
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                Activa
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gráficos y tablas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Usuarios recientes */}
                <div className="bg-white rounded-xl shadow">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-900">Usuarios Recientes</h2>
                            <Link
                                href="/dashboard/admin/users"
                                className="text-sm text-blue-600 hover:text-blue-800"
                            >
                                Ver todos
                            </Link>
                        </div>
                    </div>
                    <div className="p-6">
                        {recentUsers.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <FiUsers className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                <p>No hay usuarios registrados recientemente.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentUsers.map((user) => (
                                    <div key={user._id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                                        <div className="flex items-center">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${user.role === 'admin' ? 'bg-green-100 text-green-600' : user.role === 'designer' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                                <FiUsers className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{user.name}</p>
                                                <p className="text-sm text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${ROLE_CONFIG[user.role]?.classes || 'bg-gray-100 text-gray-800'}`}>
                                                {ROLE_CONFIG[user.role]?.label || user.role}
                                            </span>
                                            <p className="text-xs text-gray-500 mt-1">{formatDate(user.createdAt)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Proyectos recientes */}
                <div className="bg-white rounded-xl shadow">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-900">Proyectos Recientes</h2>
                            <Link
                                href="/dashboard/admin/projects"
                                className="text-sm text-blue-600 hover:text-blue-800"
                            >
                                Ver todos
                            </Link>
                        </div>
                    </div>
                    <div className="p-6">
                        {recentProjects.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <FiBriefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                <p>No hay proyectos recientes.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentProjects.slice(0, 3).map((project) => (
                                    <div key={project._id} className="p-3 hover:bg-gray-50 rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-medium text-gray-900 truncate">{project.title}</h3>
                                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${STATUS_CONFIG[project.status]?.classes || 'bg-gray-100 text-gray-800'}`}>
                                                {STATUS_CONFIG[project.status]?.label || project.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm text-gray-500">
                                            <div className="flex items-center">
                                                <FiUsers className="w-3 h-3 mr-1" />
                                                <span>{project.client?.name || 'Cliente'}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <FiDollarSign className="w-3 h-3 mr-1" />
                                                <span>
                                                    {formatCurrency(
                                                        (project.clientView?.budget || 0) - (project.designerView?.earnings || 0)
                                                    )}
                                                </span>
                                            </div>
                                            <span>{formatDate(project.createdAt)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Acciones rápidas */}
            <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Acciones Rápidas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link
                        href="/dashboard/admin/users"
                        className="p-4 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                        <div className="flex items-center">
                            <FiUsers className="text-blue-600 mr-3" />
                            <div>
                                <h3 className="font-medium text-gray-900">Verificar Usuarios</h3>
                                <p className="text-sm text-gray-500">Activar/desactivar cuentas</p>
                            </div>
                        </div>
                    </Link>

                    <Link
                        href="/dashboard/admin/projects?hasDesigner=false"
                        className="p-4 bg-green-50 border border-green-100 rounded-lg hover:bg-green-100 transition-colors"
                    >
                        <div className="flex items-center">
                            <FiBriefcase className="text-green-600 mr-3" />
                            <div>
                                <h3 className="font-medium text-gray-900">Asignar Diseñadores</h3>
                                <p className="text-sm text-gray-500">Proyectos sin asignar</p>
                            </div>
                        </div>
                    </Link>

                    <Link
                        href="/dashboard/admin/reports"
                        className="p-4 bg-purple-50 border border-purple-100 rounded-lg hover:bg-purple-100 transition-colors"
                    >
                        <div className="flex items-center">
                            <FiPieChart className="text-purple-600 mr-3" />
                            <div>
                                <h3 className="font-medium text-gray-900">Ver Reportes</h3>
                                <p className="text-sm text-gray-500">Estadísticas detalladas</p>
                            </div>
                        </div>
                    </Link>

                    <Link
                        href="/dashboard/admin/settings"
                        className="p-4 bg-gray-50 border border-gray-100 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <div className="flex items-center">
                            <FiSettings className="text-gray-600 mr-3" />
                            <div>
                                <h3 className="font-medium text-gray-900">Configuración</h3>
                                <p className="text-sm text-gray-500">Ajustes del sistema</p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}