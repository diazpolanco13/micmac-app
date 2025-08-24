/**
 * 🎭 Mock Data para Desarrollo
 * Datos de prueba para proyectos MIC MAC
 */

import { Project, Variable, Expert, ProjectType } from '@/types/project'

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
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150'
  },
  {
    id: 'expert-2',
    name: 'Ing. Carlos Ruiz',
    email: 'carlos.ruiz@consultora.com',
    expertise: ['Políticas Públicas', 'Regulación'],
    role: 'expert',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
  },
  {
    id: 'expert-3',
    name: 'Dra. Ana Martín',
    email: 'ana.martin@empresa.com',
    expertise: ['Marketing', 'Comportamiento del Consumidor'],
    role: 'expert',
    status: 'invited'
  }
]

// Proyectos de ejemplo
export const mockProjects: Project[] = [
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
    isPublic: true
  },
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
    isPublic: false
  },
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
    isPublic: true
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
  const newProject: Project = {
    id: `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: data.name,
    description: data.description,
    type: data.type,
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'current-user', // En implementación real vendría del contexto de auth
    expectedExperts: data.expectedExperts,
    variables: [],
    experts: [],
    tags: [],
    isPublic: false
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

// Función para simular delay de API
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
