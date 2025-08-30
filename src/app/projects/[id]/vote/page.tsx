'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useMockAuth } from '@/contexts/MockAuthContext'
import { useMockData } from '@/contexts/MockDataContext'
import AppLayout from '@/components/layout/AppLayout'
import { Button } from '@/components/ui'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import { Project, VotingResponse } from '@/types/project'
import VotingMatrix from '@/components/voting/VotingMatrix'

export default function VotingPage() {
  const params = useParams()
  const router = useRouter()
  const { user, loading: authLoading } = useMockAuth()
  const { 
    projects, 
    loadingProjects, 
    saveVote, 
    getVotingProgress, 
    getExpertVotes,
    simulateAllExperts
  } = useMockData()
  
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const projectId = params?.id as string

  // Cargar proyecto y verificar permisos
  useEffect(() => {
    if (authLoading || loadingProjects) return

    if (!user) {
      router.push('/')
      return
    }

    // 🎯 ESPERAR A QUE SE CARGUEN LOS PROYECTOS
    if (projects.length === 0) {
      return // No hacer nada hasta que se carguen
    }
    
    const foundProject = projects.find(p => p.id === projectId)
    
    if (!foundProject) {
      setError(`Proyecto no encontrado. ID buscado: "${projectId}". IDs disponibles: ${projects.map(p => p.id).join(', ')}`)
      setLoading(false)
      return
    }

    // Verificar que el usuario puede votar
    const isAssignedExpert = foundProject.projectExperts.some(
      pe => pe.expert?.email === user.email
    )

    if (!isAssignedExpert && user.role !== 'MODERATOR') {
      setError('No tienes permisos para votar en este proyecto')
      setLoading(false)
      return
    }

    // Por ahora permitir votación en proyectos ACTIVE
    if (foundProject.status !== 'ACTIVE') {
      setError(`El proyecto debe estar "Activo" para votar. Estado actual: ${foundProject.status}`)
      setLoading(false)
      return
    }

    setProject(foundProject)
    setLoading(false)
  }, [projectId, projects, user, authLoading, loadingProjects, router])

  // Estado para mostrar pantalla de completado
  const [showCompletion, setShowCompletion] = useState(false)
  const [completionStats, setCompletionStats] = useState<{
    votes: number
    progress: number
    totalPairs: number
  } | null>(null)
  
  // Estado para simulación de expertos
  const [isSimulating, setIsSimulating] = useState(false)
  const [isSimulationComplete, setIsSimulationComplete] = useState(false)

  // Manejar votación completada
  const handleVoteComplete = async (votes: VotingResponse[]) => {
    if (!project || !user) return
    
    console.log('🎉 Votación completada:', votes)
    
    // Obtener progreso final
    const progress = getVotingProgress(project.id, user.id)
    console.log('Progreso final:', progress)
    
    // Mostrar pantalla de completado elegante
    setCompletionStats({
      votes: votes.length,
      progress: 100, // Siempre 100% cuando se completa la votación
      totalPairs: progress.totalPairs
    })
    setShowCompletion(true)
    
    // Redirigir después de 5 segundos
    setTimeout(() => {
      router.push('/projects')
    }, 5000)
  }

  // Simular votación de todos los expertos
  const handleSimulateExperts = async () => {
    if (!project) return
    
    setIsSimulating(true)
    try {
      const result = await simulateAllExperts(project.id)
      if (result.success) {
        // Mostrar pantalla de resultados de simulación
        setCompletionStats({
          votes: result.totalVotes || 0,
          progress: 100,
          totalPairs: (project.variables.length * (project.variables.length - 1)) * project.projectExperts.length
        })
        setIsSimulationComplete(true)
        setShowCompletion(true)
        
        // Redirigir después de 8 segundos para dar tiempo a leer
        setTimeout(() => {
          router.push('/projects')
        }, 8000)
      } else {
        alert(`❌ Error en la simulación: ${result.error}`)
      }
    } catch (error) {
      alert(`❌ Error inesperado: ${error}`)
    } finally {
      setIsSimulating(false)
    }
  }

  if (authLoading || loadingProjects || loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-pulse-slow rounded-full h-8 w-8 bg-micmac-primary-500 mx-auto mb-4"></div>
            <p className="text-dark-text-secondary">Cargando proyecto...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (error) {
    return (
      <AppLayout>
        <div className="container-app py-8">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center">
            <div className="text-red-400 text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-red-400 mb-2">Error de Acceso</h2>
            <p className="text-red-300 mb-4">{error}</p>
            <Button 
              ghost 
              onClick={() => router.push('/projects')}
              className="text-red-400 hover:bg-red-500/10"
            >
              Volver a Proyectos
            </Button>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (!project) {
    return (
      <AppLayout>
        <div className="container-app py-8">
          <div className="text-center">
            <p className="text-dark-text-secondary">Proyecto no encontrado</p>
          </div>
        </div>
      </AppLayout>
    )
  }



  return (
    <AppLayout>
      <div className="container-app py-6">
        {/* Breadcrumbs */}
        <Breadcrumbs />
        
        {/* Header del proyecto */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-dark-text-primary mb-2">
                🗳️ Votación MIC MAC
              </h1>
              <p className="text-dark-text-secondary">
                Proyecto: <span className="text-dark-text-primary font-medium">{project.name}</span>
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* Botón de simulación - Solo para desarrollo y debugging */}
              {(process.env.NODE_ENV === 'development' || user?.role === 'MODERATOR') && (
                <button
                  onClick={handleSimulateExperts}
                  disabled={isSimulating}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isSimulating
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg hover:shadow-purple-600/25'
                  }`}
                >
                  {isSimulating ? (
                    <>
                      <svg className="animate-spin w-4 h-4 mr-2 inline" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Simulando...
                    </>
                  ) : (
                    <>
                      🤖 Simular 8 Expertos
                    </>
                  )}
                </button>
              )}
              
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.push(`/projects/${project.id}/results`)}
                  className="px-4 py-2 bg-micmac-primary-600 hover:bg-micmac-primary-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                  📊 Ver Resultados
                </button>
                <div className="text-right">
                  <div className="text-sm text-dark-text-secondary">Variables</div>
                  <div className="text-2xl font-bold text-micmac-primary-400">
                    {project.variables.length}
                  </div>
                </div>
              </div>
            </div>
          </div>


        </div>

        {/* Pantalla de completado elegante */}
        {showCompletion && completionStats ? (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-3xl p-8 md:p-12 max-w-md mx-4 text-center shadow-2xl border border-green-500/30">
              {/* Animación de éxito */}
              <div className="w-20 h-20 mx-auto mb-6 bg-white rounded-full flex items-center justify-center animate-bounce">
                <div className="text-4xl">{isSimulationComplete ? '🤖' : '🎉'}</div>
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                {isSimulationComplete ? '¡Simulación Completada!' : '¡Votación Completada!'}
              </h2>
              
              <p className="text-green-100 mb-6 text-lg">
                {isSimulationComplete 
                  ? '¡Perfecto! Los 8 expertos han completado sus votaciones automáticamente.' 
                  : '¡Excelente trabajo! Has completado todas las comparaciones.'
                }
              </p>
              
              {/* Estadísticas */}
              <div className="grid grid-cols-1 gap-4 mb-6">
                <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="text-3xl font-bold text-white">{completionStats.votes}</div>
                  <div className="text-green-100 text-sm">
                    {isSimulationComplete ? 'Votos simulados' : 'Comparaciones completadas'}
                  </div>
                </div>
                <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="text-3xl font-bold text-white">
                    {isSimulationComplete ? project?.projectExperts.length || 0 : completionStats.progress + '%'}
                  </div>
                  <div className="text-green-100 text-sm">
                    {isSimulationComplete ? 'Expertos simulados' : 'Progreso total'}
                  </div>
                </div>
                <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="text-3xl font-bold text-white">
                    {isSimulationComplete ? '6' : '~' + Math.ceil(completionStats.votes * 0.5)}
                  </div>
                  <div className="text-green-100 text-sm">
                    {isSimulationComplete ? 'Comparaciones por experto' : 'Minutos invertidos'}
                  </div>
                </div>
              </div>
              
              <p className="text-green-100 text-sm">
                {isSimulationComplete 
                  ? 'Redirigiendo automáticamente en 8 segundos...'
                  : 'Redirigiendo automáticamente en 5 segundos...'
                }
              </p>
              
              <button
                onClick={() => router.push('/projects')}
                className="mt-4 px-6 py-3 bg-white text-green-700 rounded-xl font-semibold hover:bg-green-50 transition-colors duration-200"
              >
                Ir a Proyectos
              </button>
            </div>
          </div>
        ) : (
          /* Componente de Votación con Cronómetro */
          <VotingMatrix
            variables={project.variables}
            onVoteComplete={handleVoteComplete}
            expertId={user?.id || ''}
            projectId={project.id}
          />
        )}
      </div>
    </AppLayout>
  )
}



