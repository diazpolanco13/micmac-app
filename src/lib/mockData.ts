/**
 * 🎭 Mock Data para Desarrollo
 * Datos de prueba para proyectos MIC MAC
 */

import { Project, Variable, Expert, ProjectType, ProjectStatus, Organization, ORGANIZATION_PLAN_LIMITS } from '@/types/project'

// 🏢 ORGANIZACIONES MOCK PARA MULTI-TENANCY
export const mockOrganizations: Organization[] = [
  {
    id: 'org-techcorp',
    name: 'TechCorp Solutions',
    slug: 'techcorp-solutions',
    domain: 'techcorp.com',
    plan: 'ENTERPRISE',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-31T15:30:00Z',
    limits: ORGANIZATION_PLAN_LIMITS.ENTERPRISE,
    settings: {
      allowExternalExperts: true,
      requireEmailDomain: false,
      autoApproveUsers: true,
      logoUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200',
      brandColors: {
        primary: '#3B82F6',
        secondary: '#1E40AF'
      }
    },
    stats: {
      totalUsers: 23,
      totalProjects: 12,
      totalExperts: 18,
      activeProjects: 4,
      completedProjects: 8
    }
  },
  {
    id: 'org-healthplus',
    name: 'HealthPlus Innovations',
    slug: 'healthplus-innovations',
    domain: 'healthplus.org',
    plan: 'PRO',
    isActive: true,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-31T12:45:00Z',
    limits: ORGANIZATION_PLAN_LIMITS.PRO,
    settings: {
      allowExternalExperts: false,
      requireEmailDomain: true,
      autoApproveUsers: false,
      logoUrl: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=200',
      brandColors: {
        primary: '#10B981',
        secondary: '#059669'
      }
    },
    stats: {
      totalUsers: 12,
      totalProjects: 6,
      totalExperts: 8,
      activeProjects: 2,
      completedProjects: 4
    }
  },
  {
    id: 'org-startup',
    name: 'Startup Accelerator Hub',
    slug: 'startup-accelerator',
    plan: 'FREE',
    isActive: true,
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-31T09:20:00Z',
    limits: ORGANIZATION_PLAN_LIMITS.FREE,
    settings: {
      allowExternalExperts: true,
      requireEmailDomain: false,
      autoApproveUsers: true,
      logoUrl: 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=200',
      brandColors: {
        primary: '#8B5CF6',
        secondary: '#7C3AED'
      }
    },
    stats: {
      totalUsers: 5,
      totalProjects: 2,
      totalExperts: 3,
      activeProjects: 1,
      completedProjects: 1
    }
  }
]

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

// Función para generar métricas simuladas realistas
const generateExpertMetrics = (
  expertId: string, 
  totalProjects: number, 
  avgResponseTime: number
): Expert['performanceMetrics'] => {
  // Generar métricas basadas en el perfil del experto
  const baseReliability = Math.max(60, Math.min(98, 85 + Math.random() * 20 - 10))
  const consistency = Math.max(70, Math.min(99, baseReliability + Math.random() * 10 - 5))
  const participation = Math.max(65, Math.min(95, 80 + Math.random() * 15))
  const timeManagement = Math.max(50, Math.min(95, 100 - (avgResponseTime * 10)))
  const communication = Math.max(60, Math.min(90, 75 + Math.random() * 15))

  // Generar badges basados en métricas
  const badges = []
  if (consistency >= 95) {
    badges.push({
      type: 'CONSISTENCY',
      name: 'Experto Consistente',
      level: 'GOLD',
      icon: '🥇',
      earnedAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString()
    })
  }
  if (avgResponseTime < 3) {
    badges.push({
      type: 'SPEED',
      name: 'Respuesta Rápida',
      level: 'SILVER',
      icon: '⚡',
      earnedAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString()
    })
  }
  if (totalProjects >= 25) {
    badges.push({
      type: 'PARTICIPATION',
      name: 'Veterano MIC MAC',
      level: 'GOLD',
      icon: '🎖️',
      earnedAt: new Date(Date.now() - Math.random() * 120 * 24 * 60 * 60 * 1000).toISOString()
    })
  }

  return {
    overallReliability: Math.round(baseReliability),
    consistencyScore: Math.round(consistency),
    participationQuality: Math.round(participation),
    timeManagement: Math.round(timeManagement),
    communicationEffectiveness: Math.round(communication),
    invitationPriority: baseReliability >= 85 ? 'HIGH' : baseReliability >= 70 ? 'MEDIUM' : 'LOW',
    badges,
    trends: {
      last30Days: Math.round(Math.random() * 20 - 10), // -10 a +10
      improving: Math.random() > 0.3 // 70% probabilidad de estar mejorando
    },
    lastCalculated: new Date().toISOString()
  }
}

