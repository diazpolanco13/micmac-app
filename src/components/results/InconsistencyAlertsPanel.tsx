'use client'

import React, { useState, useMemo } from 'react'
import { AlertTriangle, AlertCircle, Info, Filter, ChevronDown, ChevronUp, Eye, EyeOff, HelpCircle, Users, TrendingUp, Target } from 'lucide-react'

// Tipos importados del utils
interface InconsistencyAlert {
  relation: string
  variable1: string
  variable2: string
  influenceVote: number
  dependenceVote: number
  difference: number
  severity: 'low' | 'medium' | 'high'
  message: string
}

interface Expert {
  id: string
  name: string
  organization?: string | null
  expertiseAreas: string[]
}

interface VotingResponse {
  expertId: string
  variableAId: string
  variableBId: string
  phase: 'INFLUENCE' | 'DEPENDENCE'
  value: number
  confidence?: number
}

interface InconsistencyAlertsPanelProps {
  alerts: InconsistencyAlert[]
  qualityScore?: number
  className?: string
  // Nuevas props para análisis detallado
  votes?: VotingResponse[]
  experts?: Expert[]
  variables?: Array<{ id: string; name: string }>
}

export default function InconsistencyAlertsPanel({ 
  alerts, 
  qualityScore = 100, 
  className = '',
  votes = [],
  experts = [],
  variables = []
}: InconsistencyAlertsPanelProps) {
  const [selectedSeverity, setSelectedSeverity] = useState<'all' | 'high' | 'medium' | 'low'>('all')
  const [isExpanded, setIsExpanded] = useState(true)
  const [showDetails, setShowDetails] = useState(false)
  const [expandedAlerts, setExpandedAlerts] = useState<Set<number>>(new Set())

  // Filtrar alertas por severidad
  const filteredAlerts = useMemo(() => {
    if (selectedSeverity === 'all') return alerts
    return alerts.filter(alert => alert.severity === selectedSeverity)
  }, [alerts, selectedSeverity])

  // Estadísticas de alertas
  const alertStats = useMemo(() => {
    const high = alerts.filter(a => a.severity === 'high').length
    const medium = alerts.filter(a => a.severity === 'medium').length
    const low = alerts.filter(a => a.severity === 'low').length
    
    return { high, medium, low, total: alerts.length }
  }, [alerts])

  // Función para obtener el color según severidad
  const getSeverityColor = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'high': return 'text-red-400 bg-red-900/20 border-red-700'
      case 'medium': return 'text-yellow-400 bg-yellow-900/20 border-yellow-700'
      case 'low': return 'text-blue-400 bg-blue-900/20 border-blue-700'
      default: return 'text-gray-400 bg-gray-900/20 border-gray-700'
    }
  }

  const getSeverityIcon = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'high': return AlertTriangle
      case 'medium': return AlertCircle
      case 'low': return Info
      default: return Info
    }
  }

  const getSeverityLabel = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'high': return 'Crítica'
      case 'medium': return 'Moderada'
      case 'low': return 'Leve'
      default: return 'Desconocida'
    }
  }

  // Función para alternar expansión de alerta
  const toggleAlertExpansion = (index: number) => {
    const newExpanded = new Set(expandedAlerts)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedAlerts(newExpanded)
  }

  // Función para analizar expertos que contribuyeron a una inconsistencia
  const analyzeInconsistencyExperts = (alert: InconsistencyAlert) => {
    if (!votes.length || !variables.length) return null

    // Encontrar IDs de variables
    const var1 = variables.find(v => v.name === alert.variable1)
    const var2 = variables.find(v => v.name === alert.variable2)
    
    if (!var1 || !var2) return null

    // Buscar votos relacionados
    const influenceVotes = votes.filter(v => 
      v.phase === 'INFLUENCE' && 
      v.variableAId === var1.id && 
      v.variableBId === var2.id
    )
    
    const dependenceVotes = votes.filter(v => 
      v.phase === 'DEPENDENCE' && 
      v.variableAId === var2.id && 
      v.variableBId === var1.id
    )

    // Analizar diferencias por experto
    const expertAnalysis = new Map()
    
    influenceVotes.forEach(infVote => {
      const correspondingDepVote = dependenceVotes.find(depVote => depVote.expertId === infVote.expertId)
      if (correspondingDepVote) {
        const difference = Math.abs(infVote.value - correspondingDepVote.value)
        const expert = experts.find(e => e.id === infVote.expertId)
        
        if (expert && difference > 1) { // Solo incluir si contribuye a la inconsistencia
          expertAnalysis.set(infVote.expertId, {
            expert,
            influenceVote: infVote.value,
            dependenceVote: correspondingDepVote.value,
            difference,
            influenceConfidence: infVote.confidence || 0,
            dependenceConfidence: correspondingDepVote.confidence || 0
          })
        }
      }
    })

    return Array.from(expertAnalysis.values()).sort((a, b) => b.difference - a.difference)
  }

  // Función para explicar el impacto de una inconsistencia
  const getInconsistencyImpact = (alert: InconsistencyAlert) => {
    const impacts = []
    
    if (alert.severity === 'high') {
      impacts.push({
        type: 'Distorsión de resultados',
        description: 'Esta gran diferencia puede alterar significativamente la clasificación de las variables en el plano MIC MAC.',
        icon: TrendingUp,
        color: 'text-red-400'
      })
      impacts.push({
        type: 'Falta de consenso',
        description: 'Indica diferencias conceptuales importantes entre expertos que requieren discusión.',
        icon: Users,
        color: 'text-red-400'
      })
    } else if (alert.severity === 'medium') {
      impacts.push({
        type: 'Variación moderada',
        description: 'Puede influir en la posición exacta de las variables, pero el cuadrante probablemente se mantiene.',
        icon: Target,
        color: 'text-yellow-400'
      })
    } else {
      impacts.push({
        type: 'Variación normal',
        description: 'Diferencia típica en la percepción de expertos, impacto mínimo en resultados finales.',
        icon: Info,
        color: 'text-blue-400'
      })
    }

    return impacts
  }

  // Función para obtener sugerencias específicas
  const getInconsistencySuggestions = (alert: InconsistencyAlert, expertAnalysis: any[]) => {
    const suggestions = []
    
    if (alert.severity === 'high') {
      suggestions.push('Organizar sesión de discusión entre expertos con mayor diferencia')
      suggestions.push('Revisar definiciones de las variables involucradas')
      suggestions.push('Considerar una ronda adicional de votación después de la discusión')
    } else if (alert.severity === 'medium') {
      suggestions.push('Verificar comprensión de la relación entre variables')
      suggestions.push('Proporcionar contexto adicional sobre el escenario')
    } else {
      suggestions.push('Monitorear en futuras iteraciones')
      suggestions.push('Documentar diferentes perspectivas para referencia')
    }

    if (expertAnalysis && expertAnalysis.length > 0) {
      const lowConfidenceExperts = expertAnalysis.filter(e => 
        (e.influenceConfidence < 3 || e.dependenceConfidence < 3)
      )
      
      if (lowConfidenceExperts.length > 0) {
        suggestions.push(`${lowConfidenceExperts.length} experto(s) mostraron baja confianza - considerar capacitación adicional`)
      }
    }

    return suggestions
  }

  const getQualityColor = (score: number) => {
    if (score >= 90) return 'text-green-400 bg-green-900/20'
    if (score >= 70) return 'text-yellow-400 bg-yellow-900/20'
    if (score >= 50) return 'text-orange-400 bg-orange-900/20'
    return 'text-red-400 bg-red-900/20'
  }

  const getQualityLabel = (score: number) => {
    if (score >= 90) return 'Excelente'
    if (score >= 70) return 'Buena'
    if (score >= 50) return 'Aceptable'
    return 'Mejorable'
  }

  if (alerts.length === 0) {
    return (
      <div className={`bg-green-900/20 border border-green-700 rounded-lg p-6 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-500/20 rounded-lg">
            <AlertCircle className="h-5 w-5 text-green-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-green-400">Sin Inconsistencias Detectadas</h3>
            <p className="text-sm text-green-300">Los expertos mostraron alta coherencia en sus evaluaciones</p>
          </div>
          <div className="ml-auto text-right">
            <div className="text-2xl font-bold text-green-400">{qualityScore.toFixed(0)}%</div>
            <div className="text-sm text-green-300">Calidad</div>
          </div>
        </div>
        
        <div className="bg-green-800/30 rounded-lg p-4">
          <p className="text-sm text-green-200">
            ✅ Todas las evaluaciones de influencia y dependencia son consistentes entre sí. 
            Esto indica un alto nivel de consenso entre los expertos participantes.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-gray-900 border border-gray-700 rounded-lg ${className}`}>
      {/* Header con estadísticas */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Detección de Inconsistencias
              </h3>
              <p className="text-sm text-gray-400">
                {alerts.length} inconsistencia{alerts.length !== 1 ? 's' : ''} detectada{alerts.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Puntuación de calidad */}
            <div className={`px-4 py-2 rounded-lg ${getQualityColor(qualityScore)}`}>
              <div className="text-center">
                <div className="text-xl font-bold">{qualityScore.toFixed(0)}%</div>
                <div className="text-xs">{getQualityLabel(qualityScore)}</div>
              </div>
            </div>
            
            {/* Botón expandir/colapsar */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
            >
              {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-red-900/20 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-red-400">{alertStats.high}</div>
            <div className="text-xs text-red-300">Críticas</div>
          </div>
          <div className="bg-yellow-900/20 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-yellow-400">{alertStats.medium}</div>
            <div className="text-xs text-yellow-300">Moderadas</div>
          </div>
          <div className="bg-blue-900/20 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-400">{alertStats.low}</div>
            <div className="text-xs text-blue-300">Leves</div>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-6">
          {/* Controles de filtrado */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Filter className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-400">Filtrar por severidad:</span>
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value as any)}
                className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-1 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Todas ({alertStats.total})</option>
                <option value="high">Críticas ({alertStats.high})</option>
                <option value="medium">Moderadas ({alertStats.medium})</option>
                <option value="low">Leves ({alertStats.low})</option>
              </select>
            </div>
            
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-2 px-3 py-1 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {showDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showDetails ? 'Ocultar' : 'Mostrar'} Detalles
            </button>
          </div>

          {/* Lista de alertas */}
          <div className="space-y-3">
            {filteredAlerts.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Info className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No hay alertas para el filtro seleccionado</p>
              </div>
            ) : (
              filteredAlerts.map((alert, index) => {
                const Icon = getSeverityIcon(alert.severity)
                const colorClasses = getSeverityColor(alert.severity)
                const isExpanded = expandedAlerts.has(index)
                const expertAnalysis = analyzeInconsistencyExperts(alert)
                const impacts = getInconsistencyImpact(alert)
                const suggestions = getInconsistencySuggestions(alert, expertAnalysis || [])
                
                return (
                  <div
                    key={index}
                    className={`border rounded-lg ${colorClasses} transition-all`}
                  >
                    {/* Header clickeable */}
                    <div 
                      className="p-4 cursor-pointer hover:bg-opacity-30"
                      onClick={() => toggleAlertExpansion(index)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-1">
                          <Icon className="h-5 w-5" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-white">
                              {alert.relation}
                            </h4>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                alert.severity === 'high' ? 'bg-red-900 text-red-300' :
                                alert.severity === 'medium' ? 'bg-yellow-900 text-yellow-300' :
                                'bg-blue-900 text-blue-300'
                              }`}>
                                {getSeverityLabel(alert.severity)}
                              </span>
                              <span className="text-sm font-bold">
                                Δ {alert.difference.toFixed(1)}
                              </span>
                              <button className="p-1 hover:bg-gray-700 rounded transition-colors">
                                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                              </button>
                            </div>
                          </div>
                          
                          <p className="text-sm mb-2">
                            {alert.message}
                          </p>
                          
                          {expertAnalysis && expertAnalysis.length > 0 && (
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              <Users className="h-3 w-3" />
                              <span>{expertAnalysis.length} experto{expertAnalysis.length !== 1 ? 's' : ''} contribuyeron a esta inconsistencia</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Contenido expandido */}
                    {isExpanded && (
                      <div className="border-t border-gray-700 p-4 space-y-6">
                        {/* Explicación detallada */}
                        <div className="bg-gray-800/30 rounded-lg p-4">
                          <h5 className="font-semibold text-white mb-3 flex items-center gap-2">
                            <HelpCircle className="h-4 w-4" />
                            ¿Qué significa esta inconsistencia?
                          </h5>
                          <p className="text-sm text-gray-300 mb-4">
                            Esta inconsistencia surge cuando los expertos evalúan de manera muy diferente la relación 
                            <span className="font-semibold text-white"> {alert.variable1} → {alert.variable2}</span> desde 
                            las perspectivas de influencia y dependencia.
                          </p>
                          
                          {/* Comparación visual de votos */}
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="bg-gray-700/50 rounded-lg p-3">
                              <div className="text-xs text-gray-400 mb-2">Evaluación de Influencia</div>
                              <div className="flex items-center gap-2">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${
                                  alert.influenceVote === 0 ? 'bg-gray-700 text-gray-400' :
                                  alert.influenceVote === 1 ? 'bg-yellow-900 text-yellow-300' :
                                  alert.influenceVote === 2 ? 'bg-orange-900 text-orange-300' :
                                  'bg-red-900 text-red-300'
                                }`}>
                                  {alert.influenceVote}
                                </div>
                                <div className="text-xs">
                                  <div className="text-gray-300">{alert.variable1} → {alert.variable2}</div>
                                  <div className="text-gray-400">
                                    {alert.influenceVote === 0 ? 'Sin influencia' :
                                     alert.influenceVote === 1 ? 'Influencia débil' :
                                     alert.influenceVote === 2 ? 'Influencia moderada' :
                                     'Influencia fuerte'}
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-gray-700/50 rounded-lg p-3">
                              <div className="text-xs text-gray-400 mb-2">Evaluación de Dependencia</div>
                              <div className="flex items-center gap-2">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${
                                  alert.dependenceVote === 0 ? 'bg-gray-700 text-gray-400' :
                                  alert.dependenceVote === 1 ? 'bg-yellow-900 text-yellow-300' :
                                  alert.dependenceVote === 2 ? 'bg-orange-900 text-orange-300' :
                                  'bg-red-900 text-red-300'
                                }`}>
                                  {alert.dependenceVote}
                                </div>
                                <div className="text-xs">
                                  <div className="text-gray-300">{alert.variable2} ← {alert.variable1}</div>
                                  <div className="text-gray-400">
                                    {alert.dependenceVote === 0 ? 'Sin dependencia' :
                                     alert.dependenceVote === 1 ? 'Dependencia débil' :
                                     alert.dependenceVote === 2 ? 'Dependencia moderada' :
                                     'Dependencia fuerte'}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Análisis de expertos */}
                        {expertAnalysis && expertAnalysis.length > 0 && (
                          <div className="bg-blue-900/20 rounded-lg p-4">
                            <h5 className="font-semibold text-blue-300 mb-3 flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              Expertos que contribuyeron ({expertAnalysis.length})
                            </h5>
                            <div className="space-y-3">
                              {expertAnalysis.slice(0, 3).map((exp, expIndex) => (
                                <div key={expIndex} className="flex items-center justify-between bg-blue-800/30 rounded-lg p-3">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                                      {exp.expert.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                      <div className="font-medium text-white">{exp.expert.name}</div>
                                      <div className="text-xs text-blue-300">{exp.expert.organization}</div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-sm font-bold text-blue-300">
                                      Δ {exp.difference.toFixed(1)}
                                    </div>
                                    <div className="text-xs text-blue-400">
                                      {exp.influenceVote} vs {exp.dependenceVote}
                                    </div>
                                  </div>
                                </div>
                              ))}
                              {expertAnalysis.length > 3 && (
                                <div className="text-center text-xs text-blue-400">
                                  +{expertAnalysis.length - 3} experto{expertAnalysis.length - 3 !== 1 ? 's' : ''} más
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Impacto en el ejercicio */}
                        <div className="bg-yellow-900/20 rounded-lg p-4">
                          <h5 className="font-semibold text-yellow-300 mb-3 flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Impacto en el ejercicio
                          </h5>
                          <div className="space-y-2">
                            {impacts.map((impact, impactIndex) => {
                              const ImpactIcon = impact.icon
                              return (
                                <div key={impactIndex} className="flex items-start gap-3">
                                  <ImpactIcon className={`h-4 w-4 mt-0.5 ${impact.color}`} />
                                  <div>
                                    <div className="font-medium text-white text-sm">{impact.type}</div>
                                    <div className="text-xs text-gray-300">{impact.description}</div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>

                        {/* Sugerencias de acción */}
                        <div className="bg-green-900/20 rounded-lg p-4">
                          <h5 className="font-semibold text-green-300 mb-3 flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            Sugerencias de acción
                          </h5>
                          <ul className="space-y-2">
                            {suggestions.map((suggestion, suggestionIndex) => (
                              <li key={suggestionIndex} className="flex items-start gap-2 text-sm">
                                <span className="text-green-400 font-bold mt-0.5">•</span>
                                <span className="text-green-200">{suggestion}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>

          {/* Recomendaciones */}
          {alerts.length > 0 && (
            <div className="mt-6 bg-blue-900/20 border border-blue-700 rounded-lg p-4">
              <h4 className="font-semibold text-blue-400 mb-3 flex items-center gap-2">
                <Info className="h-4 w-4" />
                Recomendaciones
              </h4>
              <ul className="space-y-2 text-sm text-blue-200">
                {alertStats.high > 0 && (
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 font-bold">•</span>
                    <span>
                      <strong>Inconsistencias críticas:</strong> Revisar con los expertos las evaluaciones 
                      marcadas como críticas para aclarar diferencias conceptuales.
                    </span>
                  </li>
                )}
                {alertStats.medium > 0 && (
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 font-bold">•</span>
                    <span>
                      <strong>Inconsistencias moderadas:</strong> Considerar una ronda adicional de 
                      votación para las relaciones con mayor discrepancia.
                    </span>
                  </li>
                )}
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold">•</span>
                  <span>
                    El método híbrido está aplicando validación cruzada automáticamente 
                    para minimizar el impacto de estas inconsistencias en los resultados finales.
                  </span>
                </li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
