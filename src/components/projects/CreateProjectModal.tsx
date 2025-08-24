'use client'

import { useState } from 'react'
import { Dialog } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Project, ProjectType } from '@/types/project'
import { createProject } from '@/lib/mockData'

interface CreateProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onProjectCreated: (project: Project) => void
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
  type?: string
  expectedExperts?: string
}

export default function CreateProjectModal({ 
  isOpen, 
  onClose, 
  onProjectCreated 
}: CreateProjectModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    type: 'strategic',
    expectedExperts: 5
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

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
    } else if (formData.description.trim().length > 500) {
      newErrors.description = 'La descripción no puede exceder 500 caracteres'
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
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const newProject = createProject({
        name: formData.name.trim(),
        description: formData.description.trim(),
        type: formData.type,
        expectedExperts: formData.expectedExperts
      })
      
      onProjectCreated(newProject)
      handleClose()
      
    } catch (error) {
      console.error('Error creating project:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        name: '',
        description: '',
        type: 'strategic',
        expectedExperts: 5
      })
      setErrors({})
      onClose()
    }
  }

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <Dialog open={isOpen} onClose={handleClose} size="2xl">
      <div className="space-y-6">
            
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-micmac-primary-500/10">
                    <svg className="h-6 w-6 text-micmac-primary-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Nuevo Proyecto MIC MAC
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Crea un análisis prospectivo estructural
                    </p>
                  </div>
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
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Nombre del Proyecto */}
              <div>
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

              {/* Descripción */}
              <div>
                <label htmlFor="project-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Descripción *
                </label>
                <textarea
                  id="project-description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe el contexto, objetivos y alcance del análisis prospectivo..."
                  className={`block w-full rounded-lg border px-3 py-2 text-sm shadow-sm transition-colors
                    ${errors.description 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:border-micmac-primary-500 focus:ring-micmac-primary-500'
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
                  {formData.description.length}/500 caracteres
                </p>
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
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm transition-colors
                    focus:border-micmac-primary-500 focus:ring-micmac-primary-500
                    dark:border-gray-600 dark:bg-gray-800 dark:text-white
                    disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  <option value="strategic">Estratégico</option>
                  <option value="technological">Tecnológico</option>
                  <option value="environmental">Ambiental</option>
                  <option value="social">Social</option>
                  <option value="economic">Económico</option>
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

              {/* Botones */}
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  ghost
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-micmac-primary-500 hover:bg-micmac-primary-600 text-white"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>Creando...</span>
                    </div>
                  ) : (
                    'Crear Proyecto'
                  )}
                </Button>
              </div>
            </form>
      </div>
    </Dialog>
  )
}
