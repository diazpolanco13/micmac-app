import React from 'react'
import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon, 
  ClockIcon, 
  UsersIcon, 
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArchiveBoxIcon
} from '@heroicons/react/24/outline'

interface DashboardMetricsProps {
  userRole: 'MODERATOR' | 'EXPERT'
  metrics: {
    totalProjects: number
    activeProjects: number
    completedProjects: number
    draftProjects: number
    totalExperts: number
    activeExperts: number
    totalVariables: number
    averageProjectDuration: number
    projectsThisMonth: number
    projectsLastMonth: number
    completionRate: number
    averageExpertScore: number
  }
}

export default function DashboardMetrics({ userRole, metrics }: DashboardMetricsProps) {
  const isModerator = userRole === 'MODERATOR'
  
  // Calcular tendencias
  const projectTrend = metrics.projectsThisMonth - metrics.projectsLastMonth
  const trendIcon = projectTrend >= 0 ? ArrowTrendingUpIcon : ArrowTrendingDownIcon
  const trendColor = projectTrend >= 0 ? 'text-green-400' : 'text-red-400'
  const trendText = projectTrend >= 0 ? 'Aumentó' : 'Disminuyó'

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Proyectos Activos */}
      <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/20 border border-blue-500/20 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-400">Proyectos Activos</p>
            <p className="text-2xl font-bold text-white">{metrics.activeProjects}</p>
          </div>
          <div className="p-3 bg-blue-500/20 rounded-lg">
            <DocumentTextIcon className="h-6 w-6 text-blue-400" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          {React.createElement(trendIcon, { className: `h-4 w-4 mr-1 ${trendColor}` })}
          <span className={trendColor}>
            {trendText} {Math.abs(projectTrend)} este mes
          </span>
        </div>
      </div>

      {/* Proyectos Completados */}
      <div className="bg-gradient-to-br from-green-500/10 to-green-600/20 border border-green-500/20 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-green-400">Completados</p>
            <p className="text-2xl font-bold text-white">{metrics.completedProjects}</p>
          </div>
          <div className="p-3 bg-green-500/20 rounded-lg">
            <CheckCircleIcon className="h-6 w-6 text-green-400" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <span className="text-green-400">
            {metrics.completionRate.toFixed(1)}% tasa de éxito
          </span>
        </div>
      </div>

      {/* Expertos Activos */}
      <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/20 border border-purple-500/20 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-purple-400">Expertos Activos</p>
            <p className="text-2xl font-bold text-white">{metrics.activeExperts}</p>
          </div>
          <div className="p-3 bg-purple-500/20 rounded-lg">
            <UsersIcon className="h-6 w-6 text-purple-400" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <span className="text-purple-400">
            {metrics.averageExpertScore.toFixed(1)} puntuación promedio
          </span>
        </div>
      </div>

      {/* Variables del Sistema */}
      <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/20 border border-orange-500/20 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-orange-400">Variables MIC MAC</p>
            <p className="text-2xl font-bold text-white">{metrics.totalVariables}</p>
          </div>
          <div className="p-3 bg-orange-500/20 rounded-lg">
            <DocumentTextIcon className="h-6 w-6 text-orange-400" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <span className="text-orange-400">
            {isModerator ? 'Total del sistema' : 'En tus proyectos'}
          </span>
        </div>
      </div>
    </div>
  )
}
