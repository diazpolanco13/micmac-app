'use client'

import { useState } from 'react'
import { Button } from '@/components/ui'
import { Variable } from '@/types/project'

interface VotingCellProps {
  variableA: Variable
  variableB: Variable
  onVote: (value: number) => void
  currentValue?: number
  disabled?: boolean
}

export default function VotingCell({ 
  variableA, 
  variableB, 
  onVote, 
  currentValue,
  disabled = false 
}: VotingCellProps) {
  const [selectedValue, setSelectedValue] = useState<number | null>(currentValue ?? null)

  const handleVote = (value: number) => {
    setSelectedValue(value)
    onVote(value)
  }

  const getVotingValueLabel = (value: number): string => {
    const labels = {
      0: 'Sin influencia',
      1: 'Débil',
      2: 'Moderada', 
      3: 'Fuerte'
    }
    return labels[value as keyof typeof labels] || 'Inválido'
  }

  const getValueColor = (value: number): string => {
    const colors = {
      0: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      1: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      2: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      3: 'bg-red-500/20 text-red-400 border-red-500/30'
    }
    return colors[value as keyof typeof colors] || 'bg-gray-500/20 text-gray-400'
  }

  return (
    <div className="bg-dark-bg-secondary rounded-lg p-6 border border-dark-bg-tertiary">
      {/* Variables involucradas */}
      <div className="mb-6">
        <div className="text-center mb-4">
          <div className="text-sm text-dark-text-secondary mb-2">
            Influencia de
          </div>
          <div className="text-micmac-primary-400 font-semibold text-lg mb-2">
            {variableA.name}
          </div>
          <div className="text-dark-text-secondary text-sm mb-2">sobre</div>
          <div className="text-micmac-secondary-400 font-semibold text-lg">
            {variableB.name}
          </div>
        </div>
      </div>

      {/* Opciones de votación */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {[0, 1, 2, 3].map((value) => (
          <Button
            key={value}
            size="sm"
            {...(selectedValue === value ? { color: "primary" } : { outline: true })}
            onClick={() => handleVote(value)}
            disabled={disabled}
            className={`h-auto py-3 px-2 text-center transition-all ${
              selectedValue === value 
                ? getValueColor(value)
                : 'hover:bg-micmac-primary-500/10 hover:border-micmac-primary-500/30'
            }`}
          >
            <div>
              <div className="text-xl font-bold mb-1">{value}</div>
              <div className="text-xs">
                {getVotingValueLabel(value)}
              </div>
            </div>
          </Button>
        ))}
      </div>

      {/* Valor seleccionado */}
      {selectedValue !== null && (
        <div className="text-center">
          <div className="text-xs text-dark-text-secondary">
            Seleccionado: <span className="font-semibold">{getVotingValueLabel(selectedValue)}</span>
          </div>
        </div>
      )}
    </div>
  )
}
