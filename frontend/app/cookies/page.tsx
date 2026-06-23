'use client';

import Link from 'next/link';
import { FiShield, FiCheckCircle, FiInfo, FiArrowLeft } from 'react-icons/fi';

export default function CookiesPage() {
    return (
        <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-xs border border-gray-100">

                {/* Botón de regreso */}
                <div className="mb-6">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
                    >
                        <FiArrowLeft /> Volver al inicio
                    </Link>
                </div>

                {/* Encabezado */}
                <div className="border-b pb-6 mb-6">
                    <div className="flex items-center gap-3 text-blue-600 mb-2">
                        <FiShield className="w-8 h-8" />
                        <span className="text-xs font-bold tracking-wider uppercase bg-blue-50 px-2.5 py-1 rounded-md">
                            Transparencia y Seguridad
                        </span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
                        Política de Cookies
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Última actualización: Junio 2026
                    </p>
                </div>

                {/* Contenido Legal/Técnico */}
                <div className="space-y-6 text-gray-600 leading-relaxed">

                    <section>
                        <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <FiInfo className="text-blue-500 shrink-0" /> 1. ¿Qué son las cookies?
                        </h2>
                        <p>
                            Las cookies son pequeños archivos de texto que los sitios web almacenan en su navegador o dispositivo al visitarlos. Estas herramientas permiten que la plataforma recuerde información sobre su visita, lo que facilita su próximo acceso y hace que el sitio sea más útil y seguro.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <FiCheckCircle className="text-blue-500 shrink-0" /> 2. ¿Cómo las utilizamos en Llerandi Design?
                        </h2>
                        <p className="mb-3">
                            En <strong>Llerandi Design</strong> priorizamos su privacidad. Nuestra plataforma utiliza exclusivamente <strong>Cookies Técnicas y Estrictamente Necesarias</strong>. No empleamos cookies de seguimiento publicitario ni compartimos sus hábitos de navegación con terceros.
                        </p>
                        <p>
                            Estas cookies esenciales se activan automáticamente para cumplir con las siguientes funciones:
                        </p>
                        <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700">
                            <li>
                                <span className="font-semibold text-gray-900">Gestión de Sesión:</span> Identificar su cuenta de usuario (sea Cliente o Diseñador) una vez que ha iniciado sesión, evitando que deba reintroducir sus credenciales en cada sección de la plataforma.
                            </li>
                            <li>
                                <span className="font-semibold text-gray-900">Seguridad del Sistema:</span> Proteger la transferencia de datos, prevenir accesos no autorizados y mitigar intentos de falsificación de peticiones en sitios cruzados (ataques CSRF).
                            </li>
                            <li>
                                <span className="font-semibold text-gray-900">Control de Inactividad:</span> Sincronizar el temporizador de seguridad de la interfaz que cierra la sesión automáticamente tras 30 minutos de inactividad para resguardar su información sensible.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <FiShield className="text-blue-500 shrink-0" /> 3. Control y Desactivación
                        </h2>
                        <p>
                            Dado que las cookies que implementamos son críticas para la seguridad y el correcto funcionamiento de los flujos de autenticación, la plataforma no puede operar de forma óptima sin ellas. Si decide deshabilitar las cookies desde la configuración de su navegador, no podrá iniciar sesión ni gestionar proyectos en el sistema.
                        </p>
                    </section>

                    <section className="bg-blue-50 p-4 rounded-xl border border-blue-100 mt-8">
                        <h3 className="text-sm font-semibold text-blue-800 mb-1">
                            Compromiso con el Usuario
                        </h3>
                        <p className="text-xs text-blue-950 leading-normal">
                            Esta declaración refleja un entorno transparente y alineado con los estándares internacionales de protección de datos. Al utilizar los servicios de Llerandi Design, usted comprende y acepta el almacenamiento de estas cookies técnicas con el único fin de proveer un entorno operativo seguro y eficiente.
                        </p>
                    </section>

                </div>

                {/* Pie de página de la vista */}
                <div className="border-t mt-8 pt-6 text-center text-sm text-gray-500">
                    <p>¿Tiene alguna duda sobre nuestra infraestructura de datos?</p>
                    <Link href="/contact" className="text-blue-600 hover:underline font-medium mt-1 inline-block">
                        Contactar a Soporte Técnico
                    </Link>
                </div>

            </div>
        </div>
    );
}