'use client';

import { useState, useEffect } from 'react';
import { adminAPI } from '@/app/lib/api/endpoints';
import { FiX } from 'react-icons/fi';

interface Designer {
    _id: string;
    name: string;
    email: string;
    specialty: string;
}

interface Props {
    quote: any;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateDesignerQuoteModal({ quote, onClose, onSuccess }: Props) {
    const [designers, setDesigners] = useState<Designer[]>([]);
    const [selectedDesigner, setSelectedDesigner] = useState('');
    const [amount, setAmount] = useState<string>(quote.amount ? String(quote.amount) : '');
    const [deadline, setDeadline] = useState(quote.deadline ? quote.deadline.split('T')[0] : '');
    const [description, setDescription] = useState(quote.description);
    const [adminNotes, setAdminNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDesigners = async () => {
            try {
                const response = await adminAPI.getAllUsers({ role: 'designer', isActive: true, isVerified: true });
                setDesigners(response.data.data.users || []);
            } catch (err) {
                console.error('Error fetching designers:', err);
            }
        };
        fetchDesigners();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDesigner || !amount || !deadline || !description) {
            setError('Por favor completa todos los campos obligatorios');
            return;
        }

        setLoading(true);
        setError('');
        try {
            await adminAPI.createDesignerQuote(quote._id, {
                designerId: selectedDesigner,
                amount,
                deadline: new Date(deadline).toISOString(),
                description,
                adminNotes,
            });
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al crear cotización');
        } finally {
            setLoading(false);
        }
    };

    const SPECIALTY_LABELS: Record<string, string> = {
        branding: 'Diseño de Marca',
        'ux-ui': 'Diseño UX/UI',
        graphic: 'Diseño Gráfico',
        web: 'Diseño Web',
        motion: 'Animación Gráfica',
        illustration: 'Ilustración',
        other: 'Otra Especialidad'
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Asignar a diseñador</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <FiX size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Proyecto *
                        </label>
                        <input
                            type="text"
                            value={quote.request.title}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Diseñador *
                        </label>
                        <select
                            value={selectedDesigner}
                            onChange={(e) => setSelectedDesigner(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Seleccionar diseñador</option>
                            {designers.map((d) => (
                                <option key={d._id} value={d._id}>
                                    {d.name} - {SPECIALTY_LABELS[d.specialty] || d.specialty}
                                </option>
                            ))}
                        </select>
                        {designers.length === 0 && (
                            <p className="text-xs text-amber-600 mt-1">
                                No hay diseñadores verificados disponibles actualmente.
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Monto para el diseñador (USD) *
                        </label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Fecha límite *
                        </label>
                        <input
                            type="date"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Descripción del trabajo *
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Detalla las tareas a realizar para que el diseñador tenga claro lo que se espera de él."
                            maxLength={2000}
                        />
                        <div className="flex justify-between items-center mt-2">
                            <p className="text-xs text-gray-500">
                                {description.length}/2000 caracteres
                            </p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Notas internas (opcional)
                        </label>
                        <textarea
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Notas que verá el diseñador, como detalles adicionales o instrucciones específicas."
                            maxLength={500}
                        />
                        <div className="flex justify-between items-center mt-2">
                            <p className="text-xs text-gray-500">
                                {adminNotes.length}/500 caracteres
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Creando...' : 'Crear cotización'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}