'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import DateTimePicker from '@/components/ui/DateTimePicker'
import TimezoneSelector from '@/components/ui/TimezoneSelector'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import AppLayout from '@/components/layout/AppLayout'
import TabsNavigation, { TabId } from '@/components/ui/TabsNavigation'
import VariableEditModal from '@/components/ui/VariableEditModal'
import ExpertSelector from '@/components/projects/ExpertSelector'
import { ProjectType, Expert } from '@/types/project'
import { useMockData } from '@/contexts/MockDataContext'
import { useNavigationLoading } from '@/contexts/NavigationLoadingContext'
import { addDays, addHours } from 'date-fns'
import { 
  TrendingUp, TrendingDown, Minus, Clock, Target, Users, 
  Award, AlertCircle, CheckCircle, Star, Zap, Brain, Eye
} from 'lucide-react'
import { ExpertMetricsUtils } from '@/utils/expertMetricsCalculator'
import ExpertDetailModal from '@/components/experts/ExpertDetailModal'

interface Variable {
  id: string
  name: string
  description: string
  order: number
}

interface ProjectCreationForm {
  name: string
  description: string
  type: ProjectType
  variables: Variable[]
  startDate?: Date
  endDate?: Date
  timezone: string
  expectedExperts: number
  expertEmails: string[]
  selectedExperts: Expert[]
  allowLateVoting: boolean
  reminderDays: number
}

interface FormErrors {
  name?: string
  description?: string
  startDate?: string
  endDate?: string
  timezone?: string
  expectedExperts?: string
  expertEmails?: string
}

interface ExpertSelectionTabProps {
  selectedExperts: Expert[]
  onExpertsChange: (experts: Expert[]) => void
  expectedExperts: number
}

