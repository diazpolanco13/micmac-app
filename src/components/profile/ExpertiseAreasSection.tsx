'use client'

import React, { useState, useMemo } from 'react'
import { Button } from '@/components/ui/Button'
import ExpertiseAreaModal from './ExpertiseAreaModal'
import { ExpertiseCalculator } from '@/utils/expertiseCalculator'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import type { ExpertiseArea } from '@/lib/supabase'

interface ExpertiseAreasSectionProps {
  expertiseAreas: ExpertiseArea[]
  onAreasChange: (areas: ExpertiseArea[]) => void
  isEditing: boolean
}

export default function ExpertiseAreasSection({
  expertiseAreas,
  onAreasChange,
  isEditing
}: ExpertiseAreasSectionProps) {
  
  const [showModal, setShowModal] = useState(false)
  const [editingArea, setEditingArea] = useState<ExpertiseArea | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const toast = useToast()

  // 🆕 FUNCIÓN: Guardar nueva área en Supabase
  const handleAddArea = async (formData: any) => {
    if (!user) return
    
    setIsLoading(true)
    try {
      // 1. Buscar o crear área de expertise
      let { data: existingArea, error: searchError } = await supabase
        .from('expertise_areas')
        .select('id')
        .eq('name', formData.name)
        .single()

      let areaId = existingArea?.id

      // Si no existe, crear nueva área
      if (!existingArea) {
        const { data: newArea, error: createError } = await supabase
          .from('expertise_areas')
          .insert({
            name: formData.name,
            description: `Área de expertise: ${formData.name}`,
            category: 'custom'
          })
          .select('id')
          .single()

        if (createError) throw createError
        areaId = newArea.id
      }

      // 2. Crear relación user_expertise
      const { error: insertError } = await supabase
        .from('user_expertise')
        .insert({
          user_id: user.id,
          expertise_area_id: areaId,
          level: formData.proficiencyLevel === 1 ? 'novice' :
                 formData.proficiencyLevel === 2 ? 'intermediate' :
                 formData.proficiencyLevel === 3 ? 'advanced' :
                 formData.proficiencyLevel === 4 ? 'expert' : 'expert',
          years_experience: formData.yearsExperience,
          description: `Experiencia en ${formData.name}`,
          context: formData.experienceTypes || ['PROFESSIONAL'],
          education_level: formData.educationLevel?.toLowerCase() || null
        })

      if (insertError) throw insertError

      toast.success('Área agregada', 'Nueva área de expertise agregada exitosamente')
      
      // 🔄 CERRAR MODAL Y MOSTRAR MENSAJE
      setShowModal(false)
      
      // 🔄 ACTUALIZAR ESTADO LOCAL (Agregar nueva área)
      const newArea: ExpertiseArea = {
        id: areaId,
        name: formData.name,
        description: `Área de expertise: ${formData.name}`,
        category: 'custom',
        level: formData.proficiencyLevel === 1 ? 'novice' :
               formData.proficiencyLevel === 2 ? 'intermediate' :
               formData.proficiencyLevel === 3 ? 'advanced' :
               formData.proficiencyLevel === 4 ? 'expert' : 'expert',
        yearsExperience: formData.yearsExperience,
        userDescription: `Experiencia en ${formData.name}`
      }
      onAreasChange([...expertiseAreas, newArea])
      
    } catch (error) {
      console.error('Error agregando área:', error)
      toast.error('Error', 'No se pudo agregar el área de expertise')
    } finally {
      setIsLoading(false)
    }
  }

  // 🆕 FUNCIÓN: Editar área en Supabase  
  const handleEditArea = async (formData: any) => {
    if (!user || !editingArea) return
    
    setIsLoading(true)
    try {
      // 1. Actualizar nombre en expertise_areas si cambió
      if (formData.name !== editingArea.name) {
        console.log('📝 [EDIT] Actualizando nombre de área de expertise...')
        const { error: nameError } = await supabase
          .from('expertise_areas')
          .update({
            name: formData.name,
            description: `Área de expertise: ${formData.name}`,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingArea.id)

        if (nameError) {
          console.error('❌ [EDIT] Error actualizando nombre:', nameError)
          throw nameError
        }
      }

      // 2. Actualizar datos de usuario en user_expertise
      const { error } = await supabase
        .from('user_expertise')
        .update({
          level: formData.proficiencyLevel === 1 ? 'novice' :
                 formData.proficiencyLevel === 2 ? 'intermediate' :
                 formData.proficiencyLevel === 3 ? 'advanced' :
                 formData.proficiencyLevel === 4 ? 'expert' : 'expert',
          years_experience: formData.yearsExperience,
          description: formData.description || `Experiencia en ${formData.name}`,
          context: formData.experienceTypes || ['PROFESSIONAL'],
          education_level: formData.educationLevel?.toLowerCase() || null,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('expertise_area_id', editingArea.id)

      if (error) throw error

      toast.success('Área actualizada', 'Área de expertise actualizada exitosamente')
      setEditingArea(null)
      setShowModal(false)
      
      // 🔄 SOLUCIÓN DEFINITIVA: Recargar datos completos desde BD
      console.log('🔄 [EDIT] Recargando datos desde BD para reflejar todos los cambios...')
      
      // 🚀 RECARGA INMEDIATA (sin timeout para mejor UX)
      const reloadData = async () => {
        try {
          // Recargar áreas de expertise desde BD con datos completos
          const { data: updatedExpertiseData, error: reloadError } = await supabase
            .from('user_expertise')
            .select(`
              id,
              level,
              years_experience,
              description,
              context,
              education_level,
              expertise_areas (
                id,
                name,
                description,
                category
              )
            `)
            .eq('user_id', user.id)
          
          if (!reloadError && updatedExpertiseData) {
            const reloadedAreas = updatedExpertiseData
              .filter((item: any) => item.expertise_areas)
              .map((item: any) => ({
                id: item.expertise_areas.id,
                name: item.expertise_areas.name,
                description: item.expertise_areas.description,
                category: item.expertise_areas.category,
                level: item.level,
                yearsExperience: item.years_experience,
                userDescription: item.description,
                context: item.context || ['PROFESSIONAL'], // 🔄 INCLUIR CONTEXTOS
                educationLevel: item.education_level || undefined // 🔄 INCLUIR FORMACIÓN
              }))
            
            onAreasChange(reloadedAreas)
            console.log('✅ [EDIT] Datos recargados desde BD - UI actualizada')
          }
        } catch (reloadError) {
          console.error('❌ [EDIT] Error recargando datos:', reloadError)
        }
      }
      
      // Ejecutar recarga inmediata y también con delay como backup
      reloadData()
      setTimeout(reloadData, 200) // Backup con delay mínimo
      
    } catch (error) {
      console.error('Error actualizando área:', error)
      toast.error('Error', 'No se pudo actualizar el área de expertise')
    } finally {
      setIsLoading(false)
    }
  }

  // 🆕 FUNCIÓN: Eliminar área de Supabase
  const handleDeleteArea = async (areaToDelete: ExpertiseArea) => {
    if (!user) return
    
    if (!confirm(`¿Estás seguro de que quieres eliminar "${areaToDelete.name}"?`)) return
    
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('user_expertise')
        .delete()
        .eq('user_id', user.id)
        .eq('expertise_area_id', areaToDelete.id)

      if (error) throw error

      toast.success('Área eliminada', 'Área de expertise eliminada exitosamente')
      
      // 🔄 ACTUALIZAR ESTADO LOCAL (Eliminar área)
      const filteredAreas = expertiseAreas.filter(area => area.id !== areaToDelete.id)
      onAreasChange(filteredAreas)
      
    } catch (error) {
      console.error('Error eliminando área:', error)
      toast.error('Error', 'No se pudo eliminar el área de expertise')
    } finally {
      setIsLoading(false)
    }
  }
  
  const openEditModal = (area: ExpertiseArea) => {
    setEditingArea(area)
    setShowModal(true)
  }
  
  const openAddModal = () => {
    setEditingArea(null)
    setShowModal(true)
  }
  
  const closeModal = () => {
    setShowModal(false)
    setEditingArea(null)
  }
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-dark-text-primary">
          Áreas de Expertise
        </h3>
        {isEditing && (
          <Button
            ghost
            size="sm"
            onClick={openAddModal}
            className="flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Agregar Área
          </Button>
        )}
      </div>
      
      {expertiseAreas.length === 0 ? (
        <div className="text-center py-8 text-dark-text-secondary">
          <div className="text-4xl mb-3">🎯</div>
          <p className="text-lg mb-2">Sin áreas de expertise definidas</p>
          <p className="text-sm">
            {isEditing 
              ? 'Agrega tus áreas de expertise para que los moderadores puedan invitarte a proyectos relevantes'
              : 'Define tus áreas de expertise en el modo de edición'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {expertiseAreas.map((area, index) => (
            <ExpertiseAreaCard
              key={area.name}
              area={area}
              isEditing={isEditing}
              onEdit={() => openEditModal(area)}
              onDelete={() => handleDeleteArea(area)}
            />
          ))}
        </div>
      )}
      
              <ExpertiseAreaModal
          isOpen={showModal}
          onClose={closeModal}
          onSave={editingArea ? handleEditArea : handleAddArea}
          editingArea={editingArea as any}
          existingAreas={expertiseAreas as any}
          isLoading={isLoading}
        />
    </div>
  )
}

// Componente para mostrar una tarjeta de área de expertise
interface ExpertiseAreaCardProps {
  area: ExpertiseArea
  isEditing: boolean
  onEdit: () => void
  onDelete: () => void
}

function ExpertiseAreaCard({ area, isEditing, onEdit, onDelete }: ExpertiseAreaCardProps) {
  // 🚀 OPTIMIZACIÓN: Memoizar cálculos para evitar re-renders innecesarios
  const calculatedData = useMemo(() => {
    // 🔄 CALCULAR SCORE USANDO LA MISMA FÓRMULA DEL MODAL
    const calculateScore = (area: ExpertiseArea) => {
      if (!area.yearsExperience) return 0
      
      // Base: años de experiencia (máximo 60 puntos)
      const experienceScore = Math.min(60, area.yearsExperience * 3)
      
      // Multiplicador por nivel (mapear de string a número)
      const levelToNumber = { 'novice': 1, 'intermediate': 2, 'advanced': 3, 'expert': 4 }
      const proficiencyLevel = levelToNumber[area.level] || 2
      
      const levelMultiplier = {
        1: 0.6,  // Principiante (novice)
        2: 0.8,  // Competente (intermediate)
        3: 1.0,  // Experimentado (advanced)
        4: 1.2   // Experto (expert)
      }[proficiencyLevel] || 1.0
      
      // 🔄 BONUS POR CONTEXTOS REALES
      const realContexts = (area as any).context || ['PROFESSIONAL']
      const contextBonus = realContexts.length * 5
      
      // 🔄 BONUS POR EDUCACIÓN REAL
      const realEducation = (area as any).educationLevel
      const educationBonus = realEducation ? 10 : 0
      
      const finalScore = Math.min(100, Math.max(10, 
        Math.round(experienceScore * levelMultiplier + contextBonus + educationBonus)
      ))
      
      return finalScore
    }
    
    const calculatedScore = calculateScore(area)
    
    // 🔄 CALCULAR NIVEL Y PRIORIDAD BASADO EN EL SCORE (igual que el modal)
    const calculatedLevel = calculatedScore >= 85 ? 'MAESTRO' :
                            calculatedScore >= 70 ? 'EXPERTO' :
                            calculatedScore >= 55 ? 'EXPERIMENTADO' :
                            calculatedScore >= 35 ? 'COMPETENTE' : 'NOVATO'
                            
    const calculatedPriority = calculatedScore >= 75 ? 'HIGH' :
                               calculatedScore >= 50 ? 'MEDIUM' : 'LOW'
    
    const colors = ExpertiseCalculator.getScoreColors(calculatedScore)
    
    return {
      calculatedScore,
      calculatedLevel,
      calculatedPriority,
      colors
    }
  }, [area.yearsExperience, area.level, area.name, (area as any).context, (area as any).educationLevel]) // 🔄 INCLUIR CONTEXTOS Y FORMACIÓN
  
  // 🔍 DEBUG: Verificar datos de contexto y formación
  React.useEffect(() => {
    console.log(`📊 [CARD DEBUG] ${area.name}:`, {
      context: (area as any).context,
      educationLevel: (area as any).educationLevel,
      level: area.level,
      yearsExperience: area.yearsExperience
    })
  }, [(area as any).context, (area as any).educationLevel])
  
  return (
    <div className="bg-dark-bg-tertiary rounded-lg p-4 border border-dark-bg-tertiary hover:border-micmac-primary-500/30 transition-colors">
      <div className="space-y-3">
        {/* Header con título y acciones */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-dark-text-primary text-lg truncate mb-2">
              {area.name}
            </h4>
            
            {/* Métricas en línea responsive */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <div className={`px-2 py-1 rounded-full border text-xs font-medium ${calculatedData.colors.bg} ${calculatedData.colors.border}`}>
                <span className={calculatedData.colors.text}>
                  {calculatedData.calculatedScore}/100
                </span>
              </div>
              <div className={`text-xs font-medium ${ExpertiseCalculator.getLevelColor(calculatedData.calculatedLevel as any)}`}>
                {calculatedData.calculatedLevel}
              </div>
              <div className="flex items-center gap-1 text-xs text-dark-text-muted">
                <span>{ExpertiseCalculator.getPriorityIcon(calculatedData.calculatedPriority as any)}</span>
                <span className="hidden sm:inline">{calculatedData.calculatedPriority}</span>
              </div>
            </div>
          </div>
          
          {/* Acciones */}
          {isEditing && (
            <div className="flex items-center gap-1 flex-shrink-0 ml-2">
              <Button
                ghost
                size="sm"
                onClick={onEdit}
                className="text-dark-text-secondary hover:text-dark-text-primary"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
              </Button>
              <Button
                ghost
                size="sm"
                onClick={onDelete}
                className="text-red-400 hover:text-red-300"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </Button>
            </div>
          )}
        </div>
        
        {/* Detalles de experiencia */}
        <div className="flex flex-col gap-2 text-xs sm:text-sm text-dark-text-secondary">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <span>📅 {area.yearsExperience} años</span>
            <span>📊 Nivel: {area.level}</span>
          </div>
          
          {/* 🆕 CONTEXTOS DE EXPERIENCIA */}
          {(area as any).context && (area as any).context.length > 0 && (
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-dark-text-muted">Contextos:</span>
              {(area as any).context.map((ctx: string, idx: number) => (
                <span key={idx} className="px-2 py-1 bg-dark-bg-secondary rounded text-xs border border-dark-bg-tertiary">
                  {ctx === 'PROFESSIONAL' ? '💼 Prof.' :
                   ctx === 'ACADEMIC' ? '🎓 Acad.' :
                   ctx === 'RESEARCH' ? '🔬 Inv.' :
                   ctx === 'CONSULTING' ? '💡 Cons.' :
                   ctx === 'PERSONAL' ? '🛠️ Pers.' : ctx}
                </span>
              ))}
            </div>
          )}
          
          {/* 🆕 FORMACIÓN */}
          {(area as any).educationLevel && (
            <div className="flex items-center gap-2">
              <span className="text-dark-text-muted">Formación:</span>
              <span className="px-2 py-1 bg-dark-bg-secondary rounded text-xs border border-dark-bg-tertiary">
                {(area as any).educationLevel === 'autodidacta' ? '🎯 Autodidacta' :
                 (area as any).educationLevel === 'tecnico' ? '🔧 Técnico' :
                 (area as any).educationLevel === 'universitario' ? '🎓 Universitario' :
                 (area as any).educationLevel === 'postgrado' ? '📜 Postgrado' :
                 (area as any).educationLevel === 'doctorado' ? '🎓 Doctorado' : 
                 (area as any).educationLevel}
              </span>
            </div>
          )}
        </div>
        
        {/* Barra de progreso */}
        <div className="w-full bg-dark-bg-secondary rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-micmac-primary-500 to-micmac-secondary-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${calculatedData.calculatedScore}%` }}
          />
        </div>
      </div>
    </div>
  )
}
