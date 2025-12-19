export default function PricingHero() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-black text-white">
            {/* Efectos de fondo */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <div className="container relative mx-auto px-4 py-20 md:py-32">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6">
                        Precios Transparentes
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
                        Elige el plan perfecto para tu negocio. Sin sorpresas, sin contratos complicados.
                        Paga solo por lo que necesitas.
                    </p>
                    <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full">
                        <span className="text-white/80">Facturación mensual</span>
                        <div className="w-12 h-6 bg-blue-500 rounded-full mx-3 relative">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                        </div>
                        <span className="font-semibold">Facturación anual</span>
                        <span className="ml-2 px-2 py-1 bg-green-500/20 text-green-400 text-sm rounded">
                            Ahorra 20%
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}