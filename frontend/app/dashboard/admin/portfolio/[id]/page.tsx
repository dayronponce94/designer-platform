'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAdmin } from '@/app/lib/hooks/useAdmin';
import {
    FiArrowLeft,
    FiCalendar,
    FiTag,
    FiTool,
    FiUser,
    FiImage,
    FiBriefcase,
    FiChevronLeft,
    FiChevronRight,
    FiFilter,
    FiSearch,
    FiGrid,
    FiList,
    FiEye,
    FiEdit,
    FiTrash2,
    FiMail,
    FiAward
} from 'react-icons/fi';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import ConfirmModal from '@/components/modals/ConfirmModal';

export default function AdminDesignerPortfolioPage() {
    const router = useRouter();
    const params = useParams();
    const { getDesignerPortfolio, loading, error } = useAdmin();

    const [designer, setDesigner] = useState<any>(null);
    const [portfolio, setPortfolio] = useState<any[]>([]);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const designerId = params.id as string;

    const [filters, setFilters] = useState({
        category: 'all',
        search: '',
        page: 1,
        limit: 3
    });
    const [pagination, setPagination] = useState<any>({});

    useEffect(() => {
        if (designerId) {
            fetchDesignerPortfolio();
        }
    }, [designerId, filters]);

    const fetchDesignerPortfolio = async () => {
        try {
            const data = await getDesignerPortfolio(designerId, filters);
            setDesigner(data.designer);
            setPortfolio(data.portfolio || []);
            setPagination(data.pagination || {});
        } catch (error) {
            console.error('Error cargando portafolio:', error);
        }
    };

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

    const handleViewDetails = (item: any) => {
        setSelectedItem(item);
        setCurrentImageIndex(0);
        setShowDetailsModal(true);
    };

    const handlePreviousImage = () => {
        if (selectedItem && selectedItem.images.length > 0) {
            setCurrentImageIndex(prev =>
                prev === 0 ? selectedItem.images.length - 1 : prev - 1
            );
        }
    };

    const handleNextImage = () => {
        if (selectedItem && selectedItem.images.length > 0) {
            setCurrentImageIndex(prev =>
                prev === selectedItem.images.length - 1 ? 0 : prev + 1
            );
        }
    };

    const categories = [
        { value: 'all', label: 'Todas las categorías' },
        { value: 'branding', label: 'Diseño de Marca' },
        { value: 'ux-ui', label: 'Diseño UX/UI' },
        { value: 'graphic', label: 'Diseño Gráfico' },
        { value: 'web', label: 'Diseño Web' },
        { value: 'motion', label: 'Animación Gráfica' },
        { value: 'illustration', label: 'Ilustración' },
        { value: 'other', label: 'Otro' }
    ];


    if (loading && !designer) {
        return (
            <div className="flex justify-center items-center min-h-96">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando portafolio del diseñador...</p>
                </div>
            </div>
        );
    }

    if (error || !designer) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <p>{error || 'Diseñador no encontrado'}</p>
                <button
                    onClick={() => router.push('/dashboard/admin/users')}
                    className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                    Volver a Usuarios
                </button>
            </div>
        );
    }

    const currentImage = selectedItem?.images?.[currentImageIndex];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => router.push('/dashboard/admin/users')}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                    >
                        <FiArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                            Portafolio de {designer.name}
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {pagination?.total || 0} {pagination?.total === 1 ? 'trabajo' : 'trabajos'} en el portafolio
                        </p>
                    </div>
                </div>
            </div>

            {/* Información del diseñador */}
            <div className="bg-white rounded-xl shadow p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                            <FiUser className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">{designer.name}</h2>
                            <div className="flex items-center space-x-4 mt-1">
                                <div className="flex items-center text-gray-600">
                                    <FiMail className="w-4 h-4 mr-1" />
                                    <span>{designer.email}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <FiBriefcase className="w-4 h-4 mr-1" />
                                    <span>{getCategoryLabel(designer.specialty || 'other')}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <FiAward className="w-4 h-4 mr-1" />
                                    <span>{designer.experience || 0} años de experiencia</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {designer.skills && designer.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {designer.skills.slice(0, 5).map((skill: string, index: number) => (
                                <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                                    {skill}
                                </span>
                            ))}
                            {designer.skills.length > 5 && (
                                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                                    +{designer.skills.length - 5} más
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {designer.bio && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-gray-600">{designer.bio}</p>
                    </div>
                )}
            </div>

            {/* Filtros y búsqueda */}
            <div className="bg-white rounded-xl shadow p-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar en el portafolio..."
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
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
                        </div>

                        <div className="flex items-center space-x-2">
                            <FiFilter className="text-gray-400" />
                            <select
                                value={filters.category}
                                onChange={(e) => setFilters({ ...filters, category: e.target.value, page: 1 })}
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
            </div>

            {/* Contenido del portafolio */}
            {portfolio.length === 0 ? (
                <div className="bg-white rounded-xl shadow p-8 text-center">
                    <FiImage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">
                        {filters.search || filters.category !== 'all' ? 'No hay resultados' : 'El portafolio está vacío'}
                    </h3>
                    <p className="text-gray-600">
                        {filters.search || filters.category !== 'all'
                            ? 'Intenta con otros términos de búsqueda o selecciona otra categoría'
                            : 'Este diseñador aún no ha agregado trabajos a su portafolio.'}
                    </p>
                </div>

            ) : viewMode === 'grid' ? (
                // Vista Grid
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {portfolio.map(item => {
                        const thumbnail = item.images.find((img: any) => img.isThumbnail) || item.images[0];

                        return (
                            <div key={item._id} className="bg-white rounded-xl shadow overflow-hidden hover:shadow-lg transition-shadow group">
                                {/* Imagen */}
                                <div className="relative aspect-video bg-gray-100 overflow-hidden">
                                    {thumbnail ? (
                                        <img
                                            src={thumbnail.url}
                                            alt={item.title}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                                            onClick={() => handleViewDetails(item)}
                                        />
                                    ) : (
                                        <div
                                            className="w-full h-full flex items-center justify-center cursor-pointer"
                                            onClick={() => handleViewDetails(item)}
                                        >
                                            <FiImage className="w-12 h-12 text-gray-300" />
                                        </div>
                                    )}

                                    {/* Badge de categoría */}
                                    <div className="absolute top-3 left-3">
                                        <span className="px-2 py-1 bg-white bg-opacity-90 text-xs font-medium rounded">
                                            {getCategoryLabel(item.category)}
                                        </span>
                                    </div>
                                </div>

                                {/* Contenido */}
                                <div className="p-4">
                                    <h3
                                        className="font-bold text-gray-900 mb-2 line-clamp-1 cursor-pointer hover:text-blue-600"
                                        onClick={() => handleViewDetails(item)}
                                    >
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                        {item.description}
                                    </p>

                                    {/* Acciones */}
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handleViewDetails(item)}
                                            className="p-2 text-gray-500 hover:text-green-600 hover:bg-blue-50 rounded-lg transition"
                                            title="Ver detalles"
                                        >
                                            <FiEye className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Metadatos */}
                                    <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-100 pt-3">
                                        <div className="flex items-center">
                                            <FiCalendar className="mr-1" />
                                            <span>{formatDate(item.createdAt)}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <FiImage className="mr-1" />
                                            <span>{item.images.length} {item.images.length === 1 ? 'imagen' : 'imágenes'}</span>
                                        </div>
                                    </div>

                                    {/* Tags */}
                                    {item.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-3">
                                            {item.tags.slice(0, 3).map((tag: string) => (
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
                        {portfolio.map(item => {
                            const thumbnail = item.images.find((img: any) => img.isThumbnail) || item.images[0];

                            return (
                                <div key={item._id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-start space-x-4">
                                        {/* Miniatura */}
                                        <div
                                            className="w-32 h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0 cursor-pointer"
                                            onClick={() => handleViewDetails(item)}
                                        >
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
                                                    <h3
                                                        className="font-bold text-gray-900 mb-1 cursor-pointer hover:text-blue-600"
                                                        onClick={() => handleViewDetails(item)}
                                                    >
                                                        {item.title}
                                                    </h3>
                                                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                                                        <span className="px-2 py-1 bg-gray-100 rounded">
                                                            {getCategoryLabel(item.category)}
                                                        </span>
                                                        <span>{formatDate(item.createdAt)}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => handleViewDetails(item)}
                                                        className="p-2 text-gray-500 hover:text-green-600 hover:bg-blue-50 rounded-lg transition"
                                                        title="Ver detalles"
                                                    >
                                                        <FiEye className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            <p className="text-gray-600 mb-3 line-clamp-2">
                                                {item.description}
                                            </p>

                                            <div className="flex items-center justify-between">
                                                {item.tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-1">
                                                        {item.tags.slice(0, 3).map((tag: string) => (
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

            {/* Modal de detalles del proyecto */}
            {showDetailsModal && selectedItem && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={() => setShowDetailsModal(false)} />

                    <div className="relative min-h-screen flex items-center justify-center p-4">
                        <div className="relative bg-white rounded-xl shadow-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                            {/* Header del modal */}
                            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <button
                                            onClick={() => setShowDetailsModal(false)}
                                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                                        >
                                            <FiArrowLeft className="w-5 h-5" />
                                        </button>
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900">{selectedItem.title}</h2>
                                            <p className="text-gray-600">
                                                {getCategoryLabel(selectedItem.category)} • {formatDate(selectedItem.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowDetailsModal(false)}
                                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>

                            {/* Contenido del modal */}
                            <div className="p-6">
                                {/* Galería de imágenes */}
                                <div className="mb-6">
                                    <div className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden mb-4">
                                        {currentImage ? (
                                            <div className="relative w-full h-full">
                                                <img
                                                    src={currentImage.url}
                                                    alt={selectedItem.title}
                                                    className="w-full h-full object-contain"
                                                />

                                                {/* Navegación de imágenes */}
                                                {selectedItem.images.length > 1 && (
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
                                                {selectedItem.images.length > 1 && (
                                                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                                        {selectedItem.images.map((_: any, index: number) => (
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
                                    {selectedItem.images.length > 1 && (
                                        <div className="flex space-x-2 overflow-x-auto pb-2">
                                            {selectedItem.images.map((image: any, index: number) => (
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
                                    )}
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Información del proyecto */}
                                    <div className="lg:col-span-2 space-y-6">
                                        {/* Descripción */}
                                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                                            <h3 className="text-lg font-bold text-gray-900 mb-4">Descripción del Proyecto</h3>
                                            <p className="text-gray-600 whitespace-pre-line">{selectedItem.description}</p>
                                        </div>

                                        {/* Detalles */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Información del cliente */}
                                            {selectedItem.clientName && (
                                                <div className="bg-white rounded-lg border border-gray-200 p-6">
                                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                                        <FiUser className="mr-2" />
                                                        Información del Cliente
                                                    </h3>
                                                    <div className="space-y-2">
                                                        <div>
                                                            <p className="text-sm text-gray-500">Cliente</p>
                                                            <p className="font-medium text-gray-900">{selectedItem.clientName}</p>
                                                        </div>
                                                        {selectedItem.projectDate && (
                                                            <div>
                                                                <p className="text-sm text-gray-500">Fecha del proyecto</p>
                                                                <p className="font-medium text-gray-900">{formatDate(selectedItem.projectDate)}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Categoría y tags */}
                                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                                    <FiTag className="mr-2" />
                                                    Categoría y Tags
                                                </h3>
                                                <div className="space-y-4">
                                                    <div>
                                                        <p className="text-sm text-gray-500">Categoría</p>
                                                        <p className="font-medium text-gray-900">{getCategoryLabel(selectedItem.category)}</p>
                                                    </div>

                                                    {selectedItem.tags.length > 0 && (
                                                        <div>
                                                            <p className="text-sm text-gray-500 mb-2">Tags</p>
                                                            <div className="flex flex-wrap gap-2">
                                                                {selectedItem.tags.map((tag: string) => (
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

                                    {/* Información técnica */}
                                    <div className="space-y-6">
                                        {/* Herramientas utilizadas */}
                                        {selectedItem.tools.length > 0 && (
                                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                                    <FiTool className="mr-2" />
                                                    Herramientas Utilizadas
                                                </h3>
                                                <div className="space-y-2">
                                                    {selectedItem.tools.map((tool: string) => (
                                                        <div key={tool} className="flex items-center p-2 bg-gray-50 rounded-lg">
                                                            <span className="text-gray-700">{tool}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Información del proyecto */}
                                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                                            <h3 className="text-lg font-bold text-gray-900 mb-4">Información del Proyecto</h3>
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                                    <span className="text-gray-600">Creado</span>
                                                    <span className="font-medium text-gray-900">{formatDate(selectedItem.createdAt)}</span>
                                                </div>
                                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                                    <span className="text-gray-600">Actualizado</span>
                                                    <span className="font-medium text-gray-900">{formatDate(selectedItem.updatedAt)}</span>
                                                </div>
                                                <div className="flex justify-between items-center py-2">
                                                    <span className="text-gray-600">Imágenes</span>
                                                    <span className="font-medium text-gray-900">{selectedItem.images.length}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer del modal */}
                            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => setShowDetailsModal(false)}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Paginación */}
            {pagination && pagination.pages > 1 && (
                <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                        Mostrando {((filters.page - 1) * filters.limit) + 1} - {Math.min(filters.page * filters.limit, pagination.total)} de {pagination.total} resultados
                    </div>
                    <div className="flex space-x-2">
                        <button
                            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                            disabled={filters.page === 1}
                            onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                        >
                            Anterior
                        </button>
                        <span className="px-4 py-2">
                            Página {filters.page} de {pagination.pages}
                        </span>
                        <button
                            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                            disabled={filters.page === pagination.pages}
                            onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}