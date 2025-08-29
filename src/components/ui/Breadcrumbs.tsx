'use client'

import { usePathname, useRouter } from 'next/navigation'
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/20/solid'
import { useMockData } from '@/contexts/MockDataContext'
import { useMemo } from 'react'

interface BreadcrumbItem {
  name: string
  href?: string
  icon?: React.ComponentType<any>
  current?: boolean
}

export default function Breadcrumbs() {
  const pathname = usePathname()
  const router = useRouter()
  const { projects } = useMockData()

  const breadcrumbs = useMemo(() => {
    const items: BreadcrumbItem[] = []

    // Siempre incluir Home
    items.push({
      name: 'Dashboard',
      href: '/dashboard',
      icon: HomeIcon
    })

    // Generar breadcrumbs basado en la ruta actual
    if (pathname === '/dashboard') {
      items[0].current = true
      return items
    }

    if (pathname.startsWith('/projects')) {
      items.push({
        name: 'Proyectos',
        href: '/projects'
      })

      // Para rutas dinámicas de proyectos
      const projectMatch = pathname.match(/^\/projects\/([^\/]+)/)
      if (projectMatch) {
        const projectId = projectMatch[1]
        const project = projects.find(p => p.id === projectId)
        
        if (project) {
          items.push({
            name: project.name,
            href: `/projects/${projectId}`
          })

          // Subrutas específicas
          if (pathname.includes('/vote')) {
            items.push({
              name: 'Votación MIC MAC',
              current: true
            })
          } else if (pathname.includes('/results')) {
            items.push({
              name: 'Resultados',
              current: true
            })
          } else if (pathname.includes('/setup')) {
            items.push({
              name: 'Configuración',
              current: true
            })
          } else {
            items[items.length - 1].current = true
          }
        } else {
          items.push({
            name: 'Proyecto no encontrado',
            current: true
          })
        }
      } else if (pathname === '/projects/new') {
        items.push({
          name: 'Crear Proyecto',
          current: true
        })
      } else if (pathname === '/projects') {
        items[items.length - 1].current = true
      }
    } else if (pathname.startsWith('/experts')) {
      items.push({
        name: 'Expertos',
        href: '/experts'
      })
      
      if (pathname === '/experts') {
        items[items.length - 1].current = true
      }
    } else if (pathname.startsWith('/calendar')) {
      items.push({
        name: 'Calendario',
        current: true
      })
    } else if (pathname.startsWith('/results')) {
      items.push({
        name: 'Resultados',
        current: true
      })
    } else if (pathname.startsWith('/profile')) {
      items.push({
        name: 'Mi Perfil',
        current: true
      })
    } else if (pathname.startsWith('/en-desarrollo')) {
      items.push({
        name: 'En Desarrollo',
        current: true
      })
    } else {
      // Página desconocida
      items.push({
        name: 'Página no encontrada',
        current: true
      })
    }

    return items
  }, [pathname, projects])

  const handleNavigation = (href: string) => {
    router.push(href)
  }

  return (
    <nav aria-label="Breadcrumb" className="flex mb-6">
      <ol role="list" className="flex items-center space-x-2">
        {breadcrumbs.map((item, index) => (
          <li key={item.name}>
            <div className="flex items-center">
              {index > 0 && (
                <ChevronRightIcon
                  aria-hidden="true"
                  className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2"
                />
              )}
              
              {item.current ? (
                <span className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
                  {item.icon && (
                    <item.icon
                      aria-hidden="true"
                      className="h-4 w-4 mr-1"
                    />
                  )}
                  {item.name}
                </span>
              ) : (
                <button
                  onClick={() => item.href && handleNavigation(item.href)}
                  className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-micmac-primary-600 dark:hover:text-micmac-primary-400 transition-colors"
                >
                  {item.icon && (
                    <item.icon
                      aria-hidden="true"
                      className="h-4 w-4 mr-1"
                    />
                  )}
                  {item.name}
                </button>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  )
}
