/**
 * 🎯 DATOS DE PRUEBA PARA EXPERTISE
 * Información realista para probar el sistema
 */

import { ExpertiseCalculator } from './expertiseCalculator'
import type { ExpertiseArea } from '@/types/project'

export function createMockExpertiseAreas(): ExpertiseArea[] {
  const areas = [
    // 1. Estrategia Militar - 27 años como General
    ExpertiseCalculator.createExpertiseArea('Estrategia Militar', {
      yearsExperience: 27,
      proficiencyLevel: 5, // Maestro
      experienceType: 'PROFESSIONAL',
      educationLevel: 'UNIVERSITARIO'
    }),

    // 2. Contraterrorismo - 16 años de experiencia
    ExpertiseCalculator.createExpertiseArea('Contraterrorismo', {
      yearsExperience: 16,
      proficiencyLevel: 5, // Maestro
      experienceType: 'PROFESSIONAL',
      educationLevel: 'POSTGRADO'
    }),

    // 3. Antisecuestro - 16 años de operaciones
    ExpertiseCalculator.createExpertiseArea('Antisecuestro', {
      yearsExperience: 16,
      proficiencyLevel: 5, // Maestro
      experienceType: 'PROFESSIONAL',
      educationLevel: 'POSTGRADO'
    }),

    // 4. Protección Ambiental - 8 años en guardia ambiental
    ExpertiseCalculator.createExpertiseArea('Protección Ambiental', {
      yearsExperience: 8,
      proficiencyLevel: 4, // Experto
      experienceType: 'PROFESSIONAL',
      educationLevel: 'TECNICO'
    }),

    // 5. Derecho Penal - Abogado pero no ha ejercido mucho
    ExpertiseCalculator.createExpertiseArea('Derecho Penal', {
      yearsExperience: 2,
      proficiencyLevel: 2, // Competente
      experienceType: 'ACADEMIC',
      educationLevel: 'UNIVERSITARIO'
    })
  ]

  return areas
}

export function createMockUserProfile() {
  return {
    name: 'General Javier Benchimol',
    organization: 'Fuerzas Armada Nacional Bolivariana',
    phone: '+57 1 234 5678',
    linkedinUrl: 'https://linkedin.com/in/benchimol',
    profession: 'Oficial Militar del Ejercito Bolivariano',
    currentPosition: 'General Retirado - Asesor Estrategico',
    yearsExperience: 33,
    isActive: true,
    lastLoginAt: new Date().toISOString(),
    totalProjectsParticipated: 15,
    averageResponseTime: 4.2,
    createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(), // hace 1 año
    updatedAt: new Date().toISOString(),
    bio: 'General retirado de las FANB con más de 33 años de experiencia en estrategia militar, contraterrorismo y antisecuestro. Especialista en protección ambiental y formación jurídica. Ha liderado operaciones críticas en la lucha contra el terrorismo y el secuestro en Venezuela.',
    expertiseAreas: createMockExpertiseAreas()
  }
}
