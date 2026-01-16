'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { usePortfolio } from '@/app/lib/hooks/usePortfolio';
import { useAuthContext } from '@/app/providers/AuthProvider';
import {
    FiArrowLeft,
    FiCalendar,
    FiTag,
    FiTool,
    FiUser,
    FiImage,
    FiEdit,
    FiTrash2,
    FiDownload,
    FiShare2,
    FiChevronLeft,
    FiChevronRight
} from 'react-icons/fi';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Image from 'next/image';

export default function PortfolioItemDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const { user } = useAuthContext();
    const { item, fetchPortfolioItem, deletePortfolioItem, loading, error } = usePortfolio();

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (params.id && typeof params.id === 'string') {
            fetchPortfolioItem(params.id);
        }
    }, [params.id, fetchPortfolioItem]);

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'No especificada';
        try {
            const date = new Date(dateString);
            return format(date, "dd 'de' MMMM, yyyy", { locale: es });
        } catch (error) {
            return 'Fecha inválida';
        }
    };

    const getCategoryLabel = (category: string) => {
        const labels: Record<string, string> = {
            'branding': 'Diseño de Marca',
            'ux-ui': 'Diseño UX/UI',
            'graphic': 'Diseño Gráfico',
            'web': 'Diseño Web',
            'motion': 'Animación Gráfica',
            'illustration': 'Ilustración',
            'other': 'Otro'
        };
        return labels[category] || category;
    };

    const handleDelete = async () => {
        if (!item) return;

        try {
            setIsDeleting(true);
            await deletePortfolioItem(item._id);
            router.push('/dashboard/designer/portfolio');
        } catch (err) {
            console.error('Error al eliminar:', err);
        } finally {
            setIsDeleting(false);
            setDeleteConfirm(false);
        }
    };

    const handlePreviousImage = () => {
        if (item && item.images.length > 0) {
            setCurrentImageIndex(prev =>
                prev === 0 ? item.images.length - 1 : prev - 1
            );
        }
    };

    const handleNextImage = () => {
        if (item && item.images.length > 0) {
            setCurrentImageIndex(prev =>
                prev === item.images.length - 1 ? 0 : prev + 1
            );
        }
    };

    const handleEdit = () => {
        if (item) {
            router.push(`/dashboard/designer/portfolio/edit/${item._id}`);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-100">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando proyecto...</p>
                </div>
            </div>
        );
    }

    if (error || !item) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <p>{error || 'Proyecto no encontrado'}</p>
                <button
                    onClick={() => router.push('/dashboard/designer/portfolio')}
                    className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                    Volver al Portafolio
                </button>
            </div>
        );
    }

    const currentImage = item.images[currentImageIndex];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => router.push('/dashboard/designer/portfolio')}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                    >
                        <FiArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{item.title}</h1>
                        <p className="text-gray-600 mt-1">
                            {getCategoryLabel(item.category)} • {formatDate(item.createdAt)}
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <button
                        onClick={handleEdit}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        <FiEdit className="mr-2" />
                        Editar Proyecto
                    </button>
                </div>
            </div>

            {/* Galería de imágenes */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="relative aspect-video bg-gray-100">
                    {currentImage ? (
                        <div className="relative w-full h-full">
                            <img
                                src={currentImage.url}
                                alt={item.title}
                                className="w-full h-full object-contain"
                            />

                            {/* Navegación de imágenes */}
                            {item.images.length > 1 && (
                                <>
                                    <button
                                        onClick={handlePreviousImage}
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white"
                                    >
                                        <FiChevronLeft className="w-6 h-6 text-gray-700" />
                                    </button>
                                    <button
                                        onClick={handleNextImage}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white"
                                    >
                                        <FiChevronRight className="w-6 h-6 text-gray-700" />
                                    </button>
                                </>
                            )}

                            {/* Indicador de imagen actual */}
                            {item.images.length > 1 && (
                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                    {item.images.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`w-2 h-2 rounded-full ${index === currentImageIndex ? 'bg-blue-600' : 'bg-gray-300'}`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <FiImage className="w-16 h-16 text-gray-300" />
                        </div>
                    )}
                </div>

                {/* Miniaturas */}
                {item.images.length > 1 && (
                    <div className="p-4 border-t border-gray-200">
                        <div className="flex space-x-2 overflow-x-auto pb-2">
                            {item.images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentImageIndex(index)}
                                    className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${index === currentImageIndex ? 'border-blue-500' : 'border-transparent'}`}
                                >
                                    <img
                                        src={image.url}
                                        alt={`Miniatura ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Columna izquierda - Información del proyecto */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Descripción */}
                    <div className="bg-white rounded-xl shadow p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Descripción del Proyecto</h2>
                        <div className="prose max-w-none">
                            <p className="text-gray-600 whitespace-pre-line">{item.description}</p>
                        </div>
                    </div>

                    {/* Información detallada */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Información del cliente */}
                        {item.clientName && (
                            <div className="bg-white rounded-xl shadow p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                    <FiUser className="mr-2" />
                                    Información del Cliente
                                </h3>
                                <div className="space-y-2">
                                    <div>
                                        <p className="text-sm text-gray-500">Cliente</p>
                                        <p className="font-medium text-gray-900">{item.clientName}</p>
                                    </div>
                                    {item.projectDate && (
                                        <div>
                                            <p className="text-sm text-gray-500">Fecha del proyecto</p>
                                            <p className="font-medium text-gray-900">{formatDate(item.projectDate)}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Categoría y tags */}
                        <div className="bg-white rounded-xl shadow p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                <FiTag className="mr-2" />
                                Categoría y Tags
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500">Categoría</p>
                                    <p className="font-medium text-gray-900">{getCategoryLabel(item.category)}</p>
                                </div>

                                {item.tags.length > 0 && (
                                    <div>
                                        <p className="text-sm text-gray-500 mb-2">Tags</p>
                                        <div className="flex flex-wrap gap-2">
                                            {item.tags.map(tag => (
                                                <span
                                                    key={tag}
                                                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Columna derecha - Información técnica */}
                <div className="space-y-6">
                    {/* Herramientas utilizadas */}
                    {item.tools.length > 0 && (
                        <div className="bg-white rounded-xl shadow p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                <FiTool className="mr-2" />
                                Herramientas Utilizadas
                            </h3>
                            <div className="space-y-2">
                                {item.tools.map(tool => (
                                    <div key={tool} className="flex items-center p-2 bg-gray-50 rounded-lg">
                                        <span className="text-gray-700">{tool}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Información del proyecto */}
                    <div className="bg-white rounded-xl shadow p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Información del Proyecto</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-gray-600">Creado</span>
                                <span className="font-medium text-gray-900">{formatDate(item.createdAt)}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-gray-600">Actualizado</span>
                                <span className="font-medium text-gray-900">{formatDate(item.updatedAt)}</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-600">Imágenes</span>
                                <span className="font-medium text-gray-900">{item.images.length}</span>
                            </div>
                        </div>
                    </div>

                    {/* Acciones */}
                    <div className="bg-white rounded-xl shadow p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Acciones</h3>
                        <div className="space-y-3">
                            <button
                                onClick={handleEdit}
                                className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                <FiEdit className="mr-2" />
                                Editar Proyecto
                            </button>
                            <button
                                onClick={() => setDeleteConfirm(true)}
                                className="w-full flex items-center justify-center px-4 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Eliminando...
                                    </>
                                ) : (
                                    <>
                                        <FiTrash2 className="mr-2" />
                                        Eliminar Proyecto
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de confirmación de eliminación */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-300 bg-opacity-90">
                    <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                <FiTrash2 className="h-6 w-6 text-red-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                ¿Eliminar proyecto del portafolio?
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Esta acción no se puede deshacer. El proyecto "{item.title}" será eliminado permanentemente.
                            </p>
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setDeleteConfirm(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                    disabled={isDeleting}
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? 'Eliminando...' : 'Eliminar'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}