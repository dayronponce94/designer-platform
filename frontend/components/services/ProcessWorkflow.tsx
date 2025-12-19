import { FiSearch, FiMessageSquare, FiUsers, FiCheckCircle, FiFileText } from 'react-icons/fi';

const steps = [
    {
        step: 1,
        icon: <FiSearch className="w-8 h-8" />,
        title: 'Descubrimiento',
        description: 'Entendemos tus objetivos, audiencia y requisitos específicos.',
        duration: '1-2 días'
    },
    {
        step: 2,
        icon: <FiMessageSquare className="w-8 h-8" />,
        title: 'Propuesta y Presupuesto',
        description: 'Te presentamos una propuesta detallada con cronograma y costos.',
        duration: '2-3 días'
    },
    {
        step: 3,
        icon: <FiFileText className="w-8 h-8" />,
        title: 'Contratación',
        description: 'Firmamos el acuerdo y recibes acceso a la plataforma de gestión.',
        duration: '1 día'
    },
    {
        step: 4,
        icon: <FiUsers className="w-8 h-8" />,
        title: 'Asignación del Equipo',
        description: 'Asignamos los mejores profesionales según tu proyecto.',
        duration: '1-2 días'
    },
    {
        step: 5,
        icon: <FiCheckCircle className="w-8 h-8" />,
        title: 'Entrega y Soporte',
        description: 'Recibes los entregables finales y soporte post-proyecto.',
        duration: 'Variable'
    }
];

export default function ProcessWorkflow() {
    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <div className="inline-block px-4 py-2 rounded-full bg-purple-100 text-purple-600 font-semibold mb-4">
                        Nuestro Proceso
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Trabajamos con Metodología Clara
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Un proceso estructurado que garantiza calidad, transparencia y resultados excepcionales.
                    </p>
                </div>

                <div className="relative">
                    {/* Línea de conexión */}
                    <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-linear-to-r from-blue-500/20 via-purple-500/20 to-indigo-500/20 transform -translate-y-1/2"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                        {steps.map((step) => (
                            <div key={step.step} className="relative">
                                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                                    <div className="flex flex-col items-center text-center">
                                        {/* Número del paso */}
                                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-linear-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                            {step.step}
                                        </div>

                                        {/* Icono */}
                                        <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-6 mt-4">
                                            {step.icon}
                                        </div>

                                        {/* Contenido */}
                                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                                            {step.title}
                                        </h3>
                                        <p className="text-gray-600 mb-4">
                                            {step.description}
                                        </p>
                                        <div className="text-sm text-blue-600 font-semibold">
                                            {step.duration}
                                        </div>
                                    </div>
                                </div>

                                {/* Flecha conectora */}
                                {step.step < steps.length && (
                                    <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 text-gray-300">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}