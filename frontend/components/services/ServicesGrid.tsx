'use client';

import { useState } from 'react';
import {
    FiLayers, FiSmartphone, FiMonitor,
    FiPackage, FiTrendingUp, FiFilm, FiEdit3
} from 'react-icons/fi';
import { FaPalette } from "react-icons/fa";

const services = [
    {
        id: 'branding',
        icon: <FaPalette className="w-10 h-10" />,
        title: 'Branding Corporativo',
        description: 'Creamos identidades visuales únicas que cuentan la historia de tu marca y conectan con tu audiencia.',
        details: [
            'Diseño de logotipo y variantes',
            'Manual de identidad visual',
            'Paleta de colores y tipografía',
            'Sistema de iconografía'
        ],
        price: 'Desde €1,500',
        color: 'from-blue-500 to-cyan-500',
        popular: true
    },
    {
        id: 'uxui',
        icon: <FiLayers className="w-10 h-10" />,
        title: 'UX/UI Design',
        description: 'Diseñamos experiencias intuitivas y atractivas que mejoran la interacción y conversión de usuarios.',
        details: [
            'Research y user personas',
            'Wireframing y prototyping',
            'Diseño de interfaces responsivas',
            'Design systems'
        ],
        price: 'Desde €2,000',
        color: 'from-purple-500 to-pink-500',
        popular: false
    },
    {
        id: 'web',
        icon: <FiMonitor className="w-10 h-10" />,
        title: 'Diseño Web',
        description: 'Desarrollamos sitios web modernos, rápidos y optimizados para todos los dispositivos.',
        details: [
            'Diseño web responsivo',
            'Landing pages optimizadas',
            'E-commerce y tiendas online',
            'Websites corporativos'
        ],
        price: 'Desde €1,800',
        color: 'from-green-500 to-teal-500',
        popular: false
    },
    {
        id: 'mobile',
        icon: <FiSmartphone className="w-10 h-10" />,
        title: 'App Design',
        description: 'Interfaces móviles nativas que ofrecen experiencias fluidas y memorables en iOS y Android.',
        details: [
            'UI design para móviles',
            'Prototipos interactivos',
            'Seguimiento de guías nativas',
            'Testing de usabilidad'
        ],
        price: 'Desde €2,500',
        color: 'from-orange-500 to-red-500',
        popular: true
    },
    {
        id: 'graphic',
        icon: <FiEdit3 className="w-10 h-10" />,
        title: 'Diseño Gráfico',
        description: 'Materiales impresos y digitales que comunican tu mensaje de forma clara y profesional.',
        details: [
            'Diseño de presentaciones',
            'Materiales de marketing',
            'Papelería corporativa',
            'Infografías y reportes'
        ],
        price: 'Desde €800',
        color: 'from-yellow-500 to-orange-500',
        popular: false
    },
    {
        id: 'packaging',
        icon: <FiPackage className="w-10 h-10" />,
        title: 'Packaging Design',
        description: 'Diseños de empaque que destacan en el punto de venta y crean conexión emocional.',
        details: [
            'Diseño de packaging 3D',
            'Mockups realistas',
            'Sustentabilidad y materiales',
            'Producción y seguimiento'
        ],
        price: 'Desde €1,200',
        color: 'from-indigo-500 to-purple-500',
        popular: false
    },
    {
        id: 'marketing',
        icon: <FiTrendingUp className="w-10 h-10" />,
        title: 'Marketing Digital',
        description: 'Campañas y materiales de marketing que generan engagement y conversiones.',
        details: [
            'Social media graphics',
            'Email marketing templates',
            'Banners y anuncios digitales',
            'Campañas publicitarias'
        ],
        price: 'Desde €900',
        color: 'from-pink-500 to-rose-500',
        popular: false
    },
    {
        id: 'motion',
        icon: <FiFilm className="w-10 h-10" />,
        title: 'Motion Graphics',
        description: 'Animaciones y videos que captan atención y comunican mensajes complejos de forma simple.',
        details: [
            'Animación de logotipos',
            'Videos explicativos',
            'Animated infographics',
            'Social media animations'
        ],
        price: 'Desde €1,500',
        color: 'from-cyan-500 to-blue-500',
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((service) => (
                        <div
                            key={service.id}
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