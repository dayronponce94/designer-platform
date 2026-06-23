'use client';

import Link from 'next/link';
import { FiShield, FiCheckCircle, FiInfo } from 'react-icons/fi';

export default function CookiesPage() {
    const lastUpdated = "Junio 2026";

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                {/* Header decorativo (Franja Azul Violeta) */}
                <div className="bg-linear-to-r font-sans from-indigo-600 to-blue-700 px-6 py-10 sm:px-12 text-white text-center relative">
                    <FiShield className="w-12 h-12 mx-auto mb-3 text-indigo-200" />
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Política de Cookies</h1>
                    <p className="mt-2 text-indigo-100 text-sm sm:text-base">
                        Última actualización: {lastUpdated}
                    </p>
                </div>

                {/* Contenido de la Política */}
                <div className="p-6 sm:p-12 space-y-8 prose prose-indigo max-w-none">

                    {/* Banner de introducción resumido */}
                    <section className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-xl">
                        <p className="text-sm text-indigo-800 leading-relaxed m-0">
                            En nuestra plataforma nos tomamos muy en serio la transparencia y la seguridad de tu entorno digital. Esta Política de Cookies describe qué son estas herramientas, cómo las utilizamos en nuestro ecosistema para Clientes y Diseñadores, y por qué son esenciales para tu experiencia.
                        </p>
                    </section>

                    {/* Cuerpo de información legal y técnica */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <FiInfo className="text-indigo-500 shrink-0" /> 1. ¿Qué son las cookies?
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            Las cookies son pequeños archivos de texto que los sitios web almacenan en tu navegador o dispositivo al visitarlos. Estas herramientas permiten que la plataforma recuerde información sobre tu visita, lo que facilita tu próximo acceso y hace que el sitio sea mucho más útil, rápido y seguro.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <FiCheckCircle className="text-indigo-500 shrink-0" /> 2. ¿Cómo las utilizamos en Llerandi Design?
                        </h2>
                        <p className="text-gray-600 leading-relaxed mb-3">
                            Priorizamos tu privacidad. Nuestra plataforma utiliza exclusivamente <strong>Cookies Técnicas y Estrictamente Necesarias</strong>. No empleamos cookies de seguimiento publicitario ni compartimos tus hábitos de navegación con terceros proveedores de anuncios.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            Estas cookies esenciales se activan de forma automática para cumplir con las siguientes funciones críticas:
                        </p>
                        <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700">
                            <li>
                                <span className="font-semibold text-gray-900">Gestión de Sesión:</span> Identificar tu cuenta de usuario (sea Cliente o Diseñador) una vez que has iniciado sesión, evitando que debas reintroducir tus credenciales en cada sección o vista del dashboard.
                            </li>
                            <li>
                                <span className="font-semibold text-gray-900">Seguridad del Sistema:</span> Proteger la transferencia de datos, prevenir accesos maliciosos no autorizados y mitigar intentos de falsificación de peticiones en sitios cruzados (ataques CSRF).
                            </li>
                            <li>
                                <span className="font-semibold text-gray-900">Control de Inactividad:</span> Sincronizar el temporizador de seguridad de la interfaz que cierra la sesión automáticamente tras 30 minutos de inactividad para resguardar tus datos si dejas el equipo desatendido.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <FiShield className="text-indigo-500 shrink-0" /> 3. Control y Desactivación
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            Dado que las cookies que implementamos son críticas para la seguridad y el correcto funcionamiento de los flujos de autenticación, la plataforma no puede operar sin ellas. Si decides deshabilitarlas desde la configuración de tu navegador, no podrás iniciar sesión de manera segura ni gestionar tus proyectos en el sistema.
                        </p>
                    </section>

                    {/* Nota de compromiso */}
                    <section className="bg-blue-50 p-4 rounded-xl border border-blue-100 mt-8">
                        <h3 className="text-sm font-semibold text-blue-800 mb-1">
                            Compromiso con el Usuario
                        </h3>
                        <p className="text-xs text-blue-950 leading-normal m-0">
                            Esta declaración refleja un entorno transparente y alineado con los estándares de protección de datos. Al utilizar los servicios de Llerandi Design, comprendes y aceptas el almacenamiento de estas cookies técnicas con el único fin de proveer un entorno operativo seguro, estable y eficiente.
                        </p>
                    </section>

                    {/* Pie de página de la vista */}
                    <div className="border-t border-gray-100 mt-8 pt-6 text-center text-sm text-gray-500">
                        <p>¿Tienes alguna duda sobre nuestra infraestructura de datos?</p>
                        <Link href="/contact" className="text-indigo-600 hover:underline font-medium mt-1 inline-block">
                            Contactar a Soporte Técnico
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}