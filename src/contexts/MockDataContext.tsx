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
  ExpertStats,
  VotingResponse,
  VotingMatrix
} from '@/types/project'

// Estado global para expertos mock (para persistir entre renders)
let globalMockExperts: Expert[] = []

// Estado global para votos mock (persistir entre renders)
let globalMockVotes: VotingResponse[] = []

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
  
  // ============ SISTEMA DE VOTACIÓN ============
  // Métodos para manejar votación MIC MAC
  saveVote: (projectId: string, expertId: string, vote: VotingResponse) => Promise<{ success: boolean; error?: string }>
  getVotingProgress: (projectId: string, expertId: string) => { completedPairs: number; totalPairs: number; percentage: number }
  getProjectVotes: (projectId: string) => VotingResponse[]
  getExpertVotes: (projectId: string, expertId: string) => VotingResponse[]
  clearVotes: (projectId: string, expertId?: string) => Promise<{ success: boolean; error?: string }>
  
  // Sistema de simulación de expertos
  simulateExpertVoting: (projectId: string, expertId: string) => Promise<{ success: boolean; votes?: VotingResponse[]; error?: string }>
  simulateAllExperts: (projectId: string) => Promise<{ success: boolean; totalVotes?: number; error?: string }>
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
  const [projects, setProjects] = useState<Project[]>(mockProjects)
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

  // ============ SISTEMA DE VOTACIÓN ============

  const saveVote = async (projectId: string, expertId: string, vote: VotingResponse): Promise<{ success: boolean; error?: string }> => {
    try {
      await delay(100) // Simular guardado
      
      // Verificar que el proyecto existe
      const project = projects.find(p => p.id === projectId)
      if (!project) {
        return { success: false, error: 'Proyecto no encontrado' }
      }
      
      // Verificar que el experto existe
      const expert = globalMockExperts.find(e => e.id === expertId)
      if (!expert) {
        return { success: false, error: 'Experto no encontrado' }
      }
      
      // Verificar que las variables existen
      const variableA = project.variables.find(v => v.id === vote.variableAId)
      const variableB = project.variables.find(v => v.id === vote.variableBId)
      if (!variableA || !variableB) {
        return { success: false, error: 'Variables no encontradas' }
      }
      
      // Verificar que es un voto válido (0-3)
      if (vote.value < 0 || vote.value > 3 || !Number.isInteger(vote.value)) {
        return { success: false, error: 'Valor de voto inválido (debe ser 0, 1, 2 o 3)' }
      }
      
      // Buscar si ya existe un voto para este par de variables por este experto
      const existingVoteIndex = globalMockVotes.findIndex(v =>
        v.expertId === expertId &&
        v.variableAId === vote.variableAId &&
        v.variableBId === vote.variableBId
      )
      
      const voteWithTimestamp = {
        ...vote,
        createdAt: existingVoteIndex === -1 ? new Date().toISOString() : globalMockVotes[existingVoteIndex].createdAt,
        updatedAt: new Date().toISOString()
      }
      
      if (existingVoteIndex !== -1) {
        // Actualizar voto existente
        globalMockVotes[existingVoteIndex] = voteWithTimestamp
      } else {
        // Agregar nuevo voto
        globalMockVotes.push(voteWithTimestamp)
      }
      
      return { success: true }
    } catch (error) {
      console.error('Error saving vote:', error)
      return { success: false, error: 'Error al guardar el voto' }
    }
  }

  const getVotingProgress = (projectId: string, expertId: string): { completedPairs: number; totalPairs: number; percentage: number } => {
    const project = projects.find(p => p.id === projectId)
    if (!project) {
      return { completedPairs: 0, totalPairs: 0, percentage: 0 }
    }
    
    // Calcular total de pares posibles (n × (n-1) para matriz no diagonal)
    const variableCount = project.variables.length
    const totalPairs = variableCount * (variableCount - 1)
    
    // Contar votos completados por este experto para este proyecto
    const expertVotes = globalMockVotes.filter(vote =>
      vote.expertId === expertId &&
      project.variables.some(v => v.id === vote.variableAId) &&
      project.variables.some(v => v.id === vote.variableBId)
    )
    
    const completedPairs = expertVotes.length
    const percentage = totalPairs > 0 ? Math.round((completedPairs / totalPairs) * 100) : 0
    
    return { completedPairs, totalPairs, percentage }
  }

  const getProjectVotes = (projectId: string): VotingResponse[] => {
    const project = projects.find(p => p.id === projectId)
    if (!project) {
      return []
    }
    
    // Filtrar votos que pertenecen a variables de este proyecto
    return globalMockVotes.filter(vote =>
      project.variables.some(v => v.id === vote.variableAId) &&
      project.variables.some(v => v.id === vote.variableBId)
    )
  }

  const getExpertVotes = (projectId: string, expertId: string): VotingResponse[] => {
    return getProjectVotes(projectId).filter(vote => vote.expertId === expertId)
  }

  const clearVotes = async (projectId: string, expertId?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await delay(100)
      
      const project = projects.find(p => p.id === projectId)
      if (!project) {
        return { success: false, error: 'Proyecto no encontrado' }
      }
      
      if (expertId) {
        // Limpiar votos de un experto específico
        globalMockVotes = globalMockVotes.filter(vote =>
          !(vote.expertId === expertId &&
            project.variables.some(v => v.id === vote.variableAId) &&
            project.variables.some(v => v.id === vote.variableBId))
        )
      } else {
        // Limpiar todos los votos del proyecto
        globalMockVotes = globalMockVotes.filter(vote =>
          !(project.variables.some(v => v.id === vote.variableAId) &&
            project.variables.some(v => v.id === vote.variableBId))
        )
      }
      
      return { success: true }
    } catch (error) {
      console.error('Error clearing votes:', error)
      return { success: false, error: 'Error al limpiar los votos' }
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
    removeExpertiseTag,
    
    // Sistema de votación
    saveVote,
    getVotingProgress,
    getProjectVotes,
    getExpertVotes,
    clearVotes,
    simulateExpertVoting,
    simulateAllExperts
  }

  // ============ SISTEMA DE SIMULACIÓN DE EXPERTOS ============
  
  async function simulateExpertVoting(projectId: string, expertId: string): Promise<{ success: boolean; votes?: VotingResponse[]; error?: string }> {
    try {
      await delay(500) // Simular tiempo de procesamiento
      
      const project = mockProjects.find(p => p.id === projectId)
      if (!project) {
        return { success: false, error: 'Proyecto no encontrado' }
      }

      const expert = sampleExperts.find(e => e.id === expertId)
      if (!expert) {
        return { success: false, error: 'Experto no encontrado' }
      }

      // Generar pares de variables
      const variables = project.variables
      const pairs: Array<{variableA: Variable, variableB: Variable}> = []
      
      for (let i = 0; i < variables.length; i++) {
        for (let j = 0; j < variables.length; j++) {
          if (i !== j) {
            pairs.push({
              variableA: variables[i],
              variableB: variables[j]
            })
          }
        }
      }

      // Crear patrones de votación inteligentes basados en expertise
      const expertVotes: VotingResponse[] = []
      
      // FASE 1: INFLUENCIA
      for (const pair of pairs) {
        const vote = generateIntelligentVote(expert, pair.variableA, pair.variableB, 'INFLUENCE')
        expertVotes.push({
          expertId,
          variableAId: pair.variableA.id,
          variableBId: pair.variableB.id,
          phase: 'INFLUENCE', // NUEVO: Fase 1
          value: vote.value,
          confidence: vote.confidence,
          timeSpent: vote.timeSpent,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
      }
      
      // FASE 2: DEPENDENCIA
      for (const pair of pairs) {
        const vote = generateIntelligentVote(expert, pair.variableA, pair.variableB, 'DEPENDENCE')
        expertVotes.push({
          expertId,
          variableAId: pair.variableA.id,
          variableBId: pair.variableB.id,
          phase: 'DEPENDENCE', // NUEVO: Fase 2
          value: vote.value,
          confidence: vote.confidence,
          timeSpent: vote.timeSpent,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
      }

      // Guardar todos los votos
      globalMockVotes.push(...expertVotes)
      
      return { success: true, votes: expertVotes }
      
    } catch (error) {
      console.error('Error simulando votación de experto:', error)
      return { success: false, error: 'Error interno del servidor' }
    }
  }

  async function simulateAllExperts(projectId: string): Promise<{ success: boolean; totalVotes?: number; error?: string }> {
    try {
      const project = mockProjects.find(p => p.id === projectId)
      if (!project) {
        return { success: false, error: 'Proyecto no encontrado' }
      }

      let totalVotes = 0
      
      // Simular votación de todos los expertos asignados
      for (const projectExpert of project.projectExperts) {
        const result = await simulateExpertVoting(projectId, projectExpert.expertId)
        if (result.success && result.votes) {
          totalVotes += result.votes.length
        }
        
        // Pequeña pausa entre expertos para realismo
        await delay(200)
      }
      
      return { success: true, totalVotes }
      
    } catch (error) {
      console.error('Error simulando todos los expertos:', error)
      return { success: false, error: 'Error interno del servidor' }
    }
  }

  // Función para generar votos inteligentes basados en expertise
  function generateIntelligentVote(expert: Expert, variableA: Variable, variableB: Variable, phase: 'INFLUENCE' | 'DEPENDENCE') {
    // Mapeo inteligente basado en contenido de las variables
    let baseInfluence = 1 // Por defecto influencia débil
    
    const aName = variableA.name.toLowerCase()
    const bName = variableB.name.toLowerCase()
    
    // Lógica específica para proyecto geopolítico
    if (aName.includes('invasión') || aName.includes('militar')) {
      if (bName.includes('cuarentena') || bName.includes('naval')) baseInfluence = 3
      if (bName.includes('quirúrgica') || bName.includes('especiales')) baseInfluence = 2
      if (bName.includes('psicológica') || bName.includes('fake-news')) baseInfluence = 2
      if (bName.includes('falsa bandera') || bName.includes('tonkín')) baseInfluence = 3
    } else if (aName.includes('cuarentena') || aName.includes('naval')) {
      if (bName.includes('invasión') || bName.includes('militar')) baseInfluence = 2
      if (bName.includes('quirúrgica')) baseInfluence = 3
      if (bName.includes('psicológica')) baseInfluence = 1
      if (bName.includes('falsa bandera')) baseInfluence = 2
    } else if (aName.includes('quirúrgica') || aName.includes('especiales')) {
      if (bName.includes('invasión')) baseInfluence = 1
      if (bName.includes('cuarentena')) baseInfluence = 2
      if (bName.includes('psicológica')) baseInfluence = 2
      if (bName.includes('falsa bandera')) baseInfluence = 3
    } else if (aName.includes('psicológica') || aName.includes('fake-news')) {
      if (bName.includes('invasión')) baseInfluence = 1
      if (bName.includes('cuarentena')) baseInfluence = 1
      if (bName.includes('quirúrgica')) baseInfluence = 1
      if (bName.includes('falsa bandera')) baseInfluence = 2
    } else if (aName.includes('falsa bandera') || aName.includes('tonkín')) {
      if (bName.includes('invasión')) baseInfluence = 3
      if (bName.includes('cuarentena')) baseInfluence = 2
      if (bName.includes('quirúrgica')) baseInfluence = 2
      if (bName.includes('psicológica')) baseInfluence = 1
    }
    
    // Ajustar según la fase (DEPENDENCE tiende a ser inversa a INFLUENCE)
    if (phase === 'DEPENDENCE') {
      // En dependencia, los patrones pueden ser diferentes
      baseInfluence = Math.max(0, Math.min(3, baseInfluence + Math.round(Math.random() * 2 - 1)))
    }
    
    // Ajustar según expertise del experto
    const expertiseBonus = expert.expertiseAreas.some(area => 
      aName.includes(area.toLowerCase()) || bName.includes(area.toLowerCase())
    ) ? 0.5 : 0
    
    // Añadir variabilidad realista basada en experiencia
    const experienceVariation = (expert.yearsExperience - 15) / 30 // Normalizado
    const randomVariation = Math.random() * 0.6 - 0.3 // ±30% variación
    
    const finalValue = Math.max(0, Math.min(3, Math.round(
      baseInfluence + expertiseBonus + experienceVariation + randomVariation
    )))
    
    // Calcular confianza basada en experiencia y expertise
    const hasExpertise = expert.expertiseAreas.some(area => 
      aName.includes(area.toLowerCase()) || bName.includes(area.toLowerCase())
    )
    const confidenceBase = hasExpertise ? 3 : Math.min(3, Math.floor(expert.yearsExperience / 8))
    const confidence = Math.max(1, confidenceBase + Math.round(Math.random() * 0.4 - 0.2))
    
    // Tiempo basado en experiencia (más experiencia = más rápido)
    const timeBase = Math.max(15, 60 - expert.yearsExperience)
    const timeSpent = timeBase + Math.round(Math.random() * 20 - 10)
    
    return {
      value: finalValue,
      confidence,
      timeSpent
    }
  }

  return (
    <MockDataContext.Provider value={value}>
      {children}
    </MockDataContext.Provider>
  )
}
