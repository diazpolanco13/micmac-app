import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
// FASE 1: Contextos híbridos Mock/Supabase
import { AuthProvider } from '@/contexts/AuthContext';
import { DataProvider } from '@/contexts/DataContext';
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
        url: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        url: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      }
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: [
      {
        rel: 'android-chrome',
        url: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        rel: 'android-chrome',
        url: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      }
    ],
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
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#3B82F6" />
      </head>
      <body className={inter.className}>
        <ToastProvider>
          <AuthProvider>
            <DataProvider>
              <NavigationLoadingProvider>
                {children}
                <NavigationLoadingPortal />
              </NavigationLoadingProvider>
            </DataProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
