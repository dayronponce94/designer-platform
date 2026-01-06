'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthContext } from '@/app/providers/AuthProvider';
import { useState } from 'react';
import { FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';

export default function Navbar() {
    const pathname = usePathname();
    const { user, logout } = useAuthContext();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { href: '/', label: 'Inicio' },
        { href: '/services', label: 'Servicios' },
        { href: '/portfolio', label: 'Portafolio' },
        { href: '/pricing', label: 'Precios' },
        { href: '/contact', label: 'Contacto' },
    ];

    // Si estamos en el dashboard, no mostrar el Navbar principal
    if (pathname?.startsWith('/dashboard')) {
        return null;
    }

    return (
        <nav className="bg-white shadow-lg sticky top-0 z-50">
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
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname === link.href
                                    ? 'text-blue-600 bg-blue-50'
                                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                                        <FiUser className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <span className="text-sm text-gray-700">
                                        Hola, {user.name}
                                    </span>
                                </div>
                                <Link
                                    href="/dashboard"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={logout}
                                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                                >
                                    <FiLogOut className="w-4 h-4" />
                                    <span>Cerrar Sesión</span>
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
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
                            className="p-2 text-gray-700 hover:text-blue-600 rounded-lg hover:bg-gray-100"
                        >
                            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {isMenuOpen && (
                    <div className="md:hidden border-t border-gray-200">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`block px-3 py-3 rounded-lg text-base font-medium ${pathname === link.href
                                        ? 'text-blue-600 bg-blue-50'
                                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                                        }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}

                            {user ? (
                                <div className="pt-4 border-t border-gray-200 space-y-2">
                                    <div className="px-3 py-2">
                                        <div className="flex items-center space-x-2">
                                            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                                                <FiUser className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                                <p className="text-xs text-gray-500">Bienvenido de vuelta</p>
                                            </div>
                                        </div>
                                    </div>
                                    <Link
                                        href="/dashboard"
                                        className="block px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Ir al Dashboard
                                    </Link>
                                    <button
                                        onClick={() => {
                                            logout();
                                            setIsMenuOpen(false);
                                        }}
                                        className="flex items-center space-x-2 w-full text-left px-3 py-3 rounded-lg text-base font-medium text-white bg-red-600 hover:bg-red-700"
                                    >
                                        <FiLogOut className="w-5 h-5" />
                                        <span>Cerrar Sesión</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="pt-4 border-t border-gray-200 space-y-2">
                                    <Link
                                        href="/login"
                                        className="block px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Iniciar Sesión
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="block px-3 py-3 rounded-lg text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Registrarse
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}