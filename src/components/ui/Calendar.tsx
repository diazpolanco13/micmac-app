import React, { useState, useMemo } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday, isBefore, isAfter, startOfWeek, endOfWeek, addDays } from 'date-fns'
import { es } from 'date-fns/locale'
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon, ClockIcon, UsersIcon } from '@heroicons/react/24/outline'

interface CalendarProps {
  selectedDate?: Date
  onDateSelect?: (date: Date) => void
  startDate?: Date
  endDate?: Date
  onDateRangeChange?: (start: Date, end: Date) => void
  projects?: Array<{
    id: string
    name: string
    startDate: Date
    endDate: Date
    status: string
    expertCount: number
  }>
  className?: string
}

export default function Calendar({
  selectedDate,
  onDateSelect,
  startDate,
  endDate,
  onDateRangeChange,
  projects = [],
  className = ''
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month')

  // Navegación del calendario
  const goToPreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
  const goToToday = () => setCurrentMonth(new Date())

  // Generar días del mes actual
  const monthDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 }) // Lunes como primer día
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 })
    return eachDayOfInterval({ start, end })
  }, [currentMonth])

  // Agrupar días por semanas
  const weeks = useMemo(() => {
    const weeks = []
    for (let i = 0; i < monthDays.length; i += 7) {
      weeks.push(monthDays.slice(i, i + 7))
    }
    return weeks
  }, [monthDays])

  // Obtener proyectos para una fecha específica
  const getProjectsForDate = (date: Date) => {
    return projects.filter(project => {
      const start = new Date(project.startDate)
      const end = new Date(project.endDate)
      return isSameDay(date, start) || isSameDay(date, end) || 
             (isAfter(date, start) && isBefore(date, end))
    })
  }

  // Manejar selección de fecha
  const handleDateClick = (date: Date) => {
    if (onDateSelect) {
      onDateSelect(date)
    }
    
    if (onDateRangeChange && !startDate) {
      // Primera selección - establecer fecha de inicio
      onDateRangeChange(date, addDays(date, 7))
    } else if (onDateRangeChange && startDate && !endDate) {
      // Segunda selección - establecer fecha de fin
      if (isAfter(date, startDate)) {
        onDateRangeChange(startDate, date)
      } else {
        onDateRangeChange(date, startDate)
      }
    }
  }

  // Verificar si una fecha está en el rango seleccionado
  const isInSelectedRange = (date: Date) => {
    if (!startDate || !endDate) return false
    return (isSameDay(date, startDate) || isSameDay(date, endDate) || 
            (isAfter(date, startDate) && isBefore(date, endDate)))
  }

  // Verificar si una fecha es la fecha de inicio o fin
  const isRangeBoundary = (date: Date) => {
    if (!startDate || !endDate) return false
    return isSameDay(date, startDate) || isSameDay(date, endDate)
  }

  // Obtener el color del estado del proyecto
  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-500'
      case 'SCHEDULED': return 'bg-blue-500'
      case 'ACTIVE': return 'bg-green-500'
      case 'REVIEW': return 'bg-yellow-500'
      case 'COMPLETED': return 'bg-purple-500'
      case 'ARCHIVED': return 'bg-gray-400'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header del calendario */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <CalendarIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Calendario de Programación
          </h2>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Selector de vista */}
          <div className="flex rounded-lg border border-gray-300 dark:border-gray-600">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-2 text-sm font-medium rounded-l-lg transition-colors ${
                viewMode === 'month'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Mes
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-2 text-sm font-medium rounded-r-lg transition-colors ${
                viewMode === 'week'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Semana
            </button>
          </div>

          {/* Navegación */}
          <div className="flex items-center space-x-2">
            <button
              onClick={goToPreviousMonth}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            
            <button
              onClick={goToToday}
              className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            >
              Hoy
            </button>
            
            <button
              onClick={goToNextMonth}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mes y año actual */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {format(currentMonth, 'MMMM yyyy', { locale: es })}
        </h3>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
          <div key={day} className="bg-gray-50 dark:bg-gray-800 p-3 text-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {day}
            </span>
          </div>
        ))}
      </div>

      {/* Días del mes */}
      <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
        {monthDays.map((day, dayIdx) => {
          const dayProjects = getProjectsForDate(day)
          const isCurrentMonth = isSameMonth(day, currentMonth)
          const isSelected = selectedDate && isSameDay(day, selectedDate)
          const isInRange = isInSelectedRange(day)
          const isBoundary = isRangeBoundary(day)
          
          return (
            <div
              key={dayIdx}
              onClick={() => handleDateClick(day)}
              className={`
                min-h-[120px] bg-white dark:bg-gray-800 p-2 cursor-pointer transition-all
                ${!isCurrentMonth ? 'opacity-40' : ''}
                ${isSelected ? 'ring-2 ring-blue-500 ring-inset' : ''}
                ${isInRange ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                ${isBoundary ? 'bg-blue-100 dark:bg-blue-800/30' : ''}
                hover:bg-gray-50 dark:hover:bg-gray-700
              `}
            >
              {/* Número del día */}
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`
                    text-sm font-medium
                    ${isToday(day) ? 'bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center' : ''}
                    ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}
                  `}
                >
                  {format(day, 'd')}
                </span>
                
                {/* Indicador de proyectos */}
                {dayProjects.length > 0 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {dayProjects.length} proyecto{dayProjects.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {/* Proyectos del día */}
              <div className="space-y-1">
                {dayProjects.slice(0, 2).map((project) => (
                  <div
                    key={project.id}
                    className={`
                      p-1 rounded text-xs font-medium text-white truncate
                      ${getProjectStatusColor(project.status)}
                    `}
                    title={`${project.name} (${project.status})`}
                  >
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="h-3 w-3" />
                      <span className="truncate">{project.name}</span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs opacity-90">
                        {format(new Date(project.startDate), 'HH:mm')}
                      </span>
                      <div className="flex items-center space-x-1">
                        <UsersIcon className="h-3 w-3" />
                        <span>{project.expertCount}</span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {dayProjects.length > 2 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    +{dayProjects.length - 2} más
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Leyenda */}
      <div className="p-6 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Leyenda de Estados</h4>
        <div className="flex flex-wrap gap-3">
          {[
            { status: 'DRAFT', label: 'Borrador' },
            { status: 'SCHEDULED', label: 'Programado' },
            { status: 'ACTIVE', label: 'Activo' },
            { status: 'REVIEW', label: 'En Revisión' },
            { status: 'COMPLETED', label: 'Completado' },
            { status: 'ARCHIVED', label: 'Archivado' }
          ].map(({ status, label }) => (
            <div key={status} className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${getProjectStatusColor(status)}`} />
              <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
