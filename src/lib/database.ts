/**
 * 🗄️ Database Functions - Prisma + Supabase
 * Funciones CRUD reales para MIC MAC Pro
 */

import { prisma } from './prisma'
import { 
  ProjectStatus, 
  ProjectType, 
  ProjectExpertStatus 
} from '@prisma/client'
import type { 
  Project as ProjectDB,
  Variable as VariableDB,
  Expert as ExpertDB,
  ProjectExpert as ProjectExpertDB,
  StatusChange as StatusChangeDB
} from '@prisma/client'

// ✨ PROYECTOS

export const createProject = async (data: {
  name: string
  description: string
  type: ProjectType
  expectedExperts: number
  creatorId: string
  organizationId?: string // 🏢 MULTI-TENANT: Campo opcional temporalmente
}): Promise<ProjectDB> => {
  const project = await prisma.project.create({
    data: {
      name: data.name,
      description: data.description,
      type: data.type,
      expectedExperts: data.expectedExperts,
      creatorId: data.creatorId,
      organizationId: data.organizationId || 'default-org', // 🏢 MULTI-TENANT: Fallback temporal
      status: 'DRAFT',
      tags: [],
      isPublic: false
    }
  })

  // Crear el registro inicial de cambio de estado
  await prisma.statusChange.create({
    data: {
      projectId: project.id,
      from: null,
      to: 'DRAFT',
      changedBy: data.creatorId,
      reason: 'Proyecto creado',
      notes: 'Estado inicial del proyecto'
    }
  })

  return project
}

export const getProjects = async (filter?: {
  status?: ProjectStatus[]
  search?: string
  tags?: string[]
  creatorId?: string
}): Promise<(ProjectDB & {
  creator: { name: string | null, email: string }
  variables: VariableDB[]
  projectExperts: (ProjectExpertDB & { expert: ExpertDB })[]
  statusHistory: StatusChangeDB[]
  _count: { variables: number, projectExperts: number }
})[]> => {
  const where: any = {}

  if (filter?.status && filter.status.length > 0) {
    where.status = { in: filter.status }
  }

  if (filter?.search) {
    where.OR = [
      { name: { contains: filter.search, mode: 'insensitive' } },
      { description: { contains: filter.search, mode: 'insensitive' } },
      { tags: { has: filter.search.toLowerCase() } }
    ]
  }

  if (filter?.tags && filter.tags.length > 0) {
    where.tags = { hasEvery: filter.tags }
  }

  if (filter?.creatorId) {
    where.creatorId = filter.creatorId
  }

  return await prisma.project.findMany({
    where,
    include: {
      creator: { select: { name: true, email: true } },
      variables: { orderBy: { order: 'asc' } },
      projectExperts: {
        include: { expert: true },
        orderBy: { invitedAt: 'desc' }
      },
      statusHistory: { orderBy: { changedAt: 'desc' } },
      _count: { select: { variables: true, projectExperts: true } }
    },
    orderBy: { updatedAt: 'desc' }
  })
}

export const getProjectById = async (id: string): Promise<(ProjectDB & {
  creator: { name: string | null, email: string }
  variables: VariableDB[]
  projectExperts: (ProjectExpertDB & { expert: ExpertDB })[]
  statusHistory: StatusChangeDB[]
}) | null> => {
  return await prisma.project.findUnique({
    where: { id },
    include: {
      creator: { select: { name: true, email: true } },
      variables: { orderBy: { order: 'asc' } },
      projectExperts: {
        include: { expert: true },
        orderBy: { invitedAt: 'desc' }
      },
      statusHistory: { orderBy: { changedAt: 'desc' } }
    }
  })
}

export const updateProject = async (
  id: string, 
  data: Partial<{
    name: string
    description: string
    type: ProjectType
    expectedExperts: number
    tags: string[]
    isPublic: boolean
  }>
): Promise<ProjectDB | null> => {
  try {
    return await prisma.project.update({
      where: { id },
      data
    })
  } catch (error) {
    console.error('Error updating project:', error)
    return null
  }
}

export const deleteProject = async (id: string): Promise<boolean> => {
  try {
    await prisma.project.delete({ where: { id } })
    return true
  } catch (error) {
    console.error('Error deleting project:', error)
    return false
  }
}

