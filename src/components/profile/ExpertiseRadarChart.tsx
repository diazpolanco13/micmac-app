'use client'

import React from 'react'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend
} from 'recharts'
import type { ExpertiseArea } from '@/types/project'

interface ExpertiseRadarChartProps {
  expertiseAreas: ExpertiseArea[]
}

export default function ExpertiseRadarChart({ expertiseAreas }: ExpertiseRadarChartProps) {
  
  // Preparar datos para el radar chart
  const radarData = expertiseAreas.map(area => ({
    area: area.name.length > 15 ? area.name.substring(0, 15) + '...' : area.name,
    fullName: area.name,
    score: area.calculatedScore,
    level: area.level
  }))

  // Si no hay datos, mostrar placeholder
  if (expertiseAreas.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-dark-text-muted">
          <div className="text-3xl mb-2">📊</div>
          <p className="text-sm">Radar de Fortalezas</p>
          <p className="text-xs">Agrega áreas de expertise</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full" style={{ minHeight: '300px' }}>      
      <ResponsiveContainer width="100%" height="100%" minHeight={300}>
        <RadarChart data={radarData} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
          <PolarGrid 
            stroke="#374151"
            strokeWidth={1}
            strokeOpacity={0.6}
          />
          <PolarAngleAxis 
            dataKey="area" 
            tick={{ 
              fill: '#E5E7EB', 
              fontSize: 10,
              fontWeight: 250
            }}
            className="text-xs"
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 100]} 
            tick={{ 
              fill: '#9CA3AF', 
              fontSize: 8 
            }}
            tickCount={6}
            strokeOpacity={0.3}
          />
          <Radar
            name="Expertise Score"
            dataKey="score"
            stroke="#10B981"
            fill="#10B981"
            fillOpacity={0.25}
            strokeWidth={3}
            dot={{ 
              r: 2, 
              fill: '#10B981',
              strokeWidth: 1,
              stroke: '#FFFFFF'
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
