'use client';

import { useAuthContext } from '@/app/providers/AuthProvider';
import { FiBriefcase, FiMessageSquare, FiDollarSign, FiCalendar, FiStar } from 'react-icons/fi';

export default function DashboardPage() {
    const { user, isLoading } = useAuthContext();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-100">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const stats = [
        { name: 'Proyectos Activos', value: '0', icon: FiBriefcase, color: 'blue' },
        { name: 'Mensajes', value: '0', icon: FiMessageSquare, color: 'green' },
        { name: 'Facturación', value: '$0', icon: FiDollarSign, color: 'purple' },
        { name: 'Próximas Reuniones', value: '0', icon: FiCalendar, color: 'orange' },
    ];

    const quickActions = [
        { name: 'Nuevo Proyecto', icon: '➕', color: 'blue', href: '/dashboard/projects/new' },
        { name: 'Ver Portafolio', icon: '📋', color: 'purple', href: '/portfolio' },
        { name: 'Contactar Soporte', icon: '💬', color: 'green', href: '/contact' },
        { name: 'Explorar Servicios', icon: '🎨', color: 'orange', href: '/services' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    Bienvenido, {user?.name} 👋
                </h1>
                <p className="text-gray-600 mt-2">
                    {user?.role === 'designer'
                        ? 'Gestiona tus proyectos y muestra tu talento.'
                        : user?.role === 'admin'
                            ? 'Administra la plataforma y supervisa proyectos.'
                            : 'Solicita nuevos proyectos y sigue el progreso de tus diseños.'
                    }
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    const colorClasses = {
                        blue: 'bg-blue-100 text-blue-600',
                        green: 'bg-green-100 text-green-600',
                        purple: 'bg-purple-100 text-purple-600',
                        orange: 'bg-orange-100 text-orange-600',
                    };

                    return (
                        <div key={stat.name} className="bg-white rounded-xl shadow p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">{stat.name}</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                                </div>
                                <div className={`p-3 rounded-lg ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Acciones rápidas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickActions.map((action) => (
                        <a
                            key={action.name}
                            href={action.href}
                            className={`p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-${action.color}-500 hover:bg-${action.color}-50 transition text-center group`}
                        >
                            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                                {action.icon}
                            </div>
                            <p className="font-medium text-gray-900 group-hover:text-${action.color}-600">
                                {action.name}
                            </p>
                        </a>
                    ))}
                </div>
            </div>

            {/* User Info Card */}
            <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Tu información</h2>
                        <div className="mt-4 space-y-3">
                            <div className="flex items-center">
                                <span className="w-32 text-gray-600 font-medium">Rol:</span>
                                <span className="capitalize px-3 py-1 bg-gray-100 rounded-full text-sm">
                                    {user?.role === 'designer' ? 'Diseñador' : user?.role === 'admin' ? 'Administrador' : 'Cliente'}
                                </span>
                            </div>
                            <div className="flex items-center">
                                <span className="w-32 text-gray-600 font-medium">Email:</span>
                                <span className="text-gray-900">{user?.email}</span>
                            </div>
                            {user?.company && (
                                <div className="flex items-center">
                                    <span className="w-32 text-gray-600 font-medium">Empresa:</span>
                                    <span className="text-gray-900">{user.company}</span>
                                </div>
                            )}
                            {user?.specialty && (
                                <div className="flex items-center">
                                    <span className="w-32 text-gray-600 font-medium">Especialidad:</span>
                                    <span className="text-gray-900 capitalize">{user.specialty}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="hidden lg:block">
                        <div className="w-48 h-48 bg-linear-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                            <FiStar className="w-24 h-24 text-blue-300" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Onboarding Steps */}
            <div className="bg-linear-to-r from-blue-50 to-purple-50 rounded-xl shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Comienza tu viaje</h2>
                <div className="space-y-4">
                    {user?.role === 'client' ? (
                        <>
                            <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3">
                                    1
                                </div>
                                <div>
                                    <p className="font-medium">Explora nuestros servicios</p>
                                    <p className="text-sm text-gray-600">Descubre lo que podemos crear para ti</p>
                                </div>
                            </div>
                            <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3">
                                    2
                                </div>
                                <div>
                                    <p className="font-medium">Solicita tu primer proyecto</p>
                                    <p className="text-sm text-gray-600">Comienza a transformar tus ideas en realidad</p>
                                </div>
                            </div>
                        </>
                    ) : user?.role === 'designer' ? (
                        <>
                            <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center mr-3">
                                    1
                                </div>
                                <div>
                                    <p className="font-medium">Completa tu portafolio</p>
                                    <p className="text-sm text-gray-600">Muestra tu mejor trabajo a los clientes</p>
                                </div>
                            </div>
                            <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center mr-3">
                                    2
                                </div>
                                <div>
                                    <p className="font-medium">Configura tu disponibilidad</p>
                                    <p className="text-sm text-gray-600">Define cuándo puedes aceptar nuevos proyectos</p>
                                </div>
                            </div>
                        </>
                    ) : null}
                </div>
            </div>
        </div>
    );
}