// ✨ TRANSICIONES DE ESTADO

export const transitionProjectStatus = async (
  projectId: string,
  newStatus: ProjectStatus,
  changedBy: string,
  reason?: string,
  notes?: string
): Promise<ProjectDB | null> => {
  try {
    return await prisma.$transaction(async (tx) => {
      // Obtener proyecto actual
      const currentProject = await tx.project.findUnique({
        where: { id: projectId }
      })

      if (!currentProject) {
        throw new Error('Proyecto no encontrado')
      }

      // Crear registro de cambio de estado
      await tx.statusChange.create({
        data: {
          projectId,
          from: currentProject.status,
          to: newStatus,
          changedBy,
          reason: reason || `Cambio de estado: ${currentProject.status} → ${newStatus}`,
          notes
        }
      })

      // Actualizar proyecto
      return await tx.project.update({
        where: { id: projectId },
        data: { status: newStatus }
      })
    })
  } catch (error) {
    console.error('Error transitioning project status:', error)
    return null
  }
}

// ✨ VARIABLES

export const createVariable = async (data: {
  projectId: string
  name: string
  description?: string
  order: number
  category?: string
  color?: string
}): Promise<VariableDB> => {
  return await prisma.variable.create({ data })
}

export const updateVariable = async (
  id: string,
  data: Partial<{
    name: string
    description: string
    order: number
    category: string
    color: string
  }>
): Promise<VariableDB | null> => {
  try {
    return await prisma.variable.update({
      where: { id },
      data
    })
  } catch (error) {
    console.error('Error updating variable:', error)
    return null
  }
}

export const deleteVariable = async (id: string): Promise<boolean> => {
  try {
    await prisma.variable.delete({ where: { id } })
    return true
  } catch (error) {
    console.error('Error deleting variable:', error)
    return false
  }
}

export const reorderVariables = async (
  projectId: string,
  variableOrders: { id: string; order: number }[]
): Promise<boolean> => {
  try {
    await prisma.$transaction(async (tx) => {
      for (const variable of variableOrders) {
        await tx.variable.update({
          where: { id: variable.id },
          data: { order: variable.order }
        })
      }
    })
    return true
  } catch (error) {
    console.error('Error reordering variables:', error)
    return false
  }
}

// ✨ EXPERTOS

export const getExperts = async (filter?: {
  search?: string
  expertiseAreas?: string[]
}): Promise<ExpertDB[]> => {
  const where: any = {}

  if (filter?.search) {
    where.OR = [
      { name: { contains: filter.search, mode: 'insensitive' } },
      { email: { contains: filter.search, mode: 'insensitive' } },
      { organization: { contains: filter.search, mode: 'insensitive' } }
    ]
  }

  if (filter?.expertiseAreas && filter.expertiseAreas.length > 0) {
    where.expertiseAreas = { hasEvery: filter.expertiseAreas }
  }

  return await prisma.expert.findMany({
    where,
    orderBy: { name: 'asc' }
  })
}

export const createExpert = async (data: {
  name: string
  email: string
  organization?: string
  expertiseAreas: string[]
  avatar?: string
  yearsExperience?: number
  notes?: string
}): Promise<ExpertDB> => {
  // @ts-ignore - Temporal para migración
  return await prisma.expert.create({ data })
}

export const updateExpert = async (
  id: string,
  data: Partial<{
    name: string
    email: string
    organization: string
    expertiseAreas: string[]
    avatar: string
    yearsExperience: number
    notes: string
  }>
): Promise<ExpertDB | null> => {
  try {
    // @ts-ignore - Temporal para migración
    return await prisma.expert.update({
      where: { id },
      data
    })
  } catch (error) {
    console.error('Error updating expert:', error)
    return null
  }
}

// ✨ RELACIÓN PROYECTO-EXPERTO

export const inviteExpertToProject = async (data: {
  projectId: string
  expertId: string
  invitedBy: string
  notes?: string
}): Promise<ProjectExpertDB> => {
  return await prisma.projectExpert.create({
    data: {
      projectId: data.projectId,
      expertId: data.expertId,
      invitedBy: data.invitedBy,
      status: 'INVITED',
      notes: data.notes,
      votingProgress: 0,
      emailNotifications: true,
      inAppNotifications: true,
      reminderNotifications: true
    }
  })
}

