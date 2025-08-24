/**
 * 🎭 Mock Data para Desarrollo
 * Datos de prueba para proyectos MIC MAC
 */

import { Project, Variable, Expert, ProjectType, ProjectStatus } from '@/types/project'

// Variables de ejemplo para análisis prospectivos
const sampleVariables: Variable[] = [
  {
    id: 'var-1',
    projectId: 'proj-1',
    name: 'Tecnología Emergente',
    description: 'Adopción de nuevas tecnologías en el sector',
    order: 0,
    category: 'motriz',
    color: '#3B82F6',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'var-2',
    projectId: 'proj-1',
    name: 'Regulación Gubernamental',
    description: 'Políticas y regulaciones del gobierno',
    order: 1,
    category: 'motriz',
    color: '#EF4444',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'var-3',
    projectId: 'proj-1',
    name: 'Demanda del Mercado',
    description: 'Necesidades y preferencias del consumidor',
    order: 2,
    category: 'dependiente',
    color: '#10B981',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  }
]

// Expertos de ejemplo
export const sampleExperts: Expert[] = [
  {
    id: 'expert-1',
    name: 'Dr. María González',
    email: 'maria.gonzalez@universidad.edu',
    organization: 'Universidad Nacional',
    expertiseAreas: ['Tecnología', 'Innovación', 'Prospectiva'],
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    yearsExperience: 15,
    notes: 'Experta senior con 15 años de experiencia',
    role: 'EXPERT',
    biography: 'Doctora en Ingeniería con especialización en prospectiva tecnológica. Ha dirigido múltiples estudios de futuro para el sector público y privado.',
    linkedinUrl: 'https://linkedin.com/in/maria-gonzalez-tech',
    phone: '+34 666 111 222',
    isActive: true,
    lastLoginAt: '2024-01-20T14:30:00Z',
    totalProjectsParticipated: 12,
    averageResponseTime: 3.2,
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z'
  },
  {
    id: 'expert-2',
    name: 'Ing. Carlos Ruiz',
    email: 'carlos.ruiz@consultora.com',
    organization: 'Consultora Tech',
    expertiseAreas: ['Políticas Públicas', 'Regulación'],
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    yearsExperience: 12,
    notes: 'Especialista en marco regulatorio',
    role: 'MODERATOR',
    biography: 'Ingeniero con amplia experiencia en consultoría de políticas públicas y marcos regulatorios para nuevas tecnologías.',
    linkedinUrl: 'https://linkedin.com/in/carlos-ruiz-policy',
    phone: '+34 777 333 444',
    isActive: true,
    lastLoginAt: '2024-01-19T16:45:00Z',
    totalProjectsParticipated: 8,
    averageResponseTime: 2.8,
    createdAt: '2024-01-10T09:15:00Z',
    updatedAt: '2024-01-19T16:45:00Z'
  },
  {
    id: 'expert-3',
    name: 'Dra. Ana Martín',
    email: 'ana.martin@empresa.com',
    organization: 'Marketing Solutions',
    expertiseAreas: ['Marketing', 'Comportamiento del Consumidor'],
    avatar: null,
    yearsExperience: 8,
    notes: 'Especialista en comportamiento del consumidor',
    role: 'EXPERT',
    biography: 'Doctora en Psicología del Consumidor con enfoque en adopción de tecnologías emergentes.',
    linkedinUrl: 'https://linkedin.com/in/ana-martin-marketing',
    phone: null,
    isActive: true,
    lastLoginAt: '2024-01-15T14:00:00Z',
    totalProjectsParticipated: 5,
    averageResponseTime: 5.1,
    createdAt: '2024-01-15T14:00:00Z',
    updatedAt: '2024-01-15T14:00:00Z'
  },
  {
    id: 'expert-4',
    name: 'Prof. Roberto Silva',
    email: 'roberto.silva@economia.gov',
    organization: 'Ministerio de Economía',
    expertiseAreas: ['Económico', 'Políticas Fiscales'],
    avatar: null,
    yearsExperience: 20,
    notes: 'Economista senior del gobierno',
    role: 'EXPERT',
    biography: 'Profesor de Economía Aplicada con 20 años de experiencia en políticas fiscales y análisis económico prospectivo.',
    linkedinUrl: null,
    phone: '+34 666 999 888',
    isActive: true,
    lastLoginAt: '2024-01-18T11:00:00Z',
    totalProjectsParticipated: 15,
    averageResponseTime: 4.0,
    createdAt: '2024-01-05T08:00:00Z',
    updatedAt: '2024-01-18T11:00:00Z'
  },
  {
    id: 'expert-5',
    name: 'Dra. Laura Vega',
    email: 'laura.vega@sostenible.org',
    organization: 'Instituto de Sostenibilidad',
    expertiseAreas: ['Ambiental', 'Sostenibilidad', 'Energético'],
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    yearsExperience: 18,
    notes: 'Experta en sostenibilidad ambiental',
    role: 'EXPERT',
    biography: 'Doctora en Ciencias Ambientales con especialización en transición energética y desarrollo sostenible.',
    linkedinUrl: 'https://linkedin.com/in/laura-vega-sostenible',
    phone: '+34 555 666 777',
    isActive: true,
    lastLoginAt: '2024-01-21T09:30:00Z',
    totalProjectsParticipated: 9,
    averageResponseTime: 3.7,
    createdAt: '2024-01-08T10:00:00Z',
    updatedAt: '2024-01-21T09:30:00Z'
  }
]

