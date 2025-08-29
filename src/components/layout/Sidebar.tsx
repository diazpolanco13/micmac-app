'use client'

import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import {
  CalendarIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  UserIcon,
  BeakerIcon,
  ChartBarIcon,
  PresentationChartLineIcon
} from '@heroicons/react/24/outline'
import { useMockAuth } from '@/contexts/MockAuthContext'
import { useMockData } from '@/contexts/MockDataContext'
import { useState, useEffect } from 'react'
import { useSidebarState, type SidebarState } from '@/hooks/useWindowSize'
import { useActiveRoute, type NavigationItem } from '@/hooks/useActiveRoute'
import { useRouter } from 'next/navigation'
import { useNavigationLoading } from '@/contexts/NavigationLoadingContext'

function classNames(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}

interface SidebarProps {
  state: SidebarState
  onToggle: () => void
}

export default function Sidebar({ state, onToggle }: SidebarProps) {
  const { user, signOut } = useMockAuth()
  const { projects } = useMockData()
  const [mounted, setMounted] = useState(false)
  const responsiveState = useSidebarState()
  const { activeParent, activeChild, isActive, isParentActive } = useActiveRoute()
  const { startLoading } = useNavigationLoading()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!user || !mounted || state === 'hidden') return null

  // Determinar si está colapsado (solo iconos)
  const isCollapsed = state === 'collapsed'
  const isExpanded = state === 'expanded'

  // Función para manejar navegación con redirecciones inteligentes
  const handleNavigation = (href: string, itemName: string) => {
    let finalRoute = href
    
    // Redirecciones especiales
    if (href === '/projects/new') {
      // Crear proyecto abre modal, redirigir a projects
      finalRoute = '/projects'
    } else {
      // Rutas que van a "En Desarrollo"
      const enDesarrolloRoutes = [
        '/projects/templates',
        '/projects/archived', 
        '/experts/invite',
        '/experts/performance',
        '/analysis/matrices',
        '/analysis/variables',
        '/reports',
        '/documents',
        '/settings',
        '/my-projects',
        '/voting/pending',
        '/voting/history',
        '/voting/my-analysis'
      ]
      
      if (enDesarrolloRoutes.includes(href)) {
        finalRoute = '/en-desarrollo'
      } else if (href === '/analysis/micmac') {
        // Redirección inteligente para análisis MIC MAC
        // Si hay un proyecto activo, ir directamente a su votación
        const activeProject = projects?.find(p => p.status === 'ACTIVE')
        if (activeProject) {
          finalRoute = `/projects/${activeProject.id}/vote`
        } else {
          finalRoute = '/projects'
        }
      }
    }
    
    // Iniciar loading y navegar
    startLoading(finalRoute)
    router.push(finalRoute)
  }

  // Navegación específica por rol - SIMPLIFICADA
  const moderatorNavigation: NavigationItem[] = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: HomeIcon
    },
    { 
      name: 'Mi Perfil', 
      href: '/profile', 
      icon: UserIcon
    },
    {
      name: 'Proyectos',
      icon: FolderIcon,
      children: [
        { name: 'Todos los Proyectos', href: '/projects', icon: FolderIcon },
        { name: 'Crear Proyecto', href: '/projects/create', icon: FolderIcon },
        { name: 'Plantillas', href: '/projects/templates', icon: FolderIcon },
        { name: 'Archivados', href: '/projects/archived', icon: FolderIcon },
      ],
    },
    { 
      name: 'Expertos', 
      href: '/experts', 
      icon: UsersIcon
    },
    { 
      name: 'Calendario', 
      href: '/calendar', 
      icon: CalendarIcon
    },
    { 
      name: 'Análisis MIC MAC', 
      href: '/analysis/micmac', 
      icon: BeakerIcon
    },
    { 
      name: 'Resultados', 
      href: '/results', 
      icon: ChartBarIcon
    },
  ]

  const expertNavigation: NavigationItem[] = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: HomeIcon
    },
    { 
      name: 'Mi Perfil', 
      href: '/profile', 
      icon: UserIcon
    },
    { 
      name: 'Calendario', 
      href: '/calendar', 
      icon: CalendarIcon
    },
    {
      name: 'Votaciones',
      icon: PresentationChartLineIcon,
      children: [
        { name: 'Pendientes', href: '/voting/pending', icon: PresentationChartLineIcon },
        { name: 'Historial', href: '/voting/history', icon: PresentationChartLineIcon },
      ],
    },
  ]

  const navigation = user.role === 'MODERATOR' ? moderatorNavigation : expertNavigation

  return (
    <>
      {/* Mobile backdrop - solo cuando está expandido en móvil */}
      {isExpanded && responsiveState === 'hidden' && (
        <div 
          className="fixed inset-0 z-[60] bg-gray-900/50"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={classNames(
        'flex flex-col transition-all duration-300 ease-in-out',
        // Positioning basado en el estado responsivo
        responsiveState === 'hidden' 
          ? 'fixed left-0 z-[60] top-16 bottom-0' // Móvil: fixed overlay con z-index más alto que navbar (z-50)
          : 'static h-full', // Tablet/Desktop: static
        // Width basado en el estado actual
        isCollapsed ? 'w-16' : 'w-64',
        // Transform para móvil cuando está expandido sobre el contenido
        responsiveState === 'hidden' 
          ? (isExpanded ? 'translate-x-0' : '-translate-x-full transform')
          : 'transform-none'
      )}>
        
        {/* Sidebar content */}
        <div className="relative flex flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 h-full">
          
          {/* Logo - solo visible en móvil cuando el sidebar está expandido */}
          <div className={classNames(
            "relative flex h-16 shrink-0 items-center border-b border-gray-200 dark:border-gray-700",
            responsiveState === 'hidden' ? "flex" : "hidden", // Solo en móvil
            isCollapsed ? "hidden px-2" : "flex px-6"
          )}>
            {isCollapsed ? (
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-micmac-primary-500 to-micmac-secondary-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">MM</span>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-micmac-primary-500 to-micmac-secondary-500 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">MM</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold">
                    <span className="text-micmac-primary-500 dark:text-micmac-primary-400">MIC MAC</span>
                    <span className="text-micmac-secondary-500 dark:text-micmac-secondary-400 ml-1">Pro</span>
                  </h1>
                </div>
              </div>
            )}
          </div>
          
          {/* Navigation */}
          <nav className="flex flex-1 flex-col overflow-hidden">
            <div className={classNames(
              "flex-1 py-6 overflow-y-auto",
              isCollapsed ? "px-2" : "px-6"
            )}>
              <ul role="list" className="space-y-1">
                {navigation.map((item) => {
                  const itemIsActive = item.href ? isActive(item.href) : isParentActive(item)
                  
                  return (
                    <li key={item.name}>
                      {!item.children ? (
                        <button
                          onClick={() => item.href && handleNavigation(item.href, item.name)}
                          title={isCollapsed ? item.name : undefined}
                          className={classNames(
                            itemIsActive 
                              ? 'bg-micmac-primary-50 dark:bg-micmac-primary-500/20 text-micmac-primary-700 dark:text-micmac-primary-300' 
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800',
                            'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold transition-colors w-full text-left',
                            isCollapsed ? 'justify-center' : ''
                          )}
                        >
                          <item.icon 
                            aria-hidden="true" 
                            className={classNames(
                              'size-6 shrink-0',
                              itemIsActive 
                                ? 'text-micmac-primary-600 dark:text-micmac-primary-400' 
                                : 'text-gray-400 dark:text-gray-500'
                            )} 
                          />
                          {!isCollapsed && item.name}
                        </button>
                      ) : (
                        <Disclosure as="div" defaultOpen={isParentActive(item)}>
                          <DisclosureButton
                            title={isCollapsed ? item.name : undefined}
                            className={classNames(
                              itemIsActive 
                                ? 'bg-micmac-primary-50 dark:bg-micmac-primary-500/20 text-micmac-primary-700 dark:text-micmac-primary-300' 
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800',
                              'group flex w-full items-center gap-x-3 rounded-md p-2 text-left text-sm/6 font-semibold transition-colors',
                              isCollapsed ? 'justify-center' : ''
                            )}
                          >
                            <item.icon 
                              aria-hidden="true" 
                              className={classNames(
                                'size-6 shrink-0',
                                itemIsActive 
                                  ? 'text-micmac-primary-600 dark:text-micmac-primary-400' 
                                  : 'text-gray-400 dark:text-gray-500'
                              )} 
                            />
                            {!isCollapsed && (
                              <>
                                {item.name}
                                <ChevronRightIcon
                                  aria-hidden="true"
                                  className="ml-auto size-5 shrink-0 text-gray-400 dark:text-gray-500 group-data-[open]:rotate-90 group-data-[open]:text-gray-500 dark:group-data-[open]:text-gray-400 transition-transform"
                                />
                              </>
                            )}
                          </DisclosureButton>
                          
                          {!isCollapsed && (
                            <DisclosurePanel as="ul" className="mt-1 px-2">
                              {item.children.map((subItem) => {
                                const subItemIsActive = subItem.href ? isActive(subItem.href) : false
                                
                                return (
                                  <li key={subItem.name}>
                                    <button
                                      onClick={() => subItem.href && handleNavigation(subItem.href, subItem.name)}
                                      className={classNames(
                                        subItemIsActive 
                                          ? 'bg-micmac-primary-50 dark:bg-micmac-primary-500/20 text-micmac-primary-700 dark:text-micmac-primary-300' 
                                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800',
                                        'block rounded-md py-2 pl-9 pr-2 text-sm/6 transition-colors w-full text-left'
                                      )}
                                    >
                                      {subItem.name}
                                    </button>
                                  </li>
                                )
                              })}
                            </DisclosurePanel>
                          )}
                        </Disclosure>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
            
            {/* User section */}
            <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700">
              <div className={classNames(
                'flex items-center text-sm/6 font-semibold text-gray-900 dark:text-gray-100 transition-colors',
                isCollapsed 
                  ? 'justify-center px-2 py-4' 
                  : 'gap-x-4 px-6 py-4'
              )}>
                <div className="size-8 rounded-full bg-gradient-to-br from-micmac-primary-500 to-micmac-secondary-500 flex items-center justify-center outline outline-1 -outline-offset-1 outline-black/5 dark:outline-white/10">
                  <span className="text-white font-semibold text-sm">
                    {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                  </span>
                </div>
                {!isCollapsed && (
                  <div className="flex-1 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {user.name || user.email.split('@')[0]}
                      </span>
                      <span className="text-xs text-micmac-primary-500 dark:text-micmac-primary-400">
                        {user.role === 'MODERATOR' ? '👨‍💼 Moderador' : '👨‍🔬 Experto'}
                      </span>
                    </div>
                    <button
                      onClick={async () => {
                        startLoading('/auth')
                        await signOut()
                        router.push('/auth')
                      }}
                      className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                      title="Cerrar sesión"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </nav>
        </div>
      </div>
    </>
  )
}
