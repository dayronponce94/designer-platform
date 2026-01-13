'use client';

import { useState } from 'react';
import { FiX, FiCreditCard, FiLock, FiCheck } from 'react-icons/fi';
import { usePayments } from '@/app/lib/hooks/usePayments';

interface PaymentModalProps {
    payment?: any;
    onClose: () => void;
    onSuccess: () => void;
}

export default function PaymentModal({ payment, onClose, onSuccess }: PaymentModalProps) {
    const { createPaymentIntent, paymentMethods } = usePayments();
    const [step, setStep] = useState<'details' | 'confirmation' | 'success'>('details');
    const [amount, setAmount] = useState(payment?.amount || '');
    const [description, setDescription] = useState(payment?.description || '');
    const [selectedMethod, setSelectedMethod] = useState('pm_001');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const formatCurrency = (value: string) => {
        const num = parseFloat(value) || 0;
        return new Intl.NumberFormat('es-US', {
            style: 'currency',
            currency: 'USD'
        }).format(num);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Simular procesamiento de pago
            await new Promise(resolve => setTimeout(resolve, 1500));

            // En producción, aquí se llamaría a createPaymentIntent y luego a Stripe
            const paymentData = await createPaymentIntent(
                parseFloat(amount),
                payment?.projectId?._id
            );

            console.log('Payment intent created:', paymentData);

            // Simular éxito
            setStep('success');

            // Simular actualización del estado
            setTimeout(() => {
                onSuccess();
            }, 2000);

        } catch (err: any) {
            setError(err.message || 'Error al procesar el pago');
        } finally {
            setLoading(false);
        }
    };

    const handleSimulatePayment = () => {
        setStep('confirmation');
        // Simular procesamiento de confirmación
        setTimeout(() => {
            setStep('success');
            setTimeout(onSuccess, 2000);
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                {/* Overlay */}
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 z-40" onClick={onClose}></div>

                {/* Modal */}
                <div className="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full z-50">
                    <div className="absolute top-0 right-0 pt-4 pr-4">
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500"
                        >
                            <FiX className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="bg-white px-6 pt-6 pb-8">
                        {step === 'details' && (
                            <>
                                <div className="text-center mb-6">
                                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                                        <FiCreditCard className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                        {payment ? 'Completar Pago' : 'Realizar Pago'}
                                    </h3>
                                    <p className="text-gray-600">
                                        {payment
                                            ? 'Completa el pago pendiente para continuar con el proyecto.'
                                            : 'Ingresa los detalles del pago que deseas realizar.'
                                        }
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {payment && (
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                            <p className="font-medium text-blue-900">Proyecto: {payment.projectId?.title}</p>
                                            <p className="text-blue-700">Descripción: {payment.description}</p>
                                        </div>
                                    )}

                                    {!payment && (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Descripción del pago
                                                </label>
                                                <input
                                                    type="text"
                                                    value={description}
                                                    onChange={(e) => setDescription(e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="Ej: Pago inicial proyecto Logo"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Monto (USD)
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <span className="text-gray-500">$</span>
                                                    </div>
                                                    <input
                                                        type="number"
                                                        value={amount}
                                                        onChange={(e) => setAmount(e.target.value)}
                                                        className="w-full pl-7 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        placeholder="0.00"
                                                        min="1"
                                                        step="0.01"
                                                        required
                                                    />
                                                </div>
                                                {amount && (
                                                    <p className="mt-2 text-sm text-gray-500">
                                                        Total: {formatCurrency(amount)}
                                                    </p>
                                                )}
                                            </div>
                                        </>
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Método de pago
                                        </label>
                                        <div className="space-y-2">
                                            {paymentMethods.map((method) => (
                                                <div
                                                    key={method.id}
                                                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${selectedMethod === method.id
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : 'border-gray-300 hover:border-gray-400'
                                                        }`}
                                                    onClick={() => setSelectedMethod(method.id)}
                                                >
                                                    <div className="flex items-center flex-1">
                                                        <div className="p-2 bg-gray-100 rounded-lg mr-3">
                                                            <FiCreditCard className="w-5 h-5 text-gray-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">
                                                                {method.brand?.toUpperCase()} ****{method.last4}
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                Expira {method.expiryMonth}/{method.expiryYear}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {selectedMethod === method.id && (
                                                        <div className="text-blue-600">
                                                            <FiCheck className="w-5 h-5" />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        <button
                                            type="button"
                                            className="mt-3 text-blue-600 hover:text-blue-700 text-sm"
                                        >
                                            + Agregar nuevo método de pago
                                        </button>
                                    </div>

                                    {error && (
                                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                            {error}
                                        </div>
                                    )}

                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="flex justify-between mb-2">
                                            <span className="text-gray-600">Monto:</span>
                                            <span className="font-medium">{formatCurrency(payment?.amount || amount)}</span>
                                        </div>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-gray-600">Comisión:</span>
                                            <span className="font-medium">$0.00</span>
                                        </div>
                                        <div className="flex justify-between pt-2 border-t border-gray-200">
                                            <span className="text-lg font-bold text-gray-900">Total:</span>
                                            <span className="text-lg font-bold text-gray-900">
                                                {formatCurrency(payment?.amount || amount)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex space-x-3">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                            disabled={loading}
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading ? (
                                                <div className="flex items-center justify-center">
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                                    Procesando...
                                                </div>
                                            ) : (
                                                <>
                                                    <FiLock className="inline mr-2" />
                                                    Pagar {formatCurrency(payment?.amount || amount)}
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    <div className="text-center">
                                        <p className="text-xs text-gray-500 flex items-center justify-center">
                                            <FiLock className="mr-1" />
                                            Pago seguro procesado con Stripe
                                        </p>
                                    </div>
                                </form>
                            </>
                        )}

                        {step === 'confirmation' && (
                            <div className="text-center py-8">
                                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-6 animate-pulse">
                                    <FiCreditCard className="h-8 w-8 text-blue-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                    Procesando pago...
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Estamos verificando tu pago. Esto tomará unos segundos.
                                </p>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-blue-600 h-2 rounded-full w-3/4 animate-pulse"></div>
                                </div>
                            </div>
                        )}

                        {step === 'success' && (
                            <div className="text-center py-8">
                                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                                    <FiCheck className="h-8 w-8 text-green-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                    ¡Pago Completado!
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Tu pago de {formatCurrency(payment?.amount || amount)} ha sido procesado exitosamente.
                                </p>
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                                    <p className="font-medium text-green-900">Referencia: PAY-{Date.now().toString().slice(-8)}</p>
                                    <p className="text-green-700 text-sm mt-1">
                                        Hemos enviado un recibo a tu correo electrónico.
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Continuar
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Modo simulación */}
                    {step === 'details' && (
                        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-500">
                                    <strong>Modo Simulación:</strong> No se realizarán cargos reales
                                </div>
                                <button
                                    onClick={handleSimulatePayment}
                                    className="text-sm text-blue-600 hover:text-blue-700"
                                >
                                    Simular pago exitoso →
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}