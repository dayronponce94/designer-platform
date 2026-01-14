'use client';

import { FiCalendar, FiClock, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

export default function DesignerDeadlinesPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">
                            <FiCalendar className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Mis Plazos</h1>
                            <p className="text-gray-600 mt-1">
                                Fechas de entrega de proyectos asignados
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contenido placeholder */}
            <div className="bg-white rounded-xl shadow p-8 text-center">
                <FiCalendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                    No hay plazos próximos
                </h3>
                <p className="text-gray-600 mb-4">
                    Aquí aparecerán las fechas de entrega de tus proyectos asignados.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                    <div className="p-4 bg-blue-50 rounded-lg">
                        <FiClock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <div className="font-medium text-gray-900">Próximos</div>
                        <div className="text-sm text-gray-500">Sin fechas</div>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg">
                        <FiAlertCircle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                        <div className="font-medium text-gray-900">Urgentes</div>
                        <div className="text-sm text-gray-500">Sin fechas</div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                        <FiCheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <div className="font-medium text-gray-900">Completados</div>
                        <div className="text-sm text-gray-500">Sin fechas</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <FiCalendar className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                        <div className="font-medium text-gray-900">Total</div>
                        <div className="text-sm text-gray-500">Sin fechas</div>
                    </div>
                </div>
            </div>
        </div>
    );
}