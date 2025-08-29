import React, { useState, useEffect } from 'react'
import { addDays, addHours, format, isAfter, isBefore, isSameDay } from 'date-fns'
import { es } from 'date-fns/locale'
import { CalendarIcon, ClockIcon, GlobeAltIcon, BellIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import Calendar from '../ui/Calendar'
import DateTimePicker from '../ui/DateTimePicker'
import TimezoneSelector from '../ui/TimezoneSelector'
import Button from '../ui/Button'
import Input from '../ui/Input'

interface ProgrammingTabProps {
  startDate: Date
  endDate: Date
  timezone: string
  reminderDays: number
  allowLateVoting: boolean
  onUpdate: (updates: {
    startDate: Date
    endDate: Date
    timezone: string
    reminderDays: number
    allowLateVoting: boolean
  }) => void
  projects?: Array<{
    id: string
    name: string
    startDate: Date
    endDate: Date
    status: string
    expertCount: number
  }>
}

export default function ProgrammingTab({
  startDate,
  endDate,
  timezone,
  reminderDays,
  allowLateVoting,
  onUpdate,
  projects = []
}: ProgrammingTabProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [localStartDate, setLocalStartDate] = useState(startDate)
  const [localEndDate, setLocalEndDate] = useState(endDate)
  const [localTimezone, setLocalTimezone] = useState(timezone)
  const [localReminderDays, setLocalReminderDays] = useState(reminderDays)
  const [localAllowLateVoting, setLocalAllowLateVoting] = useState(allowLateVoting)
  const [showQuickSetup, setShowQuickSetup] = useState(false)

  // Actualizar fechas locales cuando cambien las props
  useEffect(() => {
    setLocalStartDate(startDate)
    setLocalEndDate(endDate)
  }, [startDate, endDate])

  // Manejar cambios en la configuración
  const handleConfigChange = () => {
    onUpdate({
      startDate: localStartDate,
      endDate: localEndDate,
      timezone: localTimezone,
      reminderDays: localReminderDays,
      allowLateVoting: localAllowLateVoting
    })
  }

  // Configuraciones rápidas predefinidas
  const quickSetups = [
    {
      name: 'Consulta Rápida',
      description: '2 horas de votación',
      duration: 2,
      unit: 'hours'
    },
    {
      name: 'Análisis Semanal',
      description: '7 días de votación',
      duration: 7,
      unit: 'days'
    },
    {
      name: 'Estudio Mensual',
      description: '30 días de votación',
      duration: 30,
      unit: 'days'
    },
    {
      name: 'Proyecto Trimestral',
      description: '90 días de votación',
      duration: 90,
      unit: 'days'
    }
  ]

  // Aplicar configuración rápida
  const applyQuickSetup = (setup: typeof quickSetups[0]) => {
    const now = new Date()
    let newEndDate: Date

    if (setup.unit === 'hours') {
      newEndDate = addHours(now, setup.duration)
    } else {
      newEndDate = addDays(now, setup.duration)
    }

    setLocalStartDate(now)
    setLocalEndDate(newEndDate)
    setLocalTimezone('America/Caracas') // Default timezone
    setLocalReminderDays(1)
    setLocalAllowLateVoting(false)
    
    // Aplicar cambios
    onUpdate({
      startDate: now,
      endDate: newEndDate,
      timezone: 'America/Caracas',
      reminderDays: 1,
      allowLateVoting: false
    })
  }

  // Calcular duración del proyecto
  const calculateDuration = () => {
    const diffTime = Math.abs(localEndDate.getTime() - localStartDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60))
    
    if (diffDays > 1) {
      return `${diffDays} días`
    } else if (diffHours > 1) {
      return `${diffHours} horas`
    } else {
      return `${Math.ceil(diffTime / (1000 * 60))} minutos`
    }
  }

  // Verificar si la configuración es válida
  const isConfigValid = () => {
    return isAfter(localEndDate, localStartDate) && localReminderDays >= 0
  }

  // Obtener estado del proyecto basado en fechas
  const getProjectStatus = () => {
    const now = new Date()
    
    if (isBefore(now, localStartDate)) {
      return { status: 'SCHEDULED', label: 'Programado', color: 'text-blue-600 dark:text-blue-400' }
    } else if (isAfter(now, localEndDate)) {
      return { status: 'COMPLETED', label: 'Completado', color: 'text-purple-600 dark:text-purple-400' }
    } else {
      return { status: 'ACTIVE', label: 'Activo', color: 'text-green-600 dark:text-green-400' }
    }
  }

  const projectStatus = getProjectStatus()

  return (
    <div className="space-y-8">
      {/* Header de la pestaña */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-4">
          <CalendarIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Programación del Proyecto
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Configura las fechas, horarios y zona horaria para la votación de expertos. 
          El calendario te permite visualizar y seleccionar fechas de manera intuitiva.
        </p>
      </div>

      {/* Calendario Grande */}
      <div className="mb-8">
        <Calendar
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          startDate={localStartDate}
          endDate={localEndDate}
          onDateRangeChange={(start, end) => {
            setLocalStartDate(start)
            setLocalEndDate(end)
            handleConfigChange()
          }}
          projects={projects}
          className="shadow-lg"
        />
      </div>

      {/* Configuración de Fechas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Panel Izquierdo: Configuración de Fechas */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <ClockIcon className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
              Configuración de Fechas
            </h3>
            
            <div className="space-y-4">
              {/* Zona Horaria */}
              <div>
                <TimezoneSelector
                  label="Zona Horaria del Proyecto"
                  value={localTimezone}
                  onChange={(newTimezone) => {
                    setLocalTimezone(newTimezone)
                    handleConfigChange()
                  }}
                  error=""
                />
              </div>

              {/* Fecha de Inicio */}
              <div>
                <DateTimePicker
                  label="Fecha y Hora de Inicio *"
                  value={localStartDate}
                  onChange={(date) => {
                    setLocalStartDate(date)
                    handleConfigChange()
                  }}
                  error=""
                  placeholder="Cuándo inicia la votación"
                />
              </div>

              {/* Fecha de Finalización */}
              <div>
                <DateTimePicker
                  label="Fecha y Hora de Finalización *"
                  value={localEndDate}
                  onChange={(date) => {
                    setLocalEndDate(date)
                    handleConfigChange()
                  }}
                  minDate={localStartDate}
                  error=""
                  placeholder="Cuándo termina la votación"
                />
              </div>

              {/* Recordatorio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Recordatorio (días antes)
                </label>
                <Input
                  type="number"
                  min="0"
                  max="30"
                  value={localReminderDays}
                  onChange={(e) => {
                    setLocalReminderDays(parseInt(e.target.value) || 0)
                    handleConfigChange()
                  }}
                  className="w-full"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Se enviará recordatorio a los expertos
                </p>
              </div>
            </div>
          </div>

          {/* Configuración Adicional */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <BellIcon className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
              Configuración Adicional
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  id="allow-late-voting"
                  type="checkbox"
                  checked={localAllowLateVoting}
                  onChange={(e) => {
                    setLocalAllowLateVoting(e.target.checked)
                    handleConfigChange()
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="allow-late-voting" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Permitir votaciones después de la fecha límite
                </label>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 ml-6">
                Los votos tardíos se marcarán como tales en los resultados
              </p>
            </div>
          </div>
        </div>

        {/* Panel Derecho: Resumen y Configuraciones Rápidas */}
        <div className="space-y-6">
          {/* Resumen del Proyecto */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <CheckCircleIcon className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
              Resumen del Proyecto
            </h3>
            
            <div className="space-y-4">
              {/* Estado del Proyecto */}
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Estado:</span>
                <span className={`text-sm font-semibold ${projectStatus.color}`}>
                  {projectStatus.label}
                </span>
              </div>

              {/* Duración */}
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Duración:</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {calculateDuration()}
                </span>
              </div>

              {/* Zona Horaria */}
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Zona Horaria:</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {localTimezone}
                </span>
              </div>

              {/* Recordatorio */}
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Recordatorio:</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {localReminderDays > 0 ? `${localReminderDays} día(s) antes` : 'No configurado'}
                </span>
              </div>

              {/* Votaciones Tardías */}
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Votaciones Tardías:</span>
                <span className={`text-sm font-semibold ${localAllowLateVoting ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {localAllowLateVoting ? 'Permitidas' : 'No permitidas'}
                </span>
              </div>
            </div>

            {/* Indicador de Validación */}
            {!isConfigValid() && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-700 dark:text-red-300">
                  ⚠️ La fecha de finalización debe ser posterior a la fecha de inicio
                </p>
              </div>
            )}
          </div>

          {/* Configuraciones Rápidas */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <GlobeAltIcon className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
              Configuraciones Rápidas
            </h3>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Aplica configuraciones predefinidas para agilizar la programación
            </p>
            
            <div className="space-y-3">
              {quickSetups.map((setup) => (
                <Button
                  key={setup.name}
                  onClick={() => applyQuickSetup(setup)}
                  ghost
                  size="sm"
                  className="w-full justify-start text-left"
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {setup.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {setup.description}
                    </div>
                  </div>
                  <div className="text-blue-600 dark:text-blue-400">
                    →
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Información Adicional */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
          💡 Consejos de Programación
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800 dark:text-blue-200">
          <div>
            <p className="font-medium mb-2">⏰ Duración Recomendada:</p>
            <ul className="space-y-1 ml-4">
              <li>• <strong>Consultas rápidas:</strong> 2-4 horas</li>
              <li>• <strong>Análisis estándar:</strong> 3-7 días</li>
              <li>• <strong>Estudios complejos:</strong> 1-4 semanas</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">🌍 Zona Horaria:</p>
            <ul className="space-y-1 ml-4">
              <li>• <strong>Considera</strong> la ubicación de tus expertos</li>
              <li>• <strong>Evita</strong> fechas festivas importantes</li>
              <li>• <strong>Programa</strong> en horarios laborales</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
