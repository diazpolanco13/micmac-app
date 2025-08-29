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
import ProjectEvolutionChart from '@/components/dashboard/ProjectEvolutionChart'
import ProjectStatusChart from '@/components/dashboard/ProjectStatusChart'
import ExpertPerformanceChart from '@/components/dashboard/ExpertPerformanceChart'
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
      <div className="container-app space-y-6">
        {/* Header del Dashboard - Compacto */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-xl">
              <ChartBarIcon className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Dashboard MIC MAC Pro
              </h1>
              <p className="text-gray-400 text-sm">
                {user.name || user.email} • {user.role === 'MODERATOR' ? 'Moderador' : 'Experto'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-sm">Último acceso</p>
            <p className="text-white text-sm font-medium">{new Date().toLocaleDateString('es-ES')}</p>
          </div>
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

        {/* Gráficos Principales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Evolución de Proyectos */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
              <div className="w-2 h-6 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full"></div>
              Evolución de Proyectos
            </h3>
            <div className="h-64">
              <ProjectEvolutionChart projects={projects} />
            </div>
          </div>

          {/* Distribución por Estado */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
              <div className="w-2 h-6 bg-gradient-to-b from-emerald-400 to-teal-500 rounded-full"></div>
              Distribución por Estado
            </h3>
            <div className="h-64">
              <ProjectStatusChart projects={projects} />
            </div>
          </div>
        </div>

        {/* Performance de Expertos - Solo Moderadores */}
        {user.role === 'MODERATOR' && (
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
              <div className="w-2 h-6 bg-gradient-to-b from-orange-400 to-red-500 rounded-full"></div>
              Performance de Expertos
            </h3>
            <div className="h-80">
              <ExpertPerformanceChart experts={experts} />
            </div>
          </div>
        )}

        {/* Proyectos del Usuario */}
        <DashboardProjects
          projects={userProjects}
          title={user.role === 'MODERATOR' ? 'Mis Proyectos' : 'Proyectos Activos'}
          userRole={user.role as 'MODERATOR' | 'EXPERT'}
          onEditProject={handleEditProject}
          showCreateButton={false}
          onCreateProject={handleCreateProject}
        />

        {/* Actividad Reciente - Ancho Completo */}
        <RecentActivity 
          activities={recentActivities}
          maxItems={12}
          fullWidth={true}
        />



      </div>
    </AppLayout>
  ) 
}
