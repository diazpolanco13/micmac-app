'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface Variable {
  id: string
  name: string
  description: string
  order: number
}

interface VariableManagerProps {
  projectId: string
  initialVariables?: Variable[]
  onVariablesChange: (variables: Variable[]) => void
  className?: string
}

export default function VariableManager({ 
  projectId, 
  initialVariables = [], 
  onVariablesChange,
  className = ''
}: VariableManagerProps) {
  const [variables, setVariables] = useState<Variable[]>(initialVariables)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [newVariable, setNewVariable] = useState({ name: '', description: '' })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)

  // Validaciones metodológicas MIC MAC
  const canAddVariable = variables.length < 10
  const canRemoveVariable = true // Siempre permitir eliminar, pero validar en la función
  
  const addVariable = () => {
    if (!newVariable.name.trim() || !canAddVariable) return
    
    const variable: Variable = {
      id: `var-${Date.now()}`,
      name: newVariable.name.trim(),
      description: newVariable.description.trim(),
      order: variables.length
    }
    
    const updatedVariables = [...variables, variable]
    setVariables(updatedVariables)
    onVariablesChange(updatedVariables)
    setNewVariable({ name: '', description: '' })
    setIsAddingNew(false)
  }

  const removeVariable = (id: string) => {
    if (variables.length <= 3) {
      alert('⚠️ Metodología MIC MAC requiere mínimo 3 variables. No se puede eliminar.')
      return
    }
    
    const updatedVariables = variables
      .filter(v => v.id !== id)
      .map((v, index) => ({ ...v, order: index }))
    
    setVariables(updatedVariables)
    onVariablesChange(updatedVariables)
  }

  const updateVariable = (id: string, updates: Partial<Variable>) => {
    const updatedVariables = variables.map(v => 
      v.id === id ? { ...v, ...updates } : v
    )
    setVariables(updatedVariables)
    onVariablesChange(updatedVariables)
    // NO cerrar la edición automáticamente
  }

  const saveEdit = (id: string) => {
    setEditingId(null)
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  const moveVariable = (fromIndex: number, toIndex: number) => {
    const newVariables = [...variables]
    const [movedVariable] = newVariables.splice(fromIndex, 1)
    newVariables.splice(toIndex, 0, movedVariable)
    
    // Reordenar indices
    const reorderedVariables = newVariables.map((v, index) => ({
      ...v,
      order: index
    }))
    
    setVariables(reorderedVariables)
    onVariablesChange(reorderedVariables)
  }

  const handleDragStart = (e: React.DragEvent, variableId: string) => {
    setDraggedId(variableId)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', variableId)
  }

  const handleDragOver = (e: React.DragEvent, variableId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverId(variableId)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const x = e.clientX
    const y = e.clientY
    
    // Solo limpiar dragOverId si el mouse realmente salió del elemento
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragOverId(null)
    }
  }

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    
    if (!draggedId || draggedId === targetId) {
      setDraggedId(null)
      setDragOverId(null)
      return
    }

    const draggedIndex = variables.findIndex(v => v.id === draggedId)
    const targetIndex = variables.findIndex(v => v.id === targetId)

    if (draggedIndex !== -1 && targetIndex !== -1) {
      moveVariable(draggedIndex, targetIndex)
    }

    setDraggedId(null)
    setDragOverId(null)
  }

  const handleDragEnd = () => {
    setDraggedId(null)
    setDragOverId(null)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header con validación */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Variables del Sistema
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {variables.length}/10 variables • Mínimo 3 requeridas
          </p>
        </div>
        
        {/* Indicador metodológico */}
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          variables.length >= 3 
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
        }`}>
          {variables.length >= 3 ? 'Válido' : `Faltan ${3 - variables.length}`}
        </div>
      </div>

      {/* Lista de variables existentes */}
      <div className="space-y-2">
        {variables.map((variable, index) => (
          <div 
            key={variable.id}
            draggable
            onDragStart={(e) => handleDragStart(e, variable.id)}
            onDragOver={(e) => handleDragOver(e, variable.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, variable.id)}
            onDragEnd={handleDragEnd}
            className={`group flex items-center space-x-3 p-4 rounded-lg border transition-colors ${
              draggedId === variable.id
                ? 'opacity-50 bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600'
                : dragOverId === variable.id
                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600 border-2'
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-micmac-primary-300'
            }`}
          >
            {/* Drag handle */}
            <div className="cursor-move text-gray-400 hover:text-gray-600 select-none">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
              </svg>
            </div>

            {/* Número de orden */}
            <div className="flex-shrink-0 w-8 h-8 bg-micmac-primary-100 dark:bg-micmac-primary-900/30 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-micmac-primary-600 dark:text-micmac-primary-400">
                {index + 1}
              </span>
            </div>

            {/* Contenido de la variable */}
            <div className="flex-1 min-w-0">
              {editingId === variable.id ? (
                <div className="space-y-2">
                  <Input
                    value={variable.name}
                    onChange={(e) => updateVariable(variable.id, { name: e.target.value })}
                    placeholder="Nombre de la variable"
                    className="font-medium"
                  />
                  <textarea
                    value={variable.description}
                    onChange={(e) => updateVariable(variable.id, { description: e.target.value })}
                    placeholder="Descripción detallada de la variable (opcional)"
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm transition-colors focus:border-micmac-primary-500 focus:ring-micmac-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    rows={3}
                  />
                  <div className="flex space-x-2">
                    <Button size="sm" onClick={() => saveEdit(variable.id)}>
                      Guardar
                    </Button>
                    <Button size="sm" ghost onClick={() => cancelEdit()}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="font-medium text-gray-900 dark:text-white truncate">
                    {variable.name}
                  </p>
                  {variable.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {variable.description}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Acciones */}
            <div className="flex items-center space-x-2 opacity-60 group-hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                ghost
                onClick={() => setEditingId(variable.id)}
                className="h-10 w-10 p-0 text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                title="Editar variable"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
              </Button>

              {variables.length > 3 && (
                <Button
                  size="sm"
                  ghost
                  onClick={() => removeVariable(variable.id)}
                  className="h-10 w-10 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                  title="Eliminar variable"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Formulario para agregar nueva variable */}
      {isAddingNew ? (
        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
          <div className="space-y-3">
            <Input
              value={newVariable.name}
              onChange={(e) => setNewVariable(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Nombre de la variable (ej. Políticas educativas)"
              className="font-medium"
            />
            <textarea
              value={newVariable.description}
              onChange={(e) => setNewVariable(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descripción detallada de la variable (ej. Impacto de las políticas educativas en la calidad del sistema formativo nacional)"
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm transition-colors focus:border-micmac-primary-500 focus:ring-micmac-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              rows={3}
            />
            <div className="flex items-center space-x-2">
              <Button
                onClick={addVariable}
                disabled={!newVariable.name.trim()}
                className="bg-micmac-primary-500 hover:bg-micmac-primary-600 text-white"
              >
                Agregar Variable
              </Button>
              <Button
                ghost
                onClick={() => {
                  setIsAddingNew(false)
                  setNewVariable({ name: '', description: '' })
                }}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* Botón para agregar nueva variable */
        <Button
          onClick={() => setIsAddingNew(true)}
          disabled={!canAddVariable}
          ghost
          className="w-full h-16 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-micmac-primary-300 hover:bg-micmac-primary-50 dark:hover:bg-micmac-primary-900/20 transition-colors"
        >
          <div className="flex items-center space-x-3 text-gray-500 dark:text-gray-400">
            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            <div className="text-left">
              <p className="font-medium">Agregar Variable</p>
              <p className="text-sm">
                {canAddVariable 
                  ? `${10 - variables.length} espacios disponibles`
                  : 'Máximo 10 variables alcanzado'
                }
              </p>
            </div>
          </div>
        </Button>
      )}

      {/* Info metodológica */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex space-x-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Metodología MIC MAC
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              Las variables representan los factores clave del sistema que los expertos evaluarán. 
              Se recomienda entre 3-10 variables para mantener la complejidad manejable en la matriz de votación.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
