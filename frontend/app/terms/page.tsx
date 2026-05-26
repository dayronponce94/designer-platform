'use client';

import Link from 'next/link';
import { FiArrowLeft, FiShield, FiFileText, FiDollarSign, FiLayers, FiCheckCircle } from 'react-icons/fi';

export default function TermsPage() {
    const lastUpdated = "26 de mayo de 2026"; // Fecha actual

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                {/* Header decorativo */}
                <div className="bg-linear-to-r font-sans from-blue-600 to-indigo-700 px-6 py-10 sm:px-12 text-white text-center relative">
                    <FiFileText className="w-12 h-12 mx-auto mb-3 text-blue-200" />
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Términos de Servicio</h1>
                    <p className="mt-2 text-blue-100 text-sm sm:text-base">
                        Última actualización: {lastUpdated}
                    </p>
                </div>

                {/* Contenido de los Términos */}
                <div className="p-6 sm:p-12 space-y-8 prose prose-blue max-w-none">

                    <section className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-xl">
                        <p className="text-sm text-blue-800 leading-relaxed m-0">
                            Por favor, lea atentamente estos Términos de Servicio antes de utilizar nuestra plataforma de diseño arquitectónico y gráfico. Al acceder o utilizar cualquier parte del sitio, usted acepta quedar vinculado por los presentes términos y condiciones.
                        </p>
                    </section>

                    {/* 1. Definición del Servicio */}
                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
                            <span className="p-1.5 bg-blue-100 text-blue-600 rounded-lg text-sm">1</span>
                            Naturaleza de la Plataforma
                        </h2>
                        <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                            Nuestra plataforma opera como un entorno tecnológico intermedio que conecta a clientes que requieren servicios de diseño personalizado con diseñadores profesionales independientes. El flujo operativo se gestiona exclusivamente a través de las herramientas proporcionadas en el ecosistema digital de la aplicación.
                        </p>
                    </section>

                    {/* 2. Flujo Operativo y Proceso de Contratación */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
                            <span className="p-1.5 bg-blue-100 text-blue-600 rounded-lg text-sm">2</span>
                            Flujo de Trabajo y Ciclo del Proyecto
                        </h2>
                        <p className="text-gray-600 text-sm sm:text-base">
                            El uso de la plataforma se rige estrictamente bajo las siguientes etapas secuenciales e inalterables:
                        </p>

                        <div className="grid gap-4 sm:grid-cols-2 mt-4">
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <h3 className="font-semibold text-gray-900 flex items-center text-sm mb-2">
                                    <FiFileText className="mr-2 text-blue-500" /> 2.1 Solicitud y Cotización inicial
                                </h3>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                    El Cliente publica un requerimiento detallado de diseño. El Administrador de la plataforma emite una cotización formal basada en la complejidad. El Cliente dispone de la facultad de aceptar o rechazar formalmente dicha propuesta económica.
                                </p>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <h3 className="font-semibold text-gray-900 flex items-center text-sm mb-2">
                                    <FiDollarSign className="mr-2 text-emerald-500" /> 2.2 Pago de Garantía (Fiducia)
                                </h3>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                    Una vez aceptada la cotización por el Cliente, este deberá abonar el 100% del importe cotizado. La plataforma retendrá estos fondos en un depósito de garantía seguro hasta la entrega satisfactoria del diseño final.
                                </p>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <h3 className="font-semibold text-gray-900 flex items-center text-sm mb-2">
                                    <FiLayers className="mr-2 text-purple-500" /> 2.3 Asignación al Diseñador
                                </h3>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                    Con los fondos validados, el Administrador genera una oferta de trabajo interna dirigida al pool de diseñadores autorizados. El Diseñador seleccionado evaluará la propuesta y podrá aceptarla o rechazarla libremente. Al aceptar, se constituye formalmente el inicio del "Proyecto".
                                </p>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <h3 className="font-semibold text-gray-900 flex items-center text-sm mb-2">
                                    <FiCheckCircle className="mr-2 text-indigo-500" /> 2.4 Entrega y Liquidación
                                </h3>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                    Al concluir, el Diseñador cargará los entregables en formatos finales a la plataforma. El Cliente obtendrá inmediatamente el derecho de descarga de dichos archivos. Con la descarga habilitada, el Administrador procederá a liberar los honorarios estipulados al Diseñador.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* 3. Propiedad Intelectual y Derechos de Autor */}
                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
                            <span className="p-1.5 bg-blue-100 text-blue-600 rounded-lg text-sm">3</span>
                            Propiedad Intelectual y Derechos sobre los Diseños
                        </h2>
                        <ul className="list-disc pl-5 text-gray-600 space-y-2 text-sm sm:text-base">
                            <li><strong>Derechos del Cliente:</strong> Los derechos patrimoniales sobre los diseños finales se transfieren única, exclusiva e inmediatamente al Cliente en el instante en que el Administrador libera el pago al Diseñador tras confirmarse los archivos en el servidor.</li>
                            <li><strong>Derechos de Uso del Diseñador:</strong> El Diseñador retiene los derechos morales del diseño y conserva la facultad de exhibir muestras del trabajo finalizado exclusivamente en su portafolio profesional, a menos que se haya firmado previamente un acuerdo de confidencialidad (NDA).</li>
                        </ul>
                    </section>

                    {/* 4. Políticas de Modificaciones y Cancelación */}
                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
                            <span className="p-1.5 bg-blue-100 text-blue-600 rounded-lg text-sm">4</span>
                            Cancelaciones, Rechazos y Revisiones
                        </h2>
                        <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                            Si una cotización es rechazada por el Cliente en la fase inicial, no se genera ninguna obligación de cobro. Si el Diseñador rechaza una asignación, la plataforma buscará reasignar el proyecto inmediatamente para no perjudicar los tiempos de entrega pactados con el Cliente. No se admiten solicitudes de reembolsos de dinero una vez que el diseñador ha entregado los archivos conformes a las directrices de la solicitud original.
                        </p>
                    </section>

                    {/* 5. Conducta y Exclusividad */}
                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
                            <span className="p-1.5 bg-blue-100 text-blue-600 rounded-lg text-sm">5</span>
                            Política de Desintermediación (Exclusividad)
                        </h2>
                        <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                            Queda estrictamente prohibido que Clientes y Diseñadores intercambien datos de contacto externos (teléfonos, correos, redes sociales) para realizar pagos directos fuera del ecosistema. El quebrantamiento de esta norma resultará en la suspensión permanente e irrevocable de las cuentas de ambas partes involucradas.
                        </p>
                    </section>

                    {/* 6. Limitación de Responsabilidad */}
                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
                            <span className="p-1.5 bg-blue-100 text-blue-600 rounded-lg text-sm">6</span>
                            Limitación de Responsabilidad
                        </h2>
                        <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                            La plataforma no se hace responsable por pérdidas económicas derivadas de malinterpretaciones técnicas entre el Cliente y el Diseñador, ni por retrasos imprevistos derivados de caídas externas de servidores o problemas de conectividad ajenos a nuestro control directo.
                        </p>
                    </section>
                </div>

                {/* Footer del documento */}
                <div className="bg-gray-50 px-6 py-6 sm:px-12 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                        <FiShield className="text-blue-500" /> Entorno de Servicio Protegido
                    </span>
                    <span>© {new Date().getFullYear()} Llerandi Design. Todos los derechos reservados.</span>
                </div>
            </div>
        </div>
    );
}