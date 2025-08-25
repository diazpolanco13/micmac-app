'use client'

import { useMockData } from '@/contexts/MockDataContext'
import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import MicMacProfessional from '@/components/results/MicMacProfessional'
import type { Project } from '@/types/project'

export default function ProjectResultsPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  
  const { projects } = useMockData()

  useEffect(() => {
    if (projectId && projects.length > 0) {
      const foundProject = projects.find(p => p.id === projectId)
      if (foundProject) {
        setProject(foundProject)
      } else {
        console.error(`Proyecto ${projectId} no encontrado`)
        router.push('/projects')
      }
      setLoading(false)
    }
  }, [projectId, projects, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-micmac-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse-slow rounded-full h-8 w-8 bg-micmac-primary-500 mx-auto mb-4"></div>
          <p className="text-dark-text-secondary">Cargando proyecto...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <AppLayout>
        <div className="w-full max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="text-red-500 text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-white mb-2">Proyecto no encontrado</h1>
            <p className="text-gray-400 mb-6">El proyecto solicitado no existe o no tienes acceso a él.</p>
            <button
              onClick={() => router.push('/projects')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              ← Volver a Proyectos
            </button>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => router.push(`/projects/${projectId}`)}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
            >
              ← Volver al Proyecto
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gradient">
                📊 Resultados MIC MAC
              </h1>
              <p className="text-dark-text-secondary mt-1">
                Análisis de influencias para: <span className="text-white font-medium">{project.name}</span>
              </p>
            </div>
          </div>
          
          {/* Info del Proyecto */}
          <div className="bg-gray-900 rounded-lg border border-gray-700 p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-blue-400">📋</span>
                <span className="text-gray-400">Variables:</span>
                <span className="text-white font-medium">{project.variables.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">👥</span>
                <span className="text-gray-400">Expertos:</span>
                <span className="text-white font-medium">{project.projectExperts.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-yellow-400">📅</span>
                <span className="text-gray-400">Tipo:</span>
                <span className="text-white font-medium">{project.type}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple-400">🎯</span>
                <span className="text-gray-400">Estado:</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  project.status === 'ACTIVE' ? 'bg-blue-900 text-blue-300' :
                  project.status === 'COMPLETED' ? 'bg-green-900 text-green-300' :
                  'bg-gray-900 text-gray-300'
                }`}>
                  {project.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Resultados MIC MAC Professional */}
        <MicMacProfessional projectId={projectId} />

        {/* Acciones */}
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => router.push(`/projects/${projectId}/vote`)}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            🗳️ Ver Votación
          </button>
          <button
            onClick={() => window.print()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            🖨️ Exportar Resultados
          </button>
        </div>
      </div>
    </AppLayout>
  )
}
