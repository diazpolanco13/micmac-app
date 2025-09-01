/**
 * 🔐 Supabase Client Configuration
 * Cliente configurado para MIC MAC Pro con SSR support
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lsnevmeibbkclblcsauu.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzbmV2bWVpYmJrY2xibGNzYXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NTcxMDQsImV4cCI6MjA3MjMzMzEwNH0.IkTPGY6c1dyGmWAa3Z7hQpJ5yEHN1l7O0OnrvFzAWYI'

// Cliente principal de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Configuración para server-side
export const createServerSupabaseClient = () => {
  return createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      }
    }
  )
}

// Helper para verificar si el cliente está configurado
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey)
}

// Tipos de autenticación
export type UserRole = 'MODERATOR' | 'EXPERT'

export interface AuthUser {
  id: string
  email: string
  role: UserRole
  name?: string
  avatar?: string
}

// Helper para obtener el usuario actual con rol
export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return null
    }

    // Obtener datos adicionales del usuario desde la tabla users
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role, name, avatar')
      .eq('id', user.id)
      .single()

    if (userError) {
      console.error('Error fetching user data:', userError)
      // Retornar usuario básico si no hay datos adicionales
      return {
        id: user.id,
        email: user.email || '',
        role: 'EXPERT' // default role
      }
    }

    return {
      id: user.id,
      email: user.email || '',
      role: userData?.role || 'EXPERT',
      name: userData?.name || undefined,
      avatar: userData?.avatar || undefined
    }
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

// Helper para verificar roles
export const hasRole = (user: AuthUser | null, requiredRole: UserRole): boolean => {
  if (!user) return false
  
  // MODERATOR tiene acceso a todo
  if (user.role === 'MODERATOR') return true
  
  // Verificar rol específico
  return user.role === requiredRole
}

// Helper para verificar si es moderador
export const isModerator = (user: AuthUser | null): boolean => {
  return hasRole(user, 'MODERATOR')
}

// Helper para verificar si es experto
export const isExpert = (user: AuthUser | null): boolean => {
  return hasRole(user, 'EXPERT')
}
