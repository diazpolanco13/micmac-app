/**
 * 🎭 Mock Data Context
 * Versión mock del DataContext para desarrollo
 * Usa datos locales de mockData.ts con CRUD completo de expertos
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
  ProjectType,
  ExpertFormData,
  ExpertFilter,
  ExpertStats
} from '@/types/project'

// Estado global para expertos mock (para persistir entre renders)
let globalMockExperts: Expert[] = []

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
  
  // CRUD Proyectos
  createProject: (data: {
    name: string
    description: string
    type: ProjectType
    expectedExperts: number
  }) => Promise<{ success: boolean; data?: Project; error?: string }>
  
  updateProject: (id: string, data: Partial<Project>) => Promise<{ success: boolean; data?: Project; error?: string }>
  deleteProject: (id: string) => Promise<{ success: boolean; error?: string }>
  
  // CRUD Variables
  createVariable: (projectId: string, data: {
    name: string
    description?: string
    category?: string
    color?: string
  }) => Promise<{ success: boolean; data?: Variable; error?: string }>
  
  updateVariable: (id: string, data: Partial<Variable>) => Promise<{ success: boolean; data?: Variable; error?: string }>
  deleteVariable: (id: string) => Promise<{ success: boolean; error?: string }>
  reorderVariables: (projectId: string, orders: { id: string; order: number }[]) => Promise<{ success: boolean; error?: string }>
  
  // CRUD Expertos completo
  createExpert: (data: ExpertFormData) => Promise<{ success: boolean; data?: Expert; error?: string }>
  updateExpert: (id: string, data: Partial<ExpertFormData>) => Promise<{ success: boolean; data?: Expert; error?: string }>
  deleteExpert: (id: string) => Promise<{ success: boolean; error?: string }>
  
  // Consultas avanzadas de expertos
  getExpertById: (id: string) => Expert | null
  searchExperts: (query: string) => Expert[]
  filterExperts: (filter: ExpertFilter) => Expert[]
  getExpertsByExpertise: (expertise: string) => Expert[]
  getExpertStats: () => ExpertStats
  
  // Sistema de etiquetas
  getAllExpertiseTags: () => string[]
  addExpertiseTag: (tag: string) => void
  removeExpertiseTag: (tag: string) => void
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
      
      // Si no hay expertos globales, extraer de proyectos mock y crear más completos
      if (globalMockExperts.length === 0) {
        const projectExperts = mockProjects.flatMap(p => 
          p.projectExperts.map(pe => pe.expert)
        )
        const uniqueProjectExperts = projectExperts.filter((expert, index, self) => 
          index === self.findIndex(e => e.id === expert.id)
        )
        
        // Expandir expertos con nuevos campos
        globalMockExperts = uniqueProjectExperts.map(expert => ({
          ...expert,
          role: Math.random() > 0.8 ? 'MODERATOR' : 'EXPERT' as 'EXPERT' | 'MODERATOR',
          biography: `Experto con ${expert.yearsExperience || 5} años de experiencia en ${expert.expertiseAreas.join(', ')}.`,
          linkedinUrl: `https://linkedin.com/in/${expert.name.toLowerCase().replace(/ /g, '-')}`,
          phone: null,
          isActive: true,
          lastLoginAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          totalProjectsParticipated: Math.floor(Math.random() * 10) + 1,
          averageResponseTime: Math.random() * 24 + 2 // 2-26 horas
        }))
        
        // Agregar algunos expertos adicionales para tener más diversidad
        const additionalExperts: Expert[] = [
          {
            id: 'expert_additional_1',
            name: 'María González',
            email: 'maria.gonzalez@universidad.es',
            organization: 'Universidad Complutense',
            expertiseAreas: ['Educativo', 'Social', 'Políticas Públicas'],
            avatar: null,
            yearsExperience: 15,
            notes: 'Especialista en políticas educativas',
            role: 'EXPERT',
            biography: 'Doctora en Educación con 15 años de experiencia en políticas públicas educativas.',
            linkedinUrl: 'https://linkedin.com/in/maria-gonzalez-edu',
            phone: '+34 666 555 444',
            isActive: true,
            lastLoginAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            totalProjectsParticipated: 8,
            averageResponseTime: 4.5,
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: new Date().toISOString()
          },
          {
            id: 'expert_additional_2',
            name: 'Carlos Mendoza',
            email: 'carlos.mendoza@defensa.gov',
            organization: 'Ministerio de Defensa',
            expertiseAreas: ['Militar', 'Seguridad', 'Estratégico'],
            avatar: null,
            yearsExperience: 25,
            notes: 'Coronel retirado, especialista en estrategia',
            role: 'MODERATOR',
            biography: 'Coronel retirado con 25 años de experiencia en estrategia militar y seguridad nacional.',
            linkedinUrl: null,
            phone: '+34 777 888 999',
            isActive: true,
            lastLoginAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            totalProjectsParticipated: 12,
            averageResponseTime: 2.1,
            createdAt: '2023-06-01T08:00:00Z',
            updatedAt: new Date().toISOString()
          }
        ]
        
        globalMockExperts = [...globalMockExperts, ...additionalExperts]
      }
      
      setExperts([...globalMockExperts])
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

  // ============ CRUD PROYECTOS ============
  
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

  // ============ CRUD VARIABLES ============

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

  // ============ CRUD EXPERTOS COMPLETO ============

  const createExpert = async (data: ExpertFormData) => {
    try {
      await delay(300)
      
      // Validar email único
      const existingExpert = globalMockExperts.find(e => e.email.toLowerCase() === data.email.toLowerCase())
      if (existingExpert) {
        return { success: false, error: 'Ya existe un experto con este email' }
      }
      
      // Validar expertise mínima
      if (!data.expertiseAreas || data.expertiseAreas.length === 0) {
        return { success: false, error: 'Se requiere al menos un área de expertise' }
      }
      
      const newExpert: Expert = {
        id: `expert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: data.name,
        email: data.email,
        organization: data.organization || null,
        expertiseAreas: data.expertiseAreas,
        avatar: data.avatar || null,
        yearsExperience: data.yearsExperience || null,
        notes: data.notes || null,
        role: data.role,
        biography: data.biography || null,
        linkedinUrl: data.linkedinUrl || null,
        phone: data.phone || null,
        isActive: true,
        lastLoginAt: null,
        totalProjectsParticipated: 0,
        averageResponseTime: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      globalMockExperts.push(newExpert)
      setExperts([...globalMockExperts])
      
      return { success: true, data: newExpert }
    } catch (error) {
      console.error('Error creating mock expert:', error)
      return { success: false, error: 'Error al crear el experto' }
    }
  }

  const updateExpert = async (id: string, data: Partial<ExpertFormData>) => {
    try {
      await delay(200)
      
      const expertIndex = globalMockExperts.findIndex(e => e.id === id)
      if (expertIndex === -1) {
        return { success: false, error: 'Experto no encontrado' }
      }
      
      // Validar email único si se está cambiando
      if (data.email && data.email !== globalMockExperts[expertIndex].email) {
        const existingExpert = globalMockExperts.find(e => 
          e.email.toLowerCase() === data.email!.toLowerCase() && e.id !== id
        )
        if (existingExpert) {
          return { success: false, error: 'Ya existe un experto con este email' }
        }
      }
      
      // Validar expertise mínima
      if (data.expertiseAreas && data.expertiseAreas.length === 0) {
        return { success: false, error: 'Se requiere al menos un área de expertise' }
      }
      
      const updatedExpert = {
        ...globalMockExperts[expertIndex],
        ...data,
        updatedAt: new Date().toISOString()
      }
      
      globalMockExperts[expertIndex] = updatedExpert
      setExperts([...globalMockExperts])
      
      return { success: true, data: updatedExpert }
    } catch (error) {
      console.error('Error updating mock expert:', error)
      return { success: false, error: 'Error al actualizar el experto' }
    }
  }

  const deleteExpert = async (id: string) => {
    try {
      await delay(200)
      
      const expertIndex = globalMockExperts.findIndex(e => e.id === id)
      if (expertIndex === -1) {
        return { success: false, error: 'Experto no encontrado' }
      }
      
      // Verificar si el experto está en proyectos activos
      const activeProjects = mockProjects.filter(p => 
        p.status === 'ACTIVE' && 
        p.projectExperts.some(pe => pe.expertId === id)
      )
      
      if (activeProjects.length > 0) {
        return { 
          success: false, 
          error: `No se puede eliminar. El experto está participando en ${activeProjects.length} proyecto(s) activo(s)` 
        }
      }
      
      globalMockExperts.splice(expertIndex, 1)
      setExperts([...globalMockExperts])
      
      return { success: true }
    } catch (error) {
      console.error('Error deleting mock expert:', error)
      return { success: false, error: 'Error al eliminar el experto' }
    }
  }

  // ============ CONSULTAS AVANZADAS DE EXPERTOS ============

  const getExpertById = (id: string): Expert | null => {
    return globalMockExperts.find(e => e.id === id) || null
  }

  const searchExperts = (query: string): Expert[] => {
    if (!query.trim()) return globalMockExperts
    
    const searchTerm = query.toLowerCase()
    return globalMockExperts.filter(expert =>
      expert.name.toLowerCase().includes(searchTerm) ||
      expert.email.toLowerCase().includes(searchTerm) ||
      expert.organization?.toLowerCase().includes(searchTerm) ||
      expert.expertiseAreas.some(area => area.toLowerCase().includes(searchTerm))
    )
  }

  const filterExperts = (filter: ExpertFilter): Expert[] => {
    let filtered = [...globalMockExperts]

    if (filter.search) {
      filtered = searchExperts(filter.search)
    }

    if (filter.role) {
      filtered = filtered.filter(e => e.role === filter.role)
    }

    if (filter.organization) {
      filtered = filtered.filter(e => 
        e.organization?.toLowerCase().includes(filter.organization!.toLowerCase())
      )
    }

    if (filter.isActive !== undefined) {
      filtered = filtered.filter(e => e.isActive === filter.isActive)
    }

    if (filter.expertiseAreas && filter.expertiseAreas.length > 0) {
      filtered = filtered.filter(e => 
        filter.expertiseAreas!.some(area => e.expertiseAreas.includes(area))
      )
    }

    if (filter.minExperience !== undefined) {
      filtered = filtered.filter(e => (e.yearsExperience || 0) >= filter.minExperience!)
    }

    if (filter.maxExperience !== undefined) {
      filtered = filtered.filter(e => (e.yearsExperience || 0) <= filter.maxExperience!)
    }

    return filtered
  }

  const getExpertsByExpertise = (expertise: string): Expert[] => {
    return globalMockExperts.filter(expert =>
      expert.expertiseAreas.some(area => 
        area.toLowerCase().includes(expertise.toLowerCase())
      )
    )
  }

  const getExpertStats = (): ExpertStats => {
    const totalExperts = globalMockExperts.filter(e => e.role === 'EXPERT').length
    const totalModerators = globalMockExperts.filter(e => e.role === 'MODERATOR').length
    const totalActiveExperts = globalMockExperts.filter(e => e.isActive).length

    // Distribución por expertise
    const expertiseCount: Record<string, number> = {}
    globalMockExperts.forEach(expert => {
      expert.expertiseAreas.forEach(area => {
        expertiseCount[area] = (expertiseCount[area] || 0) + 1
      })
    })
    const expertiseDistribution = Object.entries(expertiseCount)
      .map(([area, count]) => ({ area, count }))
      .sort((a, b) => b.count - a.count)

    // Distribución por organización
    const organizationCount: Record<string, number> = {}
    globalMockExperts.forEach(expert => {
      const org = expert.organization || 'Sin organización'
      organizationCount[org] = (organizationCount[org] || 0) + 1
    })
    const organizationDistribution = Object.entries(organizationCount)
      .map(([organization, count]) => ({ organization, count }))
      .sort((a, b) => b.count - a.count)

    // Experiencia promedio
    const expertsWithExperience = globalMockExperts.filter(e => e.yearsExperience !== null)
    const averageExperience = expertsWithExperience.length > 0
      ? expertsWithExperience.reduce((sum, e) => sum + (e.yearsExperience || 0), 0) / expertsWithExperience.length
      : 0

    return {
      totalExperts,
      totalModerators,
      totalActiveExperts,
      expertiseDistribution,
      averageExperience,
      organizationDistribution
    }
  }

  // ============ SISTEMA DE ETIQUETAS ============

  const getAllExpertiseTags = (): string[] => {
    const allTags = new Set<string>()
    globalMockExperts.forEach(expert => {
      expert.expertiseAreas.forEach(area => allTags.add(area))
    })
    
    // Agregar etiquetas predefinidas si no existen
    const predefinedTags = [
      'Militar', 'Económico', 'Político', 'Tecnológico', 
      'Social', 'Ambiental', 'Educativo', 'Salud',
      'Energético', 'Transporte', 'Comunicaciones',
      'Seguridad', 'Innovación', 'Prospectiva'
    ]
    
    predefinedTags.forEach(tag => allTags.add(tag))
    
    return Array.from(allTags).sort()
  }

  const addExpertiseTag = (tag: string) => {
    // Esta función está disponible para futuras expansiones
    // Por ahora, las etiquetas se crean automáticamente al asignar expertise
    console.log(`Nueva etiqueta disponible: ${tag}`)
  }

  const removeExpertiseTag = (tag: string) => {
    // Verificar si algún experto usa esta etiqueta
    const expertsUsingTag = globalMockExperts.filter(e => 
      e.expertiseAreas.includes(tag)
    )
    
    if (expertsUsingTag.length > 0) {
      console.warn(`No se puede eliminar la etiqueta "${tag}". ${expertsUsingTag.length} experto(s) la están usando.`)
      return
    }
    
    console.log(`Etiqueta "${tag}" marcada para eliminación`)
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
    
    // CRUD Proyectos
    createProject,
    updateProject,
    deleteProject,
    
    // CRUD Variables
    createVariable,
    updateVariable,
    deleteVariable,
    reorderVariables,
    
    // CRUD Expertos
    createExpert,
    updateExpert,
    deleteExpert,
    
    // Consultas Expertos
    getExpertById,
    searchExperts,
    filterExperts,
    getExpertsByExpertise,
    getExpertStats,
    
    // Sistema de etiquetas
    getAllExpertiseTags,
    addExpertiseTag,
    removeExpertiseTag
  }

  return (
    <MockDataContext.Provider value={value}>
      {children}
    </MockDataContext.Provider>
  )
}
