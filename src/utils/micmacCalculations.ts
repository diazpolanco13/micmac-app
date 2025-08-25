/**
 * 🧮 MOTOR DE CÁLCULO MIC MAC
 * Procesa votos de 2 fases y genera resultados analíticos
 */

import { 
  VotingResponse, 
  Variable, 
  VotingPhase,
  MicMacResults,
  VariableAnalysis,
  VariableClassification
} from '@/types/project'

// 🔍 Tipos para el método mejorado
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

interface ImprovedMicMacResult extends MicMacResults {
  inconsistencyAlerts: InconsistencyAlert[]
  calculationMethod: 'average' | 'maximum' | 'weighted'
  qualityScore: number // 0-100, basado en consistencia
}

/**
 * 📊 FUNCIÓN PRINCIPAL: Genera matriz MIC MAC completa
 */
export function generateMicMacMatrix(
  votes: VotingResponse[], 
  variables: Variable[]
): MicMacResults {
  console.log(`🧮 Iniciando cálculo MIC MAC para ${variables.length} variables y ${votes.length} votos`)
  
  // 1. Construir matriz combinada (suma de ambas fases)
  const matrix = buildCombinedMatrix(votes, variables)
  
  // 2. Calcular motricidad y dependencia
  const motricity = calculateMotricity(matrix)
  const dependence = calculateDependence(matrix)
  
  // 3. Calcular medias para clasificación
  const avgMotricity = calculateAverage(motricity)
  const avgDependence = calculateAverage(dependence)
  
  // 4. Clasificar variables
  const variableAnalysis = variables.map((variable, index): VariableAnalysis => {
    const mot = motricity[index]
    const dep = dependence[index]
    
    return {
      variable,
      motricity: mot,
      dependence: dep,
      coordinates: [dep, mot], // X, Y
      classification: classifyVariable(mot, dep, avgMotricity, avgDependence),
      rank: index + 1, // Se puede ordenar después por motricidad
      percentage: ((mot + dep) / (avgMotricity + avgDependence)) * 50 // Aproximado
    }
  })
  
  // 5. Ordenar por motricidad (más influyentes primero)
  variableAnalysis.sort((a, b) => b.motricity - a.motricity)
  variableAnalysis.forEach((va, index) => va.rank = index + 1)
  
  const results: MicMacResults = {
    projectId: variables[0]?.projectId || '',
    variables: variableAnalysis,
    totalVotes: votes.length,
    calculatedAt: new Date().toISOString(),
    averageMotricity: avgMotricity,
    averageDependence: avgDependence,
    matrixData: matrix
  }
  
  console.log(`✅ Cálculo completado:`, {
    variables: results.variables.length,
    avgMotricity: results.averageMotricity.toFixed(2),
    avgDependence: results.averageDependence.toFixed(2)
  })
  
  return results
}

/**
 * 🏗️ Construye matriz combinada sumando votos de ambas fases
 */
function buildCombinedMatrix(votes: VotingResponse[], variables: Variable[]): number[][] {
  const n = variables.length
  const matrix: number[][] = Array(n).fill(0).map(() => Array(n).fill(0))
  
  // Crear mapeo de variable ID a índice
  const varIdToIndex = new Map<string, number>()
  variables.forEach((variable, index) => {
    varIdToIndex.set(variable.id, index)
  })
  
  // Procesar cada voto
  votes.forEach(vote => {
    const rowIndex = varIdToIndex.get(vote.variableAId)
    const colIndex = varIdToIndex.get(vote.variableBId)
    
    if (rowIndex !== undefined && colIndex !== undefined) {
      // Sumar votos de ambas fases (INFLUENCE + DEPENDENCE)
      matrix[rowIndex][colIndex] += vote.value
    }
  })
  
  console.log(`📊 Matriz ${n}x${n} construida con ${votes.length} votos`)
  return matrix
}

/**
 * 📈 Calcula MOTRICIDAD (Influencia) - Eje Y
 * Suma de cada fila excluyendo diagonal
 */
export function calculateMotricity(matrix: number[][]): number[] {
  return matrix.map((row, i) => 
    row.reduce((sum, value, j) => 
      i === j ? sum : sum + value, 0
    )
  )
}

/**
 * 📉 Calcula DEPENDENCIA - Eje X  
 * Suma de cada columna excluyendo diagonal
 */
export function calculateDependence(matrix: number[][]): number[] {
  const n = matrix.length
  const dependence: number[] = []
  
  for (let j = 0; j < n; j++) {
    let sum = 0
    for (let i = 0; i < n; i++) {
      if (i !== j) {
        sum += matrix[i][j]
      }
    }
    dependence.push(sum)
  }
  
  return dependence
}

