'use client'

import { useRouter } from 'next/navigation'
import { useMockAuth } from '@/contexts/MockAuthContext'
import { useEffect } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import { Button } from '@/components/ui'
import Calendar from '@/components/ui/Calendar'
import { 
  CalendarIcon,
  PlusIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

export default function CalendarPage() {
  const { user, loading } = useMockAuth()
  const router = useRouter()

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-pulse-slow rounded-full h-8 w-8 bg-blue-500"></div>
      </div>
    )
  }

  if (!user) return null

  return (
    <AppLayout>
      <div className="container-app space-y-6">
        {/* Breadcrumbs */}
        <Breadcrumbs />
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Calendario</h1>
            <p className="text-gray-400">Gestiona la programación de tus proyectos MIC MAC</p>
          </div>
          <Button
            color="primary"
            onClick={() => router.push('/projects/new')}
            className="flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            Programar Consulta
          </Button>
        </div>

        {/* Calendario Global */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-2">
              Calendario Global de Proyectos
            </h2>
            <p className="text-gray-300">
              Visualiza y gestiona todos los proyectos MIC MAC programados
            </p>
          </div>
          
          <Calendar
            projects={[]} // Por ahora vacío, se conectará con proyectos reales
            className="bg-white dark:bg-gray-800"
          />
        </div>

        {/* Botón de navegación */}
        <div className="flex justify-center">
          <Button
            ghost
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2"
          >
            Volver al Dashboard
          </Button>
        </div>
      </div>
    </AppLayout>
  )
}
