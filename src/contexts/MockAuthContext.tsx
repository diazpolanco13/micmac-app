'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export type UserRole = 'MODERATOR' | 'EXPERT'

export interface User {
  id: string
  email: string
  name?: string
  role: UserRole
  avatar?: string
  bio?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string, role: UserRole, name?: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  updateProfile: (data: { name?: string; avatar?: string; bio?: string }) => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Simulación de usuarios en localStorage
const STORAGE_KEY = 'micmac_mock_users'
const CURRENT_USER_KEY = 'micmac_current_user'

interface StoredUser {
  id: string
  email: string
  password: string
  name: string
  role: UserRole
  avatar?: string
  bio?: string
}

const getStoredUsers = (): StoredUser[] => {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

const setStoredUsers = (users: StoredUser[]) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
}

const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem(CURRENT_USER_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

const setCurrentUser = (user: User | null) => {
  if (typeof window === 'undefined') return
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(CURRENT_USER_KEY)
  }
}

export function MockAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simular carga inicial
    setTimeout(() => {
      const currentUser = getCurrentUser()
      setUser(currentUser)
      setLoading(false)
    }, 300)
  }, [])

  const signUp = async (
    email: string, 
    password: string, 
    role: UserRole, 
    name?: string
  ): Promise<{ error: string | null }> => {
    try {
      setLoading(true)
      
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const users = getStoredUsers()
      
      // Verificar si el usuario ya existe
      if (users.find(u => u.email === email)) {
        return { error: 'Este email ya está registrado' }
      }
      
      // Crear nuevo usuario
      const newStoredUser: StoredUser = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email,
        password, // En producción nunca guardar passwords en plain text
        name: name || email.split('@')[0],
        role
      }
      
      // Guardar en "base de datos" (localStorage)
      users.push(newStoredUser)
      setStoredUsers(users)
      
      // Crear objeto User (sin password)
      const newUser: User = {
        id: newStoredUser.id,
        email: newStoredUser.email,
        name: newStoredUser.name,
        role: newStoredUser.role
      }
      
      // Iniciar sesión automáticamente
      setCurrentUser(newUser)
      setUser(newUser)
      
      return { error: null }
      
    } catch (error) {
      console.error('Mock signUp error:', error)
      return { error: 'Error inesperado durante el registro' }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (
    email: string, 
    password: string
  ): Promise<{ error: string | null }> => {
    try {
      setLoading(true)
      
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 600))
      
      const users = getStoredUsers()
      const storedUser = users.find(u => u.email === email && u.password === password)
      
      if (!storedUser) {
        return { error: 'Credenciales incorrectas' }
      }
      
      // Crear objeto User (sin password)
      const authenticatedUser: User = {
        id: storedUser.id,
        email: storedUser.email,
        name: storedUser.name,
        role: storedUser.role,
        avatar: storedUser.avatar,
        bio: storedUser.bio
      }
      
      setCurrentUser(authenticatedUser)
      setUser(authenticatedUser)
      
      return { error: null }
      
    } catch (error) {
      console.error('Mock signIn error:', error)
      return { error: 'Error inesperado durante el login' }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async (): Promise<void> => {
    try {
      setLoading(true)
      
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      setCurrentUser(null)
      setUser(null)
      
    } catch (error) {
      console.error('Mock signOut error:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (data: { 
    name?: string; 
    avatar?: string; 
    bio?: string 
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!user) {
        return { success: false, error: 'Usuario no autenticado' }
      }

      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 400))

      const users = getStoredUsers()
      const userIndex = users.findIndex(u => u.id === user.id)
      
      if (userIndex === -1) {
        return { success: false, error: 'Usuario no encontrado' }
      }

      // Actualizar datos en "base de datos" (localStorage)
      const updatedStoredUser: StoredUser = {
        ...users[userIndex],
        ...data
      }
      
      users[userIndex] = updatedStoredUser
      setStoredUsers(users)

      // Actualizar usuario actual
      const updatedUser: User = {
        ...user,
        ...data
      }
      
      setCurrentUser(updatedUser)
      setUser(updatedUser)

      return { success: true }
      
    } catch (error) {
      console.error('Mock updateProfile error:', error)
      return { success: false, error: 'Error inesperado al actualizar el perfil' }
    }
  }

  const value: AuthContextType = {
    user,
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

export function useMockAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useMockAuth must be used within a MockAuthProvider')
  }
  return context
}
