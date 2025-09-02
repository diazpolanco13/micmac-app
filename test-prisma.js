/**
 * 🧪 Test de Prisma
 * Verifica que Prisma esté correctamente configurado
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

console.log('🔗 Probando Prisma...')

async function testPrisma() {
  try {
    // Test de conexión básica
    console.log('📊 Contando registros en todas las tablas...')
    
    const orgCount = await prisma.organization.count()
    console.log('🏢 Organizaciones:', orgCount)
    
    const userCount = await prisma.user.count()
    console.log('👥 Usuarios:', userCount)
    
    const projectCount = await prisma.project.count()
    console.log('📋 Proyectos:', projectCount)
    
    const expertCount = await prisma.expert.count()
    console.log('🎓 Expertos:', expertCount)
    
    const variableCount = await prisma.variable.count()
    console.log('🔢 Variables:', variableCount)
    
    const evaluationCount = await prisma.evaluation.count()
    console.log('📝 Evaluaciones:', evaluationCount)
    
    console.log('\n✅ ¡Prisma funcionando correctamente!')
    
  } catch (error) {
    console.error('❌ Error en Prisma:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

testPrisma()
