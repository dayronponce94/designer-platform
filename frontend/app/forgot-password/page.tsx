'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import AuthLayout from '@/components/auth/AuthLayout';
import Alert from '@/components/ui/Alert';
import { useAuthContext } from '@/app/providers/AuthProvider';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 2. Extrae la función forgotPassword
    const { forgotPassword } = useAuthContext();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const result = await forgotPassword({ email });

            if (result.success) {
                setIsSubmitted(true);
            } else {
                // Aquí capturamos el mensaje de "Usuario no encontrado" que viene del backend
                setError(result.message);
            }
        } catch (err: any) {
            // Manejo de errores de red o caídas del servidor
            setError("No pudimos conectar con el servidor. Inténtalo más tarde.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <AuthLayout
                title="Revisa tu correo"
                subtitle="Hemos enviado instrucciones para restablecer tu contraseña a tu email."
                showBackButton={false}
                linkText="¿No recibiste nada?"
                linkUrl="/forgot-password"
                onLinkClick={() => setIsSubmitted(false)}
            >
                <div className="text-center space-y-6">
                    <div className="flex justify-center">
                        <div className="bg-green-100 p-4 rounded-full">
                            <FiCheckCircle className="w-12 h-12 text-green-600" />
                        </div>
                    </div>
                    <p className="text-gray-600">
                        Si no recibes el correo en unos minutos, revisa tu carpeta de spam.
                    </p>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            title="¿Olvidaste tu contraseña?"
            subtitle="No te preocupes, dinos tu correo y te ayudaremos a recuperarla."
            linkText="¿Ya recordaste tu clave?"
            linkUrl="/login"
            showBackButton={true}
        >
            {error && (
                <Alert
                    type="error"
                    message={error}
                    onClose={() => setError(null)}
                    className="mb-4"
                />
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Correo Electrónico
                    </label>
                    <div className="relative">
                        <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition"
                            placeholder="tu@email.com"
                            required
                            disabled={isLoading}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading || !email}
                    className="w-full py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
                >
                    {isLoading ? 'Enviando...' : 'Enviar instrucciones'}
                </button>
            </form>
        </AuthLayout>
    );
}