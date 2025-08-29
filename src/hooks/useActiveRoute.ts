'use client'

import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

export interface NavigationItem {
  name: string
  href?: string
  icon: any
  current?: boolean
  children?: NavigationItem[]
}

export interface ActiveRouteInfo {
  activeParent: string | null
  activeChild: string | null
  isActive: (href: string) => boolean
  isParentActive: (item: NavigationItem) => boolean
}

/**
 * Hook para detectar la ruta activa y manejar el estado del menú de navegación
 */
export function useActiveRoute(): ActiveRouteInfo {
  const pathname = usePathname()

  const routeInfo = useMemo(() => {
    // Función para verificar si una ruta específica está activa
    const isActive = (href: string): boolean => {
      if (!href) return false
      
      // Exact match para rutas principales
      if (href === pathname) return true
      
      // Para rutas dinámicas específicas
      if (href === '/projects' && pathname.startsWith('/projects/')) {
        // Solo activar /projects si estamos exactamente en /projects
        // No para subrutas como /projects/create
        return pathname === '/projects'
      }
      if (href === '/experts' && pathname.startsWith('/experts/')) {
        // Solo activar /experts si estamos exactamente en /experts
        return pathname === '/experts'
      }
      
      // Para subrutas específicas (pero no para rutas raíz)
      if (pathname.startsWith(href) && href !== '/' && href !== '/projects' && href !== '/experts') {
        return true
      }
      
      return false
    }

    // Función para verificar si un item padre está activo
    const isParentActive = (item: NavigationItem): boolean => {
      // Si el item principal está activo
      if (item.href && isActive(item.href)) return true
      
      // Si algún hijo está activo
      if (item.children) {
        return item.children.some(child => child.href && isActive(child.href))
      }
      
      return false
    }

    // Determinar el padre activo
    let activeParent: string | null = null
    let activeChild: string | null = null

    // Mapeo de rutas a padres
    const routeParentMap: Record<string, string> = {
      '/dashboard': 'Dashboard',
      '/profile': 'Mi Perfil',
      '/projects': 'Proyectos',
      '/projects/create': 'Proyectos',
      '/projects/new': 'Proyectos',
      '/projects/templates': 'Proyectos', 
      '/projects/archived': 'Proyectos',
      '/experts': 'Expertos',
      '/experts/invite': 'Expertos',
      '/experts/performance': 'Expertos',
      '/analysis/micmac': 'Análisis',
      '/analysis/matrices': 'Análisis',
      '/analysis/variables': 'Análisis',
      '/results': 'Resultados',
      '/reports': 'Reportes',
      '/calendar': 'Calendario',
      '/documents': 'Documentos',
      '/settings': 'Configuración',
      '/my-projects': 'Mis Proyectos',
      '/voting/pending': 'Participación',
      '/voting/history': 'Participación',
      '/voting/my-analysis': 'Participación',
      '/en-desarrollo': null, // Página especial sin padre
    }

    // Actualizar el mapeo de rutas dinámicas
    if (pathname.startsWith('/projects/') && pathname !== '/projects') {
      activeParent = 'Proyectos'
      
      // Detectar subrutas específicas
      if (pathname.includes('/vote')) {
        activeChild = 'Votación MIC MAC'
      } else if (pathname.includes('/results')) {
        activeChild = 'Resultados MIC MAC'
      } else if (pathname === '/projects/create' || pathname.startsWith('/projects/create?')) {
        activeChild = 'Crear Proyecto'
      } else {
        activeChild = 'Todos los Proyectos'
      }
    } else if (pathname.startsWith('/experts/') && pathname !== '/experts') {
      activeParent = 'Expertos'
      activeChild = 'Gestionar Expertos'
    } else {
      // Buscar coincidencia exacta
      activeParent = routeParentMap[pathname] || null
      
      // Determinar hijo activo para rutas específicas
      switch (pathname) {
        case '/projects':
          activeChild = 'Todos los Proyectos'
          break
        case '/projects/create':
          activeChild = 'Crear Proyecto'
          break
        case '/projects/new':
          activeChild = 'Crear Proyecto'
          break
        case '/projects/templates':
          activeChild = 'Plantillas'
          break
        case '/projects/archived':
          activeChild = 'Archivados'
          break
        case '/experts':
          activeChild = 'Gestionar Expertos'
          break
        case '/experts/invite':
          activeChild = 'Invitar Expertos'
          break
        case '/experts/performance':
          activeChild = 'Rendimiento'
          break
        case '/analysis/micmac':
          activeChild = 'MIC MAC'
          break
        case '/analysis/matrices':
          activeChild = 'Matrices'
          break
        case '/analysis/variables':
          activeChild = 'Variables'
          break
        case '/voting/pending':
          activeChild = 'Votaciones Pendientes'
          break
        case '/voting/history':
          activeChild = 'Historial'
          break
        case '/voting/my-analysis':
          activeChild = 'Mis Análisis'
          break
        default:
          activeChild = null
      }
    }

    return {
      activeParent,
      activeChild,
      isActive,
      isParentActive
    }
  }, [pathname])

  return routeInfo
}

/**
 * Hook simplificado para verificar si una ruta específica está activa
 */
export function useIsRouteActive(href: string): boolean {
  const { isActive } = useActiveRoute()
  return isActive(href)
}

/**
 * Función utilitaria para aplicar clases CSS basadas en estado activo
 */
export function getActiveClasses(
  isActive: boolean,
  activeClasses: string = 'bg-gray-900 text-white',
  inactiveClasses: string = 'text-gray-300 hover:bg-gray-700 hover:text-white'
): string {
  return isActive ? activeClasses : inactiveClasses
}
