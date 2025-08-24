'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/SupabaseAuthContext'
import { useData } from '@/contexts/DataContext'
import { useRouter } from 'next/navigation'
import { Project } from '@/types/project'
import { Button } from '@/components/ui'
import CreateProjectModal from '@/components/projects/CreateProjectModal'
import ProjectEditModal from '@/components/projects/ProjectEditModal'
import AppLayout from '@/components/layout/AppLayout'

export default function ProjectsPage() {
  const { user, loading } = useAuth()
  const { 
    projects, 
    loadingProjects, 
    setCurrentProject,
    refreshProjects 
  } = useData()
  const router = useRouter()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [filter, setFilter] = useState<{
    status: string[]
    search: string
    tags: string[]
  }>({ status: [], search: '', tags: [] })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  // Filtrar proyectos localmente
  const filteredProjects = projects.filter(project => {
    const statusMatch = filter.status.length === 0 || filter.status.includes(project.status)
    const searchMatch = !filter.search || 
      project.name.toLowerCase().includes(filter.search.toLowerCase()) ||
      project.description?.toLowerCase().includes(filter.search.toLowerCase())
    const tagsMatch = filter.tags.length === 0 || 
      filter.tags.some(tag => project.tags.includes(tag))
    
    return statusMatch && searchMatch && tagsMatch
  })

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
    setCurrentProject(project)
    setSelectedProject(project)
    setIsEditModalOpen(true)
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

        {/* Filtros y búsqueda */}
        <div className="card p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <input
                type="text"
                placeholder="Buscar proyectos..."
                value={filter.search}
                onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
                className="px-4 py-2 bg-dark-bg-tertiary border border-dark-bg-tertiary rounded-lg text-dark-text-primary placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-micmac-primary-500"
              />
              <select
                value={filter.status?.[0] || ''}
                onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value ? [e.target.value] : [] }))}
                className="px-4 py-2 bg-dark-bg-tertiary border border-dark-bg-tertiary rounded-lg text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-micmac-primary-500"
              >
                <option value="">Todos los estados</option>
                <option value="DRAFT">📝 Borradores</option>
                <option value="SETUP">🛠️ Configuración</option>
                <option value="ACTIVE">🚀 Activos</option>
                <option value="IN_REVIEW">🔍 En Revisión</option>
                <option value="COMPLETED">✅ Completados</option>
                <option value="ARCHIVED">📦 Archivados</option>
              </select>
            </div>
            <Button 
              color="primary"
              onClick={() => setIsCreateModalOpen(true)}
            >
              + Nuevo Proyecto
            </Button>
          </div>
        </div>

        {/* Lista de proyectos */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-dark-text-primary mb-6">
            Proyectos ({filteredProjects.length})
          </h2>

          {loadingProjects ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-pulse-slow rounded-full h-8 w-8 bg-micmac-primary-500"></div>
              <span className="ml-3 text-dark-text-secondary">Cargando proyectos...</span>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-lg font-medium text-dark-text-primary mb-2">
                No hay proyectos
              </h3>
              <p className="text-dark-text-secondary mb-6">
                {filter.search || filter.status?.length 
                  ? 'No se encontraron proyectos con esos filtros'
                  : 'Comienza creando tu primer análisis prospectivo MIC MAC'
                }
              </p>
              <Button color="primary" onClick={() => setIsCreateModalOpen(true)}>
                + Crear Primer Proyecto
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard 
                  key={project.id} 
                  project={project}
                  onEdit={() => handleEditProject(project)}
                />
              ))}
            </div>
          )}
        </div>
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

function ProjectCard({ project, onEdit }: { 
  project: Project
  onEdit?: () => void 
}) {
  const statusColors = {
    DRAFT: 'bg-gray-500/20 text-gray-400',
    SETUP: 'bg-yellow-500/20 text-yellow-400',
    ACTIVE: 'bg-micmac-primary-500/20 text-micmac-primary-300',
    IN_REVIEW: 'bg-purple-500/20 text-purple-400',
    COMPLETED: 'bg-micmac-secondary-500/20 text-micmac-secondary-300',
    ARCHIVED: 'bg-gray-600/20 text-gray-500'
  }

  const statusLabels = {
    DRAFT: 'Borrador',
    SETUP: 'Configuración',
    ACTIVE: 'Activo',
    IN_REVIEW: 'En Revisión',
    COMPLETED: 'Completado',
    ARCHIVED: 'Archivado'
  }

  return (
    <div 
      className="card-glow p-6 cursor-pointer transition-all duration-300 hover:scale-105"
      onClick={onEdit}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold text-dark-text-primary line-clamp-2">
          {project.name}
        </h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[project.status]}`}>
          {statusLabels[project.status]}
        </span>
      </div>
      
      <p className="text-sm text-dark-text-secondary mb-4 line-clamp-3">
        {project.description}
      </p>
      
      <div className="flex items-center justify-between text-sm text-dark-text-muted">
        <div className="flex items-center gap-4">
          <span>📊 {project._count?.variables || project.variables.length} variables</span>
          <span>👥 {project._count?.projectExperts || project.projectExperts.length} expertos</span>
        </div>
        <div className="text-xs">
          {new Date(project.updatedAt).toLocaleDateString()}
        </div>
      </div>
      
      {project.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {project.tags.slice(0, 3).map((tag: string) => (
            <span
              key={tag}
              className="px-2 py-1 bg-dark-bg-tertiary text-dark-text-muted rounded text-xs"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="px-2 py-1 text-dark-text-muted text-xs">
              +{project.tags.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
