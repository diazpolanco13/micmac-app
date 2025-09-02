'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { NavigationLoading } from '@/components/ui/LoadingStates'

interface NavigationLoadingState {
  isLoading: boolean
  targetRoute: string | null
  startLoading: (route: string, isAuthTransition?: boolean) => void
  stopLoading: () => void
  isAuthTransition: boolean // 🆕 NUEVA PROPIEDAD
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
  const [isAuthTransition, setIsAuthTransition] = useState(false) // 🆕 NUEVO ESTADO
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Detectar cuando la navegación se completa
  useEffect(() => {
    if (isLoading && targetRoute && pathname === targetRoute) {
      console.log(`🧭 [NAVIGATION LOADING] COMPLETADO - Llegó a: ${pathname} | Duración de carga terminando...`)
      // Iniciar animación de salida
      setIsExiting(true)
      
      // Delay para la animación de salida suave
      const exitTimer = setTimeout(() => {
        console.log(`🧭 [NAVIGATION LOADING] FINALIZADO - Animación completada para: ${pathname}`)
        setIsLoading(false)
        setTargetRoute(null)
        setIsExiting(false)
        setIsAuthTransition(false) // 🆕 RESET AUTH TRANSITION
      }, 600) // Tiempo normal para animación de salida
      
      return () => clearTimeout(exitTimer)
    }
  }, [pathname, targetRoute, isLoading])

  const startLoading = (route: string, isAuthTransition: boolean = false) => { // 🆕 PARÁMETRO OPCIONAL
    // Solo mostrar loading si la ruta es diferente a la actual
    if (route !== pathname) {
      console.log(`🧭 [NAVIGATION LOADING] INICIADO - Ruta: ${route} | Auth: ${isAuthTransition} | Desde: ${pathname}`)
      setIsExiting(false)
      setIsLoading(true)
      setTargetRoute(route)
      setIsAuthTransition(isAuthTransition) // 🆕 ESTABLECER TIPO DE TRANSICIÓN
    }
  }

  const stopLoading = () => {
    setIsExiting(true)
    // Delay para animación de salida
    setTimeout(() => {
      setIsLoading(false)
      setTargetRoute(null)
      setIsExiting(false)
      setIsAuthTransition(false) // 🆕 RESET AUTH TRANSITION
    }, 600)
  }

  return (
    <NavigationLoadingContext.Provider value={{
      isLoading,
      targetRoute,
      startLoading,
      stopLoading,
      isAuthTransition // 🆕 EXPONER ESTADO
    }}>
      {children}
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
  
  const navigateWithLoading = (route: string, isAuthTransition: boolean = false) => { // 🆕 PARÁMETRO OPCIONAL
    startLoading(route, isAuthTransition)
    // El router.push real se maneja en el componente que usa este hook
    return route
  }

  return {
    navigateWithLoading
  }
}

/**
 * Componente que renderiza el NavigationLoading
 * DEBE ser usado en el RootLayout para evitar problemas de clipping
 */
export function NavigationLoadingPortal() {
  const [mounted, setMounted] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const pathname = usePathname()
  const context = useContext(NavigationLoadingContext)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (context?.isLoading && context?.targetRoute && pathname === context?.targetRoute) {
      // Iniciar animación de salida
      setIsExiting(true)
      
      // Delay para la animación de salida suave
      const exitTimer = setTimeout(() => {
        setIsExiting(false)
      }, 600)
      
      return () => clearTimeout(exitTimer)
    }
  }, [pathname, context?.targetRoute, context?.isLoading])

  if (!context || !mounted || !context.isLoading || !context.targetRoute) {
    return null
  }

  // 🔧 NUEVA LÓGICA: Solo mostrar loading grande si es transición de auth
  if (context.isAuthTransition && (context.targetRoute === '/dashboard' || context.targetRoute === '/')) {
    return <NavigationLoading route={context.targetRoute} isAuthTransition={true} />
  }

  // Para todas las demás navegaciones (incluyendo dashboard desde navegación interna), usar loading pequeño
  return (
    <div 
      className={`fixed pointer-events-none ${
        isExiting ? 'animate-slide-out-smooth' : 'animate-slide-in-smooth'
      }`}
      style={{
        position: 'fixed',
        top: '5rem',
        right: '1.5rem',
        zIndex: 200,
        pointerEvents: 'none'
      }}
    >
      <NavigationLoading route={context.targetRoute} isAuthTransition={false} />
    </div>
  )
}
