'use client'

/**
 * 🔐 Auth Context para MIC MAC Pro
 * Manejo de autenticación con Supabase y roles
 */

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { supabase, AuthUser, getCurrentUser, UserRole } from '@/lib/supabase'

interface AuthContextType {
  user: AuthUser | null
  supabaseUser: SupabaseUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string, role: UserRole, name?: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  updateProfile: (updates: { name?: string; avatar?: string }) => Promise<{ error: string | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Obtener sesión inicial
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          setSupabaseUser(session.user)
          const authUser = await getCurrentUser()
          setUser(authUser)
        }
      } catch (error) {
        console.error('Error getting initial session:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        
        if (session?.user) {
          setSupabaseUser(session.user)
          const authUser = await getCurrentUser()
          setUser(authUser)
        } else {
          setSupabaseUser(null)
          setUser(null)
        }
        
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { error: error.message }
      }

      // El usuario se actualizará automáticamente via onAuthStateChange
      return { error: null }
    } catch (error) {
      console.error('Sign in error:', error)
      return { error: 'Error inesperado durante el login' }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, role: UserRole, name?: string) => {
    try {
      setLoading(true)

      // Registrar usuario en Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role,
            name: name || email.split('@')[0]
          }
        }
      })

      if (error) {
        return { error: error.message }
      }

      if (data.user) {
        // Crear registro en tabla users
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email,
            role,
            name: name || email.split('@')[0]
          })

        if (insertError) {
          console.error('Error creating user record:', insertError)
          return { error: 'Error creando perfil de usuario' }
        }
      }

      return { error: null }
    } catch (error) {
      console.error('Sign up error:', error)
      return { error: 'Error inesperado durante el registro' }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      await supabase.auth.signOut()
      // Los estados se limpiarán automáticamente via onAuthStateChange
    } catch (error) {
      console.error('Sign out error:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: { name?: string; avatar?: string }) => {
    try {
      if (!user) {
        return { error: 'No hay usuario autenticado' }
      }

      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)

      if (error) {
        return { error: error.message }
      }

      // Actualizar estado local
      setUser(prev => prev ? { ...prev, ...updates } : null)
      
      return { error: null }
    } catch (error) {
      console.error('Update profile error:', error)
      return { error: 'Error actualizando perfil' }
    }
  }

  const value: AuthContextType = {
    user,
    supabaseUser,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Hook para verificar roles
export function useAuthRole(requiredRole?: UserRole) {
  const { user, loading } = useAuth()
  
  const hasRequiredRole = React.useMemo(() => {
    if (!user || !requiredRole) return true
    
    // MODERATOR tiene acceso a todo
    if (user.role === 'MODERATOR') return true
    
    // Verificar rol específico
    return user.role === requiredRole
  }, [user, requiredRole])

  return {
    user,
    loading,
    hasRequiredRole,
    isModerator: user?.role === 'MODERATOR',
    isExpert: user?.role === 'EXPERT'
  }
}
