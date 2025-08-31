'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { ExpertiseArea, Organization, UserRole as ProjectUserRole } from '@/types/project'
import { createMockUserProfile } from '@/utils/mockExpertiseData'
import { mockOrganizations } from '@/lib/mockData'

// Tipo simplificado para usuarios demo
interface SimpleExpertiseArea {
  name: string
  level: string
  yearsExperience: number
  description: string
}

export type UserRole = 'MODERATOR' | 'EXPERT'

export interface User {
  id: string
  email: string
  name?: string
  role: UserRole
  avatar?: string
  bio?: string
  // 🏢 MULTI-TENANT: Campos de organización
  organization?: string // Nombre de la organización (para compatibilidad)
  organizationId: string // 🆕 FK obligatorio para multi-tenant
  // 🎯 CAMPOS PARA COHERENCIA CON DASHBOARD DE EXPERTOS
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
  currentOrganization: Organization | null // 🆕 MULTI-TENANT: Organización actual
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string, role: UserRole, organizationId: string, name?: string) => Promise<{ error: string | null }>
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
  // 🆕 MULTI-TENANT: Funciones de filtrado
  getOrganizationExperts: () => any[]
  getOrganizationProjects: () => any[]
  canAccessData: (organizationId: string) => boolean
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
  organizationId: string // 🆕 MULTI-TENANT: FK obligatorio
  avatar?: string
  bio?: string
  organization?: string // Mantener para compatibilidad
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
  
  // 🏢 USUARIOS DEMO DISTRIBUIDOS POR ORGANIZACIONES
  const demoUsers = [
    // 👥 TECHCORP SOLUTIONS (ENTERPRISE)
    {
      id: 'demo_techcorp_moderator',
      email: 'moderator@techcorp.com',
      password: 'demo123',
      name: 'Carlos Díaz Polanco',
      role: 'MODERATOR' as UserRole,
      organizationId: 'org-techcorp',
      avatar: '👨‍💼',
      bio: 'Director de Análisis Prospectivos en TechCorp Solutions. Especialista en transformación digital y análisis de escenarios tecnológicos con más de 15 años de experiencia.',
      organization: 'TechCorp Solutions',
      phone: '+34 666 123 456',
      linkedinUrl: 'https://linkedin.com/in/carlos-diaz-techcorp',
      profession: 'Director de Análisis Prospectivos',
      currentPosition: 'Director de Análisis Prospectivos',
      yearsExperience: 15,
      isActive: true,
      lastLoginAt: new Date().toISOString(),
      totalProjectsParticipated: 47,
      averageResponseTime: 2.5,
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: new Date().toISOString(),
      expertiseAreas: []
    },
    {
      id: 'demo_techcorp_expert',
      email: 'expert@techcorp.com',
      password: 'demo123',
      name: 'Dra. Ana María Guerrero',
      role: 'EXPERT' as UserRole,
      organizationId: 'org-techcorp',
      avatar: '👩‍🔬',
      bio: 'Experta Senior en IA y Machine Learning en TechCorp Solutions. Doctora en Ingeniería de Sistemas con especialización en análisis predictivo y modelado de variables complejas.',
      organization: 'TechCorp Solutions',
      phone: '+34 777 987 654',
      linkedinUrl: 'https://linkedin.com/in/ana-guerrero-techcorp',
      profession: 'Doctora en Ingeniería de Sistemas',
      currentPosition: 'Experta Senior en IA',
      yearsExperience: 18,
      isActive: true,
      lastLoginAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      totalProjectsParticipated: 73,
      averageResponseTime: 1.8,
      createdAt: '2024-01-05T14:30:00Z',
      updatedAt: new Date().toISOString(),
      expertiseAreas: []
    },
    
    // 🏥 HEALTHPLUS INNOVATIONS (PRO)
    {
      id: 'demo_health_moderator',
      email: 'moderator@healthplus.org',
      password: 'demo123',
      name: 'Dr. Luis Fernando Castro',
      role: 'MODERATOR' as UserRole,
      organizationId: 'org-healthplus',
      avatar: '👨‍⚕️',
      bio: 'Director de Innovación en HealthPlus. Médico especialista en salud digital con experiencia en telemedicina y transformación digital hospitalaria.',
      organization: 'HealthPlus Innovations',
      phone: '+34 888 234 567',
      linkedinUrl: 'https://linkedin.com/in/luis-castro-healthplus',
      profession: 'Director de Innovación Digital',
      currentPosition: 'Director de Innovación',
      yearsExperience: 12,
      isActive: true,
      lastLoginAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      totalProjectsParticipated: 28,
      averageResponseTime: 3.2,
      createdAt: '2024-01-15T09:00:00Z',
      updatedAt: new Date().toISOString(),
      expertiseAreas: []
    },
    
    // 🚀 STARTUP ACCELERATOR HUB (FREE)
    {
      id: 'demo_startup_moderator',
      email: 'moderator@startup-accelerator.com',
      password: 'demo123',
      name: 'María Elena Rodríguez',
      role: 'MODERATOR' as UserRole,
      organizationId: 'org-startup',
      avatar: '👩‍💼',
      bio: 'Fundadora y CEO de Startup Accelerator Hub. Emprendedora serial con experiencia en aceleración de startups tecnológicas y análisis de mercados emergentes.',
      organization: 'Startup Accelerator Hub',
      phone: '+34 999 345 678',
      linkedinUrl: 'https://linkedin.com/in/maria-rodriguez-startup',
      profession: 'CEO y Fundadora',
      currentPosition: 'CEO',
      yearsExperience: 8,
      isActive: true,
      lastLoginAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      totalProjectsParticipated: 15,
      averageResponseTime: 4.1,
      createdAt: '2024-01-20T11:00:00Z',
      updatedAt: new Date().toISOString(),
      expertiseAreas: []
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
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null)
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
      
      // 🏢 MULTI-TENANT: Cargar organización actual
      if (currentUser?.organizationId) {
        const org = mockOrganizations.find(o => o.id === currentUser.organizationId)
        setCurrentOrganization(org || null)
      }
      
      setLoading(false)
    }, 300)
  }, [])

  const signUp = async (
    email: string, 
    password: string, 
    role: UserRole, 
    organizationId: string,
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
      
      // 🏢 MULTI-TENANT: Verificar que la organización existe
      const organization = mockOrganizations.find(o => o.id === organizationId)
      if (!organization) {
        return { error: 'Organización no encontrada' }
      }
      
      // Crear nuevo usuario
      const newStoredUser: StoredUser = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email,
        password, // En producción nunca guardar passwords en plain text
        name: name || email.split('@')[0],
        role,
        organizationId,
        organization: organization.name,
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
        organizationId: newStoredUser.organizationId,
        organization: newStoredUser.organization,
        expertiseAreas: []
      }
      
      // 🏢 MULTI-TENANT: Cargar organización
      setCurrentOrganization(organization)
      
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
        organizationId: storedUser.organizationId,
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
      
      // 🏢 MULTI-TENANT: Cargar organización
      const organization = mockOrganizations.find(o => o.id === storedUser.organizationId)
      setCurrentOrganization(organization || null)
      
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
      setCurrentOrganization(null) // 🏢 MULTI-TENANT: Limpiar organización
      
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

  // 🏢 MULTI-TENANT: Funciones de filtrado
  const getOrganizationExperts = () => {
    if (!user?.organizationId) return []
    
    // Importar dinámicamente para evitar circular dependency
    const { sampleExperts } = require('@/lib/mockData')
    return sampleExperts.filter((expert: any) => expert.organizationId === user.organizationId)
  }

  const getOrganizationProjects = () => {
    if (!user?.organizationId) return []
    
    // Importar dinámicamente para evitar circular dependency
    const { mockProjects } = require('@/lib/mockData')
    return mockProjects.filter((project: any) => project.organizationId === user.organizationId)
  }

  const canAccessData = (organizationId: string): boolean => {
    return user?.organizationId === organizationId
  }

  const value: AuthContextType = {
    user,
    currentOrganization,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    getOrganizationExperts,
    getOrganizationProjects,
    canAccessData
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
