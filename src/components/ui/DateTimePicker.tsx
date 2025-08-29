'use client'

import { useState, Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline'
import { format, isValid, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isBefore, startOfDay } from 'date-fns'
import { es } from 'date-fns/locale'
import { Button } from './Button'

interface DateTimePickerProps {
  label: string
  value?: Date
  onChange: (date: Date) => void
  minDate?: Date
  maxDate?: Date
  disabled?: boolean
  error?: string
  placeholder?: string
}

export default function DateTimePicker({
  label,
  value,
  onChange,
  minDate = new Date(),
  maxDate,
  disabled = false,
  error,
  placeholder = "Seleccionar fecha y hora"
}: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(value)
  const [selectedTime, setSelectedTime] = useState(value ? format(value, 'HH:mm') : '09:00')
  const [currentMonth, setCurrentMonth] = useState(value || new Date())

  const handleDateSelect = (date: Date) => {
    const [hours, minutes] = selectedTime.split(':').map(Number)
    const newDateTime = new Date(date)
    newDateTime.setHours(hours, minutes, 0, 0)
    
    setSelectedDate(newDateTime)
    onChange(newDateTime)
  }

  const handleTimeChange = (time: string) => {
    setSelectedTime(time)
    if (selectedDate) {
      const [hours, minutes] = time.split(':').map(Number)
      const newDateTime = new Date(selectedDate)
      newDateTime.setHours(hours, minutes, 0, 0)
      onChange(newDateTime)
    }
  }

  const generateCalendarDays = () => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
    
    // Agregar días del mes anterior para completar la primera semana
    const startDay = monthStart.getDay()
    const prevMonthDays = []
    for (let i = startDay - 1; i >= 0; i--) {
      const prevDay = new Date(monthStart)
      prevDay.setDate(prevDay.getDate() - i - 1)
      prevMonthDays.push(prevDay)
    }
    
    // Agregar días del mes siguiente para completar la última semana
    const endDay = monthEnd.getDay()
    const nextMonthDays = []
    for (let i = 1; i <= (6 - endDay); i++) {
      const nextDay = new Date(monthEnd)
      nextDay.setDate(nextDay.getDate() + i)
      nextMonthDays.push(nextDay)
    }
    
    return [...prevMonthDays, ...days, ...nextMonthDays]
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth)
    newMonth.setMonth(newMonth.getMonth() + (direction === 'next' ? 1 : -1))
    setCurrentMonth(newMonth)
  }

  const isDateDisabled = (date: Date) => {
    const today = startOfDay(new Date())
    if (isBefore(date, today)) return true
    if (minDate && isBefore(date, startOfDay(minDate))) return true
    if (maxDate && isBefore(maxDate, startOfDay(date))) return true
    return false
  }

  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0')
    return [`${hour}:00`, `${hour}:30`]
  }).flat()

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      
      <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button
              disabled={disabled}
              className={`
                relative w-full rounded-lg border px-3 py-2 text-left shadow-sm transition-colors
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
              <div className="flex items-center space-x-3">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
                <span className={selectedDate ? 'text-gray-900 dark:text-white' : 'text-gray-500'}>
                  {selectedDate 
                    ? format(selectedDate, "d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })
                    : placeholder
                  }
                </span>
              </div>
            </Popover.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute z-50 mt-2 w-80 rounded-lg bg-white dark:bg-gray-800 shadow-2xl ring-1 ring-black ring-opacity-5 border border-gray-200 dark:border-gray-700">
                <div className="p-4">
                  {/* Header del calendario */}
                  <div className="flex items-center justify-between mb-4">
                    <button
                      type="button"
                      onClick={() => navigateMonth('prev')}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {format(currentMonth, 'MMMM yyyy', { locale: es })}
                    </h3>
                    
                    <button
                      type="button"
                      onClick={() => navigateMonth('next')}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                  {/* Días de la semana */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                      <div key={day} className="p-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendario */}
                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {generateCalendarDays().map((date, index) => {
                      const isCurrentMonth = isSameMonth(date, currentMonth)
                      const isSelected = selectedDate && format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
                      const isTodayDate = isToday(date)
                      const isDisabled = isDateDisabled(date)

                      return (
                        <button
                          key={index}
                          type="button"
                          onClick={() => !isDisabled && handleDateSelect(date)}
                          disabled={isDisabled}
                          className={`
                            p-2 text-sm rounded-lg transition-colors
                            ${!isCurrentMonth 
                              ? 'text-gray-300 dark:text-gray-600' 
                              : isSelected
                                ? 'bg-blue-500 text-white'
                                : isTodayDate
                                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                                  : isDisabled
                                    ? 'text-gray-300 cursor-not-allowed dark:text-gray-600'
                                    : 'text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'
                            }
                          `}
                        >
                          {format(date, 'd')}
                        </button>
                      )
                    })}
                  </div>

                  {/* Selector de hora */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <ClockIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Hora</span>
                    </div>
                    <select
                      value={selectedTime}
                      onChange={(e) => handleTimeChange(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500"
                    >
                      {timeOptions.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}

