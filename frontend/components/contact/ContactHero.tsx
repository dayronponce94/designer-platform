export default function ContactHero() {
    return (
        <section className="relative overflow-hidden bg-linear-to-br from-blue-600 to-purple-600 text-white">
            {/* Patrón de fondo */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-400 rounded-full mix-blend-overlay filter blur-3xl"></div>
            </div>

            <div className="container relative mx-auto px-4 py-20 md:py-32">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6">
                        Hablemos de tu proyecto
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
                        Estamos aquí para ayudarte. Cuéntanos sobre tu idea, pregunta por nuestros servicios o solicita una cotización personalizada.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="#formulario"
                            className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-2xl"
                        >
                            Enviar Mensaje
                        </a>
                        <a
                            href="tel:+351912345678"
                            className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all duration-300"
                        >
                            Llamar Ahora
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}