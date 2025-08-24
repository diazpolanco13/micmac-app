#!/usr/bin/env node

/**
 * 🌱 Seed Script para MIC MAC Pro
 * Puebla la base de datos con datos de ejemplo
 */

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de base de datos...\n')

  try {
    // 1. Limpiar datos existentes (solo en desarrollo)
    if (process.env.NODE_ENV === 'development') {
      console.log('🧹 Limpiando datos existentes...')
      await prisma.evaluation.deleteMany()
      await prisma.projectExpert.deleteMany()
      await prisma.statusChange.deleteMany()
      await prisma.variable.deleteMany()
      await prisma.project.deleteMany()
      await prisma.expert.deleteMany()
      console.log('✅ Datos limpiados\n')
    }

    // 2. Crear expertos
    console.log('👥 Creando expertos...')
    const experts = await createExperts()
    console.log(`✅ ${experts.length} expertos creados\n`)

    // 3. Crear usuarios de ejemplo
    console.log('👤 Creando usuarios de ejemplo...')
    const users = await createSampleUsers()
    console.log(`✅ ${users.length} usuarios creados\n`)

    // 4. Crear proyectos de ejemplo
    console.log('📊 Creando proyectos de ejemplo...')
    const projects = await createSampleProjects(users[0].id)
    console.log(`✅ ${projects.length} proyectos creados\n`)

    console.log('🎉 ¡Seed completado exitosamente!')
    console.log('\n📊 Resumen:')
    console.log(`   • ${experts.length} expertos`)
    console.log(`   • ${users.length} usuarios`)
    console.log(`   • ${projects.length} proyectos`)
    console.log('\n🚀 Ya puedes usar la aplicación con datos de ejemplo')

  } catch (error) {
    console.error('❌ Error durante el seed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

async function createExperts() {
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

  const experts = []
  for (const expertData of expertsData) {
    const expert = await prisma.expert.upsert({
      where: { email: expertData.email },
      update: expertData,
      create: expertData
    })
    experts.push(expert)
  }

  return experts
}

async function createSampleUsers() {
  const usersData = [
    {
      id: 'user-moderator-1',
      email: 'mod@micmac.com',
      role: 'MODERATOR',
      name: 'Moderador Demo'
    },
    {
      id: 'user-expert-1', 
      email: 'expert@micmac.com',
      role: 'EXPERT',
      name: 'Experto Demo'
    }
  ]

  const users = []
  for (const userData of usersData) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: userData,
      create: userData
    })
    users.push(user)
  }

  return users
}

async function createSampleProjects(creatorId) {
  // Obtener algunos expertos para asignar
  const availableExperts = await prisma.expert.findMany({ take: 5 })

  const projectsData = [
    {
      name: 'Futuro del Transporte Urbano 2030',
      description: 'Análisis prospectivo sobre la evolución del transporte urbano hacia 2030, considerando vehículos eléctricos, transporte público y movilidad compartida.',
      type: 'STRATEGIC',
      status: 'ACTIVE',
      expectedExperts: 8,
      tags: ['transporte', 'urbano', 'sostenibilidad'],
      isPublic: true,
      variables: [
        {
          name: 'Tecnología Emergente',
          description: 'Adopción de nuevas tecnologías en el sector',
          order: 0,
          category: 'motriz',
          color: '#3B82F6'
        },
        {
          name: 'Regulación Gubernamental',
          description: 'Políticas y regulaciones del gobierno',
          order: 1,
          category: 'motriz',
          color: '#EF4444'
        },
        {
          name: 'Demanda del Mercado',
          description: 'Necesidades y preferencias del consumidor',
          order: 2,
          category: 'dependiente',
          color: '#10B981'
        },
        {
          name: 'Competencia Internacional',
          description: 'Presión competitiva de mercados globales',
          order: 3,
          category: 'enlace',
          color: '#F59E0B'
        }
      ]
    },
    {
      name: 'Digitalización del Sector Salud',
      description: 'Estudio sobre el impacto de la digitalización en el sector salud, incluyendo telemedicina, IA diagnóstica y expedientes electrónicos.',
      type: 'TECHNOLOGICAL',
      status: 'DRAFT',
      expectedExperts: 5,
      tags: ['salud', 'digital', 'IA'],
      isPublic: false,
      variables: [
        {
          name: 'Inteligencia Artificial Médica',
          description: 'Adopción de IA en diagnósticos médicos',
          order: 0,
          category: 'motriz',
          color: '#8B5CF6'
        },
        {
          name: 'Privacidad de Datos',
          description: 'Regulaciones sobre privacidad de datos médicos',
          order: 1,
          category: 'enlace',
          color: '#EC4899'
        },
        {
          name: 'Costo de Implementación',
          description: 'Inversión necesaria para digitalizar el sector',
          order: 2,
          category: 'dependiente',
          color: '#F59E0B'
        }
      ]
    }
  ]

  const projects = []
  
  for (const projectData of projectsData) {
    const { variables, ...projectInfo } = projectData

    // Crear proyecto
    const project = await prisma.project.create({
      data: {
        ...projectInfo,
        creatorId
      }
    })

    // Crear variables del proyecto
    for (const variableData of variables) {
      await prisma.variable.create({
        data: {
          ...variableData,
          projectId: project.id
        }
      })
    }

    // Crear StatusChange inicial
    await prisma.statusChange.create({
      data: {
        projectId: project.id,
        from: null,
        to: project.status,
        changedBy: creatorId,
        reason: 'Proyecto creado',
        notes: 'Estado inicial del proyecto'
      }
    })

    // Asignar algunos expertos al proyecto
    const expertsToAssign = availableExperts.slice(0, 3)
    for (const expert of expertsToAssign) {
      await prisma.projectExpert.create({
        data: {
          projectId: project.id,
          expertId: expert.id,
          invitedBy: creatorId,
          status: 'ACTIVE',
          votingProgress: Math.floor(Math.random() * 100),
          notes: `Experto asignado durante seed`,
          emailNotifications: true,
          inAppNotifications: true,
          reminderNotifications: true
        }
      })
    }

    projects.push(project)
  }

  return projects
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
