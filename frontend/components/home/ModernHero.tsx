'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiArrowRight, FiCheckCircle } from 'react-icons/fi';

export default function ModernHero() {
    const [currentText, setCurrentText] = useState(0);
    const texts = ['Modelos-3D', 'Publicidad', 'Logotipos', 'Banners', 'Animaciones', 'Interfases'];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentText((prev) => (prev + 1) % texts.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative overflow-hidden bg-linear-to-br from-gray-900 to-black text-white">
            {/* Background Pattern */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(255 255 255 / 0.05)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`
                }}
            />

            <div className="container relative mx-auto px-4 py-20 md:py-32">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column */}
                    <div className="animate-fade-in">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-6">
                            <FiCheckCircle className="mr-2" />
                            <span className="text-sm">Plataforma profesional verificada</span>
                        </div>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                            Diseño que
                            <span className="block text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-600">
                                {texts[currentText]}
                            </span>
                            transforma negocios
                        </h1>

                        <p className="text-xl text-gray-300 mb-8 max-w-2xl">
                            Conectamos empresas con los mejores talentos en diseño.
                            Gestionamos todo el proceso desde la solicitud hasta la entrega,
                            garantizando calidad y profesionalismo.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <Link
                                href="/register"
                                className="group px-8 py-4 bg-linear-to-r from-blue-600 to-purple-600 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300"
                            >
                                Comenzar un Proyecto
                                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href="/portfolio"
                                className="px-8 py-4 bg-white/10 backdrop-blur-sm rounded-xl font-semibold text-lg hover:bg-white/20 transition-all"
                            >
                                Ver Ejemplos
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-6 mt-12">
                            <div className="text-center">
                                <div className="text-3xl font-bold mb-1">500+</div>
                                <div className="text-gray-400">Proyectos</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold mb-1">50+</div>
                                <div className="text-gray-400">Diseñadores</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold mb-1">98%</div>
                                <div className="text-gray-400">Satisfacción</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - 3D Mockup */}
                    <div className="relative">
                        <div className="relative">
                            {/* Macbook Mockup */}
                            <div className="relative mx-auto w-full max-w-lg">
                                <div className="bg-gray-900 rounded-t-2xl p-4">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                        <div className="w-3 h-3 rounded-full bg-green-500" />
                                    </div>
                                </div>
                                <div className="bg-linear-to-br from-gray-900 to-black rounded-b-2xl p-8 border-t border-gray-800">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gray-800 rounded-lg p-4">
                                            <div className="w-full h-32 bg-linear-to-r from-blue-500/20 to-purple-500/20 rounded" />
                                        </div>
                                        <div className="bg-gray-800 rounded-lg p-4">
                                            <div className="w-full h-32 bg-linear-to-r from-cyan-500/20 to-blue-500/20 rounded" />
                                        </div>
                                        <div className="bg-gray-800 rounded-lg p-4">
                                            <div className="w-full h-32 bg-linear-to-r from-purple-500/20 to-cyan-500/20 rounded" />
                                        </div>
                                        <div className="bg-gray-800 rounded-lg p-4">
                                            <div className="w-full h-32 bg-linear-to-r from-blue-500/20 to-cyan-500/20 rounded" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Elements */}
                            <div className="absolute -top-6 -left-6 w-24 h-24 bg-linear-to-r from-blue-600 to-purple-600 rounded-full blur-xl opacity-30" />
                            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-linear-to-r from-cyan-500 to-blue-600 rounded-full blur-xl opacity-30" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}