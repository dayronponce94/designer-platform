import Link from 'next/link';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-800 text-white">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div>
                        <h3 className="text-2xl font-bold mb-4">DesignerPlatform</h3>
                        <p className="text-gray-300">
                            Conectamos clientes con talento en diseño. Proyectos profesionales con gestión centralizada.
                        </p>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Servicios</h4>
                        <ul className="space-y-2">
                            <li><Link href="/services#branding" className="text-gray-300 hover:text-white">Branding</Link></li>
                            <li><Link href="/services#uxui" className="text-gray-300 hover:text-white">UX/UI Design</Link></li>
                            <li><Link href="/services#graphic" className="text-gray-300 hover:text-white">Diseño Gráfico</Link></li>
                            <li><Link href="/services#web" className="text-gray-300 hover:text-white">Web Design</Link></li>
                        </ul>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Enlaces</h4>
                        <ul className="space-y-2">
                            <li><Link href="/about" className="text-gray-300 hover:text-white">Nosotros</Link></li>
                            <li><Link href="/portfolio" className="text-gray-300 hover:text-white">Portafolio</Link></li>
                            <li><Link href="/pricing" className="text-gray-300 hover:text-white">Precios</Link></li>
                            <li><Link href="/contact" className="text-gray-300 hover:text-white">Contacto</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2">
                            <li><Link href="/terms" className="text-gray-300 hover:text-white">Términos</Link></li>
                            <li><Link href="/privacy" className="text-gray-300 hover:text-white">Privacidad</Link></li>
                            <li><Link href="/cookies" className="text-gray-300 hover:text-white">Cookies</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; {currentYear} DesignerPlatform. Todos los derechos reservados.</p>
                    <p className="mt-2">Desarrollado para diseñadores y clientes</p>
                </div>
            </div>
        </footer>
    );
}