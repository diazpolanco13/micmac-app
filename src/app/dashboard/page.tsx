'use client'

/**
 * 📊 Dashboard Page - Panel principal con gestión de proyectos
 */

import { useMockAuth } from '@/contexts/MockAuthContext'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui'
import { DashboardSkeleton } from '@/components/ui/LoadingStates'
import CreateProjectModal from '@/components/projects/CreateProjectModal'
import ProjectEditModal from '@/components/projects/ProjectEditModal'
import AppLayout from '@/components/layout/AppLayout'
import MicMacTester from '@/components/testing/MicMacTester'
import { mockProjects } from '@/lib/mockData'

// Tipos locales para el dashboard
interface Project {
  id: string
  name: string
  description: string | null
  type: 'STRATEGIC' | 'TECHNOLOGICAL' | 'ENVIRONMENTAL' | 'SOCIAL' | 'ECONOMIC'
  status: 'DRAFT' | 'SETUP' | 'ACTIVE' | 'IN_REVIEW' | 'COMPLETED' | 'ARCHIVED'
  expectedExperts: number
  tags: string[]
  isPublic: boolean
  creatorId: string
  createdAt: string
  updatedAt: string
  creator: { name: string | null, email: string }
  variables: any[]
  projectExperts: any[]
  statusHistory: any[]
  _count?: { variables: number, projectExperts: number }
}

