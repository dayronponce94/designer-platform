'use client';

import { useState, useEffect } from 'react';
import { useNotifications } from '@/app/lib/hooks/useNotifications';
import {
    FiBell,
    FiCheck,
    FiTrash2,
    FiFilter,
    FiRefreshCw,
    FiEye,
    FiEyeOff,
    FiUpload,
    FiCheckCircle,
    FiDollarSign,
    FiMessageSquare,
    FiLayers,
} from 'react-icons/fi';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function NotificationsPage() {
    const [filter, setFilter] = useState<'all' | 'unread'>('all');
    const [page, setPage] = useState(1);
    const {
        notifications,
        unreadCount,
        loading,
        error,
        pagination,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        deleteAllRead
    } = useNotifications();

    // Cargar notificaciones cuando cambie el filtro o la página
    useEffect(() => {
        fetchNotifications(page, 5, filter === 'unread');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter, page]);

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

            if (diffInHours < 24) {
                return format(date, 'HH:mm', { locale: es });
            } else if (diffInHours < 168) { // 7 días
                return format(date, 'EEEE, HH:mm', { locale: es });
            } else {
                return format(date, "dd 'de' MMMM, yyyy", { locale: es });
            }
        } catch (error) {
            return 'Fecha inválida';
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'project_delivered':
                return {
                    icon: <FiUpload className="w-5 h-5 text-purple-600" />,
                    bgColor: 'bg-purple-100'
                };
            case 'payment_confirmed':
            case 'designer_payout':
                return {
                    icon: <FiDollarSign className="w-5 h-5 text-emerald-600" />,
                    bgColor: 'bg-emerald-100'
                };
            case 'project_status_changed':
            case 'project_assigned':
                return {
                    icon: <FiLayers className="w-5 h-5 text-blue-600" />,
                    bgColor: 'bg-blue-100'
                };
            case 'new_message':
                return {
                    icon: <FiMessageSquare className="w-5 h-5 text-amber-600" />,
                    bgColor: 'bg-amber-100'
                };
            case 'system':
            default:
                return {
                    icon: <FiBell className="w-5 h-5 text-indigo-600" />,
                    bgColor: 'bg-indigo-100'
                };
        }
    };

    const getNotificationColor = (type: string, read: boolean) => {
        if (read) return 'bg-gray-100 text-gray-600';

        switch (type) {
            case 'project_assigned':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'project_status_changed':
                return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'payment_confirmed':
                return 'bg-green-50 text-green-700 border-green-200';
            case 'new_message':
                return 'bg-purple-50 text-purple-700 border-purple-200';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const handleMarkAllAsRead = async () => {
        if (unreadCount === 0) return;

        try {
            await markAllAsRead();
            fetchNotifications(page, 5, filter === 'unread');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDeleteAllRead = async () => {
        const readNotifications = notifications.filter(n => n.read);
        if (readNotifications.length === 0) return;

        try {
            await deleteAllRead();
            setPage(1); // Reiniciamos a la página 1 ya que borramos registros
            fetchNotifications(1, 5, filter === 'unread');
        } catch (error) {
            console.error('Error:', error);
        }
    };



    if (loading && notifications.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-100">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando notificaciones...</p>
                </div>
            </div>
        );
    }

    // Cálculos dinámicos locales basados en la respuesta real de la API
    const totalResults = pagination?.total || 0;
    const currentFrom = totalResults === 0 ? 0 : (page - 1) * 5 + 1;
    const currentTo = Math.min(page * 5, totalResults);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <FiBell className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Notificaciones</h1>
                            <p className="text-gray-600 mt-1">
                                {unreadCount > 0
                                    ? `Tienes ${unreadCount} ${unreadCount === 1 ? 'notificación no leída' : 'notificaciones no leídas'}`
                                    : 'No tienes notificaciones no leídas'
                                }
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <div className="flex items-center space-x-2">
                        <select
                            value={filter}
                            onChange={(e) => {
                                setFilter(e.target.value as 'all' | 'unread');
                                setPage(1);
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">Todas</option>
                            <option value="unread">No leídas</option>
                        </select>

                        <button
                            onClick={() => fetchNotifications(1, 5, filter === 'unread')}
                            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            title="Actualizar"
                        >
                            <FiRefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>

                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllAsRead}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <FiCheck className="mr-2" />
                            Marcar todas como leídas
                        </button>
                    )}

                    {notifications.some(n => n.read) && (
                        <button
                            onClick={handleDeleteAllRead}
                            className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <FiTrash2 className="mr-2" />
                            Limpiar leídas
                        </button>
                    )}
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    <p>{error}</p>
                </div>
            )}

            {/* Notifications List */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
                {notifications.length === 0 ? (
                    <div className="text-center py-12">
                        <FiBell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-900 mb-2">
                            {filter === 'unread' ? 'No hay notificaciones no leídas' : 'No hay notificaciones'}
                        </h3>
                        <p className="text-gray-500">
                            {filter === 'unread'
                                ? '¡Genial! Estás al día con todo.'
                                : 'Aquí aparecerán tus notificaciones cuando las tengas.'
                            }
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {notifications.map((notification) => (
                            <div
                                key={notification._id}
                                className={`p-6 transition-colors hover:bg-gray-50 ${!notification.read ? 'bg-blue-50/50' : ''}`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-4">
                                        <div className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl border ${getNotificationColor(notification.type, notification.read)}`}>
                                            {(() => {
                                                // Extraemos de forma limpia el icono y el fondo que configuraste arriba
                                                const { icon, bgColor } = getNotificationIcon(notification.type);
                                                return (
                                                    <div className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center border ${bgColor}`}>
                                                        {icon}
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-1">
                                                <h3 className={`text-lg font-medium ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                                                    {notification.title}
                                                </h3>
                                                {!notification.read && (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        Nuevo
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-gray-600 mb-2">
                                                {notification.message}
                                            </p>

                                            {(() => {
                                                // 1. Filtramos las llaves que contienen 'id' o que son campos puramente técnicos/operativos
                                                const keysToIgnore = ['id', 'status', 'newstatus'];

                                                const displayData = notification.data
                                                    ? Object.entries(notification.data).filter(([key]) => {
                                                        const lowerKey = key.toLowerCase();
                                                        return !keysToIgnore.some(ignored => lowerKey.includes(ignored));
                                                    })
                                                    : [];

                                                // 2. Solo si hay datos que aporten valor real al usuario, renderizamos el contenedor gris
                                                if (displayData.length > 0) {
                                                    return (
                                                        <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-500">
                                                            {displayData.map(([key, value]) => (
                                                                <div key={key} className="flex">
                                                                    <span className="font-medium mr-2">{key}:</span>
                                                                    <span>{String(value)}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            })()}

                                            <div className="flex items-center space-x-4 mt-3 text-sm text-gray-400">
                                                <span>{formatDate(notification.createdAt)}</span>
                                                {notification.projectId && (
                                                    <span className="flex items-center">
                                                        <FiEye className="mr-1" />
                                                        {notification.projectId.title}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2 ml-4">
                                        {!notification.read && (
                                            <button
                                                onClick={() => markAsRead(notification._id)}
                                                className="p-2 text-gray-400 hover:text-green-600 rounded-full hover:bg-green-50 transition-colors"
                                                title="Marcar como leída"
                                            >
                                                <FiCheck className="w-5 h-5" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => deleteNotification(notification._id)}
                                            className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                                            title="Eliminar notificación"
                                        >
                                            <FiTrash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {totalResults > 5 && (
                <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    {/* Texto de resultados con protección matemática */}
                    <div className="text-sm text-gray-500">
                        Mostrando {currentFrom} - {currentTo} de {totalResults} resultados
                    </div>

                    {/* Controles de navegación condicionales */}
                    {pagination?.pages > 1 && (
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                                disabled={page === 1}
                                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                            >
                                Anterior
                            </button>
                            <span className="px-4 py-2 text-gray-700 font-medium">
                                Página {page} de {pagination.pages}
                            </span>
                            <button
                                onClick={() => setPage(prev => Math.min(pagination.pages, prev + 1))}
                                disabled={page === pagination.pages}
                                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                            >
                                Siguiente
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}