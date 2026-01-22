'use client';

import { useAuthContext } from '@/app/providers/AuthProvider';
import { redirect } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const { user, isLoading } = useAuthContext();

    useEffect(() => {
        // Verificar que el usuario sea administrador
        if (!isLoading && (!user || user.role !== 'admin')) {
            redirect('/dashboard');
        }
    }, [user, isLoading]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Verificando permisos...</p>
                </div>
            </div>
        );
    }

    if (!user || user.role !== 'admin') {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-md">
                    <h3 className="text-lg font-bold mb-2">Acceso denegado</h3>
                    <p>No tienes permisos para acceder al panel de administración.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-layout">
            {children}
        </div>
    );
}