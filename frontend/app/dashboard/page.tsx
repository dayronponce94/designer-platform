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
    FiSettings
} from 'react-icons/fi';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function DashboardPage() {
    const { user, isLoading } = useAuthContext();

    // Datos de ejemplo (luego vendrán de la API)
    const mockStats = {
        // Para todos
        activeProjects: 0,
        completedProjects: 0,

        // Solo para clientes
        requestsSent: 0,
        nextStep: 'Enviar primera solicitud',

        // Solo para diseñadores
        clientsServed: 0,
        projectsInReview: 0,
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-100">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
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
            value: mockStats.activeProjects.toString(),
            icon: FiBriefcase,
            color: 'blue',
            desc: 'En progreso'
        },
        {
            name: 'Completados',
            value: mockStats.completedProjects.toString(),
            icon: FiCheckCircle,
            color: 'green',
            desc: 'Entregados satisfactoriamente'
        },
        {
            name: 'Solicitudes',
            value: mockStats.requestsSent.toString(),
            icon: FiSend,
            color: 'purple',
            desc: 'Cotizaciones enviadas'
        },
        {
            name: 'Próximo Paso',
            value: mockStats.nextStep,
            icon: FiClock,
            color: 'orange',
            desc: 'Siguiente acción'
        },
    ];

    const designerStats = [
        {
            name: 'Proyectos Asignados',
            value: mockStats.activeProjects.toString(),
            icon: FiBriefcase,
            color: 'blue',
            desc: 'En tu cargo'
        },
        {
            name: 'Clientes Atendidos',
            value: mockStats.clientsServed.toString(),
            icon: FiUsers,
            color: 'green',
            desc: 'Clientes únicos'
        },
        {
            name: 'En Revisión',
            value: mockStats.projectsInReview.toString(),
            icon: FiStar,
            color: 'yellow',
            desc: 'Esperando feedback'
        },
        {
            name: 'Completados',
            value: mockStats.completedProjects.toString(),
            icon: FiCheckCircle,
            color: 'purple',
            desc: 'Entregados exitosamente'
        },
    ];

    const stats = user?.role === 'designer' ? designerStats : clientStats;

    // Acciones rápidas por rol
    const clientActions = [
        {
            name: 'Solicitar Proyecto',
            icon: '➕',
            color: 'blue',
            href: '/dashboard/projects/new',
            desc: 'Comenzar nuevo diseño'
        },
        {
            name: 'Ver Portafolio',
            icon: '🎨',
            color: 'purple',
            href: '/portfolio',
            desc: 'Inspiración'
        },
        {
            name: 'Contactar Soporte',
            icon: '💬',
            color: 'green',
            href: '/contact',
            desc: 'Ayuda 24/7'
        },
        {
            name: 'Ver Servicios',
            icon: '📋',
            color: 'orange',
            href: '/services',
            desc: 'Ver opciones'
        },
    ];

    const designerActions = [
        {
            name: 'Nuevo Proyecto',
            icon: '🚀',
            color: 'blue',
            href: '/dashboard/projects/new',
            desc: 'Asignado recientemente'
        },
        {
            name: 'Mi Portafolio',
            icon: '📁',
            color: 'purple',
            href: '/dashboard/portfolio',
            desc: 'Actualizar trabajos'
        },
        {
            name: 'Mensajes',
            icon: '✉️',
            color: 'green',
            href: '/dashboard/messages',
            desc: 'Responder clientes'
        },
        {
            name: 'Configuración',
            icon: '⚙️',
            color: 'gray',
            href: '/dashboard/settings',
            desc: 'Perfil y preferencias'
        },
    ];

    const quickActions = user?.role === 'designer' ? designerActions : clientActions;

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
            action: '/dashboard/portfolio/edit'
        },
        {
            title: 'Especifica especialidades',
            description: 'Define tus áreas de expertise para recibir proyectos relevantes',
            completed: user?.skills && user.skills.length > 0,
            action: '/dashboard/profile'
        },
        {
            title: 'Configura tarifas',
            description: 'Establece tus precios por tipo de proyecto',
            completed: false,
            action: '/dashboard/pricing'
        },
    ];

    const nextSteps = user?.role === 'designer' ? designerNextSteps : clientNextSteps;

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

            {/* Explicación de cada estadística */}

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                <h3 className="font-semibold text-blue-800 mb-3">¿Qué significan estos números?</h3>

                {user?.role === 'client' ? (
                    <div className="space-y-2 text-sm text-blue-700">
                        <p><strong>Proyectos Activos:</strong> Trabajos que están en proceso de diseño.</p>
                        <p><strong>Completados:</strong> Proyectos entregados y finalizados.</p>
                        <p><strong>Solicitudes:</strong> Cotizaciones que has enviado para nuevos proyectos.</p>
                        <p><strong>Próximo Paso:</strong> La siguiente acción que debes tomar en tu proyecto más reciente.</p>
                    </div>
                ) : (
                    <div className="space-y-2 text-sm text-blue-700">
                        <p><strong>Proyectos Asignados:</strong> Trabajos que te han sido asignados.</p>
                        <p><strong>Clientes Atendidos:</strong> Número de clientes únicos que has trabajado.</p>
                        <p><strong>En Revisión:</strong> Proyectos esperando aprobación del cliente.</p>
                        <p><strong>Completados:</strong> Trabajos entregados y aceptados.</p>
                    </div>
                )}
            </div>

            {/* Información del Usuario Mejorada */}
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
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${user?.role === 'designer'
                                    ? 'bg-purple-100 text-purple-800'
                                    : user?.role === 'admin'
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-blue-100 text-blue-800'
                                    }`}>
                                    {user?.role === 'designer' ? 'Diseñador' : user?.role === 'admin' ? 'Administrador' : 'Cliente'}
                                </span>
                            </div>
                            {user?.company && (
                                <div>
                                    <p className="text-sm text-gray-500">Empresa</p>
                                    <p className="font-medium">{user.company}</p>
                                </div>
                            )}
                            {user?.specialty && user.specialty !== 'other' && (
                                <div>
                                    <p className="text-sm text-gray-500">Especialidad</p>
                                    <p className="font-medium capitalize">{user.specialty.replace('-', ' ')}</p>
                                </div>
                            )}
                            <div>
                                <p className="text-sm text-gray-500">Miembro desde</p>
                                <p className="font-medium">{user?.createdAt ? formatDate(user.createdAt) : 'Recientemente'}</p>
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
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${user?.isVerified
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                                }`}>
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

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Acciones Rápidas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickActions.map((action) => (
                        <a
                            key={action.name}
                            href={action.href}
                            className={`group p-5 border border-gray-200 rounded-xl hover:border-${action.color}-500 hover:shadow-md transition-all`}
                        >
                            <div className="flex items-center">
                                <div className={`text-2xl mr-3 group-hover:scale-110 transition-transform`}>
                                    {action.icon}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 group-hover:text-blue-600">
                                        {action.name}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">{action.desc}</p>
                                </div>
                            </div>
                        </a>
                    ))}
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