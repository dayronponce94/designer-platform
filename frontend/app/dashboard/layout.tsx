'use client';

import { ReactNode } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardNavbar from '@/components/layout/DashboardNavbar';
import Sidebar from '@/components/layout/Sidebar';

export default function DashboardLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <ProtectedRoute allowedRoles={['client', 'designer', 'admin']}>
            <div className="min-h-screen bg-gray-50">
                <DashboardNavbar />
                <div className="flex">
                    <Sidebar />
                    <main className="flex-1 p-6 md:p-8">
                        <div className="max-w-7xl mx-auto">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
}