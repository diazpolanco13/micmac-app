'use client'

import { useRouter } from 'next/navigation'
import { useMockAuth } from '@/contexts/MockAuthContext'
import { useEffect } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import { Button } from '@/components/ui'
import { 
  ArrowLeftIcon, 
  HomeIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

export default function NotFoundPage() {
  const { user, loading } = useMockAuth()
  const router = useRouter()

  // Si no está autenticado, mostrar página 404 simple
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-pulse-slow rounded-full h-8 w-8 bg-blue-500"></div>
      </div>
    )
  }

  const handleGoBack = () => {
    router.back()
  }

  const handleGoHome = () => {
    if (user) {
      router.push('/dashboard')
    } else {
      router.push('/auth')
    }
  }

  const handleGoToProjects = () => {
    router.push('/projects')
  }

  // Si no está autenticado, mostrar página 404 básica
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <div className="mx-auto w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
              <ExclamationTriangleIcon className="h-12 w-12 text-red-400" />
            </div>
            <h1 className="text-6xl font-bold text-white mb-4">404</h1>
            <h2 className="text-xl font-semibold text-gray-300 mb-2">
              Página no encontrada
            </h2>
            <p className="text-gray-400 mb-8">
              La página que buscas no existe o ha sido movida.
            </p>
          </div>
          
          <div className="space-y-4">
            <Button
              color="primary"
              onClick={() => router.push('/auth')}
              className="w-full flex items-center justify-center gap-2"
            >
              <HomeIcon className="h-4 w-4" />
              Ir al Inicio
            </Button>
            <Button
              ghost
              onClick={handleGoBack}
              className="w-full flex items-center justify-center gap-2"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Volver
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Si está autenticado, mostrar página 404 dentro del layout
  return (
    <AppLayout>
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="max-w-2xl w-full text-center px-4">
          {/* Error Icon */}
          <div className="mb-8">
            <div className="mx-auto w-32 h-32 rounded-full bg-gradient-to-br from-red-500/10 to-orange-500/10 flex items-center justify-center mb-8">
              <ExclamationTriangleIcon className="h-16 w-16 text-red-400" />
            </div>
            <h1 className="text-8xl font-bold text-white mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-gray-300 mb-4">
              Página no encontrada
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto">
              Lo sentimos, la página que buscas no existe, ha sido movida o no tienes 
              permisos para acceder a ella.
            </p>
          </div>

          {/* Sugerencias */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <MagnifyingGlassIcon className="h-6 w-6 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">
                ¿Qué puedes hacer?
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
              <div className="text-left">
                <h4 className="font-medium text-white mb-2">Páginas principales:</h4>
                <ul className="space-y-1">
                  <li>• Dashboard principal</li>
                  <li>• Gestión de proyectos</li>
                  <li>• Gestión de expertos</li>
                  <li>• Resultados de análisis</li>
                </ul>
              </div>
              <div className="text-left">
                <h4 className="font-medium text-white mb-2">Posibles causas:</h4>
                <ul className="space-y-1">
                  <li>• URL incorrecta o mal escrita</li>
                  <li>• Página movida o eliminada</li>
                  <li>• Funcionalidad en desarrollo</li>
                  <li>• Permisos insuficientes</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              color="primary"
              onClick={handleGoHome}
              className="flex items-center gap-2 min-w-[160px]"
            >
              <HomeIcon className="h-4 w-4" />
              Ir al Dashboard
            </Button>
            
            <Button
              ghost
              onClick={handleGoToProjects}
              className="flex items-center gap-2 min-w-[160px]"
            >
              <MagnifyingGlassIcon className="h-4 w-4" />
              Ver Proyectos
            </Button>
            
            <Button
              ghost
              onClick={handleGoBack}
              className="flex items-center gap-2 min-w-[160px]"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Volver
            </Button>
          </div>

          {/* Información adicional */}
          <div className="mt-8 pt-6 border-t border-gray-700">
            <p className="text-xs text-gray-500">
              Si crees que esto es un error, puedes volver a intentarlo o contactar al administrador.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
