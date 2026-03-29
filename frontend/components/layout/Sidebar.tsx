'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    FiHome,
    FiBriefcase,
    FiBell,
    FiSettings,
    FiCreditCard,
    FiUsers,
    FiFileText,
    FiChevronLeft,
    FiChevronRight,
    FiFolder,
    FiCalendar,
    FiDollarSign,
    FiUpload,
    FiPieChart,
    FiClipboard
} from 'react-icons/fi';
import { useAuthContext } from '@/app/providers/AuthProvider';

export default function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const pathname = usePathname();
    const { user } = useAuthContext();

    // Navegación para CLIENTES
    const clientNavigation = [
        { name: 'Inicio', href: '/dashboard', icon: FiHome },
        { name: 'Solicitudes', href: '/dashboard/requests', icon: FiClipboard },
        { name: 'Cotizaciones', href: '/dashboard/quotes', icon: FiFileText },
        { name: 'Proyectos', href: '/dashboard/projects', icon: FiBriefcase },
        { name: 'Notificaciones', href: '/dashboard/notifications', icon: FiBell },
        { name: 'Pagos', href: '/dashboard/payments', icon: FiCreditCard },
        { name: 'Próximas Entregas', href: '/dashboard/deliveries', icon: FiCalendar },
    ];

    // Navegación para DISEÑADORES
    const designerNavigation = [
        { name: 'Inicio', href: '/dashboard', icon: FiHome },
        { name: 'Cotizaciones', href: '/dashboard/designer/quotes', icon: FiFileText },
        { name: 'Proyectos Asignados', href: '/dashboard/designer/projects', icon: FiBriefcase },
        { name: 'Notificaciones', href: '/dashboard/notifications', icon: FiBell },
        { name: 'Mi Portafolio', href: '/dashboard/designer/portfolio/', icon: FiFolder },
        { name: 'Mis Ingresos', href: '/dashboard/designer/earnings', icon: FiDollarSign },
        { name: 'Mis Plazos', href: '/dashboard/designer/deadlines', icon: FiCalendar },
    ];

    // Navegación para ADMIN
    const adminNavigation = [
        { name: 'Inicio', href: '/dashboard/admin', icon: FiHome },
        { name: 'Usuarios', href: '/dashboard/admin/users', icon: FiUsers },
        { name: 'Solicitudes', href: '/dashboard/admin/requests', icon: FiClipboard },
        { name: 'Cotizaciones / Clientes', href: '/dashboard/admin/client-quotes', icon: FiFileText },
        { name: 'Cotizaciones / Diseñadores', href: '/dashboard/admin/designer-quotes', icon: FiFileText },
        { name: 'Proyectos', href: '/dashboard/admin/projects', icon: FiBriefcase },
        { name: 'Pagos', href: '/dashboard/admin/payments', icon: FiCreditCard },
        { name: 'Notificaciones', href: '/dashboard/notifications', icon: FiBell },
        { name: 'Reportes', href: '/dashboard/admin/reports', icon: FiPieChart },
    ];

    // Seleccionar navegación según el rol
    let navigation = clientNavigation;
    if (user?.role === 'designer') navigation = designerNavigation;
    if (user?.role === 'admin') navigation = adminNavigation;

    return (
        <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'} sticky top-0 h-full`}>
            <div className="p-4 h-full flex flex-col">
                <div className="flex items-center justify-between mb-8">
                    {!isCollapsed && (
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Panel de Control</h2>
                            <p className="text-xs text-gray-500 mt-1 capitalize">
                                {user?.role === 'designer' ? 'Diseñador' : user?.role === 'admin' ? 'Administrador' : 'Cliente'}
                            </p>
                        </div>
                    )}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-2 rounded-lg hover:bg-gray-100"
                    >
                        {isCollapsed ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
                    </button>
                </div>

                <nav className="space-y-1 flex-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center ${isCollapsed ? 'justify-center' : 'px-3'} py-2.5 rounded-lg transition-colors ${isActive
                                    ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                title={isCollapsed ? item.name : ''}
                            >
                                <item.icon className={`${isCollapsed ? '' : 'mr-3'} h-5 w-5`} />
                                {!isCollapsed && <span className="font-medium">{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Botón de acción principal según rol */}
                <div className="mt-auto pt-4 border-t border-gray-200">
                    {user?.role === 'client' && (
                        <Link
                            href="/dashboard/requests/new"
                            className="flex items-center justify-center w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mb-3"
                        >
                            <FiUpload className="mr-2" />
                            {!isCollapsed && <span>Solicitar Proyecto</span>}
                        </Link>
                    )}

                    {user?.role === 'designer' && (
                        <Link
                            href="/dashboard/designer/deliverables"
                            className="flex items-center justify-center w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors mb-3"
                        >
                            <FiUpload className="mr-2" />
                            {!isCollapsed && <span>Subir Entregable</span>}
                        </Link>
                    )}

                    <Link
                        href="/dashboard/settings"
                        className={`flex items-center ${isCollapsed ? 'justify-center' : 'px-3'} py-2.5 rounded-lg transition-colors ${pathname === '/dashboard/settings'
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                        title={isCollapsed ? 'Configuración' : ''}
                    >
                        <FiSettings className={`${isCollapsed ? '' : 'mr-3'} h-5 w-5`} />
                        {!isCollapsed && <span className="font-medium">Configuración</span>}
                    </Link>
                </div>
            </div>
        </div>
    );
}