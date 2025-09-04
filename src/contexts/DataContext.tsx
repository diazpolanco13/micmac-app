/**
 * 🔄 Contexto Híbrido de Datos
 * FASE 1: Infraestructura dual Mock/Supabase
 * Permite alternar entre Mock y Supabase sin romper la aplicación
 */

'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { MockDataProvider, useMockData as useMockDataOriginal } from './MockDataContext'
// import { SupabaseDataProvider, useSupabaseData } from './SupabaseDataContext' // Para futuras fases

import type { 
  Project,
  Variable,
  Expert,
  ProjectType,
  ExpertFormData,
  ExpertFilter,
  ExpertStats,
  VotingResponse,
  VotingMatrix,
  MicMacResults
} from '@/types/project'

// Interfaz unificada para ambos contextos de datos
export interface DataContextType {
  // Projects
  projects: Project[]
  currentProject: Project | null
  loadingProjects: boolean
  refreshProjects: () => Promise<void>
  createProject: (data: {
    name: string
    description: string
    type: ProjectType
    expectedExperts: number
  }) => Promise<Project>
  updateProject: (id: string, data: Partial<Project>) => Promise<Project>
  deleteProject: (id: string) => Promise<void>
  setCurrentProject: (project: Project | null) => void

  // Variables
  addVariable: (projectId: string, name: string, description?: string) => Promise<Variable>
  updateVariable: (projectId: string, variableId: string, data: { name?: string; description?: string }) => Promise<Variable>
  deleteVariable: (projectId: string, variableId: string) => Promise<void>
  reorderVariables: (projectId: string, variables: Variable[]) => Promise<void>

  // Experts
  experts: Expert[]
  loadingExperts: boolean
  refreshExperts: () => Promise<void>
  createExpert: (data: ExpertFormData) => Promise<Expert>
  updateExpert: (id: string, data: Partial<ExpertFormData>) => Promise<Expert>
  deleteExpert: (id: string) => Promise<void>
  getExpertStats: () => ExpertStats
  filterExperts: (filter: ExpertFilter) => Expert[]
  inviteExpert: (projectId: string, expertId: string) => Promise<void>
  removeExpertFromProject: (projectId: string, expertId: string) => Promise<void>

  // Voting
  submitVote: (projectId: string, variableAId: string, variableBId: string, value: number) => Promise<void>
  getVotingMatrix: (projectId: string) => Promise<VotingMatrix>
  getVotingProgress: (projectId: string) => Promise<number>

  // MIC MAC Results
  getMicMacResults: (projectId: string) => MicMacResults | null
  generateMicMacResults: (projectId: string, force?: boolean) => Promise<MicMacResults>
  clearMicMacResults: (projectId: string) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

// Hook principal que decide qué contexto usar
export function useData(): DataContextType {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}

// Componente wrapper que decide qué proveedor usar
interface DataProviderProps {
  children: ReactNode
}

export function DataProvider({ children }: DataProviderProps) {
  // Leer flag de migración desde variables de entorno
  const useSupabaseData = process.env.NEXT_PUBLIC_USE_SUPABASE_DATA === 'true' || 
                          process.env.USE_SUPABASE_DATA === 'true'

  console.log(`🔄 [DATA PROVIDER] Usando ${useSupabaseData ? 'SUPABASE' : 'MOCK'} Data (Fase ${process.env.NEXT_PUBLIC_MIGRATION_PHASE || '2'})`)

  if (useSupabaseData) {
    // FASE 4+: Usar Supabase Data
    return (
      <div>
        {/* TODO: Implementar SupabaseDataProvider en fases futuras */}
        <div className="p-4 bg-yellow-100 border border-yellow-400 rounded">
          <p className="text-yellow-800">⚠️ Supabase Data Provider aún no implementado (Fase 4+)</p>
        </div>
        <MockDataProvider>
          <MockDataAdapter>
            {children}
          </MockDataAdapter>
        </MockDataProvider>
      </div>
    )
  } else {
    // FASE 1-3: Usar Mock Data (comportamiento actual)
    return (
      <MockDataProvider>
        <MockDataAdapter>
          {children}
        </MockDataAdapter>
      </MockDataProvider>
    )
  }
}

// Adaptador para Mock Data (mantiene interfaces compatibles)
function MockDataAdapter({ children }: { children: ReactNode }) {
  const mockData = useMockDataOriginal()

  // La interfaz de MockData ya es compatible, solo pasamos directamente
  const adaptedData: DataContextType = {
    ...mockData
  }

  return (
    <DataContext.Provider value={adaptedData}>
      {children}
    </DataContext.Provider>
  )
}

// Hook de compatibilidad para mantener código existente
export { useData as useMockData } // Alias para compatibilidad hacia atrás