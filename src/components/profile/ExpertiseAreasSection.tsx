'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import ExpertiseAreaModal from './ExpertiseAreaModal'
import { ExpertiseCalculator } from '@/utils/expertiseCalculator'
import type { ExpertiseArea } from '@/types/project'

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
  
  const handleAddArea = (newArea: ExpertiseArea) => {
    onAreasChange([...expertiseAreas, newArea])
  }
  
  const handleEditArea = (updatedArea: ExpertiseArea) => {
    const updatedAreas = expertiseAreas.map(area =>
      area.name === editingArea?.name ? updatedArea : area
    )
    onAreasChange(updatedAreas)
    setEditingArea(null)
  }
  
  const handleDeleteArea = (areaToDelete: ExpertiseArea) => {
    const updatedAreas = expertiseAreas.filter(area => area.name !== areaToDelete.name)
    onAreasChange(updatedAreas)
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
        editingArea={editingArea}
        existingAreas={expertiseAreas}
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
  const colors = ExpertiseCalculator.getScoreColors(area.calculatedScore)
  
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
              <div className={`px-2 py-1 rounded-full border text-xs font-medium ${colors.bg} ${colors.border}`}>
                <span className={colors.text}>
                  {area.calculatedScore}/100
                </span>
              </div>
              <div className={`text-xs font-medium ${ExpertiseCalculator.getLevelColor(area.level)}`}>
                {area.level}
              </div>
              <div className="flex items-center gap-1 text-xs text-dark-text-muted">
                <span>{ExpertiseCalculator.getPriorityIcon(area.priority)}</span>
                <span className="hidden sm:inline">{area.priority}</span>
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
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-dark-text-secondary">
          <span>📅 {area.yearsExperience} años</span>
          <span>💼 {ExpertiseCalculator.getContextLabel(area.experienceType)}</span>
          {area.educationLevel && (
            <span>🎓 {ExpertiseCalculator.getEducationLabel(area.educationLevel)}</span>
          )}
        </div>
        
        {/* Barra de progreso */}
        <div className="w-full bg-dark-bg-secondary rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-micmac-primary-500 to-micmac-secondary-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${area.calculatedScore}%` }}
          />
        </div>
      </div>
    </div>
  )
}
