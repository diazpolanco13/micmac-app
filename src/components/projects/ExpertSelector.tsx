'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Expert } from '@/types/project'

// Catálogo de expertos disponibles
const availableExperts: Expert[] = [
  {
    id: 'expert-1',
    name: 'Dr. María González',
    email: 'maria.gonzalez@universidad.edu',
    expertise: ['Tecnología', 'Innovación', 'Prospectiva'],
    role: 'expert',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150'
  },
  {
    id: 'expert-2',
    name: 'Ing. Carlos Ruiz',
    email: 'carlos.ruiz@consultora.com',
    expertise: ['Políticas Públicas', 'Regulación'],
    role: 'expert',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
  },
  {
    id: 'expert-3',
    name: 'Dra. Ana Martín',
    email: 'ana.martin@empresa.com',
    expertise: ['Marketing', 'Comportamiento del Consumidor'],
    role: 'expert',
    status: 'active'
  },
  {
    id: 'expert-4',
    name: 'Prof. Ricardo Vega',
    email: 'ricardo.vega@instituto.org',
    expertise: ['Economía', 'Finanzas', 'Análisis Estratégico'],
    role: 'expert',
    status: 'active'
  },
  {
    id: 'expert-5',
    name: 'Dra. Sofía Herrera',
    email: 'sofia.herrera@centro.edu',
    expertise: ['Sostenibilidad', 'Medio Ambiente', 'Política Ambiental'],
    role: 'expert',
    status: 'active'
  },
  {
    id: 'expert-6',
    name: 'Ing. David López',
    email: 'david.lopez@tech.com',
    expertise: ['IA', 'Machine Learning', 'Transformación Digital'],
    role: 'expert',
    status: 'active'
  },
  {
    id: 'expert-7',
    name: 'Dr. Patricia Silva',
    email: 'patricia.silva@social.org',
    expertise: ['Sociología', 'Comportamiento Social', 'Tendencias'],
    role: 'expert',
    status: 'active'
  },
  {
    id: 'expert-8',
    name: 'Ing. Miguel Torres',
    email: 'miguel.torres@energia.com',
    expertise: ['Energía', 'Renovables', 'Infraestructura'],
    role: 'expert',
    status: 'active'
  }
]

interface ExpertSelectorProps {
  selectedExperts: Expert[]
  onExpertsChange: (experts: Expert[]) => void
  expectedExperts: number
  className?: string
}

