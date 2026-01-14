'use client';

import { FiDollarSign, FiTrendingUp, FiCalendar, FiFilter } from 'react-icons/fi';

export default function DesignerEarningsPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                            <FiDollarSign className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Mis Ingresos</h1>
                            <p className="text-gray-600 mt-1">
                                Resumen de pagos recibidos y comisiones
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <FiFilter className="text-gray-400" />
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option>Este mes</option>
                        <option>Mes anterior</option>
                        <option>Últimos 3 meses</option>
                        <option>Este año</option>
                    </select>
                </div>
            </div>

            {/* Contenido placeholder */}
            <div className="bg-white rounded-xl shadow p-8 text-center">
                <FiDollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                    Próximamente: Panel de Ingresos
                </h3>
                <p className="text-gray-600 mb-4">
                    Esta sección estará disponible cuando implementemos el sistema de pagos con Stripe.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900 mb-2">$0</div>
                        <div className="text-sm text-gray-500">Ingresos totales</div>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900 mb-2">0</div>
                        <div className="text-sm text-gray-500">Pagos recibidos</div>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900 mb-2">$0</div>
                        <div className="text-sm text-gray-500">Próximo pago</div>
                    </div>
                </div>
            </div>
        </div>
    );
}