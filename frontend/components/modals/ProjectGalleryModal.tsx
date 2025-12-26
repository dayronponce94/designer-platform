'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FiX, FiChevronLeft, FiChevronRight, FiMaximize2, FiDownload } from 'react-icons/fi';

interface ProjectGalleryModalProps {
    project: {
        id: number;
        title: string;
        images: string[];
        type: string;
    };
    isOpen: boolean;
    onClose: () => void;
}

export default function ProjectGalleryModal({ project, isOpen, onClose }: ProjectGalleryModalProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    if (!isOpen) return null;

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % project.images.length);
    };

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + project.images.length) % project.images.length);
    };

    const goToImage = (index: number) => {
        setCurrentIndex(index);
    };

    const downloadImage = () => {
        const link = document.createElement('a');
        link.href = project.images[currentIndex];
        link.download = `${project.title}-${currentIndex + 1}.jpg`;
        link.click();
    };

    return (
        <div className={`fixed inset-0 z-50 ${isFullscreen ? 'bg-black' : 'bg-black/90 backdrop-blur-sm'}`}>
            {/* Controles superiores */}
            <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-6">
                <div className="text-white">
                    <h2 className="text-2xl font-bold">{project.title}</h2>
                    <p className="text-white/70">{project.type}</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={downloadImage}
                        className="p-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
                        title="Descargar imagen"
                    >
                        <FiDownload className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="p-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
                        title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
                    >
                        <FiMaximize2 className="w-5 h-5" />
                    </button>
                    <button
                        onClick={onClose}
                        className="p-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Imagen principal */}
            <div className="relative w-full h-full flex items-center justify-center p-4">
                <div className="relative max-w-full max-h-full">
                    <Image
                        src={project.images[currentIndex]}
                        alt={`${project.title} - Imagen ${currentIndex + 1}`}
                        width={1200}
                        height={800}
                        className="object-contain max-w-full max-h-[80vh] rounded-lg"
                        quality={100}
                    />

                    {/* Contador de imágenes */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full text-white">
                        {currentIndex + 1} / {project.images.length}
                    </div>
                </div>

                {/* Navegación */}
                {project.images.length > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all hover:scale-110"
                        >
                            <FiChevronLeft className="w-8 h-8" />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all hover:scale-110"
                        >
                            <FiChevronRight className="w-8 h-8" />
                        </button>
                    </>
                )}
            </div>

            {/* Miniaturas (solo si no está en fullscreen) */}
            {!isFullscreen && project.images.length > 1 && (
                <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex justify-center gap-3 overflow-x-auto py-4">
                        {project.images.map((image, index) => (
                            <button
                                key={index}
                                onClick={() => goToImage(index)}
                                className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${index === currentIndex
                                    ? 'border-blue-500 scale-110'
                                    : 'border-transparent hover:border-white/50'
                                    }`}
                            >
                                <div className="relative w-full h-full">
                                    <Image
                                        src={image}
                                        alt={`Miniatura ${index + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="80px"
                                    />
                                    <div className={`absolute inset-0 ${index === currentIndex ? 'bg-blue-500/20' : 'bg-black/30'
                                        }`}></div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Controles de teclado */}
            <div className="hidden md:block absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white/50 text-sm">
                Usa ← → para navegar, ESC para salir, F para pantalla completa
            </div>
        </div>
    );
}