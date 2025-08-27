/**
 * 🧮 CALCULADOR DE MÉTRICAS DE EXPERTOS
 * Sistema para calcular y actualizar métricas de desempeño de expertos
 */

import { 
  ExpertParticipationMetrics, 
  ExpertGlobalMetrics, 
  ExpertTrackingEvent,
  ExpertBadge,
  MetricsCalculationConfig,
  DEFAULT_METRICS_CONFIG 
} from '@/types/expertMetrics'
import type { VotingResponse, Expert } from '@/types/project'

export class ExpertMetricsCalculator {
  private config: MetricsCalculationConfig

  constructor(config: MetricsCalculationConfig = DEFAULT_METRICS_CONFIG) {
    this.config = config
  }

  /**
   * 🎯 CÁLCULO DE PUNTUACIÓN GENERAL
   */
  calculateOverallScore(metrics: ExpertParticipationMetrics): number {
    const scores = {
      consistency: metrics.qualityMetrics.consistencyScore,
      timeliness: this.calculateTimelinessScore(metrics.timeMetrics),
      participation: this.calculateParticipationScore(metrics.participationMetrics),
      quality: metrics.qualityMetrics.responseQuality,
      communication: metrics.participationMetrics.communicationResponsiveness
    }

    let weightedScore = 0
    Object.entries(this.config.weights).forEach(([key, weight]) => {
      const score = scores[key as keyof typeof scores] || 0
      weightedScore += (score * weight) / 100
    })

    return Math.round(Math.max(0, Math.min(100, weightedScore)))
  }

  /**
   * ⏱️ CÁLCULO DE PUNTUACIÓN DE PUNTUALIDAD
   */
  private calculateTimelinessScore(timeMetrics: ExpertParticipationMetrics['timeMetrics']): number {
    let score = 100

    // Penalizar demoras en respuesta (más de 24 horas = penalización)
    if (timeMetrics.responseDelay > 24) {
      score -= Math.min(30, (timeMetrics.responseDelay - 24) * 2)
    }

    // Penalizar tiempo excesivo de completación
    if (timeMetrics.completionTime > 72) { // más de 3 días
      score -= Math.min(25, (timeMetrics.completionTime - 72) * 0.5)
    }

    // Bonificar respuestas rápidas
    if (timeMetrics.responseDelay < 2) {
      score += 10
    }

    // Bonificar tiempo promedio por voto eficiente (< 30 segundos)
    if (timeMetrics.averageTimePerVote < 30) {
      score += 5
    }

    return Math.max(0, Math.min(100, score))
  }

  /**
   * 📋 CÁLCULO DE PUNTUACIÓN DE PARTICIPACIÓN
   */
  private calculateParticipationScore(participationMetrics: ExpertParticipationMetrics['participationMetrics']): number {
    const weights = {
      acceptance: 0.3,
      completion: 0.4,
      onTime: 0.2,
      engagement: 0.1
    }

    return Math.round(
      participationMetrics.invitationAcceptanceRate * weights.acceptance +
      participationMetrics.exerciseCompletionRate * weights.completion +
      participationMetrics.onTimeCompletionRate * weights.onTime +
      participationMetrics.followUpEngagement * weights.engagement
    )
  }