/**
 * 🎯 Clasifica variable según cuadrantes MIC MAC
 */
export function classifyVariable(
  motricity: number,
  dependence: number, 
  avgMotricity: number,
  avgDependence: number
): VariableClassification {
  if (motricity >= avgMotricity && dependence >= avgDependence) {
    return "Variable de Enlace"      // Cuadrante I (arriba-derecha)
  }
  
  if (motricity >= avgMotricity && dependence < avgDependence) {
    return "Variable Motriz"         // Cuadrante II (arriba-izquierda)  
  }
  
  if (motricity < avgMotricity && dependence >= avgDependence) {
    return "Variable Dependiente"    // Cuadrante III (abajo-derecha)
  }
  
  return "Variable Autónoma"         // Cuadrante IV (abajo-izquierda)
}

/**
 * 🧮 Utilidades de cálculo
 */
function calculateAverage(numbers: number[]): number {
  return numbers.reduce((sum, num) => sum + num, 0) / numbers.length
}

/**
 * 📊 Función helper para debugging - imprime matriz
 */
export function printMatrix(matrix: number[][], variables: Variable[]): void {
  console.log('\n📊 MATRIZ MIC MAC:')
  console.log('     ', variables.map(v => v.name.substring(0, 4)).join('  '))
  
  matrix.forEach((row, i) => {
    const varName = variables[i].name.substring(0, 4)
    console.log(`${varName}:`, row.map(val => val.toString().padStart(3)).join(' '))
  })
}

/**
 * 🎯 Función de validación para testing
 */
export function validateMicMacResults(results: MicMacResults): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  if (results.variables.length === 0) {
    errors.push('No hay variables para analizar')
  }
  
  if (results.totalVotes === 0) {
    errors.push('No hay votos para procesar')
  }
  
  if (results.averageMotricity < 0 || results.averageDependence < 0) {
    errors.push('Valores de motricidad/dependencia inválidos')
  }
  
  // Verificar que todas las variables tengan clasificación
  const unclassified = results.variables.filter(va => !va.classification)
  if (unclassified.length > 0) {
    errors.push(`${unclassified.length} variables sin clasificar`)
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// ========================================
// 📚 MÉTODO MIC MAC CLÁSICO (GODET ORIGINAL)
// ========================================

/**
 * 📚 MÉTODO CLÁSICO: MIC MAC según metodología original de Michel Godet
 * Usa SOLO la fase INFLUENCE para construir la matriz de influencias directas
 */
export function generateClassicMicMacMatrix(
  votes: VotingResponse[], 
  variables: Variable[]
): MicMacResults {
  console.log(`📚 Iniciando cálculo MIC MAC CLÁSICO para ${variables.length} variables`)
  
  // 1. Usar SOLO votos de la fase INFLUENCE (metodología original)
  const influenceVotes = votes.filter(v => v.phase === 'INFLUENCE')
  console.log(`📊 Usando solo ${influenceVotes.length} votos de INFLUENCE (ignorando DEPENDENCE)`)
  
  // 2. Construir matriz de influencias directas
  const matrix = buildPhaseMatrix(influenceVotes, variables)
  
  // 3. Calcular motricidad y dependencia desde la MISMA matriz
  const motricity = calculateMotricity(matrix)
  const dependence = calculateDependence(matrix)
  
  // 4. Calcular medias para clasificación
  const avgMotricity = calculateAverage(motricity)
  const avgDependence = calculateAverage(dependence)
  
  // 5. Clasificar variables
  const variableAnalysis = variables.map((variable, index): VariableAnalysis => {
    const mot = motricity[index]
    const dep = dependence[index]
    
    return {
      variable,
      motricity: mot,
      dependence: dep,
      coordinates: [dep, mot], // X, Y
      classification: classifyVariable(mot, dep, avgMotricity, avgDependence),
      rank: index + 1,
      percentage: ((mot + dep) / (avgMotricity + avgDependence)) * 50
    }
  })
  
  // 6. Construir resultado final
  const results: MicMacResults = {
    projectId: 'calculated-classic',
    variables: variableAnalysis,
    totalVotes: influenceVotes.length, // Solo contar votos de influencia
    calculatedAt: new Date().toISOString(),
    averageMotricity: avgMotricity,
    averageDependence: avgDependence,
    matrixData: matrix
  }
  
  console.log(`📚 MIC MAC CLÁSICO completado - usando solo matriz de influencias`)
  return results
}

/**
 * 📚 ALTERNATIVA: MIC MAC Clásico usando fase DEPENDENCE (transpuesta)
 */
export function generateClassicMicMacFromDependence(
  votes: VotingResponse[], 
  variables: Variable[]
): MicMacResults {
  console.log(`📚 Iniciando cálculo MIC MAC CLÁSICO desde DEPENDENCE (transpuesta)`)
  
  // 1. Usar SOLO votos de la fase DEPENDENCE
  const dependenceVotes = votes.filter(v => v.phase === 'DEPENDENCE')
  console.log(`📊 Usando ${dependenceVotes.length} votos de DEPENDENCE transpuestos`)
  
  // 2. Construir matriz transpuesta: "j depende de i" → "i influye sobre j"
  const dependenceMatrix = buildPhaseMatrix(dependenceVotes, variables)
  const transposedMatrix = transposeMatrix(dependenceMatrix)
  
  // 3. Calcular motricidad y dependencia
  const motricity = calculateMotricity(transposedMatrix)
  const dependence = calculateDependence(transposedMatrix)
  
  // 4. Resto igual al método clásico...
  const avgMotricity = calculateAverage(motricity)
  const avgDependence = calculateAverage(dependence)
  
  const variableAnalysis = variables.map((variable, index): VariableAnalysis => {
    const mot = motricity[index]
    const dep = dependence[index]
    
    return {
      variable,
      motricity: mot,
      dependence: dep,
      coordinates: [dep, mot],
      classification: classifyVariable(mot, dep, avgMotricity, avgDependence),
      rank: index + 1,
      percentage: ((mot + dep) / (avgMotricity + avgDependence)) * 50
    }
  })
  
  const results: MicMacResults = {
    projectId: 'calculated-classic-dep',
    variables: variableAnalysis,
    totalVotes: dependenceVotes.length,
    calculatedAt: new Date().toISOString(),
    averageMotricity: avgMotricity,
    averageDependence: avgDependence,
    matrixData: transposedMatrix
  }
  
  console.log(`📚 MIC MAC CLÁSICO (desde dependencia) completado`)
  return results
}

/**
 * 🔄 Utilidad: Transponer matriz
 */
function transposeMatrix(matrix: number[][]): number[][] {
  const n = matrix.length
  const transposed: number[][] = Array(n).fill(0).map(() => Array(n).fill(0))
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      transposed[i][j] = matrix[j][i]
    }
  }
  
  return transposed
}

