'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { supabase, getCurrentUser, AuthUser } from '@/lib/supabase'
import { useToast } from './ToastContext'

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (email: string, password: string, name?: string, role?: 'MODERATOR' | 'EXPERT') => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  updateProfile: (data: { name?: string; avatar?: string }) => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function SupabaseAuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  useEffect(() => {
    // Obtener sesión inicial
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
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
          const authUser = await getCurrentUser()
          setUser(authUser)
        } else {
          setUser(null)
        }
        
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        const errorMessage = getAuthErrorMessage(error.message)
        toast.error('Error de inicio de sesión', errorMessage)
        return { success: false, error: errorMessage }
      }

      if (data.user) {
        toast.success('¡Bienvenido!', 'Has iniciado sesión correctamente')
        return { success: true }
      }

      return { success: false, error: 'Error desconocido' }
    } catch (error) {
      const errorMessage = 'Error de conexión'
      toast.error('Error', errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (
    email: string, 
    password: string, 
    name?: string, 
    role: 'MODERATOR' | 'EXPERT' = 'EXPERT'
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true)

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || '',
            role
          }
        }
      })

      if (error) {
        const errorMessage = getAuthErrorMessage(error.message)
        toast.error('Error de registro', errorMessage)
        return { success: false, error: errorMessage }
      }

      if (data.user) {
        // Crear registro en la tabla users
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: data.user.email!,
            role,
            name: name || null
          })

        if (profileError) {
          console.error('Error creating user profile:', profileError)
        }

        toast.success('¡Cuenta creada!', 'Revisa tu email para confirmar la cuenta')
        return { success: true }
      }

      return { success: false, error: 'Error desconocido' }
    } catch (error) {
      const errorMessage = 'Error de conexión'
      toast.error('Error', errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        toast.error('Error', 'No se pudo cerrar la sesión')
        console.error('Error signing out:', error)
      } else {
        toast.info('Sesión cerrada', 'Has cerrado sesión correctamente')
        setUser(null)
      }
    } catch (error) {
      console.error('Error signing out:', error)
      toast.error('Error', 'Error de conexión al cerrar sesión')
    }
  }

  const updateProfile = async (data: { 
    name?: string; 
    avatar?: string 
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!user) {
        return { success: false, error: 'Usuario no autenticado' }
      }

      // Actualizar en Supabase Auth si incluye metadata
      if (data.name) {
        const { error: authError } = await supabase.auth.updateUser({
          data: { name: data.name }
        })

        if (authError) {
          console.error('Error updating auth user:', authError)
        }
      }

      // Actualizar en tabla users
      const { error: profileError } = await supabase
        .from('users')
        .update(data)
        .eq('id', user.id)

      if (profileError) {
        const errorMessage = 'Error actualizando perfil'
        toast.error('Error', errorMessage)
        return { success: false, error: errorMessage }
      }

      // Actualizar estado local
      setUser(prev => prev ? { ...prev, ...data } : null)
      toast.success('Perfil actualizado', 'Los cambios se han guardado correctamente')
      
      return { success: true }
    } catch (error) {
      const errorMessage = 'Error de conexión'
      toast.error('Error', errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signUp,
      signOut,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// Helper para mensajes de error más amigables
function getAuthErrorMessage(error: string): string {
  switch (error) {
    case 'Invalid login credentials':
      return 'Email o contraseña incorrectos'
    case 'Email not confirmed':
      return 'Por favor confirma tu email antes de iniciar sesión'
    case 'User already registered':
      return 'Este email ya está registrado'
    case 'Password should be at least 6 characters':
      return 'La contraseña debe tener al menos 6 caracteres'
    case 'Unable to validate email address: invalid format':
      return 'Formato de email inválido'
    case 'Signup is disabled':
      return 'El registro está deshabilitado'
    default:
      return error
  }
}

// Versión simplificada para desarrollo/testing (mantener MockAuthContext disponible)
export const useMockSupabaseAuth = () => {
  return {
    user: {
      id: 'dev-user-1',
      email: 'dev@micmac.com',
      role: 'MODERATOR' as const,
      name: 'Usuario de Desarrollo'
    },
    loading: false,
    signIn: async () => ({ success: true }),
    signUp: async () => ({ success: true }),
    signOut: async () => {},
    updateProfile: async () => ({ success: true })
  }
}
