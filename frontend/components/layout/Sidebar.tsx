'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    FiHome,
    FiBriefcase,
    FiMessageSquare,
    FiSettings,
    FiCreditCard,
    FiUsers,
    FiFileText,
    FiBell,
    FiChevronLeft,
    FiChevronRight,
    FiStar,
    FiCalendar,
    FiDollarSign
} from 'react-icons/fi';
import { useAuthContext } from '@/app/providers/AuthProvider';

export default function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { user } = useAuthContext();

    const clientNavigation = [
        { name: 'Inicio', href: '/dashboard', icon: FiHome },
        { name: 'Mis Proyectos', href: '/dashboard/projects', icon: FiBriefcase },
        { name: 'Mensajes', href: '/dashboard/messages', icon: FiMessageSquare },
        { name: 'Facturación', href: '/dashboard/billing', icon: FiCreditCard },
        { name: 'Calendario', href: '/dashboard/calendar', icon: FiCalendar },
    ];

    const designerNavigation = [
        { name: 'Inicio', href: '/dashboard', icon: FiHome },
        { name: 'Proyectos', href: '/dashboard/projects', icon: FiBriefcase },
        { name: 'Mensajes', href: '/dashboard/messages', icon: FiMessageSquare },
        { name: 'Portafolio', href: '/dashboard/portfolio', icon: FiStar },
        { name: 'Facturación', href: '/dashboard/billing', icon: FiDollarSign },
        { name: 'Calendario', href: '/dashboard/calendar', icon: FiCalendar },
    ];

    const adminNavigation = [
        { name: 'Inicio', href: '/dashboard', icon: FiHome },
        { name: 'Proyectos', href: '/dashboard/projects', icon: FiBriefcase },
        { name: 'Clientes', href: '/dashboard/clients', icon: FiUsers },
        { name: 'Diseñadores', href: '/dashboard/designers', icon: FiUsers },
        { name: 'Facturación', href: '/dashboard/billing', icon: FiCreditCard },
        { name: 'Reportes', href: '/dashboard/reports', icon: FiFileText },
    ];

    // Seleccionar navegación según el rol
    let navigation = clientNavigation;
    if (user?.role === 'designer') navigation = designerNavigation;
    if (user?.role === 'admin') navigation = adminNavigation;

    return (
        <div className={`bg-white border-r border-gray-200 min-h-screen transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'} sticky top-0 h-screen`}>
            <div className="p-4 h-full flex flex-col">
                <div className="flex items-center justify-between mb-8">
                    {!isCollapsed && (
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Panel de Control</h2>
                            <p className="text-xs text-gray-500 mt-1">
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

                {/* Configuración siempre al final */}
                <div className="mt-auto pt-4 border-t border-gray-200">
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