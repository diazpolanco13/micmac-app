import React from 'react'
import { 
  ClockIcon, 
  DocumentTextIcon, 
  UsersIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArchiveBoxIcon,
  PlusIcon
} from '@heroicons/react/24/outline'

interface Activity {
  id: string
  type: 'project_created' | 'project_updated' | 'expert_added' | 'voting_started' | 'voting_completed' | 'project_archived'
  title: string
  description: string
  timestamp: Date
  projectId?: string
  projectName?: string
  userId?: string
  userName?: string
}

interface RecentActivityProps {
  activities: Activity[]
  maxItems?: number
  fullWidth?: boolean
}

export default function RecentActivity({ activities, maxItems = 5, fullWidth = false }: RecentActivityProps) {
  const recentActivities = activities
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, maxItems)

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'project_created':
        return <PlusIcon className="h-5 w-5 text-green-500" />
      case 'project_updated':
        return <DocumentTextIcon className="h-5 w-5 text-blue-500" />
      case 'expert_added':
        return <UsersIcon className="h-5 w-5 text-purple-500" />
      case 'voting_started':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />
      case 'voting_completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'project_archived':
        return <ArchiveBoxIcon className="h-5 w-5 text-gray-500" />
      default:
        return <DocumentTextIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'project_created':
        return 'bg-green-500/10 border-green-500/20'
      case 'project_updated':
        return 'bg-blue-500/10 border-blue-500/20'
      case 'expert_added':
        return 'bg-purple-500/10 border-purple-500/20'
      case 'voting_started':
        return 'bg-yellow-500/10 border-yellow-500/20'
      case 'voting_completed':
        return 'bg-green-500/10 border-green-500/20'
      case 'project_archived':
        return 'bg-gray-500/10 border-gray-500/20'
      default:
        return 'bg-gray-500/10 border-gray-500/20'
    }
  }

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Ahora mismo'
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`
    if (diffInMinutes < 1440) return `Hace ${Math.floor(diffInMinutes / 60)}h`
    if (diffInMinutes < 43200) return `Hace ${Math.floor(diffInMinutes / 1440)}d`
    return `Hace ${Math.floor(diffInMinutes / 43200)}mes`
  }

  if (recentActivities.length === 0) {
    return (
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <div className="w-2 h-8 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"></div>
          Actividad Reciente
        </h3>
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-2xl flex items-center justify-center">
            <ClockIcon className="h-8 w-8 text-cyan-400" />
          </div>
          <p className="text-slate-400">
            No hay actividad reciente
          </p>
          <p className="text-slate-500 text-sm mt-2">
            Las actividades aparecerán cuando interactúes con el sistema
          </p>
        </div>
      </div>
    )
  }

  // Generar estado de conexión aleatorio para demo
  const getConnectionStatus = (activity: Activity) => {
    const hash = activity.id.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0)
      return a & a
    }, 0)
    return Math.abs(hash) % 3 === 0 // ~33% probabilidad de estar desconectado
  }

  if (fullWidth) {
    return (
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <div className="w-2 h-8 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"></div>
          Actividad Reciente y Estado de Conexión
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {recentActivities.map((activity) => {
            const isConnected = !getConnectionStatus(activity)
            return (
              <div
                key={activity.id}
                className="group p-4 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:border-slate-600/50 hover:bg-slate-800/50 transition-all duration-200"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-shrink-0 p-2 bg-slate-700/50 rounded-lg group-hover:scale-110 transition-transform duration-200">
                    {getActivityIcon(activity.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white mb-1 truncate">
                      {activity.title}
                    </p>
                    <p className="text-xs text-slate-400 font-medium bg-slate-700/30 px-2 py-1 rounded-md inline-block">
                      {formatTimeAgo(activity.timestamp)}
                    </p>
                  </div>
                </div>
                
                <p className="text-sm text-slate-300 leading-relaxed mb-3 line-clamp-2">
                  {activity.description}
                </p>
                
                <div className="flex items-center justify-between">
                  {activity.projectName && (
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-slate-700/30 rounded-md">
                      <DocumentTextIcon className="h-3 w-3 text-slate-400" />
                      <span className="text-xs text-slate-400 truncate max-w-20">{activity.projectName}</span>
                    </div>
                  )}
                  
                  {/* Indicador de Conexión */}
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
                    <span className={`text-xs font-medium ${isConnected ? 'text-green-400' : 'text-gray-400'}`}>
                      {isConnected ? 'Conectado' : 'Desconectado'}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
        {activities.length > maxItems && (
          <div className="mt-6 pt-4 border-t border-slate-700/50 text-center">
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105">
              <ClockIcon className="h-4 w-4" />
              Ver todas las actividades ({activities.length})
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
        <div className="w-2 h-8 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"></div>
        Actividad Reciente
      </h3>
      
      <div className="space-y-3">
        {recentActivities.map((activity) => (
          <div
            key={activity.id}
            className="group flex items-start gap-3 p-4 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:border-slate-600/50 hover:bg-slate-800/50 transition-all duration-200"
          >
            <div className="flex-shrink-0 mt-1 p-2 bg-slate-700/50 rounded-lg group-hover:scale-110 transition-transform duration-200">
              {getActivityIcon(activity.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white mb-1">
                {activity.title}
              </p>
              <p className="text-sm text-slate-300 leading-relaxed">
                {activity.description}
              </p>
              {activity.projectName && (
                <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-slate-700/30 rounded-md">
                  <DocumentTextIcon className="h-3 w-3 text-slate-400" />
                  <span className="text-xs text-slate-400">{activity.projectName}</span>
                </div>
              )}
            </div>
            
            <div className="flex-shrink-0 text-xs text-slate-400 font-medium bg-slate-700/30 px-2 py-1 rounded-md">
              {formatTimeAgo(activity.timestamp)}
            </div>
          </div>
        ))}
      </div>
      
      {activities.length > maxItems && (
        <div className="mt-6 pt-4 border-t border-slate-700/50 text-center">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105">
            <ClockIcon className="h-4 w-4" />
            Ver todas las actividades ({activities.length})
          </button>
        </div>
      )}
    </div>
  )
}
