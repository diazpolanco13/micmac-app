/**
 * 🧪 SCRIPT DE TESTING - MOTOR MIC MAC
 * Prueba el sistema completo con el ejercicio geopolítico
 */

import { generateMicMacMatrix, validateMicMacResults, printMatrix } from './micmacCalculations'
import type { VotingResponse, Variable, VotingPhase } from '@/types/project'

// Datos de prueba basados en el ejercicio geopolítico
const testVariables: Variable[] = [
  {
    id: 'var-esc1',
    projectId: 'proj-geopolitico',
    name: 'ESC1 - INVASIÓN MILITAR',
    description: 'Despliegue de una cabeza de playa por parte del cuerpo de infantería de marina de los EEUU',
    order: 1,
    category: 'Escenario Militar',
    color: '#ef4444',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'var-esc2',
    projectId: 'proj-geopolitico',
    name: 'ESC2 - CUARENTENA NAVAL',
    description: 'Bloqueo naval por parte de la armada de los EE.UU., a las costas venezolanas',
    order: 2,
    category: 'Escenario Naval',
    color: '#3b82f6',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'var-esc3',
    projectId: 'proj-geopolitico',
    name: 'ESC3 - OPERACIÓN QUIRÚRGICA',
    description: 'Acción mercenaria con el empleo de operadores de fuerzas especiales',
    order: 3,
    category: 'Escenario Especial',
    color: '#10b981',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'var-esc4',
    projectId: 'proj-geopolitico',
    name: 'ESC4 - OPERACIÓN PSICOLÓGICA',
    description: 'Uso de fake-news y guerra cognitiva para quebrar la moral',
    order: 4,
    category: 'Escenario Psicológico',
    color: '#f59e0b',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'var-esc5',
    projectId: 'proj-geopolitico',
    name: 'ESC5 - ATAQUE DE FALSA BANDERA',
    description: 'Los buques de la Armada de EE.UU. simularían un ataque de fuerzas navales venezolanas',
    order: 5,
    category: 'Escenario Deceptivo',
    color: '#8b5cf6',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  }
]

// Generar votos de prueba basados en la matriz esperada del ejercicio
function generateTestVotes(): VotingResponse[] {
  const votes: VotingResponse[] = []
  const expertIds = ['expert-1', 'expert-2', 'expert-3', 'expert-4']
  
  // Matriz esperada del ejercicio (valores promedio que esperamos)
  const expectedMatrix = [
    [0, 1, 3, 1, 3], // ESC1: 8 total influencia
    [3, 0, 3, 2, 1], // ESC2: 9 total influencia  
    [2, 3, 0, 1, 3], // ESC3: 9 total influencia
    [3, 1, 3, 0, 3], // ESC4: 10 total influencia
    [3, 3, 3, 2, 0]  // ESC5: 11 total influencia
  ]
  
  // Para cada experto, generar votos basados en la matriz esperada con variación
  expertIds.forEach((expertId, expertIndex) => {
    testVariables.forEach((varA, i) => {
      testVariables.forEach((varB, j) => {
        if (i !== j) { // No diagonal
          // Ambas fases: INFLUENCE y DEPENDENCE
          const phases: VotingPhase[] = ['INFLUENCE', 'DEPENDENCE']
          
          phases.forEach(phase => {
            // Valor base de la matriz esperada con variación por experto
            const baseValue = expectedMatrix[i][j]
            const variation = Math.round(Math.random() * 1 - 0.5) // ±0.5
            const finalValue = Math.max(0, Math.min(3, baseValue + variation))
            
            votes.push({
              expertId,
              variableAId: varA.id,
              variableBId: varB.id,
              phase,
              value: finalValue,
              confidence: Math.floor(Math.random() * 3) + 2, // 2-4
              timeSpent: Math.floor(Math.random() * 30) + 15, // 15-45 segundos
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            })
          })
        }
      })
    })
  })
  
  return votes
}

/**
 * 🧪 Función principal de testing
 */
