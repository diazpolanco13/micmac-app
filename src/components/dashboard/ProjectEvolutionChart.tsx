import React, { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Project } from '@/types/project'
import { format, startOfMonth, eachMonthOfInterval, subMonths } from 'date-fns'
import { es } from 'date-fns/locale'

interface ProjectEvolutionChartProps {
  projects: Project[]
}

export default function ProjectEvolutionChart({ projects }: ProjectEvolutionChartProps) {
  const chartData = useMemo(() => {
    const now = new Date()
    const startDate = startOfMonth(subMonths(now, 11)) // Últimos 12 meses
    const months = eachMonthOfInterval({ start: startDate, end: now })

    return months.map(month => {
      const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0)
      
      const created = projects.filter(p => {
        const createdAt = new Date(p.createdAt)
        return createdAt >= month && createdAt <= monthEnd
      }).length

      const completed = projects.filter(p => {
        const createdAt = new Date(p.createdAt)
        return createdAt >= month && createdAt <= monthEnd && p.status === 'COMPLETED'
      }).length

      const active = projects.filter(p => {
        const createdAt = new Date(p.createdAt)
        return createdAt >= month && createdAt <= monthEnd && p.status === 'ACTIVE'
      }).length

      return {
        month: format(month, 'MMM', { locale: es }),
        fullDate: format(month, 'MMMM yyyy', { locale: es }),
        created,
        completed,
        active,
        cumulative: projects.filter(p => new Date(p.createdAt) <= monthEnd).length
      }
    })
  }, [projects])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-xl p-4 shadow-2xl">
          <p className="text-white font-semibold mb-2">{data.fullDate}</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <span className="text-gray-300">Creados: {data.created}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
              <span className="text-gray-300">Completados: {data.completed}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
              <span className="text-gray-300">Activos: {data.active}</span>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-gray-700">
              <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
              <span className="text-gray-300">Total Acumulado: {data.cumulative}</span>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  if (projects.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📈</div>
          <p className="text-gray-400">Sin datos para mostrar</p>
          <p className="text-gray-500 text-sm">Crea tu primer proyecto para ver la evolución</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis 
            dataKey="month" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          
          <Line 
            type="monotone" 
            dataKey="created" 
            stroke="#60A5FA" 
            strokeWidth={3}
            dot={{ fill: '#60A5FA', strokeWidth: 2, r: 5 }}
            activeDot={{ r: 7, stroke: '#60A5FA', strokeWidth: 2, fill: '#1E40AF' }}
            name="Creados"
          />
          <Line 
            type="monotone" 
            dataKey="completed" 
            stroke="#34D399" 
            strokeWidth={3}
            dot={{ fill: '#34D399', strokeWidth: 2, r: 5 }}
            activeDot={{ r: 7, stroke: '#34D399', strokeWidth: 2, fill: '#059669' }}
            name="Completados"
          />
          <Line 
            type="monotone" 
            dataKey="active" 
            stroke="#FBBF24" 
            strokeWidth={3}
            dot={{ fill: '#FBBF24', strokeWidth: 2, r: 5 }}
            activeDot={{ r: 7, stroke: '#FBBF24', strokeWidth: 2, fill: '#D97706' }}
            name="Activos"
          />
          <Line 
            type="monotone" 
            dataKey="cumulative" 
            stroke="#A78BFA" 
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name="Acumulado"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