// ========================================
// 🚀 MÉTODO MIC MAC MEJORADO 
// ========================================

/**
 * 🚀 MÉTODO MEJORADO: Genera matriz MIC MAC con validación cruzada
 */
export function generateImprovedMicMacMatrix(
  votes: VotingResponse[], 
  variables: Variable[],
  method: 'average' | 'maximum' | 'weighted' = 'average'
): ImprovedMicMacResult {
  console.log(`🧮 Iniciando cálculo MIC MAC MEJORADO para ${variables.length} variables y ${votes.length} votos`)
  
  // 1. Separar votos por fase
  const influenceVotes = votes.filter(v => v.phase === 'INFLUENCE')
  const dependenceVotes = votes.filter(v => v.phase === 'DEPENDENCE')
  
  console.log(`📊 Votos INFLUENCE: ${influenceVotes.length}, DEPENDENCE: ${dependenceVotes.length}`)
  
  // 2. Construir matrices separadas
  const influenceMatrix = buildPhaseMatrix(influenceVotes, variables)
  const dependenceMatrix = buildPhaseMatrix(dependenceVotes, variables)
  
  // 3. Aplicar validación cruzada y construir matriz final
  const { matrix: finalMatrix, alerts } = buildCrossValidatedMatrix(
    influenceMatrix, 
    dependenceMatrix, 
    variables, 
    method
  )
  
  // 4. Calcular motricidad y dependencia
  const motricity = calculateMotricity(finalMatrix)
  const dependence = calculateDependence(finalMatrix)
  
  // 5. Calcular medias para clasificación
  const avgMotricity = calculateAverage(motricity)
  const avgDependence = calculateAverage(dependence)
  
  // 6. Calcular puntuación de calidad
  const qualityScore = calculateQualityScore(alerts, votes.length)
  
  // 7. Clasificar variables
  const variableAnalysis = variables.map((variable, index): VariableAnalysis => {
    const mot = motricity[index]
    const dep = dependence[index]
    
    return {
      variable,
      motricity: mot,
      dependence: dep,
      coordinates: [dep, mot], // X, Y
      classification: classifyVariable(mot, dep, avgMotricity, avgDependence),
      rank: index + 1,
      percentage: ((mot + dep) / (avgMotricity + avgDependence)) * 50
    }
  })
  
  // 8. Construir resultado final mejorado
  const results: ImprovedMicMacResult = {
    projectId: 'calculated',
    variables: variableAnalysis,
    totalVotes: votes.length,
    calculatedAt: new Date().toISOString(),
    averageMotricity: avgMotricity,
    averageDependence: avgDependence,
    matrixData: finalMatrix,
    inconsistencyAlerts: alerts,
    calculationMethod: method,
    qualityScore: qualityScore
  }
  
  // Debug: imprimir resultados
  console.log(`📊 Método: ${method}, Calidad: ${qualityScore}%, Alertas: ${alerts.length}`)
  if (alerts.length > 0) {
    console.log('⚠️ INCONSISTENCIAS DETECTADAS:')
    alerts.forEach(alert => console.log(`  ${alert.relation}: ${alert.message}`))
  }
  
  return results
}

