/**
 * 🔄 Contexto Híbrido de Autenticación
 * FASE 1: Infraestructura dual Mock/Supabase
 * Permite alternar entre Mock y Supabase sin romper la aplicación
 */

'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { MockAuthProvider, useMockAuth as useMockAuthOriginal } from './MockAuthContext'
import { SupabaseAuthProvider, useSupabaseAuth } from './SupabaseAuthContext'

// Tipos unificados para ambos contextos
export interface AuthUser {
  id: string
  email: string
  role: 'MODERATOR' | 'EXPERT'
  name?: string
  avatar?: string
  currentOrganizationId?: string
  organizations?: Array<{
    organizationId: string
    role: 'MODERATOR' | 'EXPERT'
    joinedAt: string
  }>
}

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
  // Leer flag de migración desde variables de entorno
  const useSupabaseAuth = process.env.NEXT_PUBLIC_USE_SUPABASE_AUTH === 'true' || 
                          process.env.USE_SUPABASE_AUTH === 'true'

  console.log(`🔄 [AUTH PROVIDER] Usando ${useSupabaseAuth ? 'SUPABASE' : 'MOCK'} Auth (Fase ${process.env.MIGRATION_PHASE || '1'})`)

  if (useSupabaseAuth) {
    // FASE 2+: Usar Supabase Auth
    return (
      <SupabaseAuthProvider>
        <SupabaseAuthAdapter>
          {children}
        </SupabaseAuthAdapter>
      </SupabaseAuthProvider>
    )
  } else {
    // FASE 1: Usar Mock Auth (comportamiento actual)
    return (
      <MockAuthProvider>
        <MockAuthAdapter>
          {children}
        </MockAuthAdapter>
      </MockAuthProvider>
    )
  }
}

// Adaptador para Mock Auth (mantiene interfaces compatibles)
function MockAuthAdapter({ children }: { children: ReactNode }) {
  const mockAuth = useMockAuthOriginal()

  // Adaptar la interfaz de MockAuth a la interfaz unificada
  const adaptedAuth: AuthContextType = {
    user: mockAuth.user ? {
      id: mockAuth.user.id,
      email: mockAuth.user.email,
      role: mockAuth.user.role,
      name: mockAuth.user.name,
      avatar: mockAuth.user.avatar,
      currentOrganizationId: mockAuth.user.currentOrganizationId,
      organizations: mockAuth.user.organizations
    } : null,
    loading: mockAuth.loading,
    signIn: mockAuth.signIn,
    signUp: mockAuth.signUp,
    signOut: mockAuth.signOut,
    updateProfile: mockAuth.updateProfile,
    switchOrganization: mockAuth.switchOrganization
  }

  return (
    <AuthContext.Provider value={adaptedAuth}>
      {children}
    </AuthContext.Provider>
  )
}

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