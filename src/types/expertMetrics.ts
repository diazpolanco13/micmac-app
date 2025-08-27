/**
 * 📊 SISTEMA DE MÉTRICAS Y PUNTUACIÓN DE EXPERTOS
 * Sistema completo para trackear y evaluar el desempeño de expertos
 */

// Tipos base para métricas de participación
export interface ExpertParticipationMetrics {
  expertId: string
  projectId: string
  
  // 🕒 MÉTRICAS DE TIEMPO
  timeMetrics: {
    invitationSentAt: string
    firstResponseAt: string | null
    exerciseStartedAt: string | null
    exerciseCompletedAt: string | null
    totalTimeSpent: number // en segundos
    averageTimePerVote: number // en segundos
    responseDelay: number // tiempo desde invitación hasta primera respuesta (horas)
    completionTime: number // tiempo total para completar ejercicio (horas)
  }
  
  // 🎯 MÉTRICAS DE CALIDAD
  qualityMetrics: {
    consistencyScore: number // 0-100: qué tan consistente es con otros expertos
    confidenceAverage: number // 1-5: promedio de confianza en sus respuestas
    inconsistencyContributions: number // cuántas inconsistencias generó
    votingCompleteness: number // % de votos completados vs requeridos
    responseQuality: number // 0-100: calidad general de respuestas
  }
  
  // 📋 MÉTRICAS DE PARTICIPACIÓN
  participationMetrics: {
    invitationAcceptanceRate: number // % de invitaciones aceptadas
    exerciseCompletionRate: number // % de ejercicios completados una vez iniciados
    onTimeCompletionRate: number // % de ejercicios completados a tiempo
    communicationResponsiveness: number // 0-100: qué tan responsivo es a comunicaciones
    followUpEngagement: number // 0-100: participación en discusiones post-ejercicio
  }
  
  // 🏆 PUNTUACIÓN GLOBAL
  overallScore: number // 0-100: puntuación general calculada
  reliability: 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'POOR' | 'UNRELIABLE'
  
  // 📈 MÉTRICAS HISTÓRICAS
  historicalTrends: {
    improvementTrend: number // -100 a +100: si está mejorando o empeorando
    consistencyTrend: number // tendencia de consistencia en últimos ejercicios
    speedTrend: number // tendencia de velocidad de respuesta
  }
  
  // 📝 METADATA
  lastUpdated: string
  exercisesParticipated: number
  totalVotesCast: number
}

// Métricas agregadas por experto (resumen de todos los proyectos)
export interface ExpertGlobalMetrics {
  expertId: string
  
  // 🏆 PUNTUACIONES GLOBALES
  globalScores: {
    overallReliability: number // 0-100
    expertiseConsistency: number // 0-100
    participationQuality: number // 0-100
    timeManagement: number // 0-100
    communicationEffectiveness: number // 0-100
  }
  
  // 📊 ESTADÍSTICAS GENERALES
  generalStats: {
    totalProjectsInvited: number
    totalProjectsParticipated: number
    totalProjectsCompleted: number
    totalVotesCast: number
    totalInconsistencies: number
    averageProjectCompletionTime: number // horas
    averageResponseTime: number // horas
  }
  
  // 🎯 ESPECIALIZACIÓN Y EXPERTISE
  expertiseMetrics: {
    primaryAreas: string[] // áreas donde mejor se desempeña
    consistencyByArea: Record<string, number> // consistencia por área de expertise
    preferredProjectTypes: string[] // tipos de proyecto donde mejor participa
    optimalProjectSize: number // número ideal de variables para este experto
  }
  
  // 📈 TENDENCIAS HISTÓRICAS
  trends: {
    last30Days: {
      projectsCompleted: number
      averageQuality: number
      responseTimeImprovement: number
    }
    last90Days: {
      projectsCompleted: number
      averageQuality: number
      consistencyImprovement: number
    }
    yearToDate: {
      projectsCompleted: number
      averageQuality: number
      overallImprovement: number
    }
  }
  
  // 🏅 RECONOCIMIENTOS Y BADGES
  achievements: {
    badges: ExpertBadge[]
    milestones: ExpertMilestone[]
    specialRecognitions: string[]
  }
  
  // 🎯 RECOMENDACIONES DEL SISTEMA
  recommendations: {
    invitationPriority: 'HIGH' | 'MEDIUM' | 'LOW' | 'AVOID'
    idealProjectTypes: string[]
    suggestedImprovements: string[]
    nextMilestones: string[]
  }
  
  lastCalculated: string
}

// Sistema de badges/logros para expertos
export interface ExpertBadge {
  id: string
  type: 'CONSISTENCY' | 'SPEED' | 'PARTICIPATION' | 'QUALITY' | 'SPECIAL'
  name: string
  description: string
  icon: string
  earnedAt: string
  level: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM'
  criteria: string
}

// Hitos importantes del experto
export interface ExpertMilestone {
  id: string
  type: 'PROJECTS' | 'VOTES' | 'CONSISTENCY' | 'TIME' | 'SPECIAL'
  name: string
  description: string
  achievedAt: string
  value: number
  unit: string
}

// Configuración para cálculo de métricas
export interface MetricsCalculationConfig {
  // Pesos para puntuación global (deben sumar 100)
  weights: {
    consistency: number // peso de consistencia en puntuación global
    timeliness: number // peso de puntualidad
    participation: number // peso de participación activa
    quality: number // peso de calidad de respuestas
    communication: number // peso de comunicación
  }
  
