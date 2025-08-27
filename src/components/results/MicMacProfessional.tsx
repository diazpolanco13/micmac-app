'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useMockData } from '@/contexts/MockDataContext'
import type { MicMacResults, VariableAnalysis, Expert, VotingResponse } from '@/types/project'
import { generateClassicMicMacMatrix, generateImprovedMicMacMatrix } from '@/utils/micmacCalculations'
import MicMacMethodSelector from './MicMacMethodSelector'
import MicMacMethodExplanation from './MicMacMethodExplanation'
import InconsistencyAlertsPanel from './InconsistencyAlertsPanel'
import { 
  Camera, Download, RefreshCw, Settings, Info, ChevronRight, ChevronLeft, 
  Plus, Minus, Grid, BarChart3, TrendingUp, Target, Layers, Activity, 
  Eye, EyeOff, Save, Upload, FileText, Share2, Filter, Maximize2, 
  Users, Brain, Award, Zap, AlertCircle, CheckCircle, XCircle
} from 'lucide-react'

interface MicMacProfessionalProps {
  projectId: string
  className?: string
}

// Tipos extendidos para incluir inconsistencias
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

interface ExtendedMicMacResults extends MicMacResults {
  inconsistencyAlerts?: InconsistencyAlert[]
  qualityScore?: number
  calculationMethod?: 'average' | 'maximum' | 'weighted'
}

