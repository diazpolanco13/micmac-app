'use client'

import { useState, useEffect } from 'react'
import { Transition } from '@headlessui/react'
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon 
} from '@heroicons/react/24/outline'
import { XMarkIcon } from '@heroicons/react/20/solid'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastProps {
  show: boolean
  onClose: () => void
  type?: ToastType
  title: string
  message?: string
  duration?: number
  closable?: boolean
}

const toastConfig = {
  success: {
    icon: CheckCircleIcon,
    iconColor: 'text-green-400',
    bgColor: 'bg-white'
  },
  error: {
    icon: XCircleIcon,
    iconColor: 'text-red-400', 
    bgColor: 'bg-white'
  },
  warning: {
    icon: ExclamationTriangleIcon,
    iconColor: 'text-yellow-400',
    bgColor: 'bg-white'
  },
  info: {
    icon: InformationCircleIcon,
    iconColor: 'text-blue-400',
    bgColor: 'bg-white'
  }
}

export default function Toast({ 
  show, 
  onClose, 
  type = 'success',
  title,
  message,
  duration = 4000,
  closable = true
}: ToastProps) {
  const config = toastConfig[type]
  const Icon = config.icon

  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [show, duration, onClose])

  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-50"
    >
      <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
        <Transition show={show}>
          <div className={`pointer-events-auto w-full max-w-sm rounded-lg ${config.bgColor} dark:bg-gray-800 shadow-lg outline outline-1 outline-black/5 dark:outline-white/10 transition data-[closed]:data-[enter]:translate-y-2 data-[enter]:transform data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-100 data-[enter]:ease-out data-[leave]:ease-in data-[closed]:data-[enter]:sm:translate-x-2 data-[closed]:data-[enter]:sm:translate-y-0`}>
            <div className="p-4">
              <div className="flex items-start">
                <div className="shrink-0">
                  <Icon aria-hidden="true" className={`size-6 ${config.iconColor}`} />
                </div>
                <div className="ml-3 w-0 flex-1 pt-0.5">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {title}
                  </p>
                  {message && (
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {message}
                    </p>
                  )}
                </div>
                {closable && (
                  <div className="ml-4 flex shrink-0">
                    <button
                      type="button"
                      onClick={onClose}
                      className="inline-flex rounded-md text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-micmac-primary-500"
                    >
                      <span className="sr-only">Cerrar</span>
                      <XMarkIcon aria-hidden="true" className="size-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  )
}

// Hook para usar toasts fácilmente
export function useToast() {
  const [toasts, setToasts] = useState<Array<{
    id: string
    type: ToastType
    title: string
    message?: string
    duration?: number
  }>>([])

  const showToast = (
    type: ToastType,
    title: string, 
    message?: string,
    duration?: number
  ) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    setToasts(prev => [...prev, {
      id,
      type,
      title,
      message,
      duration
    }])

    // Auto remove después del duration
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, duration || 4000)
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  const success = (title: string, message?: string, duration?: number) => 
    showToast('success', title, message, duration)
  
  const error = (title: string, message?: string, duration?: number) => 
    showToast('error', title, message, duration)
  
  const warning = (title: string, message?: string, duration?: number) => 
    showToast('warning', title, message, duration)
  
  const info = (title: string, message?: string, duration?: number) => 
    showToast('info', title, message, duration)

  return {
    toasts,
    success,
    error, 
    warning,
    info,
    removeToast
  }
}

// Componente contenedor de toasts
export function ToastContainer() {
  const { toasts, removeToast } = useToast()

  return (
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          show={true}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  )
}
