import { FiSearch, FiMessageSquare, FiCheck, FiCreditCard, FiUsers } from 'react-icons/fi';

const steps = [
    {
        number: '01',
        icon: <FiSearch className="w-8 h-8" />,
        title: 'Describe tu proyecto',
        description: 'Completa el formulario con los detalles de tu necesidad de diseño.',
        color: 'from-blue-500 to-cyan-500',
    },
    {
        number: '02',
        icon: <FiMessageSquare className="w-8 h-8" />,
        title: 'Revisión y cotización',
        description: 'Nuestro equipo analiza los requerimientos y te envía una propuesta.',
        color: 'from-purple-500 to-pink-500',
    },
    {
        number: '03',
        icon: <FiCreditCard className="w-8 h-8" />,
        title: 'Pago seguro',
        description: 'Realiza el pago a través de nuestra plataforma protegida.',
        color: 'from-green-500 to-teal-500',
    },
    {
        number: '04',
        icon: <FiUsers className="w-8 h-8" />,
        title: 'Asignación de diseñador',
        description: 'Asignamos el mejor profesional según las necesidades de tu proyecto.',
        color: 'from-orange-500 to-red-500',
    },
    {
        number: '05',
        icon: <FiCheck className="w-8 h-8" />,
        title: 'Entrega y revisiones',
        description: 'Recibe el trabajo final con revisiones ilimitadas incluidas.',
        color: 'from-indigo-500 to-purple-500',
    },
];

export default function ProcessSection() {
    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        ¿Cómo funciona?
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Un proceso simple y transparente desde la solicitud hasta la entrega final
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300"
                        >
                            <div className="flex flex-col items-center text-center">
                                {/* Number */}
                                <div className="absolute -top-4 -left-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center font-bold text-blue-600">
                                    {step.number}
                                </div>

                                {/* Icon */}
                                <div className={`w-16 h-16 rounded-xl bg-linear-to-r ${step.color} p-3 text-white mb-4 flex items-center justify-center`}>
                                    {step.icon}
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    {step.title}
                                </h3>
                                <p className="text-gray-600">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}