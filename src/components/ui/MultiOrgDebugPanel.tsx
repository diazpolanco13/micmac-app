'use client'

import { useState } from 'react'
import { useMockAuth } from '@/contexts/MockAuthContext'
import { mockOrganizations } from '@/lib/mockData'
import { Bug, ChevronDown, ChevronRight, Database, User, Building2 } from 'lucide-react'

export default function MultiOrgDebugPanel() {
  const { 
    user, 
    currentOrganization,
    getUserOrganizations,
    getCurrentRole
  } = useMockAuth()
  
  const [isOpen, setIsOpen] = useState(false)

  if (!user) return null

  const userOrganizations = getUserOrganizations()
  const currentRole = getCurrentRole()

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-gray-900 text-white rounded-lg shadow-lg border border-gray-700 min-w-[300px]">
        {/* Header */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center gap-2 p-3 hover:bg-gray-800 transition-colors rounded-t-lg"
        >
          <Bug className="h-4 w-4 text-green-400" />
          <span className="font-medium">Multi-Org Debug</span>
          {isOpen ? (
            <ChevronDown className="h-4 w-4 ml-auto" />
          ) : (
            <ChevronRight className="h-4 w-4 ml-auto" />
          )}
        </button>

        {/* Panel expandible */}
        {isOpen && (
          <div className="border-t border-gray-700 p-3 space-y-3 max-h-96 overflow-y-auto">
            
            {/* Usuario actual */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-blue-400">
                <User className="h-4 w-4" />
                Usuario Actual
              </div>
              <div className="bg-gray-800 rounded p-2 text-xs space-y-1">
                <div><strong>ID:</strong> {user.id}</div>
                <div><strong>Email:</strong> {user.email}</div>
                <div><strong>Nombre:</strong> {user.name}</div>
                <div><strong>Rol Global:</strong> {user.role}</div>
                <div><strong>Org ID (legacy):</strong> {user.organizationId}</div>
                <div><strong>Org Activa:</strong> {user.currentOrganizationId || 'N/A'}</div>
              </div>
            </div>

            {/* Organización actual */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-green-400">
                <Building2 className="h-4 w-4" />
                Organización Actual
              </div>
              <div className="bg-gray-800 rounded p-2 text-xs space-y-1">
                {currentOrganization ? (
                  <>
                    <div><strong>ID:</strong> {currentOrganization.id}</div>
                    <div><strong>Nombre:</strong> {currentOrganization.name}</div>
                    <div><strong>Plan:</strong> {currentOrganization.plan}</div>
                    <div><strong>Rol Actual:</strong> {currentRole}</div>
                    <div><strong>Activa:</strong> {currentOrganization.isActive ? 'Sí' : 'No'}</div>
                  </>
                ) : (
                  <div className="text-red-400">No hay organización cargada</div>
                )}
              </div>
            </div>

            {/* Membresías del usuario */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-purple-400">
                <Database className="h-4 w-4" />
                Membresías ({userOrganizations.length})
              </div>
              <div className="bg-gray-800 rounded p-2 text-xs space-y-2">
                {userOrganizations.length > 0 ? (
                  userOrganizations.map((membership, index) => {
                    const org = mockOrganizations.find(o => o.id === membership.organizationId)
                    const isActive = user.currentOrganizationId === membership.organizationId || user.organizationId === membership.organizationId
                    
                    return (
                      <div 
                        key={membership.organizationId} 
                        className={`p-2 rounded border ${isActive ? 'border-green-500 bg-green-900/20' : 'border-gray-600'}`}
                      >
                        <div className="flex items-center justify-between">
                          <div><strong>{org?.name || 'Org Desconocida'}</strong></div>
                          {isActive && <span className="text-green-400 text-xs">ACTIVA</span>}
                        </div>
                        <div>ID: {membership.organizationId}</div>
                        <div>Rol: {membership.role}</div>
                        <div>Estado: {membership.status}</div>
                        <div>Unido: {new Date(membership.joinedAt).toLocaleDateString()}</div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-red-400">No hay membresías</div>
                )}
              </div>
            </div>

            {/* Todas las organizaciones disponibles */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-yellow-400">
                <Building2 className="h-4 w-4" />
                Organizaciones Disponibles ({mockOrganizations.length})
              </div>
              <div className="bg-gray-800 rounded p-2 text-xs space-y-1 max-h-32 overflow-y-auto">
                {mockOrganizations.map(org => (
                  <div key={org.id} className="flex justify-between">
                    <span>{org.name}</span>
                    <span className="text-gray-400">{org.plan}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Acciones de testing */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-orange-400">
                Acciones de Testing
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    console.log('=== MULTI-ORG DEBUG ===')
                    console.log('User:', user)
                    console.log('Current Organization:', currentOrganization)
                    console.log('User Organizations:', userOrganizations)
                    console.log('Current Role:', currentRole)
                    console.log('All Organizations:', mockOrganizations)
                  }}
                  className="w-full text-left px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs transition-colors"
                >
                  🖨️ Log en Console
                </button>
                <button
                  onClick={() => {
                    const data = {
                      user,
                      currentOrganization,
                      userOrganizations,
                      currentRole,
                      allOrganizations: mockOrganizations
                    }
                                      navigator.clipboard.writeText(JSON.stringify(data, null, 2))
                  alert('Datos copiados al clipboard!')
                }}
                className="w-full text-left px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs transition-colors"
              >
                📋 Copiar JSON
              </button>
              <button
                onClick={() => {
                  if (confirm('¿Limpiar datos del usuario y recargar? Tendrás que hacer login de nuevo.')) {
                    localStorage.removeItem('micmac_current_user')
                    localStorage.removeItem('micmac_mock_users')
                    window.location.reload()
                  }
                }}
                className="w-full text-left px-2 py-1 bg-red-700 hover:bg-red-600 rounded text-xs transition-colors"
              >
                🗑️ Reset Completo
              </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
