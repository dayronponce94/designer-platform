import { FiBriefcase, FiMonitor, FiLayout, FiPackage, FiBarChart2, FiSmartphone } from 'react-icons/fi';

const services = [
    {
        icon: <FiBriefcase className="w-8 h-8" />,
        title: 'Branding Corporativo',
        description: 'Desarrollo de identidad visual completa, logotipos, paleta de colores y manual de marca.',
        features: ['Logo Design', 'Brand Guidelines', 'Stationery'],
        gradient: 'from-blue-500 to-cyan-500',
    },
    {
        icon: <FiMonitor className="w-8 h-8" />,
        title: 'Diseño Web UX/UI',
        description: 'Interfaces intuitivas y atractivas para websites y aplicaciones web.',
        features: ['Wireframing', 'Prototyping', 'Responsive Design'],
        gradient: 'from-purple-500 to-pink-500',
    },
    {
        icon: <FiSmartphone className="w-8 h-8" />,
        title: 'App Design',
        description: 'Diseño de interfaces móviles para iOS y Android con experiencia de usuario óptima.',
        features: ['Mobile UI', 'User Testing', 'Design Systems'],
        gradient: 'from-green-500 to-teal-500',
    },
    {
        icon: <FiLayout className="w-8 h-8" />,
        title: 'Diseño Gráfico',
        description: 'Materiales impresos y digitales que comunican efectivamente tu mensaje.',
        features: ['Print Design', 'Social Media', 'Presentations'],
        gradient: 'from-orange-500 to-red-500',
    },
    {
        icon: <FiPackage className="w-8 h-8" />,
        title: 'Packaging',
        description: 'Diseño de empaques que destacan en el punto de venta y enamoran a tus clientes.',
        features: ['3D Mockups', 'Die-cut Design', 'Sustainable'],
        gradient: 'from-indigo-500 to-purple-500',
    },
    {
        icon: <FiBarChart2 className="w-8 h-8" />,
        title: 'Diseño de Marketing',
        description: 'Materiales de marketing que convierten visitantes en clientes.',
        features: ['Landing Pages', 'Email Templates', 'Ads Design'],
        gradient: 'from-pink-500 to-rose-500',
    },
];

export default function ServicesShowcase() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <div className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-600 font-semibold mb-4">
                        Nuestros Servicios
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Soluciones de diseño completas
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Cubrimos todas las necesidades de diseño para tu negocio, desde la identidad hasta el marketing digital.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="group relative bg-white rounded-2xl p-8 border border-gray-200 hover:border-transparent shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                        >
                            <div className="relative z-10">
                                {/* Icon */}
                                <div className={`w-14 h-14 rounded-xl bg-linear-to-r ${service.gradient} p-3 text-white mb-6 flex items-center justify-center`}>
                                    {service.icon}
                                </div>

                                {/* Title & Description */}
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                    {service.title}
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    {service.description}
                                </p>

                                {/* Features */}
                                <div className="space-y-2">
                                    {service.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-center text-gray-700">
                                            <div className="w-2 h-2 rounded-full bg-blue-500 mr-3" />
                                            {feature}
                                        </div>
                                    ))}
                                </div>

                                {/* CTA */}
                                <button className="mt-8 text-blue-600 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                                    Ver proyectos
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}