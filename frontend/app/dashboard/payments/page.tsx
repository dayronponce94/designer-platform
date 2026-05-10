'use client';

import { useMemo, useState } from 'react';
import { usePayments } from '@/app/lib/hooks/usePayments';
import { FiCreditCard, FiCheckCircle, FiClock, FiAlertCircle, } from 'react-icons/fi';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';



export default function PaymentsPage() {
    const { payments, summary, loading, error, fetchPayments } = usePayments();
    const [filter, setFilter] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;


    // APLICANDO LA LÓGICA DE DISEÑADORES AQUÍ:
    const stats = useMemo(() => {
        // 1. Total Pagado (Suma simple como en la página de diseñadores)
        // Filtramos por 'completed' que es el tipo que TS acepta en tu componente
        const totalPaid = payments
            .filter(p => p.status as string === 'succeeded') // Solo consideramos pagos exitosos
            .reduce((sum, p) => sum + p.amount, 0);

        // 2. Cantidad de pagos exitosos
        const completedCount = payments.filter(p => p.status as string === 'succeeded').length;

        // 3. Monto Pendiente (Sumamos lo que no está completado ni fallido)
        const pendingAmount = payments
            .filter(p => p.status as string === 'pending' || p.status as string === 'processing')
            .reduce((sum, p) => sum + p.amount, 0);

        return {
            totalPaid,
            completedCount,
            pendingAmount
        };
    }, [payments]); // Se recalcula cada vez que 'payments' cambia


    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return format(date, "dd 'de' MMMM, yyyy", { locale: es });
        } catch (error) {
            return 'Fecha inválida';
        }
    };

    const formatCurrency = (amount: number, currency: string = 'EUR') => {
        return new Intl.NumberFormat('pt-PT', {
            style: 'currency',
            currency: currency
        }).format(amount);
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'succeeded':
                return {
                    icon: FiCheckCircle,
                    color: 'text-green-600 bg-green-100',
                    label: 'Completado'
                };
            case 'pending':
                return {
                    icon: FiClock,
                    color: 'text-yellow-600 bg-yellow-100',
                    label: 'Pendiente'
                };
            case 'processing':
                return {
                    icon: FiClock,
                    color: 'text-blue-600 bg-blue-100',
                    label: 'Procesando'
                };
            case 'failed':
                return {
                    icon: FiAlertCircle,
                    color: 'text-red-600 bg-red-100',
                    label: 'Fallido'
                };
            case 'refunded':
                return {
                    icon: FiCheckCircle,
                    color: 'text-gray-600 bg-gray-100',
                    label: 'Reembolsado'
                };
            default:
                return {
                    icon: FiAlertCircle,
                    color: 'text-gray-600 bg-gray-100',
                    label: status
                };
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'client_payment':
                return 'Pago de Proyecto';
            case 'subscription':
                return 'Suscripción';
            case 'commission':
                return 'Comisión';
            case 'refund':
                return 'Reembolso';
            default:
                return type;
        }
    };

    // 1. Primero filtramos
    const filteredPayments = payments.filter(payment => {
        if (filter === 'all') return true;
        return payment.status === filter;
    });

    // 2. Luego calculamos la paginación basada en el resultado del filtro
    const totalItems = filteredPayments.length; // Usar filteredPayments aquí
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;

    // 3. Obtenemos solo el segmento de la página actual
    const currentData = filteredPayments.slice(startIndex, startIndex + itemsPerPage);

    if (loading && payments.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-100">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando información de pagos...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <p>{error}</p>
                <button
                    onClick={fetchPayments}
                    className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg ">
                            <FiCreditCard className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Mis Pagos</h1>
                            <p className="text-gray-600 mt-1">
                                Revisa el historial de tus transacciones y su estado actual.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Resumen de Pagos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Tarjeta 1: Total Invertido / Pagado */}
                <div className="bg-white rounded-xl shadow p-6 border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Total Pagado</p>
                            <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.totalPaid)}</p>

                            <p className="text-xs text-gray-400 mt-1">Histórico acumulado</p>
                        </div>
                        <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                            <FiCheckCircle className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* Tarjeta 2: Cantidad de Proyectos */}
                <div className="bg-white rounded-xl shadow p-6 border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Pagos Realizados</p>
                            <p className="text-3xl font-bold text-gray-900">{stats.completedCount}</p>

                            <p className="text-xs text-gray-400 mt-1">Transacciones liquidadas</p>
                        </div>
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                            <FiCreditCard className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* Tarjeta 3: Propuesta - Monto por Pagar */}
                <div className="bg-white rounded-xl shadow p-6 border-l-4 border-yellow-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Monto Pendiente</p>
                            <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.pendingAmount)}</p>
                            <p className="text-xs text-yellow-600 mt-1">En proceso de verificación</p>
                        </div>
                        <div className="p-3 bg-yellow-100 text-yellow-600 rounded-xl">
                            <FiClock className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Historial de Pagos */}
            <div className="bg-white rounded-xl shadow">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Historial de Pagos</h2>
                            <p className="text-gray-600 mt-1">Todas tus transacciones</p>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Fecha
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tipo
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Monto
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Estado
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentData.map((payment) => {
                                const statusConfig = getStatusConfig(payment.status);
                                const StatusIcon = statusConfig.icon;

                                return (
                                    <tr key={payment._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {formatDate(payment.paidAt || payment.createdAt)}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-blue-600">
                                                {getTypeLabel(payment.type)}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-gray-900">
                                                {formatCurrency(payment.amount, payment.currency)}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                                                <StatusIcon className="w-3 h-3 mr-1" />
                                                {statusConfig.label}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
                <div className="mt-6 flex justify-between items-center bg-white p-4 rounded-xl shadow">
                    <div className="text-sm text-gray-500">
                        Mostrando {startIndex + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems} resultados
                    </div>
                    <div className="flex space-x-2">
                        <button
                            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                        >
                            Anterior
                        </button>
                        <span className="px-4 py-2 font-medium">
                            Página {currentPage} de {totalPages}
                        </span>
                        <button
                            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}