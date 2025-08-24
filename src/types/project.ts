/**
 * 📊 Types para Proyectos MIC MAC
 * Alineados con esquema Prisma + Supabase (API responses)
 */

// Tipos base que coinciden con la respuesta de la API
export type ProjectType = 'STRATEGIC' | 'TECHNOLOGICAL' | 'ENVIRONMENTAL' | 'SOCIAL' | 'ECONOMIC'
export type ProjectStatus = 'DRAFT' | 'SETUP' | 'ACTIVE' | 'IN_REVIEW' | 'COMPLETED' | 'ARCHIVED'
export type ProjectExpertStatus = 'INVITED' | 'ACTIVE' | 'VOTING' | 'COMPLETED' | 'DECLINED'

// Interfaces que coinciden con la respuesta de la API (fechas como strings)
export interface Variable {
  id: string
  projectId: string
  name: string
  description: string | null
  order: number
  category: string | null
  color: string | null
  createdAt: string
  updatedAt: string
}

export interface Expert {
  id: string
  name: string
  email: string
  organization: string | null
  expertiseAreas: string[]
  avatar: string | null
  yearsExperience: number | null
  notes: string | null
  // Nuevos campos para CRUD completo
  role: 'EXPERT' | 'MODERATOR'
  biography: string | null
  linkedinUrl: string | null
  phone: string | null
  isActive: boolean
  lastLoginAt: string | null
  totalProjectsParticipated: number
  averageResponseTime: number | null // en horas
  createdAt: string
  updatedAt: string
}

// Filtros expandidos para expertos
export type ExpertFilter = {
  search?: string
  expertiseAreas?: string[]
  role?: 'EXPERT' | 'MODERATOR'
  organization?: string
  isActive?: boolean
  minExperience?: number
  maxExperience?: number
}

// Datos para crear/editar experto
export interface ExpertFormData {
  name: string
  email: string
  organization?: string
  expertiseAreas: string[]
  avatar?: string
  yearsExperience?: number
  notes?: string
  role: 'EXPERT' | 'MODERATOR'
  biography?: string
  linkedinUrl?: string
  phone?: string
}

// Estadísticas de expertos
export interface ExpertStats {
  totalExperts: number
  totalModerators: number
  totalActiveExperts: number
  expertiseDistribution: { area: string; count: number }[]
  averageExperience: number
  organizationDistribution: { organization: string; count: number }[]
}

export interface ProjectExpert {
  id: string
  projectId: string
  expertId: string
  userId: string | null
  status: ProjectExpertStatus
  invitedAt: string
  invitedBy: string
  respondedAt: string | null
  lastActivity: string | null
  votingProgress: number
  notes: string | null
  emailNotifications: boolean
  inAppNotifications: boolean
  reminderNotifications: boolean
  updatedAt: string
  expert: Expert
}

export interface StatusChange {
  id: string
  projectId: string
  from: ProjectStatus | null
  to: ProjectStatus
  changedBy: string
  reason: string | null
  notes: string | null
  changedAt: string
}

export interface Project {
  id: string
  name: string
  description: string | null
  type: ProjectType
  status: ProjectStatus
  expectedExperts: number
  tags: string[]
  isPublic: boolean
  creatorId: string
  createdAt: string
  updatedAt: string
  
  // Relaciones incluidas
  creator: { name: string | null; email: string }
  variables: Variable[]
  projectExperts: ProjectExpert[]
  statusHistory: StatusChange[]
  _count?: { variables: number; projectExperts: number }
}

// Estados válidos de transición
export const PROJECT_TRANSITIONS: Record<ProjectStatus, ProjectStatus[]> = {
  DRAFT: ['SETUP', 'ARCHIVED'],
  SETUP: ['ACTIVE', 'DRAFT', 'ARCHIVED'],
  ACTIVE: ['IN_REVIEW', 'SETUP', 'ARCHIVED'],
  IN_REVIEW: ['COMPLETED', 'ACTIVE', 'ARCHIVED'],
  COMPLETED: ['ARCHIVED'],
  ARCHIVED: ['DRAFT'] // Solo para recuperar proyectos archivados
}

// Reglas de validación según estado
export interface ProjectValidationRules {
  requiresVariables: boolean
  minVariables: number
  maxVariables: number
  requiresExpertos: boolean
  minExpertos: number
  maxExpertos: number
  requiresMatrix: boolean
  allowEditing: boolean
}

