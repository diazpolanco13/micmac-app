'use client'

/**
 * 🚀 Dashboard Page - Panel principal inteligente con métricas reales
 * Aplica correctamente el límite de 6 proyectos por página
 */

import { useMockAuth } from '@/contexts/MockAuthContext'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/Button'
import { DashboardSkeleton } from '@/components/ui/LoadingStates'
import AppLayout from '@/components/layout/AppLayout'
import DashboardMetrics from '@/components/dashboard/DashboardMetrics'
import DashboardProjects from '@/components/dashboard/DashboardProjects'
import RecentActivity from '@/components/dashboard/RecentActivity'
import { useMockData } from '@/contexts/MockDataContext'
import { useNavigationLoading } from '@/contexts/NavigationLoadingContext'
import type { Project } from '@/types/project'
import { 
  PlusIcon, 
  CalendarIcon, 
  UsersIcon, 
  DocumentTextIcon,
  ChartBarIcon,
  CogIcon
} from '@heroicons/react/24/outline'

export default function DashboardPage() {
  const { user, loading } = useMockAuth()
  const { projects, experts } = useMockData()
  const { startLoading } = useNavigationLoading()
  const router = useRouter()

  // Calcular métricas reales del sistema
  const metrics = useMemo(() => {
    if (!projects || !experts) return {
      totalProjects: 0,
      activeProjects: 0,
      completedProjects: 0,
      draftProjects: 0,
      totalExperts: 0,
      activeExperts: 0,
      totalVariables: 0,
      averageProjectDuration: 7,
      projectsThisMonth: 0,
      projectsLastMonth: 0,
      completionRate: 0,
      averageExpertScore: 0
    }

    const now = new Date()
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    
    const activeProjects = projects.filter(p => p.status === 'ACTIVE').length
    const completedProjects = projects.filter(p => p.status === 'COMPLETED').length
    const draftProjects = projects.filter(p => p.status === 'DRAFT').length
    
    const projectsThisMonth = projects.filter(p => new Date(p.createdAt) >= thisMonth).length
    const projectsLastMonth = projects.filter(p => {
      const createdAt = new Date(p.createdAt)
      return createdAt >= lastMonth && createdAt < thisMonth
    }).length
    
    const completionRate = projects.length > 0 ? (completedProjects / projects.length) * 100 : 0
    
    const averageExpertScore = experts.length > 0 
      ? experts.reduce((sum, expert) => sum + (expert.performanceMetrics?.overallReliability || 0), 0) / experts.length
      : 0

    return {
      totalProjects: projects.length,
      activeProjects,
      completedProjects,
      draftProjects,
      totalExperts: experts.length,
      activeExperts: experts.filter(e => (e.performanceMetrics?.overallReliability || 0) > 70).length,
      totalVariables: projects.reduce((total, project) => total + (project.variables?.length || 0), 0),
      averageProjectDuration: 7,
      projectsThisMonth,
      projectsLastMonth,
      completionRate,
      averageExpertScore
    }
  }, [projects, experts])

  // Filtrar proyectos por rol del usuario
  const userProjects = useMemo(() => {
    if (!projects || !user) return []
    
    if (user.role === 'MODERATOR') {
      return projects.filter(p => p.creatorId === user.id)
    } else {
      return projects.filter(p => 
        p.status === 'ACTIVE' && 
        p.projectExperts?.some(e => e.expertId === user.id)
      )
    }
  }, [projects, user])

  // Generar actividades recientes
  const recentActivities = useMemo(() => {
    if (!projects || !experts) return []
    
    const activities: Array<{
      id: string
      type: 'project_created' | 'voting_started' | 'expert_added'
      title: string
      description: string
      timestamp: Date
      projectId?: string
      projectName?: string
      userId?: string
      userName?: string
    }> = []
    
    // Actividades de proyectos
    projects.slice(0, 10).forEach(project => {
      activities.push({
        id: `project-${project.id}`,
        type: 'project_created' as const,
        title: 'Proyecto creado',
        description: `Se creó el proyecto "${project.name}"`,
        timestamp: new Date(project.createdAt),
        projectId: project.id,
        projectName: project.name,
        userId: project.creatorId
      })
      
      if (project.status === 'ACTIVE') {
        activities.push({
          id: `voting-${project.id}`,
          type: 'voting_started' as const,
          title: 'Votación iniciada',
          description: `Se inició la votación en "${project.name}"`,
          timestamp: new Date(project.updatedAt),
          projectId: project.id,
          projectName: project.name
        })
      }
    })
    
    // Actividades de expertos
    experts.slice(0, 5).forEach(expert => {
      activities.push({
        id: `expert-${expert.id}`,
        type: 'expert_added' as const,
        title: 'Experto agregado',
        description: `Se agregó "${expert.name}" al sistema`,
        timestamp: new Date(),
        userId: expert.id,
        userName: expert.name
      })
    })
    
    return activities
  }, [projects, experts])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <AppLayout>
        <DashboardSkeleton />
      </AppLayout>
    )
  }

  if (!user) {
    return null
  }

  const handleCreateProject = () => {
    startLoading('/projects/create')
    router.push('/projects/create')
  }

  const handleEditProject = (project: Project) => {
    startLoading(`/projects/create?edit=${project.id}`)
    router.push(`/projects/create?edit=${project.id}`)
  }

  const handleViewAllProjects = () => {
    startLoading('/projects')
    router.push('/projects')
  }

  const handleViewCalendar = () => {
    startLoading('/calendar')
    router.push('/calendar')
  }

  const handleViewExperts = () => {
    startLoading('/experts')
    router.push('/experts')
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header del Dashboard */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full mb-6">
            <ChartBarIcon className="h-10 w-10 text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Dashboard MIC MAC Pro
          </h1>
          <p className="text-gray-400 text-lg">
            Bienvenido, {user.name || user.email}
          </p>
          <p className="text-gray-500 text-sm">
            {user.role === 'MODERATOR' ? 'Moderador' : 'Experto'} • Último acceso: {new Date().toLocaleDateString('es-ES')}
          </p>
        </div>

        {/* Métricas del Dashboard */}
        <DashboardMetrics 
          userRole={user.role as 'MODERATOR' | 'EXPERT'}
          metrics={metrics}
        />

        {/* Acciones Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            onClick={handleCreateProject}
            className="h-24 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          >
            <PlusIcon className="h-8 w-8" />
            <span className="text-sm font-medium">Nuevo Proyecto</span>
          </Button>
          
          <Button
            onClick={handleViewAllProjects}
            className="h-24 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
          >
            <DocumentTextIcon className="h-8 w-8" />
            <span className="text-sm font-medium">Ver Proyectos</span>
          </Button>
          
          <Button
            onClick={handleViewCalendar}
            className="h-24 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
          >
            <CalendarIcon className="h-8 w-8" />
            <span className="text-sm font-medium">Calendario</span>
          </Button>
          
          <Button
            onClick={handleViewExperts}
            className="h-24 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
          >
            <UsersIcon className="h-8 w-8" />
            <span className="text-sm font-medium">Expertos</span>
          </Button>
        </div>

        {/* Contenido Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Proyectos del Usuario */}
          <div className="lg:col-span-2">
            <DashboardProjects
              projects={userProjects}
              title={user.role === 'MODERATOR' ? 'Mis Proyectos' : 'Proyectos Activos'}
              userRole={user.role as 'MODERATOR' | 'EXPERT'}
              onEditProject={handleEditProject}
              showCreateButton={user.role === 'MODERATOR'}
              onCreateProject={handleCreateProject}
            />
          </div>

          {/* Actividad Reciente */}
          <div className="lg:col-span-1">
            <RecentActivity 
              activities={recentActivities}
              maxItems={6}
            />
          </div>
        </div>

        {/* Sistema de Automatización */}
        <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <h3 className="text-lg font-semibold text-white">
              Sistema de Automatización Activo
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <span className="text-green-400">✏️</span>
              <span className="text-gray-300">@CursorTesting</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">📄</span>
              <span className="text-gray-300">@CursorGit</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">📊</span>
              <span className="text-gray-300">@CursorLinear</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">📚</span>
              <span className="text-gray-300">@CursorDocs</span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  ) 
}
