'use client';

import { FiAlertTriangle } from 'react-icons/fi';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
}

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Eliminar',
    cancelText = 'Cancelar',
    type = 'danger',
}: ConfirmModalProps) {
    if (!isOpen) return null;

    const typeStyles = {
        danger: {
            bg: 'bg-red-100',
            icon: 'text-red-600',
            button: 'bg-red-600 hover:bg-red-700',
        },
        warning: {
            bg: 'bg-yellow-100',
            icon: 'text-yellow-600',
            button: 'bg-yellow-600 hover:bg-yellow-700',
        },
        info: {
            bg: 'bg-blue-100',
            icon: 'text-blue-600',
            button: 'bg-blue-600 hover:bg-blue-700',
        },
    };

    const styles = typeStyles[type];

    return (
        <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40"
                aria-hidden="true"
                onClick={onClose}
            />

            {/* Modal card */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="w-full max-w-lg bg-white rounded-lg shadow-xl">
                    <div className="px-6 pt-6 pb-4">
                        <div className="flex items-start">
                            <div
                                className={`shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${styles.bg}`}
                            >
                                <FiAlertTriangle className={`h-6 w-6 ${styles.icon}`} aria-hidden="true" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                                <p className="mt-2 text-sm text-gray-500">{message}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                        <button
                            type="button"
                            className={`inline-flex justify-center rounded-md px-4 py-2 text-sm font-medium text-white ${styles.button}`}
                            onClick={onConfirm}
                        >
                            {confirmText}
                        </button>
                        <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            onClick={onClose}
                        >
                            {cancelText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}