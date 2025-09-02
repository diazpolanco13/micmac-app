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
import type { ExpertiseArea } from '@/lib/supabase'

interface ExpertiseRadarChartProps {
  expertiseAreas: ExpertiseArea[]
}

export default function ExpertiseRadarChart({ expertiseAreas }: ExpertiseRadarChartProps) {
  
  // Preparar datos para el radar chart con MISMA FÓRMULA que modal y tarjetas
  const radarData = expertiseAreas.map(area => {
    // 🔄 USAR MISMA FÓRMULA DE CÁLCULO
    const calculateScore = (area: any) => {
      if (!area.yearsExperience) return 0
      
      // Base: años de experiencia (máximo 60 puntos)
      const experienceScore = Math.min(60, area.yearsExperience * 3)
      
      // Multiplicador por nivel
      const levelToNumber = { 'novice': 1, 'intermediate': 2, 'advanced': 4, 'expert': 5 }
      const proficiencyLevel = levelToNumber[area.level] || 3
      
      const levelMultiplier = {
        1: 0.6, 2: 0.8, 3: 1.0, 4: 1.2, 5: 1.4
      }[proficiencyLevel] || 1.0
      
      // Bonus por contextos (default 1)
      const contextBonus = 1 * 5
      
      const finalScore = Math.min(100, Math.max(10, 
        Math.round(experienceScore * levelMultiplier + contextBonus)
      ))
      
      return finalScore
    }
    
    const finalScore = calculateScore(area)
    
    return {
      area: area.name.length > 15 ? area.name.substring(0, 15) + '...' : area.name,
      fullName: area.name,
      score: finalScore,
      level: area.level,
      years: area.yearsExperience
    }
  })

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
