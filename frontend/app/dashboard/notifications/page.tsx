'use client';

import { useState, useEffect } from 'react';
import { useNotifications } from '@/app/lib/hooks/useNotifications';
import { FiBell, FiCheck, FiTrash2, FiFilter, FiRefreshCw, FiEye, FiEyeOff } from 'react-icons/fi';
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
        fetchNotifications(page, 20, filter === 'unread');
    }, [filter, page, fetchNotifications]);

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
            case 'project_assigned':
                return '🎨';
            case 'project_status_changed':
                return '🔄';
            case 'project_created':
                return '📋';
            case 'project_delivered':
                return '📤';
            case 'payment_confirmed':
                return '💰';
            case 'new_message':
                return '✉️';
            case 'system':
                return '🔔';
            default:
                return '📢';
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
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDeleteAllRead = async () => {
        const readNotifications = notifications.filter(n => n.read);
        if (readNotifications.length === 0) return;

        try {
            await deleteAllRead();
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
                            onClick={() => fetchNotifications(1, 20, filter === 'unread')}
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
                                            {getNotificationIcon(notification.type)}
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

                                            {notification.data && Object.keys(notification.data).length > 0 && (
                                                <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-500">
                                                    {Object.entries(notification.data).map(([key, value]) => (
                                                        <div key={key} className="flex">
                                                            <span className="font-medium mr-2">{key}:</span>
                                                            <span>{String(value)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

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

            {/* Paginación */}
            {pagination.pages > 1 && (
                <div className="flex items-center justify-between bg-white px-4 py-3 sm:px-6 rounded-lg shadow">
                    <div className="flex flex-1 justify-between sm:hidden">
                        <button
                            onClick={() => setPage(prev => Math.max(1, prev - 1))}
                            disabled={page === 1}
                            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${page === 1
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            Anterior
                        </button>
                        <button
                            onClick={() => setPage(prev => Math.min(pagination.pages, prev + 1))}
                            disabled={page === pagination.pages}
                            className={`relative ml-3 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${page === pagination.pages
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            Siguiente
                        </button>
                    </div>
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Mostrando página <span className="font-medium">{page}</span> de{' '}
                                <span className="font-medium">{pagination.pages}</span>
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button
                                    onClick={() => setPage(prev => Math.max(1, prev - 1))}
                                    disabled={page === 1}
                                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${page === 1
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-gray-500 hover:bg-gray-50'
                                        }`}
                                >
                                    Anterior
                                </button>
                                {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                                    let pageNum;
                                    if (pagination.pages <= 5) {
                                        pageNum = i + 1;
                                    } else if (page <= 3) {
                                        pageNum = i + 1;
                                    } else if (page >= pagination.pages - 2) {
                                        pageNum = pagination.pages - 4 + i;
                                    } else {
                                        pageNum = page - 2 + i;
                                    }

                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setPage(pageNum)}
                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${page === pageNum
                                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                                <button
                                    onClick={() => setPage(prev => Math.min(pagination.pages, prev + 1))}
                                    disabled={page === pagination.pages}
                                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${page === pagination.pages
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-gray-500 hover:bg-gray-50'
                                        }`}
                                >
                                    Siguiente
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}