'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { supabase, getCurrentUser, AuthUser } from '@/lib/supabase'
import { useToast } from './ToastContext'

interface AuthContextType {
  user: AuthUser | null
  currentOrganization: any | null
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
        console.log(`🔄 [AUTH] Estado cambió: ${event} | Usuario: ${session?.user?.email || 'ninguno'}`)
        
        if (session?.user) {
          // 🔄 OPTIMIZACIÓN: Solo recargar usuario completo en login/signup, no en updates
          if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
            console.log('👤 [AUTH] Cargando perfil completo de usuario...')
            const authUser = await getCurrentUser()
            setUser(authUser)
          } else if (event === 'USER_UPDATED') {
            console.log('⚡ [AUTH] Usuario actualizado - manteniendo datos existentes')
            // No recargar todo, mantener el estado actual
          }
        } else {
          console.log('👋 [AUTH] Usuario desconectado - limpiando estado')
          setUser(null)
        }
        
        setLoading(false)
      }
    )

    // 🔄 DESHABILITADO TEMPORALMENTE: Evento personalizado causa errores dataset
    // const handleUserUpdate = async () => {
    //   console.log('🔄 [AuthContext] Usuario actualizado por evento personalizado')
    //   try {
    //     const { data: { session } } = await supabase.auth.getSession()
    //     if (session?.user) {
    //       const authUser = await getCurrentUser()
    //       setUser(authUser)
    //       console.log('✅ [AuthContext] Usuario reactualizado exitosamente')
    //     }
    //   } catch (error) {
    //     console.error('❌ [AuthContext] Error actualizando usuario:', error)
    //   }
    // }

    // window.addEventListener('supabase-user-updated', handleUserUpdate)

    return () => {
      subscription.unsubscribe()
      // window.removeEventListener('supabase-user-updated', handleUserUpdate)
    }
  }, [])

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true)
      console.log('🔐 [signIn] Intentando login para:', email)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        console.error('❌ [signIn] Error de Supabase:', error.message)
        const errorMessage = getAuthErrorMessage(error.message)
        toast.error('Error de inicio de sesión', errorMessage)
        return { success: false, error: errorMessage }
      }

      if (data.user) {
        console.log('✅ [signIn] Login exitoso para:', data.user.email)
        toast.success('¡Bienvenido!', 'Has iniciado sesión correctamente')
        return { success: true }
      }

      console.error('❌ [signIn] No se recibió usuario en respuesta')
      return { success: false, error: 'Error desconocido' }
    } catch (error) {
      console.error('❌ [signIn] Error crítico:', error)
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
      console.log('🚪 [signOut] Iniciando cierre de sesión...')
      
      // Limpiar estado inmediatamente para UX rápida
      setUser(null)
      setLoading(false)
      
      // Limpiar sesión en Supabase con scope global para todas las pestañas
      const { error } = await supabase.auth.signOut({ scope: 'global' })
      
      if (error) {
        console.error('⚠️ [signOut] Error en Supabase signOut:', error)
        toast.error('Advertencia', 'Sesión cerrada localmente, pero hubo un error en el servidor')
      } else {
        console.log('✅ [signOut] Sesión cerrada correctamente en todas las pestañas')
        toast.info('Sesión cerrada', 'Has cerrado sesión correctamente')
      }
      
      // Limpiar localStorage manualmente como medida extra
      if (typeof window !== 'undefined') {
        // Limpiar específicamente las claves de Supabase
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('sb-') || key.includes('supabase')) {
            localStorage.removeItem(key)
          }
        })
        console.log('🧹 [signOut] localStorage limpiado')
      }
      
      // Redireccionar usando replace para no mantener historial
      setTimeout(() => {
        window.location.replace('/')
      }, 200)
      
    } catch (error) {
      console.error('❌ [signOut] Error crítico:', error)
      
      // Aún así limpiar estado local y redireccionar
      setUser(null)
      setLoading(false)
      
      // Limpiar localStorage manualmente
      if (typeof window !== 'undefined') {
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('sb-') || key.includes('supabase')) {
            localStorage.removeItem(key)
          }
        })
      }
      
      toast.info('Sesión cerrada', 'Sesión cerrada localmente')
      
      setTimeout(() => {
        window.location.replace('/')
      }, 200)
    }
  }

  const updateProfile = async (data: { 
    name?: string; 
    avatar?: string;
    bio?: string;
    // Campos adicionales que intentará actualizar (si existen en BD)
    phone?: string;
    linkedinUrl?: string;
    profession?: string;
    currentPosition?: string;
    yearsExperience?: number;
    organization?: string;
    [key: string]: any; // Permitir campos adicionales
  }): Promise<{ success: boolean; error?: string }> => {
    console.log('🔄 [SUPABASE] Iniciando updateProfile con datos:', data)
    console.log('👤 [SUPABASE] Usuario actual:', { id: user?.id, email: user?.email })
    
    try {
      if (!user) {
        console.error('❌ [SUPABASE] No hay usuario autenticado')
        return { success: false, error: 'Usuario no autenticado' }
      }

      // 🔄 OPTIMIZACIÓN: No actualizar Supabase Auth para evitar auth state change
      // Solo actualizar la tabla profiles es suficiente
      console.log('⚡ [SUPABASE] Saltando actualización de auth.users para evitar loops')

      // Mapear campos del formulario a campos de la tabla profiles
      const fieldMapping: { [key: string]: string } = {
        'linkedinUrl': 'linkedin_url',
        'currentPosition': 'current_position',
        'yearsExperience': 'years_experience',
        'organizationId': 'organization_id',
        'currentOrganizationId': 'current_organization_id'
      };

      // Convertir campos con nombres diferentes y filtrar campos no soportados
      const mappedData: { [key: string]: any } = {};
      let expertiseAreasToUpdate = null;
      
      Object.entries(data).forEach(([key, value]) => {
        // Manejar expertiseAreas por separado
        if (key === 'expertiseAreas') {
          expertiseAreasToUpdate = value;
          console.log('📋 [SUPABASE] ExpertiseAreas será actualizado por separado:', value);
          return;
        }
        
        const dbField = fieldMapping[key] || key;
        mappedData[dbField] = value;
      });

      // Actualizar en tabla profiles (todos los campos son válidos)
      console.log('🔄 [SUPABASE] Actualizando perfil con datos:', mappedData)
      console.log('🔑 [SUPABASE] ID del usuario:', user.id)
      
      // 🔍 VERIFICAR SESIÓN ANTES DE UPDATE
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      console.log('🔐 [SUPABASE] Sesión actual:', { 
        hasSession: !!session, 
        userId: session?.user?.id,
        sessionError: sessionError?.message 
      })
      
      // 🔄 Actualizar directamente con RLS corregido (sin timeout)
      console.log('⏰ [SUPABASE] Iniciando UPDATE directo con RLS corregido...')
      
      const { error: profileError } = await supabase
        .from('profiles')
        .update(mappedData)
        .eq('id', user.id)

      if (profileError) {
        console.error('❌ [SUPABASE] Error actualizando perfil:', profileError)
        console.error('📊 [SUPABASE] Datos enviados:', mappedData)
        const errorMessage = `Error actualizando perfil: ${profileError.message || profileError.code || 'Error desconocido'}`
        toast.error('Error', errorMessage)
        return { success: false, error: errorMessage }
      }

      // 🎯 Actualizar expertiseAreas si se proporcionaron
      if (expertiseAreasToUpdate && Array.isArray(expertiseAreasToUpdate)) {
        console.log('🎯 [SUPABASE] Actualizando áreas de expertise...', expertiseAreasToUpdate)
        
        try {
          // 1. Eliminar áreas de expertise existentes del usuario
          const { error: deleteError } = await supabase
            .from('user_expertise')
            .delete()
            .eq('user_id', user.id)
          
          if (deleteError) {
            console.error('❌ [SUPABASE] Error eliminando expertise areas existentes:', deleteError)
          } else {
            console.log('🧹 [SUPABASE] Áreas de expertise existentes eliminadas')
          }
          
          // 2. Insertar nuevas áreas de expertise
          if (expertiseAreasToUpdate.length > 0) {
            const expertiseData = expertiseAreasToUpdate.map((area: any) => ({
              user_id: user.id,
              expertise_area_id: area.id,
              level: area.level || 1,
              years_experience: area.yearsExperience || 0,
              description: area.userDescription || ''
            }))
            
            const { error: insertError } = await supabase
              .from('user_expertise')
              .insert(expertiseData)
            
            if (insertError) {
              console.error('❌ [SUPABASE] Error insertando expertise areas:', insertError)
              toast.error('Error', 'No se pudieron guardar las áreas de expertise')
            } else {
              console.log('✅ [SUPABASE] Áreas de expertise guardadas exitosamente')
              toast.success('Expertise actualizada', 'Las áreas de expertise se han guardado correctamente')
            }
          }
          
        } catch (expertiseError) {
          console.error('💥 [SUPABASE] Error general actualizando expertise:', expertiseError)
          toast.error('Error', 'Error actualizando áreas de expertise')
        }
      }

      // Actualizar estado local con los datos originales
      console.log('✅ [SUPABASE] Perfil actualizado exitosamente')
      setUser(prev => prev ? { ...prev, ...data } : null)
      toast.success('Perfil actualizado', 'Los cambios se han guardado correctamente')
      
      return { success: true }
    } catch (error) {
      console.error('💥 [SUPABASE] Error general en updateProfile:', error)
      console.error('📊 [SUPABASE] Stack trace:', error instanceof Error ? error.stack : 'No stack available')
      const errorMessage = `Error de conexión: ${error instanceof Error ? error.message : 'Error desconocido'}`
      toast.error('Error', errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      currentOrganization: user?.currentOrganization || null,
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