  // Umbrales para clasificaciones
  thresholds: {
    excellent: number // > 90
    good: number // > 75
    average: number // > 60
    poor: number // > 40
    unreliable: number // <= 40
  }
  
  // Configuración de badges
  badgeCriteria: {
    consistency: {
      bronze: number // > 80% consistencia
      silver: number // > 90% consistencia  
      gold: number // > 95% consistencia
      platinum: number // > 98% consistencia
    }
    speed: {
      bronze: number // < 24 horas respuesta
      silver: number // < 12 horas respuesta
      gold: number // < 6 horas respuesta
      platinum: number // < 2 horas respuesta
    }
    participation: {
      bronze: number // > 10 proyectos
      silver: number // > 25 proyectos
      gold: number // > 50 proyectos
      platinum: number // > 100 proyectos
    }
  }
}

// Funciones utilitarias para cálculos
export interface MetricsCalculator {
  calculateOverallScore(metrics: ExpertParticipationMetrics): number
  calculateConsistencyScore(votes: any[], allVotes: any[]): number
  calculateReliability(score: number): ExpertGlobalMetrics['recommendations']['invitationPriority']
  calculateTrends(historicalMetrics: ExpertParticipationMetrics[]): any
  awardBadges(metrics: ExpertGlobalMetrics): ExpertBadge[]
  generateRecommendations(metrics: ExpertGlobalMetrics): ExpertGlobalMetrics['recommendations']
}

// Eventos para tracking en tiempo real
export interface ExpertTrackingEvent {
  id: string
  expertId: string
  projectId: string
  eventType: 'INVITATION_SENT' | 'INVITATION_ACCEPTED' | 'INVITATION_DECLINED' | 
             'EXERCISE_STARTED' | 'VOTE_CAST' | 'EXERCISE_COMPLETED' | 
             'EXERCISE_ABANDONED' | 'COMMUNICATION_SENT' | 'COMMUNICATION_READ'
  timestamp: string
  metadata: Record<string, any>
  sessionId?: string
}

// Dashboard de métricas para moderadores
export interface ExpertMetricsDashboard {
  // Vista general del pool de expertos
  poolOverview: {
    totalExperts: number
    activeExperts: number
    reliableExperts: number
    expertsNeedingAttention: number
    averagePoolQuality: number
  }
  
  // Top performers
  topPerformers: {
    mostReliable: ExpertGlobalMetrics[]
    fastest: ExpertGlobalMetrics[]
    mostConsistent: ExpertGlobalMetrics[]
    mostActive: ExpertGlobalMetrics[]
  }
  
  // Alertas y recomendaciones
  alerts: {
    expertsWithDecliningPerformance: string[]
    expertsNotResponding: string[]
    expertsMissingDeadlines: string[]
    suggestedExpertsToRecruit: string[]
  }
  
  // Métricas por área de expertise
  expertiseAreaMetrics: Record<string, {
    totalExperts: number
    averageQuality: number
    coverage: 'EXCELLENT' | 'GOOD' | 'ADEQUATE' | 'INSUFFICIENT'
    topExperts: string[]
  }>
}

// Configuración por defecto
export const DEFAULT_METRICS_CONFIG: MetricsCalculationConfig = {
  weights: {
    consistency: 30,
    timeliness: 25,
    participation: 20,
    quality: 15,
    communication: 10
  },
  thresholds: {
    excellent: 90,
    good: 75,
    average: 60,
    poor: 40,
    unreliable: 0
  },
  badgeCriteria: {
    consistency: {
      bronze: 80,
      silver: 90,
      gold: 95,
      platinum: 98
    },
    speed: {
      bronze: 24,
      silver: 12,
      gold: 6,
      platinum: 2
    },
    participation: {
      bronze: 10,
      silver: 25,
      gold: 50,
      platinum: 100
    }
  }
}

// Tipos para la base de datos
export interface ExpertMetricsDBSchema {
  // Tabla principal de métricas por proyecto
  expert_project_metrics: {
    id: string
    expert_id: string
    project_id: string
    invitation_sent_at: string
    first_response_at: string | null
    exercise_started_at: string | null
    exercise_completed_at: string | null
    total_time_spent: number
    average_time_per_vote: number
    response_delay_hours: number
    completion_time_hours: number
    consistency_score: number
    confidence_average: number
    inconsistency_contributions: number
    voting_completeness: number
    response_quality: number
    overall_score: number
    reliability: string
    created_at: string
    updated_at: string
  }
  
  // Tabla de métricas globales por experto
  expert_global_metrics: {
    id: string
    expert_id: string
    overall_reliability: number
    expertise_consistency: number
    participation_quality: number
    time_management: number
    communication_effectiveness: number
    total_projects_invited: number
    total_projects_participated: number
    total_projects_completed: number
    total_votes_cast: number
    total_inconsistencies: number
    average_project_completion_time: number
    average_response_time: number
    invitation_priority: string
    last_calculated: string
    created_at: string
    updated_at: string
  }
  
  // Tabla de eventos de tracking
  expert_tracking_events: {
    id: string
    expert_id: string
    project_id: string
    event_type: string
    timestamp: string
    metadata: any
    session_id: string | null
    created_at: string
  }
  
  // Tabla de badges y logros
  expert_badges: {
    id: string
    expert_id: string
    badge_type: string
    name: string
    description: string
    icon: string
    level: string
    earned_at: string
    criteria: string
    created_at: string
  }
}
