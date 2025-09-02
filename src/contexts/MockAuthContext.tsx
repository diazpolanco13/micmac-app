'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import type { ExpertiseArea, Organization, UserRole, MultiOrgUser, UserOrganization } from '@/types/project'
import { createMockUserProfile } from '@/utils/mockExpertiseData'
import { mockOrganizations } from '@/lib/mockData'
import { secureOrganizationFilter, validateUserOrganizationAccess } from '@/utils/dataIsolation'

// Tipo simplificado para usuarios demo
interface SimpleExpertiseArea {
  name: string
  level: string
  yearsExperience: number
  description: string
}

// 🔄 UserRole ahora viene de project.ts (incluye OWNER, ADMIN)

export interface User {
  id: string
  email: string
  name?: string
  role: UserRole
  avatar?: string
  bio?: string
  // 🏢 MULTI-ORGANIZACIONAL: Campos actualizados
  organization?: string // Nombre de la organización actual (para compatibilidad)
  organizationId: string // 🆕 FK de la organización actual
  currentOrganizationId?: string // 🔄 NUEVO: Organización activa (puede ser null)
  organizations?: UserOrganization[] // 🔄 NUEVO: Múltiples organizaciones
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
  
  // 🔄 NUEVO: Funciones multi-organizacionales
  switchOrganization: (organizationId: string) => Promise<{ success: boolean; error?: string }>
  createOrganization: (data: { name: string; description?: string; plan?: 'FREE' | 'PRO' | 'ENTERPRISE' }) => Promise<{ success: boolean; error?: string; organizationId?: string }>
  getUserOrganizations: () => UserOrganization[]
  getCurrentRole: () => UserRole | null
  canCreateOrganization: () => boolean
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
  organizationId: string // 🆕 MULTI-TENANT: FK obligatorio (compatibilidad)
  currentOrganizationId?: string // 🔄 NUEVO: Organización activa
  organizations?: UserOrganization[] // 🔄 NUEVO: Múltiples organizaciones
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
  
  // 🔄 LIMPIAR DATOS OBSOLETOS: Si existe el usuario multi-org con datos antiguos, eliminarlo
  const existingMultiUser = users.findIndex(u => u.email === 'multi@demo.com')
  if (existingMultiUser !== -1) {
    users.splice(existingMultiUser, 1) // Eliminar versión antigua
  }
  
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
      currentOrganizationId: 'org-techcorp',
      organizations: [
        {
          organizationId: 'org-techcorp',
          role: 'MODERATOR' as UserRole,
          joinedAt: '2024-01-01T10:00:00Z',
          status: 'ACTIVE' as const
        }
      ],
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
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
      currentOrganizationId: 'org-techcorp',
      organizations: [
        {
          organizationId: 'org-techcorp',
          role: 'EXPERT' as UserRole,
          joinedAt: '2024-01-05T14:30:00Z',
          status: 'ACTIVE' as const
        }
      ],
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
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
      currentOrganizationId: 'org-healthplus',
      organizations: [
        {
          organizationId: 'org-healthplus',
          role: 'MODERATOR' as UserRole,
          joinedAt: '2024-01-15T09:00:00Z',
          status: 'ACTIVE' as const
        }
      ],
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
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
      currentOrganizationId: 'org-startup',
      organizations: [
        {
          organizationId: 'org-startup',
          role: 'MODERATOR' as UserRole,
          joinedAt: '2024-01-20T11:00:00Z',
          status: 'ACTIVE' as const
        }
      ],
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1e1?w=150&h=150&fit=crop&crop=face',
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
    },
    
    // 🌐 USUARIO MULTI-ORGANIZACIONAL DEMO (para testing)
    {
      id: 'demo_multiorg_user',
      email: 'multi@demo.com',
      password: 'demo123',
      name: 'Alex Multi-Org',
      role: 'MODERATOR' as UserRole,
      organizationId: 'org-techcorp', // Organización activa inicial
      currentOrganizationId: 'org-techcorp',
      organizations: [
        {
          organizationId: 'org-techcorp',
          role: 'MODERATOR' as UserRole,
          joinedAt: '2024-01-01T10:00:00Z',
          status: 'ACTIVE' as const
        },
        {
          organizationId: 'org-healthplus',
          role: 'MODERATOR' as UserRole,
          joinedAt: '2024-02-15T14:00:00Z',
          status: 'ACTIVE' as const
        },
        {
          organizationId: 'org-startup',
          role: 'OWNER' as UserRole,
          joinedAt: '2024-03-01T09:30:00Z',
          status: 'ACTIVE' as const
        }
      ],
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      bio: 'Usuario de prueba multi-organizacional. Participa en múltiples organizaciones con diferentes roles para demostrar las capacidades del sistema.',
      organization: 'TechCorp Solutions', // Organización activa
      phone: '+34 555 123 456',
      linkedinUrl: 'https://linkedin.com/in/alex-multiorg',
      profession: 'Consultor Multi-Organizacional',
      currentPosition: 'Consultor Senior',
      yearsExperience: 10,
      isActive: true,
      lastLoginAt: new Date().toISOString(),
      totalProjectsParticipated: 25,
      averageResponseTime: 2.8,
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: new Date().toISOString(),
      expertiseAreas: []
    }
  ]
  
  // Agregar usuarios demo si no existen (o reemplazar si son obsoletos)
  demoUsers.forEach(demoUser => {
    const existingIndex = users.findIndex(u => u.email === demoUser.email)
    if (existingIndex !== -1) {
      // Reemplazar usuario existente con datos actualizados
      users[existingIndex] = demoUser as StoredUser
    } else {
      // Agregar usuario nuevo
      users.push(demoUser as StoredUser)
    }
  })
  
  setStoredUsers(users)
  
  // 🔄 Si el usuario actual es multi@demo.com, limpiar su sesión para forzar re-login con datos nuevos
  const currentUser = getCurrentUser()
  if (currentUser && currentUser.email === 'multi@demo.com') {
    // Limpiar localStorage para forzar login con datos actualizados
    setCurrentUser(null)
  }
}