export const updateProjectExpertStatus = async (
  projectId: string,
  expertId: string,
  status: ProjectExpertStatus,
  notes?: string
): Promise<ProjectExpertDB | null> => {
  try {
    const updateData: any = {
      status,
      lastActivity: new Date(),
      notes
    }

    if (['ACTIVE', 'DECLINED'].includes(status)) {
      updateData.respondedAt = new Date()
    }

    return await prisma.projectExpert.update({
      where: {
        projectId_expertId: {
          projectId,
          expertId
        }
      },
      data: updateData
    })
  } catch (error) {
    console.error('Error updating project expert status:', error)
    return null
  }
}

export const updateVotingProgress = async (
  projectId: string,
  expertId: string,
  progress: number
): Promise<ProjectExpertDB | null> => {
  try {
    return await prisma.projectExpert.update({
      where: {
        projectId_expertId: {
          projectId,
          expertId
        }
      },
      data: {
        votingProgress: Math.max(0, Math.min(100, progress)),
        lastActivity: new Date()
      }
    })
  } catch (error) {
    console.error('Error updating voting progress:', error)
    return null
  }
}

export const removeExpertFromProject = async (
  projectId: string,
  expertId: string
): Promise<boolean> => {
  try {
    await prisma.projectExpert.delete({
      where: {
        projectId_expertId: {
          projectId,
          expertId
        }
      }
    })
    return true
  } catch (error) {
    console.error('Error removing expert from project:', error)
    return false
  }
}

// ✨ VALIDACIONES

