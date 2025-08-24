'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui'

interface VotingTimerProps {
  duration: number // Duración en segundos
  isActive: boolean
  onTimeUp: () => void
  onReset?: () => void
  currentPair: number
  totalPairs: number
  autoAdvance?: boolean
}

export default function VotingTimer({ 
  duration, 
  isActive, 
  onTimeUp, 
  onReset,
  currentPair,
  totalPairs,
  autoAdvance = true
}: VotingTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(duration)
  const [isPaused, setIsPaused] = useState(false)

  // Resetear timer cuando cambia el par actual
  useEffect(() => {
    setTimeRemaining(duration)
    setIsPaused(false)
  }, [currentPair, duration])

  // Lógica del cronómetro
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isActive && !isPaused && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Tiempo agotado
            if (autoAdvance) {
              onTimeUp()
            }
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
  }, [isActive, isPaused, timeRemaining, onTimeUp, autoAdvance])

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getProgressPercentage = (): number => {
    return ((duration - timeRemaining) / duration) * 100
  }

  const getTimerColor = (): string => {
    if (timeRemaining <= 5) return 'text-red-400'
    if (timeRemaining <= 15) return 'text-amber-400'
    return 'text-emerald-400'
  }

  const getProgressColor = (): string => {
    if (timeRemaining <= 5) return 'bg-red-500'
    if (timeRemaining <= 15) return 'bg-amber-500'
    return 'bg-emerald-500'
  }

  const handlePauseToggle = () => {
    setIsPaused(!isPaused)
  }

  const handleSkip = () => {
    onTimeUp()
  }

  const handleReset = () => {
    setTimeRemaining(duration)
    setIsPaused(false)
    onReset?.()
  }

  if (!isActive) {
    return null
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700/50 shadow-2xl backdrop-blur-sm w-full max-w-md mx-auto">
      {/* Header del timer */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm font-medium text-slate-300">
          Par {currentPair + 1} de {totalPairs}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePauseToggle}
            className="w-8 h-8 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-all duration-200 hover:scale-105"
          >
            {isPaused ? '▶️' : '⏸️'}
          </button>
          <button
            onClick={handleSkip}
            className="w-8 h-8 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-all duration-200 hover:scale-105"
          >
            ⏭️
          </button>
          <button
            onClick={handleReset}
            className="w-8 h-8 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-all duration-200 hover:scale-105"
          >
            🔄
          </button>
        </div>
      </div>

      {/* Timer principal con diseño espectacular */}
      <div className="relative flex items-center justify-center mb-6">
        {/* Círculo de progreso grande */}
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 128 128">
            {/* Círculo de fondo */}
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-slate-700"
            />
            {/* Círculo de progreso */}
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 56}`}
              strokeDashoffset={`${2 * Math.PI * 56 * (1 - getProgressPercentage() / 100)}`}
              className={`transition-all duration-1000 ${getProgressColor().replace('bg-', 'text-')} drop-shadow-lg`}
              strokeLinecap="round"
            />
          </svg>
          
          {/* Contenido central */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className={`text-3xl font-mono font-bold mb-1 ${getTimerColor()}`}>
              {formatTime(timeRemaining)}
            </div>
            <div className="text-xs text-slate-400 uppercase tracking-wider">
              {isPaused ? 'Pausado' : 'Restante'}
            </div>
          </div>
        </div>
      </div>

      {/* Mensajes de estado */}
      {timeRemaining <= 5 && timeRemaining > 0 && (
        <div className="text-center">
          <div className="text-xs text-red-400 animate-pulse">
            ⚠️ ¡Tiempo casi agotado!
          </div>
        </div>
      )}

      {timeRemaining === 0 && (
        <div className="text-center">
          <div className="text-xs text-red-400 font-semibold">
            ⏰ Tiempo agotado
          </div>
          {autoAdvance && (
            <div className="text-xs text-dark-text-secondary mt-1">
              Avanzando automáticamente...
            </div>
          )}
        </div>
      )}

      {/* Configuración rápida moderna */}
      <div className="pt-4 border-t border-slate-700/50">
        <div className="text-xs text-slate-400 mb-3 text-center uppercase tracking-wider">
          Tiempo por par
        </div>
        <div className="flex gap-2 justify-center">
          {[15, 30, 60, 90].map((seconds) => (
            <button
              key={seconds}
              onClick={() => {
                setTimeRemaining(seconds)
                onReset?.()
              }}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                duration === seconds
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {seconds}s
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
