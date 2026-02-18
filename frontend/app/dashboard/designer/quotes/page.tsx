'use client';

import { useState, useEffect } from 'react';
import { designerQuoteAPI } from '@/app/lib/api/endpoints'; // We'll add this
import Alert from '@/components/ui/Alert';
import { FiFileText, FiClock, FiCheckCircle, FiXCircle, FiEye } from 'react-icons/fi';
import Link from 'next/link';

interface DesignerQuote {
    _id: string;
    clientQuote: { project: { title: string } };
    amount: number;
    deadline: string;
    status: string;
    createdAt: string;
}

export default function DesignerQuotesPage() {
    const [quotes, setQuotes] = useState<DesignerQuote[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchQuotes();
    }, []);

    const fetchQuotes = async () => {
        try {
            setLoading(true);
            const response = await designerQuoteAPI.getMyQuotes();
            setQuotes(response.data.data.quotes || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const config: Record<string, { color: string; text: string }> = {
            pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pendiente' },
            accepted: { color: 'bg-green-100 text-green-800', text: 'Aceptada' },
            rejected: { color: 'bg-red-100 text-red-800', text: 'Rechazada' },
        };
        return <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${config[status]?.color || 'bg-gray-100 text-gray-800'}`}>{config[status]?.text || status}</span>;
    };

    if (loading) return <div className="flex justify-center items-center min-h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Mis Cotizaciones</h1>
            {error && <Alert type="error" message={error} onClose={() => setError('')} className="mb-6" />}
            <div className="bg-white rounded-xl shadow overflow-hidden">
                {quotes.length === 0 ? (
                    <div className="text-center py-12">
                        <FiFileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No tienes cotizaciones pendientes.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proyecto</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha límite</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {quotes.map((q) => (
                                    <tr key={q._id}>
                                        <td className="px-6 py-4 text-sm text-gray-900">{q.clientQuote?.project?.title || 'Proyecto'}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">${q.amount.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{q.deadline ? new Date(q.deadline).toLocaleDateString() : '—'}</td>
                                        <td className="px-6 py-4">{getStatusBadge(q.status)}</td>
                                        <td className="px-6 py-4">
                                            <Link href={`/dashboard/designer/quotes/${q._id}`} className="text-blue-600 hover:text-blue-900">
                                                <FiEye />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}