const generateExpertQuickStats = (
  totalProjects: number,
  avgResponseTime: number
): Expert['quickStats'] => {
  const acceptanceRate = Math.max(70, Math.min(100, 85 + Math.random() * 15))
  const completionRate = Math.max(75, Math.min(100, 90 + Math.random() * 10))
  const inconsistencies = Math.floor(Math.random() * Math.max(1, totalProjects * 0.1))
  
  return {
    totalInvitations: totalProjects + Math.floor(Math.random() * 5),
    acceptanceRate: Math.round(acceptanceRate),
    completionRate: Math.round(completionRate),
    averageResponseTimeHours: avgResponseTime,
    totalInconsistencies: inconsistencies,
    preferredProjectTypes: ['STRATEGIC', 'TECHNOLOGICAL'].slice(0, Math.floor(Math.random() * 2) + 1)
  }
}

// 🏢 EXPERTOS DISTRIBUIDOS POR ORGANIZACIONES
export const sampleExperts: Expert[] = [
  // 👥 TECHCORP SOLUTIONS (ENTERPRISE) - Expertos de tecnología
  {
    id: 'expert-1',
    name: 'Dr. María González Hernández',
    email: 'maria.gonzalez@techcorp.com',
    organization: 'TechCorp Solutions', // 🔄 Actualizado
    organizationId: 'org-techcorp', // 🆕 MULTI-TENANT
    expertiseAreas: ['Inteligencia Artificial', 'Diagnóstico Médico', 'Machine Learning'],
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150',
    yearsExperience: 18,
    notes: 'Pionera en IA médica con 50+ publicaciones internacionales',
    role: 'EXPERT',
    biography: 'Doctora en Ingeniería Biomédica con especialización en sistemas de IA para diagnóstico médico. Lidera el laboratorio de Machine Learning Médico y ha desarrollado algoritmos implementados en 15 hospitales.',
    linkedinUrl: 'https://linkedin.com/in/maria-gonzalez-medtech',
    phone: '+34 666 111 222',
    isActive: true,
    lastLoginAt: '2024-01-22T09:15:00Z',
    totalProjectsParticipated: 23,
    averageResponseTime: 2.1,
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-22T09:15:00Z',
    performanceMetrics: generateExpertMetrics('expert-1', 23, 2.1),
    quickStats: generateExpertQuickStats(23, 2.1)
  },
  {
    id: 'expert-2',
    name: 'Dr. Carlos Mendoza Rivera',
    email: 'carlos.mendoza@telemedicina.org',
    organization: 'Fundación Europea de Telemedicina',
    expertiseAreas: ['Telemedicina', 'Salud Digital', 'Teleconsulta'],
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150',
    yearsExperience: 22,
    notes: 'Experto internacional en implementación de telemedicina',
    role: 'EXPERT',
    biography: 'Médico especialista en Medicina Interna con postgrado en Informática Médica. Ha liderado proyectos de telemedicina en 12 países y es consultor de la OMS.',
    linkedinUrl: 'https://linkedin.com/in/carlos-mendoza-telemedicina',
    phone: '+34 777 222 333',
    isActive: true,
    lastLoginAt: '2024-01-21T16:30:00Z',
    totalProjectsParticipated: 31,
    averageResponseTime: 1.8,
    createdAt: '2024-01-08T10:30:00Z',
    updatedAt: '2024-01-21T16:30:00Z',
    performanceMetrics: generateExpertMetrics('expert-2', 31, 1.8),
    quickStats: generateExpertQuickStats(31, 1.8)
  },
  {
    id: 'expert-3',
    name: 'Dra. Ana Patricia Ruiz',
    email: 'ana.ruiz@digitalsalud.gov',
    organization: 'Ministerio de Sanidad - Dirección de Digitalización',
    expertiseAreas: ['Expedientes Electrónicos', 'Interoperabilidad', 'Políticas Sanitarias'],
    avatar: 'https://images.unsplash.com/photo-1594824942073-2cd0f6d2b87d?w=150',
    yearsExperience: 16,
    notes: 'Arquitecta de la estrategia nacional de digitalización sanitaria',
    role: 'EXPERT',
    biography: 'Ingeniera en Sistemas con MBA en Administración Sanitaria. Responsable de la implementación del expediente electrónico nacional y sistemas de interoperabilidad.',
    linkedinUrl: 'https://linkedin.com/in/ana-ruiz-digitalsalud',
    phone: '+34 888 444 555',
    isActive: true,
    lastLoginAt: '2024-01-22T11:45:00Z',
    totalProjectsParticipated: 19,
    averageResponseTime: 3.2,
    createdAt: '2024-01-12T14:00:00Z',
    updatedAt: '2024-01-22T11:45:00Z',
    performanceMetrics: generateExpertMetrics('expert-3', 19, 3.2),
    quickStats: generateExpertQuickStats(19, 3.2)
  },
  {
    id: 'expert-4',
    name: 'Prof. Roberto Silva Fernández',
    email: 'roberto.silva@hospitalsanjuan.es',
    organization: 'Hospital San Juan - Jefe de Sistemas de Información',
    expertiseAreas: ['Sistemas Hospitalarios', 'Gestión Tecnológica', 'Implementación HIS'],
    avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150',
    yearsExperience: 25,
    notes: 'Veterano en implementación de sistemas hospitalarios',
    role: 'EXPERT',
    biography: 'Ingeniero Industrial con especialización en Gestión de Sistemas de Salud. Ha dirigido la digitalización completa de 8 hospitales y es referente en implementación de HIS.',
    linkedinUrl: 'https://linkedin.com/in/roberto-silva-his',
    phone: '+34 999 666 777',
    isActive: true,
    lastLoginAt: '2024-01-20T08:20:00Z',
    totalProjectsParticipated: 28,
    averageResponseTime: 2.9,
    createdAt: '2024-01-05T08:00:00Z',
    updatedAt: '2024-01-20T08:20:00Z',
    performanceMetrics: generateExpertMetrics('expert-4', 28, 2.9),
    quickStats: generateExpertQuickStats(28, 2.9)
  },
  {
    id: 'expert-5',
    name: 'Dra. Laura Vega Martínez',
    email: 'laura.vega@ciberseguridad-med.com',
    organization: 'CyberMed Security Solutions',
    expertiseAreas: ['Ciberseguridad Médica', 'Privacidad de Datos', 'RGPD Sanitario'],
    avatar: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=150',
    yearsExperience: 14,
    notes: 'Especialista en protección de datos médicos y ciberseguridad',
    role: 'EXPERT',
    biography: 'Doctora en Ciberseguridad con especialización en protección de datos sanitarios. Consultora certificada en RGPD y auditora de seguridad en sistemas médicos.',
    linkedinUrl: 'https://linkedin.com/in/laura-vega-cybermed',
    phone: '+34 555 777 888',
    isActive: true,
    lastLoginAt: '2024-01-21T15:10:00Z',
    totalProjectsParticipated: 17,
    averageResponseTime: 2.4,
    createdAt: '2024-01-08T10:00:00Z',
    updatedAt: '2024-01-21T15:10:00Z',
    performanceMetrics: generateExpertMetrics('expert-5', 17, 2.4),
    quickStats: generateExpertQuickStats(17, 2.4)
  },
  {
    id: 'expert-6',
    name: 'Dr. Miguel Ángel Torres',
    email: 'miguel.torres@startuphealth.io',
    organization: 'HealthTech Innovations - CEO',
    expertiseAreas: ['HealthTech', 'Startups Médicas', 'Innovación Digital'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    yearsExperience: 12,
    notes: 'Emprendedor serial en tecnologías de salud',
    role: 'EXPERT',
    biography: 'Médico-emprendedor con 4 startups exitosas en HealthTech. Especialista en adopción de tecnologías disruptivas en salud y transformación digital hospitalaria.',
    linkedinUrl: 'https://linkedin.com/in/miguel-torres-healthtech',
    phone: '+34 666 888 999',
    isActive: true,
    lastLoginAt: '2024-01-22T13:25:00Z',
    totalProjectsParticipated: 14,
    averageResponseTime: 1.6,
    createdAt: '2024-01-15T16:30:00Z',
    updatedAt: '2024-01-22T13:25:00Z',
    performanceMetrics: generateExpertMetrics('expert-6', 14, 1.6),
    quickStats: generateExpertQuickStats(14, 1.6)
  },
  {
    id: 'expert-7',
    name: 'Dra. Carmen López Jiménez',
    email: 'carmen.lopez@colegiomedicos.org',
    organization: 'Colegio de Médicos - Comisión de Tecnología',
    expertiseAreas: ['Ética Médica', 'Regulación Sanitaria', 'Adopción Tecnológica'],
    avatar: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=150',
    yearsExperience: 28,
    notes: 'Referente en ética médica y regulación de nuevas tecnologías',
    role: 'EXPERT',
    biography: 'Doctora en Medicina con especialización en Bioética. Presidenta de la Comisión de Tecnología del Colegio de Médicos y consultora en regulación de IA médica.',
    linkedinUrl: 'https://linkedin.com/in/carmen-lopez-etica',
    phone: '+34 777 999 111',
    isActive: true,
    lastLoginAt: '2024-01-21T10:50:00Z',
    totalProjectsParticipated: 22,
    averageResponseTime: 4.1,
    createdAt: '2024-01-03T12:15:00Z',
    updatedAt: '2024-01-21T10:50:00Z',
    performanceMetrics: generateExpertMetrics('expert-7', 22, 4.1),
    quickStats: generateExpertQuickStats(22, 4.1)
  },
  {
    id: 'expert-8',
    name: 'Ing. Patricia Morales Sánchez',
    email: 'patricia.morales@ibm-health.com',
    organization: 'IBM Health Solutions - Arquitecta de Soluciones',
    expertiseAreas: ['Arquitectura de Sistemas', 'Cloud Computing', 'Big Data Médico'],
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    yearsExperience: 15,
    notes: 'Experta en arquitecturas cloud para sistemas de salud masivos',
    role: 'EXPERT',
    biography: 'Ingeniera en Sistemas con especialización en arquitecturas distribuidas para salud. Ha diseñado infraestructuras para sistemas nacionales de salud y plataformas de Big Data médico.',
    linkedinUrl: 'https://linkedin.com/in/patricia-morales-ibm',
    phone: '+34 888 111 444',
    isActive: true,
    lastLoginAt: '2024-01-22T14:40:00Z',
    totalProjectsParticipated: 26,
    averageResponseTime: 2.7,
    createdAt: '2024-01-09T09:45:00Z',
    updatedAt: '2024-01-22T14:40:00Z',
    performanceMetrics: generateExpertMetrics('expert-8', 26, 2.7),
    quickStats: generateExpertQuickStats(26, 2.7)
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
    status: 'ACTIVE',
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
        name: 'Implementación de Inteligencia Artificial en Diagnósticos Médicos y Sistemas de Apoyo a la Decisión Clínica',
        description: 'Desarrollo e integración de algoritmos de machine learning y deep learning para el análisis automatizado de imágenes médicas, interpretación de resultados de laboratorio, y sistemas de apoyo a la decisión clínica que asistan a los profesionales de la salud en el diagnóstico temprano y preciso de enfermedades complejas.',
        order: 0,
        category: 'motriz',
        color: '#8B5CF6',
        createdAt: '2024-01-10T09:00:00Z',
        updatedAt: '2024-01-10T09:00:00Z'
      },
      {
        id: 'var-health-2',
        projectId: 'proj-2',
        name: 'Plataformas de Telemedicina y Consulta Médica Remota con Seguimiento Continuo del Paciente',
        description: 'Sistemas integrados de teleconsulta que permiten la atención médica a distancia, incluyendo videoconferencias médico-paciente, monitoreo remoto de signos vitales, prescripción electrónica, y seguimiento continuo de tratamientos crónicos a través de dispositivos wearables y aplicaciones móviles especializadas.',
        order: 1,
        category: 'dependiente',
        color: '#10B981',
        createdAt: '2024-01-10T09:00:00Z',
        updatedAt: '2024-01-10T09:00:00Z'
      },
      {
        id: 'var-health-3',
        projectId: 'proj-2',
        name: 'Digitalización Completa de Expedientes Clínicos y Sistemas de Información Hospitalaria Integrados',
        description: 'Transformación digital completa de los registros médicos tradicionales hacia sistemas electrónicos interoperables que permitan el acceso seguro, compartido y en tiempo real a la información clínica del paciente entre diferentes instituciones de salud, incluyendo historiales médicos, resultados de estudios, imágenes diagnósticas y planes de tratamiento.',
        order: 2,
        category: 'neutro',
        color: '#F59E0B',
        createdAt: '2024-01-10T09:00:00Z',
        updatedAt: '2024-01-10T09:00:00Z'
      }
    ],
    projectExperts: sampleExperts.map(expert => ({
      id: `pe-${expert.id}`,
      projectId: 'proj-2',
      expertId: expert.id,
      userId: null,
      status: 'ACTIVE',
      invitedAt: '2024-01-10T09:00:00Z',
      invitedBy: 'user-1',
      respondedAt: '2024-01-10T10:30:00Z',
      lastActivity: '2024-01-20T14:30:00Z',
      votingProgress: 0,
      notes: null,
      emailNotifications: true,
      inAppNotifications: true,
      reminderNotifications: true,
      updatedAt: '2024-01-20T14:30:00Z',
      expert
    })),
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
  },
  {
    id: 'proj-geopolitico',
    name: 'Análisis de Escenarios Geopolíticos',
    description: 'Posibles escenarios de intervención militar de EE.UU. en Venezuela - Ejercicio modelo para validación del sistema MIC MAC.',
    type: 'STRATEGIC',
    status: 'ACTIVE',
    expectedExperts: 8,
    tags: ['geopolitica', 'venezuela', 'eeuu', 'militar'],
    isPublic: false,
    creatorId: 'user-1',
    createdAt: '2024-01-25T10:00:00Z',
    updatedAt: '2024-01-25T14:30:00Z',
    creator: { name: 'Usuario Demo', email: 'demo@micmac.com' },
    variables: [
      {
        id: 'esc-1',
        name: 'ESC1 - INVASIÓN MILITAR',
        description: 'Despliegue de una cabeza de playa por parte del cuerpo de infantería de marina de los EEUU en costas venezolanas, para derrocar al GB. "Esquema Panamá".',
        projectId: 'proj-geopolitico',

        category: null,
        color: null,
        createdAt: '2024-01-25T10:00:00Z',
        updatedAt: '2024-01-25T10:00:00Z',
        order: 1
      },
      {
        id: 'esc-2',
        name: 'ESC2 - CUARENTENA NAVAL',
        description: 'Bloqueo naval por parte de la armada de los EE.UU., a las costas venezolanas para generar asfixia económica y controlar el tráfico marítimo hacia Venezuela.',
        projectId: 'proj-geopolitico',

        category: null,
        color: null,
        createdAt: '2024-01-25T10:00:00Z',
        updatedAt: '2024-01-25T10:00:00Z',
        order: 2
      },
      {
        id: 'esc-3',
        name: 'ESC3 - OPERACIÓN QUIRÚRGICA',
        description: 'Acción mercenaria con el empleo de operadores de fuerzas especiales y el apoyo logístico del dispositivo naval desplegado por los EE.UU.',
        projectId: 'proj-geopolitico',

        category: null,
        color: null,
        createdAt: '2024-01-25T10:00:00Z',
        updatedAt: '2024-01-25T10:00:00Z',
        order: 3
      },
      {
        id: 'esc-4',
        name: 'ESC4 - OPERACIÓN PSICOLÓGICA',
        description: 'Uso de fake-news y guerra cognitiva para quebrar la moral de los funcionarios del aparato de seguridad del estado venezolano.',
        projectId: 'proj-geopolitico',

        category: null,
        color: null,
        createdAt: '2024-01-25T10:00:00Z',
        updatedAt: '2024-01-25T10:00:00Z',
        order: 4
      },
      {
        id: 'esc-5',
        name: 'ESC5 - ATAQUE DE FALSA BANDERA',
        description: 'Los buques de la Armada de EE.UU. simularían un ataque de fuerzas navales venezolanas, similar al "Incidente de Tonkín".',
        projectId: 'proj-geopolitico',

        category: null,
        color: null,
        createdAt: '2024-01-25T10:00:00Z',
        updatedAt: '2024-01-25T10:00:00Z',
        order: 5
      }
    ],
    projectExperts: sampleExperts.map(expert => ({
      id: `pe-geo-${expert.id}`,
      projectId: 'proj-geopolitico',
      expertId: expert.id,
      userId: null,
      status: 'ACTIVE',
      invitedAt: '2024-01-25T09:00:00Z',
      invitedBy: 'user-1',
      respondedAt: '2024-01-25T10:30:00Z',
      lastActivity: '2024-01-25T14:30:00Z',
      votingProgress: 0,
      notes: 'Experto asignado para análisis geopolítico Venezuela-EEUU',
      emailNotifications: true,
      inAppNotifications: true,
      reminderNotifications: true,
      updatedAt: '2024-01-25T14:30:00Z',
      expert: expert
    })),
    statusHistory: [
      {
        id: 'status-geo-1',
        projectId: 'proj-geopolitico',
        from: null,
        to: 'DRAFT',
        changedBy: 'user-1',
        reason: 'Proyecto creado',
        notes: 'Estado inicial del proyecto',
        changedAt: '2024-01-25T10:00:00Z'
      },
      {
        id: 'status-geo-2',
        projectId: 'proj-geopolitico',
        from: 'DRAFT',
        to: 'ACTIVE',
        changedBy: 'user-1',
        reason: 'Proyecto activado para votación',
        notes: 'Ejercicio modelo geopolítico listo para simulación',
        changedAt: '2024-01-25T10:30:00Z'
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
