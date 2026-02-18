'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { designerQuoteAPI } from '@/app/lib/api/endpoints';
import Alert from '@/components/ui/Alert';
import ConfirmModal from '@/components/modals/ConfirmModal';
import { FiArrowLeft, FiDollarSign, FiCalendar, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';

export default function DesignerQuoteDetailPage() {
    const params = useParams();
    const router = useRouter();
    const quoteId = params.id as string;

    const [quote, setQuote] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const [showAcceptModal, setShowAcceptModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [notes, setNotes] = useState('');

    useEffect(() => {
        fetchQuote();
    }, [quoteId]);

    const fetchQuote = async () => {
        try {
            setLoading(true);
            const response = await designerQuoteAPI.getQuoteById(quoteId);
            setQuote(response.data.data.quote);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async () => {
        setActionLoading(true);
        try {
            await designerQuoteAPI.acceptQuote(quoteId, notes);
            setShowAcceptModal(false);
            fetchQuote();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async () => {
        setActionLoading(true);
        try {
            await designerQuoteAPI.rejectQuote(quoteId, notes);
            setShowRejectModal(false);
            fetchQuote();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center min-h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
    if (!quote) return <div>No encontrada</div>;

    return (
        <div>
            <button onClick={() => router.back()} className="flex items-center text-gray-600 hover:text-gray-900 mb-6">
                <FiArrowLeft className="mr-2" /> Volver
            </button>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-900">Cotización para {quote.clientQuote?.project?.title}</h1>
                    <p className="text-gray-500 mt-1">ID: {quote._id}</p>
                </div>

                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Monto</p>
                            <p className="text-xl font-semibold flex items-center"><FiDollarSign className="mr-1" />${quote.amount.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Fecha límite</p>
                            <p className="flex items-center"><FiCalendar className="mr-2" />{new Date(quote.deadline).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500 mb-2">Descripción</p>
                        <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-line">{quote.description}</div>
                    </div>

                    {quote.adminNotes && (
                        <div>
                            <p className="text-sm text-gray-500 mb-2">Notas del administrador</p>
                            <div className="bg-blue-50 p-4 rounded-lg">{quote.adminNotes}</div>
                        </div>
                    )}

                    {quote.status === 'pending' && (
                        <div className="flex space-x-4">
                            <button onClick={() => setShowAcceptModal(true)} className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 flex items-center justify-center">
                                <FiCheckCircle className="mr-2" /> Aceptar
                            </button>
                            <button onClick={() => setShowRejectModal(true)} className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 flex items-center justify-center">
                                <FiXCircle className="mr-2" /> Rechazar
                            </button>
                        </div>
                    )}

                    {quote.status === 'accepted' && (
                        <div className="bg-green-50 p-4 rounded-lg text-green-700 flex items-center">
                            <FiCheckCircle className="mr-2" /> Aceptaste esta cotización. Se ha creado un proyecto en tu área.
                        </div>
                    )}
                    {quote.status === 'rejected' && (
                        <div className="bg-red-50 p-4 rounded-lg text-red-700 flex items-center">
                            <FiXCircle className="mr-2" /> Rechazaste esta cotización.
                        </div>
                    )}
                </div>
            </div>

            <ConfirmModal
                isOpen={showAcceptModal}
                onClose={() => setShowAcceptModal(false)}
                onConfirm={handleAccept}
                title="Aceptar cotización"
                message={
                    <div>
                        <p className="mb-4">Al aceptar, se creará un proyecto en tu panel. Puedes agregar notas.</p>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Notas (opcional)"
                            className="w-full px-3 py-2 border rounded-lg"
                            rows={3}
                        />
                    </div>
                }
                confirmText={actionLoading ? 'Aceptando...' : 'Sí, aceptar'}
                cancelText="Cancelar"
                type="success"
            />

            <ConfirmModal
                isOpen={showRejectModal}
                onClose={() => setShowRejectModal(false)}
                onConfirm={handleReject}
                title="Rechazar cotización"
                message={
                    <div>
                        <p className="mb-4">¿Estás seguro? Puedes indicar el motivo.</p>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Motivo (opcional)"
                            className="w-full px-3 py-2 border rounded-lg"
                            rows={3}
                        />
                    </div>
                }
                confirmText={actionLoading ? 'Rechazando...' : 'Sí, rechazar'}
                cancelText="Cancelar"
                type="danger"
            />
        </div>
    );
}