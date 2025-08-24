/**
 * 📊 Types para Proyectos MIC MAC
 */

export type ProjectType = 'strategic' | 'technological' | 'environmental' | 'social' | 'economic'

export type ProjectStatus = 'draft' | 'setup' | 'active' | 'in_review' | 'completed' | 'archived'

export interface Project {
  id: string
  name: string
  description: string
  type: ProjectType
  status: ProjectStatus
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
  
  // Sistema de estados
  statusHistory: StatusChange[]
  canTransitionTo?: ProjectStatus[]
  
  // Validaciones según estado
  validationRules: ProjectValidationRules
  isValid: boolean
  validationErrors: string[]
}

// Nuevo: Historial de cambios de estado
export interface StatusChange {
  id: string
  from: ProjectStatus | null
  to: ProjectStatus
  changedBy: string
  changedAt: string
  reason?: string
  notes?: string
}

// Nuevo: Reglas de validación según estado
export interface ProjectValidationRules {
  requiresVariables: boolean
  minVariables: number
  maxVariables: number
  requiresExperts: boolean
  minExperts: number
  maxExperts: number
  requiresMatrix: boolean
  allowEditing: boolean
}

// Nuevo: Estados válidos de transición
export const PROJECT_TRANSITIONS: Record<ProjectStatus, ProjectStatus[]> = {
  draft: ['setup', 'archived'],
  setup: ['active', 'draft', 'archived'],
  active: ['in_review', 'setup', 'archived'],
  in_review: ['completed', 'active', 'archived'],
  completed: ['archived'],
  archived: ['draft'] // Solo para recuperar proyectos archivados
}

// Nuevo: Configuración de validación por estado
export const PROJECT_VALIDATION_CONFIG: Record<ProjectStatus, ProjectValidationRules> = {
  draft: {
    requiresVariables: false,
    minVariables: 0,
    maxVariables: 50,
    requiresExperts: false,
    minExperts: 0,
    maxExperts: 100,
    requiresMatrix: false,
    allowEditing: true
  },
  setup: {
    requiresVariables: true,
    minVariables: 3,
    maxVariables: 10,
    requiresExperts: true,
    minExperts: 3,
    maxExperts: 50,
    requiresMatrix: false,
    allowEditing: true
  },
  active: {
    requiresVariables: true,
    minVariables: 3,
    maxVariables: 10,
    requiresExperts: true,
    minExperts: 3,
    maxExperts: 50,
    requiresMatrix: true,
    allowEditing: false // Solo expertos pueden votar
  },
  in_review: {
    requiresVariables: true,
    minVariables: 3,
    maxVariables: 10,
    requiresExperts: true,
    minExperts: 3,
    maxExperts: 50,
    requiresMatrix: true,
    allowEditing: false
  },
  completed: {
    requiresVariables: true,
    minVariables: 3,
    maxVariables: 10,
    requiresExperts: true,
    minExperts: 3,
    maxExperts: 50,
    requiresMatrix: true,
    allowEditing: false
  },
  archived: {
    requiresVariables: false,
    minVariables: 0,
    maxVariables: 50,
    requiresExperts: false,
    minExperts: 0,
    maxExperts: 100,
    requiresMatrix: false,
    allowEditing: false
  }
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

export type ExpertStatus = 'invited' | 'active' | 'voting' | 'completed' | 'declined'

export interface Expert {
  id: string
  name: string
  email: string
  expertise: string[]
  role: 'expert' | 'moderator'
  avatar?: string
  status: ExpertStatus
  
  // Nuevos campos para gestión completa
  invitedAt: string
  invitedBy: string
  respondedAt?: string
  lastActivity?: string
  votingProgress?: number // 0-100%
  notes?: string
  
  // Configuración de notificaciones
  notificationPreferences: {
    email: boolean
    inApp: boolean
    reminders: boolean
  }
}

// Nuevo: Historial de actividad de expertos
export interface ExpertActivity {
  id: string
  expertId: string
  projectId: string
  type: 'invited' | 'joined' | 'voted' | 'commented' | 'declined'
  description: string
  timestamp: string
  metadata?: Record<string, any>
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
export type ProjectFilter = {
  status?: ProjectStatus[]
  search?: string
  tags?: string[]
  createdBy?: string
  isPublic?: boolean
  hasMatrix?: boolean
}

// Nuevo: Filtros para expertos
export type ExpertFilter = {
  status?: ExpertStatus[]
  search?: string
  expertise?: string[]
  role?: Expert['role'][]
}

// Nuevo: Utilidades para el sistema de estados
export interface ProjectStateUtils {
  canTransitionTo(from: ProjectStatus, to: ProjectStatus): boolean
  validateProject(project: Project): { isValid: boolean; errors: string[] }
  getRequiredFields(status: ProjectStatus): string[]
  getStatusBadgeColor(status: ProjectStatus): string
  getStatusLabel(status: ProjectStatus): string
}
