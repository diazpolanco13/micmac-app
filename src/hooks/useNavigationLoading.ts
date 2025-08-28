'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

interface NavigationState {
  isNavigating: boolean
  targetRoute: string | null
  startNavigation: (route: string) => void
  completeNavigation: () => void
}

/**
 * Hook para manejar estados de loading durante navegación
 */
export function useNavigationLoading(): NavigationState {
  const [isNavigating, setIsNavigating] = useState(false)
  const [targetRoute, setTargetRoute] = useState<string | null>(null)
  const pathname = usePathname()
  const router = useRouter()

  // Detectar cuando la navegación se completa
  useEffect(() => {
    if (isNavigating && targetRoute && pathname === targetRoute) {
      // Pequeño delay para que se vea el cambio
      const timer = setTimeout(() => {
        setIsNavigating(false)
        setTargetRoute(null)
      }, 150)
      
      return () => clearTimeout(timer)
    }
  }, [pathname, targetRoute, isNavigating])

  const startNavigation = (route: string) => {
    setIsNavigating(true)
    setTargetRoute(route)
  }

  const completeNavigation = () => {
    setIsNavigating(false)
    setTargetRoute(null)
  }

  return {
    isNavigating,
    targetRoute,
    startNavigation,
    completeNavigation
  }
}

/**
 * Hook mejorado del router con estados de loading
 */
export function useNavigationRouter() {
  const router = useRouter()
  const { startNavigation } = useNavigationLoading()

  const push = (route: string) => {
    startNavigation(route)
    router.push(route)
  }

  const replace = (route: string) => {
    startNavigation(route)
    router.replace(route)
  }

  return {
    push,
    replace,
    back: router.back,
    forward: router.forward,
    refresh: router.refresh,
    prefetch: router.prefetch
  }
}
