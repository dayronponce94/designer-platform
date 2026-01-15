'use client';

import { useState, useEffect } from 'react';
import { useAuthContext } from '@/app/providers/AuthProvider';
import { userAPI } from '@/app/lib/api/endpoints';
import Alert from '@/components/ui/Alert';
import {
    FiUser, FiMail, FiPhone, FiBriefcase,
    FiAward, FiFileText, FiSave, FiGlobe,
    FiCheckCircle, FiXCircle
} from 'react-icons/fi';

const SPECIALTIES = [
    { value: 'branding', label: 'Diseño de Marca' },
    { value: 'ux-ui', label: 'Diseño UX/UI' },
    { value: 'graphic', label: 'Diseño Gráfico' },
    { value: 'web', label: 'Diseño Web' },
    { value: 'motion', label: 'Animación Gráfica' },
    { value: 'other', label: 'Otra Especialidad' }
];

const COMMON_SKILLS = [
    'Adobe Photoshop', 'Adobe Illustrator', 'Figma', 'Adobe XD', 'Sketch',
    'InDesign', 'After Effects', 'Premiere Pro', 'HTML/CSS', 'UI Design',
    'UX Research', 'Typography', 'Color Theory', 'Brand Identity', 'Packaging',
    'Web Design', 'Mobile Design', 'Illustration', 'Photo Editing', '3D Design'
];

