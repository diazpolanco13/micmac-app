'use client'

import { Button } from '@/components/ui'
import { Expert } from '@/types/project'
import ExpertMetricsRadarChart from './ExpertMetricsRadarChart'

interface ExpertDetailModalProps {
  expert: Expert
  onClose: () => void
  onEdit: () => void
}

export default function ExpertDetailModal({ 
  expert, 
  onClose, 
  onEdit 
}: ExpertDetailModalProps) {
  const roleColors = {
    EXPERT: 'bg-blue-500/20 text-blue-400',
    MODERATOR: 'bg-purple-500/20 text-purple-400'
  }

  const roleLabels = {
    EXPERT: 'Experto',
    MODERATOR: 'Moderador'
  }

  return (
    <div className="fixed inset-0 z-[80] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-dark-bg-secondary rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-dark-bg-tertiary">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-micmac-primary-500/10 rounded-full flex items-center justify-center">
                {expert.avatar ? (
                  <img 
                    src={expert.avatar} 
                    alt={expert.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-lg font-medium text-micmac-primary-600 dark:text-micmac-primary-400">
                    {expert.name.split(' ').map(n => n[0]).join('')}
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-dark-text-primary">
                  {expert.name}
                </h3>
                <p className="text-dark-text-secondary">{expert.email}</p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${roleColors[expert.role]}`}>
                  {roleLabels[expert.role]}
                </span>
              </div>
            </div>
            <Button ghost onClick={onClose} className="h-8 w-8 p-0">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-dark-text-primary mb-2">Información de Contacto</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-dark-text-secondary">📧</span>
                    <span className="text-dark-text-primary">{expert.email}</span>
                  </div>
                  
                  {expert.phone && (
                    <div className="flex items-center gap-2">
                      <span className="text-dark-text-secondary">📱</span>
                      <span className="text-dark-text-primary">{expert.phone}</span>
                    </div>
                  )}
                  
                  {expert.organization && (
                    <div className="flex items-center gap-2">
                      <span className="text-dark-text-secondary">🏢</span>
                      <span className="text-dark-text-primary">{expert.organization}</span>
                    </div>
                  )}
                  
                  {expert.linkedinUrl && (
                    <div className="flex items-center gap-2">
                      <span className="text-dark-text-secondary">💼</span>
                      <a 
                        href={expert.linkedinUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-micmac-primary-400 hover:text-micmac-primary-300 transition-colors"
                      >
                        LinkedIn Profile
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-dark-text-primary mb-2">Estadísticas</h4>
                <div className="space-y-2 text-sm">
                  {expert.yearsExperience && (
                    <div className="flex items-center justify-between">
                      <span className="text-dark-text-secondary">Experiencia:</span>
                      <span className="text-dark-text-primary">{expert.yearsExperience} años</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-dark-text-secondary">Proyectos:</span>
                    <span className="text-dark-text-primary">{expert.totalProjectsParticipated}</span>
                  </div>
                  
                  {expert.averageResponseTime && (
                    <div className="flex items-center justify-between">
                      <span className="text-dark-text-secondary">Tiempo respuesta:</span>
                      <span className="text-dark-text-primary">{Math.round(expert.averageResponseTime)}h promedio</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-dark-text-secondary">Estado:</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      expert.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {expert.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  
                  {expert.lastLoginAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-dark-text-secondary">Último acceso:</span>
                      <span className="text-dark-text-primary text-xs">
                        {new Date(expert.lastLoginAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Gráfico de Métricas de Desempeño */}
          <ExpertMetricsRadarChart expert={expert} size="large" />

          {/* Biografía */}
          {expert.biography && (
            <div>
              <h4 className="font-medium text-dark-text-primary mb-2">Biografía</h4>
              <p className="text-sm text-dark-text-secondary leading-relaxed">
                {expert.biography}
              </p>
            </div>
          )}

          {/* Áreas de Expertise */}
          <div>
            <h4 className="font-medium text-dark-text-primary mb-3">Áreas de Expertise ({expert.expertiseAreas.length})</h4>
            <div className="flex flex-wrap gap-2">
              {expert.expertiseAreas.map((exp) => (
                <span
                  key={exp}
                  className="px-3 py-1 bg-micmac-primary-500/20 text-micmac-primary-300 rounded-full text-sm"
                >
                  {exp}
                </span>
              ))}
            </div>
          </div>

          {/* Notas */}
          {expert.notes && (
            <div>
              <h4 className="font-medium text-dark-text-primary mb-2">Notas Internas</h4>
              <p className="text-sm text-dark-text-secondary bg-dark-bg-tertiary p-3 rounded-md">
                {expert.notes}
              </p>
            </div>
          )}

          {/* Fechas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-dark-bg-tertiary">
            <div>
              <span className="text-xs text-dark-text-muted">Creado:</span>
              <p className="text-sm text-dark-text-secondary">
                {new Date(expert.createdAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div>
              <span className="text-xs text-dark-text-muted">Última actualización:</span>
              <p className="text-sm text-dark-text-secondary">
                {new Date(expert.updatedAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-dark-bg-tertiary bg-dark-bg-primary flex items-center justify-between">
          <div className="text-sm text-dark-text-secondary">
            ID: {expert.id}
          </div>
          <div className="flex items-center gap-3">
            <Button ghost onClick={onClose}>
              Cerrar
            </Button>
            <Button color="primary" onClick={onEdit}>
              Editar Experto
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
