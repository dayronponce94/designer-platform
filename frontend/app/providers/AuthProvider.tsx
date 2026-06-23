'use client';

import { createContext, useContext, ReactNode, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/app/lib/hooks/useAuth';

interface AuthContextType extends ReturnType<typeof useAuth> { }

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const INACTIVITY_TIME = 30 * 60 * 1000; // 30 minutos en milisegundos, puedes ajustar este valor según tus necesidades

export function useAuthContext() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext debe ser usado dentro de AuthProvider');
    }
    return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const auth = useAuth();
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const resetTimer = useCallback(() => {
        // Si hay un temporizador corriendo, lo limpiamos
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Solo activamos el temporizador si hay un usuario logueado
        if (auth.isAuthenticated) {
            timeoutRef.current = setTimeout(async () => {
                console.log("Sesión expirada por inactividad");
                await auth.logout();
                // Forzar un reemplazo de URL limpia el estado colgado de las cookies de Next.js
                window.location.href = '/login?reason=inactivity';
            }, INACTIVITY_TIME);
        }
    }, [auth.isAuthenticated, auth.logout]);

    useEffect(() => {
        // Eventos que consideraremos como "actividad"
        const events = [
            'mousedown',
            'mousemove',
            'keypress',
            'scroll',
            'touchstart',
            'click'
        ];

        // Si el usuario está logueado, escuchamos la actividad
        if (auth.isAuthenticated) {
            resetTimer(); // Iniciar al cargar

            events.forEach(event => {
                window.addEventListener(event, resetTimer);
            });
        }

        return () => {
            // Limpieza al desmontar o al cerrar sesión
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            events.forEach(event => {
                window.removeEventListener(event, resetTimer);
            });
        };
    }, [auth.isAuthenticated, resetTimer]);

    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    );
}