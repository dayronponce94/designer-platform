'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/lib/hooks/useAuth';
import { FiUser, FiLock, FiCreditCard, FiSettings } from 'react-icons/fi';

export default function SettingsPage() {
    const { user } = useAuth();

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <FiSettings className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Configuración de la Cuenta</h1>
                            <p className="text-gray-600 text-sm mt-1"> Gestiona tus datos personales, seguridad y preferencias de facturación.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Panel de Opciones de Configuración */}
            <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Ajustes Disponibles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                    {/* Tarjeta 1: Editar Perfil (Redirige a tu vista existente) */}
                    <Link
                        href="/dashboard/profile" // <-- Ajusta esta ruta a donde tengas tu página probada
                        className="p-4 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                        <div className="flex items-center">
                            <FiUser className="text-blue-600 mr-3 text-xl shrink-0" />
                            <div>
                                <h3 className="font-medium text-gray-900">Editar Perfil</h3>
                                <p className="text-sm text-gray-500">Modifica tus datos de contacto y biografía</p>
                            </div>
                        </div>
                    </Link>

                    {/* Tarjeta 2: Cambiar Contraseña */}
                    <Link
                        href="/dashboard/settings/password"
                        className="p-4 bg-purple-50 border border-purple-100 rounded-lg hover:bg-purple-100 transition-colors"
                    >
                        <div className="flex items-center">
                            <FiLock className="text-purple-600 mr-3 text-xl shrink-0" />
                            <div>
                                <h3 className="font-medium text-gray-900">Seguridad</h3>
                                <p className="text-sm text-gray-500">Actualiza tu contraseña de acceso</p>
                            </div>
                        </div>
                    </Link>

                    {/* Tarjeta 3: Configuración de Stripe (Exclusiva para Diseñadores) */}
                    {user?.role === 'designer' && (
                        <Link
                            href="/dashboard/settings/stripe"
                            className="p-4 bg-emerald-50 border border-emerald-100 rounded-lg hover:bg-emerald-100 transition-colors"
                        >
                            <div className="flex items-center">
                                <FiCreditCard className="text-emerald-600 mr-3 text-xl shrink-0" />
                                <div>
                                    <h3 className="font-medium text-gray-900">Pagos y Stripe</h3>
                                    <p className="text-sm text-gray-500">Vincula tu cuenta para recibir tus ingresos</p>
                                </div>
                            </div>
                        </Link>
                    )}

                </div>
            </div>
        </div>
    );
}