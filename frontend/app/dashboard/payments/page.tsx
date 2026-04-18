'use client';

import { useState } from 'react';
import { usePayments } from '@/app/lib/hooks/usePayments';
import { FiDollarSign, FiCreditCard, FiCalendar, FiCheckCircle, FiClock, FiAlertCircle, FiDownload, FiPlus, FiFilter } from 'react-icons/fi';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import PaymentModal from '@/components/modals/PaymentModal';
import PaymentStatsChart from '@/components/payments/PaymentStatsChart';

export default function PaymentsPage() {
    const { payments, summary, loading, error, fetchPayments } = usePayments();
    const [selectedQuote, setSelectedQuote] = useState<{ id: string, amount: number, description: string } | null>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [filter, setFilter] = useState<string>('all');

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
            case 'completed':
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
            case 'project_payment':
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

    const filteredPayments = payments.filter(payment => {
        if (filter === 'all') return true;
        if (filter === 'pending') return payment.status === 'pending';
        if (filter === 'completed') return payment.status === 'completed';
        if (filter === 'failed') return payment.status === 'failed';
        return true;
    });

    const handlePayNow = (payment: any) => {
        setSelectedQuote({
            id: payment.quoteId || payment._id,
            amount: payment.amount,
            description: payment.projectId?.title || payment.description || 'Pago de servicio de diseño'
        });
        setShowPaymentModal(true);
    };

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
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <FiCreditCard className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Mis Pagos</h1>
                            <p className="text-gray-600 mt-1">
                                Gestiona tus transacciones y métodos de pago
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Resumen de Pagos */}
            {summary && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Pagado</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    {formatCurrency(summary.totalPaid)}
                                </p>
                                <p className="text-sm text-green-600 mt-1">
                                    +12% vs mes anterior
                                </p>
                            </div>
                            <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                                <FiCheckCircle className="w-6 h-6" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Pendientes</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    {formatCurrency(summary.pendingAmount)}
                                </p>
                                <p className="text-sm text-yellow-600 mt-1">
                                    {summary.upcomingPayments} pagos próximos
                                </p>
                            </div>
                            <div className="p-3 bg-yellow-100 text-yellow-600 rounded-xl">
                                <FiClock className="w-6 h-6" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Próximo Pago</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    {summary.upcomingPayments > 0 ? formatCurrency(3200) : 'N/A'}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    Vence {summary.upcomingPayments > 0 ? '05 Mar' : 'No hay pagos'}
                                </p>
                            </div>
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                                <FiCalendar className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Gráfico de estadísticas */}
            {summary && <PaymentStatsChart stats={summary.paymentStats} />}

            {/* Historial de Pagos */}
            <div className="bg-white rounded-xl shadow">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Historial de Pagos</h2>
                            <p className="text-gray-600 mt-1">Todas tus transacciones</p>
                        </div>

                        <div className="flex items-center space-x-2">
                            <div className="relative">
                                <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <select
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="all">Todos los pagos</option>
                                    <option value="pending">Pendientes</option>
                                    <option value="completed">Completados</option>
                                    <option value="failed">Fallidos</option>
                                </select>
                            </div>
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
                                    Descripción
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Monto
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Estado
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredPayments.map((payment) => {
                                const statusConfig = getStatusConfig(payment.status);
                                const StatusIcon = statusConfig.icon;

                                return (
                                    <tr key={payment._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {formatDate(payment.paidAt || payment.createdAt)}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {payment.type && getTypeLabel(payment.type)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {payment.projectId?.title || payment.description}
                                            </div>
                                            {payment.projectId && (
                                                <div className="text-xs text-gray-500">
                                                    {payment.description}
                                                </div>
                                            )}
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
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                {payment.invoiceUrl && (
                                                    <a
                                                        href={payment.invoiceUrl}
                                                        className="text-blue-600 hover:text-blue-900 flex items-center"
                                                    >
                                                        <FiDownload className="mr-1" />
                                                        Factura
                                                    </a>
                                                )}
                                                {payment.status === 'pending' && (
                                                    <button
                                                        onClick={() => handlePayNow(payment)}
                                                        className="text-green-600 hover:text-green-900"
                                                    >
                                                        Pagar ahora
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {filteredPayments.length === 0 && (
                    <div className="text-center py-12">
                        <FiDollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-900 mb-2">
                            No hay pagos {filter !== 'all' ? 'con este filtro' : ''}
                        </h3>
                        <p className="text-gray-500">
                            {filter !== 'all'
                                ? 'Intenta con otro filtro o crea un nuevo pago.'
                                : 'Comienza realizando tu primer pago.'
                            }
                        </p>
                    </div>
                )}
            </div>

            {/* Modal de Pago */}
            {showPaymentModal && selectedQuote && (
                <PaymentModal
                    quoteId={selectedQuote.id}
                    amount={selectedQuote.amount}
                    description={selectedQuote.description}
                    onClose={() => {
                        setShowPaymentModal(false);
                        setSelectedQuote(null);
                    }}
                    onSuccess={() => {
                        fetchPayments();
                        setShowPaymentModal(false);
                        setSelectedQuote(null);
                    }}
                />
            )}
        </div>
    );
}