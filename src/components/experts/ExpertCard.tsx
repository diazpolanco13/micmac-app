'use client'

import { Button } from '@/components/ui'
import { Expert } from '@/types/project'

interface ExpertCardProps {
  expert: Expert
  onEdit: () => void
  onDelete: () => void
  onViewDetail: () => void
}

export default function ExpertCard({ 
  expert, 
  onEdit, 
  onDelete, 
  onViewDetail 
}: ExpertCardProps) {
  const roleColors = {
    EXPERT: 'bg-blue-500/20 text-blue-400',
    MODERATOR: 'bg-purple-500/20 text-purple-400'
  }

  const roleLabels = {
    EXPERT: 'Experto',
    MODERATOR: 'Moderador'
  }

  return (
    <div className="card-glow p-6 hover:scale-105 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-micmac-primary-500/10 rounded-full flex items-center justify-center">
            {expert.avatar ? (
              <img 
                src={expert.avatar} 
                alt={expert.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <span className="text-sm font-medium text-micmac-primary-600 dark:text-micmac-primary-400">
                {expert.name.split(' ').map(n => n[0]).join('')}
              </span>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-dark-text-primary">
              {expert.name}
            </h3>
            <p className="text-sm text-dark-text-secondary">{expert.email}</p>
          </div>
        </div>
        
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[expert.role]}`}>
          {roleLabels[expert.role]}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        {expert.organization && (
          <p className="text-sm text-dark-text-secondary">
            🏢 {expert.organization}
          </p>
        )}
        
        {expert.yearsExperience && (
          <p className="text-sm text-dark-text-secondary">
            📅 {expert.yearsExperience} años de experiencia
          </p>
        )}

        <div className="flex flex-wrap gap-1">
          {expert.expertiseAreas.slice(0, 3).map((exp) => (
            <span
              key={exp}
              className="px-2 py-1 bg-dark-bg-tertiary text-dark-text-muted rounded text-xs"
            >
              {exp}
            </span>
          ))}
          {expert.expertiseAreas.length > 3 && (
            <span className="px-2 py-1 text-dark-text-muted text-xs">
              +{expert.expertiseAreas.length - 3}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          ghost
          size="sm"
          onClick={onViewDetail}
          className="flex-1"
        >
          Ver Perfil
        </Button>
        <Button
          ghost
          size="sm"
          onClick={onEdit}
          className="px-3"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
          </svg>
        </Button>
        <Button
          ghost
          size="sm"
          onClick={onDelete}
          className="px-3 text-red-500 hover:text-red-700"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        </Button>
      </div>
    </div>
  )
}
