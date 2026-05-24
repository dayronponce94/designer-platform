'use client';

import { useState } from 'react';
import { useAuth } from '@/app/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    FiUser, FiMail, FiLock, FiEye, FiEyeOff,
    FiBriefcase, FiPhone, FiCheck,
    FiGlobe,
    FiTool
} from 'react-icons/fi';
import AuthLayout from '@/components/auth/AuthLayout';
import Swal from 'sweetalert2';

export default function RegisterPage() {
    const router = useRouter();
    const { register: registerUser, isLoading, error } = useAuth();
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
        country: '',
        agreeTerms: false,
        receiveUpdates: true
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validación básica
        if (formData.password !== formData.confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: '¡Oops!',
                text: 'Las contraseñas no coinciden',
                confirmButtonColor: '#3b82f6', // Color azul Tailwind
            });
            return;
        }

        if (!formData.agreeTerms) {
            Swal.fire({
                icon: 'warning',
                title: 'Términos requeridos',
                text: 'Debes aceptar los términos y condiciones para continuar',
                confirmButtonColor: '#3b82f6',
            });
            return;
        }

        // Validación de negocio del diseñador
        if (selectedRole === 'designer') {
            if (!formData.specialty) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Campo incompleto',
                    text: 'Debes seleccionar una especialidad',
                    confirmButtonColor: '#3b82f6',
                });
                return;
            }
            if (!formData.country) {
                Swal.fire({
                    icon: 'warning',
                    title: 'País requerido',
                    text: 'Debes seleccionar tu país de residencia',
                    confirmButtonColor: '#3b82f6',
                });
                return;
            }
        }
        const userData = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: selectedRole,
            phone: formData.phone || undefined,
            company: selectedRole === 'client' ? formData.company || undefined : undefined,
            specialty: selectedRole === 'designer' ? formData.specialty : undefined,
            country: selectedRole === 'designer' ? formData.country : undefined,
        };

        if (selectedRole === 'designer' && !formData.specialty) {
            Swal.fire({
                icon: 'warning',
                title: 'Campo incompleto',
                text: 'Debes seleccionar una especialidad',
                confirmButtonColor: '#3b82f6',
            });
            return;
        }

        const result = await registerUser(userData);
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
        { value: 'branding', label: 'Diseño de Marca' },
        { value: 'ux-ui', label: 'Diseño UX/UI' },
        { value: 'graphic', label: 'Diseño Gráfico' },
        { value: 'web', label: 'Diseño Web' },
        { value: 'motion', label: 'Animación Gráfica' },
        { value: 'illustration', label: 'Ilustración' },
        { value: 'other', label: 'Otro' }
    ];

    const countries = [
        // América
        { value: 'US', label: 'Estados Unidos' },
        { value: 'CA', label: 'Canadá' },
        { value: 'BR', label: 'Brasil' },
        { value: 'MX', label: 'México' },

        // Europa
        { value: 'DE', label: 'Alemania' },
        { value: 'AT', label: 'Austria' },
        { value: 'BE', label: 'Bélgica' },
        { value: 'BG', label: 'Bulgaria' },
        { value: 'CY', label: 'Chipre' },
        { value: 'HR', label: 'Croacia' },
        { value: 'DK', label: 'Dinamarca' },
        { value: 'SK', label: 'Eslovaquia' },
        { value: 'SI', label: 'Eslovenia' },
        { value: 'ES', label: 'España' },
        { value: 'EE', label: 'Estonia' },
        { value: 'FI', label: 'Finlandia' },
        { value: 'FR', label: 'Francia' },
        { value: 'GR', label: 'Grecia' },
        { value: 'HU', label: 'Hungría' },
        { value: 'IE', label: 'Irlanda' },
        { value: 'IT', label: 'Italia' },
        { value: 'LV', label: 'Letonia' },
        { value: 'LT', label: 'Lituania' },
        { value: 'LU', label: 'Luxemburgo' },
        { value: 'MT', label: 'Malta' },
        { value: 'NO', label: 'Noruega' },
        { value: 'NL', label: 'Países Bajos' },
        { value: 'PL', label: 'Polonia' },
        { value: 'PT', label: 'Portugal' },
        { value: 'GB', label: 'Reino Unido' },
        { value: 'CZ', label: 'República Checa' },
        { value: 'RO', label: 'Rumania' },
        { value: 'SE', label: 'Suecia' },
        { value: 'CH', label: 'Suiza' },

        // Asia-Pacífico y Medio Oriente
        { value: 'AU', label: 'Australia' },
        { value: 'HK', label: 'Hong Kong' },
        { value: 'JP', label: 'Japón' },
        { value: 'NZ', label: 'Nueva Zelanda' },
        { value: 'SG', label: 'Singapur' },
        { value: 'TH', label: 'Tailandia' },
        { value: 'AE', label: 'Emiratos Árabes Unidos' },
    ];


    return (
        <AuthLayout
            title="Crea tu cuenta"
            subtitle="Únete a Llerandi Design y comienza a transformar ideas en realidad."
            linkText="¿Ya tienes una cuenta?"
            linkUrl="/login"
            showBackButton={true}
            isLongForm={true}
        >
            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 font-medium">Error: {error}</p>
                </div>
            )}
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Especialidad Principal */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Especialidad Principal
                                </label>
                                <div className="relative">
                                    <FiTool className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                                    <select
                                        name="specialty"
                                        value={formData.specialty}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition appearance-none bg-white"
                                        required={selectedRole === 'designer'}
                                    >
                                        <option value="">Elige una opción</option>
                                        {designerSpecialties.map(spec => (
                                            <option key={spec.value} value={spec.value}>
                                                {spec.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* 3. Selección de País (Solo para Diseñadores) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    País de Residencia (Stripe)
                                </label>
                                <div className="relative">
                                    <FiGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                                    <select
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-600/30 focus:border-purple-600 outline-none transition appearance-none bg-white"
                                        required={selectedRole === 'designer'}
                                    >
                                        <option value="">Elige una opción</option>
                                        {countries.map(c => (
                                            <option key={c.value} value={c.value}>
                                                {c.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
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

                {/* Mensaje de bienvenida */}
                <div className="mt-8 p-4 bg-linear-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                    <p className="text-sm text-gray-700 text-center">
                        <span className="font-semibold">¡Bienvenido a LLerandi Design! </span>
                        Al registrarte, obtienes acceso inmediato a nuestra comunidad de diseñadores y herramientas profesionales.
                    </p>
                </div>
            </form>
        </AuthLayout>
    );
}