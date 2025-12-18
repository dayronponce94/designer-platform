'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FiMail, FiCheck, FiUser, FiBriefcase, FiGlobe, FiTarget } from 'react-icons/fi';

export default function CTASection() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setSubmitted(true);
            setTimeout(() => {
                setSubmitted(false);
                setEmail('');
            }, 3000);
        }
    };

    return (
        <section className="py-20 relative overflow-hidden bg-linear-to-br from-blue-600 via-purple-600 to-indigo-700">
            {/* Efecto de partículas/ruido de fondo */}
            <div className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`
                }}
            />

            <div className="container relative mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        ¿Listo para transformar tu negocio con diseño?
                    </h2>

                    <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
                        Únete a cientos de empresas que ya confían en nuestra plataforma para sus proyectos de diseño.
                    </p>

                    {/* Email Subscription */}
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-12 border border-white/20">
                        <h3 className="text-2xl font-bold text-white mb-4">
                            ¿Primera vez? Obtén un 15% de descuento
                        </h3>
                        <p className="text-white/80 mb-6">
                            Suscríbete y recibe ofertas exclusivas y consejos de diseño directamente en tu email.
                        </p>

                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                            <div className="flex-1 relative">
                                <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="tu@email.com"
                                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className={`px-8 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${submitted
                                    ? 'bg-green-500 text-white hover:bg-green-600'
                                    : 'bg-white text-blue-600 hover:bg-gray-100 hover:shadow-lg'
                                    }`}
                            >
                                {submitted ? (
                                    <>
                                        <FiCheck className="w-5 h-5" /> ¡Enviado!
                                    </>
                                ) : (
                                    'Obtener descuento'
                                )}
                            </button>
                        </form>
                        <p className="text-white/60 text-sm mt-4">
                            Sin spam. Puedes cancelar la suscripción en cualquier momento.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
                        <Link
                            href="/register"
                            className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-2xl flex items-center justify-center gap-2"
                        >
                            <FiUser className="w-5 h-5" />
                            Comenzar Proyecto Gratis
                        </Link>
                        <Link
                            href="/contact"
                            className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <FiBriefcase className="w-5 h-5" />
                            Hablar con un Especialista
                        </Link>
                    </div>

                    {/* Trust Badges con iconos */}
                    <div className="mt-12 pt-8 border-t border-white/20">
                        <p className="text-white/80 mb-6 text-lg font-medium">Confían en nosotros</p>
                        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
                            <div className="flex flex-col items-center">
                                <FiTarget className="w-8 h-8 text-white/80 mb-2" />
                                <div className="text-lg font-semibold text-white/90">STARTUPS</div>
                            </div>
                            <div className="flex flex-col items-center">
                                <FiGlobe className="w-8 h-8 text-white/80 mb-2" />
                                <div className="text-lg font-semibold text-white/90">PYMES</div>
                            </div>
                            <div className="flex flex-col items-center">
                                <FiBriefcase className="w-8 h-8 text-white/80 mb-2" />
                                <div className="text-lg font-semibold text-white/90">CORPORACIONES</div>
                            </div>
                            <div className="flex flex-col items-center">
                                <FiUser className="w-8 h-8 text-white/80 mb-2" />
                                <div className="text-lg font-semibold text-white/90">AGENCIAS</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Elementos decorativos */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
        </section>
    );
}