'use client';

import { useState, useEffect } from 'react';
import { paymentAPI } from '@/app/lib/api/endpoints';
import { FiDollarSign, FiUsers, FiTrendingUp, FiCheckCircle, FiClock, FiCreditCard } from 'react-icons/fi';

interface Payment {
    _id: string;
    user: { name: string; email: string };
    project?: { title: string };
    amount: number;
    type: string;
    status: string;
    paidAt?: string;
    createdAt: string;
}

export default function AdminPaymentsPage() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [paymentsRes, statsRes] = await Promise.all([
                    paymentAPI.adminGetAllPayments(),
                    paymentAPI.adminGetPlatformStats(),
                ]);
                setPayments(paymentsRes.data.data.payments);
                setStats(statsRes.data.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(amount);
    };

    if (loading) return <div className="text-center py-10">Cargando...</div>;

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
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                Pagos de la Plataforma
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Revisa y gestiona todas las transacciones realizadas en la plataforma.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tarjetas de estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Recaudado</p>
                            <p className="text-3xl font-bold">{formatCurrency(stats?.totalCollected || 0)}</p>
                        </div>
                        <FiDollarSign className="w-8 h-8 text-green-600" />
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Pagado a Diseñadores</p>
                            <p className="text-3xl font-bold">{formatCurrency(stats?.totalPaidToDesigners || 0)}</p>
                        </div>
                        <FiUsers className="w-8 h-8 text-blue-600" />
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Comisiones (10%)</p>
                            <p className="text-3xl font-bold">{formatCurrency(stats?.platformFees || 0)}</p>
                        </div>
                        <FiTrendingUp className="w-8 h-8 text-purple-600" />
                    </div>
                </div>
            </div>

            {/* Tabla de pagos */}
            {payments.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    No se encontraron transacciones registradas.
                </div>
            ) : (
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proyecto</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {payments.map((payment) => (
                            <tr key={payment._id}>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    {new Date(payment.createdAt).toLocaleString('es-ES', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    {payment.user?.name} <br />
                                    <span className="text-xs text-gray-500">{payment.user?.email}</span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">{payment.project?.title || '-'}</td>
                                <td className="px-6 py-4 text-sm font-bold">{formatCurrency(payment.amount)}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs rounded-full ${payment.type === 'client_payment' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                        {payment.type === 'client_payment' ? 'Cliente' : 'Pago a diseñador'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`flex items-center gap-1 ${payment.status === 'succeeded' ? 'text-green-600' : 'text-yellow-600'}`}>
                                        {payment.status === 'succeeded' ? <FiCheckCircle /> : <FiClock />}
                                        {payment.status === 'succeeded' ? 'Completado' : 'Pendiente'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div >
    );
}