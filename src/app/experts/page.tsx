'use client'

import { useState, useEffect } from 'react'
import { useMockAuth } from '@/contexts/MockAuthContext'
import { useMockData } from '@/contexts/MockDataContext'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import { Button, Input } from '@/components/ui'
import { Expert, ExpertFilter, ExpertFormData } from '@/types/project'
import ExpertFormModal from '@/components/experts/ExpertFormModal'
import ExpertDetailModal from '@/components/experts/ExpertDetailModal'
import ExpertCard from '@/components/experts/ExpertCard'

export default function ExpertsPage() {
  const { user, loading } = useMockAuth()
  const router = useRouter()
  
  const {
    experts,
    loadingExperts,
    createExpert,
    updateExpert,
    deleteExpert,
    filterExperts,
    getExpertStats,
    refreshExperts
  } = useMockData()

  // Estados locales
  const [filteredExperts, setFilteredExperts] = useState<Expert[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState<'ALL' | 'EXPERT' | 'MODERATOR'>('ALL')
  const [selectedOrganization, setSelectedOrganization] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingExpert, setEditingExpert] = useState<Expert | null>(null)
  const [showDetailModal, setShowDetailModal] = useState<Expert | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(12)

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  // Aplicar filtros cuando cambien
  useEffect(() => {
    const filter: ExpertFilter = {
      search: searchTerm || undefined,
      role: selectedRole !== 'ALL' ? selectedRole : undefined,
      organization: selectedOrganization || undefined,
      isActive: true
    }
    
    const filtered = filterExperts(filter)
    setFilteredExperts(filtered)
    setCurrentPage(1)
  }, [searchTerm, selectedRole, selectedOrganization, experts, filterExperts])

  // Paginación
  const totalPages = Math.ceil(filteredExperts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentExperts = filteredExperts.slice(startIndex, endIndex)

  // Obtener organizaciones únicas
  const organizations = Array.from(
    new Set(experts.map(e => e.organization).filter(Boolean))
  ).sort()

  // Estadísticas
  const stats = getExpertStats()

  const handleCreateExpert = async (data: ExpertFormData) => {
    const result = await createExpert(data)
    if (result.success) {
      alert('Experto creado exitosamente')
      setShowCreateModal(false)
      refreshExperts()
    } else {
      alert(result.error || 'Error al crear experto')
    }
  }

  const handleUpdateExpert = async (id: string, data: Partial<ExpertFormData>) => {
    const result = await updateExpert(id, data)
    if (result.success) {
      alert('Experto actualizado exitosamente')
      setEditingExpert(null)
      refreshExperts()
    } else {
      alert(result.error || 'Error al actualizar experto')
    }
  }

  const handleDeleteExpert = async (expert: Expert) => {
    if (confirm(`¿Estás seguro de que quieres eliminar a ${expert.name}?`)) {
      const result = await deleteExpert(expert.id)
      if (result.success) {
        alert('Experto eliminado exitosamente')
        refreshExperts()
      } else {
        alert(result.error || 'Error al eliminar experto')
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-micmac-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse-slow rounded-full h-8 w-8 bg-micmac-primary-500 mx-auto mb-4"></div>
          <p className="text-dark-text-secondary">Cargando expertos...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <AppLayout>
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gradient mb-2">
                👥 Gestión de Expertos
              </h1>
              <p className="text-dark-text-secondary">
                Panel completo de expertos y moderadores del sistema MIC MAC
              </p>
            </div>
            <Button
              color="primary"
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Nuevo Experto
            </Button>
          </div>
        </div>

        {/* Panel informativo sobre metodología */}
        <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
            </div>
            <div>
              <h4 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-2">
                💡 ¿Cómo funciona el registro de expertos?
              </h4>
              <div className="text-blue-700 dark:text-blue-300 space-y-2">
                <p>
                  <strong>Metodología de Registro Centralizado:</strong> Los expertos se registran aquí por moderadores 
                  para garantizar la calidad del panel MIC MAC.
                </p>
                <div className="ml-4 space-y-1">
                  <p><strong>1.</strong> Los moderadores registran expertos verificados en este panel</p>
                  <p><strong>2.</strong> Al crear proyectos, se seleccionan expertos del pool registrado</p>
                  <p><strong>3.</strong> Los expertos reciben invitaciones específicas por proyecto</p>
                  <p><strong>4.</strong> Participan solo en proyectos relevantes a su expertise</p>
                </div>
                <p className="pt-2 text-sm">
                  <strong>📍 Ventaja:</strong> Esto asegura que cada análisis MIC MAC tenga expertos 
                  verdaderamente calificados y relevantes para el tema específico.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6 text-center">
            <div className="text-2xl font-bold text-micmac-primary-400">
              {stats.totalExperts}
            </div>
            <div className="text-sm text-dark-text-secondary">Expertos</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-2xl font-bold text-micmac-secondary-400">
              {stats.totalModerators}
            </div>
            <div className="text-sm text-dark-text-secondary">Moderadores</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-2xl font-bold text-green-400">
              {stats.totalActiveExperts}
            </div>
            <div className="text-sm text-dark-text-secondary">Activos</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {Math.round(stats.averageExperience)}
            </div>
            <div className="text-sm text-dark-text-secondary">Años promedio</div>
          </div>
        </div>

        {/* Filtros y búsqueda */}
        <div className="card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Buscar por nombre, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="col-span-1 md:col-span-2"
            />
            
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as 'ALL' | 'EXPERT' | 'MODERATOR')}
              className="px-3 py-2 bg-dark-bg-tertiary border border-dark-bg-tertiary rounded-md text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-micmac-primary-500"
            >
              <option value="ALL">Todos los roles</option>
              <option value="EXPERT">Solo Expertos</option>
              <option value="MODERATOR">Solo Moderadores</option>
            </select>
            
            <select
              value={selectedOrganization}
              onChange={(e) => setSelectedOrganization(e.target.value)}
              className="px-3 py-2 bg-dark-bg-tertiary border border-dark-bg-tertiary rounded-md text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-micmac-primary-500"
            >
              <option value="">Todas las organizaciones</option>
              {organizations.map(org => (
                <option key={org} value={org || ''}>{org}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-dark-text-secondary">
              {filteredExperts.length} expertos encontrados
            </p>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-dark-text-secondary">Mostrar:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="px-2 py-1 bg-dark-bg-tertiary border border-dark-bg-tertiary rounded text-dark-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-micmac-primary-500"
              >
                <option value={6}>6</option>
                <option value={12}>12</option>
                <option value={24}>24</option>
                <option value={filteredExperts.length}>Todos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de expertos */}
        {loadingExperts ? (
          <div className="card p-8 text-center">
            <div className="animate-pulse-slow rounded-full h-8 w-8 bg-micmac-primary-500 mx-auto mb-4"></div>
            <p className="text-dark-text-secondary">Cargando expertos...</p>
          </div>
        ) : currentExperts.length === 0 ? (
          <div className="card p-8 text-center">
            <div className="text-4xl mb-4">👨‍🔬</div>
            <h3 className="text-lg font-medium text-dark-text-primary mb-2">
              {filteredExperts.length === 0 ? 'No hay expertos' : 'No se encontraron expertos'}
            </h3>
            <p className="text-dark-text-secondary mb-6">
              {filteredExperts.length === 0 
                ? 'Comienza agregando tu primer experto al sistema'
                : 'Intenta ajustar los filtros de búsqueda'
              }
            </p>
            {filteredExperts.length === 0 && (
              <Button 
                color="primary" 
                onClick={() => setShowCreateModal(true)}
              >
                Crear Primer Experto
              </Button>
            )}
          </div>
        ) : (
          <div className="card p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentExperts.map((expert) => (
                <ExpertCard
                  key={expert.id}
                  expert={expert}
                  onEdit={() => setEditingExpert(expert)}
                  onDelete={() => handleDeleteExpert(expert)}
                  onViewDetail={() => setShowDetailModal(expert)}
                />
              ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-dark-bg-tertiary">
                <div className="text-sm text-dark-text-secondary">
                  Mostrando {startIndex + 1}-{Math.min(endIndex, filteredExperts.length)} de {filteredExperts.length} expertos
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    ghost
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    ← Anterior
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNumber = index + 1
                      const isCurrentPage = pageNumber === currentPage
                      
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => setCurrentPage(pageNumber)}
                          className={`w-8 h-8 rounded text-sm transition-colors ${
                            isCurrentPage
                              ? 'bg-micmac-primary-500 text-white'
                              : 'text-dark-text-secondary hover:bg-dark-bg-tertiary'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      )
                    })}
                  </div>
                  
                  <Button
                    ghost
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Siguiente →
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modales */}
        {showCreateModal && (
          <ExpertFormModal
            mode="create"
            onSave={handleCreateExpert}
            onClose={() => setShowCreateModal(false)}
          />
        )}

        {editingExpert && (
          <ExpertFormModal
            mode="edit"
            expert={editingExpert}
            onSave={(data) => handleUpdateExpert(editingExpert.id, data)}
            onClose={() => setEditingExpert(null)}
          />
        )}

        {showDetailModal && (
          <ExpertDetailModal
            expert={showDetailModal}
            onClose={() => setShowDetailModal(null)}
            onEdit={() => {
              setEditingExpert(showDetailModal)
              setShowDetailModal(null)
            }}
          />
        )}
      </div>
    </AppLayout>
  )
}
