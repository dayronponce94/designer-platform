'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuthContext } from '@/app/providers/AuthProvider';
import { FiLogOut, FiUser, FiBell, FiMenu, FiX, FiCheck, FiUpload, FiDollarSign, FiLayers, FiMessageSquare } from 'react-icons/fi';
import { useNotifications } from '@/app/lib/hooks/useNotifications';
import Image from 'next/image';


export default function DashboardNavbar() {
    const { user, logout } = useAuthContext();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showNotifDropdown, setShowNotifDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { notifications, unreadCount, markAsRead, fetchNotifications } = useNotifications();
    const isAdmin = user?.role === 'admin';

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'project_delivered':
                return {
                    icon: <FiUpload className="w-4 h-4 text-purple-600" />,
                    bgColor: 'bg-purple-100'
                };
            case 'payment_confirmed':
            case 'designer_payout':
                return {
                    icon: <FiDollarSign className="w-4 h-4 text-emerald-600" />,
                    bgColor: 'bg-emerald-100'
                };
            case 'project_status_changed':
            case 'project_assigned':
                return {
                    icon: <FiLayers className="w-4 h-4 text-blue-600" />,
                    bgColor: 'bg-blue-100'
                };
            case 'new_message':
                return {
                    icon: <FiMessageSquare className="w-4 h-4 text-amber-600" />,
                    bgColor: 'bg-amber-100'
                };
            case 'system':
            default:
                return {
                    icon: <FiBell className="w-4 h-4 text-indigo-600" />,
                    bgColor: 'bg-indigo-100'
                };
        }
    };

    // Cerrar dropdown al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowNotifDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Cargar notificaciones cuando se abre el dropdown
    const toggleNotifications = () => {
        if (!showNotifDropdown) {
            fetchNotifications(1, 5); // Solo traemos las 5 más recientes
        }
        setShowNotifDropdown(!showNotifDropdown);
    };


    return (
        <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo + botón hamburguesa (visible en móvil) */}
                    <div className="flex items-center h-full max-w-60 md:max-w-70">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                            aria-label="Abrir menú"
                        >
                            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                        </button>

                        <div className="flex items-center h-12 w-auto overflow-hidden">
                            <Link href="/dashboard" className="flex items-center">
                                <Image
                                    src="/projects/full-logo.png"
                                    alt="DesignerPlatform Logo"
                                    width={170}
                                    height={40}
                                    priority
                                    className="object-contain h-full w-auto"
                                />
                                {!isAdmin && (
                                    <span className="ml-2 text-sm text-gray-500 bg-gray-100 px-1 py-1 rounded">
                                        Dashboard
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>

                    {/* Menú derecho (solo desktop) */}
                    <div className="hidden md:flex items-center space-x-4">

                        {/* CONTENEDOR DE NOTIFICACIONES */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={toggleNotifications}
                                className={`relative p-2 rounded-full transition-colors ${showNotifDropdown ? 'bg-gray-100 text-blue-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                    }`}
                            >
                                <FiBell className="w-6 h-6" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-0 right-0 w-5 h-5 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </button>

                            {/* DROPDOWN DE NOTIFICACIONES */}
                            {showNotifDropdown && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden ring-1 ring-black ring-opacity-5 animate-in fade-in zoom-in duration-200">
                                    <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                                        <h3 className="text-sm font-bold text-gray-800">Notificaciones</h3>
                                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                                            {unreadCount} nuevas
                                        </span>
                                    </div>

                                    <div className="max-h-96 overflow-y-auto">
                                        {/* REEMPLAZA POR ESTE BLOQUE CORREGIDO: */}
                                        {notifications.length > 0 ? (
                                            notifications.map((notif) => {
                                                const { icon, bgColor } = getNotificationIcon(notif.type);
                                                return (
                                                    <div
                                                        key={notif._id}
                                                        onClick={() => !notif.read && markAsRead(notif._id)}
                                                        className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer relative flex items-start space-x-3 ${!notif.read ? 'bg-blue-50/30' : ''}`}
                                                    >
                                                        {/* Indicador de no leído */}
                                                        {!notif.read && (
                                                            <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                                                        )}

                                                        {/* Círculo con Icono Dinámico */}
                                                        <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center border border-transparent ${bgColor}`}>
                                                            {icon}
                                                        </div>

                                                        {/* Contenido de la Notificación */}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-semibold text-gray-900 truncate">{notif.title}</p>
                                                            <p className="text-xs text-gray-600 line-clamp-2 mt-0.5">{notif.message}</p>
                                                            <p className="text-[10px] text-gray-400 mt-1">
                                                                {new Date(notif.createdAt).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="p-8 text-center">
                                                <p className="text-sm text-gray-500">No tienes notificaciones</p>
                                            </div>
                                        )}
                                    </div>

                                    <Link
                                        href="/dashboard/notifications"
                                        onClick={() => setShowNotifDropdown(false)}
                                        className="block p-3 text-center text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors border-t border-gray-100"
                                    >
                                        Ver todas las notificaciones
                                    </Link>
                                </div>
                            )}
                        </div>

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
                        {!isAdmin && (
                            <Link
                                href="/dashboard"
                                className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Dashboard
                            </Link>
                        )}

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