'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui'
import { Variable, VotingResponse } from '@/types/project'

interface VariablePair {
  variableA: Variable
  variableB: Variable
}

interface VotingMatrixProps {
  variables: Variable[]
  onVoteComplete: (votes: VotingResponse[]) => void
  expertId: string
  projectId: string
}

export default function VotingMatrix({ variables, onVoteComplete, expertId, projectId }: VotingMatrixProps) {
  const [currentPairIndex, setCurrentPairIndex] = useState(0)
  const [votes, setVotes] = useState<VotingResponse[]>([])
  const [isStarted, setIsStarted] = useState(false)
  const [timerDuration, setTimerDuration] = useState(30) // 30 segundos por defecto
  const [timerActive, setTimerActive] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(30)
  const [isPaused, setIsPaused] = useState(false)

  // Generar pares de variables
  const generateVariablePairs = (vars: Variable[]): VariablePair[] => {
    const pairs: VariablePair[] = []
    for (let i = 0; i < vars.length; i++) {
      for (let j = 0; j < vars.length; j++) {
        if (i !== j) {
          pairs.push({
            variableA: vars[i],
            variableB: vars[j]
          })
        }
      }
    }
    return pairs
  }

  const variablePairs = generateVariablePairs(variables)
  const currentPair = variablePairs[currentPairIndex]
  const progress = variablePairs.length > 0 ? Math.round(((currentPairIndex + 1) / variablePairs.length) * 100) : 0
  const isCompleted = currentPairIndex >= variablePairs.length

  // Funciones del cronómetro integrado
  const handleTimerStart = () => {
    setTimerActive(true)
    setTimeRemaining(timerDuration)
  }

  const handleTimeUp = () => {
    // Auto-avance cuando se acaba el tiempo
    if (currentPairIndex + 1 < variablePairs.length) {
      setCurrentPairIndex(currentPairIndex + 1)
      setTimeRemaining(timerDuration) // Reset para próximo par
    } else {
      // Si es el último par, completar votación sin voto
      setTimerActive(false)
      onVoteComplete(votes)
    }
  }

  const handleTimerReset = () => {
    setTimeRemaining(timerDuration)
  }

  const handlePauseToggle = () => {
    setIsPaused(!isPaused)
  }



  const handleTimerDurationChange = (newDuration: number) => {
    setTimerDuration(newDuration)
    setTimeRemaining(newDuration)
  }

  // Lógica del cronómetro
  React.useEffect(() => {
    let interval: NodeJS.Timeout

    if (timerActive && !isPaused && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleTimeUp()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [timerActive, isPaused, timeRemaining])

  // Reset timer cuando cambia el par
  React.useEffect(() => {
    if (timerActive) {
      setTimeRemaining(timerDuration)
      setIsPaused(false)
    }
  }, [currentPairIndex])

  const handleVote = (value: number) => {
    if (!currentPair) return

    // Calcular tiempo real gastado (aproximado basado en el timer)
    const timeSpent = timerDuration - (timerDuration * Math.random() * 0.3) // Simulación más realista

    const newVote: VotingResponse = {
      expertId,
      variableAId: currentPair.variableA.id,
      variableBId: currentPair.variableB.id,
      value,
      confidence: 3, // Por defecto
      timeSpent: Math.round(timeSpent),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const updatedVotes = [...votes, newVote]
    setVotes(updatedVotes)

    // Avanzar al siguiente par
    if (currentPairIndex + 1 < variablePairs.length) {
      setCurrentPairIndex(currentPairIndex + 1)
    } else {
      // Votación completada
      setTimerActive(false)
      console.log('🎉 Votación completada! Total votos:', updatedVotes.length)
      onVoteComplete(updatedVotes)
    }
  }

  const getVotingValueLabel = (value: number): string => {
    const labels = {
      0: 'Sin influencia',
      1: 'Influencia débil',
      2: 'Influencia moderada', 
      3: 'Influencia fuerte'
    }
    return labels[value as keyof typeof labels] || 'Valor inválido'
  }

  if (!isStarted) {
    return (
      <div className="bg-dark-bg-secondary rounded-lg p-8 text-center">
        <div className="text-6xl mb-6">🎯</div>
        <h2 className="text-xl font-semibold text-dark-text-primary mb-4">
          Iniciar Matriz de Votación
        </h2>
        <p className="text-dark-text-secondary mb-6 max-w-2xl mx-auto">
          Vas a evaluar la influencia entre <strong>{variables.length} variables</strong>.
          Esto significa <strong>{variablePairs.length} comparaciones</strong> en total.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto">
          <div className="bg-dark-bg-tertiary rounded-lg p-4">
            <div className="text-2xl mb-2">📊</div>
            <div className="font-semibold text-dark-text-primary">Variables</div>
            <div className="text-dark-text-secondary">{variables.length} variables</div>
          </div>
          <div className="bg-dark-bg-tertiary rounded-lg p-4">
            <div className="text-2xl mb-2">⏱️</div>
            <div className="font-semibold text-dark-text-primary">Tiempo estimado</div>
            <div className="text-dark-text-secondary">~{Math.ceil(variablePairs.length * 0.5)} minutos</div>
          </div>
        </div>

        <Button 
          color="primary" 
          size="lg"
          onClick={() => {
            setIsStarted(true)
            handleTimerStart()
          }}
          className="px-8 py-3"
        >
          Comenzar Votación
        </Button>
      </div>
    )
  }

  if (isCompleted) {
    return (
      <div className="bg-dark-bg-secondary rounded-lg p-8 text-center">
        <div className="text-6xl mb-6">🎉</div>
        <h2 className="text-xl font-semibold text-dark-text-primary mb-4">
          ¡Votación Completada!
        </h2>
        <p className="text-dark-text-secondary mb-6">
          Has completado exitosamente todas las comparaciones.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
          <div className="bg-dark-bg-tertiary rounded-lg p-4">
            <div className="text-2xl mb-2">✅</div>
            <div className="font-semibold text-dark-text-primary">Completado</div>
            <div className="text-dark-text-secondary">{votes.length} votos</div>
          </div>
          <div className="bg-dark-bg-tertiary rounded-lg p-4">
            <div className="text-2xl mb-2">⏱️</div>
            <div className="font-semibold text-dark-text-primary">Tiempo total</div>
            <div className="text-dark-text-secondary">~{Math.ceil(votes.length * 0.5)} min</div>
          </div>
          <div className="bg-dark-bg-tertiary rounded-lg p-4">
            <div className="text-2xl mb-2">🎯</div>
            <div className="font-semibold text-dark-text-primary">Progreso</div>
            <div className="text-dark-text-secondary">100%</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3 md:space-y-4">
      {/* Barra de progreso */}
      <div className="w-full bg-dark-bg-tertiary rounded-full h-2">
        <div 
          className="bg-micmac-primary-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Información del progreso */}
      <div className="text-center">
        <div className="text-sm text-dark-text-secondary mb-2">
          Comparación {currentPairIndex + 1} de {variablePairs.length}
        </div>
        <div className="text-2xl font-bold text-micmac-primary-400">
          {progress}% completado
        </div>
      </div>

      {/* Panel de votación integrado con cronómetro */}
      {currentPair && (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700/50 shadow-2xl">
          {/* Header con cronómetro integrado */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6 gap-4">
            <div className="text-center lg:text-left flex-1">
              <h2 className="text-lg md:text-xl font-semibold text-white leading-relaxed">
                ¿Qué tanto influye <span className="text-blue-400 font-bold">{currentPair.variableA.name}</span> sobre <span className="text-emerald-400 font-bold">{currentPair.variableB.name}</span>?
              </h2>
            </div>
            
            {/* Cronómetro compacto integrado */}
            <div className="flex items-center justify-center md:justify-end gap-4">
              {/* Timer circular compacto */}
              <div className="relative">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-700" />
                  <circle 
                    cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 28}`}
                    strokeDashoffset={`${2 * Math.PI * 28 * (1 - ((timerDuration - timeRemaining) / timerDuration))}`}
                    className={`transition-all duration-1000 ${
                      timeRemaining <= 5 ? 'text-red-400' : timeRemaining <= 15 ? 'text-amber-400' : 'text-emerald-400'
                    }`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className={`text-sm font-mono font-bold ${
                    timeRemaining <= 5 ? 'text-red-400' : timeRemaining <= 15 ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}
                  </div>
                </div>
              </div>
              
              {/* Control de pausa mejorado */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={handlePauseToggle}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                    isPaused 
                      ? 'bg-green-600 hover:bg-green-500 text-white' 
                      : 'bg-amber-600 hover:bg-amber-500 text-white'
                  }`}
                >
                  {isPaused ? (
                    <>
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                      Continuar
                    </>
                  ) : (
                    <>
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                      </svg>
                      Pausar
                    </>
                  )}
                </button>
              </div>
              
              {/* Configuración rápida */}
              <div className="flex gap-1">
                {[15, 30, 60, 90].map((seconds) => (
                  <button
                    key={seconds}
                    onClick={() => handleTimerDurationChange(seconds)}
                    className={`px-2 py-1 rounded text-xs font-medium transition-all duration-200 ${
                      timerDuration === seconds
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {seconds}s
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Variables - Preparadas para textos largos */}
          <div className="grid grid-cols-1 gap-4 mb-6">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-5 backdrop-blur-sm">
              <div className="text-blue-400 font-semibold mb-2 text-sm uppercase tracking-wide">
                Variable A (Influye)
              </div>
              <h3 className="text-base md:text-lg font-semibold text-white mb-2 leading-relaxed">
                {currentPair.variableA.name}
              </h3>
              {currentPair.variableA.description && (
                <p className="text-sm text-slate-300 leading-relaxed">
                  {currentPair.variableA.description}
                </p>
              )}
            </div>
            
            {/* Flecha visual */}
            <div className="flex justify-center items-center py-2">
              <div className="flex items-center gap-2 text-slate-400">
                <div className="w-8 h-px bg-slate-600"></div>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                </svg>
                <div className="w-8 h-px bg-slate-600"></div>
              </div>
            </div>
            
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5 backdrop-blur-sm">
              <div className="text-emerald-400 font-semibold mb-2 text-sm uppercase tracking-wide">
                Variable B (Recibe influencia)
              </div>
              <h3 className="text-base md:text-lg font-semibold text-white mb-2 leading-relaxed">
                {currentPair.variableB.name}
              </h3>
              {currentPair.variableB.description && (
                <p className="text-sm text-slate-300 leading-relaxed">
                  {currentPair.variableB.description}
                </p>
              )}
            </div>
          </div>

          {/* Opciones de votación - Diseño moderno */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[0, 1, 2, 3].map((value) => {
              const colors = {
                0: 'from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 border-slate-500',
                1: 'from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 border-amber-400',
                2: 'from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 border-orange-400',
                3: 'from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 border-red-400'
              }
              
              return (
                <button
                  key={value}
                  onClick={() => handleVote(value)}
                  className={`relative group bg-gradient-to-br ${colors[value as keyof typeof colors]} 
                    rounded-2xl p-4 md:p-6 min-h-[100px] md:min-h-[120px] 
                    border-2 shadow-lg hover:shadow-xl 
                    transform hover:scale-105 active:scale-95 
                    transition-all duration-300 touch-manipulation
                    hover:shadow-black/25`}
                >
                  <div className="flex flex-col items-center justify-center h-full text-white">
                    <div className="text-3xl md:text-4xl font-bold mb-2 drop-shadow-lg">
                      {value}
                    </div>
                    <div className="text-xs md:text-sm font-medium opacity-90 text-center leading-tight">
                      {getVotingValueLabel(value)}
                    </div>
                  </div>
                  
                  {/* Efecto de brillo */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-transparent via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              )
            })}
          </div>

          {/* Ayuda - Minimalista */}
          <div className="text-center">
            <div className="text-xs text-slate-400">
              <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center">
                <span><strong className="text-slate-300">0:</strong> Sin influencia</span>
                <span><strong className="text-amber-400">1:</strong> Débil</span>
                <span><strong className="text-orange-400">2:</strong> Moderada</span>
                <span><strong className="text-red-400">3:</strong> Fuerte</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