export default function DashboardPage() {
  const { user, loading } = useMockAuth()
  const router = useRouter()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [filter, setFilter] = useState({ 
    status: [] as string[], 
    search: '', 
    tags: [] as string[] 
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  const handleProjectCreated = () => {
    setIsCreateModalOpen(false)
  }

  const handleProjectUpdated = () => {
    setIsEditModalOpen(false)
    setSelectedProject(null)
  }

  const handleProjectDeleted = () => {
    setIsEditModalOpen(false)
    setSelectedProject(null)
  }

  const handleEditProject = (project: any) => {
    startLoading(`/projects/create?edit=${project.id}`)
    router.push(`/projects/create?edit=${project.id}`)
  }

  if (loading) {
    return (
      <AppLayout>
        <DashboardSkeleton />
      </AppLayout>
    )
  }

  if (!user) {
    return null // Se redirigirá a /auth
  }

  // Usar mock projects localmente
  const projects = mockProjects
  const loadingProjects = false

  // Filtrar proyectos localmente
  const filteredProjects = projects.filter((project: any) => {
    const statusMatch = filter.status.length === 0 || filter.status.includes(project.status.toLowerCase())
    const searchMatch = !filter.search || 
      project.name.toLowerCase().includes(filter.search.toLowerCase()) ||
      project.description?.toLowerCase().includes(filter.search.toLowerCase())
    const tagsMatch = filter.tags.length === 0 || 
      filter.tags.some(tag => project.tags.includes(tag))
    
    return statusMatch && searchMatch && tagsMatch
  })

  const stats = {
    active: projects.filter((p: any) => p.status === 'ACTIVE').length,
    completed: projects.filter((p: any) => p.status === 'COMPLETED').length,
    experts: projects.reduce((total: number, p: any) => total + (p._count?.projectExperts || p.projectExperts.length), 0)
  }

  return (
    <AppLayout onNewProject={() => setIsCreateModalOpen(true)}>
      <div className="w-full max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient mb-2">
            Dashboard MIC MAC Pro
          </h1>
          <p className="text-dark-text-secondary">
            Bienvenido, <span className="text-dark-text-primary font-medium">{user.name || user.email}</span>
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-micmac-primary-500/20 rounded-lg">
                <div className="w-6 h-6 text-micmac-primary-400">📊</div>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-dark-text-secondary">
                  Proyectos Activos
                </h3>
                <div className="text-2xl font-bold text-dark-text-primary">{stats.active}</div>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-micmac-secondary-500/20 rounded-lg">
                <div className="w-6 h-6 text-micmac-secondary-400">✅</div>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-dark-text-secondary">
                  Completados
                </h3>
                <div className="text-2xl font-bold text-dark-text-primary">{stats.completed}</div>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-micmac-accent-500/20 rounded-lg">
                <div className="w-6 h-6 text-micmac-accent-400">👥</div>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-dark-text-secondary">
                  Expertos Activos
                </h3>
                <div className="text-2xl font-bold text-dark-text-primary">{stats.experts}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content based on role */}
        {user.role === 'MODERATOR' ? (
          <ModeratorContent 
            projects={filteredProjects} 
            loading={loadingProjects}
            filter={filter}
            setFilter={setFilter}
            onEditProject={handleEditProject}
          />
        ) : (
          <ExpertContent 
            projects={filteredProjects}
            loading={loadingProjects}
            user={user}
            onEditProject={handleEditProject}
          />
        )}

        {/* Status de Automatización */}
        <div className="card p-6 mt-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="status-indicator status-active"></div>
            <h3 className="text-lg font-semibold text-dark-text-primary">
              🤖 Sistema de Automatización Activo
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-micmac-secondary-400">🧪</span>
              <span className="text-dark-text-secondary">@CursorTesting</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-micmac-secondary-400">📝</span>
              <span className="text-dark-text-secondary">@CursorGit</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-micmac-secondary-400">📊</span>
              <span className="text-dark-text-secondary">@CursorLinear</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-micmac-secondary-400">📚</span>
              <span className="text-dark-text-secondary">@CursorDocs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Crear Proyecto */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onProjectCreated={handleProjectCreated}
      />

      {/* Modal de Editar Proyecto */}
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

function ModeratorContent({ projects, loading, filter, setFilter, onEditProject }: {
  projects: Project[]
  loading: boolean
  filter: { status: string[]; search: string; tags: string[] }
  setFilter: (fn: (prev: any) => any) => void
  onEditProject: (project: Project) => void
}) {
  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-dark-text-primary">
          Mis Proyectos
        </h2>
        <div className="flex gap-2">
          <select 
            className="px-3 py-2 bg-dark-bg-tertiary border border-dark-bg-tertiary rounded-lg text-dark-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-micmac-primary-500"
            onChange={(e) => setFilter((prev: any) => ({ ...prev, status: e.target.value ? [e.target.value] : [] }))}
          >
            <option value="">Todos los estados</option>
            <option value="draft">📝 Borradores</option>
            <option value="setup">🛠️ Configuración</option>
            <option value="active">🚀 Activos</option>
            <option value="in_review">🔍 En Revisión</option>
            <option value="completed">✅ Completados</option>
            <option value="archived">📦 Archivados</option>
          </select>
        </div>
      </div>

      {loading ? (
        <DashboardSkeleton />
      ) : projects.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-lg font-medium text-dark-text-primary mb-2">
            No hay proyectos
          </h3>
          <p className="text-dark-text-secondary mb-6">
            Comienza creando tu primer análisis prospectivo MIC MAC
          </p>
          <Button color="primary">
            + Crear Primer Proyecto
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project}
              onEdit={() => onEditProject(project)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function ExpertContent({ projects, loading, user, onEditProject }: {
  projects: Project[]
  loading: boolean
  user: { email: string; id: string }
  onEditProject: (project: Project) => void
}) {
  // Filtrar proyectos donde el usuario actual es experto
  const myProjects = projects.filter(p => 
    p.projectExperts.some((pe: any) => pe.expert?.email === user.email)
  )
  
  return (
    <div className="space-y-6">
      {/* Invitaciones */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-dark-text-primary mb-4">
          📩 Invitaciones Pendientes
        </h2>
        <div className="text-center py-8">
          <p className="text-dark-text-muted">No hay invitaciones pendientes</p>
        </div>
      </div>

      {/* Mis Participaciones */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-dark-text-primary mb-4">
          🗳️ Mis Participaciones
        </h2>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-pulse-slow rounded-full h-6 w-6 bg-micmac-primary-500"></div>
            <span className="ml-3 text-dark-text-secondary">Cargando...</span>
          </div>
        ) : myProjects.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-dark-text-muted">No hay participaciones activas</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {myProjects.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project}
                onEdit={() => onEditProject(project)}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* 🧪 TESTING COMPONENT - Solo para desarrollo */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-12">
          <MicMacTester />
        </div>
      )}
    </div>
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