export default function MicMacProfessional({ projectId, className = '' }: MicMacProfessionalProps) {
  // Estados principales
  const [results, setResults] = useState<ExtendedMicMacResults | null>(null)
  const [loading, setLoading] = useState(true) // Empezar en loading
  const [calculationMethod, setCalculationMethod] = useState<'classic' | 'hybrid'>('hybrid')
  const [selectedVariable, setSelectedVariable] = useState<number | null>(null)
  const [selectedExpert, setSelectedExpert] = useState<string | null>(null)
  
  // Estados de UI
  const [activeTab, setActiveTab] = useState<'analysis' | 'matrix' | 'experts' | 'inconsistencies' | 'advanced'>('analysis')
  const [showGrid, setShowGrid] = useState(true)
  const [showLabels, setShowLabels] = useState(true)
  const [animateChart, setAnimateChart] = useState(true)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [showExpertInfluence, setShowExpertInfluence] = useState(false)
  const [confidenceThreshold, setConfidenceThreshold] = useState(2)
  
  const { 
    calculateMicMacResults, 
    getMicMacResults, 
    getProjectVotes,
    simulateAllExperts,
    projects,
    experts 
  } = useMockData()

  // Funciones auxiliares (declaradas antes de ser usadas)
  const calculateConsistency = (expertVotes: VotingResponse[], allVotes: VotingResponse[]): number => {
    // Simplificado: comparar valores promedio
    const expertAvg = expertVotes.reduce((sum, v) => sum + v.value, 0) / expertVotes.length
    const totalAvg = allVotes.reduce((sum, v) => sum + v.value, 0) / allVotes.length
    return Math.max(0, 100 - Math.abs(expertAvg - totalAvg) * 20) // Convertir a porcentaje
  }

  const calculateExpertInfluence = (expertVotes: VotingResponse[], results: MicMacResults): number => {
    // Simplificado: peso basado en confianza y experiencia
    const avgConfidence = expertVotes.reduce((sum, v) => sum + (v.confidence || 0), 0) / expertVotes.length
    return (avgConfidence / 5) * 100 // Convertir a porcentaje
  }

  // Obtener proyecto actual
  const project = useMemo(() => {
    return projects.find(p => p.id === projectId)
  }, [projects, projectId])

  // Cargar resultados
  const loadResults = async () => {
    console.log(`🔄 [MicMacProfessional] Iniciando carga de resultados para proyecto: ${projectId}`)
    setLoading(true)
    
    try {
      // 1. Para método híbrido, intentar cache primero
      if (calculationMethod === 'hybrid') {
        console.log(`📦 [MicMacProfessional] Verificando cache para método híbrido...`)
        let cached = getMicMacResults(projectId)
        
        if (cached) {
          console.log(`✅ [MicMacProfessional] Resultados híbridos encontrados en cache:`, {
            variables: cached.variables.length,
            votos: cached.totalVotes,
            calculadoEn: cached.calculatedAt
          })
          setResults(cached)
          setLoading(false)
          return
        }
        
        console.log(`❌ [MicMacProfessional] No hay cache híbrido, continuando...`)
      } else {
        console.log(`📚 [MicMacProfessional] Método clásico - siempre recalcular (no usar cache)`)
      }
      
      console.log(`🗳️ [MicMacProfessional] Verificando votos...`)
      
      // 2. Verificar votos existentes
      const votes = getProjectVotes(projectId)
      console.log(`🗳️ [MicMacProfessional] Votos encontrados: ${votes.length}`)
      
      if (votes.length === 0) {
        console.log(`🤖 [MicMacProfessional] No hay votos, simulando expertos...`)
        const simResult = await simulateAllExperts(projectId)
        
        if (simResult.success) {
          console.log(`✅ [MicMacProfessional] Simulación exitosa: ${simResult.totalVotes} votos generados`)
        } else {
          console.error(`❌ [MicMacProfessional] Error en simulación:`, simResult.error)
          throw new Error(`Error simulando expertos: ${simResult.error}`)
        }
        
        // Verificar que realmente se crearon los votos
        const votesAfterSim = getProjectVotes(projectId)
        console.log(`🔍 [MicMacProfessional] Votos después de simulación: ${votesAfterSim.length}`)
      }
      
      // 3. Calcular resultados según método seleccionado
      console.log(`🧮 [MicMacProfessional] Iniciando cálculo MIC MAC con método: ${calculationMethod}`)
      
      if (calculationMethod === 'classic') {
        // Método MIC MAC Clásico - usar solo fase INFLUENCE
        console.log(`📚 [MicMacProfessional] Aplicando método CLÁSICO (solo influencia)`)
        const updatedVotes = getProjectVotes(projectId)
        const classicResults = generateClassicMicMacMatrix(updatedVotes, project?.variables || [])
        
        console.log(`✅ [MicMacProfessional] Cálculo clásico exitoso:`, {
          variables: classicResults.variables.length,
          votos: classicResults.totalVotes,
          avgMotricity: classicResults.averageMotricity,
          avgDependence: classicResults.averageDependence,
          metodo: 'Clásico (solo INFLUENCE)'
        })
        
        // Para método clásico, no hay alertas de inconsistencia
        const extendedResults: ExtendedMicMacResults = {
          ...classicResults,
          inconsistencyAlerts: [],
          qualityScore: 100,
          calculationMethod: 'average'
        }
        setResults(extendedResults)
      } else {
        // Método Híbrido - usar método mejorado con detección de inconsistencias
        console.log(`🚀 [MicMacProfessional] Aplicando método HÍBRIDO con detección de inconsistencias`)
        const updatedVotes = getProjectVotes(projectId)
        const improvedResults = generateImprovedMicMacMatrix(
          updatedVotes, 
          project?.variables || [], 
          'average' // Método de cálculo por defecto
        )
        
        console.log(`✅ [MicMacProfessional] Cálculo híbrido mejorado exitoso:`, {
          variables: improvedResults.variables.length,
          votos: improvedResults.totalVotes,
          avgMotricity: improvedResults.averageMotricity,
          avgDependence: improvedResults.averageDependence,
          inconsistencias: improvedResults.inconsistencyAlerts?.length || 0,
          calidad: improvedResults.qualityScore,
          metodo: 'Híbrido con validación cruzada'
        })
        
        // Convertir el resultado mejorado al formato extendido
        const extendedResults: ExtendedMicMacResults = {
          projectId: improvedResults.projectId,
          variables: improvedResults.variables,
          totalVotes: improvedResults.totalVotes,
          calculatedAt: improvedResults.calculatedAt,
          averageMotricity: improvedResults.averageMotricity,
          averageDependence: improvedResults.averageDependence,
          matrixData: improvedResults.matrixData,
          inconsistencyAlerts: improvedResults.inconsistencyAlerts || [],
          qualityScore: improvedResults.qualityScore || 100,
          calculationMethod: improvedResults.calculationMethod || 'average'
        }
        setResults(extendedResults)
      }
      
    } catch (error) {
      console.error('💥 [MicMacProfessional] Error crítico cargando resultados:', error)
      setResults(null)
    } finally {
      console.log(`🏁 [MicMacProfessional] Finalizando carga, loading: false`)
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log(`🚀 [MicMacProfessional] useEffect disparado:`, {
      projectId,
      projectsLength: projects.length,
      expertsLength: experts.length,
      hasProject: !!project
    })
    
    // Verificar que tenemos todos los datos necesarios antes de proceder
    if (projectId && projects.length > 0 && experts.length > 0 && project) {
      console.log(`✅ [MicMacProfessional] Todos los datos disponibles, iniciando carga...`)
      loadResults()
    } else {
      console.log(`⏳ [MicMacProfessional] Esperando datos:`, {
        tieneProjectId: !!projectId,
        proyectosCargados: projects.length,
        expertosCargados: experts.length,
        tieneProject: !!project
      })
      
      // Si no tenemos los datos básicos, marcar como loading
      if (projectId && (!project || projects.length === 0 || experts.length === 0)) {
        setLoading(true)
        setResults(null)
      }
    }
  }, [projectId, projects.length, experts.length, project, calculationMethod])

  // Análisis de expertos
  const expertAnalysis = useMemo(() => {
    if (!results || !project) return []
    
    const votes = getProjectVotes(projectId)
    const expertVoteMap = new Map<string, VotingResponse[]>()
    
    // Agrupar votos por experto
    votes.forEach(vote => {
      if (!expertVoteMap.has(vote.expertId)) {
        expertVoteMap.set(vote.expertId, [])
      }
      expertVoteMap.get(vote.expertId)!.push(vote)
    })
    
    // Analizar cada experto
    return Array.from(expertVoteMap.entries()).map(([expertId, expertVotes]) => {
      const expert = experts.find(e => e.id === expertId)
      if (!expert) return null
      
      const avgConfidence = expertVotes.reduce((sum, v) => sum + (v.confidence || 0), 0) / expertVotes.length
      const avgTimeSpent = expertVotes.reduce((sum, v) => sum + (v.timeSpent || 0), 0) / expertVotes.length
      const totalVotes = expertVotes.length
      
      // Calcular consistencia (qué tan similar es a la media del grupo)
      const consistency = calculateConsistency(expertVotes, votes)
      
      // Calcular influencia del experto en los resultados
      const influence = calculateExpertInfluence(expertVotes, results)
      
      return {
        expert,
        avgConfidence,
        avgTimeSpent,
        totalVotes,
        consistency,
        influence,
        votes: expertVotes
      }
    }).filter((analysis): analysis is NonNullable<typeof analysis> => analysis !== null)
  }, [results, project, experts, projectId])



  const getQuadrantColor = (classification: string) => {
    switch (classification) {
      case 'Variable de Enlace': return '#f59e0b'
      case 'Variable Motriz': return '#ef4444'
      case 'Variable Dependiente': return '#3b82f6'
      case 'Variable Autónoma': return '#10b981'
      default: return '#6b7280'
    }
  }

  const getQuadrantInfo = (classification: string) => {
    switch (classification) {
      case 'Variable de Enlace':
        return { icon: Zap, desc: 'Alta influencia, Alta dependencia - Variables clave del sistema' }
      case 'Variable Motriz':
        return { icon: TrendingUp, desc: 'Alta influencia, Baja dependencia - Variables de entrada' }
      case 'Variable Dependiente':
        return { icon: Target, desc: 'Baja influencia, Alta dependencia - Variables de salida' }
      case 'Variable Autónoma':
        return { icon: Layers, desc: 'Baja influencia, Baja dependencia - Variables desconectadas' }
      default:
        return { icon: Info, desc: 'Sin clasificación' }
    }
  }

  // Estadísticas avanzadas
  const advancedStats = useMemo(() => {
    if (!results) return null
    
    const totalRelations = results.variables.reduce((sum, v) => sum + v.motricity + v.dependence, 0)
    const maxPossible = results.variables.length * (results.variables.length - 1) * 3 * 2
    const density = (totalRelations / maxPossible) * 100
    
    const linkVariables = results.variables.filter(v => v.classification === 'Variable de Enlace').length
    const stability = (linkVariables / results.variables.length) * 100
    
    const connectivity = results.matrixData.flat().filter(v => v > 0).length / 
                        (results.variables.length * results.variables.length - results.variables.length) * 100
    
    return {
      density: density.toFixed(1),
      stability: stability.toFixed(1),
      connectivity: connectivity.toFixed(1),
      totalRelations,
      linkVariables,
      avgMotricity: results.averageMotricity.toFixed(2),
      avgDependence: results.averageDependence.toFixed(2)
    }
  }, [results])

  if (loading) {
    return (
      <div className={`bg-gray-900 rounded-lg border border-gray-700 p-12 ${className}`}>
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
            <Grid className="absolute inset-0 m-auto h-8 w-8 text-blue-500 animate-pulse" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold text-white">Procesando Análisis MIC MAC</h3>
            <p className="text-gray-400 text-sm mt-2">
              {!project ? 'Cargando proyecto...' : 
               'Simulando expertos y calculando matriz de impactos cruzados...'}
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Revisa la consola del navegador (F12) para logs detallados
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Si no tenemos proyecto pero sí projectId, significa que aún se está cargando
  if (projectId && !project) {
    return (
      <div className={`bg-gray-900 rounded-lg border border-gray-700 p-12 ${className}`}>
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
            <Grid className="absolute inset-0 m-auto h-8 w-8 text-blue-500 animate-pulse" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold text-white">Cargando Proyecto</h3>
            <p className="text-gray-400 text-sm mt-2">Inicializando datos del proyecto...</p>
          </div>
        </div>
      </div>
    )
  }

  // Si tenemos proyecto pero no resultados y no estamos cargando, entonces hay un error real
  if (!results && !loading && project) {
    return (
      <div className={`bg-gray-900 rounded-lg border border-gray-700 p-12 ${className}`}>
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Sin datos disponibles</h3>
          <p className="text-gray-400 text-sm mb-4">No se pudieron cargar los resultados MIC MAC</p>
          <button
            onClick={loadResults}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Reintentar Análisis
          </button>
        </div>
      </div>
    )
  }

  // Si no tenemos nada, mostrar estado inicial
  if (!results || !project) {
    return (
      <div className={`bg-gray-900 rounded-lg border border-gray-700 p-12 ${className}`}>
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
            <Grid className="absolute inset-0 m-auto h-8 w-8 text-blue-500 animate-pulse" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold text-white">Inicializando</h3>
            <p className="text-gray-400 text-sm mt-2">Preparando análisis MIC MAC...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header con estadísticas */}
      <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-lg border border-gray-700 p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <Grid className="h-6 w-6 text-white" />
              </div>
              MIC MAC Professional Analysis
            </h1>
            <p className="text-gray-300">
              {project.name} • {results.variables.length} variables • {results.totalVotes} votos procesados
            </p>
            <div className="mt-2 flex items-center gap-2 text-sm">
              <span className="text-gray-400">Método activo:</span>
              {calculationMethod === 'classic' ? (
                <span className="px-2 py-1 bg-amber-900 text-amber-300 rounded font-medium">
                  📚 Clásico (Solo Influencia)
                </span>
              ) : (
                <span className="px-2 py-1 bg-blue-900 text-blue-300 rounded font-medium">
                  🚀 Híbrido (Validación Cruzada)
                </span>
              )}
            </div>
            
            {/* Selector de Método */}
            <div className="mt-4">
              <MicMacMethodSelector
                method={calculationMethod}
                onMethodChange={(newMethod) => {
                  console.log(`🔄 [MicMacProfessional] Cambiando método de ${calculationMethod} a ${newMethod}`)
                  setCalculationMethod(newMethod)
                  setResults(null) // Limpiar resultados inmediatamente
                  setLoading(true) // Mostrar loading
                  // Auto-recalcular cuando cambie el método
                  setTimeout(() => loadResults(), 200)
                }}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => window.print()}
              className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
              title="Imprimir"
            >
              <FileText className="h-5 w-5" />
            </button>
            <button
              onClick={() => {/* Implementar export */}}
              className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
              title="Exportar"
            >
              <Download className="h-5 w-5" />
            </button>
            <button
              onClick={loadResults}
              className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
              title="Actualizar"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Métricas rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-blue-400 mb-1">
              <Activity className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wide">Densidad</span>
            </div>
            <p className="text-2xl font-bold text-white">{advancedStats?.density}%</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-green-400 mb-1">
              <CheckCircle className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wide">Estabilidad</span>
            </div>
            <p className="text-2xl font-bold text-white">{advancedStats?.stability}%</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-yellow-400 mb-1">
              <Zap className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wide">Conectividad</span>
            </div>
            <p className="text-2xl font-bold text-white">{advancedStats?.connectivity}%</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-purple-400 mb-1">
              <Users className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wide">Expertos</span>
            </div>
            <p className="text-2xl font-bold text-white">{expertAnalysis.length}</p>
          </div>
          {calculationMethod === 'hybrid' && results?.qualityScore !== undefined && (
            <div className="bg-gray-800/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                {results.qualityScore >= 90 ? (
                  <CheckCircle className="h-4 w-4 text-green-400" />
                ) : results.qualityScore >= 70 ? (
                  <AlertCircle className="h-4 w-4 text-yellow-400" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-400" />
                )}
                <span className="text-xs uppercase tracking-wide text-gray-400">Calidad</span>
              </div>
              <p className={`text-2xl font-bold ${
                results.qualityScore >= 90 ? 'text-green-400' :
                results.qualityScore >= 70 ? 'text-yellow-400' :
                'text-red-400'
              }`}>
                {results.qualityScore.toFixed(0)}%
              </p>
              {results.inconsistencyAlerts && results.inconsistencyAlerts.length > 0 && (
                <p className="text-xs text-gray-400 mt-1">
                  {results.inconsistencyAlerts.length} alerta{results.inconsistencyAlerts.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="flex border-b border-gray-700">
          {[
            { id: 'analysis' as const, label: 'Análisis', icon: BarChart3 },
            { id: 'matrix' as const, label: 'Matriz', icon: Grid },
            { id: 'experts' as const, label: 'Expertos', icon: Users },
            ...(calculationMethod === 'hybrid' ? [{ 
              id: 'inconsistencies' as const, 
              label: `Inconsistencias${results?.inconsistencyAlerts?.length ? ` (${results.inconsistencyAlerts.length})` : ''}`, 
              icon: AlertCircle 
            }] : []),
            { id: 'advanced' as const, label: 'Avanzado', icon: Settings }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-4 px-6 font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                activeTab === tab.id
                  ? 'bg-gray-700 text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'analysis' && (
            <div className="grid grid-cols-12 gap-6 min-h-[80vh]">
              {/* Gráfico principal - Ocupa más espacio */}
              <div className="col-span-12 xl:col-span-8 bg-gray-900 rounded-lg p-6 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-white">Plano de Influencias y Dependencias</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setZoomLevel(Math.min(2, zoomLevel * 1.1))}
                      className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setZoomLevel(Math.max(0.5, zoomLevel * 0.9))}
                      className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setZoomLevel(1)}
                      className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
                    >
                      <Maximize2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* SVG Chart Mejorado - Ahora responsive y más grande */}
                <div className="relative overflow-hidden rounded-lg bg-gray-950 p-4 flex-1 min-h-[600px]">
                  <svg 
                    width="100%" 
                    height="100%" 
                    viewBox="0 0 600 600"
                    preserveAspectRatio="xMidYMid meet"
                    style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center' }}
                    className="transition-transform duration-300 w-full h-full"
                  >
                    {/* Definiciones */}
                    <defs>
                      <pattern id="grid-pattern" width="25" height="25" patternUnits="userSpaceOnUse">
                        <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#1f2937" strokeWidth="0.5"/>
                      </pattern>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>

                    {/* Fondo con grid */}
                    {showGrid && <rect width="600" height="600" fill="url(#grid-pattern)" />}
                    
                    {/* Cuadrantes coloreados */}
                    <rect x={300} y={0} width={300} height={300} fill="rgba(239, 68, 68, 0.05)" />
                    <rect x={300} y={300} width={300} height={300} fill="rgba(59, 130, 246, 0.05)" />
                    <rect x={0} y={0} width={300} height={300} fill="rgba(245, 158, 11, 0.05)" />
                    <rect x={0} y={300} width={300} height={300} fill="rgba(34, 197, 94, 0.05)" />

                    {/* Líneas de media */}
                    <line 
                      x1={300} 
                      y1={0} 
                      x2={300} 
                      y2={600}
                      stroke="#ef4444" 
                      strokeWidth="3" 
                      strokeDasharray="8,8"
                      opacity="0.6"
                    />
                    <line 
                      x1={0} 
                      y1={300} 
                      x2={600} 
                      y2={300}
                      stroke="#ef4444" 
                      strokeWidth="3" 
                      strokeDasharray="8,8"
                      opacity="0.6"
                    />

                    {/* Ejes */}
                    <line x1={0} y1={600} x2={600} y2={600} stroke="#4b5563" strokeWidth="3"/>
                    <line x1={0} y1={0} x2={0} y2={600} stroke="#4b5563" strokeWidth="3"/>

                    {/* Variables como círculos interactivos */}
                    {results.variables.map((variable, index) => {
                      const maxValue = Math.max(
                        ...results.variables.map(v => Math.max(v.motricity, v.dependence))
                      ) * 1.2
                      const x = (variable.dependence / maxValue) * 580 + 10
                      const y = 590 - (variable.motricity / maxValue) * 580
                      const color = getQuadrantColor(variable.classification)
                      const isSelected = selectedVariable === index
                      
                      return (
                        <g key={variable.variable.id}>
                          {/* Conexión con otros puntos si está seleccionado */}
                          {isSelected && results.variables.map((v2, i2) => {
                            if (i2 === index) return null
                            const x2 = (v2.dependence / maxValue) * 580 + 10
                            const y2 = 590 - (v2.motricity / maxValue) * 580
                            const influence = results.matrixData[index][i2]
                            if (influence === 0) return null
                            
                            return (
                              <line
                                key={`line-${i2}`}
                                x1={x}
                                y1={y}
                                x2={x2}
                                y2={y2}
                                stroke={color}
                                strokeWidth={influence}
                                opacity={0.3}
                              />
                            )
                          })}
                          
                          {/* Círculo principal */}
                          <circle
                            cx={x}
                            cy={y}
                            r={isSelected ? 12 : 8}
                            fill={color}
                            stroke="white"
                            strokeWidth="2"
                            opacity={isSelected ? 1 : 0.8}
                            className="cursor-pointer transition-all hover:opacity-100"
                            onClick={() => setSelectedVariable(isSelected ? null : index)}
                            filter={isSelected ? "url(#glow)" : ""}
                          />
                          
                          {/* Etiqueta */}
                          {(showLabels || isSelected) && (
                            <>
                              <text
                                x={x + 15}
                                y={y - 10}
                                fill="white"
                                fontSize="11"
                                fontWeight="bold"
                                className="pointer-events-none"
                              >
                                {variable.variable.name}
                              </text>
                              <text
                                x={x + 15}
                                y={y + 5}
                                fill="#9ca3af"
                                fontSize="9"
                                className="pointer-events-none"
                              >
                                ({variable.dependence}, {variable.motricity})
                              </text>
                            </>
                          )}
                        </g>
                      )
                    })}

                    {/* Etiquetas de cuadrantes */}
                    <text x={150} y={40} textAnchor="middle" fill="#f59e0b" fontSize="16" fontWeight="bold" opacity="0.7">
                      II - MOTRICES
                    </text>
                    <text x={450} y={40} textAnchor="middle" fill="#ef4444" fontSize="16" fontWeight="bold" opacity="0.7">
                      I - ENLACE
                    </text>
                    <text x={150} y={570} textAnchor="middle" fill="#10b981" fontSize="16" fontWeight="bold" opacity="0.7">
                      III - AUTÓNOMAS
                    </text>
                    <text x={450} y={570} textAnchor="middle" fill="#3b82f6" fontSize="16" fontWeight="bold" opacity="0.7">
                      IV - DEPENDIENTES
                    </text>

                    {/* Etiquetas de ejes */}
                    <text x={300} y={595} textAnchor="middle" fill="#9ca3af" fontSize="18" fontWeight="bold">
                      DEPENDENCIA →
                    </text>
                    <text x={20} y={300} textAnchor="middle" fill="#9ca3af" fontSize="18" fontWeight="bold" transform="rotate(-90, 20, 300)">
                      ← INFLUENCIA
                    </text>
                  </svg>
                </div>

                {/* Leyenda mejorada */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
                  {['Variable Motriz', 'Variable de Enlace', 'Variable Dependiente', 'Variable Autónoma'].map(type => {
                    const info = getQuadrantInfo(type)
                    const Icon = info.icon
                    const count = results.variables.filter(v => v.classification === type).length
                    
                    return (
                      <div key={type} className="bg-gray-800 rounded-lg p-3 hover:bg-gray-700 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: getQuadrantColor(type) }}
                          />
                          <Icon className="h-4 w-4 text-gray-400" />
                          <span className="text-xs font-bold text-white">{type}</span>
                        </div>
                        <p className="text-xs text-gray-400 mb-1">{info.desc}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-white">{count}</span>
                          <span className="text-xs text-gray-500">
                            {((count / results.variables.length) * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Panel lateral - Más compacto */}
              <div className="col-span-12 xl:col-span-4 space-y-4">
                {/* Variable seleccionada */}
                {selectedVariable !== null && (
                  <div className="bg-gray-900 rounded-lg p-4 border-2 border-blue-500">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-base font-bold text-white">Variable Seleccionada</h3>
                      <button
                        onClick={() => setSelectedVariable(null)}
                        className="text-gray-400 hover:text-white"
                      >
                        <XCircle className="h-4 w-4" />
                      </button>
                    </div>
                    {(() => {
                      const variable = results.variables[selectedVariable]
                      const Icon = getQuadrantInfo(variable.classification).icon
                      
                      return (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <div 
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: getQuadrantColor(variable.classification) }}
                            />
                            <Icon className="h-5 w-5 text-gray-400" />
                            <span className="font-bold text-white">{variable.variable.name}</span>
                          </div>
                          
                          {variable.variable.description && (
                            <p className="text-xs text-gray-400 mb-3 line-clamp-2">
                              {variable.variable.description}
                            </p>
                          )}
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-gray-800 rounded-lg p-2">
                              <p className="text-xs text-gray-400 mb-1">Influencia</p>
                              <p className="text-xl font-bold text-blue-400">{variable.motricity}</p>
                              <div className="mt-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-blue-400 transition-all duration-500"
                                  style={{ width: `${(variable.motricity / Math.max(...results.variables.map(v => v.motricity))) * 100}%` }}
                                />
                              </div>
                            </div>
                            <div className="bg-gray-800 rounded-lg p-2">
                              <p className="text-xs text-gray-400 mb-1">Dependencia</p>
                              <p className="text-xl font-bold text-purple-400">{variable.dependence}</p>
                              <div className="mt-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-purple-400 transition-all duration-500"
                                  style={{ width: `${(variable.dependence / Math.max(...results.variables.map(v => v.dependence))) * 100}%` }}
                                />
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-3 pt-3 border-t border-gray-700 space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-400">Clasificación:</span>
                              <span className="font-medium text-white text-xs">{variable.classification.split(' ')[2]}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-400">Ranking:</span>
                              <span className="font-medium text-white">#{variable.rank}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-400">Porcentaje:</span>
                              <span className="font-medium text-white">{variable.percentage.toFixed(1)}%</span>
                            </div>
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                )}

                {/* Ranking de variables */}
                <div className="bg-gray-900 rounded-lg p-4">
                  <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-400" />
                    Ranking de Variables
                  </h3>
                  <div className="space-y-1 max-h-80 overflow-y-auto">
                    {results.variables
                      .sort((a, b) => b.motricity + b.dependence - (a.motricity + a.dependence))
                      .map((variable, index) => (
                        <div
                          key={variable.variable.id}
                          onClick={() => setSelectedVariable(
                            results.variables.findIndex(v => v.variable.id === variable.variable.id)
                          )}
                          className={`p-2 rounded-lg cursor-pointer transition-all ${
                            selectedVariable === results.variables.findIndex(v => v.variable.id === variable.variable.id)
                              ? 'ring-1 ring-blue-500 bg-gray-800' 
                              : 'hover:bg-gray-800'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-gray-500">#{index + 1}</span>
                              <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: getQuadrantColor(variable.classification) }}
                              />
                              <div className="min-w-0 flex-1">
                                <span className="text-sm font-medium text-white truncate block">{variable.variable.name}</span>
                                <div className="text-xs text-gray-400">
                                  I: {variable.motricity} | D: {variable.dependence}
                                </div>
                              </div>
                            </div>
                            <span className="text-xs px-1.5 py-0.5 rounded bg-gray-800 text-gray-300 ml-2">
                              {variable.classification.split(' ')[2] || variable.classification.split(' ')[1]}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'matrix' && (
            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-6">Matriz de Influencias Directas</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="p-2 text-left text-gray-400"></th>
                      {results.variables.map(v => (
                        <th key={v.variable.id} className="p-2 text-center font-medium text-gray-400">
                          {v.variable.name.substring(0, 8)}
                        </th>
                      ))}
                      <th className="p-2 text-center font-bold text-blue-400">Influencia</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.variables.map((variable, i) => (
                      <tr key={variable.variable.id} className="border-t border-gray-800">
                        <td className="p-2 font-medium text-gray-400">
                          {variable.variable.name.substring(0, 8)}
                        </td>
                        {results.matrixData[i].map((value, j) => (
                          <td key={j} className="p-2">
                            <div className={`w-12 h-10 rounded flex items-center justify-center font-bold ${
                              i === j 
                                ? 'bg-gray-800 text-gray-600' 
                                : value === 0 
                                  ? 'bg-gray-800 text-gray-500'
                                  : value === 1 
                                    ? 'bg-yellow-900 text-yellow-300'
                                    : value === 2
                                      ? 'bg-orange-900 text-orange-300'
                                      : 'bg-red-900 text-red-300'
                            }`}>
                              {i === j ? '—' : value}
                            </div>
                          </td>
                        ))}
                        <td className="p-2 text-center font-bold text-blue-400">
                          {variable.motricity}
                        </td>
                      </tr>
                    ))}
                    <tr className="border-t-2 border-gray-700">
                      <td className="p-2 font-bold text-purple-400">Dependencia</td>
                      {results.variables.map(v => (
                        <td key={v.variable.id} className="p-2 text-center font-bold text-purple-400">
                          {v.dependence}
                        </td>
                      ))}
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Escala de colores */}
              <div className="mt-6 flex items-center justify-center gap-6">
                <span className="text-sm font-medium text-gray-400">Escala de Influencia:</span>
                {[
                  { value: 0, label: 'Nula', color: 'bg-gray-800 text-gray-500' },
                  { value: 1, label: 'Débil', color: 'bg-yellow-900 text-yellow-300' },
                  { value: 2, label: 'Media', color: 'bg-orange-900 text-orange-300' },
                  { value: 3, label: 'Fuerte', color: 'bg-red-900 text-red-300' }
                ].map(item => (
                  <div key={item.value} className="flex items-center gap-2">
                    <div className={`w-10 h-10 ${item.color} rounded flex items-center justify-center font-bold`}>
                      {item.value}
                    </div>
                    <span className="text-sm text-gray-300">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'experts' && (
            <div className="space-y-6">
              {/* Resumen de expertos */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-900 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="h-6 w-6 text-blue-400" />
                    <h3 className="text-lg font-bold text-white">Participación de Expertos</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total expertos:</span>
                      <span className="font-bold text-white">{expertAnalysis.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Votos promedio:</span>
                      <span className="font-bold text-white">
                        {(results.totalVotes / expertAnalysis.length).toFixed(0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Confianza media:</span>
                      <span className="font-bold text-white">
                        {(expertAnalysis.reduce((sum, e) => sum + (e?.avgConfidence || 0), 0) / expertAnalysis.length).toFixed(1)}/5
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Brain className="h-6 w-6 text-purple-400" />
                    <h3 className="text-lg font-bold text-white">Calidad del Análisis</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Consistencia:</span>
                      <span className="font-bold text-white">
                        {expertAnalysis.length > 0 ? (expertAnalysis.reduce((sum, e) => sum + (e?.consistency || 0), 0) / expertAnalysis.length).toFixed(1) : '0'}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tiempo promedio:</span>
                      <span className="font-bold text-white">
                        {expertAnalysis.length > 0 ? (expertAnalysis.reduce((sum, e) => sum + (e?.avgTimeSpent || 0), 0) / expertAnalysis.length).toFixed(0) : '0'}s
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Consenso:</span>
                      <span className="font-bold text-green-400">Alto</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Award className="h-6 w-6 text-yellow-400" />
                    <h3 className="text-lg font-bold text-white">Expertise</h3>
                  </div>
                  <div className="space-y-2">
                    {Array.from(new Set(expertAnalysis.flatMap(e => e.expert.expertiseAreas)))
                      .slice(0, 3)
                      .map(area => (
                        <div key={area} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                          <span className="text-sm text-gray-300">{area}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* Lista detallada de expertos */}
              <div className="bg-gray-900 rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-white">Análisis Individual de Expertos</h3>
                  <button
                    onClick={() => setShowExpertInfluence(!showExpertInfluence)}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    {showExpertInfluence ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {showExpertInfluence ? 'Ocultar' : 'Mostrar'} Influencia
                  </button>
                </div>

                <div className="space-y-4">
                  {expertAnalysis
                    .sort((a, b) => b.influence - a.influence)
                    .map((analysis, index) => (
                      <div
                        key={analysis.expert.id}
                        className={`p-4 rounded-lg border transition-all ${
                          selectedExpert === analysis.expert.id
                            ? 'border-blue-500 bg-gray-800'
                            : 'border-gray-700 hover:bg-gray-800'
                        }`}
                        onClick={() => setSelectedExpert(
                          selectedExpert === analysis.expert.id ? null : analysis.expert.id
                        )}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div className="relative">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                {analysis.expert.name.substring(0, 2).toUpperCase()}
                              </div>
                              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center">
                                <span className="text-xs font-bold text-yellow-400">#{index + 1}</span>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-bold text-white">{analysis.expert.name}</h4>
                              <p className="text-sm text-gray-400">{analysis.expert.organization}</p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {analysis.expert.expertiseAreas.slice(0, 3).map(area => (
                                  <span key={area} className="px-2 py-1 bg-gray-800 text-xs text-gray-300 rounded">
                                    {area}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-sm text-gray-400">Influencia</div>
                            <div className="text-2xl font-bold text-blue-400">{analysis.influence.toFixed(0)}%</div>
                          </div>
                        </div>

                        {showExpertInfluence && (
                          <div className="mt-4 pt-4 border-t border-gray-700 grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-xs text-gray-400">Confianza</p>
                              <p className="text-lg font-bold text-white">{analysis.avgConfidence.toFixed(1)}/5</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">Consistencia</p>
                              <p className="text-lg font-bold text-white">{analysis.consistency.toFixed(0)}%</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">Tiempo/voto</p>
                              <p className="text-lg font-bold text-white">{analysis.avgTimeSpent.toFixed(0)}s</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">Total votos</p>
                              <p className="text-lg font-bold text-white">{analysis.totalVotes}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'inconsistencies' && calculationMethod === 'hybrid' && (
            <div className="space-y-6">
              <InconsistencyAlertsPanel
                alerts={results?.inconsistencyAlerts || []}
                qualityScore={results?.qualityScore}
                className="w-full"
                votes={getProjectVotes(projectId)}
                experts={experts}
                variables={project?.variables.map(v => ({ id: v.id, name: v.name })) || []}
              />
              
              {/* Información adicional sobre la validación cruzada */}
              <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-6">
                <h3 className="text-lg font-bold text-blue-400 mb-4 flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Acerca de la Validación Cruzada
                </h3>
                <div className="space-y-4 text-sm text-blue-200">
                  <p>
                    El método híbrido utiliza <strong>validación cruzada</strong> para detectar inconsistencias 
                    entre las evaluaciones de influencia y dependencia. Esto permite identificar relaciones 
                    donde los expertos tienen perspectivas muy diferentes.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-800/30 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-300 mb-2">¿Cómo funciona?</h4>
                      <ul className="space-y-2 text-xs">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-400 font-bold">1.</span>
                          <span>Se compara cada voto de influencia (A→B) con su correspondiente de dependencia (B←A)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-400 font-bold">2.</span>
                          <span>Diferencias > 1 punto se marcan como inconsistencias</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-400 font-bold">3.</span>
                          <span>Se calcula un promedio ponderado para minimizar el impacto</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-blue-800/30 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-300 mb-2">Interpretación</h4>
                      <ul className="space-y-2 text-xs">
                        <li className="flex items-start gap-2">
                          <span className="text-red-400 font-bold">•</span>
                          <span><strong>Críticas (>2.0):</strong> Diferencias conceptuales importantes</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-yellow-400 font-bold">•</span>
                          <span><strong>Moderadas (1.5-2.0):</strong> Perspectivas ligeramente diferentes</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-400 font-bold">•</span>
                          <span><strong>Leves (1.0-1.5):</strong> Variaciones normales de criterio</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-blue-800/30 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-300 mb-2">Puntuación de Calidad Actual</h4>
                    <div className="flex items-center justify-between">
                      <span>
                        {results?.qualityScore !== undefined ? (
                          `${results.qualityScore.toFixed(1)}% - ${
                            results.qualityScore >= 90 ? 'Excelente consistencia' :
                            results.qualityScore >= 70 ? 'Buena consistencia' :
                            results.qualityScore >= 50 ? 'Consistencia aceptable' :
                            'Consistencia mejorable'
                          }`
                        ) : 'Calculando...'}
                      </span>
                      <div className={`px-3 py-1 rounded text-xs font-bold ${
                        (results?.qualityScore || 0) >= 90 ? 'bg-green-900 text-green-300' :
                        (results?.qualityScore || 0) >= 70 ? 'bg-yellow-900 text-yellow-300' :
                        'bg-red-900 text-red-300'
                      }`}>
                        {results?.calculationMethod === 'average' ? 'Promedio' :
                         results?.calculationMethod === 'maximum' ? 'Máximo' :
                         results?.calculationMethod === 'weighted' ? 'Ponderado' : 'Híbrido'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'advanced' && (
            <div className="space-y-6">
              {/* Configuraciones avanzadas */}
              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-blue-400" />
                  Configuración de Visualización
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={showGrid}
                        onChange={(e) => setShowGrid(e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-white">Mostrar cuadrícula</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={showLabels}
                        onChange={(e) => setShowLabels(e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-white">Mostrar etiquetas siempre</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={animateChart}
                        onChange={(e) => setAnimateChart(e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-white">Animaciones</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={showExpertInfluence}
                        onChange={(e) => setShowExpertInfluence(e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-white">Mostrar influencia de expertos</span>
                    </label>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Umbral de confianza mínima
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={confidenceThreshold}
                        onChange={(e) => setConfidenceThreshold(parseInt(e.target.value))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>1</span>
                        <span className="font-bold text-white">{confidenceThreshold}</span>
                        <span>5</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Información del método */}
              <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-400" />
                  Acerca del Método MIC MAC
                </h3>
                <p className="text-sm text-gray-300 mb-4">
                  El método MIC MAC (Matriz de Impactos Cruzados - Multiplicación Aplicada a una Clasificación) 
                  fue desarrollado por Michel Godet en 1971. Es una herramienta de análisis estructural que 
                  permite identificar las variables clave de un sistema mediante el estudio de sus relaciones 
                  de influencia y dependencia.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-3">Fórmulas principales:</h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">•</span>
                        <span>Influencia = Σ(fila) excluyendo diagonal</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">•</span>
                        <span>Dependencia = Σ(columna) excluyendo diagonal</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">•</span>
                        <span>Valores: 0 (nula), 1 (débil), 2 (media), 3 (fuerte)</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-3">Interpretación:</h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="text-red-400">•</span>
                        <span><strong>Motrices:</strong> Variables de entrada del sistema</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-400">•</span>
                        <span><strong>Enlace:</strong> Variables estratégicas clave</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">•</span>
                        <span><strong>Dependientes:</strong> Variables resultado</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-400">•</span>
                        <span><strong>Autónomas:</strong> Variables poco conectadas</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Explicación comparativa de métodos */}
              <MicMacMethodExplanation currentMethod={calculationMethod} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
