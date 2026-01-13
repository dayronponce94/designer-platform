'use client';

import { FiTrendingUp } from 'react-icons/fi';

interface PaymentStatsChartProps {
    stats: {
        month: string;
        total: number;
    }[];
}

export default function PaymentStatsChart({ stats }: PaymentStatsChartProps) {
    const maxAmount = Math.max(...stats.map(s => s.total));

    return (
        <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Historial de Ingresos</h2>
                    <p className="text-gray-600 mt-1">Evolución de tus pagos por mes</p>
                </div>
                <div className="flex items-center text-green-600">
                    <FiTrendingUp className="mr-2" />
                    <span className="font-medium">+15% este trimestre</span>
                </div>
            </div>

            <div className="flex items-end h-48 space-x-4 pt-4">
                {stats.map((stat, index) => {
                    const height = maxAmount > 0 ? (stat.total / maxAmount) * 100 : 0;

                    return (
                        <div key={index} className="flex-1 flex flex-col items-center">
                            <div className="text-xs text-gray-500 mb-2">{stat.month}</div>
                            <div className="relative w-full flex justify-center">
                                <div
                                    className="w-3/4 bg-linear-to-t from-blue-500 to-blue-600 rounded-t-lg transition-all hover:opacity-90"
                                    style={{ height: `${height}%` }}
                                >
                                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-sm font-medium bg-gray-900 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        ${stat.total}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-2 text-sm font-medium">
                                ${stat.total}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                    <p>Los montos mostrados son en USD. Los datos se actualizan automáticamente.</p>
                </div>
            </div>
        </div>
    );
}