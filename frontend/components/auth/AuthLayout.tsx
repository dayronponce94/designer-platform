'use client';

import { ReactNode, useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { FiUser } from 'react-icons/fi';

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
    subtitle: string;
    linkText: string;
    linkUrl: string;
    showBackButton?: boolean;
    isLongForm?: boolean; // Nueva prop para formularios largos
    onLinkClick?: () => void;
}

export default function AuthLayout({
    children,
    title,
    subtitle,
    linkText,
    linkUrl,
    showBackButton = false,
    isLongForm = false,  // Por defecto falso, en Register lo ponemos true
    onLinkClick
}: AuthLayoutProps) {
    const [contentHeight, setContentHeight] = useState(0);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (contentRef.current) {
            setContentHeight(contentRef.current.scrollHeight);
        }
    }, [children]);

    // Determinar la clase de padding vertical basado en la altura
    const getVerticalPadding = () => {
        if (isLongForm) {
            return 'py-12'; // Menos padding para formularios largos
        }
        return 'py-20'; // Padding normal para login
    };

    return (
        <div className="min-h-screen flex">
            {/* Columna Izquierda: Formulario */}
            <div
                ref={contentRef}
                className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-8 bg-white"
            >
                <div className="w-full max-w-md">

                    {/* Título y Subtítulo */}
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">{title}</h1>
                    <p className="text-gray-600 mb-8">{subtitle}</p>

                    {/* Formulario (Login o Register) */}
                    {children}

                    {/* Enlace para cambiar entre Login/Register */}
                    <div className="mt-8 text-center flex flex-col items-center gap-2">
                        <span className="text-gray-600">{linkText}</span>
                        <Link
                            href={linkUrl}
                            onClick={(e) => {
                                if (onLinkClick) {
                                    e.preventDefault(); // Evitamos la navegación real si hay una acción personalizada
                                    onLinkClick();
                                }
                            }}
                            className="font-semibold text-blue-600 hover:underline"
                        >
                            {linkUrl === '/login' ? 'Iniciar Sesión' :
                                linkUrl === '/forgot-password' ? 'Intentar de nuevo' : 'Crear Cuenta'}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Columna Derecha: Gradiente Visual - Ajustado dinámicamente */}
            <div className="hidden lg:flex lg:w-1/2 flex-col justify-top text-white relative overflow-hidden bg-linear-to-br from-blue-600 via-purple-600 to-indigo-700">

                {/* Patrón de fondo sutil */}
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }}
                ></div>

                {/* Contenedor con centrado dinámico */}
                <div className={`relative z-10 w-full max-w-lg mx-auto px-8 ${getVerticalPadding()}`}>
                    <div className="text-5xl font-bold mb-6">🎨</div>
                    <h2 className="text-5xl font-bold mb-6">
                        Donde las ideas encuentran su diseño
                    </h2>
                    <p className="text-xl mb-10 text-white/90">
                        Únete a una plataforma que simplifica la creación. Gestiona proyectos, colabora con diseñadores y da vida a tu visión con herramientas profesionales.
                    </p>

                    {/* Testimonio ficticio - Solo mostrar en Login */}

                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                        <p className="italic text-lg mb-4">
                            "Como freelance, esta plataforma me ha permitido enfocarme en el diseño mientras ellos manejan la logística con los clientes. ¡Insuperable!"
                        </p>
                        <div className="flex items-center">
                            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mr-4">
                                <FiUser className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="font-bold">María López</div>
                                <div className="text-white/80">Diseñadora UX/UI Freelance</div>
                            </div>
                        </div>
                    </div>

                    {/* Elemento adicional para Register */}
                    {isLongForm && (
                        <>
                            <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                <h3 className="text-2xl font-bold mb-4">¿Por qué registrarse?</h3>
                                <ul className="space-y-3">
                                    <li className="flex items-center">
                                        <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                                            <span className="text-blue-400">✓</span>
                                        </div>
                                        <span>Acceso a diseñadores verificados</span>
                                    </li>
                                    <li className="flex items-center">
                                        <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                                            <span className="text-blue-400">✓</span>
                                        </div>
                                        <span>Protección de pago garantizada</span>
                                    </li>
                                    <li className="flex items-center">
                                        <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                                            <span className="text-blue-400">✓</span>
                                        </div>
                                        <span>Soporte dedicado para cada proyecto</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                <h3 className="text-2xl font-bold mb-4">Proceso Garantizado</h3>
                                <ul className="space-y-3">
                                    <li className="flex items-center">
                                        <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                                            <span className="text-blue-400">✓</span>
                                        </div>
                                        <span>Solicitud de proyecto</span>
                                    </li>
                                    <li className="flex items-center">
                                        <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                                            <span className="text-blue-400">✓</span>
                                        </div>
                                        <span>Asignación de diseñador</span>
                                    </li>
                                    <li className="flex items-center">
                                        <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                                            <span className="text-blue-400">✓</span>
                                        </div>
                                        <span>Revisión y entrega</span>
                                    </li>
                                </ul>
                            </div>
                        </>
                    )}
                </div>

                {/* Elementos decorativos */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full translate-y-32 -translate-x-32 blur-3xl"></div>
            </div>
        </div>
    );
}