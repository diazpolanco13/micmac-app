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
      <div className="group relative overflow-hidden bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-400 mb-1">Proyectos Activos</p>
            <p className="text-3xl font-bold text-white mb-2">{metrics.activeProjects}</p>
            <div className="flex items-center text-xs">
              {React.createElement(trendIcon, { className: `h-3 w-3 mr-1 ${trendColor}` })}
              <span className={trendColor}>
                {trendText} {Math.abs(projectTrend)} este mes
              </span>
            </div>
          </div>
          <div className="p-4 bg-gradient-to-br from-blue-500/20 to-blue-600/30 rounded-xl group-hover:scale-110 transition-transform duration-300">
            <DocumentTextIcon className="h-8 w-8 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Proyectos Completados */}
      <div className="group relative overflow-hidden bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:border-emerald-500/30 transition-all duration-300">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-400 mb-1">Completados</p>
            <p className="text-3xl font-bold text-white mb-2">{metrics.completedProjects}</p>
            <div className="flex items-center text-xs">
              <span className="text-emerald-400">
                {metrics.completionRate.toFixed(1)}% tasa de éxito
              </span>
            </div>
          </div>
          <div className="p-4 bg-gradient-to-br from-emerald-500/20 to-emerald-600/30 rounded-xl group-hover:scale-110 transition-transform duration-300">
            <CheckCircleIcon className="h-8 w-8 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Expertos Activos */}
      <div className="group relative overflow-hidden bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:border-purple-500/30 transition-all duration-300">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-purple-600"></div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-purple-400 mb-1">Expertos Activos</p>
            <p className="text-3xl font-bold text-white mb-2">{metrics.activeExperts}</p>
            <div className="flex items-center text-xs">
              <span className="text-purple-400">
                {metrics.averageExpertScore.toFixed(1)} puntuación promedio
              </span>
            </div>
          </div>
          <div className="p-4 bg-gradient-to-br from-purple-500/20 to-purple-600/30 rounded-xl group-hover:scale-110 transition-transform duration-300">
            <UsersIcon className="h-8 w-8 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Variables del Sistema */}
      <div className="group relative overflow-hidden bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:border-orange-500/30 transition-all duration-300">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-orange-600"></div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-orange-400 mb-1">Variables MIC MAC</p>
            <p className="text-3xl font-bold text-white mb-2">{metrics.totalVariables}</p>
            <div className="flex items-center text-xs">
              <span className="text-orange-400">
                {isModerator ? 'Total del sistema' : 'En tus proyectos'}
              </span>
            </div>
          </div>
          <div className="p-4 bg-gradient-to-br from-orange-500/20 to-orange-600/30 rounded-xl group-hover:scale-110 transition-transform duration-300">
            <DocumentTextIcon className="h-8 w-8 text-orange-400" />
          </div>
        </div>
      </div>
    </div>
  )
}
