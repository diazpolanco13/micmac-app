'use client'

import { useRouter } from 'next/navigation'
import { useMockAuth } from '@/contexts/MockAuthContext'
import { useEffect } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import { Button } from '@/components/ui'
import { 
  ArrowLeftIcon, 
  ClockIcon, 
  CodeBracketIcon,
  RocketLaunchIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

export default function EnDesarrolloPage() {
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

  const handleGoBack = () => {
    router.back()
  }

  const handleGoHome = () => {
    router.push('/dashboard')
  }

  const upcomingFeatures = [
    {
      name: 'Plantillas de Proyectos',
      description: 'Plantillas predefinidas para análisis MIC MAC comunes',
      status: 'planned',
      eta: 'Q2 2025'
    },
    {
      name: 'Proyectos Archivados',
      description: 'Sistema de archivo y recuperación de proyectos antiguos',
      status: 'planned', 
      eta: 'Q2 2025'
    },
    {
      name: 'Invitar Expertos',
      description: 'Sistema de invitaciones por email con seguimiento',
      status: 'in-progress',
      eta: 'Q1 2025'
    },
    {
      name: 'Análisis de Rendimiento',
      description: 'Métricas avanzadas y analytics de participación',
      status: 'planned',
      eta: 'Q2 2025'
    },
    {
      name: 'Matrices Avanzadas',
      description: 'Análisis de matrices con algoritmos adicionales',
      status: 'research',
      eta: 'Q3 2025'
    },
    {
      name: 'Reportes Automatizados',
      description: 'Generación automática de reportes PDF y Excel',
      status: 'planned',
      eta: 'Q2 2025'
    },
    {
      name: 'Documentación Colaborativa',
      description: 'Sistema de documentos compartidos por proyecto',
      status: 'planned',
      eta: 'Q3 2025'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'planned':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'research':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'in-progress':
        return 'En Desarrollo'
      case 'planned':
        return 'Planificado'
      case 'research':
        return 'Investigación'
      default:
        return 'Pendiente'
    }
  }

  return (
    <AppLayout>
      <div className="container-app space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-white/10 rounded-full">
              <RocketLaunchIcon className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Funcionalidad en Desarrollo
          </h1>
          <p className="text-blue-100 text-lg">
            Esta funcionalidad será implementada próximamente
          </p>
        </div>

        {/* Estado actual */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircleIcon className="h-6 w-6 text-green-400" />
            <h2 className="text-xl font-semibold text-white">
              Estado Actual del Proyecto
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-400 mb-1">98%</div>
              <div className="text-sm text-gray-300">MVP Completado</div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-400 mb-1">15+</div>
              <div className="text-sm text-gray-300">Funcionalidades Core</div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-400 mb-1">100%</div>
              <div className="text-sm text-gray-300">Sistema MIC MAC</div>
            </div>
          </div>
        </div>

        {/* Funcionalidades próximas */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <CodeBracketIcon className="h-6 w-6 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">
              Próximas Funcionalidades
            </h2>
          </div>

          <div className="space-y-4">
            {upcomingFeatures.map((feature, index) => (
              <div 
                key={index}
                className="flex items-start gap-4 p-4 bg-gray-700/30 rounded-lg border border-gray-600/50"
              >
                <div className="flex-shrink-0 mt-1">
                  <ClockIcon className="h-5 w-5 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium text-white">{feature.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(feature.status)}`}>
                      {getStatusLabel(feature.status)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">
                    {feature.description}
                  </p>
                  <div className="text-xs text-gray-400">
                    ETA: {feature.eta}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mensaje motivacional */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-white mb-3">
              ¡El sistema principal está completamente funcional!
            </h3>
            <p className="text-gray-300 mb-6">
              Puedes crear proyectos, gestionar expertos, ejecutar análisis MIC MAC completos 
              y visualizar resultados profesionales. Las funcionalidades adicionales se están 
              desarrollando para mejorar aún más tu experiencia.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button
                ghost
                onClick={handleGoBack}
                className="flex items-center gap-2"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Volver
              </Button>
              <Button
                color="primary"
                onClick={handleGoHome}
                className="flex items-center gap-2"
              >
                <RocketLaunchIcon className="h-4 w-4" />
                Ir al Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
