'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePortfolio } from '@/app/lib/hooks/usePortfolio';
import { useAuthContext } from '@/app/providers/AuthProvider';
import {
    FiImage,
    FiPlus,
    FiEdit,
    FiTrash2,
    FiFilter,
    FiGrid,
    FiList,
    FiEye,
    FiStar,
    FiSearch,
    FiDownload,
    FiShare2
} from 'react-icons/fi';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function DesignerPortfolioPage() {
    const router = useRouter();
    const { user } = useAuthContext();
    const { items, loading, error, fetchMyPortfolio, deletePortfolioItem } = usePortfolio();

    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    useEffect(() => {
        if (user && user.role === 'designer') {
            fetchMyPortfolio();
        }
    }, [user, fetchMyPortfolio]);

    const categories = [
        { value: 'all', label: 'Todas las categorías' },
        { value: 'branding', label: 'Branding' },
        { value: 'ux-ui', label: 'UX/UI' },
        { value: 'graphic', label: 'Diseño Gráfico' },
        { value: 'web', label: 'Diseño Web' },
        { value: 'motion', label: 'Motion Graphics' },
        { value: 'illustration', label: 'Ilustración' },
        { value: 'other', label: 'Otro' }
    ];

    const getCategoryLabel = (category: string) => {
        const found = categories.find(c => c.value === category);
        return found ? found.label : category;
    };

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return format(date, "MMM yyyy", { locale: es });
        } catch (error) {
            return '';
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deletePortfolioItem(id);
            fetchMyPortfolio(); // Refrescar la lista
            setDeleteConfirm(null);
        } catch (err) {
            console.error('Error al eliminar:', err);
        }
    };

    const filteredItems = items.filter(item => {
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        const matchesSearch = searchTerm === '' ||
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

        return matchesCategory && matchesSearch;
    });

    if (loading && items.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando portafolio...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                            <FiImage className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Mi Portafolio</h1>
                            <p className="text-gray-600 mt-1">
                                {items.length} {items.length === 1 ? 'trabajo' : 'trabajos'} en tu portafolio
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
                    >
                        <FiGrid className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
                    >
                        <FiList className="w-5 h-5" />
                    </button>

                    <button
                        onClick={() => router.push('/dashboard/designer/portfolio/upload')}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        <FiPlus className="mr-2" />
                        Agregar Trabajo
                    </button>
                </div>
            </div>

            {/* Filtros y búsqueda */}
            <div className="bg-white rounded-xl shadow p-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar por título, descripción o tags..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <FiFilter className="text-gray-400" />
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {categories.map(category => (
                                <option key={category.value} value={category.value}>
                                    {category.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Contenido del portafolio */}
            {filteredItems.length === 0 ? (
                <div className="bg-white rounded-xl shadow p-8 text-center">
                    <FiImage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">
                        {searchTerm || selectedCategory !== 'all' ? 'No hay resultados' : 'Tu portafolio está vacío'}
                    </h3>
                    <p className="text-gray-600 mb-6">
                        {searchTerm || selectedCategory !== 'all'
                            ? 'Intenta con otros términos de búsqueda o selecciona otra categoría'
                            : 'Agrega tus mejores trabajos para atraer más clientes y mostrar tu experiencia.'
                        }
                    </p>
                    <button
                        onClick={() => router.push('/dashboard/designer/portfolio/upload')}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        <FiPlus className="inline mr-2" />
                        Agregar primer trabajo
                    </button>
                </div>
            ) : viewMode === 'grid' ? (
                // Vista Grid
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map(item => {
                        const thumbnail = item.images.find(img => img.isThumbnail) || item.images[0];

                        return (
                            <div key={item._id} className="bg-white rounded-xl shadow overflow-hidden hover:shadow-lg transition-shadow">
                                {/* Imagen */}
                                <div className="relative aspect-video bg-gray-100 overflow-hidden">
                                    {thumbnail ? (
                                        <img
                                            src={thumbnail.url}
                                            alt={item.title}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <FiImage className="w-12 h-12 text-gray-300" />
                                        </div>
                                    )}

                                    {/* Badges */}
                                    <div className="absolute top-3 left-3 flex space-x-2">
                                        <span className="px-2 py-1 bg-white bg-opacity-90 text-xs font-medium rounded">
                                            {getCategoryLabel(item.category)}
                                        </span>
                                        {item.isFeatured && (
                                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded flex items-center">
                                                <FiStar className="w-3 h-3 mr-1" />
                                                Destacado
                                            </span>
                                        )}
                                    </div>

                                    {/* Acciones */}
                                    <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => router.push(`/portfolio/${item._id}`)}
                                            className="p-2 bg-white rounded-full shadow hover:bg-gray-50"
                                            title="Vista previa pública"
                                        >
                                            <FiEye className="w-4 h-4 text-gray-600" />
                                        </button>
                                        <button
                                            onClick={() => router.push(`/dashboard/designer/portfolio/edit/${item._id}`)}
                                            className="p-2 bg-white rounded-full shadow hover:bg-gray-50"
                                            title="Editar"
                                        >
                                            <FiEdit className="w-4 h-4 text-blue-600" />
                                        </button>
                                        <button
                                            onClick={() => setDeleteConfirm(item._id)}
                                            className="p-2 bg-white rounded-full shadow hover:bg-gray-50"
                                            title="Eliminar"
                                        >
                                            <FiTrash2 className="w-4 h-4 text-red-600" />
                                        </button>
                                    </div>
                                </div>

                                {/* Contenido */}
                                <div className="p-4">
                                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                        {item.description}
                                    </p>

                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <div className="flex items-center">
                                            <FiEye className="mr-1" />
                                            <span>{item.views} vistas</span>
                                        </div>
                                        <span>{formatDate(item.createdAt)}</span>
                                    </div>

                                    {/* Tags */}
                                    {item.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-gray-100">
                                            {item.tags.slice(0, 3).map(tag => (
                                                <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                                    {tag}
                                                </span>
                                            ))}
                                            {item.tags.length > 3 && (
                                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                                    +{item.tags.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                // Vista Lista
                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <div className="divide-y divide-gray-100">
                        {filteredItems.map(item => {
                            const thumbnail = item.images.find(img => img.isThumbnail) || item.images[0];

                            return (
                                <div key={item._id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-start space-x-4">
                                        {/* Miniatura */}
                                        <div className="w-32 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                            {thumbnail ? (
                                                <img
                                                    src={thumbnail.url}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <FiImage className="w-8 h-8 text-gray-300" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Información */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <h3 className="font-bold text-gray-900 mb-1">
                                                        {item.title}
                                                    </h3>
                                                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                                                        <span className="px-2 py-1 bg-gray-100 rounded">
                                                            {getCategoryLabel(item.category)}
                                                        </span>
                                                        {item.isFeatured && (
                                                            <span className="flex items-center text-yellow-600">
                                                                <FiStar className="w-3 h-3 mr-1" />
                                                                Destacado
                                                            </span>
                                                        )}
                                                        <span>{formatDate(item.createdAt)}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => router.push(`/portfolio/${item._id}`)}
                                                        className="p-2 text-gray-400 hover:text-gray-600"
                                                        title="Vista previa pública"
                                                    >
                                                        <FiEye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => router.push(`/dashboard/designer/portfolio/edit/${item._id}`)}
                                                        className="p-2 text-blue-400 hover:text-blue-600"
                                                        title="Editar"
                                                    >
                                                        <FiEdit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirm(item._id)}
                                                        className="p-2 text-red-400 hover:text-red-600"
                                                        title="Eliminar"
                                                    >
                                                        <FiTrash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            <p className="text-gray-600 mb-3 line-clamp-2">
                                                {item.description}
                                            </p>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                    <div className="flex items-center">
                                                        <FiEye className="mr-1" />
                                                        <span>{item.views} vistas</span>
                                                    </div>
                                                    {item.clientName && (
                                                        <div>
                                                            Cliente: <span className="font-medium">{item.clientName}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {item.tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-1">
                                                        {item.tags.slice(0, 3).map(tag => (
                                                            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Modal de confirmación de eliminación */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                    <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                <FiTrash2 className="h-6 w-6 text-red-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                ¿Eliminar trabajo del portafolio?
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Esta acción no se puede deshacer. El trabajo será eliminado permanentemente.
                            </p>
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={() => handleDelete(deleteConfirm)}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Información */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Consejos para un portafolio efectivo
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <p className="text-gray-600">
                            <strong className="text-gray-900">Calidad sobre cantidad:</strong> Selecciona solo tus mejores trabajos.
                        </p>
                        <p className="text-gray-600">
                            <strong className="text-gray-900">Contexto:</strong> Explica el problema, tu proceso y los resultados.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-gray-600">
                            <strong className="text-gray-900">Variedad:</strong> Muestra diferentes estilos y técnicas.
                        </p>
                        <p className="text-gray-600">
                            <strong className="text-gray-900">Actualización:</strong> Mantén tu portafolio fresco con trabajos recientes.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}