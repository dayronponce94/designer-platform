import Link from 'next/link';

export default function Hero() {
    return (
        <section className="relative bg-linear-to-r from-blue-600 to-purple-600 text-white">
            <div className="container mx-auto px-4 py-20 md:py-32">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Soluciones Profesionales de Diseño
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 opacity-90">
                        Conectamos clientes con los mejores talentos en diseño.
                        Solicita tu proyecto y obtén resultados excepcionales.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/register"
                            className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition"
                        >
                            Solicitar un Proyecto
                        </Link>
                        <Link
                            href="/portfolio"
                            className="px-8 py-3 bg-transparent border-2 border-white font-semibold rounded-lg hover:bg-white/10 transition"
                        >
                            Ver Portafolio
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}