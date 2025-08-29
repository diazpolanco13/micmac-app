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
}

export default function RecentActivity({ activities, maxItems = 5 }: RecentActivityProps) {
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
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Actividad Reciente
        </h3>
        <div className="text-center py-8">
          <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">
            No hay actividad reciente
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Actividad Reciente
      </h3>
      
      <div className="space-y-4">
        {recentActivities.map((activity) => (
          <div
            key={activity.id}
            className={`flex items-start gap-3 p-3 rounded-lg border ${getActivityColor(activity.type)}`}
          >
            <div className="flex-shrink-0 mt-1">
              {getActivityIcon(activity.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {activity.title}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {activity.description}
              </p>
              {activity.projectName && (
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Proyecto: {activity.projectName}
                </p>
              )}
            </div>
            
            <div className="flex-shrink-0 text-xs text-gray-500 dark:text-gray-400">
              {formatTimeAgo(activity.timestamp)}
            </div>
          </div>
        ))}
      </div>
      
      {activities.length > maxItems && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
          <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
            Ver todas las actividades ({activities.length})
          </button>
        </div>
      )}
    </div>
  )
}
