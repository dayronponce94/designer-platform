'use client';

import { useState, useEffect } from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { FiX, FiCreditCard, FiLock, FiCheck } from 'react-icons/fi';
import { usePayments } from '@/app/lib/hooks/usePayments';
import { useAuth } from '@/app/lib/hooks/useAuth';

const getStripe = () => {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!key) {
        console.error("Stripe Publishable Key no encontrada en .env.local");
        return null;
    }
    return loadStripe(key);
};
const stripePromise = getStripe();

interface PaymentModalProps {
    quoteId: string; // ID de la cotización a pagar
    amount: number;
    description: string;
    onClose: () => void;
    onSuccess: () => void;
}

// Componente interno que usa Stripe
const PaymentForm = ({ quoteId, amount, description, onClose, onSuccess }: PaymentModalProps) => {
    const { user } = useAuth();
    const stripe = useStripe();
    const elements = useElements();
    const { createPaymentIntent } = usePayments();
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [step, setStep] = useState<'details' | 'processing' | 'success'>('details');

    useEffect(() => {
        // Obtener el clientSecret al montar el modal
        const initPayment = async () => {
            try {
                setLoading(true);
                const { clientSecret } = await createPaymentIntent(quoteId);
                setClientSecret(clientSecret);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        initPayment();
    }, [quoteId, createPaymentIntent]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements || !clientSecret) return;

        setStep('processing');
        setError(null);

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) return;

        const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
                billing_details: {
                    email: user?.email,
                    name: user?.name,
                },
            },
        });

        if (stripeError) {
            // Manejo de errores de Stripe (fondos insuficientes, tarjeta expirada, etc.)
            setError(stripeError.message ?? 'Ocurrió un error inesperado con el pago');
            setStep('details');
        } else if (paymentIntent?.status === 'succeeded') {
            // ¡PAGO EXITOSO!
            setStep('success');

            // Esperamos 2 segundos para que el usuario vea la animación de éxito
            setTimeout(() => {
                onSuccess(); // Refresca las cotizaciones en el componente padre
                onClose();   // Cierra el modal
            }, 2000);
        } else {
            // Casos raros (procesamiento pendiente, etc.)
            setError('El pago está en un estado desconocido: ' + paymentIntent?.status);
            setStep('details');
        }
    };
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(value);
    };

    if (loading && !clientSecret) {
        return (
            <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Preparando pago...</p>
            </div>
        );
    }

    return (
        <div>
            {/* Paso de ÉXITO: Este sí puede sustituir todo lo demás */}
            {step === 'success' ? (
                <div className="text-center py-8 animate-in fade-in zoom-in duration-300">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                        <FiCheck className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mt-4">¡Pago Completado!</h3>
                    <p className="text-gray-600 mt-2">Tu pago ha sido procesado exitosamente.</p>
                </div>
            ) : (
                <div className="relative">
                    {/* Overlay de PROCESANDO: Se muestra encima del formulario sin desmontarlo */}
                    {step === 'processing' && (
                        <div className="absolute inset-0 z-10 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            <p className="mt-4 text-gray-900 font-medium">Procesando pago seguro...</p>
                        </div>
                    )}

                    {/* FORMULARIO: Siempre montado hasta que el pago sea exitoso */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="bg-gray-50 rounded-2xl p-6 mb-6 border border-gray-100">
                            {/* ... (Tu diseño de Proyecto y Monto) ... */}
                            <div className="mb-4">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Proyecto</p>
                                <p className="text-gray-900 font-semibold text-lg leading-tight">{description}</p>
                            </div>
                            <div className="h-px bg-gray-200 w-full mb-4"></div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total a pagar</p>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-3xl font-bold text-blue-600 tracking-tighter">{formatCurrency(amount)}</p>
                                    <p className="text-xs font-medium text-blue-400 uppercase">EUR</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Datos de la tarjeta </label>
                            <div className="border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-blue-500 bg-white">
                                <CardElement
                                    options={{
                                        style: { base: { fontSize: '16px', color: '#1f2937' } }
                                    }}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <div className="flex space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                                disabled={step === 'processing'}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={!stripe || !clientSecret || step === 'processing'}
                                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-bold"
                            >
                                <FiLock className="inline mr-2" />
                                Confirmar Pago
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

// Modal principal que envuelve con Elements
export default function PaymentModal(props: PaymentModalProps) {
    const { onClose } = props;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
                <div className="fixed inset-0 bg-black/30" onClick={onClose}></div>
                <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-xl z-50">
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-500">
                        <FiX className="w-6 h-6" />
                    </button>
                    <div className="text-center mb-6">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                            <FiCreditCard className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mt-2">Completar Pago</h3>
                    </div>
                    <Elements stripe={stripePromise}>
                        <PaymentForm {...props} />
                    </Elements>
                </div>
            </div>
        </div>
    );
}