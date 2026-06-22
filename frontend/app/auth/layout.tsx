import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>; // No altera absolutamente nada de CSS, solo pasa el componente limpio
}