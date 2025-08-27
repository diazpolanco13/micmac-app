'use client'

import React from 'react'
import { 
  TrendingUp, TrendingDown, Minus, Clock, Target, Users, 
  Award, AlertCircle, CheckCircle, Star, Zap, Brain
} from 'lucide-react'
import type { Expert } from '@/types/project'
import { ExpertMetricsUtils } from '@/utils/expertMetricsCalculator'

interface ExpertMetricsCardProps {
  expert: Expert
  showDetailed?: boolean
  className?: string
}

export default function ExpertMetricsCard({ 
  expert, 
  showDetailed = false, 
  className = '' 
}: ExpertMetricsCardProps) {
  const metrics = expert.performanceMetrics
  const stats = expert.quickStats

  if (!metrics && !stats) {
    return (
      <div className={`bg-gray-800 rounded-lg p-4 ${className}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center text-white font-bold">
            {expert.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h4 className="font-semibold text-white">{expert.name}</h4>
            <p className="text-xs text-gray-400">Sin métricas disponibles</p>
          </div>
        </div>
      </div>
    )
  }

  const getReliabilityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'text-green-400 bg-green-900/20'
      case 'MEDIUM': return 'text-blue-400 bg-blue-900/20'
      case 'LOW': return 'text-yellow-400 bg-yellow-900/20'
      case 'AVOID': return 'text-red-400 bg-red-900/20'
      default: return 'text-gray-400 bg-gray-900/20'
    }
  }

  const getTrendIcon = (trend: number) => {
    if (trend > 5) return <TrendingUp className="h-3 w-3 text-green-400" />
    if (trend < -5) return <TrendingDown className="h-3 w-3 text-red-400" />
    return <Minus className="h-3 w-3 text-gray-400" />
  }

  return (
    <div className={`bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-all ${className}`}>
      {/* Header del experto */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
              {expert.name.substring(0, 2).toUpperCase()}
            </div>
            {metrics?.invitationPriority && (
              <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                getReliabilityColor(metrics.invitationPriority)
              }`}>
                {metrics.invitationPriority === 'HIGH' ? '🔥' : 
                 metrics.invitationPriority === 'MEDIUM' ? '⚡' :
                 metrics.invitationPriority === 'LOW' ? '⚠️' : '❌'}
              </div>
            )}
          </div>
          
          <div>
            <h4 className="font-semibold text-white">{expert.name}</h4>
            <p className="text-xs text-gray-400">{expert.organization}</p>
            {metrics && (
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  getReliabilityColor(metrics.invitationPriority)
                }`}>
                  {ExpertMetricsUtils.getReliabilityLabel(metrics.invitationPriority)}
                </span>
                {metrics.trends && getTrendIcon(metrics.trends.last30Days)}
              </div>
            )}
          </div>
        </div>

        {/* Badges */}
        {metrics?.badges && metrics.badges.length > 0 && (
          <div className="flex gap-1">
            {metrics.badges.slice(0, 3).map((badge, index) => (
              <span 
                key={index}
                className="text-lg"
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
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-700/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Target className="h-4 w-4 text-blue-400" />
              <span className="text-xs text-gray-400">Confiabilidad</span>
            </div>
            <div className={`text-lg font-bold ${ExpertMetricsUtils.getScoreColor(metrics.overallReliability)}`}>
              {metrics.overallReliability}%
            </div>
          </div>
          
          <div className="bg-gray-700/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Brain className="h-4 w-4 text-purple-400" />
              <span className="text-xs text-gray-400">Consistencia</span>
            </div>
            <div className={`text-lg font-bold ${ExpertMetricsUtils.getScoreColor(metrics.consistencyScore)}`}>
              {metrics.consistencyScore}%
            </div>
          </div>
        </div>
      )}

      {/* Estadísticas rápidas */}
      {stats && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-gray-400">
              <Users className="h-3 w-3" />
              <span>Proyectos</span>
            </div>
            <span className="text-white font-medium">{stats.totalInvitations}</span>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-gray-400">
              <CheckCircle className="h-3 w-3" />
              <span>Completados</span>
            </div>
            <span className="text-white font-medium">{stats.completionRate}%</span>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-gray-400">
              <Clock className="h-3 w-3" />
              <span>Respuesta</span>
            </div>
            <span className="text-white font-medium">
              {ExpertMetricsUtils.formatTime(stats.averageResponseTimeHours)}
            </span>
          </div>

          {stats.totalInconsistencies > 0 && (
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-gray-400">
                <AlertCircle className="h-3 w-3" />
                <span>Inconsistencias</span>
              </div>
              <span className="text-yellow-400 font-medium">{stats.totalInconsistencies}</span>
            </div>
          )}
        </div>
      )}

      {/* Detalles expandidos */}
      {showDetailed && metrics && (
        <div className="mt-4 pt-4 border-t border-gray-700 space-y-3">
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className={`text-sm font-bold ${ExpertMetricsUtils.getScoreColor(metrics.participationQuality)}`}>
                {metrics.participationQuality}%
              </div>
              <div className="text-gray-400">Participación</div>
            </div>
            <div className="text-center">
              <div className={`text-sm font-bold ${ExpertMetricsUtils.getScoreColor(metrics.timeManagement)}`}>
                {metrics.timeManagement}%
              </div>
              <div className="text-gray-400">Puntualidad</div>
            </div>
            <div className="text-center">
              <div className={`text-sm font-bold ${ExpertMetricsUtils.getScoreColor(metrics.communicationEffectiveness)}`}>
                {metrics.communicationEffectiveness}%
              </div>
              <div className="text-gray-400">Comunicación</div>
            </div>
          </div>

          {/* Tendencia de los últimos 30 días */}
          {metrics.trends && (
            <div className="bg-gray-700/30 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Tendencia (30 días)</span>
                <div className="flex items-center gap-1">
                  {getTrendIcon(metrics.trends.last30Days)}
                  <span className={`text-xs font-medium ${
                    metrics.trends.last30Days > 0 ? 'text-green-400' :
                    metrics.trends.last30Days < 0 ? 'text-red-400' : 'text-gray-400'
                  }`}>
                    {metrics.trends.last30Days > 0 ? '+' : ''}{metrics.trends.last30Days}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Áreas de expertise preferidas */}
          {stats?.preferredProjectTypes && stats.preferredProjectTypes.length > 0 && (
            <div>
              <div className="text-xs text-gray-400 mb-2">Especialización</div>
              <div className="flex flex-wrap gap-1">
                {stats.preferredProjectTypes.slice(0, 3).map(type => (
                  <span key={type} className="px-2 py-1 bg-blue-900/30 text-blue-300 text-xs rounded">
                    {type}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Última actualización */}
      {metrics?.lastCalculated && (
        <div className="mt-3 pt-3 border-t border-gray-700">
          <p className="text-xs text-gray-500">
            Actualizado: {new Date(metrics.lastCalculated).toLocaleDateString('es-ES')}
          </p>
        </div>
      )}
    </div>
  )
}
