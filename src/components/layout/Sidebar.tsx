'use client'

import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import {
  CalendarIcon,
  ChartPieIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  UserIcon,
  CogIcon,
  BeakerIcon,
  ChartBarIcon,
  PresentationChartLineIcon
} from '@heroicons/react/24/outline'
import { useMockAuth } from '@/contexts/MockAuthContext'
import { useState, useEffect } from 'react'

function classNames(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const { user, signOut } = useMockAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!user || !mounted) return null

  // Navegación específica por rol
  const moderatorNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, current: true },
    { name: 'Mi Perfil', href: '/profile', icon: UserIcon, current: false },
    {
      name: 'Proyectos',
      icon: FolderIcon,
      current: false,
      children: [
        { name: 'Todos los Proyectos', href: '/projects', current: false },
        { name: 'Crear Proyecto', href: '/projects/new', current: false },
        { name: 'Plantillas', href: '/projects/templates', current: false },
        { name: 'Archivados', href: '/projects/archived', current: false },
      ],
    },
    {
      name: 'Expertos',
      icon: UsersIcon,
      current: false,
      children: [
        { name: 'Gestionar Expertos', href: '/experts', current: false },
        { name: 'Invitar Expertos', href: '/experts/invite', current: false },
        { name: 'Rendimiento', href: '/experts/performance', current: false },
      ],
    },
    {
      name: 'Análisis',
      icon: BeakerIcon,
      current: false,
      children: [
        { name: 'MIC MAC', href: '/analysis/micmac', current: false },
        { name: 'Matrices', href: '/analysis/matrices', current: false },
        { name: 'Variables', href: '/analysis/variables', current: false },
      ],
    },
    { name: 'Resultados', href: '/results', icon: ChartBarIcon, current: false },
    { name: 'Reportes', href: '/reports', icon: ChartPieIcon, current: false },
    { name: 'Calendario', href: '/calendar', icon: CalendarIcon, current: false },
    { name: 'Documentos', href: '/documents', icon: DocumentDuplicateIcon, current: false },
    { name: 'Configuración', href: '/settings', icon: CogIcon, current: false },
  ]

  const expertNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, current: true },
    { name: 'Mi Perfil', href: '/profile', icon: UserIcon, current: false },
    { name: 'Mis Proyectos', href: '/my-projects', icon: FolderIcon, current: false },
    {
      name: 'Participación',
      icon: PresentationChartLineIcon,
      current: false,
      children: [
        { name: 'Votaciones Pendientes', href: '/voting/pending', current: false },
        { name: 'Historial', href: '/voting/history', current: false },
        { name: 'Mis Análisis', href: '/voting/my-analysis', current: false },
      ],
    },
    { name: 'Resultados', href: '/results', icon: ChartBarIcon, current: false },
    { name: 'Calendario', href: '/calendar', icon: CalendarIcon, current: false },
    { name: 'Documentos', href: '/documents', icon: DocumentDuplicateIcon, current: false },
  ]

  const navigation = user.role === 'MODERATOR' ? moderatorNavigation : expertNavigation

  return (
    <>
      {/* Mobile backdrop */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 z-40 bg-gray-900/50 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={classNames(
        'fixed left-0 z-40 flex flex-col transition-all duration-300 ease-in-out',
        'lg:static lg:h-full',
        // Mobile: full height from top, Desktop: from top-0 (navbar is separate)
        'top-16 bottom-0 lg:top-0',
        isCollapsed 
          ? 'w-16 lg:w-16' 
          : 'w-64 lg:w-64',
        // Mobile: slide from left
        'transform lg:transform-none',
        isCollapsed 
          ? '-translate-x-full lg:translate-x-0'
          : 'translate-x-0'
      )}>
        
        {/* Sidebar content */}
        <div className="relative flex flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 h-full">
          
          {/* Logo - solo visible en móvil cuando el sidebar está expandido */}
          <div className={classNames(
            "relative flex h-16 shrink-0 items-center px-6 border-b border-gray-200 dark:border-gray-700 lg:hidden",
            isCollapsed ? "hidden" : "flex"
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
                {navigation.map((item) => (
                  <li key={item.name}>
                    {!item.children ? (
                      <a
                        href={item.href}
                        title={isCollapsed ? item.name : undefined}
                        className={classNames(
                          item.current 
                            ? 'bg-micmac-primary-50 dark:bg-micmac-primary-500/20 text-micmac-primary-700 dark:text-micmac-primary-300' 
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800',
                          'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold transition-colors',
                          isCollapsed ? 'justify-center' : ''
                        )}
                      >
                        <item.icon 
                          aria-hidden="true" 
                          className={classNames(
                            'size-6 shrink-0',
                            item.current 
                              ? 'text-micmac-primary-600 dark:text-micmac-primary-400' 
                              : 'text-gray-400 dark:text-gray-500'
                          )} 
                        />
                        {!isCollapsed && item.name}
                      </a>
                    ) : (
                      <Disclosure as="div">
                        <DisclosureButton
                          title={isCollapsed ? item.name : undefined}
                          className={classNames(
                            item.current 
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
                              item.current 
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
                            {item.children.map((subItem) => (
                              <li key={subItem.name}>
                                <DisclosureButton
                                  as="a"
                                  href={subItem.href}
                                  className={classNames(
                                    subItem.current 
                                      ? 'bg-micmac-primary-50 dark:bg-micmac-primary-500/20 text-micmac-primary-700 dark:text-micmac-primary-300' 
                                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800',
                                    'block rounded-md py-2 pl-9 pr-2 text-sm/6 transition-colors'
                                  )}
                                >
                                  {subItem.name}
                                </DisclosureButton>
                              </li>
                            ))}
                          </DisclosurePanel>
                        )}
                      </Disclosure>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* User section */}
            <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700">
              <div className={classNames(
                'flex items-center text-sm/6 font-semibold text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors',
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
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {user.name || user.email.split('@')[0]}
                    </span>
                    <span className="text-xs text-micmac-primary-500 dark:text-micmac-primary-400">
                      {user.role === 'MODERATOR' ? '👨‍💼 Moderador' : '👨‍🔬 Experto'}
                    </span>
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
