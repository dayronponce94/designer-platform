'use client';

import { useState } from 'react';
import { FiGrid, FiMonitor, FiUsers, FiPenTool, FiImage, FiBook, FiExternalLink } from 'react-icons/fi';
import PortfolioProjectCard from './PortfolioProjectCard';
import ProjectDetailsModal from '@/components/modals/ProjectDetailsModal';
import ProjectGalleryModal from '@/components/modals/ProjectGalleryModal';

const projects = [
    {
        id: 1,
        category: 'branding',
        title: 'BioSymbiosis | Desarrollo de Identidad Visual y Branding Aplicado',
        description: 'BioSymbiosis es una Entidad de Formación Certificada, que ofrece varios cursos y' +
            ' entrenamientos en áreas relacionadas con Terapias Naturales, Manipulativas y Energéticas.',
        fullDescription: 'El proyecto se centró en la creación de una comunicación visual integral para' +
            ' BioSymbiosis, un instituto de medicina natural especializado en formación certificada de terapias' +
            ' alternativas. El reto fue unir el rigor técnico de su propuesta educativa con una estética orgánica' +
            ' que transmitiera confianza y bienestar. ' +
            ' Se desarrolló un sistema gráfico versátil mediante Adobe Illustrator, garantizando escalabilidad en' +
            ' distintos soportes. La arquitectura de marca se adaptó a redes sociales con cabeceras y activos' +
            ' digitales optimizados para Facebook, destacando la legibilidad de las certificaciones y el acceso' +
            ' directo a la web. ' +
            ' En el ámbito editorial y de gran formato, se diseñaron piezas publicitarias exteriores con' +
            ' composiciones equilibradas y una paleta cromática vibrante que refleja la energía de las terapias' +
            ' naturales. Finalmente, se consolidó la identidad con una tipografía moderna y limpia, capaz de' +
            ' comunicar conceptos educativos complejos de manera clara en medios físicos y digitales.',
        type: 'Banner',
        image: '/projects/biosymbiosis-branding.png',
        images: [
            '/projects/biosymbiosis-1.png',
            '/projects/biosymbiosis-2.png',
            '/projects/biosymbiosis-3.jpg',
            '/projects/biosymbiosis-4.png',
            '/projects/biosymbiosis-5.jpg',
        ],
        color: 'from-green-500 to-teal-500',
        icon: <FiImage />,
        technologies: ['Adobe Photoshop', 'Illustrator'],
        client: 'Biosymbiosis Formación',
        year: '2024'
    },
    {
        id: 2,
        category: 'web',
        title: 'Portosigns | Comunicación Visual y Catálogo Retail',
        description: 'En el corazón de la Ribeira de Oporto, nació Portosigns, no a partir de un plan perfecto,' +
            ' sino de un valiente nuevo comienzo. Ante el desempleo, surgió el deseo de crear algo con alma.',
        fullDescription: 'Se desarrollaron ecosistemas digitales personalizados enfocados en el diseño de' +
            ' interfaz (UI) y experiencia de usuario (UX), con el objetivo de optimizar la navegación y mantener ' +
            ' coherencia visual en distintas industrias. Cada proyecto se abordó estratégicamente para alinear los ' +
            ' objetivos de negocio con las necesidades del usuario final, garantizando plataformas intuitivas y ' +
            ' atractivas. Entre los trabajos destacados se encuentra el diseño de prototipos y interfaces web para ' +
            ' diversos sectores comerciales, priorizando la jerarquía de información y la identidad de marca, así ' +
            ' como el proyecto Portosigns, donde se creó un entorno digital minimalista que funciona como' +
            ' catálogo de productos de alta gama. En este último, se implementó un sistema de rejillas que organiza ' +
            ' eficazmente los artículos y resalta la calidad fotográfica, reforzando la comunicación visual y la ' +
            ' experiencia de compra.',
        type: 'Diseño Web',
        image: '/projects/portosigns.png',
        images: [
            '/projects/portosigns-1.png',
            '/projects/portosigns-2.png',
            '/projects/portosigns-3.png',
            '/projects/portosigns-4.jpg',
        ],
        color: 'from-blue-500 to-cyan-500',
        icon: <FiMonitor />,
        technologies: ['Adobe Photoshop', 'Illustrator', 'React', 'Next.js'],
        client: 'Portosigns',
        year: '2024'
    },
    {
        id: 3,
        category: 'web',
        title: '1000 Eventos | Gestión y Producción de Eventos',
        description: 'Actualmente, organiza eventos en diversas áreas, y la alta asistencia de visitantes' +
            ' junto con su fuerte presencia mediática atestiguan el éxito de sus ferias.',
        fullDescription: 'Se desarrollaron ecosistemas digitales personalizados enfocados en el diseño de' +
            ' interfaz (UI) y experiencia de usuario (UX), con el propósito de optimizar la navegación y mantener' +
            ' coherencia visual en distintas industrias. Cada proyecto se abordó estratégicamente para alinear los' +
            ' objetivos de negocio con las necesidades del usuario final, garantizando plataformas intuitivas y ' +
            ' atractivas. Entre los trabajos destacados se incluye el diseño de prototipos y interfaces web para ' +
            ' diversos sectores comerciales, priorizando la jerarquía de información y la identidad de marca, ' +
            ' así como el proyecto 1000 Eventos, donde se creó una interfaz corporativa y confiable orientada ' +
            ' a la conversión de clientes potenciales, mediante galerías de servicios y formularios de contacto ' +
            ' estructurados con una jerarquía visual clara y moderna.',
        type: 'Diseño Web',
        image: '/projects/1000eventos.png',
        images: [
            '/projects/1000eventos-1.png',
            '/projects/1000eventos-2.png',
            '/projects/1000eventos-3.png',
            '/projects/1000eventos-4.jpg',
        ],
        color: 'from-blue-500 to-cyan-500',
        icon: <FiMonitor />,
        technologies: ['Adobe Photoshop', 'Illustrator', 'React', 'Next.js'],
        client: '1000 Eventos',
        year: '2024'
    },
    {
        id: 4,
        category: 'web',
        title: 'Pulse Weekend Sport | Plataforma Deportiva y Salud',
        description: 'Dedicado al mundo del deporte, este espacio centrado en las últimas innovaciones y' +
            'tendencias reunirá a las principales marcas y expertos de la industria.',
        fullDescription: 'Se desarrollaron ecosistemas digitales personalizados enfocados en el diseño de' +
            ' interfaz (UI) y experiencia de usuario (UX), con el objetivo de optimizar la navegación y mantener' +
            ' coherencia visual en distintas industrias. Cada proyecto se abordó estratégicamente para alinear los' +
            ' objetivos de negocio con las necesidades del usuario final, garantizando plataformas intuitivas y ' +
            ' atractivas. Entre los trabajos destacados se encuentra el diseño de prototipos e interfaces web para' +
            ' diversos sectores comerciales, priorizando la jerarquía de información y la identidad de marca, así ' +
            ' como el proyecto Pulse Weekend Sport, donde se creó una interfaz dinámica y vibrante que' +
            ' transmite energía y rendimiento deportivo mediante composiciones de alto impacto y una paleta ' +
            ' cromática activa que potencia el engagement del usuario.',
        type: 'Diseño Web',
        image: '/projects/pulse.png',
        images: [
            '/projects/pulse-1.png',
            '/projects/pulse-2.png',
            '/projects/pulse-3.png',
            '/projects/pulse-4.jpg',
        ],
        color: 'from-blue-500 to-cyan-500',
        icon: <FiMonitor />,
        technologies: ['Adobe Photoshop', 'Illustrator', 'React', 'Next.js'],
        client: 'Pulse',
        year: '2024'
    },
    {
        id: 5,
        category: '3d',
        title: 'Familia Cisneros | Proyecto Personal',
        description: 'Estos personajes fueron creados con el objetivo de ubicarlos en un videojuego sobre la' +
            ' familia Cisneros. Se inspiraron en una experiencia personal de migración, con el objetivo de conectar' +
            ' con los usuarios.',
        fullDescription: 'Este proyecto consistió en la creación de personajes tridimensionales diseñados' +
            ' para integrarse en un videojuego narrativo sobre la familia Cisneros. La propuesta se inspiró en una' +
            ' experiencia personal de migración, buscando transmitir emociones auténticas y generar una conexión ' +
            ' significativa con los usuarios a través de la representación visual.' +
            ' El desarrollo incluyó la conceptualización de rasgos físicos y expresivos que reflejan identidad,' +
            ' pertenencia y resiliencia, elementos clave en la historia de la migración. Se trabajó con un enfoque' +
            ' artístico que combina realismo estilizado y detalles simbólicos, logrando personajes que no solo ' +
            ' cumplen una función estética, sino también narrativa y emocional dentro del entorno interactivo.' +
            ' Al tratarse de un proyecto personal, la libertad creativa permitió explorar estilos, paletas ' +
            ' cromáticas y técnicas de modelado sin restricciones comerciales, priorizando la experimentación y ' +
            ' la autenticidad del relato. Estos personajes se convierten en vehículos de memoria y representación ' +
            ' cultural, aportando profundidad al universo del videojuego y reforzando la experiencia del jugador ' +
            ' desde una perspectiva humana y cercana.',
        type: 'Personajes 3D',
        image: '/projects/familia-cisneros.jpg',
        images: [
            '/projects/familia-cisneros-1.jpg',
            '/projects/familia-cisneros-2.jpg',
            '/projects/familia-cisneros-3.jpg',
            '/projects/familia-cisneros-4.jpg',
            '/projects/familia-cisneros-5.jpg',
        ],
        color: 'from-purple-500 to-pink-500',
        icon: <FiUsers />,
        technologies: ['Adobe Photoshop', 'Blender',],
        client: 'Personajes 3D | Proyecto Personal',
        year: '2024'
    },
    {
        id: 6,
        category: 'branding',
        title: 'Basulto | Logotipo y Marca Personal',
        description: 'Este logotipo fue creado para un salón de belleza cubano con el objetivo de tener una' +
            ' identidad visual más fuerte y distintiva frente al resto de los negocios locales.',
        fullDescription: 'Este proyecto se centra en la creación de identidades visuales únicas que reflejan' +
            ' la esencia y valores de cada marca, mediante logotipos estéticamente atractivos y estratégicamente' +
            ' funcionales. El proceso, desarrollado principalmente en Adobe Illustrator, se basa en construcción' +
            ' geométrica y síntesis visual para lograr marcas atemporales y escalables. La arquitectura de los ' +
            ' logotipos se diseña con cuadrículas y proporciones áureas, garantizando equilibrio entre forma y ' +
            ' función, mientras que la tipografía se selecciona y personaliza para complementar el isotipo y ' +
            ' reforzar el mensaje. Además, se desarrollan variantes del logotipo —principal, secundario y ' +
            ' monograma— para asegurar su versatilidad en distintos soportes, desde redes sociales hasta ' +
            ' señalética corporativa. Finalmente, la psicología del color se aplica de manera técnica para ' +
            ' generar respuestas emocionales específicas y alinear la marca con su sector comercial.',
        type: 'Logos',
        image: '/projects/basulto.png',
        images: [
            '/projects/basulto-1.png',
            '/projects/basulto-2.jpg',
            '/projects/basulto-3.jpg',
        ],
        color: 'from-orange-500 to-red-500',
        icon: <FiPenTool />,
        technologies: ['Adobe Illustrator', 'Manual de Marca'],
        client: 'Basulto Salón de Belleza',
        year: '2024'
    },
    {
        id: 7,
        category: 'branding',
        title: 'Life Watch | Logotipo',
        description: 'Este logo fue creado con fines académicos para una empresa de relojes ficticia. El reloj' +
            ' estaba diseñado para monitorear las palpitaciones del corazón y, si el usuario experimentaba alguna' +
            ' irregularidad, llamar a los servicios de emergencia.',
        fullDescription: 'Este logo fue desarrollado como parte de un proyecto académico para una empresa' +
            ' ficticia de relojes inteligentes, concebidos para monitorear las palpitaciones del corazón y alertar' +
            ' a los servicios de emergencia en caso de irregularidades. El trabajo se enfocó en la creación de una' +
            ' identidad visual sólida y funcional, capaz de transmitir confianza y claridad.' +
            ' La metodología se basó en el uso de Adobe Illustrator, aplicando construcción geométrica y síntesis ' +
            ' visual para lograr un diseño atemporal y escalable. La arquitectura del logotipo se estructuró ' +
            ' mediante cuadrículas y proporciones áureas, garantizando equilibrio entre forma y función. La ' +
            ' tipografía fue seleccionada y personalizada para complementar el isotipo, generando armonía visual y' +
            ' reforzando el mensaje de la marca.' +
            ' Asimismo, se diseñaron variantes del logotipo —principal, secundario y monograma— que aseguran su ' +
            ' versatilidad en distintos soportes, desde redes sociales hasta señalética corporativa. Finalmente, ' +
            ' la psicología del color se aplicó estratégicamente para provocar una respuesta emocional específica ' +
            ' en el público objetivo, alineando la propuesta con el sector tecnológico y de salud.',
        type: 'Logos',
        image: '/projects/lifewatch.png',
        images: [
            '/projects/lifewatch-1.jpg',
            '/projects/lifewatch-2.png',
            '/projects/lifewatch-3.jpg',
        ],
        color: 'from-orange-500 to-red-500',
        icon: <FiPenTool />,
        technologies: ['Adobe Illustrator', 'Manual de Marca'],
        client: 'Life Watch (Proyecto Académico)',
        year: '2024'
    },
    {
        id: 8,
        category: 'magazing',
        title: 'Caribe 360 | Diseño Editorial',
        description: 'La revista Caribe 360 fue creada con el objetivo de obtener una mejor visualización de ' +
            'cada uno de los personajes creados para el futuro videojuego con la incorporación de realidad aumentada.',
        fullDescription: 'El área de Diseño Editorial y Maquetación abarcó la creación de publicaciones' +
            ' impresas y digitales, desde revistas culturales hasta catálogos artísticos, siempre priorizando' +
            ' la experiencia del lector mediante un equilibrio entre impacto visual y legibilidad. Para ello se ' +
            ' implementó un flujo de trabajo profesional con Adobe Creative Cloud, gestionando layouts complejos ' +
            ' en InDesign, retoque fotográfico en Photoshop y la creación de elementos gráficos en Illustrator. ' +
            ' El resultado fueron piezas con portadas impactantes, narrativas visuales coherentes y una organización' +
            ' intuitiva de contenidos.' +
            ' Caribe 360 fue concebida como una revista que integra realidad aumentada para ofrecer una mejor ' +
            ' visualización de los personajes creados para un futuro videojuego, combinando diseño editorial con ' +
            ' innovación tecnológica para enriquecer la experiencia del lector.',
        type: 'Revista',
        image: '/projects/caribe360.png',
        images: [
            '/projects/caribe360-1.png',
            '/projects/caribe360-2.png',
            '/projects/caribe360-3.png',
            '/projects/caribe360-4.png',
            '/projects/caribe360-5.png',
            '/projects/caribe360-6.png',
            '/projects/caribe360-7.png',
            '/projects/caribe360-8.jpg',
        ],
        color: 'from-indigo-500 to-purple-500',
        icon: <FiBook />,
        technologies: ['Adobe Illustrator', 'Adobe Photoshop', 'Adobe InDesign'],
        client: 'Caribe 360 (Proyecto Académico)',
        year: '2024'
    },
    {
        id: 9,
        category: 'magazing',
        title: 'Galaxia Hung Yi | Maquetación',
        description: 'Hung Yi nació en Taiwán. Sus obras están inspiradas en la vida cotidiana de su ciudad' +
            ' natal. Estas esculturas pueden alcanzar los 8 metros de altura y cuentan una historia a quienes las admiran.',
        fullDescription: 'El área de Diseño Editorial y Maquetación abarcó la creación de publicaciones' +
            ' impresas y digitales, desde revistas culturales hasta catálogos artísticos, siempre priorizando' +
            ' la experiencia del lector mediante un equilibrio entre impacto visual y legibilidad. Para ello se ' +
            ' implementó un flujo de trabajo profesional con Adobe Creative Cloud, gestionando layouts complejos ' +
            ' en InDesign, retoque fotográfico en Photoshop y la creación de elementos gráficos en Illustrator. ' +
            ' El resultado fueron piezas con portadas impactantes, narrativas visuales coherentes y una organización' +
            ' intuitiva de contenidos.' +
            ' Galaxia Hung Yi se centró en la obra del artista taiwanés Hung Yi, cuyas esculturas monumentales ' +
            ' —inspiradas en la vida cotidiana de su ciudad natal y con alturas que alcanzan hasta 8 metros— ' +
            ' transmiten historias visuales que conectan directamente con quienes las contemplan, reforzando ' +
            ' la narrativa cultural de la publicación.',
        type: 'Revista',
        image: '/projects/galaxia.png',
        images: [
            '/projects/galaxia-1.jpg',
            '/projects/galaxia-2.jpg',
            '/projects/galaxia-3.jpg',
            '/projects/galaxia-4.jpg',
            '/projects/galaxia-5.jpg',
            '/projects/galaxia-6.jpg',
            '/projects/galaxia-7.jpg',
        ],
        color: 'from-purple-500 to-pink-500',
        icon: <FiUsers />,
        technologies: ['Adobe Illustrator', 'Adobe Photoshop', 'Adobe InDesign'],
        client: 'Galaxia Hung Yi (Proyecto Académico)',
        year: '2024'
    },
    {
        id: 10,
        category: 'illustration',
        title: 'Artistas | Retrato Minimalista y Estilizado',
        description: 'Estas ilustraciones se crean a partir de fotografías de artistas, cada uno de ellos' +
            ' buscando resaltar y elogiar las vidas de cada uno.',
        fullDescription: 'Este portafolio de ilustraciones demuestra una transición entre el arte de retrato' +
            ' minimalista y el diseño de escenarios complejos. El objetivo fue explorar diferentes lenguajes' +
            ' visuales, desde la captura de la esencia humana en retratos digitales hasta la creación de entornos' +
            ' estructurales para proyectos de entretenimiento. Desarrollo de ilustraciones basadas en figuras' +
            ' reales, utilizando una técnica de síntesis visual. El enfoque principal es la eliminación de rasgos' +
            ' complejos para resaltar la personalidad a través de siluetas, bloques de color y composición,' +
            ' logrando un estilo moderno y emocional.',
        type: 'Ilustraciones',
        image: '/projects/artistas.png',
        images: [
            '/projects/artistas-1.jpg',
            '/projects/artistas-2.jpg',
            '/projects/artistas-3.png',
            '/projects/artistas-4.jpg',
            '/projects/artistas-5.jpg',
        ],
        color: 'from-yellow-500 to-orange-500',
        icon: <FiImage />,
        technologies: ['Adobe Illustrator'],
        client: 'Artistas Proyecto de Ilustración',
        year: '2024'
    },
    {
        id: 11,
        category: 'illustration',
        title: 'Abuelito | Narrativa Familiar',
        description: 'La ilustración fue creada para recordar de una manera diferente a aquellas personas que' +
            ' ya no están con nosotros, pero que siempre llevaremos en nuestro corazón.',
        fullDescription: 'Este portafolio de ilustraciones demuestra una transición entre el arte de retrato' +
            ' minimalista y el diseño de escenarios complejos. El objetivo fue explorar diferentes lenguajes' +
            ' visuales, desde la captura de la esencia humana en retratos digitales hasta la creación de entornos' +
            ' estructurales para proyectos de entretenimiento. Proyecto especializado en la digitalización de' +
            ' memorias personales ("Abuelito Vicente"), transformando fotografías en piezas de arte gráfico que ' +
            ' preservan el legado familiar con una estética contemporánea.',
        type: 'Ilustraciones',
        image: '/projects/abuelito.png',
        images: [
            '/projects/abuelito.png',
            '/projects/abuelito-1.jpg',
        ],
        color: 'from-yellow-500 to-orange-500',
        icon: <FiImage />,
        technologies: ['Adobe Illustrator'],
        client: 'Abuelito Vicente Proyecto de Ilustración',
        year: '2024'
    },
    {
        id: 12,
        category: 'illustration',
        title: 'Escenarios | Concept Art',
        description: 'Estas ilustraciones son los escenarios para el futuro videojuego de la familia Cisneros.',
        fullDescription: 'Este portafolio de ilustraciones demuestra una transición entre el arte de retrato' +
            ' minimalista y el diseño de escenarios complejos. El objetivo fue explorar diferentes lenguajes' +
            ' visuales, desde la captura de la esencia humana en retratos digitales hasta la creación de entornos' +
            ' estructurales para proyectos de entretenimiento. Creación de "line art" detallado para el diseño' +
            ' de entornos destinados a videojuegos o proyectos narrativos. Estos escenarios demuestran dominio' +
            ' de la perspectiva, arquitectura y composición de ambientes, estableciendo las bases visuales para mundos virtuales.',
        type: 'Ilustraciones',
        image: '/projects/escenarios.png',
        images: [
            '/projects/escenarios-1.jpg',
            '/projects/escenarios-2.jpg',
            '/projects/escenarios-3.jpg',
        ],
        color: 'from-yellow-500 to-orange-500',
        icon: <FiImage />,
        technologies: ['Adobe Illustrator'],
        client: 'Escenarios Proyecto de Ilustración',
        year: '2024'
    },
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
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const [modalType, setModalType] = useState<'details' | 'gallery' | null>(null);

    const handleViewDetails = (project: any) => {
        setSelectedProject(project);
        setModalType('details');
    };

    const handleViewGallery = (project: any) => {
        setSelectedProject(project);
        setModalType('gallery');
    };

    const closeModal = () => {
        setSelectedProject(null);
        setModalType(null);
    };

    const filteredProjects = activeCategory === 'all'
        ? projects
        : projects.filter(project => project.category === activeCategory);

    return (
        <>
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
                            onViewDetails={() => handleViewDetails(project)}
                            onViewGallery={() => handleViewGallery(project)}
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

            {/* Modales */}
            {modalType === 'details' && selectedProject && (
                <ProjectDetailsModal
                    project={selectedProject}
                    isOpen={true}
                    onClose={closeModal}
                />
            )}

            {modalType === 'gallery' && selectedProject && (
                <ProjectGalleryModal
                    project={selectedProject}
                    isOpen={true}
                    onClose={closeModal}
                />
            )}
        </>

    );
}