'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { usePortfolio } from '@/app/lib/hooks/usePortfolio';
import { useAuthContext } from '@/app/providers/AuthProvider';
import {
    FiUpload,
    FiX,
    FiImage,
    FiTag,
    FiCalendar,
    FiTool,
    FiUser,
    FiSave,
    FiArrowLeft,
    FiCheck,
    FiAlertCircle
} from 'react-icons/fi';

// Este es un componente placeholder - similar al de upload pero para edición
export default function EditPortfolioPage() {
    const router = useRouter();
    const params = useParams();
    const { user } = useAuthContext();
    const { item, fetchPortfolioItem, updatePortfolioItem, loading } = usePortfolio();

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (params.id && typeof params.id === 'string') {
            fetchPortfolioItem(params.id).finally(() => setIsLoading(false));
        }
    }, [params.id, fetchPortfolioItem]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando trabajo...</p>
                </div>
            </div>
        );
    }

    if (!item) {
        return (
            <div className="bg-white rounded-xl shadow p-8 text-center">
                <FiImage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                    Aún no tienes trabajos creados
                </h3>
                <p className="text-gray-600 mb-6">
                    Agrega tu primer trabajo para comenzar tu portafolio.
                </p>
                <button
                    onClick={() => router.push('/dashboard/designer/portfolio/upload')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    <FiUpload className="inline mr-2" />
                    Agregar primer trabajo
                </button>
            </div>
        );
    }
    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow p-8 text-center">
                <FiImage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                    Página de edición en desarrollo
                </h3>
                <p className="text-gray-600 mb-6">
                    Esta funcionalidad estará disponible en la próxima actualización.
                </p>
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={() => router.push('/dashboard/designer/portfolio')}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                        <FiArrowLeft className="inline mr-2" />
                        Volver al Portafolio
                    </button>
                    <button
                        onClick={() => router.push('/dashboard/designer/portfolio/upload')}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        <FiUpload className="inline mr-2" />
                        Agregar Nuevo Trabajo
                    </button>
                </div>
            </div>
        </div>
    );
}