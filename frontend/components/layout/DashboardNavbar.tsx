'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuthContext } from '@/app/providers/AuthProvider';
import { FiLogOut, FiUser, FiBell, FiMenu, FiX } from 'react-icons/fi';
import { useNotifications } from '@/app/lib/hooks/useNotifications';

export default function DashboardNavbar() {
    const { user, logout } = useAuthContext();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { unreadCount } = useNotifications();

    return (
        <nav className="bg-white shadow-lg border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo + botón hamburguesa (visible en móvil) */}
                    <div className="flex items-center">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                            aria-label="Abrir menú"
                        >
                            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                        </button>

                        <Link href="/dashboard" className="flex items-center">
                            <span className="text-2xl font-bold text-blue-600">
                                DesignerPlatform
                            </span>
                            <span className="ml-2 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                Dashboard
                            </span>
                        </Link>
                    </div>

                    {/* Menú derecho (solo desktop) */}
                    <div className="hidden md:flex items-center space-x-4">
                        {/* Notificaciones */}
                        <Link
                            href="/dashboard/notifications"
                            className="relative p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100"
                        >
                            <FiBell className="w-6 h-6" />
                            {unreadCount > 0 && (
                                <span className="absolute top-0 right-0 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </Link>

                        {/* Perfil del usuario */}
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                                <FiUser className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="hidden md:block">
                                <p className="text-sm font-medium text-gray-900">
                                    {user?.name}
                                </p>
                                <p className="text-xs text-gray-500 capitalize">
                                    {user?.role === 'designer'
                                        ? 'Diseñador'
                                        : user?.role === 'admin'
                                            ? 'Administrador'
                                            : 'Cliente'}
                                </p>
                            </div>
                        </div>

                        {/* Botón de cerrar sesión */}
                        <button
                            onClick={logout}
                            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                            <FiLogOut className="w-4 h-4" />
                            <span>Cerrar Sesión</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Menú móvil (solo visible cuando mobileMenuOpen) */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg z-50">
                    <div className="px-4 pt-4 pb-6 space-y-4">
                        <Link
                            href="/dashboard"
                            className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Dashboard
                        </Link>

                        <Link
                            href="/dashboard/notifications"
                            className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Notificaciones
                            {unreadCount > 0 && (
                                <span className="ml-auto bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                                    {unreadCount}
                                </span>
                            )}
                        </Link>

                        <Link
                            href="/dashboard/profile"
                            className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Mi Perfil
                        </Link>

                        {/* Info del usuario */}
                        <div className="p-3 border-t border-gray-200">
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-3">
                                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{user?.name}</p>
                                    <p className="text-sm text-gray-500">{user?.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Cerrar sesión móvil */}
                        <button
                            onClick={() => {
                                logout();
                                setMobileMenuOpen(false);
                            }}
                            className="w-full flex items-center justify-center p-3 text-red-600 hover:bg-red-50 rounded-lg border border-red-200"
                        >
                            <FiLogOut className="mr-2" />
                            Cerrar sesión
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}