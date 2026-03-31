'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthContext } from '@/app/providers/AuthProvider';
import { adminAPI } from '@/app/lib/api/endpoints';
import { FiArrowLeft, FiUser, FiMail, FiBriefcase, FiPhone, FiCalendar, FiEdit } from 'react-icons/fi';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function UserDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { user: currentUser } = useAuthContext();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const userId = params.id as string;

    useEffect(() => {
        fetchUserDetails();
    }, [userId]);

    const fetchUserDetails = async () => {
        try {
            setLoading(true);
            const response = await adminAPI.getUserById(userId);
            const data = response.data.data;

            if (data.user) {
                setUser(data.user);
            } else {
                setError('Usuario no encontrado');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al cargar los datos del usuario');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: es });
    };

    const SPECIALTY_LABELS: Record<string, string> = {
        branding: 'Diseño de Marca',
        'ux-ui': 'Diseño UX/UI',
        graphic: 'Diseño Gráfico',
        web: 'Diseño Web',
        motion: 'Animación Gráfica',
        illustration: 'Ilustración',
        other: 'Otra Especialidad'
    };


    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-96">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando información del usuario...</p>
                </div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <p>{error || 'Usuario no encontrado'}</p>
                <button
                    onClick={() => router.back()}
                    className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                    Volver
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <FiArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Detalles del Usuario</h1>
                        <p className="text-gray-600">Información detallada del usuario</p>
                    </div>
                </div>

                <button
                    onClick={() => router.push(`/dashboard/admin/users/${userId}/edit`)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    <FiEdit className="mr-2" />
                    Editar Usuario
                </button>
            </div>

            {/* Información del usuario */}
            <div className="bg-white rounded-xl shadow p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Columna izquierda - Información básica */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="flex items-start space-x-4">
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                                <FiUser className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                                <div className="flex items-center mt-1">
                                    <FiMail className="w-4 h-4 text-gray-400 mr-2" />
                                    <span className="text-gray-600">{user.email}</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-medium text-gray-900 mb-2">Información del Rol</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Rol:</span>
                                        <span className={`font-medium ${user.role === 'admin' ? 'text-indigo-600' : user.role === 'designer' ? 'text-purple-600' : 'text-blue-600'}`}>
                                            {user.role === 'admin' ? 'Administrador' : user.role === 'designer' ? 'Diseñador' : 'Cliente'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Estado:</span>
                                        <span className={`font-medium ${user.isActive ? 'text-green-600' : 'text-red-600'}`}>
                                            {user.isActive ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Verificado:</span>
                                        <span className={`font-medium ${user.isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                                            {user.isVerified ? 'Sí' : 'No'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-medium text-gray-900 mb-2">Información de Contacto</h3>
                                <div className="space-y-2">
                                    {user.company && (
                                        <div className="flex items-center">
                                            <FiBriefcase className="w-4 h-4 text-gray-400 mr-2" />
                                            <span className="text-gray-600">{user.company}</span>
                                        </div>
                                    )}
                                    {user.phone && (
                                        <div className="flex items-center">
                                            <FiPhone className="w-4 h-4 text-gray-400 mr-2" />
                                            <span className="text-gray-600">{user.phone}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Información adicional según rol */}
                        {user.role === 'designer' && (
                            <div className="p-4 bg-purple-50 rounded-lg">
                                <h3 className="font-medium text-gray-900 mb-2">Información de Diseñador</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {user.specialty && (
                                        <div>
                                            <span className="text-gray-600">Especialidad:</span>
                                            <p className="font-medium"> {SPECIALTY_LABELS[user.specialty] || user.specialty}</p>
                                        </div>
                                    )}
                                    {user.experience && (
                                        <div>
                                            <span className="text-gray-600">Experiencia:</span>
                                            <p className="font-medium">{user.experience} años</p>
                                        </div>
                                    )}
                                    {user.skills && user.skills.length > 0 && (
                                        <div className="md:col-span-2">
                                            <span className="text-gray-600">Habilidades:</span>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {user.skills.map((skill: string, index: number) => (
                                                    <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {user.bio && (
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-medium text-gray-900 mb-2">Biografía</h3>
                                <p className="text-gray-600 whitespace-pre-line">{user.bio}</p>
                            </div>
                        )}
                    </div>

                    {/* Columna derecha - Metadatos */}
                    <div className="space-y-6">
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-medium text-gray-900 mb-3">Metadatos</h3>
                            <div className="space-y-3">
                                <div>
                                    <span className="text-sm text-gray-500">Registrado el:</span>
                                    <p className="font-medium">{formatDate(user.createdAt)}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500">Última actualización:</span>
                                    <p className="font-medium">{formatDate(user.updatedAt)}</p>
                                </div>
                            </div>
                        </div>
                        {user.role === 'designer' && (
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <h3 className="font-medium text-gray-900 mb-3">Acciones Rápidas</h3>
                                <div className="space-y-2">

                                    <button
                                        onClick={() => router.push(`/dashboard/admin/portfolio/${user._id}`)}
                                        className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        <FiBriefcase className="mr-2" />
                                        Portafolio del diseñador
                                    </button>

                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}