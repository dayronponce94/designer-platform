'use client';

import { useState, useEffect } from 'react';
import { adminAPI } from '@/app/lib/api/endpoints';
import Alert from '@/components/ui/Alert';
import { FiFileText, FiClock, FiCheckCircle, FiXCircle, FiEye, FiUser } from 'react-icons/fi';
import Link from 'next/link';

interface DesignerQuote {
    _id: string;
    clientQuote: { project: { title: string } };
    designer: { name: string; email: string };
    amount: number;
    deadline: string;
    status: string;
    createdAt: string;
}

export default function AdminDesignerQuotesPage() {
    const [quotes, setQuotes] = useState<DesignerQuote[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchQuotes();
    }, []);

    const fetchQuotes = async () => {
        try {
            setLoading(true);
            const response = await adminAPI.getAllDesignerQuotes();
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
        const c = config[status] || config.pending;
        return <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${c.color}`}>{c.text}</span>;
    };

    if (loading) {
        return <div className="flex justify-center items-center min-h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Cotizaciones a Diseñadores</h1>
            {error && <Alert type="error" message={error} onClose={() => setError('')} className="mb-6" />}
            <div className="bg-white rounded-xl shadow overflow-hidden">
                {quotes.length === 0 ? (
                    <div className="text-center py-12">
                        <FiFileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No hay cotizaciones para diseñadores.</p>
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proyecto</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Diseñador</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {quotes.map((q) => (
                                <tr key={q._id}>
                                    <td className="px-6 py-4 text-sm text-gray-900">{q.clientQuote?.project?.title || 'N/A'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{q.designer?.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">${q.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4">{getStatusBadge(q.status)}</td>
                                    <td className="px-6 py-4">
                                        <Link href={`/dashboard/admin/designer-quotes/${q._id}`} className="text-blue-600 hover:text-blue-900">
                                            <FiEye />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}