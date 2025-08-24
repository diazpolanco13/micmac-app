/**
 * 🎭 Mock Data Context
 * Versión mock del DataContext para desarrollo
 * Usa datos locales de mockData.ts
 */

'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useMockAuth } from './MockAuthContext'
import { 
  mockProjects,
  getFilteredProjects,
  createProject as createMockProject,
  updateProject as updateMockProject,
  deleteProject as deleteMockProject,
  delay
} from '@/lib/mockData'
import type { 
  Project,
  Variable,
  Expert,
  ProjectType
} from '@/types/project'

interface MockDataContextType {
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
    type: ProjectType
    expectedExperts: number
  }) => Promise<{ success: boolean; data?: Project; error?: string }>
  
  updateProject: (id: string, data: Partial<Project>) => Promise<{ success: boolean; data?: Project; error?: string }>
  deleteProject: (id: string) => Promise<{ success: boolean; error?: string }>
  
  createVariable: (projectId: string, data: {
    name: string
    description?: string
    category?: string
    color?: string
  }) => Promise<{ success: boolean; data?: Variable; error?: string }>
  
  updateVariable: (id: string, data: Partial<Variable>) => Promise<{ success: boolean; data?: Variable; error?: string }>
  deleteVariable: (id: string) => Promise<{ success: boolean; error?: string }>
  reorderVariables: (projectId: string, orders: { id: string; order: number }[]) => Promise<{ success: boolean; error?: string }>
  
  createExpert: (data: {
    name: string
    email: string
    organization?: string
    expertiseAreas: string[]
    avatar?: string
    yearsExperience?: number
    notes?: string
  }) => Promise<{ success: boolean; data?: Expert; error?: string }>
}

const MockDataContext = createContext<MockDataContextType | undefined>(undefined)

export function useMockData() {
  const context = useContext(MockDataContext)
  if (context === undefined) {
    throw new Error('useMockData must be used within a MockDataProvider')
  }
  return context
}

interface MockDataProviderProps {
  children: ReactNode
}