/**
 * 🏗️ Construye matriz de una fase específica con promedios por experto
 */
function buildPhaseMatrix(votes: VotingResponse[], variables: Variable[]): number[][] {
  const n = variables.length
  const matrix: number[][] = Array(n).fill(0).map(() => Array(n).fill(0))
  const countMatrix: number[][] = Array(n).fill(0).map(() => Array(n).fill(0))
  
  // Crear mapeo de variable ID a índice
  const varIdToIndex = new Map<string, number>()
  variables.forEach((variable, index) => {
    varIdToIndex.set(variable.id, index)
  })
  
  // Acumular votos
  votes.forEach(vote => {
    const rowIndex = varIdToIndex.get(vote.variableAId)
    const colIndex = varIdToIndex.get(vote.variableBId)
    
    if (rowIndex !== undefined && colIndex !== undefined) {
      matrix[rowIndex][colIndex] += vote.value
      countMatrix[rowIndex][colIndex] += 1
    }
  })
  
  // Calcular promedios
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (countMatrix[i][j] > 0) {
        matrix[i][j] = matrix[i][j] / countMatrix[i][j]
      }
    }
  }
  
  return matrix
}

/**
 * 🔍 Construye matriz final con validación cruzada
 */
function buildCrossValidatedMatrix(
  influenceMatrix: number[][],
  dependenceMatrix: number[][],
  variables: Variable[],
  method: 'average' | 'maximum' | 'weighted'
): { matrix: number[][], alerts: InconsistencyAlert[] } {
  const n = variables.length
  const finalMatrix: number[][] = Array(n).fill(0).map(() => Array(n).fill(0))
  const alerts: InconsistencyAlert[] = []
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) {
        finalMatrix[i][j] = 0 // Diagonal siempre 0
      } else {
        const inf = influenceMatrix[i][j]
        const dep = dependenceMatrix[j][i] // ¡Transposición clave!
        
        // DETECTAR INCONSISTENCIAS
        const difference = Math.abs(inf - dep)
        if (difference > 1) {
          const severity: 'low' | 'medium' | 'high' = 
            difference > 2 ? 'high' : difference > 1.5 ? 'medium' : 'low'
            
          alerts.push({
            relation: `${variables[i].name} → ${variables[j].name}`,
            variable1: variables[i].name,
            variable2: variables[j].name,
            influenceVote: inf,
            dependenceVote: dep,
            difference: difference,
            severity: severity,
            message: `Diferencia ${difference.toFixed(1)}: revisar perspectivas muy diferentes`
          })
        }
        
        // APLICAR MÉTODO DE CÁLCULO
        switch (method) {
          case 'average':
            finalMatrix[i][j] = (inf + dep) / 2
            break
          case 'maximum':
            finalMatrix[i][j] = Math.max(inf, dep)
            break
          case 'weighted':
            // Dar más peso a la influencia (60%) vs dependencia (40%)
            finalMatrix[i][j] = (inf * 0.6 + dep * 0.4)
            break
        }
      }
    }
  }
  
  return { matrix: finalMatrix, alerts }
}

/**
 * 📊 Calcula puntuación de calidad basada en consistencia
 */
function calculateQualityScore(alerts: InconsistencyAlert[], totalVotes: number): number {
  if (alerts.length === 0) return 100
  
  // Penalizar según severidad
  const penalty = alerts.reduce((sum, alert) => {
    switch (alert.severity) {
      case 'high': return sum + 10
      case 'medium': return sum + 5
      case 'low': return sum + 2
      default: return sum
    }
  }, 0)
  
  // Normalizar por número de relaciones posibles
  const maxPossibleRelations = totalVotes / 2 // Aproximado
  const normalizedPenalty = (penalty / maxPossibleRelations) * 100
  
  return Math.max(0, 100 - normalizedPenalty)
}


