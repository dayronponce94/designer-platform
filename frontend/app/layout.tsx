import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from './providers/QueryProvider';
import { AuthProvider } from './providers/AuthProvider';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';;

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Designer Platform - Plataforma Profesional de Diseño',
  description: 'Conectamos clientes con talento en diseño. Solicita proyectos directamente.',
  keywords: 'diseño, branding, ux/ui, diseñadores, proyectos, freelance',
  authors: [{ name: 'Designer Platform' }],
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://designerplatform.com',
    title: 'Designer Platform',
    description: 'Plataforma profesional para proyectos de diseño',
    siteName: 'Designer Platform',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-gray-50`}>
        <QueryProvider>
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="grow">{children}</main>
              <Footer />
            </div>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}