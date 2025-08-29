import React, { useState, useMemo } from 'react'
import { Button } from '@/components/ui/Button'
import ProjectCard from '@/components/projects/ProjectCard'
import { Project } from '@/types/project'

interface DashboardProjectsProps {
  projects: Project[]
  title: string
  userRole: 'MODERATOR' | 'EXPERT'
  onEditProject: (project: Project) => void
  showCreateButton?: boolean
  onCreateProject?: () => void
}

export default function DashboardProjects({ 
  projects, 
  title, 
  userRole, 
  onEditProject, 
  showCreateButton = false,
  onCreateProject 
}: DashboardProjectsProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(6)

  // Calcular paginación
  const totalPages = Math.ceil(projects.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProjects = projects.slice(startIndex, endIndex)

  // Cambiar página
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Cambiar items por página
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1) // Reset a primera página
  }

  // Obtener estadísticas de proyectos
  const projectStats = useMemo(() => {
    const stats = {
      draft: projects.filter(p => p.status === 'DRAFT').length,
      active: projects.filter(p => p.status === 'ACTIVE').length,
      completed: projects.filter(p => p.status === 'COMPLETED').length,
      archived: projects.filter(p => p.status === 'ARCHIVED').length
    }
    return stats
  }, [projects])

  if (projects.length === 0) {
    return (
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center">
          <div className="text-4xl">📊</div>
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">
          No hay proyectos
        </h3>
        <p className="text-slate-400 mb-8 max-w-md mx-auto leading-relaxed">
          {userRole === 'MODERATOR' 
            ? 'Comienza creando tu primer análisis prospectivo MIC MAC y descubre el poder de la metodología estructural'
            : 'Aún no has sido invitado a ningún proyecto. Los moderadores te invitarán cuando necesiten tu expertise'
          }
        </p>

      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
      {/* Header con estadísticas y controles */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
            <div className="w-2 h-8 bg-gradient-to-b from-indigo-400 to-purple-500 rounded-full"></div>
            {title} ({projects.length})
          </h2>
          
          {/* Estadísticas rápidas */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-700/30 rounded-lg">
              <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
              <span className="text-slate-300">
                Borradores: {projectStats.draft}
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-700/30 rounded-lg">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span className="text-slate-300">
                Activos: {projectStats.active}
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-700/30 rounded-lg">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              <span className="text-slate-300">
                Completados: {projectStats.completed}
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-700/30 rounded-lg">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              <span className="text-slate-300">
                Archivados: {projectStats.archived}
              </span>
            </div>
          </div>
        </div>
        
        {/* Controles de paginación */}
        {projects.length > 6 && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400">Mostrar:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={6}>6</option>
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={projects.length}>Todos</option>
            </select>
            <span className="text-sm text-slate-400">por página</span>
          </div>
        )}
      </div>

      {/* Grid de proyectos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {currentProjects.map((project) => (
          <ProjectCard 
            key={project.id} 
            project={project}
            onEdit={() => onEditProject(project)}
          />
        ))}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-700/50">
          <div className="text-sm text-slate-400">
            Mostrando {startIndex + 1}-{Math.min(endIndex, projects.length)} de {projects.length} proyectos
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              ghost
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="text-slate-400 hover:text-white hover:bg-slate-700/50"
            >
              ← Anterior
            </Button>
            
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1
                const isCurrentPage = pageNumber === currentPage
                
                // Mostrar solo páginas relevantes
                const showPage = pageNumber === 1 || 
                                pageNumber === totalPages || 
                                Math.abs(pageNumber - currentPage) <= 1
                
                if (!showPage) {
                  // Mostrar puntos suspensivos
                  if (pageNumber === 2 && currentPage > 4) {
                    return <span key={pageNumber} className="px-2 text-slate-500">...</span>
                  }
                  if (pageNumber === totalPages - 1 && currentPage < totalPages - 3) {
                    return <span key={pageNumber} className="px-2 text-slate-500">...</span>
                  }
                  return null
                }
                
                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`w-8 h-8 rounded-lg text-sm transition-all duration-200 ${
                      isCurrentPage
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                        : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                    }`}
                  >
                    {pageNumber}
                  </button>
                )
              })}
            </div>
            
            <Button
              ghost
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="text-slate-400 hover:text-white hover:bg-slate-700/50"
            >
              Siguiente →
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
