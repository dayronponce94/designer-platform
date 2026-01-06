'use client';

import Link from 'next/link';
import { useAuthContext } from '@/app/providers/AuthProvider';
import { FiLogOut, FiUser } from 'react-icons/fi';

export default function DashboardNavbar() {
    const { user, logout } = useAuthContext();

    return (
        <nav className="bg-white shadow-lg border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/dashboard" className="flex items-center">
                            <span className="text-2xl font-bold text-blue-600">
                                DesignerPlatform
                            </span>
                            <span className="ml-2 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                Dashboard
                            </span>
                        </Link>
                    </div>

                    {/* User info and logout */}
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                                <FiUser className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="hidden md:block">
                                <p className="text-sm font-medium text-gray-900">
                                    {user?.name}
                                </p>
                                <p className="text-xs text-gray-500 capitalize">
                                    {user?.role === 'designer' ? 'Diseñador' : user?.role === 'admin' ? 'Administrador' : 'Cliente'}
                                </p>
                            </div>
                        </div>

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
        </nav>
    );
}