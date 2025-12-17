import { FaPalette, FaLaptop, FaBullseye, FaPaintBrush } from 'react-icons/fa';

const services = [
    {
        icon: <FaPalette className="h-10 w-10" />,
        title: 'Branding',
        description: 'Identidad de marca completa, logotipos, manual de marca y estrategia visual.',
        color: 'from-purple-500 to-pink-500',
    },
    {
        icon: <FaLaptop className="h-10 w-10" />,
        title: 'UX/UI Design',
        description: 'Diseño de experiencias e interfaces para web y aplicaciones móviles.',
        color: 'from-blue-500 to-cyan-500',
    },
    {
        icon: <FaBullseye className="h-10 w-10" />,
        title: 'Diseño Gráfico',
        description: 'Materiales impresos y digitales, presentaciones, infografías y más.',
        color: 'from-green-500 to-teal-500',
    },
    {
        icon: <FaPaintBrush className="h-10 w-10" />,
        title: 'Web Design',
        description: 'Diseño y desarrollo de sitios web modernos, responsivos y optimizados.',
        color: 'from-orange-500 to-red-500',
    },
];

export default function Services() {
    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        Nuestros Servicios
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Ofrecemos soluciones completas de diseño para llevar tus ideas al siguiente nivel.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                        >
                            <div className={`inline-flex p-3 rounded-lg bg-linear-to-r ${service.color} text-white mb-4`}>
                                {service.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">
                                {service.title}
                            </h3>
                            <p className="text-gray-600">
                                {service.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}