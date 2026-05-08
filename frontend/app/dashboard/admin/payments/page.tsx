'use client';

import { useState, useEffect } from 'react';
import { paymentAPI } from '@/app/lib/api/endpoints';
import {
    FiDollarSign, FiUsers, FiTrendingUp, FiCheckCircle,
    FiClock, FiCreditCard, FiList, FiSend
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';

// Interfaces 
interface Payment {
    _id: string;
    user: { _id: string; name: string; email: string };
    amount: number;
    type: string;
    status: string;
    createdAt: string;
    quote?: {
        _id: string;
        description: string;
        request?: {
            _id: string;
            title: string;
        };
    };
}

interface PendingProject {
    _id: string;
    title: string;
    designer: {
        _id: string;
        name: string;
        email: string;
        stripeAccountStatus: string
    };
    designerQuote: string;
    designerView: {
        earnings: number;
        isPaidToDesigner: boolean;
        paidAt?: string;
    };
    status: string;
}

export default function AdminPaymentsPage() {
    const [activeTab, setActiveTab] = useState<'pending' | 'history' | 'payouts'>('pending');
    const [payments, setPayments] = useState<Payment[]>([]);
    const [allProjects, setAllProjects] = useState<PendingProject[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [projectToPay, setProjectToPay] = useState<PendingProject | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [paymentsRes, statsRes, pendingRes, completedRes] = await Promise.all([
                paymentAPI.adminGetAllPayments(),
                paymentAPI.adminGetPlatformStats(),
                paymentAPI.adminGetPendingDesignerPayouts(),
                paymentAPI.adminGetCompletedDesignerPayouts()
            ]);

            setPayments(paymentsRes.data.data.payments);
            setStats(statsRes.data.data);
            setAllProjects([...pendingRes.data.data.projects, ...completedRes.data.data.projects]);
        } catch (error) {
            console.error("Error cargando datos:", error);
            toast.error("Error al cargar la información de pagos");
            // Opcional: setStats({}) para evitar que se quede bloqueado
        } finally {
            setLoading(false);
        }
    };
    const pendingPayouts = allProjects.filter(p =>
        p.designerView && p.designerView.isPaidToDesigner === false
    );

    const completedPayouts = allProjects
        .filter(p => p.designerView && p.designerView.isPaidToDesigner === true)
        .sort((a, b) => {
            // Manejo de seguridad si paidAt no existe por alguna razón
            const dateA = a.designerView?.paidAt ? new Date(a.designerView.paidAt).getTime() : 0;
            const dateB = b.designerView?.paidAt ? new Date(b.designerView.paidAt).getTime() : 0;
            return dateB - dateA;
        });


    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
    };

    const executePayment = async () => {
        if (!projectToPay) return;
        const currentQuoteId = projectToPay.designerQuote;
        setProcessingId(currentQuoteId);

        try {
            await paymentAPI.adminPayDesigner(currentQuoteId);
            toast.success("Pago enviado con éxito");
            setProjectToPay(null);
            await fetchData();
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Error inesperado al procesar el pago";
            if (errorMessage.includes("insufficient available funds")) {
                toast.error("Plataforma sin saldo suficiente en Stripe.");
            } else {
                toast.error(`Error: ${errorMessage}`);
            }
            setProjectToPay(null);
        } finally {
            setProcessingId(null);
        }
    };

    if (loading && !stats) {
        return (
            <div className="flex flex-col items-center justify-center py-20 italic text-gray-500">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                Cargando panel de control...
            </div>
        );
    }

    // Obtener la lista correcta según la pestaña
    const getActiveListData = () => {
        if (activeTab === 'pending') return pendingPayouts;
        if (activeTab === 'payouts') return completedPayouts;
        // Para 'history', filtramos por tipo como hacías en el map
        return payments.filter(p => p.type === "client_payment");
    };

    const activeList = getActiveListData();

    // Cálculos de paginación
    const totalItems = activeList.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = activeList.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                        <FiCreditCard className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Pagos de la Plataforma</h1>
                        <p className="text-gray-600">Gestión de liquidaciones e historial financiero.</p>
                    </div>
                </div>
            </div>

            {/* Tarjetas de Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Recaudado</p>
                            <p className="text-3xl font-bold">{formatCurrency(stats?.totalCollected || 0)}</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-full">
                            <FiDollarSign className="w-8 h-8 text-green-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Pagado a Diseñadores</p>
                            <p className="text-3xl font-bold">{formatCurrency(stats?.totalPaidToDesigners || 0)}</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-full">
                            <FiUsers className="w-8 h-8 text-blue-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Ganancias de la Plataforma</p>
                            <p className="text-3xl font-bold">{formatCurrency(stats?.platformEarnings || 0)}</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-full">
                            <FiTrendingUp className="w-8 h-8 text-purple-600" />
                        </div>
                    </div>
                    <p className="mt-2 text-[10px] text-gray-400 italic">
                        * No incluye comisiones de Stripe
                    </p>
                </div>
            </div>

            {/* Sistema de Pestañas Actualizado */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'pending' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:border-gray-300'}`}
                    >
                        <FiClock /> Pendientes de Liquidar
                        {pendingPayouts.length > 0 && (
                            <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs">
                                {pendingPayouts.length}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={() => setActiveTab('payouts')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'payouts' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:border-gray-300'}`}
                    >
                        <FiSend /> Liquidaciones Realizadas
                    </button>

                    <button
                        onClick={() => setActiveTab('history')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'history' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:border-gray-300'}`}
                    >
                        <FiList /> Historial de Ingresos
                    </button>
                </nav>
            </div>

            {/* Contenido de las Pestañas */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
                {activeTab === 'pending' ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase italic">Proyecto / Diseñador</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase italic">Estado Stripe</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase italic">A pagar</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase italic">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {currentData.length === 0 ? (
                                    <tr><td colSpan={4} className="px-6 py-10 text-center text-gray-500 italic">No hay pagos pendientes.</td></tr>
                                ) : (
                                    currentData.map((p: any) => (
                                        <tr key={p._id}>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-bold text-gray-900">{p.title}</div>
                                                <div className="text-xs text-gray-500">{p.designer.name}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs rounded-full ${p.designer.stripeAccountStatus === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {p.designer.stripeAccountStatus === 'active' ? 'Conectado' : 'Sin configurar'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold text-blue-600">{formatCurrency(p.designerView.earnings)}</td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => setProjectToPay(p)}
                                                    disabled={processingId === p.designerQuote || p.designer.stripeAccountStatus !== 'active'}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 disabled:bg-gray-300"
                                                >
                                                    Pagar Ahora
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : activeTab === 'payouts' ? (
                    /* TABLA DE LIQUIDACIONES REALIZADAS (LIFO) */
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase italic">Fecha de Pago</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase italic">Diseñador</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase italic">Proyecto</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase italic">Monto Pagado</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase italic">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {currentData.length === 0 ? (
                                    <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-500 italic">Aún no se han registrado pagos a diseñadores.</td></tr>
                                ) : (
                                    currentData.map((p: any) => (
                                        <tr key={p._id}>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {p.designerView.paidAt
                                                    ? new Date(p.designerView.paidAt).toLocaleString('es-ES', {
                                                        day: '2-digit',
                                                        month: 'long',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })
                                                    : '---'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900">{p.designer.name}</div>
                                                <div className="text-xs text-gray-500">{p.designer.email}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{p.title}</td>
                                            <td className="px-6 py-4 text-sm font-bold text-green-600">{formatCurrency(p.designerView.earnings)}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    <FiCheckCircle /> Transferido
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    /* HISTORIAL DE INGRESOS (Tu tabla original) */
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase italic">Fecha</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase italic">Usuario</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase italic">Proyecto</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase italic">Monto</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase italic">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {currentData.map((payment: any) => (
                                    <tr key={payment._id}>
                                        <td className="px-6 py-4 text-sm text-gray-600">{new Date(payment.createdAt).toLocaleString('es-ES', {
                                            day: '2-digit',
                                            month: 'long',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{payment.user?.name}</div>
                                            <div className="text-xs text-gray-500">{payment.user?.email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{payment.quote?.request?.title || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold">{formatCurrency(payment.amount)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`flex items-center gap-1 text-sm ${payment.status === 'succeeded' ? 'text-green-600' : 'text-yellow-600'}`}>
                                                {payment.status === 'succeeded' ? <FiCheckCircle /> : <FiClock />}
                                                {payment.status === 'succeeded' ? 'Completado' : 'Pendiente'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
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

            {/* Modal de Confirmación */}
            {projectToPay && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-blue-100 rounded-full">
                            <FiDollarSign className="w-6 h-6 text-blue-600" />
                        </div>

                        <div className="mt-4 text-center">
                            <h3 className="text-xl font-bold text-gray-900">Confirmar Transferencia</h3>
                            <p className="mt-2 text-sm text-gray-500">
                                Estás a punto de enviar <span className="font-bold text-gray-900">{formatCurrency(projectToPay.designerView.earnings)}</span> a
                                <span className="block font-medium text-blue-600">{projectToPay.designer.name}</span>
                                por el proyecto: <span className="italic">"{projectToPay.title}"</span>
                            </p>
                        </div>

                        <div className="mt-6 flex flex-col gap-3">
                            <button
                                onClick={executePayment}
                                disabled={processingId !== null}
                                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {processingId ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Procesando envío...
                                    </>
                                ) : 'Sí, confirmar pago'}
                            </button>

                            <button
                                onClick={() => setProjectToPay(null)}
                                disabled={processingId !== null}
                                className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold rounded-xl transition-all"
                            >
                                Cancelar
                            </button>
                        </div>

                        <p className="mt-4 text-[10px] text-center text-gray-400 uppercase tracking-widest">
                            Seguridad Stripe Connect activada
                        </p>
                    </div>
                </div>
            )}

        </div>
    );
}