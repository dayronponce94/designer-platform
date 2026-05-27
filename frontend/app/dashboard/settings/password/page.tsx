'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/app/lib/api/endpoints'; // Usaremos tu API mapeada
import { FiLock, FiArrowLeft, FiEye, FiEyeOff } from 'react-icons/fi';
import Link from 'next/link';

export default function ChangePasswordPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus(null);

        // Validaciones en Frontend
        if (formData.newPassword !== formData.confirmPassword) {
            setStatus({ type: 'error', message: 'La nueva contraseña y la confirmación no coinciden.' });
            return;
        }

        if (formData.newPassword.length < 6) {
            setStatus({ type: 'error', message: 'La nueva contraseña debe tener al menos 6 caracteres.' });
            return;
        }

        setIsLoading(true);

        try {
            // Ejecutamos la petición enviando ambos datos requeridos por el backend
            const response = await authAPI.updatePassword({
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            });

            if (response.data.success) {
                setStatus({ type: 'success', message: 'Contraseña actualizada con éxito.' });
                setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });

                // Redirigir al panel de ajustes tras 2 segundos
                setTimeout(() => {
                    router.push('/dashboard/settings');
                }, 2000);
            }
        } catch (error: any) {
            console.error(error);
            setStatus({
                type: 'error',
                message: error.response?.data?.message || 'Error al intentar cambiar la contraseña.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            {/* Botón para regresar al panel de Settings */}
            <Link
                href="/dashboard/settings"
                className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
            >
                <FiArrowLeft className="mr-2" /> Volver a Ajustes
            </Link>

            <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center mb-6">
                    <div className="p-3 bg-purple-50 rounded-lg mr-4">
                        <FiLock className="text-purple-600 text-xl" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Seguridad de la Cuenta</h1>
                        <p className="text-sm text-gray-500">Actualiza tu contraseña para mantener tu cuenta segura.</p>
                    </div>
                </div>

                {status && (
                    <div className={`p-4 mb-4 rounded-lg text-sm border ${status.type === 'success'
                        ? 'bg-green-50 text-green-800 border-green-200'
                        : 'bg-red-50 text-red-800 border-red-200'
                        }`}>
                        {status.message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Contraseña Actual */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700">Contraseña Actual</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <input
                                type={showPasswords.current ? 'text' : 'password'}
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                className="block w-full rounded-md border border-gray-300 p-2.5 pr-10 focus:border-purple-500 focus:ring-purple-500 text-black text-sm"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('current')}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                            >
                                {showPasswords.current ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                    </div>

                    {/* Nueva Contraseña */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700">Nueva Contraseña</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <input
                                type={showPasswords.new ? 'text' : 'password'}
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                className="block w-full rounded-md border border-gray-300 p-2.5 pr-10 focus:border-purple-500 focus:ring-purple-500 text-black text-sm"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('new')}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                            >
                                {showPasswords.new ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                    </div>

                    {/* Confirmar Nueva Contraseña */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700">Confirmar Nueva Contraseña</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <input
                                type={showPasswords.confirm ? 'text' : 'password'}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="block w-full rounded-md border border-gray-300 p-2.5 pr-10 focus:border-purple-500 focus:ring-purple-500 text-black text-sm"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('confirm')}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                            >
                                {showPasswords.confirm ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md text-sm shadow-sm disabled:opacity-50 transition-colors"
                        >
                            {isLoading ? 'Actualizando...' : 'Actualizar Contraseña'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}