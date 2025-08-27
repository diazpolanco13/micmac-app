'use client'

import { useState, useEffect } from 'react'

interface WindowSize {
  width: number | undefined
  height: number | undefined
}

export function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: undefined,
    height: undefined,
  })

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    // Llamar handler de inmediato para obtener el tamaño inicial
    handleResize()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowSize
}

export function useIsDesktop(breakpoint: number = 1000): boolean {
  const { width } = useWindowSize()
  return width !== undefined && width >= breakpoint
}

// Estados del sidebar basados en breakpoints
export type SidebarState = 'expanded' | 'collapsed' | 'hidden'

export function useSidebarState(): SidebarState {
  const { width } = useWindowSize()
  
  if (width === undefined) return 'hidden'
  
  // >= 1200px: Expandido (iconos + texto)
  if (width >= 1200) return 'expanded'
  
  // 900px - 1199px: Contraído (solo iconos)  
  if (width >= 900) return 'collapsed'
  
  // < 900px: Oculto
  return 'hidden'
}
