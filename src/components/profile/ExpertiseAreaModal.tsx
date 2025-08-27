'use client'

import React, { useState, useEffect } from 'react'
import { Dialog, DialogTitle, DialogBody, DialogActions } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ExpertiseCalculator } from '@/utils/expertiseCalculator'
import type { 
  ExpertiseArea, 
  ExperienceType, 
  EducationLevel 
} from '@/types/project'

interface ExpertiseAreaModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (area: ExpertiseArea) => void
  editingArea?: ExpertiseArea | null
  existingAreas: ExpertiseArea[]
}

export default function ExpertiseAreaModal({
  isOpen,
  onClose,
  onSave,
  editingArea,
  existingAreas
}: ExpertiseAreaModalProps) {
  
  const [formData, setFormData] = useState({
    name: '',
    yearsExperience: 1,
    proficiencyLevel: 3 as 1 | 2 | 3 | 4 | 5,
    experienceType: 'PROFESSIONAL' as ExperienceType,
    educationLevel: undefined as EducationLevel | undefined
  })
  
  const [errors, setErrors] = useState<string[]>([])
  
  // Cargar datos si estamos editando
  useEffect(() => {
    if (editingArea) {
      setFormData({
        name: editingArea.name,
        yearsExperience: editingArea.yearsExperience,
        proficiencyLevel: editingArea.proficiencyLevel,
        experienceType: editingArea.experienceType,
        educationLevel: editingArea.educationLevel
      })
    } else {
      // Reset para nueva área
      setFormData({
        name: '',
        yearsExperience: 1,
        proficiencyLevel: 3,
        experienceType: 'PROFESSIONAL',
        educationLevel: undefined
      })
    }
    setErrors([])
  }, [editingArea, isOpen])
  
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Limpiar errores cuando el usuario modifica
    if (errors.length > 0) {
      setErrors([])
    }
  }
  
  const validateForm = (): boolean => {
    const newErrors: string[] = []
    
    if (!formData.name.trim()) {
      newErrors.push('El nombre del área es requerido')
    }
    
    if (formData.name.length > 50) {
      newErrors.push('El nombre debe tener menos de 50 caracteres')
    }
    
    if (formData.yearsExperience < 1 || formData.yearsExperience > 50) {
      newErrors.push('Los años de experiencia deben estar entre 1 y 50')
    }
    
    // Verificar duplicados (solo si no estamos editando o si cambió el nombre)
    const isDuplicate = existingAreas.some(area => 
      area.name.toLowerCase() === formData.name.toLowerCase() &&
      (!editingArea || area.name !== editingArea.name)
    )
    
    if (isDuplicate) {
      newErrors.push('Ya tienes esta área de expertise registrada')
    }
    
    setErrors(newErrors)
    return newErrors.length === 0
  }
  
  const handleSave = () => {
    if (!validateForm()) return
    
    const expertiseArea = ExpertiseCalculator.createExpertiseArea(
      formData.name.trim(),
      {
        yearsExperience: formData.yearsExperience,
        proficiencyLevel: formData.proficiencyLevel,
        experienceType: formData.experienceType,
        educationLevel: formData.educationLevel
      }
    )
    
    onSave(expertiseArea)
    onClose()
  }
  
  const calculation = ExpertiseCalculator.calculateScore({
    yearsExperience: formData.yearsExperience,
    proficiencyLevel: formData.proficiencyLevel,
    experienceType: formData.experienceType,
    educationLevel: formData.educationLevel
  })
  
  return (
    <Dialog open={isOpen} onClose={onClose} size="4xl">
      <div className="p-6">
        <DialogTitle className="flex items-center gap-3">
          <span className="text-2xl">🎯</span>
          <div>
            <h2 className="text-xl font-semibold text-dark-text-primary">
              {editingArea ? 'Editar Área de Expertise' : 'Nueva Área de Expertise'}
            </h2>
            <p className="text-sm text-dark-text-secondary mt-1">
              Define tu experiencia y obtén una puntuación automática
            </p>
          </div>
        </DialogTitle>
      
      <DialogBody className="space-y-6">
        {/* Errores */}
        {errors.length > 0 && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-red-400 text-lg">⚠️</span>
              <div>
                <h4 className="text-red-400 font-medium mb-1">Hay algunos errores:</h4>
                <ul className="text-red-300 text-sm space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
        
        {/* Nombre del área */}
        <div>
          <label className="block text-sm font-medium text-dark-text-primary mb-2">
            Área de Expertise
          </label>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Ej: Petróleo, Construcción, Derecho Laboral..."
            className="w-full"
          />
          <p className="text-xs text-dark-text-muted mt-1">
            Sé específico: "Derecho Laboral" es mejor que "Derecho"
          </p>
        </div>
        
        {/* Años de experiencia */}
        <div>
          <label className="block text-sm font-medium text-dark-text-primary mb-2">
            Años de experiencia en esta área
          </label>
          <Input
            type="number"
            min={1}
            max={50}
            value={formData.yearsExperience}
            onChange={(e) => handleInputChange('yearsExperience', parseInt(e.target.value) || 1)}
            className="w-full"
          />
        </div>
        
        {/* Nivel de dominio */}
        <div>
          <label className="block text-sm font-medium text-dark-text-primary mb-2">
            ¿Cómo calificarías tu nivel de dominio?
          </label>
          <select
            value={formData.proficiencyLevel}
            onChange={(e) => handleInputChange('proficiencyLevel', parseInt(e.target.value) as 1 | 2 | 3 | 4 | 5)}
            className="w-full px-3 py-2 bg-dark-bg-tertiary border border-dark-bg-tertiary rounded-lg text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-micmac-primary-500"
          >
            <option value={1}>🌱 Principiante (1-2 años típicamente)</option>
            <option value={2}>📚 Competente (3-5 años típicamente)</option>
            <option value={3}>🔧 Experimentado (6-10 años típicamente)</option>
            <option value={4}>🎯 Experto (11-20 años típicamente)</option>
            <option value={5}>🏆 Maestro (20+ años típicamente)</option>
          </select>
        </div>
        
        {/* Tipo de experiencia */}
        <div>
          <label className="block text-sm font-medium text-dark-text-primary mb-2">
            ¿En qué contexto desarrollaste esta expertise?
          </label>
          <select
            value={formData.experienceType}
            onChange={(e) => handleInputChange('experienceType', e.target.value as ExperienceType)}
            className="w-full px-3 py-2 bg-dark-bg-tertiary border border-dark-bg-tertiary rounded-lg text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-micmac-primary-500"
          >
            <option value="PROFESSIONAL">💼 Profesional (Trabajo/Empresa)</option>
            <option value="ACADEMIC">🎓 Académico (Universidad/Docencia)</option>
            <option value="RESEARCH">🔬 Investigación</option>
            <option value="CONSULTING">💡 Consultoría</option>
            <option value="PERSONAL">🛠️ Experiencia Personal</option>
          </select>
        </div>
        
        {/* Nivel educativo (opcional) */}
        <div>
          <label className="block text-sm font-medium text-dark-text-primary mb-2">
            Formación en esta área (opcional)
          </label>
          <select
            value={formData.educationLevel || ''}
            onChange={(e) => handleInputChange('educationLevel', e.target.value || undefined)}
            className="w-full px-3 py-2 bg-dark-bg-tertiary border border-dark-bg-tertiary rounded-lg text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-micmac-primary-500"
          >
            <option value="">No especificar</option>
            <option value="AUTODIDACTA">🎯 Autodidacta</option>
            <option value="TECNICO">🔧 Técnico</option>
            <option value="UNIVERSITARIO">🎓 Universitario</option>
            <option value="POSTGRADO">📜 Postgrado</option>
            <option value="DOCTORADO">🎓 Doctorado</option>
          </select>
        </div>
        
        {/* Preview del score */}
        {formData.name && (
          <div className="bg-gradient-to-r from-micmac-primary-500/10 to-micmac-secondary-500/10 border border-micmac-primary-500/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-lg font-semibold text-dark-text-primary">
                Score Calculado
              </h4>
              <div className="text-right">
                <div className="text-2xl font-bold text-micmac-primary-400">
                  {calculation.score}/100
                </div>
                <div className={`text-sm font-medium ${ExpertiseCalculator.getLevelColor(calculation.level)}`}>
                  {calculation.level}
                </div>
              </div>
            </div>
            
            {/* Barra de progreso */}
            <div className="w-full bg-dark-bg-tertiary rounded-full h-2 mb-2">
              <div 
                className="bg-gradient-to-r from-micmac-primary-500 to-micmac-secondary-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${calculation.score}%` }}
              />
            </div>
            
            <div className="text-xs text-dark-text-secondary">
              Prioridad de invitación: <span className={`font-medium ${
                calculation.priority === 'HIGH' ? 'text-green-400' :
                calculation.priority === 'MEDIUM' ? 'text-yellow-400' : 'text-gray-400'
              }`}>
                {calculation.priority}
              </span>
            </div>
          </div>
        )}
      </DialogBody>
      
      <DialogActions>
        <Button ghost onClick={onClose}>
          Cancelar
        </Button>
        <Button 
          color="primary" 
          onClick={handleSave}
          disabled={!formData.name.trim() || errors.length > 0}
        >
          {editingArea ? 'Actualizar' : 'Agregar'} Área
        </Button>
      </DialogActions>
      </div>
    </Dialog>
  )
}
