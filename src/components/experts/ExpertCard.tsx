'use client'

import { Button } from '@/components/ui'
import { Expert } from '@/types/project'
import ExpertMetricsCard from './ExpertMetricsCard'
import { 
  TrendingUp, TrendingDown, Minus, Clock, Target, Users, 
  Award, AlertCircle, CheckCircle, Star, Zap, Brain, Edit, Trash2
} from 'lucide-react'
import { ExpertMetricsUtils } from '@/utils/expertMetricsCalculator'

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

  const metrics = expert.performanceMetrics
  const stats = expert.quickStats

  const getReliabilityColor = (priority?: string) => {
    switch (priority) {
      case 'HIGH': return 'text-green-400 bg-green-900/20'
      case 'MEDIUM': return 'text-blue-400 bg-blue-900/20'
      case 'LOW': return 'text-yellow-400 bg-yellow-900/20'
      case 'AVOID': return 'text-red-400 bg-red-900/20'
      default: return 'text-gray-400 bg-gray-900/20'
    }
  }

  const getTrendIcon = (trend?: number) => {
    if (!trend) return <Minus className="h-3 w-3 text-gray-400" />
    if (trend > 5) return <TrendingUp className="h-3 w-3 text-green-400" />
    if (trend < -5) return <TrendingDown className="h-3 w-3 text-red-400" />
    return <Minus className="h-3 w-3 text-gray-400" />
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700 hover:border-gray-600 transition-all hover:scale-[1.02] duration-300 h-full flex flex-col">
      {/* Header del experto */}
      <div className="flex items-start justify-between mb-4 gap-2">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="relative shrink-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm sm:text-base">
              {expert.avatar ? (
                <img 
                  src={expert.avatar} 
                  alt={expert.name}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                />
              ) : (
                expert.name.substring(0, 2).toUpperCase()
              )}
            </div>
            {metrics?.invitationPriority && (
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-xs ${
                getReliabilityColor(metrics.invitationPriority)
              }`}>
                {metrics.invitationPriority === 'HIGH' ? '🔥' : 
                 metrics.invitationPriority === 'MEDIUM' ? '⚡' :
                 metrics.invitationPriority === 'LOW' ? '⚠️' : '❌'}
              </div>
            )}
          </div>
          
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-white text-sm sm:text-base truncate" title={expert.name}>
              {expert.name}
            </h3>
            <p className="text-xs text-gray-400 truncate" title={expert.organization || undefined}>
              {expert.organization}
            </p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${roleColors[expert.role]}`}>
                {roleLabels[expert.role]}
              </span>
              {metrics?.trends && getTrendIcon(metrics.trends.last30Days)}
            </div>
          </div>
        </div>

        {/* Badges */}
        {metrics?.badges && metrics.badges.length > 0 && (
          <div className="flex gap-1 shrink-0">
            {metrics.badges.slice(0, 2).map((badge, index) => (
              <span 
                key={index}
                className="text-base sm:text-lg"
                title={`${badge.name} - ${badge.level}`}
              >
                {badge.icon}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Métricas principales */}
      {metrics && (
        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4">
          <div className="bg-gray-700/50 rounded-lg p-2 sm:p-3">
            <div className="flex items-center gap-1 sm:gap-2 mb-1">
              <Target className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400 shrink-0" />
              <span className="text-xs text-gray-400 truncate">Confiabilidad</span>
            </div>
            <div className={`text-base sm:text-lg font-bold ${ExpertMetricsUtils.getScoreColor(metrics.overallReliability)}`}>
              {metrics.overallReliability}%
            </div>
          </div>
          
          <div className="bg-gray-700/50 rounded-lg p-2 sm:p-3">
            <div className="flex items-center gap-1 sm:gap-2 mb-1">
              <Brain className="h-3 w-3 sm:h-4 sm:w-4 text-purple-400 shrink-0" />
              <span className="text-xs text-gray-400 truncate">Consistencia</span>
            </div>
            <div className={`text-base sm:text-lg font-bold ${ExpertMetricsUtils.getScoreColor(metrics.consistencyScore)}`}>
              {metrics.consistencyScore}%
            </div>
          </div>
        </div>
      )}

      {/* Estadísticas rápidas */}
      {stats && (
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-gray-400 min-w-0">
              <Users className="h-3 w-3 shrink-0" />
              <span className="truncate">Proyectos</span>
            </div>
            <span className="text-white font-medium shrink-0">{stats.totalInvitations}</span>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-gray-400 min-w-0">
              <CheckCircle className="h-3 w-3 shrink-0" />
              <span className="truncate">Completados</span>
            </div>
            <span className="text-white font-medium shrink-0">{stats.completionRate}%</span>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-gray-400 min-w-0">
              <Clock className="h-3 w-3 shrink-0" />
              <span className="truncate">Respuesta</span>
            </div>
            <span className="text-white font-medium shrink-0">
              {ExpertMetricsUtils.formatTime(stats.averageResponseTimeHours)}
            </span>
          </div>

          {stats.totalInconsistencies > 0 && (
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-gray-400 min-w-0">
                <AlertCircle className="h-3 w-3 shrink-0" />
                <span className="truncate">Inconsistencias</span>
              </div>
              <span className="text-yellow-400 font-medium shrink-0">{stats.totalInconsistencies}</span>
            </div>
          )}
        </div>
      )}

      {/* Áreas de expertise */}
      <div className="mb-4 flex-1">
        <div className="flex flex-wrap gap-1">
          {expert.expertiseAreas.slice(0, 2).map((exp) => (
            <span
              key={exp}
              className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs truncate max-w-full"
              title={exp}
            >
              {exp}
            </span>
          ))}
          {expert.expertiseAreas.length > 2 && (
            <span className="px-2 py-1 text-gray-400 text-xs shrink-0">
              +{expert.expertiseAreas.length - 2}
            </span>
          )}
        </div>
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-2 mt-auto">
        <Button
          ghost
          size="sm"
          onClick={onViewDetail}
          className="flex-1 text-xs min-w-0"
        >
          <span className="truncate">Ver Perfil</span>
        </Button>
        <button
          onClick={onEdit}
          className="p-2 hover:bg-gray-700 rounded transition-colors text-gray-400 hover:text-white shrink-0"
          title="Editar"
        >
          <Edit className="h-4 w-4" />
        </button>
        <button
          onClick={onDelete}
          className="p-2 hover:bg-gray-700 rounded transition-colors text-gray-400 hover:text-red-400 shrink-0"
          title="Eliminar"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Última actualización de métricas */}
      {metrics?.lastCalculated && (
        <div className="mt-3 pt-3 border-t border-gray-700">
          <p className="text-xs text-gray-500 truncate" title={`Métricas: ${new Date(metrics.lastCalculated).toLocaleDateString('es-ES')}`}>
            Métricas: {new Date(metrics.lastCalculated).toLocaleDateString('es-ES')}
          </p>
        </div>
      )}
    </div>
  )
}