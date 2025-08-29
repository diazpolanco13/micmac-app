import React from 'react'
import { Project } from '@/types/project'

interface ProjectCardProps {
  project: Project
  onEdit?: () => void
}

export default function ProjectCard({ project, onEdit }: ProjectCardProps) {
  const statusColors = {
    DRAFT: 'bg-gray-500/20 text-gray-400',
    SETUP: 'bg-yellow-500/20 text-yellow-400',
    ACTIVE: 'bg-blue-500/20 text-blue-400',
    IN_REVIEW: 'bg-purple-500/20 text-purple-400',
    COMPLETED: 'bg-green-500/20 text-green-400',
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
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg"
      onClick={onEdit}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
          {project.name}
        </h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[project.status] || 'bg-gray-500/20 text-gray-400'}`}>
          {statusLabels[project.status] || 'Desconocido'}
        </span>
      </div>
      
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
        {project.description || 'Sin descripción'}
      </p>
      
      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-4">
          <span>📊 {project._count?.variables || project.variables?.length || 0} variables</span>
          <span>👥 {project._count?.projectExperts || project.projectExperts?.length || 0} expertos</span>
        </div>
        <div className="text-xs">
          {new Date(project.updatedAt || project.createdAt).toLocaleDateString('es-ES')}
        </div>
      </div>
      
      {project.tags && project.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {project.tags.slice(0, 3).map((tag: string) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="px-2 py-1 text-gray-500 dark:text-gray-400 text-xs">
              +{project.tags.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

