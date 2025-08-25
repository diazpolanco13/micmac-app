'use client'

import React from 'react'
import { Settings } from 'lucide-react'

interface MicMacMethodSelectorProps {
  method: 'classic' | 'hybrid'
  onMethodChange: (method: 'classic' | 'hybrid') => void
  className?: string
}

export default function MicMacMethodSelector({ 
  method, 
  onMethodChange, 
  className = '' 
}: MicMacMethodSelectorProps) {
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Settings className="h-4 w-4 text-gray-400" />
      <select
        value={method}
        onChange={(e) => {
          const newMethod = e.target.value as 'classic' | 'hybrid'
          console.log(`🔄 [MicMacMethodSelector] Cambiando método a: ${newMethod}`)
          onMethodChange(newMethod)
        }}
        className="px-3 py-1 bg-gray-800 text-white rounded border border-gray-600 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="hybrid">🚀 Híbrido (2 Fases)</option>
        <option value="classic">📚 Clásico (Solo Influencia)</option>
      </select>
      
      {/* Indicador visual del método */}
      <div className="ml-2 px-2 py-1 rounded text-xs font-medium">
        {method === 'classic' ? (
          <span className="bg-amber-900 text-amber-300">
            📚 Godet Original
          </span>
        ) : (
          <span className="bg-blue-900 text-blue-300">
            🚀 Validación Cruzada
          </span>
        )}
      </div>
    </div>
  )
}
