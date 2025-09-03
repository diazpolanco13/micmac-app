'use client'

import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useMockData } from '@/contexts/MockDataContext'
import { useRouter, useSearchParams } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import { Button } from '@/components/ui'
import { useToast } from '@/contexts/ToastContext'
import { mockOrganizations } from '@/lib/mockData'
import type { UserRole } from '@/types/project'

// Tipos para roles organizacionales
type OrgRole = 'OWNER' | 'ADMIN' | 'MODERATOR' | 'MEMBER'
type PlanType = 'FREE' | 'PRO' | 'ENTERPRISE'

// Tabs disponibles
type SettingsTab = 'organization' | 'users' | 'multiorg' | 'advanced'

export default function SettingsPage() {
  const { user, loading } = useAuth()
  const searchParams = useSearchParams()
  
  // Simplificar para evitar errores de tipos
  const { experts } = useMockData()
  const router = useRouter()
  const toast = useToast()

  // 🔧 Organización efectiva simplificada
  const effectiveOrganization = {
    id: user?.currentOrganizationId || 'default-org',
    name: 'Mi Organización',
    plan: 'FREE' as PlanType,
    limits: {
      projects: 10,
      experts: 25,
      moderators: 5,
      variablesPerProject: 100,
      storage: 5,
      apiCalls: 1000
    }
  }

  // Para compatibilidad
  const currentOrganization = {
    organizationId: user?.currentOrganizationId || 'default-org',
    name: 'Mi Organización'
  }
  
  // Obtener tab inicial desde URL o usar 'organization' por defecto
  const initialTab = (searchParams?.get('tab') as SettingsTab) || 'organization'
  const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab)
  const [isLoading, setIsLoading] = useState(false)

  // Estados para gestión de usuarios
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<UserRole>('EXPERT')
  const [showInviteForm, setShowInviteForm] = useState(false)
  const [hasShownAccessDenied, setHasShownAccessDenied] = useState(false)

  // Estados para edición de organización
  const [orgName, setOrgName] = useState(effectiveOrganization.name || '')
  const [orgDescription, setOrgDescription] = useState('')
  const [isEditingOrg, setIsEditingOrg] = useState(false)

  // Estados para invitaciones pendientes (simplificado para Supabase)
  const [pendingInvitations, setPendingInvitations] = useState<Array<{
    id: string
    email: string
    role: UserRole
    invitedBy: string
    createdAt: string
    status: 'PENDING' | 'EXPIRED'
  }>>([])

  // Simular algunas invitaciones pendientes iniciales - SIMPLIFICADO PARA SUPABASE
  useEffect(() => {
    // Por ahora, no cargar invitaciones automáticamente en Supabase
    // TODO: Implementar carga real desde base de datos
  }, [effectiveOrganization?.id])

  // Redireccionar si no está autenticado - ARREGLADO
  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading]) // Removida dependencia de router

  // Solo moderadores pueden acceder - SIMPLIFICADO PARA SUPABASE
  useEffect(() => {
    if (!loading && user) {
      // Obtener el rol actual (en Supabase es más simple)
      const currentOrgMembership = user.organizations?.find(org => 
        org.organizationId === user.currentOrganizationId
      )
      const effectiveRole = currentOrgMembership?.role || user.role
      
      // Permitir acceso a MODERATOR y roles organizacionales
      const allowedRoles: (UserRole | OrgRole)[] = ['MODERATOR', 'ADMIN', 'OWNER']
      if (!allowedRoles.includes(effectiveRole as any) && !hasShownAccessDenied) {
        setHasShownAccessDenied(true)
        toast.error('Acceso Denegado', 'Solo los moderadores pueden acceder a la configuración')
        router.push('/dashboard')
      }
    }
  }, [user?.currentOrganizationId, user?.organizations, loading])

  // Estado local para miembros - SIMPLIFICADO PARA SUPABASE
  const [localMembers, setLocalMembers] = useState<any[]>([])
  
  // Inicializar miembros locales - USANDO ORGANIZACIONES DE SUPABASE
  useEffect(() => {
    // Por ahora, usar datos mock o cargar desde Supabase
    // TODO: Implementar carga real de miembros de la organización
    if (user?.currentOrganizationId) {
      // Simular algunos miembros para la demo
      const currentOrgMembership = user.organizations?.find(org => 
        org.organizationId === user.currentOrganizationId
      )
      setLocalMembers([
        {
          id: user.id,
          name: user.name,
          email: user.email,
          role: currentOrgMembership?.role || user.role
        }
      ])
    }
  }, [user?.currentOrganizationId, user?.organizations])

  // Actualizar estados cuando cambie la organización
  useEffect(() => {
    if (effectiveOrganization) {
      setOrgName(effectiveOrganization.name)
      setOrgDescription('') // Temporalmente vacío hasta implementar description en Organization
    }
  }, [effectiveOrganization])

  const handleSaveOrganization = async () => {
    if (!orgName.trim()) {
      toast.error('Error', 'El nombre de la organización es requerido')
      return
    }

    setIsLoading(true)
    try {
      // Simular actualización (en el futuro será una API call)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('Organización Actualizada', 'Los cambios se han guardado correctamente')
      setIsEditingOrg(false)
    } catch (error) {
      toast.error('Error', 'No se pudo actualizar la organización')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelEditOrg = () => {
    setOrgName(effectiveOrganization?.name || '')
    setOrgDescription('') // Temporalmente vacío
    setIsEditingOrg(false)
  }

  const handleInviteUser = async () => {
    if (!inviteEmail.trim()) {
      toast.error('Error', 'Ingresa un email válido')
      return
    }

    // Verificar si el email ya está invitado
    const existingInvitation = pendingInvitations.find(inv => inv.email === inviteEmail)
    if (existingInvitation) {
      toast.error('Error', 'Este usuario ya tiene una invitación pendiente')
      return
    }

    // Verificar si el usuario ya es miembro
    const existingMember = localMembers.find(member => member.email === inviteEmail)
    if (existingMember) {
      toast.error('Error', 'Este usuario ya es miembro de la organización')
      return
    }

    setIsLoading(true)
    try {
      // Simular envío de invitación
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Agregar invitación pendiente
      const newInvitation = {
        id: `inv_${Date.now()}`,
        email: inviteEmail,
        role: inviteRole,
        invitedBy: user?.name || user?.email || 'Admin',
        createdAt: new Date().toISOString(),
        status: 'PENDING' as const
      }
      
      setPendingInvitations(prev => [...prev, newInvitation])
      toast.success('Invitación Enviada', `Se envió una invitación a ${inviteEmail}`)
      setInviteEmail('')
      setShowInviteForm(false)
    } catch (error) {
      toast.error('Error', 'No se pudo enviar la invitación')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelInvitation = async (invitationId: string, email: string) => {
    if (!confirm(`¿Cancelar la invitación para ${email}?`)) {
      return
    }

    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      
      setPendingInvitations(prev => prev.filter(inv => inv.id !== invitationId))
      toast.success('Invitación Cancelada', `Se canceló la invitación para ${email}`)
    } catch (error) {
      toast.error('Error', 'No se pudo cancelar la invitación')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendInvitation = async (email: string) => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      
      toast.success('Invitación Reenviada', `Se reenvió la invitación a ${email}`)
    } catch (error) {
      toast.error('Error', 'No se pudo reenviar la invitación')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePromoteUser = async (userId: string, newRole: UserRole) => {
    setIsLoading(true)
    try {
      // Simular promoción (en el futuro será una API call)
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Actualizar el estado local inmediatamente
      setLocalMembers(prev => 
        prev.map(member => 
          member.id === userId 
            ? { ...member, role: newRole }
            : member
        )
      )
      
      const memberName = localMembers.find(m => m.id === userId)?.name || 'Usuario'
      const roleText = newRole === 'MODERATOR' ? 'Moderador' : 'Experto'
      toast.success('Rol Actualizado', `${memberName} ahora es ${roleText}`)
    } catch (error) {
      toast.error('Error', 'No se pudo cambiar el rol del usuario')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveUser = async (userId: string, userName: string) => {
    if (!confirm(`¿Estás seguro de expulsar a ${userName} de la organización?`)) {
      return
    }

    setIsLoading(true)
    try {
      // Simular expulsión (en el futuro será una API call)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Remover del estado local inmediatamente
      setLocalMembers(prev => prev.filter(member => member.id !== userId))
      
      toast.success('Usuario Expulsado', `${userName} ha sido removido de la organización`)
    } catch (error) {
      toast.error('Error', 'No se pudo expulsar al usuario')
    } finally {
      setIsLoading(false)
    }
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-pulse-slow rounded-full h-8 w-8 bg-micmac-primary-500 mx-auto mb-4"></div>
            <p className="text-dark-text-secondary">Cargando configuración...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (!user) return null

  const tabs = [
    { id: 'organization' as SettingsTab, name: 'Organización', icon: '🏢' },
    { id: 'users' as SettingsTab, name: 'Usuarios', icon: '👥' },
    { id: 'multiorg' as SettingsTab, name: 'Multi-Org', icon: '🌐' },
    { id: 'advanced' as SettingsTab, name: 'Avanzado', icon: '⚙️' },
  ]

  return (
    <AppLayout>
      <div className="container-app relative">
        {/* Breadcrumbs */}
        <Breadcrumbs />
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient mb-2">
            ⚙️ Configuración
          </h1>
          <p className="text-dark-text-secondary">
            Gestiona tu organización, usuarios y configuraciones avanzadas
          </p>
        </div>

        {/* Organization Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl p-6 mb-8 border border-gray-600" key={effectiveOrganization?.id}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                effectiveOrganization.plan === 'ENTERPRISE' ? 'bg-purple-500' :
                effectiveOrganization.plan === 'PRO' ? 'bg-blue-500' : 'bg-green-500'
              }`}>
                <span className="text-white text-xl font-bold">
                  {effectiveOrganization.name.charAt(0)}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {effectiveOrganization.name}
                </h2>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium text-white ${
                    effectiveOrganization.plan === 'ENTERPRISE' ? 'bg-purple-600' :
                    effectiveOrganization.plan === 'PRO' ? 'bg-blue-600' : 'bg-green-600'
                  }`}>
                    {effectiveOrganization.plan}
                  </span>
                  <span className="text-gray-300 text-sm">
                    {localMembers.length} miembros
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm">Administrador</p>
              <p className="text-white font-medium">{user.name || user.email}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-700">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-micmac-primary-500 text-micmac-primary-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'organization' && (
            <OrganizationTab 
              organization={effectiveOrganization}
              memberCount={localMembers.length}
              orgName={orgName}
              setOrgName={setOrgName}
              orgDescription={orgDescription}
              setOrgDescription={setOrgDescription}
              isEditingOrg={isEditingOrg}
              setIsEditingOrg={setIsEditingOrg}
              onSaveOrganization={handleSaveOrganization}
              onCancelEditOrg={handleCancelEditOrg}
              isLoading={isLoading}
            />
          )}
          
          {activeTab === 'users' && (
            <UsersTab 
              members={localMembers}
              onInviteUser={handleInviteUser}
              onPromoteUser={handlePromoteUser}
              onRemoveUser={handleRemoveUser}
              inviteEmail={inviteEmail}
              setInviteEmail={setInviteEmail}
              inviteRole={inviteRole}
              setInviteRole={setInviteRole}
              showInviteForm={showInviteForm}
              setShowInviteForm={setShowInviteForm}
              isLoading={isLoading}
              pendingInvitations={pendingInvitations}
              onCancelInvitation={handleCancelInvitation}
              onResendInvitation={handleResendInvitation}
            />
          )}
          
          {activeTab === 'multiorg' && (
            <MultiOrgTab key={user?.currentOrganizationId || 'default'} />
          )}
          
          {activeTab === 'advanced' && (
            <AdvancedTab organization={currentOrganization} />
          )}
        </div>
      </div>
    </AppLayout>
  )
}

// Componente: Tab de Organización
function OrganizationTab({ 
  organization, 
  memberCount,
  orgName,
  setOrgName,
  orgDescription,
  setOrgDescription,
  isEditingOrg,
  setIsEditingOrg,
  onSaveOrganization,
  onCancelEditOrg,
  isLoading
}: { 
  organization: any, 
  memberCount: number,
  orgName: string,
  setOrgName: (name: string) => void,
  orgDescription: string,
  setOrgDescription: (desc: string) => void,
  isEditingOrg: boolean,
  setIsEditingOrg: (editing: boolean) => void,
  onSaveOrganization: () => void,
  onCancelEditOrg: () => void,
  isLoading: boolean
}) {
  return (
    <div className="space-y-6">
      {/* Información General */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Información General</h3>
          {!isEditingOrg ? (
            <Button
              ghost
              onClick={() => setIsEditingOrg(true)}
              disabled={isLoading}
            >
              ✏️ Editar
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button
                ghost
                onClick={onCancelEditOrg}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                color="primary"
                onClick={onSaveOrganization}
                disabled={isLoading}
              >
                {isLoading ? 'Guardando...' : 'Guardar'}
              </Button>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nombre de la Organización
            </label>
            <input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg text-white transition-colors ${
                isEditingOrg 
                  ? 'bg-gray-700 border-gray-500 focus:border-micmac-primary-500 focus:outline-none' 
                  : 'bg-gray-800 border-gray-600 cursor-default'
              }`}
              readOnly={!isEditingOrg}
              placeholder="Nombre de tu organización"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Plan Actual
            </label>
            <div className={`inline-flex px-3 py-2 rounded-lg text-sm font-medium text-white ${
              organization.plan === 'ENTERPRISE' ? 'bg-purple-600' :
              organization.plan === 'PRO' ? 'bg-blue-600' : 'bg-green-600'
            }`}>
              {organization.plan}
            </div>
          </div>
        </div>

        {/* Descripción */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Descripción (Opcional)
          </label>
          <textarea
            value={orgDescription}
            onChange={(e) => setOrgDescription(e.target.value)}
            rows={3}
            className={`w-full px-3 py-2 border rounded-lg text-white transition-colors resize-none ${
              isEditingOrg 
                ? 'bg-gray-700 border-gray-500 focus:border-micmac-primary-500 focus:outline-none' 
                : 'bg-gray-800 border-gray-600 cursor-default'
            }`}
            readOnly={!isEditingOrg}
            placeholder="Describe brevemente tu organización..."
          />
        </div>
      </div>

      {/* Estadísticas */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Estadísticas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-micmac-primary-400">{memberCount}</div>
            <div className="text-sm text-gray-400">Miembros Activos</div>
          </div>
          <div className="text-center p-4 bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-green-400">
              {organization?.limits?.projects || '∞'}
            </div>
            <div className="text-sm text-gray-400">Límite de Proyectos</div>
          </div>
          <div className="text-center p-4 bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-blue-400">
              {organization?.limits?.experts || '∞'}
            </div>
            <div className="text-sm text-gray-400">Límite de Expertos</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente: Tab de Usuarios
function UsersTab({ 
  members, 
  onInviteUser, 
  onPromoteUser, 
  onRemoveUser,
  inviteEmail,
  setInviteEmail,
  inviteRole,
  setInviteRole,
  showInviteForm,
  setShowInviteForm,
  isLoading,
  pendingInvitations,
  onCancelInvitation,
  onResendInvitation
}: {
  members: any[]
  onInviteUser: () => void
  onPromoteUser: (userId: string, role: UserRole) => void
  onRemoveUser: (userId: string, name: string) => void
  inviteEmail: string
  setInviteEmail: (email: string) => void
  inviteRole: UserRole
  setInviteRole: (role: UserRole) => void
  showInviteForm: boolean
  setShowInviteForm: (show: boolean) => void
  isLoading: boolean
  pendingInvitations: Array<{
    id: string
    email: string
    role: UserRole
    invitedBy: string
    createdAt: string
    status: 'PENDING' | 'EXPIRED'
  }>
  onCancelInvitation: (id: string, email: string) => void
  onResendInvitation: (email: string) => void
}) {
  return (
    <div className="space-y-6">
      {/* Botón Invitar */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Gestión de Usuarios</h3>
          <Button
            color="primary"
            onClick={() => setShowInviteForm(!showInviteForm)}
            disabled={isLoading}
          >
            {showInviteForm ? 'Cancelar' : '+ Invitar Usuario'}
          </Button>
        </div>

        {/* Formulario de Invitación */}
        {showInviteForm && (
          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <h4 className="text-white font-medium mb-3">Invitar Nuevo Usuario</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <input
                  type="email"
                  placeholder="email@ejemplo.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400"
                />
              </div>
              <div className="flex space-x-2">
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as UserRole)}
                  className="flex-1 px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white"
                >
                  <option value="EXPERT">Experto</option>
                  <option value="MODERATOR">Moderador</option>
                </select>
                <Button
                  color="primary"
                  onClick={onInviteUser}
                  disabled={isLoading}
                  className="whitespace-nowrap"
                >
                  {isLoading ? 'Enviando...' : 'Enviar'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lista de Miembros */}
      <div className="card p-6">
        <h4 className="text-white font-medium mb-4">Miembros de la Organización ({members.length})</h4>
        <div className="space-y-4">
          {members.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-micmac-primary-500 to-micmac-secondary-500 flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {member.name ? member.name.charAt(0).toUpperCase() : member.email.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-white font-medium">{member.name || member.email}</p>
                  <p className="text-gray-400 text-sm">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  member.role === 'MODERATOR'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-blue-600 text-white'
                }`}>
                  {member.role === 'MODERATOR' ? 'Moderador' : 'Experto'}
                </div>
                <div className="flex items-center space-x-3">
                  {/* Selector de Rol */}
                  <select
                    value={member.role}
                    onChange={(e) => {
                      const newRole = e.target.value as UserRole
                      if (newRole !== member.role) {
                        onPromoteUser(member.id, newRole)
                      }
                    }}
                    disabled={isLoading}
                    className="px-3 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:border-micmac-primary-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="EXPERT">Experto</option>
                    <option value="MODERATOR">Moderador</option>
                  </select>
                  
                  {/* Botón Expulsar */}
                  <Button
                    ghost
                    size="sm"
                    onClick={() => onRemoveUser(member.id, member.name || member.email)}
                    disabled={isLoading}
                    className="text-red-400 hover:text-red-300"
                  >
                    🗑️ Expulsar
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invitaciones Pendientes */}
      {pendingInvitations.length > 0 && (
        <div className="card p-6">
          <h4 className="text-white font-medium mb-4">
            Invitaciones Pendientes ({pendingInvitations.length})
          </h4>
          <div className="space-y-4">
            {pendingInvitations.map((invitation) => (
              <div key={invitation.id} className="flex items-center justify-between p-4 bg-yellow-900/20 border border-yellow-700/30 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-yellow-600/20 border-2 border-yellow-600/40 flex items-center justify-center">
                    <span className="text-yellow-400 font-medium text-sm">
                      ⏳
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{invitation.email}</p>
                    <p className="text-gray-400 text-sm">
                      Invitado por {invitation.invitedBy} • {formatTimeAgo(invitation.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    invitation.role === 'MODERATOR'
                      ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-600/30'
                      : 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                  }`}>
                    {invitation.role === 'MODERATOR' ? 'Moderador' : 'Experto'}
                  </div>
                  <div className="px-2 py-1 rounded text-xs font-medium bg-yellow-600/20 text-yellow-400 border border-yellow-600/30">
                    Pendiente
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      ghost
                      size="sm"
                      onClick={() => onResendInvitation(invitation.email)}
                      disabled={isLoading}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      Reenviar
                    </Button>
                    <Button
                      ghost
                      size="sm"
                      onClick={() => onCancelInvitation(invitation.id, invitation.email)}
                      disabled={isLoading}
                      className="text-red-400 hover:text-red-300"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Función helper para formatear tiempo relativo
function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'hace unos segundos'
  if (diffInSeconds < 3600) return `hace ${Math.floor(diffInSeconds / 60)} min`
  if (diffInSeconds < 86400) return `hace ${Math.floor(diffInSeconds / 3600)} h`
  if (diffInSeconds < 604800) return `hace ${Math.floor(diffInSeconds / 86400)} días`
  
  return date.toLocaleDateString('es-ES', { 
    day: 'numeric', 
    month: 'short',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  })
}

// Componente: Tab Multi-Organizacional
function MultiOrgTab() {
  const { user } = useAuth()
  const currentOrganization = user?.organizations?.find(org => 
    org.organizationId === user.currentOrganizationId
  ) || null
  
  const [isLoading, setIsLoading] = useState(false)
  const [newOrgName, setNewOrgName] = useState('')
  const [newOrgDescription, setNewOrgDescription] = useState('')
  const [newOrgPlan, setNewOrgPlan] = useState<'FREE' | 'PRO' | 'ENTERPRISE'>('FREE')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const toast = useToast()

  if (!user) return null

  // Obtener organizaciones de forma segura con nombres reales
  const userOrganizations = useMemo(() => {
    return user?.organizations || []
  }, [user?.organizations])

  // 🏢 Mapear organizaciones con nombres reales desde BD
  const organizationsWithNames = useMemo(() => {
    const orgMap: { [key: string]: string } = {
      'org-techcorp': 'TechCorp Solutions',
      'org-healthplus': 'HealthPlus Medical',
      'org-startup': 'StartupInc'
    }
    
    return userOrganizations.map(membership => ({
      ...membership,
      displayName: orgMap[membership.organizationId] || membership.organizationId,
      plan: 'FREE' as PlanType // Por ahora, luego cargaremos desde BD
    }))
  }, [userOrganizations])
  
  const currentRole = useMemo(() => {
    if (!user || !user.currentOrganizationId) return user?.role || null
    
    const currentMembership = userOrganizations.find(
      org => org.organizationId === user.currentOrganizationId
    )
    
    return currentMembership?.role || user.role || null
  }, [user?.currentOrganizationId, user?.role, userOrganizations])

  // 🔄 CAMBIO DE ORGANIZACIÓN REAL EN SUPABASE
  const handleSwitchOrganization = async (orgId: string, orgName: string) => {
    if (orgId === user?.currentOrganizationId) {
      toast.info('Ya Activa', `Ya estás en ${orgName}`)
      return
    }

    setIsLoading(true)
    try {
      console.log(`🔄 Cambiando a organización: ${orgId} (${orgName})`)
      
      // Importar supabase para hacer la actualización
      const { supabase } = await import('@/lib/supabase')
      
      // Actualizar current_organization_id en la tabla profiles
      const { error } = await supabase
        .from('profiles')
        .update({ 
          current_organization_id: orgId,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id)

      if (error) {
        console.error('❌ Error actualizando organización:', error)
        throw error
      }

      console.log('✅ Organización actualizada en BD')
      toast.success('Organización Cambiada', `Ahora estás en ${orgName}`)
      
      // Esperar un momento y recargar para reflejar los cambios
      setTimeout(() => {
        window.location.reload()
      }, 1500)
      
    } catch (error) {
      console.error('💥 Error switching organization:', error)
      toast.error('Error', 'No se pudo cambiar de organización')
      setIsLoading(false) // Solo resetear loading en caso de error
    }
  }

  const handleCreateOrganization = async () => {
    toast.info('En Desarrollo', 'Función de crear organización próximamente')
  }

  return (
    <div className="space-y-6">
      {/* Header con información actual */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">🌐 Gestión Multi-Organizacional</h3>
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Organización Actual</p>
              <p className="text-gray-300 text-sm">
                {(currentOrganization as any)?.name || currentOrganization?.organizationId || 'Sin organización'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm">Tu Rol</p>
              <p className="text-white font-medium">{currentRole || 'Sin rol'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mis Organizaciones */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-white font-medium">
            Mis Organizaciones ({organizationsWithNames.length})
          </h4>
          <Button
            color="primary"
            onClick={() => setShowCreateForm(!showCreateForm)}
            disabled={isLoading}
          >
            {showCreateForm ? 'Cancelar' : '+ Nueva Organización'}
          </Button>
        </div>

        {/* Formulario de creación */}
        {showCreateForm && (
          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <h5 className="text-white font-medium mb-3">Crear Nueva Organización</h5>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nombre de la Organización
                  </label>
                  <input
                    type="text"
                    value={newOrgName}
                    onChange={(e) => setNewOrgName(e.target.value)}
                    placeholder="Mi Nueva Empresa"
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:border-micmac-primary-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Plan Inicial
                  </label>
                  <select
                    value={newOrgPlan}
                    onChange={(e) => setNewOrgPlan(e.target.value as 'FREE' | 'PRO' | 'ENTERPRISE')}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:border-micmac-primary-500 focus:outline-none"
                  >
                    <option value="FREE">FREE - Básico</option>
                    <option value="PRO">PRO - Profesional</option>
                    <option value="ENTERPRISE">ENTERPRISE - Empresarial</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descripción (Opcional)
                </label>
                <textarea
                  value={newOrgDescription}
                  onChange={(e) => setNewOrgDescription(e.target.value)}
                  rows={3}
                  placeholder="Describe tu organización..."
                  className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 resize-none focus:border-micmac-primary-500 focus:outline-none"
                />
              </div>
              <div className="flex space-x-3">
                <Button
                  color="primary"
                  onClick={handleCreateOrganization}
                  disabled={isLoading || !newOrgName.trim()}
                >
                  {isLoading ? 'Creando...' : 'Crear Organización'}
                </Button>
                <Button
                  ghost
                  onClick={() => {
                    setShowCreateForm(false)
                    setNewOrgName('')
                    setNewOrgDescription('')
                    setNewOrgPlan('FREE')
                  }}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Lista de organizaciones */}
        <div className="space-y-4">
          {organizationsWithNames.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No tienes membresías en organizaciones</p>
              <p className="text-gray-500 text-sm">Crea tu primera organización para comenzar</p>
            </div>
          ) : (
            organizationsWithNames.map((membership) => {
              // Usar los datos de la membresía con nombres reales
              const org = {
                id: membership.organizationId,
                name: membership.displayName,
                plan: membership.plan
              }
              
              const isActive = user.currentOrganizationId === org.id
              
              return (
                <div 
                  key={org.id} 
                  className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                    isActive 
                      ? 'bg-micmac-primary-500/20 border-micmac-primary-500/50' 
                      : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      org.plan === 'ENTERPRISE' ? 'bg-purple-500' :
                      org.plan === 'PRO' ? 'bg-blue-500' : 'bg-green-500'
                    }`}>
                      <span className="text-white text-lg font-bold">
                        {org.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h5 className="text-white font-medium">{org.name}</h5>
                        {isActive && (
                          <span className="px-2 py-1 bg-micmac-primary-500 text-white text-xs rounded-full">
                            ACTIVA
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className={`px-2 py-1 rounded text-xs font-medium text-white ${
                          org.plan === 'ENTERPRISE' ? 'bg-purple-600' :
                          org.plan === 'PRO' ? 'bg-blue-600' : 'bg-green-600'
                        }`}>
                          {org.plan}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          (membership.role as any) === 'OWNER' ? 'bg-yellow-600 text-white' :
                          (membership.role as any) === 'ADMIN' ? 'bg-red-600 text-white' :
                          membership.role === 'MODERATOR' ? 'bg-emerald-600 text-white' :
                          'bg-blue-600 text-white'
                        }`}>
                          {membership.role}
                        </span>
                        <span className="text-gray-400 text-xs">
                          Desde {new Date(membership.joinedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {!isActive && (
                      <Button
                        color="primary"
                        size="sm"
                        onClick={() => handleSwitchOrganization(org.id, org.name)}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Cambiando...' : 'Activar'}
                      </Button>
                    )}
                    {isActive && (
                      <span className="text-micmac-primary-400 text-sm font-medium">
                        ✓ En uso
                      </span>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Información de debugging (solo en desarrollo) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="card p-6 border-yellow-600">
          <h4 className="text-yellow-400 font-medium mb-4">🐛 Debug Info (Solo Desarrollo)</h4>
          <div className="bg-gray-800 rounded-lg p-4 text-xs font-mono">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-green-400 font-semibold mb-2">Usuario:</p>
                <p>ID: {user.id}</p>
                <p>Email: {user.email}</p>
                <p>Org ID (legacy): N/A</p>
                <p>Org Activa: {user.currentOrganizationId || 'N/A'}</p>
              </div>
              <div>
                <p className="text-blue-400 font-semibold mb-2">Membresías:</p>
                <p>Total: {userOrganizations.length}</p>
                <p>Rol Actual: {currentRole}</p>
                <p>Puede Crear: Sí</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Componente: Tab Avanzado
function AdvancedTab({ organization }: { organization: any }) {
  return (
    <div className="space-y-6">
      {/* Límites del Plan */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Límites del Plan</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-300">Proyectos</span>
              <span className="text-white">
                {organization?.limits?.projects || '∞'} máximo
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Expertos</span>
              <span className="text-white">
                {organization?.limits?.experts || '∞'} máximo
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Moderadores</span>
              <span className="text-white">
                {organization?.limits?.moderators || '∞'} máximo
              </span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-300">Variables por proyecto</span>
              <span className="text-white">
                {organization?.limits?.variablesPerProject || '∞'} máximo
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Almacenamiento</span>
              <span className="text-white">
                {organization?.limits?.storage || '∞'} GB
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">API Calls/mes</span>
              <span className="text-white">
                {organization?.limits?.apiCalls || '∞'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Configuraciones de Seguridad */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Configuraciones de Seguridad</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white">Autenticación de dos factores</p>
              <p className="text-gray-400 text-sm">Requerir 2FA para todos los usuarios</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-micmac-primary-500"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white">Invitaciones solo por admin</p>
              <p className="text-gray-400 text-sm">Solo moderadores pueden invitar usuarios</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-micmac-primary-500"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Zona de Peligro */}
      <div className="card p-6 border-red-600">
        <h3 className="text-lg font-semibold text-red-400 mb-4">Zona de Peligro</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white">Eliminar Organización</p>
              <p className="text-gray-400 text-sm">Esta acción no se puede deshacer</p>
            </div>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => alert('Funcionalidad no implementada')}
            >
              Eliminar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
