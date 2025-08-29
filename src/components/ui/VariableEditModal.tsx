'use client'

import { useState, useEffect } from 'react'
import { Dialog } from './Dialog'
import { Button } from './Button'
import { Input } from './Input'

interface Variable {
  id: string
  name: string
  description: string
  order: number
}

interface VariableEditModalProps {
  isOpen: boolean
  onClose: () => void
  variable: Variable | null
  onSave: (variable: Variable) => void
  isNew?: boolean
}

export default function VariableEditModal({
  isOpen,
  onClose,
  variable,
  onSave,
  isNew = false
}: VariableEditModalProps) {
  const [formData, setFormData] = useState<Variable>({
    id: '',
    name: '',
    description: '',
    order: 0
  })
  const [errors, setErrors] = useState<{name?: string, description?: string}>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Inicializar formulario cuando cambie la variable
  useEffect(() => {
    if (variable) {
      setFormData(variable)
    } else if (isNew) {
      setFormData({
        id: `var-${Date.now()}`,
        name: '',
        description: '',
        order: 0
      })
    }
    setErrors({})
  }, [variable, isNew, isOpen])

  const validateForm = (): boolean => {
    const newErrors: {name?: string, description?: string} = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio'
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres'
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'El nombre no puede exceder 100 caracteres'
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es obligatoria'
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'La descripción debe tener al menos 10 caracteres'
    } else if (formData.description.trim().length > 500) {
      newErrors.description = 'La descripción no puede exceder 500 caracteres'
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
      onSave({
        ...formData,
        name: formData.name.trim(),
        description: formData.description.trim()
      })
      onClose()
    } catch (error) {
      console.error('Error saving variable:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
    }
  }

  const handleInputChange = (field: keyof Variable, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <Dialog open={isOpen} onClose={handleClose} size="2xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {isNew ? 'Agregar Nueva Variable' : 'Editar Variable'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isNew ? 'Crea un nuevo escenario para el análisis MIC MAC' : 'Modifica los detalles de la variable'}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre de la Variable */}
          <div>
            <label htmlFor="variable-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nombre de la Variable *
            </label>
            <Input
              id="variable-name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="ej. ESC1 - INVASIÓN MILITAR"
              className={errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.name}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {formData.name.length}/100 caracteres
            </p>
          </div>

          {/* Descripción */}
          <div>
            <label htmlFor="variable-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descripción *
            </label>
            <textarea
              id="variable-description"
              rows={4}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe detalladamente el escenario o factor que los expertos evaluarán en el análisis MIC MAC..."
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
              {formData.description.length}/500 caracteres
            </p>
          </div>

          {/* Información metodológica */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white text-xs">
                ℹ️
              </div>
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100">
                  Consejos para Variables MIC MAC
                </h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 mt-1 space-y-1">
                  <li>• <strong>Específica:</strong> Define claramente el factor o escenario</li>
                  <li>• <strong>Medible:</strong> Debe poder ser evaluada por los expertos</li>
                  <li>• <strong>Relevante:</strong> Importante para el análisis prospectivo</li>
                  <li>• <strong>Clara:</strong> Fácil de entender para todos los expertos</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end border-t border-gray-200 dark:border-gray-700 pt-6">
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
              className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>{isNew ? 'Creando...' : 'Guardando...'}</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{isNew ? 'Crear Variable' : 'Guardar Cambios'}</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Dialog>
  )
}

