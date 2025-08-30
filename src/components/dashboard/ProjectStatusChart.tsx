import React, { useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Project } from '@/types/project'

interface ProjectStatusChartProps {
  projects: Project[]
}

const STATUS_COLORS = {
  DRAFT: '#6B7280',
  SETUP: '#3B82F6', 
  ACTIVE: '#10B981',
  IN_REVIEW: '#F59E0B',
  COMPLETED: '#8B5CF6',
  ARCHIVED: '#6B7280'
}

const STATUS_LABELS = {
  DRAFT: 'Borrador',
  SETUP: 'Configuración', 
  ACTIVE: 'Activo',
  IN_REVIEW: 'En Revisión',
  COMPLETED: 'Completado',
  ARCHIVED: 'Archivado'
}

export default function ProjectStatusChart({ projects }: ProjectStatusChartProps) {
  const chartData = useMemo(() => {
    const statusCounts = projects.reduce((acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: STATUS_LABELS[status as keyof typeof STATUS_LABELS] || status,
      value: count,
      status: status,
      percentage: ((count / projects.length) * 100).toFixed(1)
    }))
  }, [projects])

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-xl p-4 shadow-2xl">
          <p className="text-white font-semibold mb-2">{data.name}</p>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-4">
              <span className="text-gray-300">Proyectos:</span>
              <span className="text-white font-medium">{data.value}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-gray-300">Porcentaje:</span>
              <span className="text-white font-medium">{data.percentage}%</span>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-3 mt-2 px-2">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-300 text-xs">
              {entry.value} ({entry.payload.percentage}%)
            </span>
          </div>
        ))}
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-gray-400">Sin datos para mostrar</p>
          <p className="text-gray-500 text-sm">Crea tu primer proyecto para ver la distribución</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="45%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={STATUS_COLORS[entry.status as keyof typeof STATUS_COLORS]}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth={1}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
