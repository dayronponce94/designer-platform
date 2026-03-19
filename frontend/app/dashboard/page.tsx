'use client';

import { useAuthContext } from '@/app/providers/AuthProvider';
import {
    FiBriefcase,
    FiSend,
    FiStar,
    FiCheckCircle,
    FiTrendingUp,
    FiClock,
    FiAward,
    FiUsers,
    FiSettings,
    FiEye,
} from 'react-icons/fi';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
// ... tus imports actuales ...
import { useEffect, useState } from 'react';
import { projectAPI } from '@/app/lib/api/endpoints'; // Asegúrate de tener este endpoint

export default function DashboardPage() {
    const { user, isLoading: authLoading } = useAuthContext();
    const [statsData, setStatsData] = useState({
        activeProjects: 0,
        completedProjects: 0,
        requestsSent: 0,
        nextStep: 'Cargando...',
        clientsServed: 0,
        projectsInReview: 0,
    });
    const [loadingStats, setLoadingStats] = useState(true);

    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                setLoadingStats(true);
                // Si no lo tienes, puedes usar projectAPI.getProjects() y calcularlos
                const response = await projectAPI.getProjects({ limit: 100 });
                const projects = response.data.data.projects;

                // Calculamos las estadísticas dinámicamente basándonos en los proyectos
                const active = projects.filter((p: any) => p.status === 'in-progress' || p.status === 'approved').length;
                const completed = projects.filter((p: any) => p.status === 'completed').length;
                const inReview = projects.filter((p: any) => p.status === 'review').length;

                // Clientes únicos (Solo relevante para diseñadores)
                const uniqueClients = new Set(projects.map((p: any) => p.client?._id)).size;

                setStatsData({
                    activeProjects: active,
                    completedProjects: completed,
                    projectsInReview: inReview,
                    clientsServed: uniqueClients,
                    requestsSent: projects.length, // Asumiendo que cada proyecto es una solicitud enviada
                    nextStep: active > 0 ? 'Revisar entregas' : 'Solicitar proyecto'
                });
            } catch (error) {
                console.error("Error cargando stats:", error);
            } finally {
                setLoadingStats(false);
            }
        };

        if (user) {
            fetchDashboardStats();
        }
    }, [user]);


    if (authLoading || loadingStats) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // Obtener iniciales del usuario
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    // Formatear fecha
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return format(date, "dd 'de' MMMM, yyyy", { locale: es });
    };

    // Stats específicos por rol
    const clientStats = [
        {
            name: 'Proyectos Activos',
            value: statsData.activeProjects.toString(),
            icon: FiBriefcase,
            color: 'blue',
            desc: 'En progreso'
        },
        {
            name: 'Completados',
            value: statsData.completedProjects.toString(),
            icon: FiCheckCircle,
            color: 'green',
            desc: 'Entregados'
        },
        {
            name: 'Solicitudes',
            value: statsData.requestsSent.toString(),
            icon: FiSend,
            color: 'purple',
            desc: 'Cotizaciones'
        },
        {
            name: 'Próximo Paso',
            value: statsData.nextStep,
            icon: FiClock,
            color: 'orange',
            desc: 'Acción sugerida'
        },
    ];

    const designerStats = [
        {
            name: 'Proyectos Asignados',
            value: statsData.activeProjects.toString(),
            icon: FiBriefcase,
            color: 'blue',
            desc: 'Bajo tu cargo'
        },
        {
            name: 'Clientes Atendidos',
            value: statsData.clientsServed.toString(),
            icon: FiUsers,
            color: 'green',
            desc: 'Clientes únicos'
        },
        {
            name: 'En Revisión',
            value: statsData.projectsInReview.toString(),
            icon: FiEye,
            color: 'yellow',
            desc: 'Esperando feedback'
        },
        {
            name: 'Completados',
            value: statsData.completedProjects.toString(),
            icon: FiCheckCircle,
            color: 'purple',
            desc: 'Finalizados'
        },
    ];

    const stats = user?.role === 'designer' ? designerStats : clientStats;

    // Próximos pasos por rol
    const clientNextSteps = [
        {
            title: 'Completa tu perfil',
            description: 'Añade información de tu empresa para proyectos más personalizados',
            completed: !!user?.company,
            action: '/dashboard/profile'
        },
        {
            title: 'Explora servicios',
            description: 'Descubre todas las opciones de diseño que ofrecemos',
            completed: false,
            action: '/services'
        },
        {
            title: 'Solicita cotización',
            description: 'Obtén un presupuesto detallado para tu primer proyecto',
            completed: false,
            action: '/dashboard/quote'
        },
    ];

    const designerNextSteps = [
        {
            title: 'Completa tu portafolio',
            description: 'Sube tus mejores trabajos para atraer más clientes',
            completed: !!user?.portfolio,
            action: '/dashboard/designer/portfolio'
        },
        {
            title: 'Especifica especialidades',
            description: 'Define tus áreas de expertise para recibir proyectos relevantes',
            completed: user?.skills && user.skills.length > 0,
            action: '/dashboard/profile'
        },
    ];

    const nextSteps = user?.role === 'designer' ? designerNextSteps : clientNextSteps;

    const SPECIALTY_LABELS: Record<string, string> = {
        branding: 'Diseño de Marca',
        'ux-ui': 'Diseño UX/UI',
        graphic: 'Diseño Gráfico',
        web: 'Diseño Web',
        motion: 'Animación Gráfica',
        illustration: 'Ilustración',
        other: 'Otra Especialidad'
    };

    return (
        <div className="space-y-6">
            {/* Header con Bienvenida */}
            <div className="bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">
                            Bienvenido de vuelta, {user?.name}!
                        </h1>
                        <p className="mt-2 opacity-90">
                            {user?.role === 'designer'
                                ? 'Tu talento transforma ideas en realidad. ¡Sigue creando!'
                                : 'Estamos aquí para llevar tus ideas al siguiente nivel.'}
                        </p>
                        <div className="flex items-center mt-4 space-x-4 text-sm">
                            <div className="flex items-center">
                                <FiClock className="mr-2" />
                                <span>Último acceso: {user?.lastLogin ? formatDate(user.lastLogin) : 'Hoy'}</span>
                            </div>
                            <div className="flex items-center">
                                <FiCheckCircle className="mr-2" />
                                <span>Cuenta {user?.isVerified ? 'Verificada' : 'Por verificar'}</span>
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:flex">
                        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold">
                            {getInitials(user?.name || 'U')}
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    const colorClasses = {
                        blue: 'bg-blue-100 text-blue-600',
                        green: 'bg-green-100 text-green-600',
                        purple: 'bg-purple-100 text-purple-600',
                        orange: 'bg-orange-100 text-orange-600',
                        yellow: 'bg-yellow-100 text-yellow-600',
                    };

                    return (
                        <div key={stat.name} className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <p className="text-sm text-gray-500">{stat.name}</p>
                                    <p className={`text-2xl font-bold text-gray-900 mt-2 ${stat.name === 'Próximo Paso' ? 'text-lg' : ''}`}>
                                        {stat.value}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">{stat.desc}</p>
                                </div>
                                <div className={`p-3 rounded-xl ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Información del Usuario */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Información de la Cuenta</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-500">Nombre completo</p>
                                <p className="font-medium">{user?.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-medium">{user?.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Teléfono</p>
                                <p className="font-medium">{user?.phone || 'No especificado'}</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-500">Tipo de cuenta</p>
                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${user?.role === 'designer'
                                        ? 'bg-purple-100 text-purple-800'
                                        : 'bg-blue-100 text-blue-800'
                                        }`}
                                >
                                    {user?.role === 'designer' ? 'Diseñador' : 'Cliente'}
                                </span>
                            </div>

                            {/* Solo clientes muestran empresa */}
                            {user?.role === 'client' && user?.company && (
                                <div>
                                    <p className="text-sm text-gray-500">Empresa</p>
                                    <p className="font-medium">{user.company}</p>
                                </div>
                            )}

                            {/* Solo diseñadores muestran especialidad */}
                            {user?.role === 'designer' && user?.specialty && (
                                <div>
                                    <p className="text-sm text-gray-500">Especialidad</p>
                                    <p className="font-medium">
                                        {SPECIALTY_LABELS[user.specialty] || user.specialty}
                                    </p>
                                </div>
                            )}

                            <div>
                                <p className="text-sm text-gray-500">Miembro desde</p>
                                <p className="font-medium">
                                    {user?.createdAt ? formatDate(user.createdAt) : 'Recientemente'}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <a
                            href="/dashboard/profile"
                            className="inline-flex items-center text-blue-600 hover:text-blue-700"
                        >
                            <FiSettings className="mr-2" />
                            Editar información del perfil
                        </a>
                    </div>
                </div>

                {/* Estado de la Cuenta */}
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Estado de la Cuenta</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                                <p className="font-medium">Verificación</p>
                                <p className="text-sm text-gray-500">Estado de la cuenta</p>
                            </div>
                            <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${user?.isVerified
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                    }`}
                            >
                                {user?.isVerified ? 'Verificada' : 'Pendiente'}
                            </span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                                <p className="font-medium">Actividad</p>
                                <p className="text-sm text-gray-500">Último acceso</p>
                            </div>
                            <span className="text-sm text-gray-600">
                                {user?.lastLogin ? formatDate(user.lastLogin) : 'Hoy'}
                            </span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                                <p className="font-medium">Estado</p>
                                <p className="text-sm text-gray-500">Cuenta activa</p>
                            </div>
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                Activa
                            </span>
                        </div>

                        {user?.role === 'designer' && user.experience > 0 && (
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium">Experiencia</p>
                                    <p className="text-sm text-gray-500">Años en diseño</p>
                                </div>
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                    {user.experience} {user.experience === 1 ? 'año' : 'años'}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Próximos Pasos Mejorados */}
            <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl shadow p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            {user?.role === 'designer' ? 'Optimiza tu Perfil' : 'Comienza tu Viaje'}
                        </h2>
                        <p className="text-gray-600 mt-1">
                            {user?.role === 'designer'
                                ? 'Completa estos pasos para aumentar tus oportunidades'
                                : 'Sigue estos pasos para obtener los mejores resultados'}
                        </p>
                    </div>
                    <div className="text-sm text-gray-500">
                        {nextSteps.filter(step => step.completed).length} de {nextSteps.length} completados
                    </div>
                </div>

                <div className="space-y-4">
                    {nextSteps.map((step, index) => (
                        <div
                            key={step.title}
                            className={`flex items-center p-4 rounded-lg ${step.completed ? 'bg-white' : 'bg-white/70'}`}
                        >
                            <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4 ${step.completed
                                ? 'bg-green-100 text-green-600'
                                : 'bg-gray-100 text-gray-400'
                                }`}>
                                {step.completed ? (
                                    <FiCheckCircle className="w-5 h-5" />
                                ) : (
                                    <span className="font-bold">{index + 1}</span>
                                )}
                            </div>
                            <div className="flex-1">
                                <p className={`font-medium ${step.completed ? 'text-gray-900' : 'text-gray-700'}`}>
                                    {step.title}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">{step.description}</p>
                            </div>
                            <a
                                href={step.action}
                                className={`px-4 py-2 rounded-lg text-sm font-medium ${step.completed
                                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                            >
                                {step.completed ? 'Ver' : 'Completar'}
                            </a>
                        </div>
                    ))}
                </div>
            </div>

            {/* Reconocimientos (solo para diseñadores) */}
            {user?.role === 'designer' && (
                <div className="bg-linear-to-r from-purple-50 to-pink-50 rounded-xl shadow p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Tus Logros</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-lg border border-purple-100">
                            <div className="flex items-center">
                                <FiAward className="text-yellow-500 w-8 h-8 mr-3" />
                                <div>
                                    <p className="font-bold text-lg">Nuevo Diseñador</p>
                                    <p className="text-sm text-gray-500">Bienvenido a la plataforma</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-purple-100">
                            <div className="flex items-center">
                                <FiStar className="text-blue-500 w-8 h-8 mr-3" />
                                <div>
                                    <p className="font-bold text-lg">Perfil en Progreso</p>
                                    <p className="text-sm text-gray-500">Completa tu información</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-purple-100">
                            <div className="flex items-center">
                                <FiTrendingUp className="text-green-500 w-8 h-8 mr-3" />
                                <div>
                                    <p className="font-bold text-lg">Primer Proyecto</p>
                                    <p className="text-sm text-gray-500">Esperando asignación</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}