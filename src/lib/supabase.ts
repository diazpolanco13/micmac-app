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
  organizations?: Array<{
    id: string
    organizationId: string
    name: string
    slug: string
    domain?: string
    logo?: string
    settings?: any
    role: 'OWNER' | 'ADMIN' | 'MODERATOR' | 'MEMBER'
    status: 'ACTIVE' | 'INACTIVE' | 'PENDING'
    joinedAt: string
    isActive: boolean
  }>
  currentOrganization?: {
    id: string
    organizationId: string
    name: string
    slug: string
    domain?: string
    logo?: string
    settings?: any
    role: 'OWNER' | 'ADMIN' | 'MODERATOR' | 'MEMBER'
    status: 'ACTIVE' | 'INACTIVE' | 'PENDING'
    joinedAt: string
    isActive: boolean
  }
  expertiseAreas?: ExpertiseArea[]
}

// Helper para obtener el usuario actual con perfil completo
export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    console.log('🔍 [getCurrentUser] Iniciando obtención de usuario...')
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      console.log('ℹ️ [getCurrentUser] No hay usuario autenticado (normal después de logout)')
      return null
    }

    console.log('✅ [getCurrentUser] Usuario autenticado:', user.email)

    // OPTIMIZACIÓN: Consultas en paralelo con timeout
    const profilePromise = supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    const userRolePromise = supabase
      .from('users')
      .select('role, name')
      .eq('id', user.id)
      .maybeSingle()

    const expertisePromise = supabase
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

    // 🏢 NUEVA CONSULTA: Organizaciones del usuario
    const organizationsPromise = supabase
      .from('user_organizations')
      .select(`
        id,
        role,
        status,
        joined_at,
        organizations (
          id,
          name,
          slug,
          domain,
          logo,
          settings,
          is_active
        )
      `)
      .eq('user_id', user.id)
      .eq('status', 'ACTIVE')

    // Ejecutar consultas en paralelo con timeout de 8 segundos
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout: Consultas BD tardaron más de 8s')), 8000)
    )

    try {
      console.log('🔍 [getCurrentUser] Ejecutando consultas en paralelo...')
      const [profileResult, userRoleResult, expertiseResult, organizationsResult] = await Promise.race([
        Promise.all([profilePromise, userRolePromise, expertisePromise, organizationsPromise]),
        timeoutPromise
      ]) as any[]

      const { data: profileData, error: profileError } = profileResult
      let { data: userRoleData, error: userRoleError } = userRoleResult
      const { data: expertiseData, error: expertiseError } = expertiseResult
      const { data: organizationsData, error: organizationsError } = organizationsResult

      if (profileError) {
        console.error('⚠️ [getCurrentUser] Error profile:', profileError)
      }

      if (userRoleError) {
        console.error('⚠️ [getCurrentUser] Error user role:', userRoleError)
        console.log('🔍 [getCurrentUser] Intentando obtener rol de auth.users directamente...')
        
        // Fallback: usar rol por defecto pero continuar con el perfil
        userRoleData = { role: 'EXPERT', name: null }
      }

      let expertiseAreas = []
      if (!expertiseError && expertiseData) {
        console.log(`🔍 [getCurrentUser] Procesando ${expertiseData.length} áreas de expertise para ${user.email}`)
        
        // Identificar y limpiar registros corruptos automáticamente
        const corruptedItems = expertiseData.filter((item: any) => !item.expertise_areas || !item.expertise_areas.id)
        
        if (corruptedItems.length > 0) {
          console.warn(`🧹 [getCurrentUser] Encontrados ${corruptedItems.length} registros corruptos para ${user.email}, limpiando SINCRÓNICAMENTE...`)
          
          // Limpiar registros corruptos de forma SÍNCRONA para evitar que se muestren
          try {
            const corruptedIds = corruptedItems.map((item: any) => item.id).filter(Boolean)
            if (corruptedIds.length > 0) {
              const { error: deleteError } = await supabase
                .from('user_expertise')
                .delete()
                .in('id', corruptedIds)
              
              if (deleteError) {
                console.error(`❌ [getCurrentUser] Error limpiando registros corruptos:`, deleteError)
              } else {
                console.log(`✅ [getCurrentUser] ${corruptedIds.length} registros corruptos eliminados SINCRÓNICAMENTE para ${user.email}`)
              }
            }
            
            // También limpiar por user_id para casos edge
            const { error: cleanupError } = await supabase
              .from('user_expertise')
              .delete()
              .eq('user_id', user.id)
              .is('expertise_area_id', null)
            
            if (!cleanupError) {
              console.log(`🧹 [getCurrentUser] Limpieza adicional completada para ${user.email}`)
            }
            
          } catch (error) {
            console.error(`❌ [getCurrentUser] Error en limpieza síncrona:`, error)
          }
        }
        
        expertiseAreas = expertiseData
          .filter((item: any) => {
            if (!item.expertise_areas) {
              console.warn(`⚠️ [getCurrentUser] Área de expertise sin datos para ${user.email} (será eliminada):`, item.id)
              return false
            }
            return true
          })
          .map((item: any) => ({
            id: item.expertise_areas?.id || 'unknown',
            name: item.expertise_areas?.name || 'Área sin nombre',
            description: item.expertise_areas?.description || '',
            category: item.expertise_areas?.category || 'General',
            level: item.level || 1,
            context: item.context || ['PROFESSIONAL'], // 🔄 INCLUIR CONTEXTOS
            educationLevel: item.education_level || undefined, // 🔄 INCLUIR FORMACIÓN
            yearsExperience: item.years_experience || 0,
            userDescription: item.description || ''
          }))
        
        console.log(`✅ [getCurrentUser] ${expertiseAreas.length} áreas de expertise válidas procesadas`)
      }

      // 🏢 PROCESAR ORGANIZACIONES
      let organizations = []
      let currentOrganization = null
      let effectiveRole = userRoleData?.role || 'EXPERT' // Rol por defecto
      
      if (!organizationsError && organizationsData && organizationsData.length > 0) {
        console.log(`🔍 [getCurrentUser] Procesando ${organizationsData.length} organizaciones para ${user.email}`)
        
        organizations = organizationsData.map((membership: any, index: number) => {
          console.log(`🔍 [getCurrentUser] Org ${index}:`, {
            membershipId: membership?.id,
            orgExists: !!membership.organizations,
            orgId: membership.organizations?.id
          })
          
          if (!membership.organizations) {
            console.warn(`⚠️ [getCurrentUser] Membership sin organización para ${user.email}:`, membership)
          }
          
          return {
            id: membership.id || `fallback-${index}`,
            organizationId: membership.organizations?.id || 'unknown',
            name: membership.organizations?.name || 'Organización',
            slug: membership.organizations?.slug || '',
            domain: membership.organizations?.domain || '',
            logo: membership.organizations?.logo || null,
            settings: membership.organizations?.settings || {},
            role: membership.role || 'MEMBER',
            status: membership.status || 'ACTIVE',
            joinedAt: membership.joined_at || new Date().toISOString(),
            isActive: membership.organizations?.is_active ?? true
          }
        })

        // Determinar organización activa
        // Prioridad: current_organization_id del perfil > primera organización activa
        const currentOrgId = profileData?.current_organization_id
        if (currentOrgId) {
          currentOrganization = organizations.find((org: any) => org.organizationId === currentOrgId)
        }
        
        if (!currentOrganization && organizations.length > 0) {
          currentOrganization = organizations[0] // Primera organización como fallback
        }

        // 🔧 DETERMINAR ROL EFECTIVO: Usar rol de organización activa si existe
        if (currentOrganization) {
          effectiveRole = currentOrganization.role // Rol específico de la organización activa
          console.log(`🏢 [getCurrentUser] Rol en organización ${currentOrganization.name}: ${effectiveRole}`)
        }
      }

      console.log(`✅ [getCurrentUser] Datos cargados: ${expertiseAreas.length} areas de expertise, ${organizations.length} organizaciones`)
      
      console.log(`✅ [getCurrentUser] Usuario cargado: ${user.email} (${userRoleData?.role}) - Org actual: ${currentOrganization?.name || 'N/A'}`)
      
      return {
        id: user.id,
        email: profileData?.email || user.email || '',
        role: effectiveRole,
        name: profileData?.name || userRoleData?.name || undefined,
        avatar: profileData?.avatar || undefined,
        bio: profileData?.bio || undefined,
        phone: profileData?.phone || undefined,
        linkedinUrl: profileData?.linkedin_url || undefined,
        profession: profileData?.profession || undefined,
        currentPosition: profileData?.current_position || undefined,
        yearsExperience: profileData?.years_experience || 0,
        organization: profileData?.organization || currentOrganization?.name || undefined,
        organizationId: profileData?.organization_id || currentOrganization?.organizationId || undefined,
        currentOrganizationId: profileData?.current_organization_id || currentOrganization?.organizationId || undefined,
        organizations,
        currentOrganization,
        expertiseAreas
      }
      
    } catch (timeoutError) {
      console.error('⏰ [getCurrentUser] TIMEOUT - Retornando usuario básico:', timeoutError)
      // Usuario básico con organización por defecto para evitar errores
      return {
        id: user.id,
        email: user.email || '',
        role: 'EXPERT',
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'Usuario',
        currentOrganizationId: 'org-techcorp',
        organizations: [{
          id: 'fallback',
          organizationId: 'org-techcorp',
          name: 'TechCorp Solutions',
          slug: 'techcorp',
          role: 'MEMBER',
          status: 'ACTIVE',
          joinedAt: new Date().toISOString(),
          isActive: true
        }],
        expertiseAreas: []
      }
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