// Proyectos de ejemplo
export const mockProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'Futuro del Transporte Urbano 2030',
    description: 'Análisis prospectivo sobre la evolución del transporte urbano hacia 2030, considerando vehículos eléctricos, transporte público y movilidad compartida.',
    type: 'STRATEGIC',
    status: 'ACTIVE',
    expectedExperts: 8,
    tags: ['transporte', 'urbano', 'sostenibilidad'],
    isPublic: true,
    creatorId: 'user-1',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    creator: { name: 'Usuario Demo', email: 'demo@micmac.com' },
    variables: sampleVariables,
    projectExperts: sampleExperts.map(expert => ({
      id: `pe-${expert.id}`,
      projectId: 'proj-1',
      expertId: expert.id,
      userId: null,
      status: 'ACTIVE',
      invitedAt: '2024-01-10T09:00:00Z',
      invitedBy: 'user-1',
      respondedAt: '2024-01-10T10:30:00Z',
      lastActivity: '2024-01-20T14:30:00Z',
      votingProgress: 85,
      notes: null,
      emailNotifications: true,
      inAppNotifications: true,
      reminderNotifications: true,
      updatedAt: '2024-01-20T14:30:00Z',
      expert
    })),
    statusHistory: [
      {
        id: 'status_1_init',
        projectId: 'proj-1',
        from: null,
        to: 'DRAFT',
        changedBy: 'user-1',
        reason: 'Proyecto creado',
        notes: 'Estado inicial del proyecto',
        changedAt: '2024-01-15T10:00:00Z'
      }
    ]
  },
  {
    id: 'proj-2',
    name: 'Digitalización del Sector Salud',
    description: 'Estudio sobre el impacto de la digitalización en el sector salud, incluyendo telemedicina, IA diagnóstica y expedientes electrónicos.',
    type: 'TECHNOLOGICAL',
    status: 'DRAFT',
    expectedExperts: 5,
    tags: ['salud', 'digital', 'IA'],
    isPublic: false,
    creatorId: 'user-1',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-18T16:45:00Z',
    creator: { name: 'Usuario Demo', email: 'demo@micmac.com' },
    variables: [
      {
        id: 'var-health-1',
        projectId: 'proj-2',
        name: 'Inteligencia Artificial Médica',
        description: 'Adopción de IA en diagnósticos médicos',
        order: 0,
        category: 'motriz',
        color: '#8B5CF6',
        createdAt: '2024-01-10T09:00:00Z',
        updatedAt: '2024-01-10T09:00:00Z'
      }
    ],
    projectExperts: [],
    statusHistory: [
      {
        id: 'status_2_init',
        projectId: 'proj-2',
        from: null,
        to: 'DRAFT',
        changedBy: 'user-1',
        reason: 'Proyecto creado',
        notes: 'Estado inicial del proyecto',
        changedAt: '2024-01-10T09:00:00Z'
      }
    ]
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
      (p.description && p.description.toLowerCase().includes(search)) ||
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
  
  const newProject: Project = {
    id: `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: data.name,
    description: data.description,
    type: data.type,
    status: 'DRAFT',
    createdAt,
    updatedAt: createdAt,
    creatorId: 'current-user',
    expectedExperts: data.expectedExperts,
    variables: [],
    projectExperts: [],
    statusHistory: [],
    tags: [],
    isPublic: false,
    creator: { name: 'Usuario Demo', email: 'demo@micmac.com' }
  }
  
  // En implementación real, esto haría una llamada a la API
  mockProjects.unshift(newProject)
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

// Función para simular delay de API
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
