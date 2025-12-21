import Image from 'next/image';
import { FiMail, FiPhone, FiMapPin, FiCheck } from 'react-icons/fi';

export default function PortfolioHero() {
    return (
        <section className="relative overflow-hidden bg-linear-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
            {/* Patrón de fondo */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`
                }}
            />

            <div className="container relative mx-auto px-4 py-12 md:py-20">
                <div className="grid lg:grid-cols-3 gap-12 items-center">
                    {/* Columna izquierda: Foto de Verónica */}
                    <div className="lg:col-span-1 flex flex-col items-center lg:items-start">
                        <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-white/30 shadow-2xl mb-8">
                            {/* Placeholder para la foto - Reemplazar con imagen real */}
                            {/*
                            <div className="w-full h-full bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                                <div className="text-white text-5xl font-bold">VL</div>
                            </div>
                            */}
                            {/* Para usar una imagen real: */}
                            <Image
                                src="/veronica-photo.jpg" // Ruta en public/
                                alt="Verónica Llerandi Rodríguez"
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 256px"
                                priority
                            />

                        </div>

                        {/* Información de contacto */}
                        <div className="space-y-4 text-center lg:text-left">
                            <div className="flex items-center justify-center lg:justify-start">
                                <FiPhone className="mr-3 text-blue-300" />
                                <span>(+351) 932 193 252</span>
                            </div>
                            <div className="flex items-center justify-center lg:justify-start">
                                <FiMail className="mr-3 text-blue-300" />
                                <span>verallero@gmail.com</span>
                            </div>
                            <div className="flex items-center justify-center lg:justify-start">
                                <FiMapPin className="mr-3 text-blue-300" />
                                <span>Porto, Portugal</span>
                            </div>
                        </div>
                    </div>

                    {/* Columna derecha: Presentación */}
                    <div className="lg:col-span-2">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            ¡Hola! Soy <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-300 to-blue-300">Verónica Llerandi Rodríguez</span>
                        </h1>
                        <p className="text-xl mb-6 leading-relaxed">
                            Soy diseñadora gráfica con formación en diseño multimedia y especialización en diseño y desarrollo de videojuegos. Tengo experiencia en branding, diseño web, ilustración digital y desarrollo de personajes 3D. Me apasiona crear piezas con identidad, propósito y alma.
                        </p>
                        <p className="text-xl mb-8 leading-relaxed">
                            Soy una persona creativa, curiosa y proactiva. Me encanta trabajar en equipo, aportar energía positiva a los proyectos y aprender algo nuevo.
                        </p>

                        {/* Especialidades */}
                        <div className="flex flex-wrap gap-3">
                            {['Branding', 'Diseño Web', 'Ilustración', 'Personajes 3D'].map((skill) => (
                                <span
                                    key={skill}
                                    className="flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full font-medium hover:bg-white/30 transition-colors"
                                >
                                    <FiCheck className="mr-2" />
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}