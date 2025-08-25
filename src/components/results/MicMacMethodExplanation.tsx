'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp, BookOpen, Zap, AlertCircle, CheckCircle } from 'lucide-react'

interface MicMacMethodExplanationProps {
  currentMethod: 'classic' | 'hybrid'
  className?: string
}

export default function MicMacMethodExplanation({ 
  currentMethod, 
  className = '' 
}: MicMacMethodExplanationProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className={`bg-gray-900 rounded-lg border border-gray-700 ${className}`}>
      {/* Header */}
      <div 
        className="p-4 cursor-pointer flex items-center justify-between hover:bg-gray-800 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              📊 Comparación de Métodos MIC MAC
            </h3>
            <p className="text-gray-400 text-sm">
              Entender las diferencias entre el método clásico y el híbrido
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        )}
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-6 pt-0 space-y-6">
          {/* Fórmulas Base */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
              🧮 Fórmulas Principales (Ambos Métodos)
            </h4>
            <div className="space-y-2 font-mono text-sm">
              <div className="text-blue-300">
                <strong>Motricidad (Eje Y):</strong> Σ(fila) excluyendo diagonal
              </div>
              <div className="text-green-300">
                <strong>Dependencia (Eje X):</strong> Σ(columna) excluyendo diagonal
              </div>
              <div className="text-gray-400 text-xs mt-2">
                motricidad[i] = Σ matriz[i][j] donde i ≠ j<br/>
                dependencia[j] = Σ matriz[i][j] donde i ≠ j
              </div>
            </div>
          </div>

          {/* Comparison Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Método Clásico */}
            <div className={`rounded-lg border-2 p-4 ${
              currentMethod === 'classic' 
                ? 'border-amber-500 bg-amber-900/20' 
                : 'border-gray-600 bg-gray-800'
            }`}>
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="h-5 w-5 text-amber-400" />
                <h4 className="text-lg font-bold text-amber-300">
                  📚 MICMAC Clásico
                </h4>
                {currentMethod === 'classic' && (
                  <span className="px-2 py-1 bg-amber-600 text-amber-100 rounded text-xs font-medium">
                    ACTIVO
                  </span>
                )}
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-300 mb-1">📖 Origen:</div>
                  <div className="text-white text-sm">Michel Godet, 1971</div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-300 mb-1">🔢 Datos usados:</div>
                  <div className="text-white text-sm">Solo votación de <strong>INFLUENCIA</strong></div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-300 mb-1">🧠 Filosofía:</div>
                  <div className="text-white text-sm italic">
                    "Si A influye sobre B, entonces B depende de A automáticamente"
                  </div>
                </div>
                
                <div className="pt-2 border-t border-gray-600">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-green-300 font-medium text-sm">Ventajas:</span>
                  </div>
                  <ul className="text-sm text-gray-300 space-y-1 ml-6">
                    <li>• Método estándar académico</li>
                    <li>• Comparable con literatura existente</li>
                    <li>• Simplicidad conceptual</li>
                  </ul>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-yellow-400" />
                    <span className="text-yellow-300 font-medium text-sm">Limitaciones:</span>
                  </div>
                  <ul className="text-sm text-gray-300 space-y-1 ml-6">
                    <li>• Asume simetría perfecta</li>
                    <li>• Ignora perspectivas asimétricas</li>
                    <li>• Una sola fuente de información</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Método Híbrido */}
            <div className={`rounded-lg border-2 p-4 ${
              currentMethod === 'hybrid' 
                ? 'border-blue-500 bg-blue-900/20' 
                : 'border-gray-600 bg-gray-800'
            }`}>
              <div className="flex items-center gap-2 mb-3">
                <Zap className="h-5 w-5 text-blue-400" />
                <h4 className="text-lg font-bold text-blue-300">
                  🚀 MICMAC Híbrido
                </h4>
                {currentMethod === 'hybrid' && (
                  <span className="px-2 py-1 bg-blue-600 text-blue-100 rounded text-xs font-medium">
                    ACTIVO
                  </span>
                )}
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-300 mb-1">📖 Origen:</div>
                  <div className="text-white text-sm">Extensión moderna (2024)</div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-300 mb-1">🔢 Datos usados:</div>
                  <div className="text-white text-sm">Promedio de <strong>INFLUENCIA + DEPENDENCIA</strong></div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-300 mb-1">🧠 Filosofía:</div>
                  <div className="text-white text-sm italic">
                    "Capturar tanto la perspectiva activa como la pasiva"
                  </div>
                </div>
                
                <div className="pt-2 border-t border-gray-600">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-green-300 font-medium text-sm">Ventajas:</span>
                  </div>
                  <ul className="text-sm text-gray-300 space-y-1 ml-6">
                    <li>• Mayor riqueza de información</li>
                    <li>• Reduce sesgos perceptuales</li>
                    <li>• Detecta inconsistencias</li>
                    <li>• Validación cruzada automática</li>
                  </ul>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-yellow-400" />
                    <span className="text-yellow-300 font-medium text-sm">Limitaciones:</span>
                  </div>
                  <ul className="text-sm text-gray-300 space-y-1 ml-6">
                    <li>• No directamente comparable</li>
                    <li>• Mayor complejidad conceptual</li>
                    <li>• Requiere doble votación</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Ejemplo Práctico */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
              💡 Ejemplo Práctico: ¿Cómo Difieren?
            </h4>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-amber-900/30 rounded p-3">
                <h5 className="text-amber-300 font-medium mb-2">📚 Método Clásico</h5>
                <div className="font-mono text-xs space-y-1">
                  <div className="text-gray-300">Pregunta única: "¿A influye sobre B?" = 3</div>
                  <div className="text-gray-400">Asume que: "B depende de A" = 3 (automático)</div>
                  <div className="text-amber-300">Resultado: Relación A→B = 3</div>
                </div>
              </div>
              
              <div className="bg-blue-900/30 rounded p-3">
                <h5 className="text-blue-300 font-medium mb-2">🚀 Método Híbrido</h5>
                <div className="font-mono text-xs space-y-1">
                  <div className="text-gray-300">Pregunta 1: "¿A influye sobre B?" = 3</div>
                  <div className="text-gray-300">Pregunta 2: "¿B depende de A?" = 1</div>
                  <div className="text-blue-300">Resultado: Relación A→B = (3+1)/2 = 2</div>
                  <div className="text-yellow-400">⚠️ Alerta: Inconsistencia detectada</div>
                </div>
              </div>
            </div>
          </div>

          {/* Recomendación */}
          <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg p-4 border border-purple-500/30">
            <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
              🎯 ¿Cuál Elegir?
            </h4>
            <div className="text-gray-300 text-sm space-y-2">
              <div>
                <strong className="text-amber-300">Usa Clásico</strong> cuando:
                • Necesites comparar con estudios existentes
                • Tengas recursos limitados para votación
                • Busques simplicidad y rapidez
              </div>
              <div>
                <strong className="text-blue-300">Usa Híbrido</strong> cuando:
                • Quieras máxima precisión y detalle
                • Tengas expertos disponibles para doble votación
                • Busques detectar inconsistencias y sesgos
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
