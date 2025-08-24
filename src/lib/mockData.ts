/**
 * 🎭 Mock Data para Desarrollo
 * Datos de prueba para proyectos MIC MAC
 */

import { Project, Variable, Expert, ProjectType, ProjectStatus, StatusChange, PROJECT_VALIDATION_CONFIG, PROJECT_TRANSITIONS } from '@/types/project'

// Variables de ejemplo para análisis prospectivos
const sampleVariables: Variable[] = [
  {
    id: 'var-1',
    name: 'Tecnología Emergente',
    description: 'Adopción de nuevas tecnologías en el sector',
    order: 0,
    category: 'motriz',
    color: '#3B82F6',
    position: { x: 100, y: 100 }
  },
  {
    id: 'var-2',
    name: 'Regulación Gubernamental',
    description: 'Políticas y regulaciones del gobierno',
    order: 1,
    category: 'motriz',
    color: '#EF4444',
    position: { x: 200, y: 150 }
  },
  {
    id: 'var-3',
    name: 'Demanda del Mercado',
    description: 'Necesidades y preferencias del consumidor',
    order: 2,
    category: 'dependiente',
    color: '#10B981',
    position: { x: 300, y: 200 }
  },
  {
    id: 'var-4',
    name: 'Competencia Internacional',
    description: 'Presión competitiva de mercados globales',
    order: 3,
    category: 'enlace',
    color: '#F59E0B',
    position: { x: 150, y: 250 }
  }
]

// Expertos de ejemplo
const sampleExperts: Expert[] = [
  {
    id: 'expert-1',
    name: 'Dr. María González',
    email: 'maria.gonzalez@universidad.edu',
    expertise: ['Tecnología', 'Innovación', 'Prospectiva'],
    role: 'expert',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    invitedAt: '2024-01-10T09:00:00Z',
    invitedBy: 'user-1',
    respondedAt: '2024-01-10T10:30:00Z',
    lastActivity: '2024-01-20T14:30:00Z',
    votingProgress: 85,
    notes: 'Experta senior con 15 años de experiencia',
    notificationPreferences: {
      email: true,
      inApp: true,
      reminders: true
    }
  },
  {
    id: 'expert-2',
    name: 'Ing. Carlos Ruiz',
    email: 'carlos.ruiz@consultora.com',
    expertise: ['Políticas Públicas', 'Regulación'],
    role: 'expert',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    invitedAt: '2024-01-10T09:15:00Z',
    invitedBy: 'user-1',
    respondedAt: '2024-01-10T11:00:00Z',
    lastActivity: '2024-01-19T16:45:00Z',
    votingProgress: 60,
    notes: 'Especialista en marco regulatorio',
    notificationPreferences: {
      email: true,
      inApp: false,
      reminders: false
    }
  },
  {
    id: 'expert-3',
    name: 'Dra. Ana Martín',
    email: 'ana.martin@empresa.com',
    expertise: ['Marketing', 'Comportamiento del Consumidor'],
    role: 'expert',
    status: 'invited',
    invitedAt: '2024-01-15T14:00:00Z',
    invitedBy: 'user-1',
    votingProgress: 0,
    notes: 'Pendiente de confirmación',
    notificationPreferences: {
      email: true,
      inApp: true,
      reminders: true
    }
  }
]