export const validateProjectForTransition = async (
  projectId: string,
  targetStatus: ProjectStatus
): Promise<{ isValid: boolean; errors: string[] }> => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      variables: true,
      projectExperts: true
    }
  })

  if (!project) {
    return { isValid: false, errors: ['Proyecto no encontrado'] }
  }

  const errors: string[] = []

  // Reglas de validación según el estado objetivo
  const validationRules = {
    DRAFT: { minVariables: 0, minExperts: 0, requiresMatrix: false },
    SETUP: { minVariables: 3, minExperts: 3, requiresMatrix: false },
    ACTIVE: { minVariables: 3, minExperts: 3, requiresMatrix: true },
    IN_REVIEW: { minVariables: 3, minExperts: 3, requiresMatrix: true },
    COMPLETED: { minVariables: 3, minExperts: 3, requiresMatrix: true },
    ARCHIVED: { minVariables: 0, minExperts: 0, requiresMatrix: false }
  }

  const rules = validationRules[targetStatus]

  if (project.variables.length < rules.minVariables) {
    errors.push(`Mínimo ${rules.minVariables} variables requeridas (tiene ${project.variables.length})`)
  }

  if (project.projectExperts.length < rules.minExperts) {
    errors.push(`Mínimo ${rules.minExperts} expertos requeridos (tiene ${project.projectExperts.length})`)
  }

  // TODO: Validar matriz de votación cuando esté implementada
  if (rules.requiresMatrix) {
    // await validateVotingMatrix(projectId)
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// ✨ UTILIDADES

export const getProjectStats = async (userId?: string) => {
  const where = userId ? { creatorId: userId } : {}

  const [
    totalProjects,
    activeProjects,
    completedProjects,
    totalExperts,
    totalVariables
  ] = await Promise.all([
    prisma.project.count({ where }),
    prisma.project.count({ where: { ...where, status: 'ACTIVE' } }),
    prisma.project.count({ where: { ...where, status: 'COMPLETED' } }),
    prisma.expert.count(),
    prisma.variable.count({ where: { project: where } })
  ])

  return {
    totalProjects,
    activeProjects,
    completedProjects,
    totalExperts,
    totalVariables
  }
}

export const getExpertStats = async (projectId: string) => {
  const experts = await prisma.projectExpert.findMany({
    where: { projectId },
    include: { expert: true }
  })

  const stats = {
    total: experts.length,
    invited: experts.filter(e => e.status === 'INVITED').length,
    active: experts.filter(e => e.status === 'ACTIVE').length,
    voting: experts.filter(e => e.status === 'VOTING').length,
    completed: experts.filter(e => e.status === 'COMPLETED').length,
    declined: experts.filter(e => e.status === 'DECLINED').length,
    avgProgress: experts.length > 0 ? 
      Math.round(experts.reduce((sum, e) => sum + e.votingProgress, 0) / experts.length) : 0,
    expertiseAreas: Array.from(new Set(experts.flatMap(e => e.expert.expertiseAreas))).length
  }

  return stats
}

// ✨ SEED FUNCTIONS (para desarrollo)

export const seedExperts = async (): Promise<ExpertDB[]> => {
  const expertsData = [
    {
      name: 'Dr. María González',
      email: 'maria.gonzalez@universidad.edu',
      organization: 'Universidad Central',
      expertiseAreas: ['Tecnología', 'Innovación', 'Prospectiva'],
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
      yearsExperience: 15,
      notes: 'Experta senior con 15 años de experiencia en prospectiva tecnológica'
    },
    {
      name: 'Ing. Carlos Ruiz',
      email: 'carlos.ruiz@consultora.com',
      organization: 'Consultora Estratégica',
      expertiseAreas: ['Políticas Públicas', 'Regulación'],
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      yearsExperience: 12,
      notes: 'Especialista en marco regulatorio y políticas públicas'
    },
    {
      name: 'Dra. Ana Martín',
      email: 'ana.martin@empresa.com',
      organization: 'Instituto de Marketing',
      expertiseAreas: ['Marketing', 'Comportamiento del Consumidor'],
      yearsExperience: 8,
      notes: 'Especialista en análisis de mercado y comportamiento del consumidor'
    },
    {
      name: 'Prof. Ricardo Vega',
      email: 'ricardo.vega@instituto.org',
      organization: 'Instituto Económico',
      expertiseAreas: ['Economía', 'Finanzas', 'Análisis Estratégico'],
      yearsExperience: 20,
      notes: 'Economista con expertise en análisis macroeconómico'
    },
    {
      name: 'Dra. Sofía Herrera',
      email: 'sofia.herrera@centro.edu',
      organization: 'Centro de Sostenibilidad',
      expertiseAreas: ['Sostenibilidad', 'Medio Ambiente', 'Política Ambiental'],
      yearsExperience: 10,
      notes: 'Especialista en sostenibilidad y políticas ambientales'
    },
    {
      name: 'Ing. David López',
      email: 'david.lopez@tech.com',
      organization: 'TechCorp',
      expertiseAreas: ['IA', 'Machine Learning', 'Transformación Digital'],
      yearsExperience: 7,
      notes: 'Ingeniero especializado en IA y transformación digital'
    },
    {
      name: 'Dr. Patricia Silva',
      email: 'patricia.silva@social.org',
      organization: 'Centro de Estudios Sociales',
      expertiseAreas: ['Sociología', 'Comportamiento Social', 'Tendencias'],
      yearsExperience: 14,
      notes: 'Socióloga especialista en tendencias sociales y comportamiento'
    },
    {
      name: 'Ing. Miguel Torres',
      email: 'miguel.torres@energia.com',
      organization: 'EnergyTech',
      expertiseAreas: ['Energía', 'Renovables', 'Infraestructura'],
      yearsExperience: 11,
      notes: 'Ingeniero especializado en energías renovables e infraestructura'
    }
  ]

  const createdExperts = []
  
  for (const expertData of expertsData) {
    try {
      // @ts-ignore - Temporal para migración
      const expert = await prisma.expert.upsert({
        where: { email: expertData.email },
        update: expertData,
        create: expertData
      })
      createdExperts.push(expert)
    } catch (error) {
      console.error(`Error creating expert ${expertData.email}:`, error)
    }
  }

  return createdExperts
}

// Helper para limpiar base de datos en desarrollo
export const resetDatabase = async (): Promise<void> => {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('Reset only allowed in development')
  }

  await prisma.$transaction([
    prisma.evaluation.deleteMany(),
    prisma.projectExpert.deleteMany(),
    prisma.statusChange.deleteMany(),
    prisma.variable.deleteMany(),
    prisma.project.deleteMany(),
    prisma.expert.deleteMany()
  ])
}
