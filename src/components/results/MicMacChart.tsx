'use client'

import { useMemo } from 'react'
import type { MicMacResults, VariableAnalysis } from '@/types/project'

interface MicMacChartProps {
  results: MicMacResults
  className?: string
}

export default function MicMacChart({ results, className = '' }: MicMacChartProps) {
  // Calcular dimensiones del gráfico
  const chartData = useMemo(() => {
    const maxMotricity = Math.max(...results.variables.map(v => v.motricity))
    const maxDependence = Math.max(...results.variables.map(v => v.dependence))
    const maxValue = Math.max(maxMotricity, maxDependence)
    
    return {
      maxValue: maxValue * 1.1, // 10% de padding
      avgMotricity: results.averageMotricity,
      avgDependence: results.averageDependence,
      variables: results.variables
    }
  }, [results])

  const getQuadrantColor = (classification: string) => {
    switch (classification) {
      case 'Variable de Enlace': return 'bg-yellow-500 border-yellow-400'
      case 'Variable Motriz': return 'bg-red-500 border-red-400'
      case 'Variable Dependiente': return 'bg-blue-500 border-blue-400'
      case 'Variable Autónoma': return 'bg-green-500 border-green-400'
      default: return 'bg-gray-500 border-gray-400'
    }
  }

  const getQuadrantLabel = (x: number, y: number) => {
    const { avgDependence, avgMotricity } = chartData
    
    if (y >= avgMotricity && x >= avgDependence) return 'Variables de Enlace'
    if (y >= avgMotricity && x < avgDependence) return 'Variables Motrices'
    if (y < avgMotricity && x >= avgDependence) return 'Variables Dependientes'
    return 'Variables Autónomas'
  }

  return (
    <div className={`bg-gray-900 rounded-lg border border-gray-700 p-6 ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">📊 Plano de Influencias MIC MAC</h2>
        <p className="text-gray-400 text-sm">
          Análisis de {results.variables.length} variables • {results.totalVotes} votos procesados
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico Principal */}
        <div className="lg:col-span-2">
          <div className="relative bg-gray-800 rounded-lg p-4" style={{ height: '500px' }}>
            {/* SVG Chart */}
            <svg 
              width="100%" 
              height="100%" 
              viewBox="0 0 400 400"
              className="overflow-visible"
            >
              {/* Fondo de cuadrantes */}
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#374151" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="400" height="400" fill="url(#grid)" />
              
              {/* Cuadrantes de fondo */}
              <rect 
                x={200 * (chartData.avgDependence / chartData.maxValue)} 
                y={0} 
                width={400 - 200 * (chartData.avgDependence / chartData.maxValue)} 
                height={200 * (chartData.avgMotricity / chartData.maxValue)}
                fill="rgba(239, 68, 68, 0.1)" 
              />
              <rect 
                x={200 * (chartData.avgDependence / chartData.maxValue)} 
                y={200 * (chartData.avgMotricity / chartData.maxValue)} 
                width={400 - 200 * (chartData.avgDependence / chartData.maxValue)} 
                height={400 - 200 * (chartData.avgMotricity / chartData.maxValue)}
                fill="rgba(59, 130, 246, 0.1)" 
              />
              <rect 
                x={0} 
                y={0} 
                width={200 * (chartData.avgDependence / chartData.maxValue)} 
                height={200 * (chartData.avgMotricity / chartData.maxValue)}
                fill="rgba(34, 197, 94, 0.1)" 
              />
              <rect 
                x={0} 
                y={200 * (chartData.avgMotricity / chartData.maxValue)} 
                width={200 * (chartData.avgDependence / chartData.maxValue)} 
                height={400 - 200 * (chartData.avgMotricity / chartData.maxValue)}
                fill="rgba(251, 191, 36, 0.1)" 
              />

              {/* Líneas de media */}
              <line 
                x1={200 * (chartData.avgDependence / chartData.maxValue)} 
                y1={0} 
                x2={200 * (chartData.avgDependence / chartData.maxValue)} 
                y2={400}
                stroke="#6b7280" 
                strokeWidth="2" 
                strokeDasharray="5,5"
              />
              <line 
                x1={0} 
                y1={200 * (chartData.avgMotricity / chartData.maxValue)} 
                x2={400} 
                y2={200 * (chartData.avgMotricity / chartData.maxValue)}
                stroke="#6b7280" 
                strokeWidth="2" 
                strokeDasharray="5,5"
              />

              {/* Ejes */}
              <line x1={0} y1={400} x2={400} y2={400} stroke="#9ca3af" strokeWidth="2"/>
              <line x1={0} y1={0} x2={0} y2={400} stroke="#9ca3af" strokeWidth="2"/>

              {/* Variables como puntos */}
              {chartData.variables.map((variable, index) => {
                const x = (variable.dependence / chartData.maxValue) * 400
                const y = 400 - (variable.motricity / chartData.maxValue) * 400
                const color = getQuadrantColor(variable.classification)
                
                return (
                  <g key={variable.variable.id}>
                    <circle
                      cx={x}
                      cy={y}
                      r="8"
                      className={`${color} opacity-80 hover:opacity-100 cursor-pointer transition-opacity`}
                      stroke="white"
                      strokeWidth="2"
                    />
                    <text
                      x={x + 12}
                      y={y - 8}
                      fill="white"
                      fontSize="10"
                      fontWeight="bold"
                      className="pointer-events-none"
                    >
                      {variable.variable.name.substring(0, 8)}
                    </text>
                    <text
                      x={x + 12}
                      y={y + 4}
                      fill="#9ca3af"
                      fontSize="8"
                      className="pointer-events-none"
                    >
                      ({variable.dependence}, {variable.motricity})
                    </text>
                  </g>
                )
              })}

              {/* Etiquetas de ejes */}
              <text x={200} y={395} textAnchor="middle" fill="#9ca3af" fontSize="12">
                Dependencia →
              </text>
              <text x={10} y={200} textAnchor="middle" fill="#9ca3af" fontSize="12" transform="rotate(-90, 10, 200)">
                ← Motricidad
              </text>
            </svg>
          </div>
        </div>

        {/* Panel de Información */}
        <div className="space-y-4">
          {/* Estadísticas */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3">📈 Estadísticas</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Motricidad promedio:</span>
                <span className="text-white font-mono">{results.averageMotricity.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Dependencia promedio:</span>
                <span className="text-white font-mono">{results.averageDependence.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Variables analizadas:</span>
                <span className="text-white font-mono">{results.variables.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Votos procesados:</span>
                <span className="text-white font-mono">{results.totalVotes}</span>
              </div>
            </div>
          </div>

          {/* Leyenda de Cuadrantes */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3">🎯 Cuadrantes</h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-300">Variables de Enlace</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-gray-300">Variables Motrices</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-300">Variables Dependientes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-300">Variables Autónomas</span>
              </div>
            </div>
          </div>

          {/* Ranking de Variables */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3">🏆 Ranking</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {results.variables.map((variable) => (
                <div key={variable.variable.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">#{variable.rank}</span>
                    <div className={`w-2 h-2 rounded-full ${getQuadrantColor(variable.classification)}`}></div>
                    <span className="text-gray-300 truncate max-w-20">
                      {variable.variable.name.substring(0, 15)}...
                    </span>
                  </div>
                  <span className="text-white font-mono">
                    {variable.motricity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