// Proyectos de ejemplo
export const mockProjects: Project[] = [
  // Proyecto 1: Estado 'active' con sistema completo
  {
    id: 'proj-1',
    name: 'Futuro del Transporte Urbano 2030',
    description: 'Análisis prospectivo sobre la evolución del transporte urbano hacia 2030, considerando vehículos eléctricos, transporte público y movilidad compartida.',
    type: 'strategic',
    status: 'active',
    createdBy: 'user-1',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    expectedExperts: 8,
    variables: sampleVariables,
    experts: sampleExperts,
    tags: ['transporte', 'urbano', 'sostenibilidad'],
    isPublic: true,
    
    // Sistema de estados
    statusHistory: [
      {
        id: 'status_1_init',
        from: null,
        to: 'draft',
        changedBy: 'user-1',
        changedAt: '2024-01-15T10:00:00Z',
        reason: 'Proyecto creado',
        notes: 'Estado inicial del proyecto'
      },
      {
        id: 'status_1_setup',
        from: 'draft',
        to: 'setup',
        changedBy: 'user-1', 
        changedAt: '2024-01-16T11:00:00Z',
        reason: 'Variables y expertos configurados',
        notes: 'Listo para activar votación'
      },
      {
        id: 'status_1_active',
        from: 'setup',
        to: 'active',
        changedBy: 'user-1',
        changedAt: '2024-01-17T09:00:00Z',
        reason: 'Iniciar proceso de votación',
        notes: 'Expertos pueden comenzar a votar'
      }
    ],
    canTransitionTo: ['in_review', 'setup', 'archived'],
    validationRules: PROJECT_VALIDATION_CONFIG.active,
    isValid: true,
    validationErrors: []
  },
  
  // Proyecto 2: Estado 'draft' - falta configuración  
  {
    id: 'proj-2',
    name: 'Digitalización del Sector Salud',
    description: 'Estudio sobre el impacto de la digitalización en el sector salud, incluyendo telemedicina, IA diagnóstica y expedientes electrónicos.',
    type: 'technological',
    status: 'draft',
    createdBy: 'user-1',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-18T16:45:00Z',
    expectedExperts: 5,
    variables: [
      {
        id: 'var-health-1',
        name: 'Inteligencia Artificial Médica',
        description: 'Adopción de IA en diagnósticos médicos',
        order: 0,
        category: 'motriz',
        color: '#8B5CF6',
        position: { x: 120, y: 80 }
      },
      {
        id: 'var-health-2',
        name: 'Privacidad de Datos',
        description: 'Regulaciones sobre privacidad de datos médicos',
        order: 1,
        category: 'enlace',
        color: '#EC4899',
        position: { x: 180, y: 160 }
      },
      {
        id: 'var-health-3',
        name: 'Costo de Implementación',
        description: 'Inversión necesaria para digitalizar el sector',
        order: 2,
        category: 'dependiente',
        color: '#F59E0B',
        position: { x: 150, y: 200 }
      }
    ],
    experts: sampleExperts.slice(0, 2),
    tags: ['salud', 'digital', 'IA'],
    isPublic: false,
    
    // Sistema de estados
    statusHistory: [
      {
        id: 'status_2_init',
        from: null,
        to: 'draft',
        changedBy: 'user-1',
        changedAt: '2024-01-10T09:00:00Z',
        reason: 'Proyecto creado',
        notes: 'Estado inicial del proyecto'
      }
    ],
    canTransitionTo: ['setup', 'archived'],
    validationRules: PROJECT_VALIDATION_CONFIG.draft,
    isValid: true,
    validationErrors: []
  },
  
  // Proyecto 3: Estado 'completed' - proyecto finalizado
  {
    id: 'proj-3',
    name: 'Energías Renovables 2035',
    description: 'Análisis de escenarios futuros para la adopción masiva de energías renovables y su impacto en la matriz energética nacional.',
    type: 'environmental',
    status: 'completed',
    createdBy: 'user-2',
    createdAt: '2023-12-01T08:00:00Z',
    updatedAt: '2024-01-05T12:00:00Z',
    expectedExperts: 10,
    variables: [
      {
        id: 'var-energy-1',
        name: 'Costos de Tecnología Solar',
        description: 'Evolución de costos de paneles solares',
        order: 0,
        category: 'motriz',
        color: '#F59E0B',
        position: { x: 90, y: 120 }
      },
      {
        id: 'var-energy-2',
        name: 'Políticas Energéticas',
        description: 'Incentivos gubernamentales para energías limpias',
        order: 1,
        category: 'motriz',
        color: '#10B981',
        position: { x: 210, y: 90 }
      },
      {
        id: 'var-energy-3',
        name: 'Demanda Energética',
        description: 'Crecimiento de la demanda energética nacional',
        order: 2,
        category: 'dependiente',
        color: '#EF4444',
        position: { x: 150, y: 200 }
      }
    ],
    experts: sampleExperts,
    tags: ['energía', 'renovables', 'sostenibilidad'],
    isPublic: true,
    
    // Sistema de estados - proyecto completado
    statusHistory: [
      {
        id: 'status_3_init',
        from: null,
        to: 'draft',
        changedBy: 'user-2',
        changedAt: '2023-12-01T08:00:00Z',
        reason: 'Proyecto creado',
        notes: 'Estado inicial del proyecto'
      },
      {
        id: 'status_3_setup',
        from: 'draft',
        to: 'setup',
        changedBy: 'user-2',
        changedAt: '2023-12-02T09:00:00Z',
        reason: 'Configuración completada',
        notes: 'Variables y expertos listos'
      },
      {
        id: 'status_3_active',
        from: 'setup',
        to: 'active',
        changedBy: 'user-2',
        changedAt: '2023-12-05T10:00:00Z',
        reason: 'Iniciar votación',
        notes: 'Proceso de votación iniciado'
      },
      {
        id: 'status_3_review',
        from: 'active',
        to: 'in_review',
        changedBy: 'user-2',
        changedAt: '2023-12-20T16:00:00Z',
        reason: 'Votación completada',
        notes: 'Revisión de resultados'
      },
      {
        id: 'status_3_completed',
        from: 'in_review',
        to: 'completed',
        changedBy: 'user-2',
        changedAt: '2024-01-05T12:00:00Z',
        reason: 'Análisis finalizado',
        notes: 'Resultados validados y documentados'
      }
    ],
    canTransitionTo: ['archived'],
    validationRules: PROJECT_VALIDATION_CONFIG.completed,
    isValid: true,
    validationErrors: []
  }
]

