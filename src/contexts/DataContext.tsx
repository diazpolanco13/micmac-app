/**
 * 🗄️ Context de Datos Real
 * Contexto que maneja datos reales usando APIs de Prisma + Supabase
 */

'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useProjectsApi, useExpertsApi } from '@/hooks/useApi'
import { useAuth } from './SupabaseAuthContext'
import type { 
  Project,
  Variable,
  Expert
} from '@/types/project'

interface DataContextType {
  // Proyectos
  projects: Project[]
  currentProject: Project | null
  loadingProjects: boolean
  
  // Expertos
  experts: Expert[]
  loadingExperts: boolean
  
  // Acciones
  refreshProjects: () => Promise<void>
  refreshExperts: () => Promise<void>
  setCurrentProject: (project: Project | null) => void
  
  // Operaciones CRUD
  createProject: (data: {
    name: string
    description: string
    type: string
    expectedExperts: number
  }) => Promise<{ success: boolean; data?: Project }>
  
  updateProject: (id: string, data: any) => Promise<{ success: boolean; data?: Project }>
  deleteProject: (id: string) => Promise<{ success: boolean }>
  
  createVariable: (projectId: string, data: {
    name: string
    description?: string
    category?: string
    color?: string
  }) => Promise<{ success: boolean; data?: Variable }>
  
  updateVariable: (id: string, data: any) => Promise<{ success: boolean; data?: Variable }>
  deleteVariable: (id: string) => Promise<{ success: boolean }>
  reorderVariables: (projectId: string, orders: { id: string; order: number }[]) => Promise<{ success: boolean }>
  
  createExpert: (data: {
    name: string
    email: string
    organization?: string
    expertiseAreas: string[]
    avatar?: string
    yearsExperience?: number
    notes?: string
  }) => Promise<{ success: boolean; data?: Expert }>
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}

interface DataProviderProps {
  children: ReactNode
}

export function DataProvider({ children }: DataProviderProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [currentProject, setCurrentProject] = useState<Project | null>(null)
  const [experts, setExperts] = useState<Expert[]>([])
  
  const { user } = useAuth()
  const projectsApi = useProjectsApi()
  const expertsApi = useExpertsApi()

  // Estados de carga
  const loadingProjects = projectsApi.loading
  const loadingExperts = expertsApi.loading

  // Cargar proyectos
  const refreshProjects = async () => {
    const result = await projectsApi.getProjects()
    if (result.success && result.data) {
      setProjects(result.data)
    }
  }

  // Cargar expertos
  const refreshExperts = async () => {
    const result = await expertsApi.getExperts()
    if (result.success && result.data) {
      setExperts(result.data)
    }
  }

  // Cargar datos iniciales cuando el usuario está autenticado
  useEffect(() => {
    if (user) {
      refreshProjects()
      refreshExperts()
    } else {
      // Limpiar datos cuando no hay usuario
      setProjects([])
      setExperts([])
      setCurrentProject(null)
    }
  }, [user])

  // Operaciones CRUD
  const createProject = async (data: {
    name: string
    description: string
    type: string
    expectedExperts: number
  }) => {
    const result = await projectsApi.createProject(data)
    if (result.success) {
      await refreshProjects()
    }
    return result
  }

  const updateProject = async (id: string, data: any) => {
    const result = await projectsApi.updateProject(id, data)
    if (result.success) {
      await refreshProjects()
      // Actualizar proyecto actual si es el mismo
      if (currentProject?.id === id) {
        const updatedResult = await projectsApi.getProject(id)
        if (updatedResult.success && updatedResult.data) {
          setCurrentProject(updatedResult.data)
        }
      }
    }
    return result
  }

  const deleteProject = async (id: string) => {
    const result = await projectsApi.deleteProject(id)
    if (result.success) {
      await refreshProjects()
      // Limpiar proyecto actual si era el eliminado
      if (currentProject?.id === id) {
        setCurrentProject(null)
      }
    }
    return result
  }

  const createVariable = async (projectId: string, data: {
    name: string
    description?: string
    category?: string
    color?: string
  }) => {
    const result = await projectsApi.createVariable(projectId, data)
    if (result.success) {
      await refreshProjects()
      // Refrescar proyecto actual si es el mismo
      if (currentProject?.id === projectId) {
        const updatedResult = await projectsApi.getProject(projectId)
        if (updatedResult.success && updatedResult.data) {
          setCurrentProject(updatedResult.data)
        }
      }
    }
    return result
  }

  const updateVariable = async (id: string, data: any) => {
    const result = await projectsApi.updateVariable(id, data)
    if (result.success) {
      await refreshProjects()
      // Refrescar proyecto actual si corresponde
      if (currentProject) {
        const updatedResult = await projectsApi.getProject(currentProject.id)
        if (updatedResult.success && updatedResult.data) {
          setCurrentProject(updatedResult.data)
        }
      }
    }
    return result
  }

  const deleteVariable = async (id: string) => {
    const result = await projectsApi.deleteVariable(id)
    if (result.success) {
      await refreshProjects()
      // Refrescar proyecto actual si corresponde
      if (currentProject) {
        const updatedResult = await projectsApi.getProject(currentProject.id)
        if (updatedResult.success && updatedResult.data) {
          setCurrentProject(updatedResult.data)
        }
      }
    }
    return result
  }

  const reorderVariables = async (projectId: string, orders: { id: string; order: number }[]) => {
    const result = await projectsApi.reorderVariables(projectId, orders)
    if (result.success) {
      await refreshProjects()
      // Refrescar proyecto actual si es el mismo
      if (currentProject?.id === projectId) {
        const updatedResult = await projectsApi.getProject(projectId)
        if (updatedResult.success && updatedResult.data) {
          setCurrentProject(updatedResult.data)
        }
      }
    }
    return result
  }

  const createExpert = async (data: {
    name: string
    email: string
    organization?: string
    expertiseAreas: string[]
    avatar?: string
    yearsExperience?: number
    notes?: string
  }) => {
    const result = await expertsApi.createExpert(data)
    if (result.success) {
      await refreshExperts()
    }
    return result
  }

  const value: DataContextType = {
    // Estados
    projects,
    currentProject,
    experts,
    loadingProjects,
    loadingExperts,
    
    // Acciones
    refreshProjects,
    refreshExperts,
    setCurrentProject,
    
    // CRUD
    createProject,
    updateProject,
    deleteProject,
    createVariable,
    updateVariable,
    deleteVariable,
    reorderVariables,
    createExpert
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}

// Hook para usar solo cuando se necesite acceso directo a la API
export { useProjectsApi, useExpertsApi }
