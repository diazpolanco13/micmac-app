'use client'

import { useState, useEffect } from 'react'
import { useMockAuth } from '@/contexts/MockAuthContext'
import { useMockData } from '@/contexts/MockDataContext'
import { useRouter } from 'next/navigation'
import { useNavigationLoading } from '@/contexts/NavigationLoadingContext'
import { Project } from '@/types/project'
import { Button } from '@/components/ui'
import { ProjectsSkeleton } from '@/components/ui/LoadingStates'
import CreateProjectModal from '@/components/projects/CreateProjectModal'
import ProjectEditModal from '@/components/projects/ProjectEditModal'
import ProjectsList from '@/components/projects/ProjectsList'
import AppLayout from '@/components/layout/AppLayout'

export default function ProjectsPage() {
  const { user, loading } = useMockAuth()
  const { 
    projects, 
    loadingProjects, 
    setCurrentProject,
    refreshProjects 
  } = useMockData()
  const router = useRouter()
  const { startLoading } = useNavigationLoading()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [filter, setFilter] = useState<{
    search: string
    tags: string[]
  }>({ search: '', tags: [] })
  const [activeView, setActiveView] = useState<'active' | 'review' | 'completed' | 'archived'>('active')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  // Separar proyectos por categorías
  const filterBySearch = (projectList: Project[]) => {
    return projectList.filter(project => {
      const searchMatch = !filter.search || 
        project.name.toLowerCase().includes(filter.search.toLowerCase()) ||
        project.description?.toLowerCase().includes(filter.search.toLowerCase())
      const tagsMatch = filter.tags.length === 0 || 
        filter.tags.some(tag => project.tags.includes(tag))
      
      return searchMatch && tagsMatch
    })
  }

  const activeProjects = filterBySearch(
    projects.filter(p => ['DRAFT', 'SETUP', 'ACTIVE'].includes(p.status))
  )
  
  const reviewProjects = filterBySearch(
    projects.filter(p => p.status === 'IN_REVIEW')
  )
  
  const completedProjects = filterBySearch(
    projects.filter(p => p.status === 'COMPLETED')
  )
  
  const archivedProjects = filterBySearch(
    projects.filter(p => p.status === 'ARCHIVED')
  )

  const handleProjectCreated = () => {
    refreshProjects()
    setIsCreateModalOpen(false)
  }

  const handleProjectUpdated = () => {
    refreshProjects()
    setIsEditModalOpen(false)
    setSelectedProject(null)
  }

  const handleProjectDeleted = () => {
    refreshProjects()
    setIsEditModalOpen(false)
    setSelectedProject(null)
  }

  const handleEditProject = (project: Project) => {
    startLoading(`/projects/create?edit=${project.id}`)
    router.push(`/projects/create?edit=${project.id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-micmac-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse-slow rounded-full h-8 w-8 bg-micmac-primary-500 mx-auto mb-4"></div>
          <p className="text-dark-text-secondary">Cargando proyectos...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <AppLayout onNewProject={() => setIsCreateModalOpen(true)}>
      <div className="w-full max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient mb-2">
            🗂️ Gestión de Proyectos
          </h1>
          <p className="text-dark-text-secondary">
            Administra todos tus proyectos MIC MAC desde aquí
          </p>
        </div>

        {/* Filtros y navegación */}
        <div className="card p-6 mb-6">
          <div className="flex flex-col gap-4">
            {/* Barra de búsqueda y botón crear */}
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <input
                type="text"
                placeholder="Buscar proyectos..."
                value={filter.search}
                onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
                className="flex-1 px-4 py-2 bg-dark-bg-tertiary border border-dark-bg-tertiary rounded-lg text-dark-text-primary placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-micmac-primary-500"
              />
              <Button 
                color="primary"
                onClick={() => {
                  startLoading('/projects/create')
                  router.push('/projects/create')
                }}
              >
                + Nuevo Proyecto
              </Button>
            </div>
            
            {/* Tabs de categorías */}
            <div className="flex gap-1 p-1 bg-dark-bg-tertiary rounded-lg">
              <button
                onClick={() => setActiveView('active')}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeView === 'active'
                    ? 'bg-micmac-primary-500 text-white'
                    : 'text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-bg-secondary'
                }`}
              >
                🚀 Activos ({activeProjects.length})
              </button>
              <button
                onClick={() => setActiveView('review')}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeView === 'review'
                    ? 'bg-micmac-primary-500 text-white'
                    : 'text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-bg-secondary'
                }`}
              >
                🔍 En Revisión ({reviewProjects.length})
              </button>
              <button
                onClick={() => setActiveView('completed')}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeView === 'completed'
                    ? 'bg-micmac-primary-500 text-white'
                    : 'text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-bg-secondary'
                }`}
              >
                ✅ Completados ({completedProjects.length})
              </button>
              <button
                onClick={() => setActiveView('archived')}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeView === 'archived'
                    ? 'bg-micmac-primary-500 text-white'
                    : 'text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-bg-secondary'
                }`}
              >
                📦 Archivados ({archivedProjects.length})
              </button>
            </div>
          </div>
        </div>

        {/* Contenido basado en la vista activa */}
        {loadingProjects ? (
          <ProjectsSkeleton />
        ) : (
          <div className="space-y-6">
            {activeView === 'active' && (
              <ProjectsList
                projects={activeProjects}
                onEdit={handleEditProject}
                title="Proyectos Activos"
                emptyMessage={filter.search ? 'No se encontraron proyectos activos con esa búsqueda' : 'No hay proyectos en desarrollo. ¡Crea tu primer proyecto MIC MAC!'}
                defaultItemsPerPage={9}
              />
            )}
            
            {activeView === 'review' && (
              <ProjectsList
                projects={reviewProjects}
                onEdit={handleEditProject}
                title="Proyectos en Revisión"
                emptyMessage={filter.search ? 'No se encontraron proyectos en revisión con esa búsqueda' : 'No hay proyectos en revisión actualmente.'}
                defaultItemsPerPage={6}
              />
            )}
            
            {activeView === 'completed' && (
              <ProjectsList
                projects={completedProjects}
                onEdit={handleEditProject}
                title="Proyectos Completados"
                emptyMessage={filter.search ? 'No se encontraron proyectos completados con esa búsqueda' : 'No hay proyectos completados todavía.'}
                defaultItemsPerPage={12}
              />
            )}
            
            {activeView === 'archived' && (
              <ProjectsList
                projects={archivedProjects}
                onEdit={handleEditProject}
                title="Proyectos Archivados"
                emptyMessage={filter.search ? 'No se encontraron proyectos archivados con esa búsqueda' : 'No hay proyectos archivados.'}
                defaultItemsPerPage={12}
              />
            )}
          </div>
        )}
      </div>

      {/* Modales */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onProjectCreated={handleProjectCreated}
      />

      <ProjectEditModal
        project={selectedProject}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedProject(null)
        }}
        onProjectUpdated={handleProjectUpdated}
        onProjectDeleted={handleProjectDeleted}
      />
    </AppLayout>
  )
}