  /**
   * 🎯 CÁLCULO DE CONSISTENCIA CON OTROS EXPERTOS
   */
  calculateConsistencyScore(
    expertVotes: VotingResponse[], 
    allVotes: VotingResponse[],
    expertId: string
  ): number {
    if (expertVotes.length === 0 || allVotes.length === 0) return 50

    // Agrupar votos por relación variable
    const votesByRelation = new Map<string, VotingResponse[]>()
    
    allVotes.forEach(vote => {
      const key = `${vote.variableAId}-${vote.variableBId}-${vote.phase}`
      if (!votesByRelation.has(key)) {
        votesByRelation.set(key, [])
      }
      votesByRelation.get(key)!.push(vote)
    })

    let totalDeviations = 0
    let comparisons = 0

    expertVotes.forEach(expertVote => {
      const key = `${expertVote.variableAId}-${expertVote.variableBId}-${expertVote.phase}`
      const relatedVotes = votesByRelation.get(key) || []
      
      if (relatedVotes.length > 1) {
        // Calcular promedio de otros expertos (excluyendo al experto actual)
        const otherVotes = relatedVotes.filter(v => v.expertId !== expertId)
        if (otherVotes.length > 0) {
          const avgOthers = otherVotes.reduce((sum, v) => sum + v.value, 0) / otherVotes.length
          const deviation = Math.abs(expertVote.value - avgOthers)
          totalDeviations += deviation
          comparisons++
        }
      }
    })

    if (comparisons === 0) return 50

    const avgDeviation = totalDeviations / comparisons
    // Convertir desviación a puntuación (0 desviación = 100 puntos)
    const consistencyScore = Math.max(0, 100 - (avgDeviation * 25))
    
    return Math.round(consistencyScore)
  }

  /**
   * 🏆 DETERMINAR NIVEL DE CONFIABILIDAD
   */
  calculateReliability(score: number): ExpertGlobalMetrics['recommendations']['invitationPriority'] {
    if (score >= this.config.thresholds.excellent) return 'HIGH'
    if (score >= this.config.thresholds.good) return 'MEDIUM'
    if (score >= this.config.thresholds.average) return 'MEDIUM'
    if (score >= this.config.thresholds.poor) return 'LOW'
    return 'AVOID'
  }

  /**
   * 📈 CÁLCULO DE TENDENCIAS HISTÓRICAS
   */
  calculateTrends(historicalMetrics: ExpertParticipationMetrics[]): any {
    if (historicalMetrics.length < 2) {
      return {
        improvementTrend: 0,
        consistencyTrend: 0,
        speedTrend: 0
      }
    }

    const sortedMetrics = historicalMetrics.sort((a, b) => 
      new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
    )

    const recent = sortedMetrics.slice(0, Math.min(5, sortedMetrics.length))
    const older = sortedMetrics.slice(5, Math.min(10, sortedMetrics.length))

    if (older.length === 0) {
      return {
        improvementTrend: 0,
        consistencyTrend: 0,
        speedTrend: 0
      }
    }

    const recentAvg = {
      score: recent.reduce((sum, m) => sum + m.overallScore, 0) / recent.length,
      consistency: recent.reduce((sum, m) => sum + m.qualityMetrics.consistencyScore, 0) / recent.length,
      responseTime: recent.reduce((sum, m) => sum + m.timeMetrics.responseDelay, 0) / recent.length
    }

    const olderAvg = {
      score: older.reduce((sum, m) => sum + m.overallScore, 0) / older.length,
      consistency: older.reduce((sum, m) => sum + m.qualityMetrics.consistencyScore, 0) / older.length,
      responseTime: older.reduce((sum, m) => sum + m.timeMetrics.responseDelay, 0) / older.length
    }

    return {
      improvementTrend: Math.round(recentAvg.score - olderAvg.score),
      consistencyTrend: Math.round(recentAvg.consistency - olderAvg.consistency),
      speedTrend: Math.round(olderAvg.responseTime - recentAvg.responseTime) // Invertido: menos tiempo = mejor
    }
  }

