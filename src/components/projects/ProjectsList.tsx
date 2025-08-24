'use client'

import { useState } from 'react'
import { Project } from '@/types/project'
import { Button } from '@/components/ui'

interface ProjectsListProps {
  projects: Project[]
  onEdit: (project: Project) => void
  title: string
  emptyMessage?: string
  showPagination?: boolean
  defaultItemsPerPage?: number
}

export default function ProjectsList({
  projects,
  onEdit,
  title,
  emptyMessage = 'No hay proyectos en esta categoría',
  showPagination = true,
  defaultItemsPerPage = 6
}: ProjectsListProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage)

  // Cálculos de paginación
  const totalPages = Math.ceil(projects.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProjects = projects.slice(startIndex, endIndex)

  // Manejar cambio de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Manejar cambio de elementos por página
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1) // Reset a la primera página
  }

  if (projects.length === 0) {
    return (
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-dark-text-primary mb-4">
          {title}
        </h2>
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📂</div>
          <p className="text-dark-text-secondary">{emptyMessage}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card p-6">
      {/* Header con controles */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-dark-text-primary">
          {title} ({projects.length})
        </h2>
        
        {showPagination && projects.length > 6 && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-dark-text-secondary">Mostrar:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="px-3 py-1 bg-dark-bg-tertiary border border-dark-bg-tertiary rounded-md text-dark-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-micmac-primary-500"
            >
              <option value={6}>6</option>
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={projects.length}>Todos</option>
            </select>
            <span className="text-sm text-dark-text-secondary">por página</span>
          </div>
        )}
      </div>

      {/* Grid de proyectos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {currentProjects.map((project) => (
          <ProjectCard 
            key={project.id} 
            project={project}
            onEdit={() => onEdit(project)}
          />
        ))}
      </div>

      {/* Paginación */}
      {showPagination && totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-dark-bg-tertiary">
          <div className="text-sm text-dark-text-secondary">
            Mostrando {startIndex + 1}-{Math.min(endIndex, projects.length)} de {projects.length} proyectos
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              ghost
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
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
                    return <span key={pageNumber} className="px-2 text-dark-text-muted">...</span>
                  }
                  if (pageNumber === totalPages - 1 && currentPage < totalPages - 3) {
                    return <span key={pageNumber} className="px-2 text-dark-text-muted">...</span>
                  }
                  return null
                }
                
                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`w-8 h-8 rounded text-sm transition-colors ${
                      isCurrentPage
                        ? 'bg-micmac-primary-500 text-white'
                        : 'text-dark-text-secondary hover:bg-dark-bg-tertiary'
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
            >
              Siguiente →
            </Button>
          </div>
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
