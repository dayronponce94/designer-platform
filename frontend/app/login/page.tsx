'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import AuthLayout from '@/components/auth/AuthLayout';
import { useAuthContext } from '@/app/providers/AuthProvider';
import Alert from '@/components/ui/Alert';

export default function LoginPage() {
    const router = useRouter();
    const { login, isLoading, error, clearError } = useAuthContext();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();

        const result = await login(formData);

        if (result.success) {
            // Redirección manejada por el hook
            return;
        }

        // El error ya está manejado por el hook
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Limpiar error cuando el usuario empieza a escribir
        if (error) clearError();
    };

    return (
        <AuthLayout
            title="Bienvenido de nuevo"
            subtitle="Ingresa a tu cuenta para continuar con tus proyectos."
            linkText="¿No tienes una cuenta?"
            linkUrl="/register"
            showBackButton={true}
            isLongForm={false}
        >
            {error && (
                <Alert
                    type="error"
                    message={error}
                    onClose={clearError}
                    className="mb-4"
                />
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Campo Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Correo Electrónico
                    </label>
                    <div className="relative">
                        <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition"
                            placeholder="tu@email.com"
                            required
                            disabled={isLoading}
                        />
                    </div>
                </div>

                {/* Campo Contraseña */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Contraseña
                        </label>
                        <Link
                            href="/forgot-password"
                            className="text-sm text-primary hover:underline"
                        >
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>
                    <div className="relative">
                        <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition"
                            placeholder="••••••••"
                            required
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                    </div>
                </div>

                {/* Recordarme y Botón */}
                <div className="flex items-center justify-between">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="rememberMe"
                            checked={formData.rememberMe}
                            onChange={handleChange}
                            className="w-4 h-4 text-primary rounded focus:ring-primary/30"
                            disabled={isLoading}
                        />
                        <span className="ml-2 text-gray-700">Recordar esta sesión</span>
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Iniciando sesión...
                        </div>
                    ) : (
                        'Iniciar Sesión'
                    )}
                </button>
            </form>
        </AuthLayout>
    );
}