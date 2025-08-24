'use client'

import { useState } from 'react'
import { Button, Input } from '@/components/ui'
import { Expert, ExpertFormData } from '@/types/project'
import { useMockData } from '@/contexts/MockDataContext'

interface ExpertFormModalProps {
  mode: 'create' | 'edit'
  expert?: Expert
  onSave: (data: ExpertFormData) => void
  onClose: () => void
}

export default function ExpertFormModal({ 
  mode,
  expert,
  onSave,
  onClose 
}: ExpertFormModalProps) {
  const { getAllExpertiseTags } = useMockData()
  const availableTags = getAllExpertiseTags()
  
  const [formData, setFormData] = useState<ExpertFormData>({
    name: expert?.name || '',
    email: expert?.email || '',
    organization: expert?.organization || '',
    expertiseAreas: expert?.expertiseAreas || [],
    avatar: expert?.avatar || '',
    yearsExperience: expert?.yearsExperience || undefined,
    notes: expert?.notes || '',
    role: expert?.role || 'EXPERT',
    biography: expert?.biography || '',
    linkedinUrl: expert?.linkedinUrl || '',
    phone: expert?.phone || ''
  })

  const [expertiseInput, setExpertiseInput] = useState('')
  const [showExpertiseSuggestions, setShowExpertiseSuggestions] = useState(false)
  
  const filteredTags = availableTags.filter(tag =>
    tag.toLowerCase().includes(expertiseInput.toLowerCase()) &&
    !formData.expertiseAreas.includes(tag)
  )

  const addExpertise = (expertise: string) => {
    if (!formData.expertiseAreas.includes(expertise)) {
      setFormData(prev => ({
        ...prev,
        expertiseAreas: [...prev.expertiseAreas, expertise]
      }))
    }
    setExpertiseInput('')
    setShowExpertiseSuggestions(false)
  }

  const removeExpertise = (expertise: string) => {
    setFormData(prev => ({
      ...prev,
      expertiseAreas: prev.expertiseAreas.filter(exp => exp !== expertise)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      alert('El nombre es requerido')
      return
    }
    
    if (!formData.email.trim()) {
      alert('El email es requerido')
      return
    }
    
    if (formData.expertiseAreas.length === 0) {
      alert('Se requiere al menos un área de expertise')
      return
    }
    
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 z-[80] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-dark-bg-secondary rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="p-6 border-b border-dark-bg-tertiary">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-dark-text-primary">
                {mode === 'create' ? 'Crear Nuevo Experto' : 'Editar Experto'}
              </h3>
              <Button ghost onClick={onClose} className="h-8 w-8 p-0">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </div>
          </div>

          {/* Contenido del formulario */}
          <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
            {/* Información Personal */}
            <div className="space-y-4">
              <h4 className="font-medium text-dark-text-primary">Información Personal</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-text-primary mb-1">
                    Nombre completo *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-dark-text-primary mb-1">
                    Email *
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-text-primary mb-1">
                    Organización
                  </label>
                  <Input
                    value={formData.organization || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-dark-text-primary mb-1">
                    Años de experiencia
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="50"
                    value={formData.yearsExperience || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      yearsExperience: e.target.value ? parseInt(e.target.value) : undefined 
                    }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-text-primary mb-1">
                    Teléfono
                  </label>
                  <Input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-dark-text-primary mb-1">
                    LinkedIn URL
                  </label>
                  <Input
                    type="url"
                    value={formData.linkedinUrl || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, linkedinUrl: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-text-primary mb-1">
                  Avatar/Foto
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-micmac-primary-500/10 rounded-full flex items-center justify-center overflow-hidden">
                    {formData.avatar ? (
                      <img 
                        src={formData.avatar} 
                        alt="Avatar preview"
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-medium text-micmac-primary-600 dark:text-micmac-primary-400">
                        {formData.name ? formData.name.split(' ').map(n => n[0]).join('') : '👤'}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <Input
                      type="url"
                      value={formData.avatar || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, avatar: e.target.value }))}
                      placeholder="https://ejemplo.com/foto.jpg"
                    />
                    <p className="text-xs text-dark-text-muted">
                      Introduce la URL de una imagen o sube una foto (funcionalidad de subida pendiente)
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-text-primary mb-1">
                  Biografía
                </label>
                <textarea
                  value={formData.biography || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, biography: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 bg-dark-bg-tertiary border border-dark-bg-tertiary rounded-md text-dark-text-primary placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-micmac-primary-500 resize-none"
                  placeholder="Descripción profesional del experto..."
                />
              </div>
            </div>

            {/* Rol */}
            <div className="space-y-4">
              <h4 className="font-medium text-dark-text-primary">Configuración de Rol</h4>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="EXPERT"
                    checked={formData.role === 'EXPERT'}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'EXPERT' | 'MODERATOR' }))}
                    className="text-micmac-primary-500 focus:ring-micmac-primary-500"
                  />
                  <span className="text-dark-text-primary">Experto</span>
                  <span className="text-xs text-dark-text-secondary">(Participa en votaciones)</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="MODERATOR"
                    checked={formData.role === 'MODERATOR'}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'EXPERT' | 'MODERATOR' }))}
                    className="text-micmac-primary-500 focus:ring-micmac-primary-500"
                  />
                  <span className="text-dark-text-primary">Moderador</span>
                  <span className="text-xs text-dark-text-secondary">(Gestiona proyectos)</span>
                </label>
              </div>
            </div>

            {/* Áreas de Expertise */}
            <div className="space-y-4">
              <h4 className="font-medium text-dark-text-primary">Áreas de Expertise *</h4>
              
              {/* Input con autocompletado */}
              <div className="relative">
                <label className="block text-sm font-medium text-dark-text-primary mb-1">
                  Agregar área de expertise
                </label>
                <Input
                  value={expertiseInput}
                  onChange={(e) => {
                    setExpertiseInput(e.target.value)
                    setShowExpertiseSuggestions(e.target.value.length > 0)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && expertiseInput.trim()) {
                      e.preventDefault()
                      addExpertise(expertiseInput.trim())
                    }
                  }}
                  placeholder="Ej: Tecnológico, Militar, Económico..."
                />
                
                {/* Sugerencias */}
                {showExpertiseSuggestions && filteredTags.length > 0 && (
                  <div className="absolute top-full left-0 right-0 z-10 bg-dark-bg-secondary border border-dark-bg-tertiary rounded-md shadow-lg max-h-40 overflow-y-auto">
                    {filteredTags.slice(0, 8).map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => addExpertise(tag)}
                        className="w-full text-left px-3 py-2 text-dark-text-primary hover:bg-dark-bg-tertiary transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Etiquetas seleccionadas */}
              <div className="flex flex-wrap gap-2">
                {formData.expertiseAreas.map((exp) => (
                  <span
                    key={exp}
                    className="px-3 py-1 bg-micmac-primary-500/20 text-micmac-primary-300 rounded-full text-sm flex items-center gap-2"
                  >
                    {exp}
                    <button
                      type="button"
                      onClick={() => removeExpertise(exp)}
                      className="w-4 h-4 flex items-center justify-center text-micmac-primary-400 hover:text-red-400 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              
              {formData.expertiseAreas.length === 0 && (
                <p className="text-sm text-yellow-500">⚠️ Se requiere al menos un área de expertise</p>
              )}
            </div>

            {/* Notas */}
            <div>
              <label className="block text-sm font-medium text-dark-text-primary mb-1">
                Notas internas
              </label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 bg-dark-bg-tertiary border border-dark-bg-tertiary rounded-md text-dark-text-primary placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-micmac-primary-500 resize-none"
                placeholder="Notas privadas sobre el experto..."
              />
            </div>
          </div>

          {/* Nota informativa */}
          {mode === 'create' && (
            <div className="px-6 py-4 bg-green-50 dark:bg-green-900/20 border-t border-green-200 dark:border-green-800">
              <div className="flex space-x-2">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                  </svg>
                </div>
                <div className="text-sm text-green-700 dark:text-green-300">
                  <strong>ℹ️ NOTA:</strong> Este experto quedará disponible en el pool del sistema para ser 
                  invitado a proyectos MIC MAC relevantes a sus áreas de expertise. Los moderadores 
                  podrán seleccionarlo al crear o gestionar proyectos.
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="p-6 border-t border-dark-bg-tertiary bg-dark-bg-primary flex items-center justify-between">
            <div className="text-sm text-dark-text-secondary">
              * Campos requeridos
            </div>
            <div className="flex items-center gap-3">
              <Button ghost onClick={onClose}>
                Cancelar
              </Button>
              <Button color="primary" type="submit">
                {mode === 'create' ? 'Crear Experto' : 'Guardar Cambios'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