export default function ExpertSelector({
  selectedExperts,
  onExpertsChange,
  expectedExperts,
  className = ''
}: ExpertSelectorProps) {
  const [isSelectingMode, setIsSelectingMode] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterByExpertise, setFilterByExpertise] = useState('')

  // Filtrar expertos disponibles (no seleccionados)
  const availableForSelection = availableExperts.filter(expert => 
    !selectedExperts.some(selected => selected.id === expert.id)
  )

  // Filtrar por búsqueda y expertise
  const filteredAvailable = availableForSelection.filter(expert => {
    const matchesSearch = expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expert.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesExpertise = !filterByExpertise || 
                           expert.expertise.some(exp => 
                             exp.toLowerCase().includes(filterByExpertise.toLowerCase())
                           )
    
    return matchesSearch && matchesExpertise
  })

  // Obtener todas las áreas de expertise para el filtro
  const allExpertiseAreas = Array.from(
    new Set(availableExperts.flatMap(expert => expert.expertise))
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
    if (selectedExperts.length <= 3) {
      alert('⚠️ Se requieren mínimo 3 expertos para el proyecto MIC MAC')
      return
    }
    
    const updatedExperts = selectedExperts.filter(expert => expert.id !== expertId)
    onExpertsChange(updatedExperts)
  }

  const getExpertiseColor = (expertise: string): string => {
    const colors = {
      'Tecnología': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      'Innovación': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      'Políticas Públicas': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      'Marketing': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
      'Economía': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      'Sostenibilidad': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
      'IA': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
      'Energía': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
    }
    return colors[expertise as keyof typeof colors] || 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header con validación */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Expertos Seleccionados
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {selectedExperts.length}/{expectedExperts} expertos • Mínimo 3 requeridos
          </p>
        </div>
        
        {/* Indicador metodológico */}
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          selectedExperts.length >= 3 
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
        }`}>
          {selectedExperts.length >= 3 ? 'Válido' : `Faltan ${3 - selectedExperts.length}`}
        </div>
      </div>

      {/* Lista de expertos seleccionados */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {selectedExperts.map((expert) => (
          <div key={expert.id} className="flex items-center space-x-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="w-10 h-10 bg-micmac-primary-500/10 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-micmac-primary-600 dark:text-micmac-primary-400">
                {expert.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 dark:text-white">{expert.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{expert.email}</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {expert.expertise.slice(0, 2).map((exp) => (
                  <span key={exp} className={`px-2 py-0.5 rounded text-xs ${getExpertiseColor(exp)}`}>
                    {exp}
                  </span>
                ))}
                {expert.expertise.length > 2 && (
                  <span className="text-xs text-gray-500">+{expert.expertise.length - 2}</span>
                )}
              </div>
            </div>
            <Button 
              ghost 
              size="sm" 
              onClick={() => removeExpert(expert.id)}
              className="h-10 w-10 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
              title="Eliminar experto"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </Button>
          </div>
        ))}
      </div>

      {selectedExperts.length === 0 && (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-900/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No hay expertos seleccionados</p>
          <Button 
            color="primary" 
            size="sm"
            onClick={() => setIsSelectingMode(true)}
          >
            Seleccionar Primeros Expertos
          </Button>
        </div>
      )}

      {/* Botón para agregar más expertos */}
      {selectedExperts.length > 0 && selectedExperts.length < 50 && (
        <Button
          onClick={() => setIsSelectingMode(true)}
          ghost
          className="w-full h-12 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-micmac-primary-300 hover:bg-micmac-primary-50 dark:hover:bg-micmac-primary-900/20 transition-colors"
        >
          + Agregar Más Expertos ({availableForSelection.length} disponibles)
        </Button>
      )}

      {/* Modal de selección de expertos */}
      {isSelectingMode && (
        <div className="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            {/* Header del selector */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Seleccionar Expertos
                </h3>
                <Button 
                  ghost 
                  onClick={() => setIsSelectingMode(false)}
                  className="h-8 w-8 p-0"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>

              {/* Filtros */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Buscar por nombre o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
              
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {filteredAvailable.length} expertos disponibles
              </p>
            </div>

            {/* Lista de expertos disponibles */}
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredAvailable.map((expert) => (
                  <div 
                    key={expert.id}
                    className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="w-12 h-12 bg-micmac-primary-500/10 rounded-full flex items-center justify-center">
                      {expert.avatar ? (
                        <img 
                          src={expert.avatar} 
                          alt={expert.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-medium text-micmac-primary-600 dark:text-micmac-primary-400">
                          {expert.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white">{expert.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{expert.email}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {expert.expertise.slice(0, 3).map((exp) => (
                          <span key={exp} className={`px-2 py-0.5 rounded text-xs ${getExpertiseColor(exp)}`}>
                            {exp}
                          </span>
                        ))}
                        {expert.expertise.length > 3 && (
                          <span className="text-xs text-gray-500">+{expert.expertise.length - 3}</span>
                        )}
                      </div>
                    </div>
                    <Button
                      color="primary"
                      size="sm"
                      onClick={() => addExpert(expert)}
                    >
                      Agregar
                    </Button>
                  </div>
                ))}
              </div>

              {filteredAvailable.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    {availableForSelection.length === 0 
                      ? 'Todos los expertos han sido seleccionados' 
                      : 'No se encontraron expertos con esos criterios'
                    }
                  </p>
                </div>
              )}
            </div>

            {/* Footer del selector */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedExperts.length} de {expectedExperts} expertos seleccionados
                </p>
                <Button
                  ghost
                  onClick={() => setIsSelectingMode(false)}
                >
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info metodológica */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex space-x-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Panel de Expertos MIC MAC
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              Selecciona entre 3-50 expertos con expertise diversa y relevante para el análisis prospectivo. 
              La diversidad de perspectivas es clave para un análisis MIC MAC robusto.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