export function MockDataProvider({ children }: MockDataProviderProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [currentProject, setCurrentProject] = useState<Project | null>(null)
  const [experts, setExperts] = useState<Expert[]>([])
  const [loadingProjects, setLoadingProjects] = useState(false)
  const [loadingExperts, setLoadingExperts] = useState(false)
  
  const { user } = useMockAuth()

  // Cargar proyectos mock
  const refreshProjects = async () => {
    setLoadingProjects(true)
    try {
      await delay(300) // Simular delay de red
      setProjects([...mockProjects]) // Crear copia para evitar mutaciones
    } catch (error) {
      console.error('Error loading mock projects:', error)
    } finally {
      setLoadingProjects(false)
    }
  }

  // Cargar expertos mock
  const refreshExperts = async () => {
    setLoadingExperts(true)
    try {
      await delay(200)
      // Extraer todos los expertos únicos de los proyectos mock
      const allExperts = mockProjects.flatMap(p => 
        p.projectExperts.map(pe => pe.expert)
      )
      const uniqueExperts = allExperts.filter((expert, index, self) => 
        index === self.findIndex(e => e.id === expert.id)
      )
      setExperts(uniqueExperts)
    } catch (error) {
      console.error('Error loading mock experts:', error)
    } finally {
      setLoadingExperts(false)
    }
  }

  // Cargar datos iniciales cuando hay usuario
  useEffect(() => {
    if (user) {
      refreshProjects()
      refreshExperts()
    } else {
      setProjects([])
      setExperts([])
      setCurrentProject(null)
    }
  }, [user])

  // CRUD Operations
  const createProject = async (data: {
    name: string
    description: string
    type: ProjectType
    expectedExperts: number
  }) => {
    try {
      setLoadingProjects(true)
      await delay(500) // Simular creación en servidor
      
      const newProject = createMockProject(data)
      setProjects(prev => [...prev])
      
      return { success: true, data: newProject }
    } catch (error) {
      console.error('Error creating mock project:', error)
      return { success: false, error: 'Error al crear el proyecto' }
    } finally {
      setLoadingProjects(false)
    }
  }

  const updateProject = async (id: string, data: Partial<Project>) => {
    try {
      setLoadingProjects(true)
      await delay(300)
      
      const updatedProject = updateMockProject(id, data)
      if (!updatedProject) {
        return { success: false, error: 'Proyecto no encontrado' }
      }
      
      setProjects(prev => [...prev])
      
      // Actualizar proyecto actual si es el mismo
      if (currentProject?.id === id) {
        setCurrentProject(updatedProject)
      }
      
      return { success: true, data: updatedProject }
    } catch (error) {
      console.error('Error updating mock project:', error)
      return { success: false, error: 'Error al actualizar el proyecto' }
    } finally {
      setLoadingProjects(false)
    }
  }

  const deleteProject = async (id: string) => {
    try {
      setLoadingProjects(true)
      await delay(200)
      
      const success = deleteMockProject(id)
      if (!success) {
        return { success: false, error: 'Proyecto no encontrado' }
      }
      
      setProjects(prev => [...prev])
      
      // Limpiar proyecto actual si era el eliminado
      if (currentProject?.id === id) {
        setCurrentProject(null)
      }
      
      return { success: true }
    } catch (error) {
      console.error('Error deleting mock project:', error)
      return { success: false, error: 'Error al eliminar el proyecto' }
    } finally {
      setLoadingProjects(false)
    }
  }

  const createVariable = async (projectId: string, data: {
    name: string
    description?: string
    category?: string
    color?: string
  }) => {
    try {
      await delay(200)
      
      const project = mockProjects.find(p => p.id === projectId)
      if (!project) {
        return { success: false, error: 'Proyecto no encontrado' }
      }
      
      const newVariable: Variable = {
        id: `var_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        projectId,
        name: data.name,
        description: data.description || '',
        order: project.variables.length,
        category: data.category || 'neutral',
        color: data.color || '#6B7280',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      project.variables.push(newVariable)
      project.updatedAt = new Date().toISOString()
      
      setProjects(prev => [...prev])
      
      return { success: true, data: newVariable }
    } catch (error) {
      console.error('Error creating mock variable:', error)
      return { success: false, error: 'Error al crear la variable' }
    }
  }

  const updateVariable = async (id: string, data: Partial<Variable>) => {
    try {
      await delay(200)
      
      // Encontrar la variable en todos los proyectos
      let foundVariable: Variable | null = null
      let foundProject: Project | null = null
      
      for (const project of mockProjects) {
        const variable = project.variables.find(v => v.id === id)
        if (variable) {
          foundVariable = variable
          foundProject = project
          break
        }
      }
      
      if (!foundVariable || !foundProject) {
        return { success: false, error: 'Variable no encontrada' }
      }
      
      Object.assign(foundVariable, {
        ...data,
        updatedAt: new Date().toISOString()
      })
      
      foundProject.updatedAt = new Date().toISOString()
      setProjects(prev => [...prev])
      
      return { success: true, data: foundVariable }
    } catch (error) {
      console.error('Error updating mock variable:', error)
      return { success: false, error: 'Error al actualizar la variable' }
    }
  }

  const deleteVariable = async (id: string) => {
    try {
      await delay(200)
      
      // Encontrar y eliminar la variable
      for (const project of mockProjects) {
        const index = project.variables.findIndex(v => v.id === id)
        if (index !== -1) {
          project.variables.splice(index, 1)
          // Reordenar variables restantes
          project.variables.forEach((v, i) => v.order = i)
          project.updatedAt = new Date().toISOString()
          setProjects(prev => [...prev])
          return { success: true }
        }
      }
      
      return { success: false, error: 'Variable no encontrada' }
    } catch (error) {
      console.error('Error deleting mock variable:', error)
      return { success: false, error: 'Error al eliminar la variable' }
    }
  }

  const reorderVariables = async (projectId: string, orders: { id: string; order: number }[]) => {
    try {
      await delay(100)
      
      const project = mockProjects.find(p => p.id === projectId)
      if (!project) {
        return { success: false, error: 'Proyecto no encontrado' }
      }
      
      // Aplicar nuevo orden
      orders.forEach(({ id, order }) => {
        const variable = project.variables.find(v => v.id === id)
        if (variable) {
          variable.order = order
        }
      })
      
      // Ordenar array por el nuevo order
      project.variables.sort((a, b) => a.order - b.order)
      project.updatedAt = new Date().toISOString()
      
      setProjects(prev => [...prev])
      
      return { success: true }
    } catch (error) {
      console.error('Error reordering mock variables:', error)
      return { success: false, error: 'Error al reordenar variables' }
    }
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
    try {
      await delay(300)
      
      const newExpert: Expert = {
        id: `expert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: data.name,
        email: data.email,
        organization: data.organization || '',
        expertiseAreas: data.expertiseAreas,
        avatar: data.avatar || null,
        yearsExperience: data.yearsExperience || 0,
        notes: data.notes || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      setExperts(prev => [...prev, newExpert])
      
      return { success: true, data: newExpert }
    } catch (error) {
      console.error('Error creating mock expert:', error)
      return { success: false, error: 'Error al crear el experto' }
    }
  }

  const value: MockDataContextType = {
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
    <MockDataContext.Provider value={value}>
      {children}
    </MockDataContext.Provider>
  )
}
