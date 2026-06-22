'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuthContext } from '@/app/providers/AuthProvider';
import AuthLayout from '@/components/auth/AuthLayout';
import { FiCheckCircle, FiEye, FiEyeOff, FiLock } from 'react-icons/fi';
import Alert from '@/components/ui/Alert';

function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
    const [isSuccess, setIsSuccess] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { resetPassword } = useAuthContext();


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        if (password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres");
            return;
        }

        setStatus('loading');
        try {
            const result = await resetPassword(token as string, password);

            if (result.success) {
                setIsSuccess(true);
                setTimeout(() => {
                    router.push('/login');
                }, 3000);
            } else {
                setError(result.message);
                setStatus('idle');
            }
        } catch (err) {
            setError("Ocurrió un error inesperado. Inténtalo más tarde.");
            setStatus('idle');
        }
    };

    // En el render, si isSuccess es true, mostramos un componente visual
    if (isSuccess) {
        return (
            <AuthLayout
                title="¡Todo listo!"
                subtitle="Tu contraseña ha sido actualizada."
                showBackButton={false}
                linkText="Ir al inicio de sesión"
                linkUrl="/login"
            >
                <div className="text-center py-6 space-y-4">
                    <div className="flex justify-center">
                        <div className="bg-green-100 p-4 rounded-full">
                            <FiCheckCircle className="w-12 h-12 text-green-600" />
                        </div>
                    </div>
                    <p className="text-gray-600">
                        Tu contraseña se ha cambiado correctamente. En unos segundos serás redirigido al login.
                    </p>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            title="Nueva Contraseña"
            subtitle="Ingresa tu nueva clave de acceso para recuperar tu cuenta."
            linkText="¿Recordaste tu contraseña?"
            linkUrl="/login"
            showBackButton={true}
        >
            {/* AQUÍ ES DONDE SE MUESTRA EL ERROR AHORA */}
            {error && (
                <Alert
                    type="error"
                    message={error}
                    onClose={() => setError(null)}
                    className="mb-6"
                />
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nueva Contraseña
                        </label>
                        <div className="relative">
                            <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition"
                                placeholder="Mínimo 6 caracteres"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirmar Contraseña
                        </label>
                        <div className="relative">
                            <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition"
                                placeholder="Repite tu contraseña"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                            >
                                {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                >
                    {status === 'loading' ? (
                        <div className="flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Actualizando...
                        </div>
                    ) : (
                        'Restablecer contraseña'
                    )}
                </button>
            </form>
        </AuthLayout>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-4 text-gray-600 font-medium">
                    Cargando formulario...
                </div>
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    );
}