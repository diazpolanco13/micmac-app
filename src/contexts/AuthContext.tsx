/**
 * 🔄 Contexto Híbrido de Autenticación
 * FASE 1: Infraestructura dual Mock/Supabase
 * Permite alternar entre Mock y Supabase sin romper la aplicación
 */

'use client'

import { createContext, useContext, ReactNode } from 'react'
// MockAuthProvider ya no se usa en Fase 2
import { SupabaseAuthProvider, useAuth as useSupabaseAuth } from './SupabaseAuthContext'
import { AuthUser as SupabaseAuthUser } from '@/lib/supabase'

// Usar directamente los tipos de Supabase (Fase 2)
export type AuthUser = SupabaseAuthUser

export interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (email: string, password: string, name: string, role: 'MODERATOR' | 'EXPERT') => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  updateProfile: (data: Partial<AuthUser>) => Promise<{ success: boolean; error?: string }>
  switchOrganization?: (organizationId: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Hook principal que decide qué contexto usar
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Componente wrapper que decide qué proveedor usar
interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  // FASE 2: Solo Supabase Auth (simplificado)
  console.log('🔄 [AUTH PROVIDER] Usando SUPABASE Auth (Fase 2 - Simplificado)')

  return (
    <SupabaseAuthProvider>
      <SupabaseAuthAdapter>
        {children}
      </SupabaseAuthAdapter>
    </SupabaseAuthProvider>
  )
}

// MockAuthAdapter eliminado - solo Supabase en Fase 2

// Adaptador para Supabase Auth (para futuras fases)
function SupabaseAuthAdapter({ children }: { children: ReactNode }) {
  const supabaseAuth = useSupabaseAuth()

  // Adaptar la interfaz de SupabaseAuth a la interfaz unificada
  const adaptedAuth: AuthContextType = {
    user: supabaseAuth.user,
    loading: supabaseAuth.loading,
    signIn: supabaseAuth.signIn,
    signUp: supabaseAuth.signUp,
    signOut: supabaseAuth.signOut,
    updateProfile: supabaseAuth.updateProfile
  }

  return (
    <AuthContext.Provider value={adaptedAuth}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook de compatibilidad para mantener código existente
export { useAuth as useMockAuth } // Alias para compatibilidad hacia atrás