  /**
   * 🏅 OTORGAR BADGES SEGÚN DESEMPEÑO
   */
  awardBadges(metrics: ExpertGlobalMetrics): ExpertBadge[] {
    const badges: ExpertBadge[] = []
    const now = new Date().toISOString()

    // Badge de Consistencia
    const consistency = metrics.globalScores.expertiseConsistency
    if (consistency >= this.config.badgeCriteria.consistency.platinum) {
      badges.push({
        id: `consistency-platinum-${Date.now()}`,
        type: 'CONSISTENCY',
        name: 'Maestro de Consistencia',
        description: 'Consistencia excepcional (>98%) en evaluaciones',
        icon: '🏆',
        level: 'PLATINUM',
        earnedAt: now,
        criteria: `Consistencia: ${consistency}%`
      })
    } else if (consistency >= this.config.badgeCriteria.consistency.gold) {
      badges.push({
        id: `consistency-gold-${Date.now()}`,
        type: 'CONSISTENCY',
        name: 'Experto Consistente',
        description: 'Alta consistencia (>95%) en evaluaciones',
        icon: '🥇',
        level: 'GOLD',
        earnedAt: now,
        criteria: `Consistencia: ${consistency}%`
      })
    }

    // Badge de Velocidad
    const avgResponseTime = metrics.generalStats.averageResponseTime
    if (avgResponseTime <= this.config.badgeCriteria.speed.platinum) {
      badges.push({
        id: `speed-platinum-${Date.now()}`,
        type: 'SPEED',
        name: 'Respuesta Instantánea',
        description: 'Respuesta ultra-rápida (<2 horas)',
        icon: '⚡',
        level: 'PLATINUM',
        earnedAt: now,
        criteria: `Tiempo promedio: ${avgResponseTime}h`
      })
    }

    // Badge de Participación
    const totalProjects = metrics.generalStats.totalProjectsCompleted
    if (totalProjects >= this.config.badgeCriteria.participation.platinum) {
      badges.push({
        id: `participation-platinum-${Date.now()}`,
        type: 'PARTICIPATION',
        name: 'Veterano MIC MAC',
        description: 'Participación excepcional (>100 proyectos)',
        icon: '🎖️',
        level: 'PLATINUM',
        earnedAt: now,
        criteria: `Proyectos completados: ${totalProjects}`
      })
    }

    return badges
  }

  /**
   * 💡 GENERAR RECOMENDACIONES PERSONALIZADAS
   */
  generateRecommendations(metrics: ExpertGlobalMetrics): ExpertGlobalMetrics['recommendations'] {
    const suggestions: string[] = []
    const overallReliability = metrics.globalScores.overallReliability

    // Recomendaciones basadas en puntuación general
    if (overallReliability < 60) {
      suggestions.push('Mejorar tiempo de respuesta a invitaciones')
      suggestions.push('Completar más ejercicios una vez iniciados')
    }

    if (metrics.globalScores.expertiseConsistency < 70) {
      suggestions.push('Revisar criterios de evaluación con otros expertos')
      suggestions.push('Participar en sesiones de calibración')
    }

    if (metrics.globalScores.timeManagement < 70) {
      suggestions.push('Establecer recordatorios para ejercicios pendientes')
      suggestions.push('Dedicar tiempo específico para ejercicios MIC MAC')
    }

    // Determinar prioridad de invitación
    const invitationPriority = this.calculateReliability(overallReliability)

    // Tipos de proyecto ideales basados en historial
    const idealProjectTypes = metrics.expertiseMetrics.preferredProjectTypes.length > 0 
      ? metrics.expertiseMetrics.preferredProjectTypes 
      : ['STRATEGIC'] // default

    return {
      invitationPriority,
      idealProjectTypes,
      suggestedImprovements: suggestions,
      nextMilestones: this.generateNextMilestones(metrics)
    }
  }

  /**
   * 🎯 GENERAR PRÓXIMOS HITOS
   */
  private generateNextMilestones(metrics: ExpertGlobalMetrics): string[] {
    const milestones: string[] = []
    const stats = metrics.generalStats

    // Hitos de participación
    const nextProjectMilestone = Math.ceil((stats.totalProjectsCompleted + 1) / 10) * 10
    if (nextProjectMilestone > stats.totalProjectsCompleted) {
      milestones.push(`Completar ${nextProjectMilestone} proyectos`)
    }

    // Hitos de consistencia
    if (metrics.globalScores.expertiseConsistency < 90) {
      milestones.push('Alcanzar 90% de consistencia')
    }

    // Hitos de velocidad
    if (stats.averageResponseTime > 12) {
      milestones.push('Reducir tiempo de respuesta a menos de 12 horas')
    }

    return milestones.slice(0, 3) // Máximo 3 hitos
  }