// Componente de tarjeta de experto en modo solo lectura (sin editar/eliminar)
function ExpertCardReadOnly({ expert, onViewDetail, onRemove, showRemove = true }: {
  expert: Expert
  onViewDetail: () => void
  onRemove?: () => void
  showRemove?: boolean
}) {
  const roleColors = {
    EXPERT: 'bg-blue-500/20 text-blue-400',
    MODERATOR: 'bg-purple-500/20 text-purple-400'
  }

  const roleLabels = {
    EXPERT: 'Experto',
    MODERATOR: 'Moderador'
  }

  const metrics = expert.performanceMetrics
  const stats = expert.quickStats

  const getReliabilityColor = (priority?: string) => {
    switch (priority) {
      case 'HIGH': return 'text-green-400 bg-green-900/20'
      case 'MEDIUM': return 'text-blue-400 bg-blue-900/20'
      case 'LOW': return 'text-yellow-400 bg-yellow-900/20'
      case 'AVOID': return 'text-red-400 bg-red-900/20'
      default: return 'text-gray-400 bg-gray-900/20'
    }
  }

  const getTrendIcon = (trend?: number) => {
    if (!trend) return <Minus className="h-3 w-3 text-gray-400" />
    if (trend > 5) return <TrendingUp className="h-3 w-3 text-green-400" />
    if (trend < -5) return <TrendingDown className="h-3 w-3 text-red-400" />
    return <Minus className="h-3 w-3 text-gray-400" />
  }

  return (
    <div className="bg-gray-800 dark:bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700 dark:border-gray-600 hover:border-gray-600 dark:hover:border-gray-500 transition-all hover:scale-[1.02] duration-300 h-full flex flex-col">
      {/* Header del experto */}
      <div className="flex items-start justify-between mb-4 gap-2">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="relative shrink-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm sm:text-base">
              {expert.avatar ? (
                <img 
                  src={expert.avatar} 
                  alt={expert.name}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                />
              ) : (
                expert.name.substring(0, 2).toUpperCase()
              )}
            </div>
            {metrics?.invitationPriority && (
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-xs ${
                getReliabilityColor(metrics.invitationPriority)
              }`}>
                {metrics.invitationPriority === 'HIGH' ? '🔥' : 
                 metrics.invitationPriority === 'MEDIUM' ? '⚡' :
                 metrics.invitationPriority === 'LOW' ? '⚠️' : '❌'}
              </div>
            )}
          </div>
          
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-white dark:text-white text-sm sm:text-base truncate" title={expert.name}>
              {expert.name}
            </h3>
            <p className="text-xs text-gray-400 dark:text-gray-400 truncate" title={expert.organization || undefined}>
              {expert.organization}
            </p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${roleColors[expert.role]}`}>
                {roleLabels[expert.role]}
              </span>
              {metrics?.trends && getTrendIcon(metrics.trends.last30Days)}
            </div>
          </div>
        </div>

        {/* Badges */}
        {metrics?.badges && metrics.badges.length > 0 && (
          <div className="flex gap-1 shrink-0">
            {metrics.badges.slice(0, 2).map((badge, index) => (
              <span 
                key={index}
                className="text-base sm:text-lg"
                title={`${badge.name} - ${badge.level}`}
              >
                {badge.icon}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Métricas principales */}
      {metrics && (
        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4">
          <div className="bg-gray-700/50 dark:bg-gray-700/50 rounded-lg p-2 sm:p-3">
            <div className="flex items-center gap-1 sm:gap-2 mb-1">
              <Target className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400 shrink-0" />
              <span className="text-xs text-gray-400 dark:text-gray-400 truncate">Confiabilidad</span>
            </div>
            <div className={`text-base sm:text-lg font-bold ${ExpertMetricsUtils.getScoreColor(metrics.overallReliability)}`}>
              {metrics.overallReliability}%
            </div>
          </div>
          
          <div className="bg-gray-700/50 dark:bg-gray-700/50 rounded-lg p-2 sm:p-3">
            <div className="flex items-center gap-1 sm:gap-2 mb-1">
              <Brain className="h-3 w-3 sm:h-4 sm:w-4 text-purple-400 shrink-0" />
              <span className="text-xs text-gray-400 dark:text-gray-400 truncate">Consistencia</span>
            </div>
            <div className={`text-base sm:text-lg font-bold ${ExpertMetricsUtils.getScoreColor(metrics.consistencyScore)}`}>
              {metrics.consistencyScore}%
            </div>
          </div>
        </div>
      )}

      {/* Estadísticas rápidas */}
      {stats && (
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-gray-400 dark:text-gray-400 min-w-0">
              <Users className="h-3 w-3 shrink-0" />
              <span className="truncate">Proyectos</span>
            </div>
            <span className="text-white dark:text-white font-medium shrink-0">{stats.totalInvitations}</span>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-gray-400 dark:text-gray-400 min-w-0">
              <CheckCircle className="h-3 w-3 shrink-0" />
              <span className="truncate">Completados</span>
            </div>
            <span className="text-white dark:text-white font-medium shrink-0">{stats.completionRate}%</span>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-gray-400 dark:text-gray-400 min-w-0">
              <Clock className="h-3 w-3 shrink-0" />
              <span className="truncate">Respuesta</span>
            </div>
            <span className="text-white dark:text-white font-medium shrink-0">
              {ExpertMetricsUtils.formatTime(stats.averageResponseTimeHours)}
            </span>
          </div>

          {stats.totalInconsistencies > 0 && (
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-gray-400 dark:text-gray-400 min-w-0">
                <AlertCircle className="h-3 w-3 shrink-0" />
                <span className="truncate">Inconsistencias</span>
              </div>
              <span className="text-yellow-400 font-medium shrink-0">{stats.totalInconsistencies}</span>
            </div>
          )}
        </div>
      )}

      {/* Áreas de expertise */}
      <div className="mb-4 flex-1">
        <div className="flex flex-wrap gap-1">
          {expert.expertiseAreas.slice(0, 2).map((exp) => (
            <span
              key={exp}
              className="px-2 py-1 bg-gray-700 dark:bg-gray-700 text-gray-300 dark:text-gray-300 rounded text-xs truncate max-w-full"
              title={exp}
            >
              {exp}
            </span>
          ))}
          {expert.expertiseAreas.length > 2 && (
            <span className="px-2 py-1 text-gray-400 dark:text-gray-400 text-xs shrink-0">
              +{expert.expertiseAreas.length - 2}
            </span>
          )}
        </div>
      </div>

      {/* Acciones - Solo Ver Perfil y opcionalmente Remover */}
      <div className="flex items-center gap-2 mt-auto">
        <Button
          ghost
          size="sm"
          onClick={onViewDetail}
          className="flex-1 text-xs min-w-0 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
        >
          <Eye className="h-4 w-4 mr-1" />
          <span className="truncate">Ver Perfil</span>
        </Button>
        {showRemove && onRemove && (
          <Button
            ghost
            size="sm"
            onClick={onRemove}
            className="text-red-400 hover:text-red-300 hover:bg-red-900/20 px-3"
          >
            ×
          </Button>
        )}
      </div>

      {/* Última actualización de métricas */}
      {metrics?.lastCalculated && (
        <div className="mt-3 pt-3 border-t border-gray-700 dark:border-gray-600">
          <p className="text-xs text-gray-500 dark:text-gray-500 truncate" title={`Métricas: ${new Date(metrics.lastCalculated).toLocaleDateString('es-ES')}`}>
            Métricas: {new Date(metrics.lastCalculated).toLocaleDateString('es-ES')}
          </p>
        </div>
      )}
    </div>
  )
}

function ExpertSelectionTab({ selectedExperts, onExpertsChange, expectedExperts }: ExpertSelectionTabProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterByExpertise, setFilterByExpertise] = useState('')
  const [showDetailModal, setShowDetailModal] = useState<Expert | null>(null)
  
  const { experts, loadingExperts } = useMockData()

  // Filtrar expertos disponibles (no seleccionados)
  const availableForSelection = experts.filter(expert => 
    !selectedExperts.some(selected => selected.id === expert.id)
  )

  // Filtrar por búsqueda y expertise
  const filteredAvailable = availableForSelection.filter(expert => {
    const matchesSearch = expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expert.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expert.organization?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesExpertise = !filterByExpertise || 
                           expert.expertiseAreas.some(exp => 
                             exp.toLowerCase().includes(filterByExpertise.toLowerCase())
                           )
    
    return matchesSearch && matchesExpertise
  })

  // Ordenar por puntuación de confiabilidad (descendente)
  const sortedAvailable = filteredAvailable.sort((a, b) => 
    (b.reliabilityScore || 0) - (a.reliabilityScore || 0)
  )

  // Obtener todas las áreas de expertise para el filtro
  const allExpertiseAreas = Array.from(
    new Set(experts.flatMap(expert => expert.expertiseAreas))
  ).sort()

  const addExpert = (expert: Expert) => {
    if (selectedExperts.length >= 50) {
      alert('Máximo 50 expertos permitidos por proyecto')
      return
    }
    
    const updatedExperts = [...selectedExperts, expert]
    onExpertsChange(updatedExperts)
  }

  const removeExpert = (expertId: string) => {
    const updatedExperts = selectedExperts.filter(expert => expert.id !== expertId)
    onExpertsChange(updatedExperts)
  }

  const selectAllExperts = () => {
    const allAvailable = availableForSelection.slice(0, 50 - selectedExperts.length)
    const updatedExperts = [...selectedExperts, ...allAvailable]
    onExpertsChange(updatedExperts)
  }



  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            👥 Selección de Expertos
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Expertos seleccionados arriba, catálogo completo abajo con filtros avanzados
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          selectedExperts.length >= 3
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
        }`}>
          {selectedExperts.length >= 3 ? '✅ Válido' : '⚠️ Incompleto'}
        </span>
      </div>

      {/* SECCIÓN 1: EXPERTOS SELECCIONADOS */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Expertos Seleccionados
          </h3>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {selectedExperts.length}/{expectedExperts} expertos • Mínimo 3 requeridos
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              selectedExperts.length >= 3 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
            }`}>
              {selectedExperts.length >= 3 ? 'Válido' : `Faltan ${3 - selectedExperts.length}`}
            </span>
          </div>
        </div>

        {selectedExperts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedExperts.map((expert) => (
              <ExpertCardReadOnly
                key={expert.id}
                expert={expert}
                onViewDetail={() => setShowDetailModal(expert)}
                onRemove={() => removeExpert(expert.id)}
                showRemove={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 dark:bg-gray-900/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400 mb-4">No hay expertos seleccionados</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">Selecciona expertos del catálogo de abajo</p>
          </div>
        )}
      </div>

      {/* SECCIÓN 2: CATÁLOGO DE EXPERTOS DISPONIBLES */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Catálogo de Expertos Disponibles
          </h3>
          {availableForSelection.length > 0 && (
            <Button
              onClick={selectAllExperts}
              ghost
              size="sm"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
            >
              Seleccionar Todos ({availableForSelection.length})
            </Button>
          )}
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Input
            placeholder="Buscar por nombre, email u organización..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          <select
            value={filterByExpertise}
            onChange={(e) => setFilterByExpertise(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
              dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="">Todas las áreas de expertise</option>
            {allExpertiseAreas.map(area => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
        </div>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {sortedAvailable.length} expertos disponibles • Ordenados por puntuación de confiabilidad
        </p>

        {/* Lista de expertos disponibles */}
        {loadingExperts ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-pulse-slow rounded-full h-8 w-8 bg-micmac-primary-500"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">Cargando expertos...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {sortedAvailable.map((expert) => (
              <div key={expert.id} className="relative">
                <ExpertCardReadOnly
                  expert={expert}
                  onViewDetail={() => setShowDetailModal(expert)}
                  showRemove={false}
                />
                {/* Botón de agregar superpuesto */}
                <div className="absolute bottom-4 left-4 right-4">
                  <Button
                    color="primary"
                    size="sm"
                    onClick={() => addExpert(expert)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Agregar Experto
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loadingExperts && sortedAvailable.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium mb-2">
              {availableForSelection.length === 0 
                ? 'Todos los expertos han sido seleccionados' 
                : 'No se encontraron expertos con esos criterios'
              }
            </p>
            {availableForSelection.length === 0 ? (
              <p className="text-sm text-gray-400 dark:text-gray-500">
                ¡Excelente! Has seleccionado todos los expertos disponibles
              </p>
            ) : (
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Intenta cambiar los filtros de búsqueda o área de expertise
              </p>
            )}
          </div>
        )}
      </div>

      {/* Info metodológica */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white text-xs flex-shrink-0">
            ℹ️
          </div>
          <div>
            <h4 className="font-medium text-blue-900 dark:text-blue-100">
              Panel de Expertos MIC MAC
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
              Selecciona entre 3-50 expertos con expertise diversa y relevante para el análisis prospectivo. 
              La diversidad de perspectivas es clave para un análisis MIC MAC robusto. Los expertos están 
              ordenados por puntuación de confiabilidad para facilitar la selección.
            </p>
          </div>
        </div>
      </div>

      {/* Modal de detalle de experto */}
      {showDetailModal && (
        <ExpertDetailModal
          expert={showDetailModal}
          onClose={() => setShowDetailModal(null)}
          showEditButton={false}
        />
      )}
    </div>
  )
}

export default function CreateProjectPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { createProject, projects } = useMockData()
  const { startLoading } = useNavigationLoading()
  
  // Detectar si estamos en modo de edición
  const editProjectId = searchParams.get('edit')
  const isEditMode = !!editProjectId
  const projectToEdit = isEditMode ? projects.find(p => p.id === editProjectId) : null
  
  const [activeTab, setActiveTab] = useState<TabId>('general')
  // Variables geopolíticas del mock
  const geopoliticalVariables: Variable[] = [
    {
      id: 'esc-1',
      name: 'ESC1 - INVASIÓN MILITAR',
      description: 'Despliegue de una cabeza de playa por parte del cuerpo de infantería de marina de los EEUU en costas venezolanas, para derrocar al GB. "Esquema Panamá".',
      order: 0
    },
    {
      id: 'esc-2', 
      name: 'ESC2 - CUARENTENA NAVAL',
      description: 'Bloqueo naval por parte de la armada de los EE.UU., a las costas venezolanas para generar asfixia económica y controlar el tráfico marítimo hacia Venezuela.',
      order: 1
    },
    {
      id: 'esc-3',
      name: 'ESC3 - OPERACIÓN QUIRÚRGICA', 
      description: 'Acción mercenaria con el empleo de operadores de fuerzas especiales y el apoyo logístico del dispositivo naval desplegado por los EE.UU.',
      order: 2
    },
    {
      id: 'esc-4',
      name: 'ESC4 - OPERACIÓN PSICOLÓGICA',
      description: 'Uso de fake-news y guerra cognitiva para quebrar la moral de los funcionarios del aparato de seguridad del estado venezolano.',
      order: 3
    },
    {
      id: 'esc-5',
      name: 'ESC5 - ATAQUE DE FALSA BANDERA',
      description: 'Los buques de la Armada de EE.UU. simularían un ataque de fuerzas navales venezolanas, similar al "Incidente de Tonkín".',
      order: 4
    }
  ]

  const [formData, setFormData] = useState<ProjectCreationForm>({
    name: 'Análisis de Escenarios Geopolíticos',
    description: 'Posibles escenarios de intervención militar de EE.UU. en Venezuela - Ejercicio modelo para validación del sistema MIC MAC.',
    type: 'STRATEGIC',
    variables: geopoliticalVariables, // Inicializar con variables del mock
    startDate: addHours(new Date(), 2),
    endDate: addDays(new Date(), 7),
    timezone: 'America/Caracas',
    expectedExperts: 8,
    expertEmails: [],
    selectedExperts: [],
    allowLateVoting: false,
    reminderDays: 1
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newExpertEmail, setNewExpertEmail] = useState('')

  // Estados para modales de edición
  const [editingVariable, setEditingVariable] = useState<Variable | null>(null)
  const [isVariableModalOpen, setIsVariableModalOpen] = useState(false)
  const [isNewVariable, setIsNewVariable] = useState(false)

  // Cargar datos del proyecto en modo de edición
  useEffect(() => {
    if (isEditMode && projectToEdit) {
      setFormData({
        name: projectToEdit.name,
        description: projectToEdit.description || '',
        type: projectToEdit.type,
        variables: projectToEdit.variables.map((v, index) => ({
          id: v.id,
          name: v.name,
          description: v.description || '',
          order: index
        })),
        startDate: projectToEdit.startDate ? new Date(projectToEdit.startDate) : addHours(new Date(), 2),
        endDate: projectToEdit.endDate ? new Date(projectToEdit.endDate) : addDays(new Date(), 7),
        timezone: projectToEdit.timezone || 'America/Caracas',
        expectedExperts: projectToEdit.expectedExperts,
        expertEmails: projectToEdit.projectExperts.map(pe => pe.expert.email),
        selectedExperts: projectToEdit.projectExperts.map(pe => pe.expert),
        allowLateVoting: false,
        reminderDays: 1
      })
    }
  }, [isEditMode, projectToEdit])

  // Funciones para manejar variables
  const handleSaveVariable = (updatedVariable: Variable) => {
    if (isNewVariable) {
      // Agregar nueva variable
      setFormData(prev => ({
        ...prev,
        variables: [...prev.variables, { ...updatedVariable, order: prev.variables.length }]
      }))
    } else {
      // Actualizar variable existente
      setFormData(prev => ({
        ...prev,
        variables: prev.variables.map(v => 
          v.id === updatedVariable.id ? updatedVariable : v
        )
      }))
    }
    setEditingVariable(null)
    setIsVariableModalOpen(false)
    setIsNewVariable(false)
  }

  const handleEditVariable = (variable: Variable) => {
    setEditingVariable(variable)
    setIsNewVariable(false)
    setIsVariableModalOpen(true)
  }

  const handleAddNewVariable = () => {
    setEditingVariable({
      id: `var-${Date.now()}`,
      name: `ESC${formData.variables.length + 1} - NUEVO ESCENARIO`,
      description: 'Describe el nuevo escenario geopolítico que los expertos evaluarán.',
      order: formData.variables.length
    })
    setIsNewVariable(true)
    setIsVariableModalOpen(true)
  }

  // Calcular estado de completitud de cada pestaña
  const getTabCompletionStatus = () => {
    const general: 'complete' | 'partial' | 'pending' = 
      formData.name && formData.description ? 'complete' : 
      formData.name || formData.description ? 'partial' : 'pending'
    
    const variables: 'complete' | 'partial' | 'pending' = 
      formData.variables.length >= 3 ? 'complete' : 
      formData.variables.length > 0 ? 'partial' : 'pending'
    
    const experts: 'complete' | 'partial' | 'pending' = 
      formData.selectedExperts.length >= formData.expectedExperts ? 'complete' : 
      formData.selectedExperts.length > 0 ? 'partial' : 'pending'
    
    const scheduling: 'complete' | 'partial' | 'pending' = 
      formData.startDate && formData.endDate ? 'complete' : 
      formData.startDate || formData.endDate ? 'partial' : 'pending'
    
    return { general, variables, experts, scheduling }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    
    // Validar nombre
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del proyecto es obligatorio'
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres'
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'El nombre no puede exceder 100 caracteres'
    }
    
    // Validar descripción
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es obligatoria'
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'La descripción debe tener al menos 10 caracteres'
    } else if (formData.description.trim().length > 1000) {
      newErrors.description = 'La descripción no puede exceder 1000 caracteres'
    }
    
    // Validar fechas
    if (!formData.startDate) {
      newErrors.startDate = 'La fecha de inicio es obligatoria'
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'La fecha de finalización es obligatoria'
    }
    
    if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
      newErrors.endDate = 'La fecha de finalización debe ser posterior a la de inicio'
    }
    
    // Validar número de expertos
    if (formData.expectedExperts < 3) {
      newErrors.expectedExperts = 'Mínimo 3 expertos requeridos'
    } else if (formData.expectedExperts > 50) {
      newErrors.expectedExperts = 'Máximo 50 expertos permitidos'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const result = await createProject({
        name: formData.name.trim(),
        description: formData.description.trim(),
        type: formData.type,
        expectedExperts: formData.expectedExperts,
        // TODO: Agregar campos adicionales cuando se actualice el contexto
        // variables: formData.variables,
        // startDate: formData.startDate,
        // endDate: formData.endDate,
        // timezone: formData.timezone,
        // expertEmails: formData.expertEmails
      })
      
      if (result.success) {
        startLoading('/projects')
        router.push('/projects')
      }
      
    } catch (error) {
      console.error('Error creating project:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof ProjectCreationForm, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const addExpertEmail = () => {
    if (newExpertEmail && newExpertEmail.includes('@') && !formData.expertEmails.includes(newExpertEmail)) {
      setFormData(prev => ({
        ...prev,
        expertEmails: [...prev.expertEmails, newExpertEmail]
      }))
      setNewExpertEmail('')
    }
  }

  const removeExpertEmail = (email: string) => {
    setFormData(prev => ({
      ...prev,
      expertEmails: prev.expertEmails.filter(e => e !== email)
    }))
  }

  const handleCancel = () => {
    startLoading('/projects')
    router.push('/projects')
  }

  return (
    <AppLayout>
      <div className="space-y-6">
      <Breadcrumbs />
      
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {isEditMode ? 'Editar Proyecto MIC MAC' : 'Crear Nuevo Proyecto MIC MAC'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {isEditMode ? 'Modifica la configuración de tu análisis prospectivo' : 'Configura un análisis prospectivo estructural completo'}
              </p>
            </div>
          </div>
          
          {/* Estado del proyecto */}
          <div className="hidden md:block">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
              📝 Borrador
            </span>
          </div>
        </div>
      </div>

      {/* Navegación de pestañas */}
      <TabsNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        completionStatus={getTabCompletionStatus()}
      />

      {/* Contenido de las pestañas */}
      <div className="mt-8">
        {activeTab === 'general' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              📋 Información General del Proyecto
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Nombre del Proyecto */}
              <div className="lg:col-span-2">
                <label htmlFor="project-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre del Proyecto *
                </label>
                <Input
                  id="project-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="ej. Análisis de Escenarios Geopolíticos"
                  className={errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Tipo de Análisis */}
              <div>
                <label htmlFor="project-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tipo de Análisis
                </label>
                <select
                  id="project-type"
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value as ProjectType)}
                  className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm shadow-sm transition-colors focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  <option value="STRATEGIC">Estratégico</option>
                  <option value="TECHNOLOGICAL">Tecnológico</option>
                  <option value="ENVIRONMENTAL">Ambiental</option>
                  <option value="SOCIAL">Social</option>
                  <option value="ECONOMIC">Económico</option>
                </select>
              </div>

              {/* Número de Expertos */}
              <div>
                <label htmlFor="expected-experts" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Número de Expertos Esperados
                </label>
                <Input
                  id="expected-experts"
                  type="number"
                  min="3"
                  max="50"
                  value={formData.expectedExperts}
                  onChange={(e) => handleInputChange('expectedExperts', parseInt(e.target.value) || 0)}
                  className={errors.expectedExperts ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
                  disabled={isSubmitting}
                />
                {errors.expectedExperts && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.expectedExperts}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Recomendado: 5-15 expertos para análisis equilibrado
                </p>
              </div>

              {/* Descripción */}
              <div className="lg:col-span-2">
                <label htmlFor="project-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Descripción *
                </label>
                <textarea
                  id="project-description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe el contexto, objetivos y alcance del análisis prospectivo. Incluye información relevante sobre el sector, problemática o escenarios a evaluar..."
                  className={`block w-full rounded-lg border px-3 py-2 text-sm shadow-sm transition-colors
                    ${errors.description 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    }
                    dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400
                    disabled:cursor-not-allowed disabled:opacity-50
                  `}
                  disabled={isSubmitting}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.description}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {formData.description.length}/1000 caracteres
                </p>
              </div>
            </div>
            
            {/* Botón para cargar ejemplo */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <Button
                type="button"
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    name: 'Análisis de Escenarios Geopolíticos',
                    description: 'Posibles escenarios de intervención militar de EE.UU. en Venezuela - Ejercicio modelo para validación del sistema MIC MAC.',
                    type: 'STRATEGIC' as ProjectType,
                    variables: geopoliticalVariables
                  }))
                }}
                ghost
                className="w-full sm:w-auto"
              >
                📝 Cargar Ejemplo Geopolítico
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'variables' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  🔧 Variables del Sistema MIC MAC ⭐
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {formData.variables.length}/20 variables • Mínimo 3 requeridas
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                formData.variables.length >= 3 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              }`}>
                {formData.variables.length >= 3 ? '✅ Válido' : '⚠️ Incompleto'}
              </span>
            </div>

            {/* Lista de variables */}
            <div className="space-y-4">
              {formData.variables.map((variable, index) => (
                <div
                  key={variable.id}
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-sm font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {variable.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {variable.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => handleEditVariable(variable)}
                        className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const newVariables = formData.variables.filter(v => v.id !== variable.id)
                          setFormData(prev => ({ ...prev, variables: newVariables }))
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Botón agregar variable */}
              {formData.variables.length < 20 && (
                <button
                  type="button"
                  onClick={handleAddNewVariable}
                  className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-gray-500 dark:text-gray-400 hover:border-blue-400 hover:text-blue-600 dark:hover:border-blue-500 dark:hover:text-blue-400 transition-colors"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Agregar Variable</span>
                  </div>
                  <p className="text-xs mt-1">
                    {20 - formData.variables.length} espacios disponibles
                  </p>
                </button>
              )}
            </div>

            {/* Información metodológica */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white text-xs">
                  ℹ️
                </div>
                <div>
                  <h4 className="font-medium text-blue-900 dark:text-blue-100">
                    Metodología MIC MAC
                  </h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                                      Las variables representan los factores clave del sistema que los expertos evaluarán. 
                  Se recomienda entre 3-20 variables para mantener la complejidad manejable en la matriz de votación.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'experts' && (
          <ExpertSelectionTab
            selectedExperts={formData.selectedExperts}
            onExpertsChange={(experts) => {
              setFormData(prev => ({
                ...prev,
                selectedExperts: experts,
                // Sincronizar emails para compatibilidad
                expertEmails: experts.map(e => e.email)
              }))
            }}
            expectedExperts={formData.expectedExperts}
          />
        )}

        {activeTab === 'scheduling' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  📅 Programación de Votaciones
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Configura el período de votación y zona horaria del proyecto
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                formData.startDate && formData.endDate
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              }`}>
                {formData.startDate && formData.endDate ? '✅ Programado' : '⚠️ Pendiente'}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Zona Horaria */}
              <div className="lg:col-span-3">
                <TimezoneSelector
                  label="Zona Horaria del Proyecto"
                  value={formData.timezone}
                  onChange={(timezone) => handleInputChange('timezone', timezone)}
                  disabled={isSubmitting}
                  error={errors.timezone}
                />
              </div>

              {/* Fecha de Inicio */}
              <div>
                <DateTimePicker
                  label="Fecha y Hora de Inicio *"
                  value={formData.startDate}
                  onChange={(date) => handleInputChange('startDate', date)}
                  disabled={isSubmitting}
                  error={errors.startDate}
                  placeholder="Cuándo inicia la votación"
                />
              </div>

              {/* Fecha de Finalización */}
              <div>
                <DateTimePicker
                  label="Fecha y Hora de Finalización *"
                  value={formData.endDate}
                  onChange={(date) => handleInputChange('endDate', date)}
                  minDate={formData.startDate}
                  disabled={isSubmitting}
                  error={errors.endDate}
                  placeholder="Cuándo termina la votación"
                />
              </div>

              {/* Recordatorio */}
              <div>
                <label htmlFor="reminder-days" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Recordatorio (días antes)
                </label>
                <Input
                  id="reminder-days"
                  type="number"
                  min="0"
                  max="30"
                  value={formData.reminderDays}
                  onChange={(e) => handleInputChange('reminderDays', parseInt(e.target.value) || 0)}
                  disabled={isSubmitting}
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Se enviará recordatorio a los expertos
                </p>
              </div>
            </div>

            {/* Configuración adicional */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                ⚙️ Configuración Avanzada
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="allow-late-voting"
                    type="checkbox"
                    checked={formData.allowLateVoting}
                    onChange={(e) => handleInputChange('allowLateVoting', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    disabled={isSubmitting}
                  />
                  <label htmlFor="allow-late-voting" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Permitir votaciones después de la fecha límite
                  </label>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 ml-6">
                  Los votos tardíos se marcarán como tales en los resultados
                </p>
              </div>
            </div>

            {/* Resumen de programación */}
            {formData.startDate && formData.endDate && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white text-xs">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-medium text-green-900 dark:text-green-100">
                      Proyecto Programado
                    </h4>
                    <p className="text-sm text-green-800 dark:text-green-200 mt-1">
                      📅 <strong>Inicio:</strong> {formData.startDate.toLocaleString('es-ES', { 
                        timeZone: formData.timezone,
                        dateStyle: 'full',
                        timeStyle: 'short'
                      })}
                    </p>
                    <p className="text-sm text-green-800 dark:text-green-200">
                      📋 <strong>Fin:</strong> {formData.endDate.toLocaleString('es-ES', {
                        timeZone: formData.timezone,
                        dateStyle: 'full', 
                        timeStyle: 'short'
                      })}
                    </p>
                    <p className="text-sm text-green-800 dark:text-green-200">
                      🌍 <strong>Zona horaria:</strong> {formData.timezone}
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-300 mt-2">
                      Duración: {Math.ceil((formData.endDate.getTime() - formData.startDate.getTime()) / (1000 * 60 * 60 * 24))} días
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Botón de configuración rápida */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <Button
                type="button"
                onClick={() => {
                  const now = new Date()
                  const startDate = addHours(now, 2) // 2 horas desde ahora
                  const endDate = addDays(now, 7) // 7 días desde ahora
                  
                  setFormData(prev => ({
                    ...prev,
                    startDate,
                    endDate,
                    timezone: 'America/Caracas',
                    reminderDays: 1,
                    allowLateVoting: false
                  }))
                }}
                ghost
                className="w-full sm:w-auto"
              >
                ⏱️ Configuración Rápida (7 días)
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Formulario oculto para testing - remover después */}
      <form onSubmit={handleSubmit} className="hidden space-y-8">
        {/* Información Básica */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            📋 Información Básica
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Nombre del Proyecto */}
            <div className="lg:col-span-2">
              <label htmlFor="project-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nombre del Proyecto *
              </label>
              <Input
                id="project-name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="ej. Futuro del Sector Energético 2030"
                className={errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Tipo de Análisis */}
            <div>
              <label htmlFor="project-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tipo de Análisis
              </label>
              <select
                id="project-type"
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value as ProjectType)}
                className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm shadow-sm transition-colors focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:text-white disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isSubmitting}
              >
                <option value="STRATEGIC">Estratégico</option>
                <option value="TECHNOLOGICAL">Tecnológico</option>
                <option value="ENVIRONMENTAL">Ambiental</option>
                <option value="SOCIAL">Social</option>
                <option value="ECONOMIC">Económico</option>
              </select>
            </div>

            {/* Número de Expertos */}
            <div>
              <label htmlFor="expected-experts" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Número de Expertos Esperados
              </label>
              <Input
                id="expected-experts"
                type="number"
                min="3"
                max="50"
                value={formData.expectedExperts}
                onChange={(e) => handleInputChange('expectedExperts', parseInt(e.target.value) || 0)}
                className={errors.expectedExperts ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
                disabled={isSubmitting}
              />
              {errors.expectedExperts && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.expectedExperts}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Recomendado: 5-15 expertos para análisis equilibrado
              </p>
            </div>

            {/* Descripción */}
            <div className="lg:col-span-2">
              <label htmlFor="project-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Descripción *
              </label>
              <textarea
                id="project-description"
                rows={4}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe el contexto, objetivos y alcance del análisis prospectivo. Incluye información relevante sobre el sector, problemática o escenarios a evaluar..."
                className={`block w-full rounded-lg border px-3 py-2 text-sm shadow-sm transition-colors
                  ${errors.description 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  }
                  dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400
                  disabled:cursor-not-allowed disabled:opacity-50
                `}
                disabled={isSubmitting}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.description}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {formData.description.length}/1000 caracteres
              </p>
            </div>
          </div>
        </div>

        {/* Calendario y Fechas */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            📅 Programación de Votaciones
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Zona Horaria */}
            <div className="lg:col-span-3">
              <TimezoneSelector
                label="Zona Horaria del Proyecto"
                value={formData.timezone}
                onChange={(timezone) => handleInputChange('timezone', timezone)}
                disabled={isSubmitting}
                error={errors.timezone}
              />
            </div>

            {/* Fecha de Inicio */}
            <div>
              <DateTimePicker
                label="Fecha y Hora de Inicio *"
                value={formData.startDate}
                onChange={(date) => handleInputChange('startDate', date)}
                disabled={isSubmitting}
                error={errors.startDate}
                placeholder="Cuándo inicia la votación"
              />
            </div>

            {/* Fecha de Finalización */}
            <div>
              <DateTimePicker
                label="Fecha y Hora de Finalización *"
                value={formData.endDate}
                onChange={(date) => handleInputChange('endDate', date)}
                minDate={formData.startDate}
                disabled={isSubmitting}
                error={errors.endDate}
                placeholder="Cuándo termina la votación"
              />
            </div>

            {/* Recordatorio */}
            <div>
              <label htmlFor="reminder-days" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Recordatorio (días antes)
              </label>
              <Input
                id="reminder-days"
                type="number"
                min="0"
                max="30"
                value={formData.reminderDays}
                onChange={(e) => handleInputChange('reminderDays', parseInt(e.target.value) || 0)}
                disabled={isSubmitting}
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Se enviará recordatorio a los expertos
              </p>
            </div>
          </div>

          {/* Configuración adicional */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <input
                id="allow-late-voting"
                type="checkbox"
                checked={formData.allowLateVoting}
                onChange={(e) => handleInputChange('allowLateVoting', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={isSubmitting}
              />
              <label htmlFor="allow-late-voting" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Permitir votaciones después de la fecha límite
              </label>
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 ml-6">
              Los votos tardíos se marcarán como tales en los resultados
            </p>
          </div>
        </div>

        {/* Lista de Expertos */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            👥 Invitar Expertos (Opcional)
          </h2>
          
          {/* Agregar nuevo experto */}
          <div className="flex space-x-2 mb-4">
            <Input
              type="email"
              value={newExpertEmail}
              onChange={(e) => setNewExpertEmail(e.target.value)}
              placeholder="email@experto.com"
              className="flex-1"
              disabled={isSubmitting}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addExpertEmail())}
            />
            <Button
              type="button"
              onClick={addExpertEmail}
              disabled={!newExpertEmail || isSubmitting}
              ghost
            >
              Agregar
            </Button>
          </div>

          {/* Lista de expertos agregados */}
          {formData.expertEmails.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Expertos invitados ({formData.expertEmails.length}):
              </p>
              <div className="flex flex-wrap gap-2">
                {formData.expertEmails.map((email, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  >
                    {email}
                    <button
                      type="button"
                      onClick={() => removeExpertEmail(email)}
                      className="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-100"
                      disabled={isSubmitting}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            💡 También podrás agregar expertos después de crear el proyecto
          </p>
        </div>

      </form>

      {/* Botones de acción */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end border-t border-gray-200 dark:border-gray-700 pt-6 mt-8">
        <Button
          type="button"
          ghost
          onClick={handleCancel}
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          Cancelar
        </Button>
        <Button
          type="button"
          onClick={() => console.log('Guardar borrador', formData)}
          disabled={isSubmitting}
          className="w-full sm:w-auto"
          ghost
        >
          💾 Guardar Borrador
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg"
        >
          {isSubmitting ? (
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              <span>{isEditMode ? 'Actualizando Proyecto...' : 'Creando Proyecto...'}</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isEditMode ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" : "M12 4v16m8-8H4"} />
              </svg>
              <span>{isEditMode ? 'Actualizar Proyecto' : 'Crear Proyecto'}</span>
            </div>
          )}
        </Button>
      </div>
      </div>

      {/* Modal de edición de variables */}
      <VariableEditModal
        isOpen={isVariableModalOpen}
        onClose={() => {
          setIsVariableModalOpen(false)
          setEditingVariable(null)
          setIsNewVariable(false)
        }}
        variable={editingVariable}
        onSave={handleSaveVariable}
        isNew={isNewVariable}
      />
    </AppLayout>
  )
}
