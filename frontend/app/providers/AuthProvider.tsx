'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/app/lib/hooks/useAuth';

interface AuthContextType extends ReturnType<typeof useAuth> { }

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuthContext() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext debe ser usado dentro de AuthProvider');
    }
    return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const auth = useAuth();

    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    );
}