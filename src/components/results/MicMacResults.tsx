'use client'

import { useState, useEffect } from 'react'
import { useMockData } from '@/contexts/MockDataContext'
import MicMacChart from './MicMacChart'
import type { MicMacResults as MicMacResultsType } from '@/types/project'

interface MicMacResultsProps {
  projectId: string
  className?: string
}

export default function MicMacResults({ projectId, className = '' }: MicMacResultsProps) {
  const [results, setResults] = useState<MicMacResultsType | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const { calculateMicMacResults, getMicMacResults, getProjectVotes, simulateAllExperts } = useMockData()

  const loadResults = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Intentar obtener resultados cacheados primero
      const cached = getMicMacResults(projectId)
      if (cached) {
        setResults(cached)
        setLoading(false)
        return
      }
      
      // Verificar si hay votos
      const votes = getProjectVotes(projectId)
      if (votes.length === 0) {
        // Simular expertos si no hay votos
        console.log('🤖 No hay votos, simulando expertos...')
        const simResult = await simulateAllExperts(projectId)
        if (!simResult.success) {
          throw new Error(`Error simulando expertos: ${simResult.error}`)
        }
      }
      
      // Calcular resultados
      const result = await calculateMicMacResults(projectId)
      if (!result.success) {
        throw new Error(`Error calculando resultados: ${result.error}`)
      }
      
      setResults(result.data!)
      
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMsg)
      console.error('❌ Error cargando resultados MIC MAC:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (projectId) {
      loadResults()
    }
  }, [projectId])

  if (loading) {
    return (
      <div className={`bg-gray-900 rounded-lg border border-gray-700 p-8 ${className}`}>
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white">🧮 Calculando MIC MAC</h3>
            <p className="text-gray-400 text-sm mt-1">Procesando votos y generando matriz...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`bg-gray-900 rounded-lg border border-gray-700 p-8 ${className}`}>
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">❌</div>
          <h3 className="text-lg font-semibold text-white mb-2">Error al calcular resultados</h3>
          <p className="text-gray-400 text-sm mb-4">{error}</p>
          <button
            onClick={loadResults}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            🔄 Reintentar
          </button>
        </div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className={`bg-gray-900 rounded-lg border border-gray-700 p-8 ${className}`}>
        <div className="text-center">
          <div className="text-gray-500 text-4xl mb-4">📊</div>
          <h3 className="text-lg font-semibold text-white mb-2">Sin resultados disponibles</h3>
          <p className="text-gray-400 text-sm mb-4">No se encontraron cálculos MIC MAC para este proyecto</p>
          <button
            onClick={loadResults}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            📈 Calcular Resultados
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Gráfico Principal */}
      <MicMacChart results={results} />
      
      {/* Tabla de Variables */}
      <div className="bg-gray-900 rounded-lg border border-gray-700 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">📋 Análisis Detallado por Variable</h3>
          <button
            onClick={loadResults}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm font-medium transition-colors"
          >
            🔄 Actualizar
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-2 text-gray-400 font-medium">Rank</th>
                <th className="text-left py-3 px-2 text-gray-400 font-medium">Variable</th>
                <th className="text-center py-3 px-2 text-gray-400 font-medium">Motricidad</th>
                <th className="text-center py-3 px-2 text-gray-400 font-medium">Dependencia</th>
                <th className="text-center py-3 px-2 text-gray-400 font-medium">Coordenadas</th>
                <th className="text-left py-3 px-2 text-gray-400 font-medium">Clasificación</th>
              </tr>
            </thead>
            <tbody>
              {results.variables.map((variable) => (
                <tr key={variable.variable.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                  <td className="py-3 px-2">
                    <span className="text-white font-mono">#{variable.rank}</span>
                  </td>
                  <td className="py-3 px-2">
                    <div>
                      <div className="font-medium text-white">{variable.variable.name}</div>
                      {variable.variable.description && (
                        <div className="text-xs text-gray-400 mt-1 line-clamp-2">
                          {variable.variable.description.substring(0, 100)}...
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="text-center py-3 px-2">
                    <span className="text-white font-mono text-lg">{variable.motricity}</span>
                  </td>
                  <td className="text-center py-3 px-2">
                    <span className="text-white font-mono text-lg">{variable.dependence}</span>
                  </td>
                  <td className="text-center py-3 px-2">
                    <span className="text-gray-300 font-mono text-sm">
                      ({variable.coordinates[0]}, {variable.coordinates[1]})
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      variable.classification === 'Variable de Enlace' ? 'bg-yellow-900 text-yellow-300' :
                      variable.classification === 'Variable Motriz' ? 'bg-red-900 text-red-300' :
                      variable.classification === 'Variable Dependiente' ? 'bg-blue-900 text-blue-300' :
                      'bg-green-900 text-green-300'
                    }`}>
                      {variable.classification}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Matriz de Influencias */}
      <div className="bg-gray-900 rounded-lg border border-gray-700 p-6">
        <h3 className="text-xl font-semibold text-white mb-4">🎯 Matriz de Influencias Directas</h3>
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            <div className="grid gap-1 text-center text-xs font-mono" 
                 style={{ gridTemplateColumns: `repeat(${results.variables.length + 1}, minmax(60px, 1fr))` }}>
              
              {/* Header */}
              <div className="font-bold text-gray-400 p-2">VAR</div>
              {results.variables.map(v => (
                <div key={`header-${v.variable.id}`} className="font-bold text-gray-400 p-2">
                  {v.variable.name.substring(0, 8)}
                </div>
              ))}
              
              {/* Matriz */}
              {results.matrixData.map((row, i) => (
                <>
                  <div key={`row-label-${i}`} className="font-bold text-gray-400 p-2">
                    {results.variables[i].variable.name.substring(0, 8)}
                  </div>
                  {row.map((cell, j) => (
                    <div 
                      key={`cell-${i}-${j}`} 
                      className={`p-2 rounded ${
                        i === j 
                          ? 'bg-gray-700 text-gray-500' // Diagonal
                          : cell === 0 
                            ? 'bg-gray-800 text-gray-400'
                            : cell === 1 
                              ? 'bg-blue-900 text-blue-300'
                              : cell === 2
                                ? 'bg-yellow-900 text-yellow-300'
                                : 'bg-red-900 text-red-300'
                      }`}
                    >
                      {i === j ? '—' : cell}
                    </div>
                  ))}
                </>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-xs text-gray-400">
          <p><strong>Leyenda:</strong> 0 = Sin influencia, 1 = Débil, 2 = Moderada, 3 = Fuerte</p>
        </div>
      </div>
    </div>
  )
}