export default function ProfilePage() {
    const { user, updateUser } = useAuthContext();
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        specialty: 'other',
        experience: 0,
        bio: '',
        skills: [] as string[],
        portfolioUrl: '',
    });
    const [newSkill, setNewSkill] = useState('');

    // Cargar datos del usuario
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                company: user.company || '',
                specialty: user.specialty || 'other',
                experience: user.experience || 0,
                bio: user.bio || '',
                skills: user.skills || [],
                portfolioUrl: user.portfolio || '',
            });
        }
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSkillAdd = () => {
        if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
            setFormData(prev => ({
                ...prev,
                skills: [...prev.skills, newSkill.trim()]
            }));
            setNewSkill('');
        }
    };

    const handleSkillRemove = (skill: string) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(s => s !== skill)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const updateData = {
                name: formData.name,
                phone: formData.phone,
                company: formData.company,
                specialty: formData.specialty,
                experience: formData.experience,
                bio: formData.bio,
                skills: formData.skills,
                portfolio: formData.portfolioUrl,
            };

            const response = await userAPI.updateUser(user?._id || '', updateData);

            if (response.data.success) {
                setSuccess('Perfil actualizado correctamente');
                updateUser(response.data.data.user);
            } else {
                setError(response.data.message);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al actualizar perfil');
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="flex justify-center items-center min-h-100">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Configuración de Perfil</h1>
                <p className="text-gray-600 mt-2">
                    Actualiza tu información personal y profesional
                </p>
            </div>

            {/* Estado de verificación */}
            {!user.isVerified && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center">
                        <FiXCircle className="text-yellow-600 mr-2" />
                        <div>
                            <p className="font-medium text-yellow-800">Cuenta pendiente de verificación</p>
                            <p className="text-sm text-yellow-700 mt-1">
                                {user.role === 'designer'
                                    ? 'La administradora revisará tu perfil y portafolio para activar tu cuenta completamente.'
                                    : 'Por favor verifica tu dirección de email para acceder a todas las funcionalidades.'}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {success && <Alert type="success" message={success} onClose={() => setSuccess('')} className="mb-6" />}
            {error && <Alert type="error" message={error} onClose={() => setError('')} className="mb-6" />}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Información Básica */}
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                        <FiUser className="mr-2" />
                        Información Personal
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nombre Completo *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 items-center">
                                <FiMail className="mr-2" />
                                Correo Electrónico
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                disabled
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                            />
                            <p className="text-xs text-gray-500 mt-1">El email no se puede modificar</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 items-center">
                                <FiPhone className="mr-2" />
                                Teléfono
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                placeholder="+34 123 456 789"
                            />
                        </div>

                        {user.role === 'client' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 items-center">
                                    <FiBriefcase className="mr-2" />
                                    Empresa
                                </label>
                                <input
                                    type="text"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    placeholder="Nombre de tu empresa"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Información Profesional (Solo Diseñadores) */}
                {user.role === 'designer' && (
                    <div className="bg-white rounded-xl shadow p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                            <FiAward className="mr-2" />
                            Información Profesional
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Especialidad Principal
                                </label>
                                <select
                                    name="specialty"
                                    value={formData.specialty}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                >
                                    {SPECIALTIES.map(spec => (
                                        <option key={spec.value} value={spec.value}>
                                            {spec.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Años de Experiencia
                                </label>
                                <div className="flex items-center space-x-4">
                                    <input
                                        type="range"
                                        name="experience"
                                        value={formData.experience}
                                        onChange={handleInputChange}
                                        min="0"
                                        max="30"
                                        className="flex-1"
                                    />
                                    <span className="text-lg font-bold text-blue-600 w-12">
                                        {formData.experience} {formData.experience === 1 ? 'año' : 'años'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Enlace a Portafolio (Behance, Dribbble, etc.)
                            </label>
                            <div className="flex items-center">
                                <FiGlobe className="text-gray-400 mr-2" />
                                <input
                                    type="url"
                                    name="portfolioUrl"
                                    value={formData.portfolioUrl}
                                    onChange={handleInputChange}
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    placeholder="https://behance.net/tuportafolio"
                                />
                            </div>
                        </div>

                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Habilidades Técnicas
                            </label>
                            <div className="flex gap-2 mb-4">
                                <input
                                    type="text"
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleSkillAdd())}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    placeholder="Añadir habilidad (ej: Figma)"
                                />
                                <button
                                    type="button"
                                    onClick={handleSkillAdd}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                >
                                    Añadir
                                </button>
                            </div>

                            <div className="mb-4">
                                <p className="text-sm text-gray-600 mb-2">Habilidades comunes:</p>
                                <div className="flex flex-wrap gap-2">
                                    {COMMON_SKILLS.map(skill => (
                                        <button
                                            key={skill}
                                            type="button"
                                            onClick={() => {
                                                if (!formData.skills.includes(skill)) {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        skills: [...prev.skills, skill]
                                                    }));
                                                }
                                            }}
                                            className={`px-3 py-1 rounded-full text-sm ${formData.skills.includes(skill)
                                                ? 'bg-green-100 text-green-800 border border-green-200'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                        >
                                            {skill} {formData.skills.includes(skill) && '✓'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-gray-600 mb-2">Tus habilidades seleccionadas:</p>
                                <div className="flex flex-wrap gap-2">
                                    {formData.skills.map(skill => (
                                        <div
                                            key={skill}
                                            className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                        >
                                            {skill}
                                            <button
                                                type="button"
                                                onClick={() => handleSkillRemove(skill)}
                                                className="ml-1 text-blue-800 hover:text-blue-900"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                    {formData.skills.length === 0 && (
                                        <p className="text-gray-500 text-sm">No has añadido habilidades aún</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Biografía */}
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                        <FiFileText className="mr-2" />
                        Biografía
                    </h2>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {user.role === 'designer'
                                ? 'Cuéntanos sobre tu experiencia, estilo de diseño y filosofía creativa'
                                : 'Cuéntanos sobre tus intereses, empresa o visión para los proyectos'}
                        </label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleInputChange}
                            rows={4}
                            maxLength={500}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            placeholder={
                                user.role === 'designer'
                                    ? 'Soy un diseñador especializado en crear experiencias digitales memorables...'
                                    : 'Mi empresa busca destacar en el mercado con un branding fuerte...'
                            }
                        />
                        <div className="flex justify-between items-center mt-2">
                            <p className="text-xs text-gray-500">
                                {formData.bio.length}/500 caracteres
                            </p>
                            <p className="text-xs text-gray-500">
                                {Math.ceil(formData.bio.length / 50)} de 10 líneas recomendadas
                            </p>
                        </div>
                    </div>
                </div>

                {/* Botón de Guardar */}
                <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                        <FiCheckCircle className="inline mr-1" />
                        Los cambios se guardarán en tu perfil
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        <FiSave className="mr-2" />
                        {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </form>

            {/* Información de Cuenta (solo lectura) */}
            <div className="mt-12 bg-gray-50 rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Información de la Cuenta</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <p className="text-sm text-gray-600">ID de Usuario</p>
                        <p className="font-mono text-sm truncate">{user._id}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Fecha de Registro</p>
                        <p className="font-medium">{new Date(user!.createdAt!).toLocaleDateString('es-ES')}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Estado de la Cuenta</p>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${user.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                            }`}>
                            {user.isActive ? 'Activa' : 'Inactiva'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}