export const PROJECT_VALIDATION_CONFIG: Record<ProjectStatus, ProjectValidationRules> = {
  DRAFT: {
    requiresVariables: false,
    minVariables: 0,
    maxVariables: 50,
    requiresExpertos: false,
    minExpertos: 0,
    maxExpertos: 100,
    requiresMatrix: false,
    allowEditing: true
  },
  SETUP: {
    requiresVariables: true,
    minVariables: 3,
    maxVariables: 10,
    requiresExpertos: true,
    minExpertos: 3,
    maxExpertos: 50,
    requiresMatrix: false,
    allowEditing: true
  },
  ACTIVE: {
    requiresVariables: true,
    minVariables: 3,
    maxVariables: 10,
    requiresExpertos: true,
    minExpertos: 3,
    maxExpertos: 50,
    requiresMatrix: true,
    allowEditing: false // Solo expertos pueden votar
  },
  IN_REVIEW: {
    requiresVariables: true,
    minVariables: 3,
    maxVariables: 10,
    requiresExpertos: true,
    minExpertos: 3,
    maxExpertos: 50,
    requiresMatrix: true,
    allowEditing: false
  },
  COMPLETED: {
    requiresVariables: true,
    minVariables: 3,
    maxVariables: 10,
    requiresExpertos: true,
    minExpertos: 3,
    maxExpertos: 50,
    requiresMatrix: true,
    allowEditing: false
  },
  ARCHIVED: {
    requiresVariables: false,
    minVariables: 0,
    maxVariables: 50,
    requiresExpertos: false,
    minExpertos: 0,
    maxExpertos: 100,
    requiresMatrix: false,
    allowEditing: false
  }
}

// Filtros
export type ProjectFilter = {
  status?: ProjectStatus[]
  search?: string
  tags?: string[]
  creatorId?: string
  isPublic?: boolean
}

// Para la matriz de votación (Fase 5)
export interface VotingMatrix {
  id: string
  projectId: string
  responses: VotingResponse[]
  isComplete: boolean
  deadline?: string
}

// Tipos para las 2 fases de MIC MAC
export type VotingPhase = 'INFLUENCE' | 'DEPENDENCE'

export interface VotingResponse {
  expertId: string
  variableAId: string
  variableBId: string
  phase: VotingPhase // NUEVA: Fase de votación
  value: number // 0-3: Sin influencia, Débil, Moderada, Fuerte
  confidence?: number // 1-5: Nivel de confianza
  timeSpent?: number // Segundos gastados
  createdAt: string
  updatedAt: string
}

// Sesión de votación con control de fases
export interface VotingSession {
  expertId: string
  projectId: string
  currentPhase: VotingPhase
  phase1Complete: boolean
  phase2Complete: boolean
  totalPairs: number
  completedPairs: number
  startedAt: string
  lastActivity: string
}

// Utilidades para el sistema de estados
export const getStatusColor = (status: ProjectStatus): string => {
  const colors = {
    DRAFT: 'bg-gray-500/20 text-gray-400',
    SETUP: 'bg-yellow-500/20 text-yellow-400',
    ACTIVE: 'bg-micmac-primary-500/20 text-micmac-primary-300',
    IN_REVIEW: 'bg-purple-500/20 text-purple-400',
    COMPLETED: 'bg-micmac-secondary-500/20 text-micmac-secondary-300',
    ARCHIVED: 'bg-gray-600/20 text-gray-500'
  }
  return colors[status]
}

export const getStatusLabel = (status: ProjectStatus): string => {
  const labels = {
    DRAFT: 'Borrador',
    SETUP: 'Configuración',
    ACTIVE: 'Activo',
    IN_REVIEW: 'En Revisión',
    COMPLETED: 'Completado',
    ARCHIVED: 'Archivado'
  }
  return labels[status]
}

export const canTransitionTo = (from: ProjectStatus, to: ProjectStatus): boolean => {
  return PROJECT_TRANSITIONS[from].includes(to)
}

export const validateProject = (project: Project): { isValid: boolean; errors: string[] } => {
  const rules = PROJECT_VALIDATION_CONFIG[project.status]
  const errors: string[] = []

  if (rules.requiresVariables && project.variables.length < rules.minVariables) {
    errors.push(`Mínimo ${rules.minVariables} variables requeridas`)
  }

  if (project.variables.length > rules.maxVariables) {
    errors.push(`Máximo ${rules.maxVariables} variables permitidas`)
  }

  if (rules.requiresExpertos && project.projectExperts.length < rules.minExpertos) {
    errors.push(`Mínimo ${rules.minExpertos} expertos requeridos`)
  }

  if (project.projectExperts.length > rules.maxExpertos) {
    errors.push(`Máximo ${rules.maxExpertos} expertos permitidos`)
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}
