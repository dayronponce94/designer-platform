'use client';

import { FiX, FiCalendar, FiUser, FiTag, FiCode, FiExternalLink } from 'react-icons/fi';

interface ProjectDetailsModalProps {
    project: {
        id: number;
        category: string;
        title: string;
        description: string;
        fullDescription: string;
        type: string;
        color: string;
        technologies: string[];
        client?: string;
        year?: string;
        link?: string;
    };
    isOpen: boolean;
    onClose: () => void;
}

export default function ProjectDetailsModal({ project, isOpen, onClose }: ProjectDetailsModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay con blur */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-scale-in">
                {/* Header del modal */}
                <div className="sticky top-0 z-10 bg-white border-b p-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">{project.title}</h2>
                        <div className="flex items-center gap-4 mt-2">
                            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-linear-to-r from-blue-500 to-purple-500 text-white">
                                {project.type}
                            </span>
                            <span className="text-gray-500">#{project.id.toString().padStart(2, '0')}</span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <FiX className="w-6 h-6 text-gray-600" />
                    </button>
                </div>

                {/* Contenido con scroll */}
                <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                    <div className="p-6 md:p-8">
                        {/* Información del proyecto */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {project.client && (
                                <div className="flex items-center p-4 bg-blue-50 rounded-xl">
                                    <FiUser className="w-5 h-5 text-blue-600 mr-3" />
                                    <div>
                                        <div className="text-sm text-gray-600">Cliente</div>
                                        <div className="font-semibold text-gray-900">{project.client}</div>
                                    </div>
                                </div>
                            )}

                            {project.year && (
                                <div className="flex items-center p-4 bg-purple-50 rounded-xl">
                                    <FiCalendar className="w-5 h-5 text-purple-600 mr-3" />
                                    <div>
                                        <div className="text-sm text-gray-600">Año</div>
                                        <div className="font-semibold text-gray-900">{project.year}</div>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center p-4 bg-green-50 rounded-xl">
                                <FiTag className="w-5 h-5 text-green-600 mr-3" />
                                <div>
                                    <div className="text-sm text-gray-600">Categoría</div>
                                    <div className="font-semibold text-gray-900">{project.category}</div>
                                </div>
                            </div>
                        </div>

                        {/* Descripción principal */}
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Descripción del Proyecto</h3>
                            <div className="prose max-w-none">
                                <p className="text-gray-700 leading-relaxed">
                                    {project.fullDescription}
                                </p>
                            </div>
                        </div>

                        {/* Descripción breve */}
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Resumen</h3>
                            <p className="text-gray-700 bg-gray-50 p-6 rounded-xl border-l-4 border-blue-500">
                                {project.description}
                            </p>
                        </div>

                        {/* Tecnologías utilizadas */}
                        {project.technologies && project.technologies.length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                    <FiCode className="mr-2" />
                                    Tecnologías Utilizadas
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {project.technologies.map((tech, index) => (
                                        <span
                                            key={index}
                                            className="px-4 py-2 bg-linear-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full font-medium"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Desafíos y soluciones */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div className="bg-linear-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100">
                                <h4 className="text-lg font-bold text-gray-900 mb-3">Desafíos</h4>
                                <ul className="space-y-2">
                                    <li className="flex items-start">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3"></div>
                                        <span className="text-gray-700">Comunicar valores complejos de forma visual</span>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3"></div>
                                        <span className="text-gray-700">Crear una identidad única en un mercado saturado</span>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3"></div>
                                        <span className="text-gray-700">Mantener coherencia visual en múltiples plataformas</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-linear-to-br from-green-50 to-white p-6 rounded-xl border border-green-100">
                                <h4 className="text-lg font-bold text-gray-900 mb-3">Soluciones</h4>
                                <ul className="space-y-2">
                                    <li className="flex items-start">
                                        <div className="w-2 h-2 rounded-full bg-green-500 mt-2 mr-3"></div>
                                        <span className="text-gray-700">Metodología de investigación y user personas</span>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="w-2 h-2 rounded-full bg-green-500 mt-2 mr-3"></div>
                                        <span className="text-gray-700">Diseño iterativo con feedback constante</span>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="w-2 h-2 rounded-full bg-green-500 mt-2 mr-3"></div>
                                        <span className="text-gray-700">Sistema de diseño escalable y documentado</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}