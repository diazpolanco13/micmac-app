'use client'

import { useRouter } from 'next/navigation'
import { useMockAuth } from '@/contexts/MockAuthContext'
import { useEffect } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import { Button } from '@/components/ui'
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
      router.push('/auth')
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
      <div className="space-y-6">
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

        {/* Placeholder para el calendario */}
        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-6 bg-blue-500/10 rounded-full">
              <CalendarIcon className="h-16 w-16 text-blue-400" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-4">
            Sistema de Calendario en Desarrollo
          </h2>
          
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            El sistema completo de calendario estará disponible próximamente. Incluirá:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-700/50 rounded-lg p-4">
              <ClockIcon className="h-8 w-8 text-blue-400 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-2">Programación de Consultas</h3>
              <p className="text-sm text-gray-400">Programa proyectos MIC MAC para fechas futuras</p>
            </div>
            
            <div className="bg-gray-700/50 rounded-lg p-4">
              <CalendarIcon className="h-8 w-8 text-green-400 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-2">Vista Mensual</h3>
              <p className="text-sm text-gray-400">Visualiza todos los proyectos en calendario</p>
            </div>
            
            <div className="bg-gray-700/50 rounded-lg p-4">
              <PlusIcon className="h-8 w-8 text-purple-400 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-2">Invitaciones Automáticas</h3>
              <p className="text-sm text-gray-400">Envío automático de invitaciones a expertos</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button
              color="primary"
              onClick={() => router.push('/projects')}
            >
              Ver Proyectos Actuales
            </Button>
            <Button
              ghost
              onClick={() => router.push('/dashboard')}
            >
              Volver al Dashboard
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
