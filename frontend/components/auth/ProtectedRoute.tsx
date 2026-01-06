'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/app/providers/AuthProvider';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: ('client' | 'designer' | 'admin')[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { user, isLoading, isAuthenticated } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }

        if (!isLoading && isAuthenticated && allowedRoles && user && !allowedRoles.includes(user.role)) {
            router.push('/dashboard');
        }
    }, [isLoading, isAuthenticated, user, router, allowedRoles]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!isAuthenticated || (allowedRoles && user && !allowedRoles.includes(user.role))) {
        return null;
    }

    return <>{children}</>;
}