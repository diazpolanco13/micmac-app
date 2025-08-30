'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { ExpertiseArea } from '@/types/project'
import { createMockUserProfile } from '@/utils/mockExpertiseData'

export type UserRole = 'MODERATOR' | 'EXPERT'

export interface User {
  id: string
  email: string
  name?: string
  role: UserRole
  avatar?: string
  bio?: string
  // 🎯 CAMPOS PARA COHERENCIA CON DASHBOARD DE EXPERTOS
  organization?: string
  phone?: string
  linkedinUrl?: string
  profession?: string
  currentPosition?: string
  yearsExperience?: number
  isActive?: boolean
  lastLoginAt?: string
  totalProjectsParticipated?: number
  averageResponseTime?: number
  createdAt?: string
  updatedAt?: string
  expertiseAreas: ExpertiseArea[]
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string, role: UserRole, name?: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  updateProfile: (data: { 
    name?: string; 
    avatar?: string; 
    bio?: string;
    organization?: string;
    phone?: string;
    linkedinUrl?: string;
    profession?: string;
    currentPosition?: string;
    yearsExperience?: number;
    expertiseAreas?: ExpertiseArea[];
  }) => Promise<{ success: boolean; error?: string }>
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
  organization?: string
  phone?: string
  linkedinUrl?: string
  profession?: string
  currentPosition?: string
  yearsExperience?: number
  isActive?: boolean
  lastLoginAt?: string
  totalProjectsParticipated?: number
  averageResponseTime?: number
  createdAt?: string
  updatedAt?: string
  expertiseAreas: ExpertiseArea[]
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

// Función para inicializar usuarios demo
const initializeDemoUsers = () => {
  const users = getStoredUsers()
  
  // Usuarios demo para testing
  const demoUsers = [
    {
      id: 'demo_moderator',
      email: 'demo@demo.com',
      password: 'demo123',
      name: 'Carlos Díaz Polanco',
      role: 'MODERATOR' as UserRole,
      avatar: '👨‍💼',
      bio: 'Especialista en análisis prospectivos y metodologías MIC MAC con más de 15 años de experiencia en consultoría estratégica. Apasionado por la transformación digital y el análisis de escenarios futuros.',
      organization: 'MIC MAC Pro Consulting',
      phone: '+57 300 123 4567',
      linkedinUrl: 'https://linkedin.com/in/carlos-diaz-polanco',
      profession: 'Consultor en Prospectiva Estratégica',
      currentPosition: 'Director de Análisis Prospectivos',
      yearsExperience: 15,
      isActive: true,
      lastLoginAt: new Date().toISOString(),
      totalProjectsParticipated: 47,
      averageResponseTime: 2.5,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: new Date().toISOString(),
      expertiseAreas: [
        {
          name: 'Análisis Prospectivo',
          level: 'EXPERTO' as ExpertiseLevel,
          yearsExperience: 15,
          description: 'Metodologías avanzadas de prospectiva estratégica y construcción de escenarios'
        },
        {
          name: 'Metodología MIC MAC',
          level: 'EXPERTO' as ExpertiseLevel,
          yearsExperience: 12,
          description: 'Implementación y optimización de análisis estructural MIC MAC'
        },
        {
          name: 'Gestión de Proyectos',
          level: 'AVANZADO' as ExpertiseLevel,
          yearsExperience: 10,
          description: 'Coordinación de equipos multidisciplinarios en proyectos de consultoría'
        }
      ]
    },
    {
      id: 'demo_expert',
      email: 'expert@micmac.com',
      password: 'demo123',
      name: 'Dra. Ana María Guerrero',
      role: 'EXPERT' as UserRole,
      avatar: '👩‍🔬',
      bio: 'Doctora en Ingeniería de Sistemas con especialización en análisis de variables complejas y modelado predictivo. Investigadora activa en universidades de prestigio con múltiples publicaciones en revistas indexadas.',
      organization: 'Universidad Nacional de Colombia',
      phone: '+57 310 987 6543',
      linkedinUrl: 'https://linkedin.com/in/ana-guerrero-phd',
      profession: 'Doctora en Ingeniería de Sistemas',
      currentPosition: 'Profesora Titular - Investigadora Senior',
      yearsExperience: 18,
      isActive: true,
      lastLoginAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 horas atrás
      totalProjectsParticipated: 73,
      averageResponseTime: 1.8,
      createdAt: '2023-08-20T14:30:00Z',
      updatedAt: new Date().toISOString(),
      expertiseAreas: [
        {
          name: 'Sistemas Complejos',
          level: 'EXPERTO' as ExpertiseLevel,
          yearsExperience: 18,
          description: 'Análisis y modelado de sistemas complejos adaptativos'
        },
        {
          name: 'Inteligencia Artificial',
          level: 'EXPERTO' as ExpertiseLevel,
          yearsExperience: 12,
          description: 'Machine Learning aplicado a análisis predictivo y prospectiva'
        },
        {
          name: 'Análisis de Datos',
          level: 'EXPERTO' as ExpertiseLevel,
          yearsExperience: 15,
          description: 'Procesamiento y análisis estadístico avanzado de grandes volúmenes de datos'
        },
        {
          name: 'Investigación Académica',
          level: 'EXPERTO' as ExpertiseLevel,
          yearsExperience: 16,
          description: 'Metodología de investigación científica y publicación académica'
        },
        {
          name: 'Sostenibilidad Ambiental',
          level: 'AVANZADO' as ExpertiseLevel,
          yearsExperience: 8,
          description: 'Análisis de impacto ambiental y desarrollo sostenible'
        }
      ]
    }
  ]
  
  // Agregar usuarios demo si no existen
  demoUsers.forEach(demoUser => {
    if (!users.find(u => u.email === demoUser.email)) {
      users.push(demoUser as StoredUser)
    }
  })
  
  setStoredUsers(users)
}

export function MockAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simular carga inicial
    setTimeout(() => {
      // Inicializar usuarios demo
      initializeDemoUsers()
      
      let currentUser = getCurrentUser()
      
      // Solo mantener el usuario si existe y es válido
      // NO crear automáticamente un usuario demo
      
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
      await new Promise(resolve => setTimeout(resolve, 100))
      
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
        role,
        expertiseAreas: []
      }
      
      // Guardar en "base de datos" (localStorage)
      users.push(newStoredUser)
      setStoredUsers(users)
      
      // Crear objeto User (sin password)
      const newUser: User = {
        id: newStoredUser.id,
        email: newStoredUser.email,
        name: newStoredUser.name,
        role: newStoredUser.role,
        expertiseAreas: []
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
      await new Promise(resolve => setTimeout(resolve, 100))
      
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
        bio: storedUser.bio,
                  organization: storedUser.organization,
          phone: storedUser.phone,
          linkedinUrl: storedUser.linkedinUrl,
          profession: storedUser.profession,
          currentPosition: storedUser.currentPosition,
          yearsExperience: storedUser.yearsExperience,
          isActive: storedUser.isActive,
          lastLoginAt: storedUser.lastLoginAt,
          totalProjectsParticipated: storedUser.totalProjectsParticipated,
          averageResponseTime: storedUser.averageResponseTime,
          createdAt: storedUser.createdAt,
          updatedAt: storedUser.updatedAt,
          expertiseAreas: storedUser.expertiseAreas || []
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
      await new Promise(resolve => setTimeout(resolve, 50))
      
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
    bio?: string;
    organization?: string;
    phone?: string;
    linkedinUrl?: string;
    profession?: string;
    currentPosition?: string;
    expertiseAreas?: ExpertiseArea[];
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!user) {
        return { success: false, error: 'Usuario no autenticado' }
      }

      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 100))

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
