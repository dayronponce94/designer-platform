'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'client' | 'designer' | 'admin';
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (userData: any) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de AuthProvider');
    }
    return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                // Aquí implementaríamos la verificación del token
                // Por ahora, solo simulamos
                setUser({
                    id: '1',
                    name: 'Usuario Demo',
                    email: 'demo@email.com',
                    role: 'client'
                });
            }
        } catch (error) {
            console.error('Error checking auth:', error);
            localStorage.removeItem('token');
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            // Simulación de login
            setUser({
                id: '1',
                name: 'Usuario Demo',
                email,
                role: 'client'
            });
            localStorage.setItem('token', 'demo-token');
            router.push('/dashboard');
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (userData: any) => {
        setIsLoading(true);
        try {
            // Simulación de registro
            setUser({
                id: '1',
                name: userData.name,
                email: userData.email,
                role: 'client'
            });
            localStorage.setItem('token', 'demo-token');
            router.push('/dashboard');
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        localStorage.removeItem('token');
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}