export function testMicMacSystem() {
  console.log('🧪 INICIANDO TEST DEL SISTEMA MIC MAC')
  console.log('=====================================')
  
  // 1. Generar datos de prueba
  const testVotes = generateTestVotes()
  console.log(`✅ Generados ${testVotes.length} votos de prueba`)
  console.log(`   - ${testVariables.length} variables`)
  console.log(`   - 4 expertos simulados`)
  console.log(`   - 2 fases (INFLUENCE + DEPENDENCE)`)
  
  // 2. Ejecutar cálculo MIC MAC
  console.log('\n🧮 EJECUTANDO CÁLCULO MIC MAC...')
  const results = generateMicMacMatrix(testVotes, testVariables)
  
  // 3. Mostrar matriz resultante
  console.log('\n📊 MATRIZ RESULTANTE:')
  printMatrix(results.matrixData, testVariables)
  
  // 4. Mostrar resultados por variable
  console.log('\n📈 RESULTADOS POR VARIABLE:')
  console.log('Variable                    | Motricidad | Dependencia | Clasificación')
  console.log('----------------------------|------------|-------------|------------------')
  
  results.variables.forEach(va => {
    const name = va.variable.name.substring(0, 26).padEnd(26)
    const mot = va.motricity.toString().padStart(8)
    const dep = va.dependence.toString().padStart(9)
    const cls = va.classification
    console.log(`${name} |${mot}    |${dep}     | ${cls}`)
  })
  
  // 5. Mostrar estadísticas
  console.log('\n📊 ESTADÍSTICAS GENERALES:')
  console.log(`   - Motricidad promedio: ${results.averageMotricity.toFixed(2)}`)
  console.log(`   - Dependencia promedio: ${results.averageDependence.toFixed(2)}`)
  console.log(`   - Total votos procesados: ${results.totalVotes}`)
  
  // 6. Validar resultados
  console.log('\n✅ VALIDACIÓN:')
  const validation = validateMicMacResults(results)
  if (validation.isValid) {
    console.log('   ✅ Resultados válidos')
  } else {
    console.log('   ❌ Errores encontrados:')
    validation.errors.forEach(error => console.log(`      - ${error}`))
  }
  
  // 7. Comparar con resultados esperados
  console.log('\n🎯 COMPARACIÓN CON EJERCICIO ESPERADO:')
  console.log('Variable | Esperado | Calculado | Diferencia')
  console.log('---------|----------|-----------|------------')
  
  const expectedResults = [
    { name: 'ESC1', motricidad: 8, dependencia: 11, clasificacion: 'Variable de Enlace' },
    { name: 'ESC2', motricidad: 9, dependencia: 8, clasificacion: 'Variable de Enlace' },
    { name: 'ESC3', motricidad: 9, dependencia: 12, clasificacion: 'Variable de Enlace' },
    { name: 'ESC4', motricidad: 10, dependencia: 6, clasificacion: 'Variable Dependiente' },
    { name: 'ESC5', motricidad: 11, dependencia: 10, clasificacion: 'Variable de Enlace' }
  ]
  
  expectedResults.forEach((expected, index) => {
    const calculated = results.variables.find(v => v.variable.name.includes(expected.name))
    if (calculated) {
      const motDiff = Math.abs(calculated.motricity - expected.motricidad)
      const depDiff = Math.abs(calculated.dependence - expected.dependencia)
      const classMatch = calculated.classification === expected.clasificacion ? '✅' : '❌'
      
      console.log(`${expected.name.padEnd(8)} | ${expected.motricidad.toString().padStart(8)} | ${calculated.motricity.toString().padStart(9)} | ${motDiff.toString().padStart(10)} ${classMatch}`)
    }
  })
  
  console.log('\n🎉 TEST COMPLETADO')
  console.log('===================')
  
  return results
}

// Ejecutar test si se importa directamente
if (typeof window === 'undefined') {
  // Solo en Node.js (no en browser)
  // testMicMacSystem()
}
