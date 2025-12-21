'use client';

import { FiExternalLink } from 'react-icons/fi';
import Image from 'next/image';

interface ProjectProps {
    project: {
        id: number;
        category: string;
        title: string;
        description: string;
        type: string;
        image: string;
        color: string;
        icon: React.ReactNode;
    };
    isHovered: boolean;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}

export default function PortfolioProjectCard({
    project,
    isHovered,
    onMouseEnter,
    onMouseLeave
}: ProjectProps) {
    return (
        <div
            className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            {/* Imagen del proyecto */}
            <div className="relative h-48 overflow-hidden">
                {/* Placeholder de imagen - Reemplazar con Image de Next.js */}
                {/*   
                <div className={`absolute inset-0 bg-linear-to-r ${project.color} opacity-80`}></div>
                <div className="absolute inset-0 flex items-center justify-center text-white text-6xl">
                    {project.icon}
                </div>
                */}
                {/* Para imágenes reales, descomenta esto: */}
                <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Overlay en hover */}
                <div className={`absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'
                    }`}></div>

                {/* Tipo de proyecto */}
                <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold bg-white/70 backdrop-blur-sm text-gray-900`}>
                        {project.type}
                    </span>
                </div>
            </div>

            {/* Contenido */}
            <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-500 text-sm">#{project.id.toString().padStart(2, '0')}</span>
                    {isHovered && (
                        <button className="text-blue-600 hover:text-blue-800">
                            <FiExternalLink className="w-5 h-5" />
                        </button>
                    )}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {project.title}
                </h3>

                <p className="text-gray-600 mb-6">
                    {project.description}
                </p>

                {/* Botones de acción */}
                <div className={`flex gap-3 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}>
                    <button className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                        Ver Detalles
                    </button>
                    <button className="flex-1 py-2 bg-linear-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:shadow-lg transition-all">
                        Ver Proyecto
                    </button>
                </div>
            </div>
        </div>
    );
}