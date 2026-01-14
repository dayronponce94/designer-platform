'use client';

import { FiDownload, FiFileText, FiImage, FiVideo, FiPackage, FiBookOpen, FiSearch, FiFilter } from 'react-icons/fi';
import { useState } from 'react';

interface Resource {
    id: string;
    title: string;
    description: string;
    category: 'guide' | 'template' | 'checklist' | 'reference' | 'toolkit';
    fileType: 'pdf' | 'ai' | 'psd' | 'figma' | 'sketch' | 'zip';
    fileSize: string;
    downloads: number;
    lastUpdated: string;
    url: string;
    icon: React.ElementType;
}

export default function ResourcesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    // Recursos de ejemplo (luego podrían venir de una API)
    const resources: Resource[] = [
        {
            id: '1',
            title: 'Guía de Briefing para Proyectos de Diseño',
            description: 'Plantilla completa para definir objetivos, audiencia y requerimientos de tu proyecto',
            category: 'guide',
            fileType: 'pdf',
            fileSize: '2.4 MB',
            downloads: 1245,
            lastUpdated: '2024-01-15',
            url: '/resources/design-brief-guide.pdf',
            icon: FiFileText
        },
        {
            id: '2',
            title: 'Kit de Branding Básico',
            description: 'Plantillas de logo, paleta de colores y guía de tipografía para startups',
            category: 'template',
            fileType: 'ai',
            fileSize: '15.2 MB',
            downloads: 892,
            lastUpdated: '2024-01-20',
            url: '/resources/branding-kit.ai',
            icon: FiPackage
        },
        {
            id: '3',
            title: 'Checklist de Revisión de Diseño',
            description: 'Lista de verificación para aprobar entregables de diseño antes de producción',
            category: 'checklist',
            fileType: 'pdf',
            fileSize: '1.1 MB',
            downloads: 1567,
            lastUpdated: '2024-01-10',
            url: '/resources/design-checklist.pdf',
            icon: FiBookOpen
        },
        {
            id: '4',
            title: 'Biblioteca de Referencias Visuales',
            description: 'Colección de moodboards y referencias organizadas por categorías',
            category: 'reference',
            fileType: 'figma',
            fileSize: '8.7 MB',
            downloads: 678,
            lastUpdated: '2024-01-25',
            url: '/resources/visual-references.figma',
            icon: FiImage
        },
        {
            id: '5',
            title: 'Guía de Preparación de Archivos para Impresión',
            description: 'Especificaciones técnicas, márgenes de seguridad y formatos requeridos',
            category: 'guide',
            fileType: 'pdf',
            fileSize: '3.2 MB',
            downloads: 943,
            lastUpdated: '2024-01-18',
            url: '/resources/print-preparation.pdf',
            icon: FiFileText
        },
        {
            id: '6',
            title: 'Template de Presentación para Clientes',
            description: 'Estructura profesional para presentar proyectos de diseño a stakeholders',
            category: 'template',
            fileType: 'pdf',
            fileSize: '4.5 MB',
            downloads: 732,
            lastUpdated: '2024-01-22',
            url: '/resources/client-presentation.pdf',
            icon: FiFileText
        },
        {
            id: '7',
            title: 'Kit de Iconos Básicos',
            description: 'Colección de iconos en formato vectorial para proyectos web y móviles',
            category: 'toolkit',
            fileType: 'sketch',
            fileSize: '12.3 MB',
            downloads: 521,
            lastUpdated: '2024-01-28',
            url: '/resources/icons-kit.sketch',
            icon: FiPackage
        },
        {
            id: '8',
            title: 'Video Tutorial: Cómo Dar Feedback Efectivo',
            description: 'Guía práctica para proporcionar retroalimentación clara a diseñadores',
            category: 'guide',
            fileType: 'zip',
            fileSize: '45.6 MB',
            downloads: 389,
            lastUpdated: '2024-01-30',
            url: '/resources/feedback-tutorial.zip',
            icon: FiVideo
        }
    ];

    const categories = [
        { id: 'all', label: 'Todos los recursos', count: resources.length },
        { id: 'guide', label: 'Guías', count: resources.filter(r => r.category === 'guide').length },
        { id: 'template', label: 'Plantillas', count: resources.filter(r => r.category === 'template').length },
        { id: 'checklist', label: 'Checklists', count: resources.filter(r => r.category === 'checklist').length },
        { id: 'reference', label: 'Referencias', count: resources.filter(r => r.category === 'reference').length },
        { id: 'toolkit', label: 'Toolkits', count: resources.filter(r => r.category === 'toolkit').length }
    ];

    const getFileTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            'pdf': 'PDF Document',
            'ai': 'Adobe Illustrator',
            'psd': 'Photoshop',
            'figma': 'Figma File',
            'sketch': 'Sketch',
            'zip': 'ZIP Archive'
        };
        return labels[type] || type;
    };

    const getCategoryLabel = (category: string) => {
        const labels: Record<string, string> = {
            'guide': 'Guía',
            'template': 'Plantilla',
            'checklist': 'Checklist',
            'reference': 'Referencia',
            'toolkit': 'Toolkit'
        };
        return labels[category] || category;
    };

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            'guide': 'bg-blue-100 text-blue-800',
            'template': 'bg-green-100 text-green-800',
            'checklist': 'bg-purple-100 text-purple-800',
            'reference': 'bg-yellow-100 text-yellow-800',
            'toolkit': 'bg-orange-100 text-orange-800'
        };
        return colors[category] || 'bg-gray-100 text-gray-800';
    };

    const filteredResources = resources.filter(resource => {
        const matchesSearch = searchTerm === '' ||
            resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            resource.description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    const formatDownloads = (downloads: number) => {
        if (downloads >= 1000) {
            return `${(downloads / 1000).toFixed(1)}k`;
        }
        return downloads.toString();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                            <FiDownload className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Recursos y Plantillas</h1>
                            <p className="text-gray-600 mt-1">
                                Guías, checklists y herramientas para optimizar tus proyectos de diseño
                            </p>
                        </div>
                    </div>
                </div>

                <div className="text-sm text-gray-500">
                    {resources.length} recursos disponibles • {resources.reduce((acc, r) => acc + r.downloads, 0)} descargas totales
                </div>
            </div>

            {/* Barra de búsqueda y filtros */}
            <div className="bg-white rounded-xl shadow p-6">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1">
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar recursos por título o descripción..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <FiFilter className="text-gray-400" />
                        <span className="text-sm text-gray-500">Filtrar por:</span>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.label} ({category.count})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Filtros rápidos */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {categories.map(category => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category.id
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {category.label} <span className="ml-1 opacity-75">({category.count})</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Lista de recursos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map(resource => {
                    const Icon = resource.icon;

                    return (
                        <div key={resource.id} className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`p-3 rounded-xl ${getCategoryColor(resource.category)}`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(resource.category)}`}>
                                        {getCategoryLabel(resource.category)}
                                    </span>
                                </div>

                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                    {resource.title}
                                </h3>

                                <p className="text-gray-600 mb-4 line-clamp-2">
                                    {resource.description}
                                </p>

                                <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                                    <div className="flex items-center space-x-4">
                                        <span className="font-medium">{getFileTypeLabel(resource.fileType)}</span>
                                        <span>•</span>
                                        <span>{resource.fileSize}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <FiDownload className="mr-1" />
                                        <span>{formatDownloads(resource.downloads)} descargas</span>
                                    </div>
                                </div>

                                <a
                                    href={resource.url}
                                    download
                                    className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <FiDownload className="mr-2" />
                                    Descargar ahora
                                </a>
                            </div>

                            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-500">
                                Actualizado el {resource.lastUpdated}
                            </div>
                        </div>
                    );
                })}
            </div>

            {filteredResources.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl shadow">
                    <FiSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">
                        No se encontraron recursos
                    </h3>
                    <p className="text-gray-500 mb-4">
                        Intenta con otros términos de búsqueda o selecciona otra categoría
                    </p>
                    <button
                        onClick={() => {
                            setSearchTerm('');
                            setSelectedCategory('all');
                        }}
                        className="px-4 py-2 text-blue-600 hover:text-blue-700"
                    >
                        Limpiar filtros
                    </button>
                </div>
            )}

            {/* Consejos y información */}
            <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl shadow p-6">
                <div className="flex items-start">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg mr-4">
                        <FiBookOpen className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            ¿Cómo aprovechar al máximo estos recursos?
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <p className="text-gray-600">
                                    <strong className="text-gray-900">Guías de briefing:</strong> Completa antes de iniciar cualquier proyecto para asegurar una comunicación clara.
                                </p>
                                <p className="text-gray-600">
                                    <strong className="text-gray-900">Checklists:</strong> Úsalos en cada fase del proyecto para garantizar que nada se pase por alto.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-gray-600">
                                    <strong className="text-gray-900">Plantillas:</strong> Ahorra tiempo usando nuestras estructuras probadas y validadas.
                                </p>
                                <p className="text-gray-600">
                                    <strong className="text-gray-900">Toolkits:</strong> Mantén consistencia en todos tus materiales con nuestros kits completos.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sección de descargas frecuentes */}
            <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recursos más populares</h2>
                <div className="space-y-4">
                    {[...resources]
                        .sort((a, b) => b.downloads - a.downloads)
                        .slice(0, 3)
                        .map(resource => (
                            <div key={resource.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                                <div className="flex items-center">
                                    <div className={`p-3 rounded-lg mr-4 ${getCategoryColor(resource.category)}`}>
                                        <resource.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">{resource.title}</h4>
                                        <p className="text-sm text-gray-500">{getCategoryLabel(resource.category)} • {resource.downloads} descargas</p>
                                    </div>
                                </div>
                                <a
                                    href={resource.url}
                                    download
                                    className="flex items-center text-blue-600 hover:text-blue-700"
                                >
                                    <FiDownload className="mr-2" />
                                    Descargar
                                </a>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}