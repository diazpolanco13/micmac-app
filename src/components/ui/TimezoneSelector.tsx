'use client'

import { useState, Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon, GlobeAltIcon } from '@heroicons/react/24/outline'
import { format } from 'date-fns-tz'

interface TimezoneOption {
  value: string
  label: string
  offset: string
  city: string
}

const TIMEZONE_OPTIONS: TimezoneOption[] = [
  // América
  { value: 'America/Caracas', label: 'Venezuela (VET)', offset: 'UTC-4', city: 'Caracas' },
  { value: 'America/Bogota', label: 'Colombia (COT)', offset: 'UTC-5', city: 'Bogotá' },
  { value: 'America/Lima', label: 'Perú (PET)', offset: 'UTC-5', city: 'Lima' },
  { value: 'America/Mexico_City', label: 'México (CST)', offset: 'UTC-6', city: 'Ciudad de México' },
  { value: 'America/New_York', label: 'Estados Unidos Este (EST)', offset: 'UTC-5', city: 'Nueva York' },
  { value: 'America/Chicago', label: 'Estados Unidos Centro (CST)', offset: 'UTC-6', city: 'Chicago' },
  { value: 'America/Denver', label: 'Estados Unidos Montaña (MST)', offset: 'UTC-7', city: 'Denver' },
  { value: 'America/Los_Angeles', label: 'Estados Unidos Oeste (PST)', offset: 'UTC-8', city: 'Los Ángeles' },
  { value: 'America/Sao_Paulo', label: 'Brasil (BRT)', offset: 'UTC-3', city: 'São Paulo' },
  { value: 'America/Argentina/Buenos_Aires', label: 'Argentina (ART)', offset: 'UTC-3', city: 'Buenos Aires' },
  
  // Europa
  { value: 'Europe/Madrid', label: 'España (CET)', offset: 'UTC+1', city: 'Madrid' },
  { value: 'Europe/London', label: 'Reino Unido (GMT)', offset: 'UTC+0', city: 'Londres' },
  { value: 'Europe/Paris', label: 'Francia (CET)', offset: 'UTC+1', city: 'París' },
  { value: 'Europe/Berlin', label: 'Alemania (CET)', offset: 'UTC+1', city: 'Berlín' },
  { value: 'Europe/Rome', label: 'Italia (CET)', offset: 'UTC+1', city: 'Roma' },
  
  // Asia
  { value: 'Asia/Tokyo', label: 'Japón (JST)', offset: 'UTC+9', city: 'Tokio' },
  { value: 'Asia/Shanghai', label: 'China (CST)', offset: 'UTC+8', city: 'Shanghai' },
  { value: 'Asia/Dubai', label: 'Emiratos Árabes Unidos (GST)', offset: 'UTC+4', city: 'Dubái' },
  
  // Oceanía
  { value: 'Australia/Sydney', label: 'Australia Este (AEST)', offset: 'UTC+10', city: 'Sídney' },
]

interface TimezoneSelectorProps {
  label: string
  value?: string
  onChange: (timezone: string) => void
  disabled?: boolean
  error?: string
}

export default function TimezoneSelector({
  label,
  value = 'America/Caracas', // Default a Venezuela
  onChange,
  disabled = false,
  error
}: TimezoneSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const selectedTimezone = TIMEZONE_OPTIONS.find(tz => tz.value === value) || TIMEZONE_OPTIONS[0]

  const filteredTimezones = TIMEZONE_OPTIONS.filter(timezone =>
    timezone.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    timezone.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    timezone.offset.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getCurrentTime = (timezone: string) => {
    try {
      return format(new Date(), 'HH:mm', { timeZone: timezone })
    } catch {
      return '--:--'
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>

      <Listbox value={value} onChange={onChange} disabled={disabled}>
        {({ open }) => (
          <div className="relative">
            <Listbox.Button
              className={`
                relative w-full rounded-lg border px-3 py-2 pl-10 text-left shadow-sm transition-colors
                ${error 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                }
                ${disabled 
                  ? 'bg-gray-100 cursor-not-allowed opacity-50' 
                  : 'bg-white hover:bg-gray-50'
                }
                dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700
                focus:outline-none focus:ring-2 focus:ring-offset-2
              `}
            >
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <GlobeAltIcon className="h-5 w-5 text-gray-400" />
              </div>
              
              <span className="block truncate ml-2">
                {selectedTimezone.label}
              </span>
              
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
              </span>
            </Listbox.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Listbox.Options className="absolute z-50 mt-1 w-full max-h-80 overflow-auto rounded-lg bg-white dark:bg-gray-800 shadow-2xl ring-1 ring-black ring-opacity-5 border border-gray-200 dark:border-gray-700">
                {/* Buscador */}
                <div className="sticky top-0 bg-white dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700">
                  <input
                    type="text"
                    placeholder="Buscar zona horaria..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                {/* Lista de zonas horarias */}
                <div className="py-1">
                  {filteredTimezones.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 text-center">
                      No se encontraron zonas horarias
                    </div>
                  ) : (
                    filteredTimezones.map((timezone) => (
                      <Listbox.Option
                        key={timezone.value}
                        value={timezone.value}
                        className={({ active, selected }) =>
                          `relative cursor-pointer select-none py-3 px-3 transition-colors ${
                            active 
                              ? 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100' 
                              : 'text-gray-900 dark:text-white'
                          }`
                        }
                      >
                        {({ selected }) => (
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <div className="flex-1">
                                  <p className={`text-sm ${selected ? 'font-semibold' : 'font-normal'}`}>
                                    {timezone.label}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {timezone.city} • {timezone.offset}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {getCurrentTime(timezone.value)}
                                  </p>
                                </div>
                              </div>
                            </div>
                            
                            {selected && (
                              <CheckIcon className="h-5 w-5 text-blue-600 ml-3" />
                            )}
                          </div>
                        )}
                      </Listbox.Option>
                    ))
                  )}
                </div>
              </Listbox.Options>
            </Transition>
          </div>
        )}
      </Listbox>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      {/* Información adicional */}
      {value && (
        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-2">
          <span>Hora actual:</span>
          <span className="font-medium">{getCurrentTime(value)}</span>
          <span>•</span>
          <span>{selectedTimezone.offset}</span>
        </div>
      )}
    </div>
  )
}

