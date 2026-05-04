'use client';

import { useState, useEffect } from 'react';
import { paymentAPI } from '@/app/lib/api/endpoints';
import {
    FiDollarSign, FiUsers, FiTrendingUp, FiCheckCircle,
    FiClock, FiCreditCard, FiList, FiAlertCircle
} from 'react-icons/fi';
import { toast } from 'react-hot-toast'; // O tu sistema de notificaciones

// Interfaz para la tabla de historial (Pagos directos)
interface Payment {
    _id: string;
    user: { name: string; email: string };
    project?: { title: string };
    amount: number;
    type: string;
    status: string;
    createdAt: string;
}

// Interfaz para la tabla de Proyectos (Gestión de liquidación)
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
    const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
    const [payments, setPayments] = useState<Payment[]>([]);
    const [pendingProjects, setPendingProjects] = useState<PendingProject[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [paymentsRes, statsRes, pendingRes] = await Promise.all([
                paymentAPI.adminGetAllPayments(),
                paymentAPI.adminGetPlatformStats(),
                paymentAPI.adminGetPendingDesignerPayouts()
            ]);
            setPayments(paymentsRes.data.data.payments);
            setStats(statsRes.data.data);
            setPendingProjects(pendingRes.data.data.projects);
        } catch (error) {
            console.error("Error cargando datos:", error);
            toast.error("Error al cargar la información de pagos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handlePayDesigner = async (designerQuoteId: string) => {
        if (!confirm('¿Estás seguro de transferir los fondos a este diseñador?')) return;

        setProcessingId(designerQuoteId);
        try {
            await paymentAPI.adminPayDesigner(designerQuoteId);
            toast.success("Pago transferido exitosamente");
            // Refrescamos todo para actualizar estados y estadísticas
            await fetchData();
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || "Error al procesar el pago";
            toast.error(errorMsg);
        } finally {
            setProcessingId(null);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
    };

    if (loading && !stats) return <div className="text-center py-10 italic">Cargando panel de control...</div>;

    return (
        <div className="space-y-6">
            {/* Header (Mantenido) */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                        <FiCreditCard className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Pagos de la Plataforma</h1>
                        <p className="text-gray-600">Gestión de liquidaciones a diseñadores e historial de ingresos.</p>
                    </div>
                </div>
            </div>

            {/* Tarjetas de estadísticas (Sin cambios según pedido) */}
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

            {/* Sistema de Pestañas */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'pending'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        <FiClock /> Pendientes de Liquidar
                        {pendingProjects.length > 0 && (
                            <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs">
                                {pendingProjects.length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'history'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        <FiList /> Historial de Transacciones
                    </button>
                </nav>
            </div>

            {/* Contenido de las Pestañas */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
                {activeTab === 'pending' ? (
                    /* TABLA DE PENDIENTES */
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proyecto / Diseñador</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado Stripe</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">A pagar</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {pendingProjects.length === 0 ? (
                                    <tr><td colSpan={4} className="px-6 py-10 text-center text-gray-500 italic">No hay pagos pendientes a diseñadores.</td></tr>
                                ) : (
                                    pendingProjects.map((p) => (
                                        <tr key={p._id}>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-bold text-gray-900">{p.title}</div>
                                                <div className="text-xs text-gray-500">{p.designer.name} ({p.designer.email})</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs rounded-full ${p.designer.stripeAccountStatus === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {p.designer.stripeAccountStatus === 'active' ? 'Cuenta Conectada' : 'Sin Stripe Configurado'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold text-blue-600">
                                                {formatCurrency(p.designerView.earnings)}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => handlePayDesigner(p.designerQuote)}
                                                    disabled={processingId === p.designerQuote || p.designer.stripeAccountStatus !== 'active'}
                                                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${p.designer.stripeAccountStatus === 'active'
                                                            ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300'
                                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                        }`}
                                                >
                                                    {processingId === p.designerQuote ? 'Procesando...' : 'Pagar Ahora'}
                                                </button>
                                                {p.designer.stripeAccountStatus !== 'active' && (
                                                    <p className="text-[10px] text-red-500 mt-1">El diseñador debe configurar su cuenta</p>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    /* TABLA DE HISTORIAL (Tu tabla anterior mejorada) */
                    <div className="overflow-x-auto">
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
                                {payments.length === 0 ? (
                                    <tr><td colSpan={6} className="px-6 py-10 text-center text-gray-500 italic">No hay historial de transacciones.</td></tr>
                                ) : (
                                    payments.map((payment) => (
                                        <tr key={payment._id}>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {new Date(payment.createdAt).toLocaleDateString('es-ES')}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900">{payment.user?.name}</div>
                                                <div className="text-xs text-gray-500">{payment.user?.email}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{payment.project?.title || '-'}</td>
                                            <td className="px-6 py-4 text-sm font-bold">{formatCurrency(payment.amount)}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs rounded-full ${payment.type === 'client_payment' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}`}>
                                                    {payment.type === 'client_payment' ? 'Ingreso Cliente' : 'Pago Diseñador'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`flex items-center gap-1 text-sm ${payment.status === 'succeeded' ? 'text-green-600' : 'text-yellow-600'}`}>
                                                    {payment.status === 'succeeded' ? <FiCheckCircle /> : <FiClock />}
                                                    {payment.status === 'succeeded' ? 'Completado' : 'Pendiente'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}