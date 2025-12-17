'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/app/providers/AuthProvider';
import { useState } from 'react';

export default function Navbar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { href: '/', label: 'Inicio' },
        { href: '/services', label: 'Servicios' },
        { href: '/portfolio', label: 'Portafolio' },
        { href: '/pricing', label: 'Precios' },
        { href: '/contact', label: 'Contacto' },
    ];

    return (
        <nav className="bg-white shadow-lg">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="text-2xl font-bold text-blue-600">
                            DesignerPlatform
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-3 py-2 rounded-md text-sm font-medium ${pathname === link.href
                                        ? 'text-blue-600 bg-blue-50'
                                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-700">
                                    Hola, {user.name}
                                </span>
                                <Link
                                    href="/dashboard"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={logout}
                                    className="px-4 py-2 text-gray-700 hover:text-blue-600"
                                >
                                    Cerrar Sesión
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="px-4 py-2 text-blue-600 hover:text-blue-700"
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    Registrarse
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-700 hover:text-blue-600"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {isMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === link.href
                                            ? 'text-blue-600 bg-blue-50'
                                            : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                                        }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            {user ? (
                                <>
                                    <Link
                                        href="/dashboard"
                                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={() => {
                                            logout();
                                            setIsMenuOpen(false);
                                        }}
                                        className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                                    >
                                        Cerrar Sesión
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Iniciar Sesión
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Registrarse
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}