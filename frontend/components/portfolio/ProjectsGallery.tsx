'use client';

import { useState } from 'react';
import { FiGrid, FiMonitor, FiUsers, FiPenTool, FiImage, FiBook, FiExternalLink } from 'react-icons/fi';
import PortfolioProjectCard from './PortfolioProjectCard';

const projects = [
    {
        id: 1,
        category: 'branding',
        title: 'Biosymbiosis',
        description: 'Entidad de formación certificada que ofrece cursos y entrenamientos en áreas relacionadas con terapias naturales, manipulativas y energéticas.',
        type: 'Banner Redes Sociales',
        image: '/projects/biosymbiosis.jpg', // Ruta relativa en public/
        color: 'from-green-500 to-teal-500',
        icon: <FiImage />
    },
    {
        id: 2,
        category: 'branding',
        title: 'Biosymbiosis',
        description: 'Entidad de formación certificada que ofrece cursos y entrenamientos en áreas relacionadas con terapias naturales, manipulativas y energéticas.',
        type: 'Banner',
        image: '/projects/biosymbiosis-banner.jpg',
        color: 'from-green-500 to-teal-500',
        icon: <FiImage />
    },
    {
        id: 3,
        category: 'web',
        title: 'Portosigns',
        description: 'Nacido en el corazón de la Ribeira de Porto, fruto de un nuevo comienzo valiente.',
        type: 'Diseño Web',
        image: '/projects/portosigns.jpg',
        color: 'from-blue-500 to-cyan-500',
        icon: <FiMonitor />
    },
    {
        id: 4,
        category: 'web',
        title: '1000 eventos',
        description: 'Organización de ferias y eventos con gran asistencia y presencia mediática.',
        type: 'Diseño Web',
        image: '/projects/1000eventos.jpg',
        color: 'from-blue-500 to-cyan-500',
        icon: <FiMonitor />
    },
    {
        id: 5,
        category: 'web',
        title: 'Pulse',
        description: 'Espacio dedicado al mundo del deporte, reuniendo marcas líderes y expertos de la industria.',
        type: 'Diseño Web',
        image: '/projects/pulse.jpg',
        color: 'from-blue-500 to-cyan-500',
        icon: <FiMonitor />
    },
    {
        id: 6,
        category: '3d',
        title: 'Familia Cisneros',
        description: 'Creación de personajes inspirados en experiencias migratorias personales, con el objetivo de conectar con los usuarios.',
        type: 'Personajes 3D',
        image: '/projects/cisneros.jpg',
        color: 'from-purple-500 to-pink-500',
        icon: <FiUsers />
    },
    {
        id: 7,
        category: 'branding',
        title: 'Basulto',
        description: 'Logotipo para un salón de belleza cubano, buscando una identidad visual más fuerte y distintiva.',
        type: 'Logos',
        image: '/projects/basulto.jpg',
        color: 'from-orange-500 to-red-500',
        icon: <FiPenTool />
    },
    {
        id: 8,
        category: 'branding',
        title: 'Life Watch',
        description: 'Logotipo académico para una empresa ficticia de relojes que monitorean palpitaciones cardíacas y alertan a emergencias.',
        type: 'Logos',
        image: '/projects/lifewatch.jpg',
        color: 'from-orange-500 to-red-500',
        icon: <FiPenTool />
    },
    {
        id: 9,
        category: 'magazing',
        title: 'Caribe 360',
        description: 'Creada para mejorar la visualización de personajes del futuro videojuego mediante realidad aumentada.',
        type: 'Revista',
        image: '/projects/caribe360.jpg',
        color: 'from-indigo-500 to-purple-500',
        icon: <FiBook />
    },
    {
        id: 10,
        category: 'illustration',
        title: 'Artistas',
        description: 'Retratos ilustrados a partir de fotografías, resaltando y celebrando sus vidas.',
        type: 'Ilustraciones',
        image: '/projects/artistas.jpg',
        color: 'from-yellow-500 to-orange-500',
        icon: <FiImage />
    },
    {
        id: 11,
        category: 'illustration',
        title: 'Abuelito',
        description: 'Ilustración para recordar de manera especial a quienes ya no están, pero permanecen en el corazón.',
        type: 'Ilustraciones',
        image: '/projects/abuelito.jpg',
        color: 'from-yellow-500 to-orange-500',
        icon: <FiImage />
    },
    {
        id: 12,
        category: 'illustration',
        title: 'Escenarios',
        description: 'Fondos y ambientes creados para el futuro videojuego de la Familia Cisneros.',
        type: 'Ilustraciones',
        image: '/projects/escenarios.jpg',
        color: 'from-yellow-500 to-orange-500',
        icon: <FiImage />
    },
    {
        id: 13,
        category: 'magazing',
        title: 'Galaxia Hung Yi',
        description: 'Escultor nacido en Taiwán, inspirado en la vida cotidiana de su ciudad natal. Sus obras alcanzan hasta 8 metros de altura.',
        type: 'Revista',
        image: '/projects/galaxia.jpg',
        color: 'from-purple-500 to-pink-500',
        icon: <FiUsers />
    }
];

const categories = [
    { id: 'all', name: 'Todos', icon: <FiGrid />, count: projects.length },
    { id: 'branding', name: 'Branding', icon: <FiPenTool />, count: projects.filter(p => p.category === 'branding').length },
    { id: 'web', name: 'Web', icon: <FiMonitor />, count: projects.filter(p => p.category === 'web').length },
    { id: '3d', name: '3D', icon: <FiUsers />, count: projects.filter(p => p.category === '3d').length },
    { id: 'illustration', name: 'Ilustración', icon: <FiImage />, count: projects.filter(p => p.category === 'illustration').length },
    { id: 'magazing', name: 'Revista', icon: <FiBook />, count: projects.filter(p => p.category === 'magazing').length }
];

export default function ProjectsGallery() {
    const [activeCategory, setActiveCategory] = useState('all');
    const [hoveredProject, setHoveredProject] = useState<number | null>(null);

    const filteredProjects = activeCategory === 'all'
        ? projects
        : projects.filter(project => project.category === activeCategory);

    return (
        <section className="mt-20">
            <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    Proyectos y Portafolio
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Una colección de trabajos que representan mi evolución como diseñadora, desde branding hasta personajes 3D.
                </p>
            </div>

            {/* Filtros */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`flex items-center px-6 py-3 rounded-full font-semibold transition-all ${activeCategory === category.id
                            ? 'bg-linear-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        <span className="mr-2">{category.icon}</span>
                        {category.name}
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs ${activeCategory === category.id
                            ? 'bg-white/30'
                            : 'bg-gray-300'
                            }`}>
                            {category.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* Galería de Proyectos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project) => (
                    <PortfolioProjectCard
                        key={project.id}
                        project={project}
                        isHovered={hoveredProject === project.id}
                        onMouseEnter={() => setHoveredProject(project.id)}
                        onMouseLeave={() => setHoveredProject(null)}
                    />
                ))}
            </div>

            {/* Mensaje si no hay proyectos */}
            {filteredProjects.length === 0 && (
                <div className="text-center py-20">
                    <div className="text-6xl mb-6">🎨</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        No hay proyectos en esta categoría
                    </h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                        Próximamente agregaré más trabajos en esta área. ¡Mientras tanto, explora las otras categorías!
                    </p>
                </div>
            )}
        </section>
    );
}