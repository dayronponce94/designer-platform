import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/app/lib/api/endpoints';

interface User {
    _id: string;
    name: string;
    email: string;
    role: 'client' | 'designer' | 'admin';
    company?: string;
    phone?: string;
    specialty?: string;
    bio?: string;
    skills?: string[];
    isVerified: boolean;
    isActive: boolean;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
}

interface LoginData {
    email: string;
    password: string;
    rememberMe?: boolean;
}

interface RegisterData {
    name: string;
    email: string;
    password: string;
    role: 'client' | 'designer';
    phone?: string;
    company?: string;
    specialty?: string;
}

export const useAuth = () => {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        token: null,
        isLoading: true,
        error: null
    });
    const router = useRouter();

    // Inicializar autenticación
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                setAuthState(prev => ({ ...prev, isLoading: false }));
                return;
            }

            // Verificar token con el backend
            const response = await authAPI.getMe();

            if (response.data.success) {
                setAuthState({
                    user: response.data.data.user,
                    token: token,
                    isLoading: false,
                    error: null
                });
            } else {
                // Token inválido
                localStorage.removeItem('token');
                setAuthState({
                    user: null,
                    token: null,
                    isLoading: false,
                    error: null
                });
            }
        } catch (error: any) {
            console.error('Error checking auth:', error);
            localStorage.removeItem('token');
            setAuthState({
                user: null,
                token: null,
                isLoading: false,
                error: error.response?.data?.message || 'Error de autenticación'
            });
        }
    }, []);

    const login = useCallback(async (loginData: LoginData): Promise<{ success: boolean; message: string }> => {
        try {
            setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

            const response = await authAPI.login({
                email: loginData.email,
                password: loginData.password
            });

            if (response.data.success) {
                const { user, token } = response.data.data;

                // Guardar token en localStorage
                localStorage.setItem('token', token);

                setAuthState({
                    user,
                    token,
                    isLoading: false,
                    error: null
                });

                // Redirigir según el rol
                if (user.role === 'admin') {
                    router.push('/admin/dashboard');
                } else {
                    router.push('/dashboard');
                }

                return { success: true, message: 'Inicio de sesión exitoso' };
            } else {
                throw new Error(response.data.message);
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al iniciar sesión';
            setAuthState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
            return { success: false, message: errorMessage };
        }
    }, [router]);

    const register = useCallback(async (registerData: RegisterData): Promise<{ success: boolean; message: string }> => {
        try {
            setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

            const response = await authAPI.register(registerData);

            if (response.data.success) {
                const { user, token } = response.data.data;

                // Guardar token en localStorage
                localStorage.setItem('token', token);

                setAuthState({
                    user,
                    token,
                    isLoading: false,
                    error: null
                });

                // Redirigir al dashboard
                router.push('/dashboard');

                return { success: true, message: 'Registro exitoso' };
            } else {
                throw new Error(response.data.message);
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al registrarse';
            setAuthState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
            return { success: false, message: errorMessage };
        }
    }, [router]);

    const logout = useCallback(async () => {
        try {
            await authAPI.logout();
        } catch (error) {
            console.error('Error en logout:', error);
        } finally {
            // Limpiar estado local sin importar el resultado del backend
            localStorage.removeItem('token');
            setAuthState({
                user: null,
                token: null,
                isLoading: false,
                error: null
            });
            router.push('/login');
        }
    }, [router]);

    const updateUser = useCallback((userData: Partial<User>) => {
        setAuthState(prev => ({
            ...prev,
            user: prev.user ? { ...prev.user, ...userData } : null
        }));
    }, []);

    const clearError = useCallback(() => {
        setAuthState(prev => ({ ...prev, error: null }));
    }, []);

    return {
        user: authState.user,
        token: authState.token,
        isLoading: authState.isLoading,
        error: authState.error,
        login,
        register,
        logout,
        updateUser,
        clearError,
        isAuthenticated: !!authState.user
    };
};