export function MockAuthProvider({ children }: { children: React.ReactNode }) {
  const mountId = React.useRef(Math.random().toString(36).substr(2, 9))
  console.log(`🔄 [AUTH PROVIDER] COMPONENTE MONTADO/RE-RENDERIZADO (ID: ${mountId.current})`)
  const [user, setUser] = useState<User | null>(null)
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false) // 🛠️ Bandera para evitar doble inicialización

  useEffect(() => {
    // 🛠️ EVITAR DOBLE INICIALIZACIÓN
    if (initialized) {
      console.log('🔐 [AUTH LOADING] SALTADO - Ya inicializado')
      return
    }

    const timestamp = new Date().toLocaleTimeString()
    console.log(`🔐 [AUTH LOADING] INICIADO - Verificando sesión existente... (${timestamp})`)
    
    // Simular carga inicial
    setTimeout(() => {
      // Inicializar usuarios demo
      initializeDemoUsers()
      
      let currentUser = getCurrentUser()
      
      // Solo mantener el usuario si existe y es válido
      // NO crear automáticamente un usuario demo
      
      if (currentUser) {
        console.log(`🔐 [AUTH LOADING] USUARIO ENCONTRADO - ${currentUser.email} | Org: ${currentUser.organizationId}`)
      } else {
        console.log('🔐 [AUTH LOADING] NO HAY SESIÓN - Usuario no autenticado')
      }
      
      setUser(currentUser)
      
      // 🏢 MULTI-TENANT: Cargar organización actual
      if (currentUser?.organizationId) {
        const org = mockOrganizations.find(o => o.id === currentUser.organizationId)
        setCurrentOrganization(org || null)
      }
      
      console.log('🔐 [AUTH LOADING] FINALIZADO - Inicialización completa')
      setLoading(false)
      setInitialized(true) // 🛠️ Marcar como inicializado
    }, 300)
  }, [initialized])

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
      
      // 🔄 NUEVO: Crear membresía inicial
      const initialMembership: UserOrganization = {
        organizationId,
        role,
        joinedAt: new Date().toISOString(),
        status: 'ACTIVE'
      }

      // Crear nuevo usuario con soporte multi-org
      const newStoredUser: StoredUser = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email,
        password, // En producción nunca guardar passwords en plain text
        name: name || email.split('@')[0],
        role,
        organizationId,
        organization: organization.name,
        currentOrganizationId: organizationId, // 🔄 NUEVO
        organizations: [initialMembership], // 🔄 NUEVO
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
      console.log(`🔐 [AUTH LOADING] SIGN IN INICIADO - Email: ${email}`)
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
        currentOrganizationId: storedUser.currentOrganizationId,
        organizations: storedUser.organizations,
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
      console.log('🔐 [AUTH LOADING] SIGN OUT INICIADO')
      setLoading(true)
      
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 50))
      
      setCurrentUser(null)
      setUser(null)
      setCurrentOrganization(null) // 🏢 MULTI-TENANT: Limpiar organización
      console.log('🔐 [AUTH LOADING] SIGN OUT EXITOSO - Sesión cerrada')
      
    } catch (error) {
      console.error('Mock signOut error:', error)
    } finally {
      console.log('🔐 [AUTH LOADING] SIGN OUT FINALIZADO')
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
    if (!user?.currentOrganizationId) return []
    
    // AISLAMIENTO DE DATOS: Filtrar expertos con validación de seguridad
    const { sampleExperts } = require('@/lib/mockData')
    return secureOrganizationFilter(sampleExperts, user.currentOrganizationId)
  }

  const getOrganizationProjects = () => {
    if (!user?.currentOrganizationId) return []
    
    // AISLAMIENTO DE DATOS: Filtrar proyectos con validación de seguridad
    const { mockProjects } = require('@/lib/mockData')
    return secureOrganizationFilter(mockProjects, user.currentOrganizationId)
  }

  const canAccessData = (organizationId: string): boolean => {
    return user?.currentOrganizationId === organizationId
  }

  // 🔄 NUEVAS FUNCIONES MULTI-ORGANIZACIONALES
  const switchOrganization = async (organizationId: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'Usuario no autenticado' }
    }

    // AISLAMIENTO DE DATOS: Validar acceso a organización
    if (!validateUserOrganizationAccess(user, organizationId)) {
      // Debug: Intento de cambio a organización no autorizada (silenciado en producción)
      return { success: false, error: 'No tienes acceso a esta organización' }
    }

    try {
      // Simular delay mínimo
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Encontrar la nueva organización
      const newOrganization = mockOrganizations.find(o => o.id === organizationId)
      
      // Obtener el rol del usuario en la organización objetivo
      const userOrgs = user.organizations || []
      const targetOrg = userOrgs.find(org => org.organizationId === organizationId)
      
      // Actualizar TANTO localStorage COMO estados de React
      const updatedUser = {
        ...user,
        currentOrganizationId: organizationId,
        organizationId: organizationId,
        role: targetOrg?.role || user.role,
        organization: newOrganization?.name || user.organization
      }
      
      // Actualizar estados de React
      setUser(updatedUser)
      setCurrentOrganization(newOrganization || null)
      
      // Actualizar localStorage
      setCurrentUser(updatedUser)
      
      // Actualizar también en la lista de usuarios almacenados
      const users = getStoredUsers()
      const userIndex = users.findIndex(u => u.id === user.id)
      if (userIndex !== -1) {
        users[userIndex] = {
          ...users[userIndex],
          currentOrganizationId: organizationId,
          organizationId: organizationId,
          role: targetOrg?.role || users[userIndex].role,
          organization: newOrganization?.name || users[userIndex].organization
        }
        setStoredUsers(users)
      }
      
      return { success: true }
    } catch (error) {
      console.error('Error in switchOrganization:', error)
      return { success: false, error: 'Error al cambiar organización' }
    }
  }

  const createOrganization = async (data: { 
    name: string; 
    description?: string; 
    plan?: 'FREE' | 'PRO' | 'ENTERPRISE' 
  }): Promise<{ success: boolean; error?: string; organizationId?: string }> => {
    if (!user) {
      return { success: false, error: 'Usuario no autenticado' }
    }

    try {
      // Simular creación de organización
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newOrgId = `org_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // Crear nueva membresía como OWNER
      const newMembership: UserOrganization = {
        organizationId: newOrgId,
        role: 'OWNER',
        joinedAt: new Date().toISOString(),
        status: 'ACTIVE'
      }
      
      // Actualizar usuario con nueva organización
      const updatedUser = {
        ...user,
        organizations: [...(user.organizations || []), newMembership],
        currentOrganizationId: newOrgId,
        organizationId: newOrgId,
        role: 'OWNER' as UserRole
      }
      
      setUser(updatedUser)
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser))
      
      return { success: true, organizationId: newOrgId }
    } catch (error) {
      return { success: false, error: 'Error al crear organización' }
    }
  }

  const getUserOrganizations = (): UserOrganization[] => {
    return user?.organizations || []
  }

  const getCurrentRole = (): UserRole | null => {
    if (!user || !user.currentOrganizationId) return null
    
    const currentMembership = user.organizations?.find(
      org => org.organizationId === user.currentOrganizationId
    )
    
    return currentMembership?.role || user.role || null
  }

  const canCreateOrganization = (): boolean => {
    // Todos los usuarios pueden crear organizaciones (modelo viral)
    return !!user
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
    canAccessData,
    // 🔄 NUEVAS FUNCIONES MULTI-ORG
    switchOrganization,
    createOrganization,
    getUserOrganizations,
    getCurrentRole,
    canCreateOrganization
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