// Usuarios mock
export const mockUsers = [
  {
    id: 'user-1',
    name: 'Moderador Demo',
    email: 'mod@micmac.com',
    role: 'MODERATOR' as const
  },
  {
    id: 'user-2',
    name: 'Experto Demo',
    email: 'expert@micmac.com',
    role: 'EXPERT' as const
  }
]

// Función para obtener proyectos con filtros
export function getFilteredProjects(filter: {
  status?: string[]
  search?: string
  tags?: string[]
}) {
  let filtered = [...mockProjects]

  if (filter.status && filter.status.length > 0) {
    filtered = filtered.filter(p => filter.status!.includes(p.status))
  }

  if (filter.search) {
    const search = filter.search.toLowerCase()
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(search) ||
      p.description.toLowerCase().includes(search) ||
      p.tags.some(tag => tag.toLowerCase().includes(search))
    )
  }

  if (filter.tags && filter.tags.length > 0) {
    filtered = filtered.filter(p => 
      filter.tags!.some(tag => p.tags.includes(tag))
    )
  }

  return filtered
}

// Función para crear un nuevo proyecto
export const createProject = (data: {
  name: string
  description: string
  type: ProjectType
  expectedExperts: number
}): Project => {
  const createdAt = new Date().toISOString()
  const initialStatus: ProjectStatus = 'draft'
  
  const newProject: Project = {
    id: `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: data.name,
    description: data.description,
    type: data.type,
    status: initialStatus,
    createdAt,
    updatedAt: createdAt,
    createdBy: 'current-user', // En implementación real vendría del contexto de auth
    expectedExperts: data.expectedExperts,
    variables: [],
    experts: [],
    tags: [],
    isPublic: false,
    
    // Sistema de estados
    statusHistory: createInitialStatusHistory(initialStatus, 'current-user', createdAt),
    canTransitionTo: PROJECT_TRANSITIONS[initialStatus],
    validationRules: PROJECT_VALIDATION_CONFIG[initialStatus],
    isValid: true, // Un proyecto vacío en draft siempre es válido
    validationErrors: []
  }
  
  // En implementación real, esto haría una llamada a la API
  mockProjects.unshift(newProject) // Agregar al inicio del array
  return newProject
}

// Función para actualizar un proyecto existente
export const updateProject = (projectId: string, updates: Partial<Project>): Project | null => {
  const index = mockProjects.findIndex(p => p.id === projectId)
  if (index === -1) return null
  
  const updatedProject = {
    ...mockProjects[index],
    ...updates,
    updatedAt: new Date().toISOString()
  }
  
  mockProjects[index] = updatedProject
  return updatedProject
}

// Función para eliminar un proyecto
export const deleteProject = (projectId: string): boolean => {
  const index = mockProjects.findIndex(p => p.id === projectId)
  if (index === -1) return false
  
  mockProjects.splice(index, 1)
  return true
}

// ✨ NUEVAS UTILIDADES PARA SISTEMA DE ESTADOS

// Función para validar proyecto según su estado
export const validateProject = (project: Project): { isValid: boolean; errors: string[] } => {
  const rules = PROJECT_VALIDATION_CONFIG[project.status]
  const errors: string[] = []

  if (rules.requiresVariables && project.variables.length < rules.minVariables) {
    errors.push(`Mínimo ${rules.minVariables} variables requeridas (tiene ${project.variables.length})`)
  }
  
  if (project.variables.length > rules.maxVariables) {
    errors.push(`Máximo ${rules.maxVariables} variables permitidas (tiene ${project.variables.length})`)
  }

  if (rules.requiresExperts && project.experts.length < rules.minExperts) {
    errors.push(`Mínimo ${rules.minExperts} expertos requeridos (tiene ${project.experts.length})`)
  }
  
  if (project.experts.length > rules.maxExperts) {
    errors.push(`Máximo ${rules.maxExperts} expertos permitidos (tiene ${project.experts.length})`)
  }

  if (rules.requiresMatrix && !project.matrix) {
    errors.push('Matriz de votación requerida para este estado')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Función para verificar si se puede hacer una transición de estado
export const canTransitionTo = (from: ProjectStatus, to: ProjectStatus): boolean => {
  return PROJECT_TRANSITIONS[from]?.includes(to) || false
}

// Función para realizar transición de estado
export const transitionProjectStatus = (
  projectId: string, 
  newStatus: ProjectStatus, 
  reason?: string,
  notes?: string
): Project | null => {
  const project = mockProjects.find(p => p.id === projectId)
  if (!project) return null

  if (!canTransitionTo(project.status, newStatus)) {
    throw new Error(`No se puede cambiar de ${project.status} a ${newStatus}`)
  }

  const statusChange: StatusChange = {
    id: `status_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    from: project.status,
    to: newStatus,
    changedBy: 'current-user', // En implementación real vendría del contexto de auth
    changedAt: new Date().toISOString(),
    reason,
    notes
  }

  const updatedProject = {
    ...project,
    status: newStatus,
    updatedAt: new Date().toISOString(),
    statusHistory: [...project.statusHistory, statusChange],
    validationRules: PROJECT_VALIDATION_CONFIG[newStatus],
    canTransitionTo: PROJECT_TRANSITIONS[newStatus]
  }

  const validation = validateProject(updatedProject)
  updatedProject.isValid = validation.isValid
  updatedProject.validationErrors = validation.errors

  const index = mockProjects.findIndex(p => p.id === projectId)
  mockProjects[index] = updatedProject

  return updatedProject
}

// Función para obtener colores de badges según estado
export const getStatusBadgeColor = (status: ProjectStatus): string => {
  const colors = {
    draft: 'bg-gray-100 text-gray-800',
    setup: 'bg-yellow-100 text-yellow-800',
    active: 'bg-blue-100 text-blue-800',
    in_review: 'bg-purple-100 text-purple-800',
    completed: 'bg-green-100 text-green-800',
    archived: 'bg-red-100 text-red-800'
  }
  return colors[status] || colors.draft
}

// Función para obtener labels en español
export const getStatusLabel = (status: ProjectStatus): string => {
  const labels = {
    draft: 'Borrador',
    setup: 'Configuración',
    active: 'Activo',
    in_review: 'En Revisión',
    completed: 'Completado',
    archived: 'Archivado'
  }
  return labels[status] || 'Desconocido'
}

// Función para crear historial inicial de estado
const createInitialStatusHistory = (status: ProjectStatus, createdBy: string, createdAt: string): StatusChange[] => {
  return [{
    id: `status_initial_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    from: null,
    to: status,
    changedBy: createdBy,
    changedAt: createdAt,
    reason: 'Proyecto creado',
    notes: 'Estado inicial del proyecto'
  }]
}

// Función para simular delay de API
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
