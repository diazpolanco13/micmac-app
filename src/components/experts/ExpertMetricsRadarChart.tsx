'use client'

import React from 'react'
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts'
import type { Expert } from '@/types/project'
import { ExpertMetricsUtils } from '@/utils/expertMetricsCalculator'

interface ExpertMetricsRadarChartProps {
  expert: Expert
  className?: string
  size?: 'small' | 'medium' | 'large'
}

export default function ExpertMetricsRadarChart({ 
  expert, 
  className = '',
  size = 'medium' 
}: ExpertMetricsRadarChartProps) {
  const metrics = expert.performanceMetrics
  const stats = expert.quickStats

  if (!metrics) {
    return (
      <div className={`bg-gray-800 rounded-lg p-6 text-center ${className}`}>
        <div className="text-gray-400">
          <div className="text-4xl mb-2">📊</div>
          <p>Sin métricas disponibles</p>
          <p className="text-xs mt-1">Las métricas se generan después de participar en proyectos</p>
        </div>
      </div>
    )
  }

  // Preparar datos para el gráfico de radar
  const radarData = [
    {
      metric: 'Confiabilidad',
      value: metrics.overallReliability,
      fullMark: 100,
      color: '#3B82F6', // blue-500
      description: 'Puntuación general de confiabilidad'
    },
    {
      metric: 'Consistencia',
      value: metrics.consistencyScore,
      fullMark: 100,
      color: '#8B5CF6', // violet-500
      description: 'Coherencia con otros expertos'
    },
    {
      metric: 'Participación',
      value: metrics.participationQuality,
      fullMark: 100,
      color: '#10B981', // emerald-500
      description: 'Calidad de participación activa'
    },
    {
      metric: 'Puntualidad',
      value: metrics.timeManagement,
      fullMark: 100,
      color: '#F59E0B', // amber-500
      description: 'Gestión del tiempo y cumplimiento'
    },
    {
      metric: 'Comunicación',
      value: metrics.communicationEffectiveness,
      fullMark: 100,
      color: '#EF4444', // red-500
      description: 'Efectividad en comunicación'
    }
  ]

  // Configuración de tamaños
  const sizeConfig = {
    small: { height: 200, fontSize: 10, strokeWidth: 1 },
    medium: { height: 300, fontSize: 12, strokeWidth: 2 },
    large: { height: 400, fontSize: 14, strokeWidth: 2 }
  }

  const config = sizeConfig[size]

  // Tooltip personalizado
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-gray-900 border border-gray-600 rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-white mb-1">{label}</p>
          <p className="text-blue-400 text-sm mb-1">
            Puntuación: <span className="font-bold">{data.value}%</span>
          </p>
          <p className="text-gray-300 text-xs">{data.description}</p>
        </div>
      )
    }
    return null
  }

  // Función para obtener el color según la puntuación
  const getScoreColor = (score: number) => {
    if (score >= 90) return '#10B981' // green-500
    if (score >= 75) return '#3B82F6' // blue-500
    if (score >= 60) return '#F59E0B' // amber-500
    if (score >= 40) return '#EF4444' // red-500
    return '#6B7280' // gray-500
  }

  return (
    <div className={`bg-gray-800 rounded-lg border border-gray-700 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              📊 Análisis de Desempeño
            </h3>
            <p className="text-sm text-gray-400">
              Métricas detalladas de {expert.name}
            </p>
          </div>
          
          {/* Puntuación general */}
          <div className="text-right">
            <div className={`text-2xl font-bold ${ExpertMetricsUtils.getScoreColor(metrics.overallReliability)}`}>
              {metrics.overallReliability}%
            </div>
            <div className="text-xs text-gray-400">General</div>
          </div>
        </div>
      </div>

      {/* Gráfico de Radar */}
      <div className="p-4" style={{ minHeight: config.height }}>
        <ResponsiveContainer width="100%" height={config.height} minHeight={config.height}>
          <RadarChart data={radarData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
            <PolarGrid 
              stroke="#374151" 
              strokeWidth={1}
            />
            <PolarAngleAxis 
              dataKey="metric" 
              tick={{ 
                fontSize: config.fontSize, 
                fill: '#D1D5DB' 
              }}
              className="text-gray-300"
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ 
                fontSize: config.fontSize - 1, 
                fill: '#9CA3AF' 
              }}
              tickFormatter={(value) => `${value}%`}
            />
            <Radar
              name="Puntuación"
              dataKey="value"
              stroke="#3B82F6"
              fill="#3B82F6"
              fillOpacity={0.2}
              strokeWidth={config.strokeWidth}
              dot={{ 
                r: 4, 
                fill: '#3B82F6',
                strokeWidth: 2,
                stroke: '#1E40AF'
              }}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Desglose detallado */}
      <div className="p-4 border-t border-gray-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {radarData.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getScoreColor(item.value) }}
                />
                <div>
                  <div className="text-sm font-medium text-white">{item.metric}</div>
                  <div className="text-xs text-gray-400">{item.description}</div>
                </div>
              </div>
              <div className={`text-lg font-bold ${ExpertMetricsUtils.getScoreColor(item.value)}`}>
                {item.value}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Estadísticas adicionales */}
      {stats && (
        <div className="p-4 border-t border-gray-700 bg-gray-700/20">
          <h4 className="text-sm font-semibold text-white mb-3">Estadísticas de Participación</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="text-center">
              <div className="text-xl font-bold text-blue-400">{stats.totalInvitations}</div>
              <div className="text-xs text-gray-400">Invitaciones</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-400">{stats.completionRate}%</div>
              <div className="text-xs text-gray-400">Completados</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-yellow-400">
                {ExpertMetricsUtils.formatTime(stats.averageResponseTimeHours)}
              </div>
              <div className="text-xs text-gray-400">Respuesta</div>
            </div>
            <div className="text-center">
              <div className={`text-xl font-bold ${stats.totalInconsistencies > 0 ? 'text-red-400' : 'text-green-400'}`}>
                {stats.totalInconsistencies}
              </div>
              <div className="text-xs text-gray-400">Inconsistencias</div>
            </div>
          </div>
        </div>
      )}

      {/* Badges */}
      {metrics.badges && metrics.badges.length > 0 && (
        <div className="p-4 border-t border-gray-700">
          <h4 className="text-sm font-semibold text-white mb-3">Logros Obtenidos</h4>
          <div className="flex flex-wrap gap-2">
            {metrics.badges.map((badge, index) => (
              <div 
                key={index}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                  badge.level === 'PLATINUM' ? 'bg-purple-900/20 border-purple-500/30 text-purple-300' :
                  badge.level === 'GOLD' ? 'bg-yellow-900/20 border-yellow-500/30 text-yellow-300' :
                  badge.level === 'SILVER' ? 'bg-gray-600/20 border-gray-500/30 text-gray-300' :
                  'bg-orange-900/20 border-orange-500/30 text-orange-300'
                }`}
              >
                <span className="text-lg">{badge.icon}</span>
                <div>
                  <div className="text-xs font-semibold">{badge.name}</div>
                  <div className="text-xs opacity-75">{badge.level}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tendencias */}
      {metrics.trends && (
        <div className="p-4 border-t border-gray-700">
          <h4 className="text-sm font-semibold text-white mb-3">Tendencias (Últimos 30 días)</h4>
          <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
            <div className="flex items-center gap-2">
              {metrics.trends.last30Days > 5 ? (
                <div className="flex items-center gap-1 text-green-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.94" />
                  </svg>
                  <span className="text-sm">Mejorando</span>
                </div>
              ) : metrics.trends.last30Days < -5 ? (
                <div className="flex items-center gap-1 text-red-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.511l-5.511-3.182" />
                  </svg>
                  <span className="text-sm">Declinando</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-gray-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                  </svg>
                  <span className="text-sm">Estable</span>
                </div>
              )}
            </div>
            <div className={`text-lg font-bold ${
              metrics.trends.last30Days > 0 ? 'text-green-400' :
              metrics.trends.last30Days < 0 ? 'text-red-400' : 'text-gray-400'
            }`}>
              {metrics.trends.last30Days > 0 ? '+' : ''}{metrics.trends.last30Days}%
            </div>
          </div>
        </div>
      )}

      {/* Footer con fecha de actualización */}
      <div className="p-3 border-t border-gray-700 bg-gray-900/50">
        <p className="text-xs text-gray-500 text-center">
          Métricas actualizadas: {new Date(metrics.lastCalculated).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>
    </div>
  )
}
