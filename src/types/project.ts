/**
 * 📊 Types para Proyectos MIC MAC
 */

export type ProjectType = 'strategic' | 'technological' | 'environmental' | 'social' | 'economic'

export interface Project {
  id: string
  name: string
  description: string
  type: ProjectType
  status: 'draft' | 'active' | 'completed' | 'archived'
  createdBy: string
  createdAt: string
  updatedAt: string
  expectedExperts: number
  
  // Configuración MIC MAC
  variables: Variable[]
  experts: Expert[]
  matrix?: VotingMatrix
  
  // Metadatos
  tags: string[]
  isPublic: boolean
}

export interface Variable {
  id: string
  name: string
  description: string
  order: number
  category?: 'motriz' | 'dependiente' | 'enlace' | 'autonoma'
  color?: string
  position?: { x: number; y: number }
}

export interface Expert {
  id: string
  name: string
  email: string
  expertise: string[]
  role: 'expert' | 'moderator'
  avatar?: string
  status: 'invited' | 'active' | 'completed'
}

export interface VotingMatrix {
  id: string
  projectId: string
  responses: VotingResponse[]
  isComplete: boolean
  deadline?: string
}

export interface VotingResponse {
  expertId: string
  variableFrom: string
  variableTo: string
  influence: 0 | 1 | 2 | 3 // 0=Sin influencia, 1=Débil, 2=Moderada, 3=Fuerte
  comment?: string
  votedAt: string
}

// Estados de filtros
export type ProjectStatus = Project['status']
export type ProjectFilter = {
  status?: ProjectStatus[]
  search?: string
  tags?: string[]
  createdBy?: string
}
