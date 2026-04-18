'use client';

import { useEffect, useState } from 'react';
import { paymentAPI } from '@/app/lib/api/endpoints';
import { FiDollarSign, FiTrendingUp, FiCalendar } from 'react-icons/fi';

interface DesignerPayment {
    _id: string;
    amount: number;
    paidAt: string;
    project?: {
        title: string;
    };
}

export default function DesignerEarningsPage() {
    const [payments, setPayments] = useState<DesignerPayment[]>([]);
    const [totalEarned, setTotalEarned] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEarnings = async () => {
            try {
                const res = await paymentAPI.getPayments({ type: 'designer_payout' });
                const payouts = res.data.data.payments;
                setPayments(payouts);
                const total = payouts.reduce((sum: number, p: any) => sum + p.amount, 0);
                setTotalEarned(total);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchEarnings();
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(amount);
    };

    if (loading) return <div className="text-center py-10">Cargando...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                    <FiDollarSign className="w-6 h-6" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Mis Ingresos</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow p-6">
                    <p className="text-sm text-gray-500">Total Ganado</p>
                    <p className="text-3xl font-bold">{formatCurrency(totalEarned)}</p>
                </div>
                <div className="bg-white rounded-xl shadow p-6">
                    <p className="text-sm text-gray-500">Pagos Recibidos</p>
                    <p className="text-3xl font-bold">{payments.length}</p>
                </div>
                <div className="bg-white rounded-xl shadow p-6">
                    <p className="text-sm text-gray-500">Próximo Pago</p>
                    <p className="text-3xl font-bold">--</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold">Historial de Pagos</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proyecto</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map((p) => (
                                <tr key={p._id}>
                                    <td className="px-6 py-4 text-sm">{p.paidAt ? new Date(p.paidAt).toLocaleDateString() : 'Pendiente'}</td>
                                    <td className="px-6 py-4 text-sm">{p.project?.title || 'Proyecto'}</td>
                                    <td className="px-6 py-4 text-sm font-bold">{formatCurrency(p.amount)}</td>
                                </tr>
                            ))}
                            {payments.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="text-center py-8 text-gray-500">Aún no has recibido pagos.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}