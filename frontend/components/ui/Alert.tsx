'use client';

import { FiAlertCircle, FiCheckCircle, FiX, FiInfo } from 'react-icons/fi';

interface AlertProps {
    type?: 'success' | 'error' | 'warning' | 'info';
    message: string;
    onClose?: () => void;
    className?: string;
}

export default function Alert({
    type = 'info',
    message,
    onClose,
    className = ''
}: AlertProps) {
    const typeStyles = {
        success: 'bg-green-50 border-green-200 text-green-800',
        error: 'bg-red-50 border-red-200 text-red-800',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        info: 'bg-blue-50 border-blue-200 text-blue-800',
    };

    const iconStyles = {
        success: <FiCheckCircle className="text-green-500" />,
        error: <FiAlertCircle className="text-red-500" />,
        warning: <FiAlertCircle className="text-yellow-500" />,
        info: <FiInfo className="text-blue-500" />,
    };

    return (
        <div className={`relative rounded-lg border p-4 ${typeStyles[type]} ${className}`}>
            <div className="flex items-start">
                <div className="shrink-0 pt-0.5">
                    {iconStyles[type]}
                </div>
                <div className="ml-3 flex-1">
                    <p className="text-sm font-medium">{message}</p>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="ml-4 shrink-0 p-1 rounded hover:bg-white/20"
                    >
                        <FiX className="h-4 w-4" />
                    </button>
                )}
            </div>
        </div>
    );
}