'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    FiUser, FiMail, FiLock, FiEye, FiEyeOff,
    FiBriefcase, FiPhone, FiCheck
} from 'react-icons/fi';
import AuthLayout from '@/components/auth/AuthLayout';

export default function RegisterPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [selectedRole, setSelectedRole] = useState<'client' | 'designer'>('client');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        company: '',
        specialty: '',
        agreeTerms: false,
        receiveUpdates: true
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validación básica
        if (formData.password !== formData.confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        if (!formData.agreeTerms) {
            alert('Debes aceptar los términos y condiciones');
            return;
        }

        // Aquí iría la lógica de registro real
        console.log('Registro attempt:', {
            ...formData,
            role: selectedRole
        });

        // Simulación de registro exitoso
        router.push('/dashboard');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({
                ...prev,
                [name]: checked
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const designerSpecialties = [
        'Branding',
        'UX/UI Design',
        'Diseño Gráfico',
        'Web Design',
        'Motion Graphics',
        'Ilustración',
        'Packaging',
        'Otro'
    ];

    return (
        <AuthLayout
            title="Crea tu cuenta"
            subtitle="Únete a DesignerPlatform y comienza a transformar ideas en realidad."
            linkText="¿Ya tienes una cuenta?"
            linkUrl="/login"
            showBackButton={true}
            isLongForm={true}
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Selección de Rol */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        ¿Cómo quieres usar la plataforma?
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                        {/* Botón Cliente */}
                        <button
                            type="button"
                            onClick={() => setSelectedRole('client')}
                            className={`p-4 rounded-xl border-2 transition-all duration-300 ${selectedRole === 'client'
                                ? 'border-blue-600 bg-blue-50 shadow-sm'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <div className="flex flex-col items-center">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${selectedRole === 'client'
                                    ? 'bg-blue-600'
                                    : 'bg-gray-100'
                                    }`}>
                                    <FiBriefcase className={`w-6 h-6 ${selectedRole === 'client' ? 'text-white' : 'text-gray-500'
                                        }`} />
                                </div>
                                <span className={`font-semibold ${selectedRole === 'client' ? 'text-blue-600' : 'text-gray-700'
                                    }`}>
                                    Cliente
                                </span>
                                <span className="text-sm text-gray-600 mt-1 text-center">
                                    Necesito servicios de diseño
                                </span>
                            </div>
                        </button>

                        {/* Botón Diseñador */}
                        <button
                            type="button"
                            onClick={() => setSelectedRole('designer')}
                            className={`p-4 rounded-xl border-2 transition-all duration-300 ${selectedRole === 'designer'
                                ? 'border-purple-600 bg-purple-50 shadow-sm'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <div className="flex flex-col items-center">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${selectedRole === 'designer'
                                    ? 'bg-purple-600'
                                    : 'bg-gray-100'
                                    }`}>
                                    <FiUser className={`w-6 h-6 ${selectedRole === 'designer' ? 'text-white' : 'text-gray-500'
                                        }`} />
                                </div>
                                <span className={`font-semibold ${selectedRole === 'designer' ? 'text-purple-600' : 'text-gray-700'
                                    }`}>
                                    Diseñador
                                </span>
                                <span className="text-sm text-gray-600 mt-1 text-center">
                                    Ofrezco servicios de diseño
                                </span>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Información Personal */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 pt-4 border-t">
                        Información Personal
                    </h3>

                    {/* Nombre Completo */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre Completo
                        </label>
                        <div className="relative">
                            <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition"
                                placeholder="Tu nombre completo"
                                required
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Correo Electrónico
                        </label>
                        <div className="relative">
                            <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition"
                                placeholder="tu@email.com"
                                required
                            />
                        </div>
                    </div>

                    {/* Teléfono */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Teléfono (Opcional)
                        </label>
                        <div className="relative">
                            <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition"
                                placeholder="+34 123 456 789"
                            />
                        </div>
                    </div>

                    {/* Campos específicos por rol */}
                    {selectedRole === 'client' ? (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Empresa (Opcional)
                            </label>
                            <div className="relative">
                                <FiBriefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition"
                                    placeholder="Nombre de tu empresa"
                                />
                            </div>
                        </div>
                    ) : (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Especialidad Principal
                            </label>
                            <select
                                name="specialty"
                                value={formData.specialty}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition appearance-none bg-white"
                                required
                            >
                                <option value="">Selecciona tu especialidad</option>
                                {designerSpecialties.map((specialty) => (
                                    <option key={specialty} value={specialty.toLowerCase()}>
                                        {specialty}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {/* Contraseñas */}
                <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Seguridad
                    </h3>

                    {/* Contraseña */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Contraseña
                        </label>
                        <div className="relative">
                            <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition"
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            Mínimo 6 caracteres
                        </p>
                    </div>

                    {/* Confirmar Contraseña */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirmar Contraseña
                        </label>
                        <div className="relative">
                            <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Checkboxes */}
                <div className="space-y-4 pt-4 border-t">
                    <label className="flex items-start">
                        <div className="flex items-center h-5">
                            <input
                                type="checkbox"
                                name="agreeTerms"
                                checked={formData.agreeTerms}
                                onChange={handleChange}
                                className="w-4 h-4 text-primary rounded focus:ring-primary/30"
                                required
                            />
                        </div>
                        <div className="ml-3 text-sm">
                            <span className="text-gray-700">
                                Acepto los{' '}
                                <Link href="/terms" className="text-primary hover:underline font-medium">
                                    Términos de Servicio
                                </Link>
                                {' '}y la{' '}
                                <Link href="/privacy" className="text-primary hover:underline font-medium">
                                    Política de Privacidad
                                </Link>
                            </span>
                        </div>
                    </label>

                    <label className="flex items-start">
                        <div className="flex items-center h-5">
                            <input
                                type="checkbox"
                                name="receiveUpdates"
                                checked={formData.receiveUpdates}
                                onChange={handleChange}
                                className="w-4 h-4 text-primary rounded focus:ring-primary/30"
                            />
                        </div>
                        <div className="ml-3 text-sm">
                            <span className="text-gray-700">
                                Quiero recibir actualizaciones, ofertas especiales y consejos de diseño por email
                            </span>
                        </div>
                    </label>
                </div>

                {/* Botón de Registro */}
                <button
                    type="submit"
                    className="w-full py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
                >
                    <FiCheck className="w-5 h-5" />
                    Crear Cuenta Gratis
                </button>

                {/* Separador */}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">O regístrate con</span>
                    </div>
                </div>

                {/* Botones de Registro Social */}
                <div className="grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        className="flex items-center justify-center py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition"
                    >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Google
                    </button>
                    <button
                        type="button"
                        className="flex items-center justify-center py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition"
                    >
                        <div className="w-5 h-5 mr-2 flex items-center justify-center">
                            <span className="font-bold text-blue-600">f</span>
                        </div>
                        Facebook
                    </button>
                </div>

                {/* Mensaje de bienvenida */}
                <div className="mt-8 p-4 bg-linear-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                    <p className="text-sm text-gray-700 text-center">
                        <span className="font-semibold">¡Bienvenido a DesignerPlatform! </span>
                        Al registrarte, obtienes acceso inmediato a nuestra comunidad de diseñadores y herramientas profesionales.
                    </p>
                </div>
            </form>
        </AuthLayout>
    );
}