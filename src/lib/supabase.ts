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

export interface ExpertiseArea {
  id: string
  name: string
  description: string
  category: string
  level: 'novice' | 'intermediate' | 'advanced' | 'expert'
  yearsExperience: number
  userDescription?: string
}

export interface AuthUser {
  id: string
  email: string
  role: UserRole
  name?: string
  avatar?: string
  bio?: string
  phone?: string
  linkedinUrl?: string
  profession?: string
  currentPosition?: string
  yearsExperience?: number
  organization?: string
  organizationId?: string
  currentOrganizationId?: string
  expertiseAreas?: ExpertiseArea[]
}

// Helper para obtener el usuario actual con perfil completo
export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return null
    }

    // Obtener datos completos del usuario desde la tabla profiles
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Error fetching profile data:', profileError)
      // Retornar usuario básico si no hay perfil
      return {
        id: user.id,
        email: user.email || '',
        role: 'EXPERT' // default role
      }
    }

    // Obtener áreas de expertise del usuario
    const { data: expertiseData, error: expertiseError } = await supabase
      .from('user_expertise')
      .select(`
        id,
        level,
        years_experience,
        description,
        expertise_areas (
          id,
          name,
          description,
          category
        )
      `)
      .eq('user_id', user.id)

    let expertiseAreas = []
    if (!expertiseError && expertiseData) {
      expertiseAreas = expertiseData.map(item => ({
        id: item.expertise_areas.id,
        name: item.expertise_areas.name,
        description: item.expertise_areas.description,
        category: item.expertise_areas.category,
        level: item.level,
        yearsExperience: item.years_experience,
        userDescription: item.description
      }))
    }

    return {
      id: user.id,
      email: profileData?.email || user.email || '',
      role: 'EXPERT', // Por ahora default, luego podemos agregar role a profiles
      name: profileData?.name || undefined,
      avatar: profileData?.avatar || undefined,
      bio: profileData?.bio || undefined,
      phone: profileData?.phone || undefined,
      linkedinUrl: profileData?.linkedin_url || undefined,
      profession: profileData?.profession || undefined,
      currentPosition: profileData?.current_position || undefined,
      yearsExperience: profileData?.years_experience || 0,
      organization: profileData?.organization || undefined,
      organizationId: profileData?.organization_id || undefined,
      currentOrganizationId: profileData?.current_organization_id || undefined,
      expertiseAreas
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
