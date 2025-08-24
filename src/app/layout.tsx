import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { MockAuthProvider } from '@/contexts/MockAuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '🚀 MIC MAC Pro',
  description: 'Plataforma de Análisis Prospectivos con Automatización',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className={inter.className}>
        <ToastProvider>
          <MockAuthProvider>
            {children}
          </MockAuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
