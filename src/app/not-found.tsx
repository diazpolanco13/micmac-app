'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui'
import { ArrowLeftIcon, HomeIcon, ExclamationTriangleIcon, FolderIcon, UsersIcon } from '@heroicons/react/24/outline'

export default function NotFound() {
  const router = useRouter()

  const quickLinks = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: HomeIcon,
      description: 'Panel principal'
    },
    {
      name: 'Proyectos',
      href: '/projects',
      icon: FolderIcon,
      description: 'Gestionar proyectos MIC MAC'
    },
    {
      name: 'Expertos',
      href: '/experts',
      icon: UsersIcon,
      description: 'Administrar expertos'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Animated 404 */}
        <div className="mb-8 relative">
          <div className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-600 animate-pulse">
            404
          </div>
          <div className="absolute inset-0 text-8xl font-bold text-red-500/10 blur-sm">
            404
          </div>
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-red-500/10 rounded-full border border-red-500/20">
            <ExclamationTriangleIcon className="h-12 w-12 text-red-400" />
          </div>
        </div>

        {/* Content */}
        <h1 className="text-3xl font-bold text-white mb-4">
          Página no encontrada
        </h1>
        
        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
          Lo sentimos, no pudimos encontrar la página que buscas. 
          Puede que haya sido movida, eliminada o que hayas escrito mal la URL.
        </p>

        {/* Quick Links */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Enlaces rápidos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {quickLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="group p-4 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg border border-gray-600/50 hover:border-gray-500/50 transition-all duration-200"
              >
                <div className="flex flex-col items-center text-center">
                  <link.icon className="h-8 w-8 text-gray-400 group-hover:text-white mb-2 transition-colors" />
                  <div className="font-medium text-white group-hover:text-micmac-primary-400 transition-colors">
                    {link.name}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {link.description}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button
            variant="ghost"
            className="flex items-center justify-center gap-2 text-gray-300 hover:text-white hover:bg-gray-800"
            onClick={() => router.back()}
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Volver atrás
          </Button>
          
          <Link href="/dashboard">
            <Button
              variant="primary"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-micmac-primary-600 to-micmac-secondary-600 hover:from-micmac-primary-500 hover:to-micmac-secondary-500"
            >
              <HomeIcon className="h-4 w-4" />
              Ir al Dashboard
            </Button>
          </Link>
        </div>

        {/* Additional help */}
        <div className="pt-8 border-t border-gray-700">
          <p className="text-gray-500 text-sm">
            Si crees que esto es un error, puedes{' '}
            <Link href="/profile" className="text-micmac-primary-400 hover:text-micmac-primary-300 underline">
              revisar tu perfil
            </Link>
            {' '}o volver al{' '}
            <Link href="/dashboard" className="text-micmac-primary-400 hover:text-micmac-primary-300 underline">
              dashboard principal
            </Link>
          </p>
        </div>

        {/* Background decoration */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-micmac-primary-500/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-micmac-secondary-500/5 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  )
}