'use client';

import { useEffect, useState } from 'react';
import { paymentAPI } from '@/app/lib/api/endpoints';
import {
    FiDollarSign,
    FiTrendingUp,
    FiCalendar,
    FiPieChart,
    FiCheckCircle
} from 'react-icons/fi';

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

    // Estados para paginación
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchEarnings = async () => {
            try {
                const res = await paymentAPI.getPayments({ type: 'designer_payout' });
                const payouts = res.data.data.payments;
                // Ordenar por fecha (más reciente primero)
                const sortedPayouts = payouts.sort((a: any, b: any) =>
                    new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime()
                );
                setPayments(sortedPayouts);
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
        return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
    };

    // Lógica de Paginación
    const totalItems = payments.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = payments.slice(startIndex, startIndex + itemsPerPage);

    // Cálculo de promedio
    const averageEarning = payments.length > 0 ? totalEarned / payments.length : 0;

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 italic text-gray-500">
                <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                Cargando tus ingresos...
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                    <FiDollarSign className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Mis Ingresos</h1>
                    <p className="text-gray-500 text-sm">Resumen de tus ganancias y liquidaciones.</p>
                </div>
            </div>

            {/* Tarjetas de Estadísticas Mejoradas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-between border-l-4 border-green-500">
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Ganado</p>
                        <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalEarned)}</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-full">
                        <FiTrendingUp className="w-8 h-8 text-green-600" />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-between border-l-4 border-blue-500">
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Pagos Recibidos</p>
                        <p className="text-3xl font-bold text-gray-900">{payments.length}</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-full">
                        <FiCheckCircle className="w-8 h-8 text-blue-600" />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-between border-l-4 border-purple-500">
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Promedio por Proyecto</p>
                        <p className="text-3xl font-bold text-gray-900">{formatCurrency(averageEarning)}</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-full">
                        <FiPieChart className="w-8 h-8 text-purple-600" />
                    </div>
                </div>
            </div>

            {/* Tabla de Historial */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                    <FiCalendar className="text-gray-400" />
                    <h2 className="text-lg font-bold text-gray-800">Historial de Liquidaciones</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider italic">Fecha</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider italic">Proyecto</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider italic">Estado</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider italic">Monto Neto</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentData.length > 0 ? (
                                currentData.map((p) => (
                                    <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {p.paidAt ? new Date(p.paidAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }) : '---'}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            {p.project?.title || 'Proyecto Finalizado'}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className="flex items-center gap-1 text-green-600 font-medium">
                                                <FiCheckCircle className="w-4 h-4" /> Pagado
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-900">
                                            {formatCurrency(p.amount)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="text-center py-12 text-gray-500 italic">
                                        No se han encontrado registros de pagos.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
                <div className="mt-6 flex justify-between items-center">
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