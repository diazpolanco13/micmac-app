'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { NavigationLoading } from '@/components/ui/LoadingStates'

interface NavigationLoadingState {
  isLoading: boolean
  targetRoute: string | null
  startLoading: (route: string) => void
  stopLoading: () => void
}

const NavigationLoadingContext = createContext<NavigationLoadingState | null>(null)

interface NavigationLoadingProviderProps {
  children: React.ReactNode
}

export function NavigationLoadingProvider({ children }: NavigationLoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [targetRoute, setTargetRoute] = useState<string | null>(null)
  const [isExiting, setIsExiting] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Detectar cuando la navegación se completa
  useEffect(() => {
    if (isLoading && targetRoute && pathname === targetRoute) {
      // Iniciar animación de salida
      setIsExiting(true)
      
      // Delay para la animación de salida suave
      const exitTimer = setTimeout(() => {
        setIsLoading(false)
        setTargetRoute(null)
        setIsExiting(false)
      }, 600) // Tiempo normal para animación de salida
      
      return () => clearTimeout(exitTimer)
    }
  }, [pathname, targetRoute, isLoading])

  const startLoading = (route: string) => {
    // Solo mostrar loading si la ruta es diferente a la actual
    if (route !== pathname) {
      setIsExiting(false)
      setIsLoading(true)
      setTargetRoute(route)
    }
  }

  const stopLoading = () => {
    setIsExiting(true)
    // Delay para animación de salida
    setTimeout(() => {
      setIsLoading(false)
      setTargetRoute(null)
      setIsExiting(false)
    }, 600)
  }

  return (
    <NavigationLoadingContext.Provider value={{
      isLoading,
      targetRoute,
      startLoading,
      stopLoading
    }}>
      {children}
      
      {/* Componente de loading original con animaciones fabulosas */}
      {mounted && isLoading && targetRoute && (
        <div 
          className={`fixed top-20 right-6 z-[99999] pointer-events-none ${
            isExiting ? 'animate-slide-out-smooth' : 'animate-slide-in-smooth'
          }`}
        >
          <NavigationLoading route={targetRoute} />
        </div>
      )}
    </NavigationLoadingContext.Provider>
  )
}

export function useNavigationLoading() {
  const context = useContext(NavigationLoadingContext)
  if (!context) {
    throw new Error('useNavigationLoading must be used within NavigationLoadingProvider')
  }
  return context
}

/**
 * Hook personalizado para navegación con loading automático
 */
export function useLoadingRouter() {
  const { startLoading } = useNavigationLoading()
  
  const navigateWithLoading = (route: string) => {
    startLoading(route)
    // El router.push real se maneja en el componente que usa este hook
    return route
  }

  return {
    navigateWithLoading
  }
}
