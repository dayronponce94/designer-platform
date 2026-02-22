'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiEye, FiFileText } from 'react-icons/fi';
import Alert from '@/components/ui/Alert';
import { Request } from '@/app/types/request';

export default function AdminRequestsPage() {
    const [requests, setRequests] = useState<Request[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/admin/requests', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setRequests(data.data.requests || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <div>Cargando...</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Solicitudes de Clientes</h1>
            {error && <Alert type="error" message={error} />}
            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Título</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Servicio</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {requests.map(req => (
                            <tr key={req._id}>
                                <td className="px-6 py-4">{req.title}</td>
                                <td className="px-6 py-4">{req.client.name}</td>
                                <td className="px-6 py-4">{req.serviceType}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs rounded-full ${req.status === 'requested' ? 'bg-yellow-100 text-yellow-800' : req.status === 'quoted' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                                        {req.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">{new Date(req.createdAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-right">
                                    <Link href={`/dashboard/admin/requests/${req._id}`} className="text-blue-600 hover:text-blue-800">
                                        <FiEye className="inline" />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}