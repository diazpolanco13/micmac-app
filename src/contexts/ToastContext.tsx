'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import Toast from '@/components/ui/Toast'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastData {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

interface ToastContextType {
  success: (title: string, message?: string, duration?: number) => void
  error: (title: string, message?: string, duration?: number) => void
  warning: (title: string, message?: string, duration?: number) => void
  info: (title: string, message?: string, duration?: number) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

interface ToastProviderProps {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastData[]>([])

  const showToast = (
    type: ToastType,
    title: string,
    message?: string,
    duration: number = 4000
  ) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const toast: ToastData = {
      id,
      type,
      title,
      message,
      duration
    }
    
    setToasts(prev => [...prev, toast])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const success = (title: string, message?: string, duration?: number) =>
    showToast('success', title, message, duration)
  
  const error = (title: string, message?: string, duration?: number) =>
    showToast('error', title, message, duration)
  
  const warning = (title: string, message?: string, duration?: number) =>
    showToast('warning', title, message, duration)
  
  const info = (title: string, message?: string, duration?: number) =>
    showToast('info', title, message, duration)

  return (
    <ToastContext.Provider value={{ success, error, warning, info }}>
      {children}
      
      {/* Render all active toasts */}
      <div className="fixed top-0 right-0 z-50 p-4 space-y-2">
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
      </div>
    </ToastContext.Provider>
  )
}
