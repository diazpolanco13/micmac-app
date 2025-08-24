/**
 * 🗄️ Prisma Client Configuration
 * Cliente de base de datos para MIC MAC Pro
 */

import { PrismaClient } from '@prisma/client'

// Singleton pattern para evitar múltiples conexiones en desarrollo
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query', 'error', 'warn'],
    errorFormat: 'pretty'
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Helper para verificar conexión
export const isConnected = async (): Promise<boolean> => {
  try {
    await prisma.$connect()
    return true
  } catch (error) {
    console.error('Prisma connection error:', error)
    return false
  }
}

// Helper para cerrar conexión
export const disconnect = async (): Promise<void> => {
  await prisma.$disconnect()
}

export default prisma
