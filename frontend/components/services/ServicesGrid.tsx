'use client';

import { useState } from 'react';
import {
    FiMonitor,
    FiBox, FiTarget,
    FiFeather,
    FiAward,
    FiBookOpen,
} from 'react-icons/fi';


const services = [
    {
        id: 'modelado-3d',
        icon: <FiBox className="w-10 h-10" />,
        title: 'Modelado 3D',
        description: 'Modelos 3D optimizados en estilo Low Poly, ideales para videojuegos, aplicaciones móviles o ilustraciones digitales.',
        details: [
            'Diseño de Concepto (4 vistas)',
            'Modelado profesional en Blender',
            'Archivos fuente .blend y .FBX/.OBJ',
            'Renders de alta calidad y texturas'
        ],
        price: 'Desde $300 USD',
        color: 'from-purple-500 to-indigo-500',
        popular: false
    },
    {
        id: 'publicidad-digital',
        icon: <FiTarget className="w-10 h-10" />,
        title: 'Publicidad Digital',
        description: 'Diseño publicitario estratégico optimizado para captar la atención en Meta Ads, Google Ads y redes sociales.',
        details: [
            '3 Conceptos iniciales en Mockup',
            'Optimización para conversión (CTR)',
            'Formatos listos para publicación',
            'Revisiones de color y tipografía'
        ],
        price: 'Desde $45 USD',
        color: 'from-orange-500 to-red-500',
        popular: true
    },
    {
        id: 'ilustraciones-digitales',
        icon: <FiFeather className="w-10 h-10" />,
        title: 'Ilustraciones Digitales',
        description: 'Convertimos tus ideas y personajes en piezas visuales únicas con acabado profesional y alta resolución.',
        details: [
            'Boceto inicial de composición',
            'Renderizado de luces y texturas',
            'Archivos en 300 DPI (PSD/PNG)',
            'Licencia de uso comercial'
        ],
        price: 'Desde $50 USD',
        color: 'from-pink-500 to-rose-500',
        popular: false
    },
    {
        id: 'logotipo-identidad',
        icon: <FiAward className="w-10 h-10" />,
        title: 'Logotipo e Identidad',
        description: 'Creamos la cara de tu negocio. Una identidad profesional que comunica confianza y calidad desde el primer segundo.',
        details: [
            '3 Propuestas de concepto original',
            'Manual de Marca (Uso y Color)',
            'Archivos vectoriales (.AI / .SVG)',
            'Kit adaptado para Redes Sociales'
        ],
        price: 'Desde $150 USD',
        color: 'from-amber-400 to-orange-600',
        popular: true
    },
    {
        id: 'diseno-editorial',
        icon: <FiBookOpen className="w-10 h-10" />,
        title: 'Diseño Editorial',
        description: 'Transformamos tu contenido en una experiencia profesional, equilibrando estética visual con una lectura fluida y organizada.',
        details: [
            'Maquetación profesional por páginas',
            'Diseño integral (Gráficos e imágenes)',
            'PDF para imprenta (CMYK) y digital',
            'Archivos fuente empaquetados (.INDD/.AI)'
        ],
        price: '$15 USD / pág.',
        color: 'from-emerald-500 to-teal-700',
        popular: false
    },
    {
        id: 'web-design-ui',
        icon: <FiMonitor className="w-10 h-10" />,
        title: 'Diseño de Interfaz',
        description: 'Plano visual estratégico para sitios web modernos. Entregamos el diseño listo para que un desarrollador lo haga realidad (No incluye código).',
        details: [
            'Mapa de sitio y flujo de navegación',
            'Mockups de alta fidelidad (UI)',
            'Guía de estilo (Colores y Tipografía)',
            'Archivos fuente y activos exportados'
        ],
        price: 'Desde $400 USD',
        color: 'from-violet-600 to-fuchsia-600',
        popular: false
    }
];

export default function ServicesGrid() {
    const [activeService, setActiveService] = useState<string | null>(null);

    return (
        <section id="servicios" className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <div className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-600 font-semibold mb-4">
                        Nuestro Expertise
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Soluciones Especializadas
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Cada servicio está diseñado para abordar necesidades específicas, con equipos especializados y metodologías probadas.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service) => (
                        <div
                            key={service.id}
                            id={service.id}
                            className={`group relative bg-white rounded-2xl p-8 border-2 hover:border-transparent shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer ${activeService === service.id ? 'border-blue-500' : 'border-gray-200'
                                }`}
                            onClick={() => setActiveService(service.id === activeService ? null : service.id)}
                            onMouseEnter={() => setActiveService(service.id)}
                            onMouseLeave={() => setActiveService(null)}
                        >
                            {service.popular && (
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-linear-to-r from-blue-500 to-purple-500 text-white text-sm font-bold rounded-full">
                                    Más Popular
                                </div>
                            )}

                            {/* Icono */}
                            <div className={`w-16 h-16 rounded-xl bg-linear-to-r ${service.color} p-4 text-white mb-6 flex items-center justify-center mx-auto`}>
                                {service.icon}
                            </div>

                            {/* Título */}
                            <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">
                                {service.title}
                            </h3>

                            {/* Descripción */}
                            <p className="text-gray-600 mb-6 text-center">
                                {service.description}
                            </p>

                            {/* Precio */}
                            <div className="text-center mb-6">
                                <span className="text-2xl font-bold text-gray-900">{service.price}</span>
                            </div>

                            {/* Detalles (se muestran al hacer hover/click) */}
                            <div className={`overflow-hidden transition-all duration-300 ${activeService === service.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                }`}>
                                <div className="pt-6 border-t border-gray-200">
                                    <h4 className="font-semibold text-gray-900 mb-4">Incluye:</h4>
                                    <ul className="space-y-2">
                                        {service.details.map((detail, idx) => (
                                            <li key={idx} className="flex items-center text-gray-700">
                                                <div className="w-2 h-2 rounded-full bg-blue-500 mr-3"></div>
                                                {detail}
                                            </li>
                                        ))}
                                    </ul>
                                    <button className="w-full mt-6 py-3 bg-linear-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300">
                                        Solicitar Servicio
                                    </button>
                                </div>
                            </div>

                            {/* CTA mínimo cuando no está activo */}
                            {activeService !== service.id && (
                                <div className="text-center">
                                    <button className="text-blue-600 font-semibold hover:text-blue-700">
                                        Ver detalles →
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}