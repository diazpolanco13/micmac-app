/**
 * 🧮 CALCULADORA DE EXPERTISE - FASE 1
 * Sistema simple y elegante para calcular scores de expertise
 */

import type { 
  ExpertiseArea, 
  ExpertiseCalculationResult, 
  ExperienceType, 
  EducationLevel,
  ExpertiseLevel,
  ExpertisePriority 
} from '@/types/project'

interface ExpertiseInput {
  yearsExperience: number
  proficiencyLevel: 1 | 2 | 3 | 4 | 5
  experienceType: ExperienceType
  educationLevel?: EducationLevel
}

// 🆕 NUEVA INTERFAZ: Para múltiples contextos
interface MultiContextExpertiseInput {
  yearsExperience: number
  proficiencyLevel: 1 | 2 | 3 | 4 | 5
  experienceTypes: ExperienceType[]
  educationLevel?: EducationLevel
}

export class ExpertiseCalculator {
  
  /**
   * 🆕 Calcula score con múltiples contextos (NUEVO)
   */
  static calculateMultiContextScore(input: MultiContextExpertiseInput): ExpertiseCalculationResult {
    // Base: años de experiencia (máximo 60 puntos)
    const experienceScore = Math.min(60, input.yearsExperience * 3)
    
    // Multiplicador por nivel autopercibido (0.6 a 1.4)
    const levelMultiplier = {
      1: 0.6,  // Principiante
      2: 0.8,  // Competente  
      3: 1.0,  // Experimentado
      4: 1.2,  // Experto
      5: 1.4   // Maestro
    }[input.proficiencyLevel]
    
    // 🔄 NUEVA LÓGICA: Sumar bonus de MÚLTIPLES contextos
    const contextBonuses = {
      'PERSONAL': 5,      // Reducido para múltiples
      'ACADEMIC': 12,     // Académico sigue siendo valioso
      'PROFESSIONAL': 18, // Profesional es el más valioso
      'RESEARCH': 15,     // Investigación muy valiosa
      'CONSULTING': 22    // Consultoría es premium
    }
    
    // Sumar todos los contextos, pero con rendimiento decreciente
    let totalContextBonus = 0
    input.experienceTypes.forEach((type, index) => {
      const baseBonus = contextBonuses[type]
      // Rendimiento decreciente: 100%, 70%, 50%, 30%, 20%
      const multiplier = index === 0 ? 1.0 : 
                        index === 1 ? 0.7 : 
                        index === 2 ? 0.5 : 
                        index === 3 ? 0.3 : 0.2
      totalContextBonus += baseBonus * multiplier
    })
    
    // Bonus por diversidad (tener múltiples contextos)
    const diversityBonus = input.experienceTypes.length > 1 ? 
      Math.min(10, (input.experienceTypes.length - 1) * 3) : 0
    
    // Bonus por educación (0 a 15 puntos)
    const educationBonus = {
      'AUTODIDACTA': 5,
      'TECNICO': 8,
      'UNIVERSITARIO': 12,
      'POSTGRADO': 15,
      'DOCTORADO': 15
    }[input.educationLevel || 'AUTODIDACTA']
    
    // Cálculo final
    const baseScore = experienceScore * levelMultiplier
    const finalScore = baseScore + totalContextBonus + diversityBonus + educationBonus
    const score = Math.min(100, Math.max(10, Math.round(finalScore)))
    
    return {
      score,
      level: this.getLevel(score),
      priority: this.getPriority(score)
    }
  }

  /**
   * 📊 Calcula el score de expertise (Fase 1 - Simple)
   */
  static calculateScore(input: ExpertiseInput): ExpertiseCalculationResult {
    // Base: años de experiencia (máximo 60 puntos)
    const experienceScore = Math.min(60, input.yearsExperience * 3)
    
    // Multiplicador por nivel autopercibido (0.6 a 1.4)
    const levelMultiplier = {
      1: 0.6,  // Principiante
      2: 0.8,  // Competente  
      3: 1.0,  // Experimentado
      4: 1.2,  // Experto
      5: 1.4   // Maestro
    }[input.proficiencyLevel]
    
    // Bonus por contexto (0 a 20 puntos)
    const contextBonus = {
      'PERSONAL': 0,
      'ACADEMIC': 10,
      'PROFESSIONAL': 15,
      'RESEARCH': 12,
      'CONSULTING': 20
    }[input.experienceType]
    
    // Bonus por educación (0 a 15 puntos)
    const educationBonus = {
      'AUTODIDACTA': 5,
      'TECNICO': 8,
      'UNIVERSITARIO': 12,
      'POSTGRADO': 15,
      'DOCTORADO': 15
    }[input.educationLevel || 'AUTODIDACTA']
    
    // Cálculo final
    const baseScore = experienceScore * levelMultiplier
    const finalScore = baseScore + contextBonus + educationBonus
    const score = Math.min(100, Math.max(10, Math.round(finalScore)))
    
    return {
      score,
      level: this.getLevel(score),
      priority: this.getPriority(score)
    }
  }
  
