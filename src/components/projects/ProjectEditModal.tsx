'use client'

import { useState, useEffect } from 'react'
import { Dialog } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Project, ProjectType, Expert } from '@/types/project'
import { useMockData } from '@/contexts/MockDataContext'
import { useToast } from '@/contexts/ToastContext'
import VariableManager from './VariableManager'
import ExpertSelector from './ExpertSelector'

interface VariableLocal {
  id: string
  name: string
  description: string
  order: number
}

interface ProjectEditModalProps {
  project: Project | null
  isOpen: boolean
  onClose: () => void
  onProjectUpdated: (project: Project) => void
  onProjectDeleted?: (projectId: string) => void
}

interface FormData {
  name: string
  description: string
  type: ProjectType
  expectedExperts: number
}

interface FormErrors {
  name?: string
  description?: string
  expectedExperts?: string
}

export default function ProjectEditModal({ 
  project,
  isOpen, 
  onClose, 
  onProjectUpdated,
  onProjectDeleted
}: ProjectEditModalProps) {
  const toast = useToast()
  const { updateProject } = useMockData()
  const [activeTab, setActiveTab] = useState<'general' | 'variables' | 'experts'>('general')
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    type: 'STRATEGIC',
    expectedExperts: 5
  })
  const [variables, setVariables] = useState<VariableLocal[]>([])
  const [experts, setExperts] = useState<Expert[]>([])
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Initialize form data when project changes
  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        description: project.description || '',
        type: project.type,
        expectedExperts: project.expectedExperts
      })
      
      // Convert project variables to VariableManager format
      const projectVariables = project.variables.map((variable, index) => ({
        id: variable.id,
        name: variable.name,
        description: variable.description || '',
        order: index
      }))
      setVariables(projectVariables)
      setExperts(project.projectExperts.map(pe => pe.expert))
    }
  }, [project])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del proyecto es obligatorio'
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres'
    } else if (formData.name.trim().length > 250) {
      newErrors.name = 'El nombre no puede exceder 250 caracteres'
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es obligatoria'
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'La descripción debe tener al menos 10 caracteres'
    }
    
    if (formData.expectedExperts < 3) {
      newErrors.expectedExperts = 'Mínimo 3 expertos requeridos'
    } else if (formData.expectedExperts > 50) {
      newErrors.expectedExperts = 'Máximo 50 expertos permitidos'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!project || !validateForm()) return
    
    if (variables.length < 3) {
      alert('Se requieren mínimo 3 variables para el proyecto')
      setActiveTab('variables')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const updatedProject: Project = {
        ...project,
        name: formData.name.trim(),
        description: formData.description.trim(),
        type: formData.type,
        expectedExperts: formData.expectedExperts,
        // Note: These fields should be updated through proper API calls
        // For now we'll just update the basic fields
        updatedAt: new Date().toISOString()
      }
      
      onProjectUpdated(updatedProject)
      handleClose()
      
    } catch (error) {
      console.error('Error updating project:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!project || !onProjectDeleted) return
    
    setIsSubmitting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      onProjectDeleted(project.id)
      handleClose()
    } catch (error) {
      console.error('Error deleting project:', error)
    } finally {
      setIsSubmitting(false)
      setShowDeleteConfirm(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setActiveTab('general')
      setShowDeleteConfirm(false)
      setErrors({})
      onClose()
    }
  }

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleStatusChange = async (newStatus: Project['status']) => {
    if (!project) return

    // Validaciones antes de cambiar estado
    if (newStatus === 'ACTIVE' && variables.length < 3) {
      alert('⚠️ Se requieren mínimo 3 variables para activar el proyecto')
      setActiveTab('variables')
      return
    }
    
    if (newStatus === 'ACTIVE' && experts.length < 3) {
      alert('⚠️ Se requieren mínimo 3 expertos para activar el proyecto')
      setActiveTab('experts')
      return
    }

    // Mostrar confirmación para cambios importantes
    const statusMessages = {
      SETUP: '¿Mover a configuración? El proyecto estará listo para activarse.',
      ACTIVE: '¿Activar el proyecto? Los expertos podrán comenzar a votar.',
      IN_REVIEW: '¿Enviar a revisión? Se pausará la votación para analizar resultados.',
      COMPLETED: '¿Marcar como completado? Se finalizará la votación definitivamente.',
      ARCHIVED: '¿Archivar el proyecto? Se moverá al archivo histórico.'
    }

    if (newStatus !== 'DRAFT' && statusMessages[newStatus] && !confirm(statusMessages[newStatus])) {
      return
    }

    setIsSubmitting(true)
    try {
      const result = await updateProject(project.id, { status: newStatus })
      if (result.success && result.data) {
        onProjectUpdated(result.data)
        
        // Notificación de éxito
        const successMessages = {
          DRAFT: 'Proyecto marcado como borrador',
          SETUP: 'Proyecto listo para configuración final',
          ACTIVE: '¡Proyecto activado! Los expertos pueden comenzar a votar.',
          IN_REVIEW: 'Proyecto enviado a revisión. Analizando resultados.',
          COMPLETED: 'Proyecto completado. Revisa los resultados del análisis.',
          ARCHIVED: 'Proyecto archivado correctamente'
        }
        
        // Mostrar toast de éxito
        if (successMessages[newStatus]) {
          toast.success('Estado actualizado', successMessages[newStatus])
        }
      }
    } catch (error) {
      console.error('Error updating project status:', error)
      alert('Error al cambiar el estado del proyecto')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusDescription = (status: Project['status']): string => {
    const descriptions = {
      DRAFT: 'El proyecto está en configuración. Puedes editar variables y expertos.',
      SETUP: 'Configuración completa. El proyecto puede activarse para iniciar votación.',
      ACTIVE: 'El proyecto está listo para que los expertos voten. No se pueden hacer cambios mayores.',
      IN_REVIEW: 'La votación ha terminado. Los resultados están siendo revisados.',
      COMPLETED: 'La votación ha terminado y los resultados están disponibles.',
      ARCHIVED: 'El proyecto está archivado para referencia futura.'
    }
    return descriptions[status] || 'Estado desconocido'
  }

  if (!project) return null

  const statusColors = {
    DRAFT: 'bg-gray-500/20 text-gray-300',
    SETUP: 'bg-yellow-500/20 text-yellow-300',
    ACTIVE: 'bg-micmac-primary-500/20 text-micmac-primary-300',
    IN_REVIEW: 'bg-purple-500/20 text-purple-300',
    COMPLETED: 'bg-micmac-secondary-500/20 text-micmac-secondary-300',
    ARCHIVED: 'bg-gray-600/20 text-gray-500'
  }

  const statusLabels = {
    DRAFT: 'Borrador',
    SETUP: 'Configuración',
    ACTIVE: 'Activo',
    IN_REVIEW: 'En Revisión',
    COMPLETED: 'Completado',
    ARCHIVED: 'Archivado'
  }

  return (
    <Dialog open={isOpen} onClose={handleClose} size="4xl">
      <div className="w-full max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-micmac-primary-500/10">
                    <svg className="h-6 w-6 text-micmac-primary-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Editar Proyecto
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {project.name}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[project.status]}`}>
                    {statusLabels[project.status]}
                  </span>
                </div>
                
                <Button 
                  ghost
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>

              {/* Tabs */}
              <div className="flex space-x-8 mt-4">
                {[
                  { key: 'general', label: 'General', icon: '📝' },
                  { key: 'variables', label: `Variables (${variables.length})`, icon: '🔧' },
                  { key: 'experts', label: `Expertos (${experts.length})`, icon: '👥' }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.key
                        ? 'border-micmac-primary-500 text-micmac-primary-600 dark:text-micmac-primary-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-6">
              {activeTab === 'general' && (
                <div className="space-y-6">
                  {/* Nombre del Proyecto */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nombre del Proyecto *
                    </label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="ej. Futuro del Sector Energético 2030"
                      className={errors.name ? 'border-red-500' : ''}
                      disabled={isSubmitting}
                      maxLength={250}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  {/* Descripción */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Descripción *
                    </label>
                    <textarea
                      rows={4}
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className={`block w-full rounded-lg border px-3 py-2 text-sm shadow-sm transition-colors
                        ${errors.description 
                          ? 'border-red-500' 
                          : 'border-gray-300 focus:border-micmac-primary-500 focus:ring-micmac-primary-500'
                        }
                        dark:border-gray-600 dark:bg-gray-800 dark:text-white`}
                      disabled={isSubmitting}
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                    )}
                  </div>

                  {/* Estado del Proyecto */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Estado del Proyecto
                    </label>
                    <select
                      value={project.status}
                      onChange={(e) => handleStatusChange(e.target.value as Project['status'])}
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm
                        focus:border-micmac-primary-500 focus:ring-micmac-primary-500
                        dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                      disabled={isSubmitting}
                    >
                      <option value="DRAFT">📝 Borrador - En configuración inicial</option>
                      <option value="SETUP">🛠️ Configuración - Listo para activar</option>
                      <option value="ACTIVE">🚀 Activo - Votación en proceso</option>
                      <option value="IN_REVIEW">🔍 En Revisión - Analizando resultados</option>
                      <option value="COMPLETED">✅ Completado - Análisis finalizado</option>
                      <option value="ARCHIVED">📦 Archivado - Guardado para referencia</option>
                    </select>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {getStatusDescription(project.status)}
                    </p>
                  </div>

                  {/* Tipo y Expertos */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tipo de Análisis
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => handleInputChange('type', e.target.value as ProjectType)}
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm
                          focus:border-micmac-primary-500 focus:ring-micmac-primary-500
                          dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                        disabled={isSubmitting}
                      >
                        <option value="STRATEGIC">Estratégico</option>
                        <option value="TECHNOLOGICAL">Tecnológico</option>
                        <option value="ENVIRONMENTAL">Ambiental</option>
                        <option value="SOCIAL">Social</option>
                        <option value="ECONOMIC">Económico</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Expertos Esperados
                      </label>
                      <Input
                        type="number"
                        min="3"
                        max="50"
                        value={formData.expectedExperts}
                        onChange={(e) => handleInputChange('expectedExperts', parseInt(e.target.value) || 0)}
                        className={errors.expectedExperts ? 'border-red-500' : ''}
                        disabled={isSubmitting}
                      />
                      {errors.expectedExperts && (
                        <p className="mt-1 text-sm text-red-600">{errors.expectedExperts}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'variables' && (
                <VariableManager
                  projectId={project.id}
                  initialVariables={variables}
                  onVariablesChange={setVariables}
                />
              )}

              {activeTab === 'experts' && (
                <ExpertSelector
                  selectedExperts={experts}
                  onExpertsChange={setExperts}
                  expectedExperts={formData.expectedExperts}
                />
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-800 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                {/* Botón de eliminar */}
                <div>
                  {onProjectDeleted && (
                    <Button
                      ghost
                      onClick={() => setShowDeleteConfirm(true)}
                      disabled={isSubmitting}
                      className="text-red-500 hover:text-red-700"
                    >
                      🗑️ Eliminar Proyecto
                    </Button>
                  )}
                </div>

                {/* Botones de acción */}
                <div className="flex space-x-3">
                  <Button
                    ghost
                    onClick={handleClose}
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                  <Button
                    color="primary"
                    onClick={handleSubmit}
                    disabled={isSubmitting || variables.length < 3}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        <span>Guardando...</span>
                      </div>
                    ) : (
                      'Guardar Cambios'
                    )}
                  </Button>
                </div>
              </div>
              
              {variables.length < 3 && (
                <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2">
                  ⚠️ Se requieren mínimo 3 variables para guardar el proyecto
                </p>
              )}
            </div>

            {/* Modal de confirmación de eliminación */}
            {showDeleteConfirm && (
              <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-md w-full">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    ¿Confirmar eliminación?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Esta acción no se puede deshacer. Se eliminará el proyecto "{project?.name}" y todos sus datos asociados.
                  </p>
                  <div className="flex space-x-3 justify-end">
                    <Button
                      ghost
                      onClick={() => setShowDeleteConfirm(false)}
                      disabled={isSubmitting}
                    >
                      Cancelar
                    </Button>
                    <Button
                      color="danger"
                      onClick={handleDelete}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Eliminando...' : 'Eliminar'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
      </div>
    </Dialog>
  )
}
