'use client';

import Link from 'next/link';
import { FiArrowLeft, FiShield, FiLock, FiEye, FiServer, FiDatabase, FiUserCheck } from 'react-icons/fi';

export default function PrivacyPage() {
    const lastUpdated = "25 de mayo de 2026";

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                {/* Header decorativo */}
                <div className="bg-linear-to-r font-sans from-indigo-600 to-blue-700 px-6 py-10 sm:px-12 text-white text-center relative">
                    <FiShield className="w-12 h-12 mx-auto mb-3 text-indigo-200" />
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Política de Privacidad</h1>
                    <p className="mt-2 text-indigo-100 text-sm sm:text-base">
                        Última actualización: {lastUpdated}
                    </p>
                </div>

                {/* Contenido de la Política */}
                <div className="p-6 sm:p-12 space-y-8 prose prose-indigo max-w-none">

                    <section className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-xl">
                        <p className="text-sm text-indigo-800 leading-relaxed m-0">
                            En nuestra plataforma nos tomamos muy en serio la seguridad y privacidad de tus datos personales. Esta Política de Privacidad describe cómo recopilamos, utilizamos, almacenamos y protegemos la información de Clientes y Diseñadores en nuestro ecosistema digital.
                        </p>
                    </section>

                    {/* 1. Información que Recopilamos */}
                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
                            <span className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg text-sm">1</span>
                            Información Recopilada
                        </h2>
                        <p className="text-gray-600 text-sm sm:text-base">
                            Dependiendo de tu rol dentro de la plataforma, recopilamos los siguientes datos indispensables para la operación del servicio:
                        </p>
                        <ul className="list-disc pl-5 text-gray-600 space-y-2 text-sm sm:text-base">
                            <li><strong>Datos de Cuenta:</strong> Nombre completo, dirección de correo electrónico, contraseña encriptada y perfil de usuario (Cliente, Diseñador o Administrador).</li>
                            <li><strong>Datos de Proyectos y Solicitudes:</strong> Descripciones técnicas, requerimientos de diseño, imágenes de referencia, archivos fuente adjuntos y datos analíticos de las cotizaciones.</li>
                            <li><strong>Información para Diseñadores:</strong> Información sobre portafolios, historial de proyectos completados y datos fiscales/bancarios necesarios exclusivamente para procesar las liquidaciones de honorarios.</li>
                        </ul>
                    </section>

                    {/* 2. Uso de la Información */}
                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
                            <span className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg text-sm">2</span>
                            ¿Cómo Utilizamos tus Datos?
                        </h2>
                        <p className="text-gray-600 text-sm sm:text-base">
                            Utilizamos la información recolectada con el único propósito de garantizar el flujo operativo del sistema:
                        </p>
                        <div className="grid gap-4 sm:grid-cols-3 mt-4">
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                                <FiUserCheck className="w-6 h-6 mx-auto mb-2 text-indigo-600" />
                                <h3 className="font-semibold text-gray-900 text-xs mb-1">Gestión de Cuentas</h3>
                                <p className="text-[11px] text-gray-500">Autenticar usuarios, procesar roles dentro del sistema y personalizar tu dashboard de trabajo.</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                                <FiServer className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                                <h3 className="font-semibold text-gray-900 text-xs mb-1">Operación del Flujo</h3>
                                <p className="text-[11px] text-gray-500">Vincular solicitudes con cotizaciones, procesar aprobaciones y permitir la descarga de archivos finales.</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                                <FiLock className="w-6 h-6 mx-auto mb-2 text-emerald-600" />
                                <h3 className="font-semibold text-gray-900 text-xs mb-1">Notificaciones Críticas</h3>
                                <p className="text-[11px] text-gray-500">Enviar alertas en tiempo real sobre el estado de tus proyectos, pagos confirmados o mensajes internos.</p>
                            </div>
                        </div>
                    </section>

                    {/* 3. Seguridad y Almacenamiento de Archivos */}
                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
                            <span className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg text-sm">3</span>
                            Seguridad y Custodia de Archivos de Diseño
                        </h2>
                        <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                            Todos los archivos de diseño, planos o imágenes que los diseñadores cargan a la plataforma se almacenan en servidores seguros con controles estrictos de acceso.
                        </p>
                        <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                            El acceso a los archivos de entrega está **estrictamente restringido** al Cliente propietario de la solicitud asociada, al Diseñador asignado y al Administrador del sistema para fines de validación técnica. Ningún tercero ajeno al proyecto puede listar, visualizar o descargar estos recursos.
                        </p>
                    </section>

                    {/* 4. Información Financiera */}
                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
                            <span className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg text-sm">4</span>
                            Tratamiento de Datos de Pago
                        </h2>
                        <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                            Para tu total seguridad, la plataforma **no almacena ni procesa directamente en sus servidores** números de tarjetas de crédito o débito. Los pagos de las cotizaciones se realizan de forma cifrada a través de pasarelas de pago de confianza y certificadas. Nuestro backend solo registra el estado del pago (exitoso/rechazado) y el identificador de la transacción provisto por la pasarela para activar el proyecto.
                        </p>
                    </section>

                    {/* 5. Terceros y Transferencia de Datos */}
                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
                            <span className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg text-sm">5</span>
                            Uso compartido de datos
                        </h2>
                        <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                            No vendemos, alquilamos ni comercializamos tus datos personales con terceras empresas bajo ninguna circunstancia. Los datos solo se comparten internamente entre el Cliente y el Diseñador asignado al proyecto (como el nombre del perfil) para asegurar una comunicación transparente durante el desarrollo del diseño.
                        </p>
                    </section>

                    {/* 6. Tus Derechos (Acceso, Rectificación y Borrado) */}
                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
                            <span className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg text-sm">6</span>
                            Tus Derechos sobre tus Datos
                        </h2>
                        <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                            Tienes derecho a acceder a tu información personal, rectificar datos incorrectos o solicitar la eliminación de tu cuenta de usuario de la base de datos a través del panel de configuración o enviando un correo al administrador, siempre y cuando no existan obligaciones contractuales pendientes (como un proyecto en desarrollo o un pago por liquidar).
                        </p>
                    </section>
                </div>

                {/* Footer del documento */}
                <div className="bg-gray-50 px-6 py-6 sm:px-12 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                        <FiDatabase className="text-indigo-500" /> Datos Almacenados de Forma Segura
                    </span>
                    <span>© {new Date().getFullYear()} Llerandi Design. Todos los derechos reservados.</span>
                </div>
            </div>
        </div>
    );
}