  /**
   * 🏆 Convierte score numérico a nivel descriptivo
   */
  static getLevel(score: number): ExpertiseLevel {
    if (score >= 85) return 'MAESTRO'
    if (score >= 70) return 'EXPERTO'
    if (score >= 55) return 'EXPERIMENTADO'
    if (score >= 35) return 'COMPETENTE'
    return 'NOVATO'
  }
  
  /**
   * 🎯 Convierte score a prioridad de invitación
   */
  static getPriority(score: number): ExpertisePriority {
    if (score >= 75) return 'HIGH'
    if (score >= 50) return 'MEDIUM'
    return 'LOW'
  }
  
  /**
   * 🎨 Obtiene color para el nivel
   */
  static getLevelColor(level: ExpertiseLevel): string {
    const colors = {
      'MAESTRO': 'text-purple-400',
      'EXPERTO': 'text-blue-400', 
      'EXPERIMENTADO': 'text-green-400',
      'COMPETENTE': 'text-yellow-400',
      'NOVATO': 'text-gray-400'
    }
    return colors[level]
  }
  
  /**
   * 🏷️ Obtiene etiqueta legible para contexto
   */
  static getContextLabel(type: ExperienceType): string {
    const labels = {
      'PROFESSIONAL': 'Profesional',
      'ACADEMIC': 'Académico',
      'RESEARCH': 'Investigación',
      'CONSULTING': 'Consultoría',
      'PERSONAL': 'Personal'
    }
    return labels[type]
  }
  
  /**
   * 🎓 Obtiene etiqueta legible para educación
   */
  static getEducationLabel(level?: EducationLevel): string {
    if (!level) return ''
    
    const labels = {
      'AUTODIDACTA': 'Autodidacta',
      'TECNICO': 'Técnico',
      'UNIVERSITARIO': 'Universitario',
      'POSTGRADO': 'Postgrado',
      'DOCTORADO': 'Doctorado'
    }
    return labels[level]
  }
  
  /**
   * 📊 Crea un área de expertise completa
   */
  static createExpertiseArea(
    name: string, 
    input: ExpertiseInput
  ): ExpertiseArea {
    const calculation = this.calculateScore(input)
    const now = new Date().toISOString()
    
    return {
      name,
      yearsExperience: input.yearsExperience,
      proficiencyLevel: input.proficiencyLevel,
      experienceType: input.experienceType,
      educationLevel: input.educationLevel,
      calculatedScore: calculation.score,
      level: calculation.level,
      priority: calculation.priority,
      createdAt: now,
      updatedAt: now
    }
  }
  
  /**
   * 🎯 Obtiene icono para prioridad
   */
  static getPriorityIcon(priority: ExpertisePriority): string {
    switch (priority) {
      case 'HIGH': return '🔥'
      case 'MEDIUM': return '⚡'
      case 'LOW': return '💡'
      default: return '📝'
    }
  }
  
  /**
   * 🎨 Obtiene colores para el score
   */
  static getScoreColors(score: number): { text: string; bg: string; border: string } {
    if (score >= 85) return { 
      text: 'text-purple-400', 
      bg: 'bg-purple-500/20', 
      border: 'border-purple-500/30' 
    }
    if (score >= 70) return { 
      text: 'text-blue-400', 
      bg: 'bg-blue-500/20', 
      border: 'border-blue-500/30' 
    }
    if (score >= 55) return { 
      text: 'text-green-400', 
      bg: 'bg-green-500/20', 
      border: 'border-green-500/30' 
    }
    if (score >= 35) return { 
      text: 'text-yellow-400', 
      bg: 'bg-yellow-500/20', 
      border: 'border-yellow-500/30' 
    }
    return { 
      text: 'text-gray-400', 
      bg: 'bg-gray-500/20', 
      border: 'border-gray-500/30' 
    }
  }
}
