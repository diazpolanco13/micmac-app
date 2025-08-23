'use client'

/**
 * 📊 Dashboard Page - Panel principal con gestión de proyectos
 */

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { mockProjects, getFilteredProjects } from '@/lib/mockData'
import { Project } from '@/types/project'
import { Button } from '@/components/ui'

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [projectsLoading, setProjectsLoading] = useState(true)
  const [filter, setFilter] = useState({ status: [], search: '', tags: [] })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  useEffect(() => {
    // Simular carga de proyectos
    const loadProjects = async () => {
      setProjectsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500)) // Simular delay
      const filtered = getFilteredProjects(filter)
      setProjects(filtered)
      setProjectsLoading(false)
    }

    if (user) {
      loadProjects()
    }
  }, [filter, user])

  if (loading) {
    return (
      <div className="min-h-screen bg-micmac-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse-slow rounded-full h-8 w-8 bg-micmac-primary-500 mx-auto mb-4"></div>
          <p className="text-dark-text-secondary">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Se redirigirá a /auth
  }

  const stats = {
    active: projects.filter(p => p.status === 'active').length,
    completed: projects.filter(p => p.status === 'completed').length,
    experts: new Set(projects.flatMap(p => p.experts.map(e => e.id))).size
  }

  return (
    <div className="min-h-screen bg-micmac-dark">
      {/* Header */}
      <div className="border-b border-dark-bg-tertiary bg-dark-bg-secondary/50 backdrop-blur-sm">
        <div className="container-app py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gradient mb-2">
                Dashboard MIC MAC Pro
              </h1>
              <p className="text-dark-text-secondary">
                Bienvenido, <span className="text-dark-text-primary font-medium">{user.name || user.email}</span>
              </p>
              <div className="mt-1 text-sm">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-micmac-primary-500/20 text-micmac-primary-300">
                  {user.role === 'MODERATOR' ? '📊 Moderador' : '🧑‍🔬 Experto'}
                </span>
              </div>
            </div>
            
            <div className="flex gap-3">
              {user.role === 'MODERATOR' && (
                <Button color="primary">
                  + Nuevo Proyecto
                </Button>
              )}
              <Button
                onClick={signOut}
                ghost
              >
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-app py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
            projects={projects} 
            loading={projectsLoading}
            filter={filter}
            setFilter={setFilter}
          />
        ) : (
          <ExpertContent 
            projects={projects}
            loading={projectsLoading}
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
    </div>
  )
}

function ModeratorContent({ projects, loading, filter, setFilter }: {
  projects: Project[]
  loading: boolean
  filter: any
  setFilter: any
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
            <option value="active">Activos</option>
            <option value="draft">Borradores</option>
            <option value="completed">Completados</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-pulse-slow rounded-full h-8 w-8 bg-micmac-primary-500"></div>
          <span className="ml-3 text-dark-text-secondary">Cargando proyectos...</span>
        </div>
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
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}

function ExpertContent({ projects, loading }: {
  projects: Project[]
  loading: boolean
}) {
  // Filtrar proyectos donde el usuario actual es experto
  const myProjects = projects.filter(p => p.experts.some(e => e.email === 'expert@micmac.com'))
  
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
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ProjectCard({ project }: { project: Project }) {
  const statusColors = {
    draft: 'bg-gray-500/20 text-gray-400',
    active: 'bg-micmac-primary-500/20 text-micmac-primary-300',
    completed: 'bg-micmac-secondary-500/20 text-micmac-secondary-300',
    archived: 'bg-gray-600/20 text-gray-500'
  }

  const statusLabels = {
    draft: 'Borrador',
    active: 'Activo',
    completed: 'Completado',
    archived: 'Archivado'
  }

  return (
    <div className="card-glow p-6 cursor-pointer transition-all duration-300 hover:scale-105">
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
          <span>📊 {project.variables.length} variables</span>
          <span>👥 {project.experts.length} expertos</span>
        </div>
        <div className="text-xs">
          {new Date(project.updatedAt).toLocaleDateString()}
        </div>
      </div>
      
      {project.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {project.tags.slice(0, 3).map((tag) => (
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