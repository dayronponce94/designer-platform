'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import { format } from 'date-fns';

interface FormData {
    title: string;
    description: string;
    category: string;
    tags: string[];
    clientName: string;
    projectDate: string;
    tools: string[];
}

interface ImageFile {
    file: File;
    preview: string;
    isThumbnail: boolean;
}

export default function UploadPortfolioPage() {
    const router = useRouter();
    const { user } = useAuthContext();
    const { createPortfolioItem, uploadImages, loading, error } = usePortfolio();

    const [formData, setFormData] = useState<FormData>({
        title: '',
        description: '',
        category: 'other',
        tags: [],
        clientName: '',
        projectDate: '',
        tools: []
    });

    const [images, setImages] = useState<ImageFile[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [toolInput, setToolInput] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Verificar que el usuario sea diseñador
    useEffect(() => {
        if (user && user.role !== 'designer') {
            router.push('/dashboard');
        }
    }, [user, router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const target = e.target as HTMLInputElement;
            setFormData(prev => ({
                ...prev,
                [name]: target.checked
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newImages: ImageFile[] = [];

        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const preview = URL.createObjectURL(file);
                newImages.push({
                    file,
                    preview,
                    isThumbnail: images.length === 0 // La primera imagen será thumbnail por defecto
                });
            }
        });

        setImages(prev => [...prev, ...newImages]);
    };

    const handleRemoveImage = (index: number) => {
        setImages(prev => {
            const newImages = [...prev];
            URL.revokeObjectURL(newImages[index].preview);
            newImages.splice(index, 1);

            // Si eliminamos la imagen que era thumbnail y aún hay imágenes, hacer la primera thumbnail
            if (newImages.length > 0 && !newImages.some(img => img.isThumbnail)) {
                newImages[0].isThumbnail = true;
            }

            return newImages;
        });
    };

    const handleSetThumbnail = (index: number) => {
        setImages(prev =>
            prev.map((img, i) => ({
                ...img,
                isThumbnail: i === index
            }))
        );
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, tagInput.trim()]
            }));
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const handleAddTool = () => {
        if (toolInput.trim() && !formData.tools.includes(toolInput.trim())) {
            setFormData(prev => ({
                ...prev,
                tools: [...prev.tools, toolInput.trim()]
            }));
            setToolInput('');
        }
    };

    const handleRemoveTool = (toolToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tools: prev.tools.filter(tool => tool !== toolToRemove)
        }));
    };

    const handleKeyPress = (e: React.KeyboardEvent, type: 'tag' | 'tool') => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (type === 'tag') {
                handleAddTag();
            } else {
                handleAddTool();
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError(null);
        setIsSubmitting(true);

        try {
            // Validaciones básicas
            if (!formData.title.trim()) {
                throw new Error('El título es requerido');
            }

            if (!formData.description.trim()) {
                throw new Error('La descripción es requerida');
            }

            if (images.length === 0) {
                throw new Error('Debes subir al menos una imagen');
            }

            // 1. Subir imágenes primero
            setUploadProgress(30);
            const uploadedImages = await uploadImages(images.map(img => img.file));

            // Preparar datos de imágenes para el portfolio item
            const portfolioImages = uploadedImages.map((img: any, index: number) => ({
                ...img,
                isThumbnail: images[index]?.isThumbnail || false
            }));

            setUploadProgress(60);

            // 2. Crear el item del portfolio
            const portfolioData = {
                ...formData,
                images: portfolioImages,
                projectDate: formData.projectDate || undefined
            };

            await createPortfolioItem(portfolioData);

            setUploadProgress(100);

            // 3. Redirigir a la página del portfolio
            setTimeout(() => {
                router.push('/dashboard/designer/portfolio');
            }, 1000);

        } catch (err: any) {
            setSubmitError(err.message || 'Error al guardar el trabajo');
            setUploadProgress(0);
        } finally {
            setIsSubmitting(false);
        }
    };

    const categories = [
        { value: 'branding', label: 'Diseño de Marca' },
        { value: 'ux-ui', label: 'Diseño UX/UI' },
        { value: 'graphic', label: 'Diseño Gráfico' },
        { value: 'web', label: 'Diseño Web' },
        { value: 'motion', label: 'Animación Gráfica' },
        { value: 'illustration', label: 'Ilustración' },
        { value: 'other', label: 'Otro' }
    ];

    // Limpiar URLs de preview al desmontar
    useEffect(() => {
        return () => {
            images.forEach(img => URL.revokeObjectURL(img.preview));
        };
    }, [images]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                            <FiUpload className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Agregar al Portafolio</h1>
                            <p className="text-gray-600 mt-1">
                                Comparte tus mejores trabajos con la comunidad
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => router.push('/dashboard/designer/portfolio')}
                    className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                >
                    <FiArrowLeft className="mr-2" />
                    Volver al Portafolio
                </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Columna izquierda - Información básica */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Título */}
                        <div className="bg-white rounded-xl shadow p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Información Básica</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Título del Trabajo *
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Ej: Rediseño de marca para Startup Tech"
                                        required
                                        maxLength={100}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        {formData.title.length}/100 caracteres
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Descripción *
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows={4}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Describe el proyecto, tus responsabilidades, el proceso creativo y los resultados obtenidos..."
                                        required
                                        maxLength={500}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        {formData.description.length}/500 caracteres
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Categoría *
                                        </label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            {categories.map(category => (
                                                <option key={category.value} value={category.value}>
                                                    {category.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Cliente (opcional)
                                        </label>
                                        <div className="relative">
                                            <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                name="clientName"
                                                value={formData.clientName}
                                                onChange={handleInputChange}
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Nombre del cliente"
                                                maxLength={100}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Fecha del Proyecto (opcional)
                                        </label>
                                        <div className="relative">
                                            <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="date"
                                                name="projectDate"
                                                value={formData.projectDate}
                                                onChange={handleInputChange}
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="bg-white rounded-xl shadow p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">
                                <FiTag className="inline mr-2" />
                                Tags
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Agregar tags
                                    </label>
                                    <div className="flex space-x-2">
                                        <input
                                            type="text"
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyPress={(e) => handleKeyPress(e, 'tag')}
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Ej: logo, minimalista, moderno"
                                            maxLength={20}
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddTag}
                                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                                        >
                                            Agregar
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Presiona Enter o click en Agregar
                                    </p>
                                </div>

                                {formData.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {formData.tags.map(tag => (
                                            <span
                                                key={tag}
                                                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                                            >
                                                {tag}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveTag(tag)}
                                                    className="ml-2 text-blue-600 hover:text-blue-800"
                                                >
                                                    <FiX className="w-3 h-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Columna derecha - Imágenes y configuración */}
                    <div className="space-y-6">
                        {/* Subida de imágenes */}
                        <div className="bg-white rounded-xl shadow p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">
                                <FiImage className="inline mr-2" />
                                Imágenes del Proyecto *
                            </h2>
                            <div className="space-y-4">
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                                    <FiUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600 mb-2">Arrastra y suelta tus imágenes aquí</p>
                                    <p className="text-sm text-gray-500 mb-4">o</p>
                                    <label className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
                                        Seleccionar archivos
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                    </label>
                                    <p className="text-xs text-gray-500 mt-4">
                                        Formatos: JPEG, PNG, GIF, WebP (Máx. 5MB cada una)
                                    </p>
                                </div>

                                {images.length > 0 && (
                                    <div className="space-y-4">
                                        <h3 className="font-medium text-gray-900">Imágenes seleccionadas:</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            {images.map((image, index) => (
                                                <div key={index} className="relative group">
                                                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                                                        <img
                                                            src={image.preview}
                                                            alt={`Preview ${index + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>

                                                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleSetThumbnail(index)}
                                                            className={`p-2 rounded-full ${image.isThumbnail ? 'bg-green-500' : 'bg-white'} hover:scale-110 transition-transform`}
                                                            title={image.isThumbnail ? 'Imagen principal' : 'Establecer como principal'}
                                                        >
                                                            <FiCheck className={`w-4 h-4 ${image.isThumbnail ? 'text-white' : 'text-gray-700'}`} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveImage(index)}
                                                            className="p-2 bg-white rounded-full hover:scale-110 transition-transform"
                                                            title="Eliminar imagen"
                                                        >
                                                            <FiX className="w-4 h-4 text-red-600" />
                                                        </button>
                                                    </div>

                                                    {image.isThumbnail && (
                                                        <div className="absolute top-2 left-2">
                                                            <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">
                                                                Principal
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="text-sm text-gray-500">
                                            <p>Seleccionadas: {images.length} imagen(es)</p>
                                            <p className="flex items-center mt-1">
                                                <FiAlertCircle className="mr-1" />
                                                La primera imagen será mostrada como miniatura
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Herramientas */}
                        <div className="bg-white rounded-xl shadow p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">
                                <FiTool className="inline mr-2" />
                                Herramientas Utilizadas
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex-col space-y-2">
                                        <input
                                            type="text"
                                            value={toolInput}
                                            onChange={(e) => setToolInput(e.target.value)}
                                            onKeyPress={(e) => handleKeyPress(e, 'tool')}
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Ej: Adobe Illustrator, Figma"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddTool}
                                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                                        >
                                            Agregar
                                        </button>
                                    </div>
                                </div>

                                {formData.tools.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {formData.tools.map(tool => (
                                            <span
                                                key={tool}
                                                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700"
                                            >
                                                {tool}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveTool(tool)}
                                                    className="ml-2 text-gray-500 hover:text-gray-700"
                                                >
                                                    <FiX className="w-3 h-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Errores y progreso */}
                {(error || submitError) && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error || submitError}
                    </div>
                )}

                {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-blue-700">Subiendo archivos...</span>
                            <span className="text-blue-700 font-medium">{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-blue-200 rounded-full h-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                {/* Botones de acción */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={() => router.push('/dashboard/designer/portfolio')}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        disabled={isSubmitting}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting || images.length === 0}
                        className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Guardando...
                            </>
                        ) : (
                            <>
                                <FiSave className="mr-2" />
                                Guardar en Portafolio
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}