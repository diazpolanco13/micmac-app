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
  organization: string | null // 🔄 MANTENER: Para compatibilidad (nombre de la org)
  organizationId: string // 🆕 MULTI-TENANT: FK obligatorio
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
  
  // 🏆 MÉTRICAS DE DESEMPEÑO (campos calculados)
  performanceMetrics?: {
    overallReliability: number // 0-100
    consistencyScore: number // 0-100
    participationQuality: number // 0-100
    timeManagement: number // 0-100
    communicationEffectiveness: number // 0-100
    invitationPriority: 'HIGH' | 'MEDIUM' | 'LOW' | 'AVOID'
    badges: Array<{
      type: string
      name: string
      level: string
      icon: string
      earnedAt: string
    }>
    trends: {
      last30Days: number // cambio en puntuación
      improving: boolean
    }
    lastCalculated: string
  }
  
  // 📊 ESTADÍSTICAS RÁPIDAS (para UI)
  quickStats?: {
    totalInvitations: number
    acceptanceRate: number // %
    completionRate: number // %
    averageResponseTimeHours: number
    totalInconsistencies: number
    preferredProjectTypes: string[]
  }
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
  organizationId: string // 🆕 MULTI-TENANT: FK obligatorio
  createdAt: string
  updatedAt: string
  
  // Relaciones incluidas
  creator: { name: string | null; email: string }
  organization?: Organization // 🆕 MULTI-TENANT: Relación opcional
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

// Tipos para resultados MIC MAC (Etapa 5)
export interface MicMacResults {
  projectId: string
  variables: VariableAnalysis[]
  totalVotes: number
  calculatedAt: string
  averageMotricity: number
  averageDependence: number
  matrixData: number[][] // Matriz NxN para visualización
}

export interface VariableAnalysis {
  variable: Variable
  motricity: number // Influencia (Eje Y)
  dependence: number // Dependencia (Eje X) 
  coordinates: [number, number] // [dependence, motricity]
  classification: VariableClassification
  rank: number
  percentage: number // % del total
}

export type VariableClassification = 
  | "Variable Motriz"     // Alta influencia, baja dependencia
  | "Variable de Enlace"  // Alta influencia, alta dependencia
  | "Variable Dependiente" // Baja influencia, alta dependencia
  | "Variable Autónoma"   // Baja influencia, baja dependencia

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

// 🎯 SISTEMA DE EXPERTISE SIMPLE - FASE 1
export type ExperienceType = 'PROFESSIONAL' | 'ACADEMIC' | 'RESEARCH' | 'CONSULTING' | 'PERSONAL'
export type EducationLevel = 'AUTODIDACTA' | 'TECNICO' | 'UNIVERSITARIO' | 'POSTGRADO' | 'DOCTORADO'
export type ExpertiseLevel = 'NOVATO' | 'COMPETENTE' | 'EXPERIMENTADO' | 'EXPERTO' | 'MAESTRO'
export type ExpertisePriority = 'HIGH' | 'MEDIUM' | 'LOW'

export interface ExpertiseArea {
  name: string
  yearsExperience: number
  proficiencyLevel: 1 | 2 | 3 | 4 | 5
  experienceType: ExperienceType
  educationLevel?: EducationLevel
  
  // Calculados automáticamente
  calculatedScore: number
  level: ExpertiseLevel
  priority: ExpertisePriority
  
  createdAt: string
  updatedAt: string
}

// Utilidades para el cálculo de scores
export interface ExpertiseCalculationResult {
  score: number
  level: ExpertiseLevel
  priority: ExpertisePriority
}

// 🏢 SISTEMA MULTI-ORGANIZACIONAL (MULTI-TENANT)
export type OrganizationPlan = 'FREE' | 'PRO' | 'ENTERPRISE'
export type UserRole = 'SUPER_ADMIN' | 'ORG_ADMIN' | 'MODERATOR' | 'EXPERT'

export interface Organization {
  id: string
  name: string
  slug: string // "empresa-a", "empresa-b" 
  domain?: string // "empresaa.com" (opcional para validación de email)
  plan: OrganizationPlan
  isActive: boolean
  createdAt: string
  updatedAt: string
  
  // Límites por plan
  limits: {
    maxModerators: number
    maxExperts: number
    maxProjects: number
    maxVariablesPerProject: number
  }
  
  // Configuración organizacional
  settings: {
    allowExternalExperts: boolean
    requireEmailDomain: boolean
    autoApproveUsers: boolean
    logoUrl?: string
    brandColors?: {
      primary: string
      secondary: string
    }
  }
  
  // Estadísticas (calculadas)
  stats?: {
    totalUsers: number
    totalProjects: number
    totalExperts: number
    activeProjects: number
    completedProjects: number
  }
}

// Límites por plan predefinidos
export const ORGANIZATION_PLAN_LIMITS: Record<OrganizationPlan, Organization['limits']> = {
  FREE: {
    maxModerators: 1,
    maxExperts: 5,
    maxProjects: 3,
    maxVariablesPerProject: 10
  },
  PRO: {
    maxModerators: 5,
    maxExperts: 20,
    maxProjects: 15,
    maxVariablesPerProject: 15
  },
  ENTERPRISE: {
    maxModerators: 999,
    maxExperts: 999,
    maxProjects: 999,
    maxVariablesPerProject: 20
  }
}
