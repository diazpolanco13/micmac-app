import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { MockAuthProvider } from '@/contexts/MockAuthContext';
import { MockDataProvider } from '@/contexts/MockDataContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { NavigationLoadingProvider, NavigationLoadingPortal } from '@/contexts/NavigationLoadingContext';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MIC MAC Pro',
  description: 'Plataforma de Análisis Prospectivos con Automatización',
  icons: {
    icon: [
      {
        url: '/logoMicMac.png?v=1',
        sizes: 'any',
        type: 'image/png',
      },
      {
        url: '/favicon.svg?v=1',
        type: 'image/svg+xml',
      }
    ],
    shortcut: '/logoMicMac.png?v=1',
    apple: '/logoMicMac.png?v=1',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <head>
        <link rel="icon" href="/logoMicMac.png?v=1" type="image/png" />
        <link rel="shortcut icon" href="/logoMicMac.png?v=1" />
      </head>
      <body className={inter.className}>
        <ToastProvider>
          <MockAuthProvider>
            <MockDataProvider>
              <NavigationLoadingProvider>
                {children}
                <NavigationLoadingPortal />
              </NavigationLoadingProvider>
            </MockDataProvider>
          </MockAuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
