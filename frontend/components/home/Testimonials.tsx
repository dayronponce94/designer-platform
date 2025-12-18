import { FiStar } from 'react-icons/fi';
import { FiUser } from 'react-icons/fi'; // Añadimos icono de persona

const testimonials = [
    {
        name: 'Ana Silva',
        role: 'CEO, TechStart Lisbon',
        content: 'El branding que nos desarrollaron transformó completamente nuestra presencia en el mercado. Increíble profesionalismo.',
        rating: 5,
    },
    {
        name: 'Marco Santos',
        role: 'Marketing Manager, Porto',
        content: 'La plataforma simplificó todo el proceso. Desde la solicitud hasta la entrega, todo fue impecable.',
        rating: 5,
    },
    {
        name: 'Carlos Mendes',
        role: 'Founder, Lisbon Digital',
        content: 'Trabajamos con varios diseñadores de la plataforma y todos han sido excelentes. Calidad garantizada.',
        rating: 5,
    },
];

export default function Testimonials() {
    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <div className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-600 font-semibold mb-4">
                        Testimonios
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Lo que dicen nuestros clientes
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Empresas que han transformado su negocio con nuestros servicios
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            {/* Rating */}
                            <div className="flex mb-6">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <FiStar key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                ))}
                            </div>

                            {/* Content */}
                            <p className="text-gray-700 text-lg mb-8 italic leading-relaxed">
                                "{testimonial.content}"
                            </p>

                            {/* Author con icono de persona */}
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-linear-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white mr-4">
                                    <FiUser className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900 text-lg">{testimonial.name}</div>
                                    <div className="text-gray-600">{testimonial.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}