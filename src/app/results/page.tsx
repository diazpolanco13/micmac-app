'use client'

import { useRouter } from 'next/navigation'
import { useMockAuth } from '@/contexts/MockAuthContext'
import { useMockData } from '@/contexts/MockDataContext'
import { useEffect } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import { Button } from '@/components/ui'
import { 
  ChartBarIcon,
  EyeIcon,
  CalendarIcon,
  UsersIcon
} from '@heroicons/react/24/outline'

export default function ResultsPage() {
  const { user, loading } = useMockAuth()
  const { projects } = useMockData()
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

  // Filtrar proyectos completados
  const completedProjects = projects.filter(p => p.status === 'COMPLETED')
  const activeProjects = projects.filter(p => p.status === 'ACTIVE')

  return (
    <AppLayout>
      <div className="container-app space-y-6">
        {/* Breadcrumbs */}
        <Breadcrumbs />
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Resultados</h1>
            <p className="text-gray-400">Visualiza los resultados de tus análisis MIC MAC</p>
          </div>
          <Button
            color="primary"
            onClick={() => router.push('/projects')}
            className="flex items-center gap-2"
          >
            <ChartBarIcon className="h-4 w-4" />
            Ver Todos los Proyectos
          </Button>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <ChartBarIcon className="h-6 w-6 text-green-400" />
              <h3 className="font-semibold text-white">Completados</h3>
            </div>
            <div className="text-3xl font-bold text-green-400 mb-1">
              {completedProjects.length}
            </div>
            <div className="text-sm text-gray-400">Proyectos finalizados</div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <CalendarIcon className="h-6 w-6 text-blue-400" />
              <h3 className="font-semibold text-white">En Progreso</h3>
            </div>
            <div className="text-3xl font-bold text-blue-400 mb-1">
              {activeProjects.length}
            </div>
            <div className="text-sm text-gray-400">Análisis activos</div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <UsersIcon className="h-6 w-6 text-purple-400" />
              <h3 className="font-semibold text-white">Total</h3>
            </div>
            <div className="text-3xl font-bold text-purple-400 mb-1">
              {projects.length}
            </div>
            <div className="text-sm text-gray-400">Proyectos totales</div>
          </div>
        </div>

        {/* Proyectos completados */}
        {completedProjects.length > 0 ? (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">
              Proyectos con Resultados Disponibles
            </h2>
            
            <div className="space-y-3">
              {completedProjects.map((project) => (
                <div 
                  key={project.id}
                  className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg border border-gray-600/50"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white truncate">
                      {project.name}
                    </h3>
                    <p className="text-sm text-gray-400 truncate">
                      {project.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>Variables: {project.variables.length}</span>
                      <span>Creado: {new Date(project.createdAt).toLocaleDateString('es-ES')}</span>
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    onClick={() => router.push(`/projects/${project.id}/results`)}
                    className="flex items-center gap-2 ml-4"
                  >
                    <EyeIcon className="h-4 w-4" />
                    Ver Resultados
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 text-center">
            <div className="flex justify-center mb-6">
              <div className="p-6 bg-gray-700/50 rounded-full">
                <ChartBarIcon className="h-16 w-16 text-gray-400" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">
              No hay resultados disponibles
            </h2>
            
            <p className="text-gray-300 mb-8 max-w-lg mx-auto">
              Aún no tienes proyectos completados. Una vez que completes un análisis MIC MAC, 
              los resultados aparecerán aquí.
            </p>

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
        )}
      </div>
    </AppLayout>
  )
}
