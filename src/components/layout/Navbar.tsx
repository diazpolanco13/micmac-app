'use client'

import { Menu, MenuButton, MenuItem, MenuItems, Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useMockAuth } from '@/contexts/MockAuthContext'

function classNames(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}

interface NavbarProps {
  onNewProject?: () => void
  onToggleSidebar?: () => void
  sidebarCollapsed?: boolean
}

export default function Navbar({ onNewProject, onToggleSidebar }: NavbarProps) {
  const { user, signOut } = useMockAuth()

  const userNavigation = [
    { name: 'Tu Perfil', href: '/profile' },
    { name: 'Configuración', href: '/settings' },
    { name: 'Cerrar Sesión', href: '#', action: signOut },
  ]

  if (!user) return null

  return (
    <>
      {/* Fixed Navbar with Search */}
      <Popover
        as="header"
        className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 data-[open]:fixed data-[open]:inset-0 data-[open]:z-40 data-[open]:overflow-y-auto lg:overflow-y-visible data-[open]:lg:overflow-y-visible"
      >
        <div className="mx-auto max-w-7xl">
          <div className="relative flex justify-between lg:gap-8 xl:grid xl:grid-cols-12 h-16">
            
            {/* Logo + Sidebar Toggle */}
            <div className="flex items-center md:absolute md:inset-y-0 md:left-0 lg:static xl:col-span-3">
              {/* Desktop Sidebar Toggle - alineado con iconos del sidebar */}
              <button
                onClick={onToggleSidebar}
                className="hidden lg:flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                style={{ marginLeft: '24px' }}
              >
                <Bars3Icon className="h-5 w-5" />
              </button>
              
              {/* Logo */}
              <div className="flex items-center space-x-3 min-w-0 ml-4 px-4 sm:px-6 lg:px-0">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-micmac-primary-500 to-micmac-secondary-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">MM</span>
                </div>
                <div className="hidden md:block">
                  <h1 className="text-xl font-bold whitespace-nowrap">
                    <span className="text-micmac-primary-500 dark:text-micmac-primary-400">MIC MAC</span>
                    <span className="text-micmac-secondary-500 dark:text-micmac-secondary-400 ml-1">Pro</span>
                  </h1>
                </div>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="min-w-0 flex-1 md:px-8 lg:px-0 xl:col-span-5">
              <div className="flex items-center px-6 py-3.5 md:mx-auto md:max-w-3xl lg:mx-0 lg:max-w-none xl:px-0">
                <div className="grid w-full grid-cols-1">
                  <input
                    name="search"
                    placeholder="Buscar proyectos, expertos, análisis..."
                    className="col-start-1 row-start-1 block w-full rounded-md bg-white dark:bg-gray-800 py-1.5 pl-10 pr-3 text-gray-900 dark:text-gray-100 outline outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-micmac-primary-500 sm:text-sm/6"
                  />
                  <MagnifyingGlassIcon
                    aria-hidden="true"
                    className="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-gray-400 dark:text-gray-500"
                  />
                </div>
              </div>
            </div>
            
            {/* Mobile menu button */}
            <div className="flex items-center lg:hidden">
              <PopoverButton className="group relative inline-flex items-center justify-center rounded-lg p-2 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline focus:outline-2 focus:-outline-offset-1 focus:outline-micmac-primary-500 transition-colors">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Abrir menú</span>
                <Bars3Icon aria-hidden="true" className="block size-5 group-data-[open]:hidden" />
                <XMarkIcon aria-hidden="true" className="hidden size-5 group-data-[open]:block" />
              </PopoverButton>
            </div>
            
            {/* Desktop Actions */}
            <div className="hidden lg:flex lg:items-center lg:justify-end xl:col-span-4">
              
              {/* Notifications */}
              <button
                type="button"
                className="relative ml-5 shrink-0 rounded-full p-1 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-micmac-primary-500"
              >
                <span className="absolute -inset-1.5" />
                <span className="sr-only">Ver notificaciones</span>
                <BellIcon aria-hidden="true" className="size-6" />
              </button>

              {/* Profile dropdown */}
              <Menu as="div" className="relative ml-5 shrink-0">
                <MenuButton className="relative flex rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-micmac-primary-500">
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Abrir menú de usuario</span>
                  <div className="size-8 rounded-full bg-gradient-to-br from-micmac-primary-500 to-micmac-secondary-500 flex items-center justify-center outline outline-1 -outline-offset-1 outline-black/5 dark:outline-white/10">
                    <span className="text-white font-semibold text-sm">
                      {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </MenuButton>

                <MenuItems
                  transition
                  className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 py-1 shadow-lg outline outline-1 outline-black/5 dark:outline-white/10 transition data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  {/* User Info Header */}
                  <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.name || user.email.split('@')[0]}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user.email}
                    </p>
                    <p className="text-xs text-micmac-primary-500 dark:text-micmac-primary-400 font-medium">
                      {user.role === 'MODERATOR' ? '👨‍💼 Moderador' : '👨‍🔬 Experto'}
                    </p>
                  </div>
                  
                  {userNavigation.map((item) => (
                    <MenuItem key={item.name}>
                      <a
                        href={item.href}
                        onClick={item.action ? (e: React.MouseEvent) => { e.preventDefault(); item.action!() } : undefined}
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 data-[focus]:bg-gray-100 dark:data-[focus]:bg-gray-700 data-[focus]:outline-none"
                      >
                        {item.name}
                      </a>
                    </MenuItem>
                  ))}
                </MenuItems>
              </Menu>

              {/* New Project Button - Solo para Moderadores */}
              {user.role === 'MODERATOR' && (
                <button
                  onClick={onNewProject}
                  className="ml-6 inline-flex items-center rounded-md bg-micmac-primary-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-micmac-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-micmac-primary-500 transition-colors"
                >
                  Nuevo Proyecto
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Panel */}
        <PopoverPanel
          as="nav"
          aria-label="Global"
          className="lg:hidden absolute left-1/2 z-50 mt-2 w-full -translate-x-1/2"
        >
          <div className="relative mx-auto max-w-3xl bg-white dark:bg-gray-900 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
            
            {/* Mobile User Section */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-3 pt-4">
              <div className="mx-auto flex max-w-3xl items-center px-4 sm:px-6">
                <div className="shrink-0">
                  <div className="size-10 rounded-full bg-gradient-to-br from-micmac-primary-500 to-micmac-secondary-500 flex items-center justify-center outline outline-1 -outline-offset-1 outline-black/5 dark:outline-white/10">
                    <span className="text-white font-semibold">
                      {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800 dark:text-gray-200">
                    {user.name || user.email.split('@')[0]}
                  </div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {user.email}
                  </div>
                  <div className="text-xs text-micmac-primary-500 dark:text-micmac-primary-400 font-medium">
                    {user.role === 'MODERATOR' ? '👨‍💼 Moderador' : '👨‍🔬 Experto'}
                  </div>
                </div>
                <button
                  type="button"
                  className="relative ml-auto shrink-0 rounded-full p-1 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-micmac-primary-500"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Ver notificaciones</span>
                  <BellIcon aria-hidden="true" className="size-6" />
                </button>
              </div>
              
              {/* Mobile Actions */}
              <div className="mx-auto mt-3 max-w-3xl px-4 sm:px-6">
                {user.role === 'MODERATOR' && (
                  <button
                    onClick={onNewProject}
                    className="w-full inline-flex justify-center items-center rounded-md bg-micmac-primary-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-micmac-primary-600 mb-3"
                  >
                    Nuevo Proyecto
                  </button>
                )}
                
                {/* Mobile Sidebar Toggle */}
                <button
                  onClick={onToggleSidebar}
                  className="w-full inline-flex justify-center items-center rounded-md bg-gray-100 dark:bg-gray-800 px-3 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <Bars3Icon className="h-5 w-5 mr-2" />
                  Abrir Navegación
                </button>
              </div>
              
              {/* Mobile User Navigation */}
              <div className="mx-auto mt-3 max-w-3xl space-y-1 px-2 sm:px-4">
                {userNavigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={item.action ? (e: React.MouseEvent) => { e.preventDefault(); item.action!() } : undefined}
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </PopoverPanel>
      </Popover>
    </>
  )
}
