import React, { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { Expert } from '@/types/project'

interface ExpertPerformanceChartProps {
  experts: Expert[]
}

export default function ExpertPerformanceChart({ experts }: ExpertPerformanceChartProps) {
  const topExperts = useMemo(() => {
    return experts
      .filter(expert => expert.performanceMetrics)
      .sort((a, b) => (b.performanceMetrics?.overallReliability || 0) - (a.performanceMetrics?.overallReliability || 0))
      .slice(0, 8)
      .map(expert => ({
        name: expert.name.split(' ').slice(0, 2).join(' '), // Nombre corto
        fullName: expert.name,
        reliability: expert.performanceMetrics?.overallReliability || 0,
        consistency: expert.performanceMetrics?.consistencyScore || 0,
        participation: expert.performanceMetrics?.participationQuality || 0,
        timeManagement: expert.performanceMetrics?.timeManagement || 0,
        communication: expert.performanceMetrics?.communicationEffectiveness || 0,
        projects: expert.totalProjectsParticipated,
        responseTime: expert.averageResponseTime || 0
      }))
  }, [experts])

  const averageMetrics = useMemo(() => {
    if (experts.length === 0) return []
    
    const validExperts = experts.filter(e => e.performanceMetrics)
    if (validExperts.length === 0) return []

    return [
      {
        subject: 'Confiabilidad',
        value: validExperts.reduce((sum, e) => sum + (e.performanceMetrics?.overallReliability || 0), 0) / validExperts.length,
        fullMark: 100
      },
      {
        subject: 'Consistencia',
        value: validExperts.reduce((sum, e) => sum + (e.performanceMetrics?.consistencyScore || 0), 0) / validExperts.length,
        fullMark: 100
      },
      {
        subject: 'Participación',
        value: validExperts.reduce((sum, e) => sum + (e.performanceMetrics?.participationQuality || 0), 0) / validExperts.length,
        fullMark: 100
      },
      {
        subject: 'Tiempo',
        value: validExperts.reduce((sum, e) => sum + (e.performanceMetrics?.timeManagement || 0), 0) / validExperts.length,
        fullMark: 100
      },
      {
        subject: 'Comunicación',
        value: validExperts.reduce((sum, e) => sum + (e.performanceMetrics?.communicationEffectiveness || 0), 0) / validExperts.length,
        fullMark: 100
      }
    ]
  }, [experts])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-xl p-4 shadow-2xl">
          <p className="text-white font-semibold mb-2">{data.fullName}</p>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-4">
              <span className="text-gray-300">Confiabilidad:</span>
              <span className="text-orange-400 font-medium">{data.reliability}%</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-gray-300">Proyectos:</span>
              <span className="text-white font-medium">{data.projects}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-gray-300">Tiempo respuesta:</span>
              <span className="text-white font-medium">{data.responseTime}h</span>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  if (experts.length === 0 || topExperts.length === 0) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="h-80 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">👥</div>
            <p className="text-gray-400">Sin expertos registrados</p>
            <p className="text-gray-500 text-sm">Invita expertos para ver su performance</p>
          </div>
        </div>
        <div className="h-80 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-gray-400">Sin métricas disponibles</p>
            <p className="text-gray-500 text-sm">Las métricas aparecerán tras completar proyectos</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Ranking de Expertos */}
      <div>
        <h4 className="text-md font-semibold text-white mb-3">Top Expertos por Confiabilidad</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topExperts} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 11 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="reliability" 
                fill="url(#expertGradient)"
                radius={[4, 4, 0, 0]}
                stroke="rgba(251, 146, 60, 0.3)"
                strokeWidth={1}
              />
              <defs>
                <linearGradient id="expertGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FB923C" />
                  <stop offset="100%" stopColor="#EA580C" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Radar de Métricas Promedio */}
      <div>
        <h4 className="text-md font-semibold text-white mb-3">Métricas Promedio del Sistema</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={averageMetrics}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]}
                tick={{ fill: '#9CA3AF', fontSize: 10 }}
              />
              <Radar
                name="Promedio"
                dataKey="value"
                stroke="#10B981"
                fill="rgba(16, 185, 129, 0.2)"
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