  /**
   * 📊 PROCESAR EVENTO DE TRACKING
   */
  processTrackingEvent(event: ExpertTrackingEvent): Partial<ExpertParticipationMetrics> {
    const updates: any = {}
    const now = new Date()

    switch (event.eventType) {
      case 'INVITATION_SENT':
        updates.timeMetrics = {
          invitationSentAt: event.timestamp
        }
        break

      case 'INVITATION_ACCEPTED':
        if (event.metadata.invitationSentAt) {
          const sentAt = new Date(event.metadata.invitationSentAt)
          const responseDelay = (now.getTime() - sentAt.getTime()) / (1000 * 60 * 60) // horas
          updates.timeMetrics = {
            firstResponseAt: event.timestamp,
            responseDelay
          }
        }
        break

      case 'EXERCISE_STARTED':
        updates.timeMetrics = {
          exerciseStartedAt: event.timestamp
        }
        break

      case 'VOTE_CAST':
        // Actualizar tiempo promedio por voto
        if (event.metadata.timeSpent) {
          updates.timeMetrics = {
            averageTimePerVote: event.metadata.timeSpent
          }
        }
        break

      case 'EXERCISE_COMPLETED':
        if (event.metadata.exerciseStartedAt) {
          const startedAt = new Date(event.metadata.exerciseStartedAt)
          const completionTime = (now.getTime() - startedAt.getTime()) / (1000 * 60 * 60) // horas
          updates.timeMetrics = {
            exerciseCompletedAt: event.timestamp,
            completionTime
          }
        }
        break
    }

    return updates
  }
}

// Instancia singleton del calculador
export const metricsCalculator = new ExpertMetricsCalculator()

// Funciones utilitarias
export const ExpertMetricsUtils = {
  /**
   * Formatear tiempo en formato legible
   */
  formatTime(hours: number): string {
    if (hours < 1) {
      return `${Math.round(hours * 60)} min`
    }
    if (hours < 24) {
      return `${Math.round(hours)} h`
    }
    const days = Math.floor(hours / 24)
    const remainingHours = Math.round(hours % 24)
    return `${days}d ${remainingHours}h`
  },

  /**
   * Obtener color para puntuación
   */
  getScoreColor(score: number): string {
    if (score >= 90) return 'text-green-400'
    if (score >= 75) return 'text-blue-400'
    if (score >= 60) return 'text-yellow-400'
    if (score >= 40) return 'text-orange-400'
    return 'text-red-400'
  },

  /**
   * Obtener etiqueta de confiabilidad
   */
  getReliabilityLabel(priority: ExpertGlobalMetrics['recommendations']['invitationPriority']): string {
    const labels = {
      'HIGH': 'Alta Confiabilidad',
      'MEDIUM': 'Confiabilidad Media',
      'LOW': 'Confiabilidad Baja',
      'AVOID': 'No Recomendado'
    }
    return labels[priority]
  },

  /**
   * Obtener icono de badge
   */
  getBadgeIcon(type: ExpertBadge['type'], level: ExpertBadge['level']): string {
    const icons = {
      'CONSISTENCY': { 'BRONZE': '🥉', 'SILVER': '🥈', 'GOLD': '🥇', 'PLATINUM': '🏆' },
      'SPEED': { 'BRONZE': '🚀', 'SILVER': '⚡', 'GOLD': '💨', 'PLATINUM': '🏃‍♂️' },
      'PARTICIPATION': { 'BRONZE': '📋', 'SILVER': '📊', 'GOLD': '🎯', 'PLATINUM': '🎖️' },
      'QUALITY': { 'BRONZE': '⭐', 'SILVER': '🌟', 'GOLD': '✨', 'PLATINUM': '💎' },
      'SPECIAL': { 'BRONZE': '🏅', 'SILVER': '🏆', 'GOLD': '👑', 'PLATINUM': '💫' }
    }
    return icons[type]?.[level] || '🏅'
  }
}
