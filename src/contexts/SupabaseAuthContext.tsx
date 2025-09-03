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
      
      // Intentar cerrar sesión en Supabase
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('⚠️ [signOut] Error en Supabase signOut:', error)
        toast.error('Advertencia', 'Sesión cerrada localmente, pero hubo un error en el servidor')
      } else {
        console.log('✅ [signOut] Sesión cerrada correctamente')
        toast.info('Sesión cerrada', 'Has cerrado sesión correctamente')
      }
      
      // Redireccionar a home independientemente del resultado
      setTimeout(() => {
        window.location.href = '/'
      }, 500)
      
    } catch (error) {
      console.error('❌ [signOut] Error crítico:', error)
      
      // Aún así limpiar estado local y redireccionar
      setUser(null)
      setLoading(false)
      toast.info('Sesión cerrada', 'Sesión cerrada localmente')
      
      setTimeout(() => {
        window.location.href = '/'
      }, 500)
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

      // Actualizar en Supabase Auth si incluye metadata
      if (data.name) {
        const { error: authError } = await supabase.auth.updateUser({
          data: { name: data.name }
        })

        if (authError) {
          console.error('Error updating auth user:', authError)
        }
      }

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

      // TODO: Actualizar expertiseAreas si se proporcionaron
      if (expertiseAreasToUpdate) {
        console.log('🎯 [SUPABASE] Actualizando áreas de expertise...')
        // Por ahora solo loggeamos, implementaremos la actualización después
        console.log('⚠️  [SUPABASE] Actualización de expertiseAreas pendiente de implementar')
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
