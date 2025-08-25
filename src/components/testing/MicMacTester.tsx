'use client'

import { useState } from 'react'
import { useMockData } from '@/contexts/MockDataContext'
import type { MicMacResults } from '@/types/project'

export default function MicMacTester() {
  const [results, setResults] = useState<MicMacResults | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const { calculateMicMacResults, simulateAllExperts, getProjectVotes } = useMockData()

  const testSystem = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // 1. Simular expertos si no hay votos
      const existingVotes = getProjectVotes('proj-geopolitico')
      console.log(`📊 Votos existentes: ${existingVotes.length}`)
      
      if (existingVotes.length === 0) {
        console.log('🤖 Simulando expertos...')
        const simResult = await simulateAllExperts('proj-geopolitico')
        if (!simResult.success) {
          throw new Error(`Error simulando: ${simResult.error}`)
        }
        console.log(`✅ Simulación completada: ${simResult.totalVotes} votos`)
      }
      
      // 2. Calcular resultados MIC MAC
      console.log('🧮 Calculando MIC MAC...')
      const calcResult = await calculateMicMacResults('proj-geopolitico')
      
      if (!calcResult.success) {
        throw new Error(`Error calculando: ${calcResult.error}`)
      }
      
      console.log('✅ Cálculo MIC MAC completado:', calcResult.data)
      setResults(calcResult.data!)
      
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMsg)
      console.error('❌ Error en testing:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 bg-gray-900 rounded-lg border border-gray-700 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-4">🧪 Testing Motor MIC MAC</h2>
      
      <button
        onClick={testSystem}
        disabled={loading}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg font-medium mb-6"
      >
        {loading ? '⏳ Procesando...' : '🚀 Probar Sistema Completo'}
      </button>
      
      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg mb-6">
          <strong>❌ Error:</strong> {error}
        </div>
      )}
      
      {results && (
        <div className="space-y-6">
          <div className="bg-green-900/30 border border-green-700 text-green-300 p-4 rounded-lg">
            <strong>✅ ¡Sistema funcionando perfectamente!</strong>
            <div className="mt-2 text-sm">
              <div>📊 Variables analizadas: {results.variables.length}</div>
              <div>🗳️ Total votos procesados: {results.totalVotes}</div>
              <div>📈 Motricidad promedio: {results.averageMotricity.toFixed(2)}</div>
              <div>📉 Dependencia promedio: {results.averageDependence.toFixed(2)}</div>
            </div>
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-3">📋 Resultados por Variable:</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-gray-300">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="text-left py-2">Variable</th>
                    <th className="text-center py-2">Motricidad</th>
                    <th className="text-center py-2">Dependencia</th>
                    <th className="text-left py-2">Clasificación</th>
                    <th className="text-center py-2">Rank</th>
                  </tr>
                </thead>
                <tbody>
                  {results.variables.map((va, index) => (
                    <tr key={va.variable.id} className="border-b border-gray-700">
                      <td className="py-2">
                        <div className="font-medium text-white">{va.variable.name.substring(0, 20)}...</div>
                      </td>
                      <td className="text-center py-2">{va.motricity}</td>
                      <td className="text-center py-2">{va.dependence}</td>
                      <td className="py-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          va.classification === 'Variable de Enlace' ? 'bg-yellow-900 text-yellow-300' :
                          va.classification === 'Variable Motriz' ? 'bg-red-900 text-red-300' :
                          va.classification === 'Variable Dependiente' ? 'bg-blue-900 text-blue-300' :
                          'bg-green-900 text-green-300'
                        }`}>
                          {va.classification}
                        </span>
                      </td>
                      <td className="text-center py-2">#{va.rank}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-3">🎯 Matriz de Influencias:</h3>
            <div className="text-xs font-mono text-gray-300 overflow-x-auto">
              <div className="grid grid-cols-6 gap-1 text-center">
                <div className="font-bold">VAR</div>
                {results.variables.map(v => (
                  <div key={v.variable.id} className="font-bold">
                    {v.variable.name.substring(4, 8)}
                  </div>
                ))}
                {results.matrixData.map((row, i) => (
                  <>
                    <div key={`row-${i}`} className="font-bold">
                      {results.variables[i].variable.name.substring(4, 8)}
                    </div>
                    {row.map((cell, j) => (
                      <div key={`cell-${i}-${j}`} className={i === j ? 'bg-gray-700' : ''}>
                        {cell}
                      </div>
                    ))}
                  </>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
