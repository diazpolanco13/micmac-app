'use client'

import { Menu, MenuButton, MenuItem, MenuItems, Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useMockAuth } from '@/contexts/MockAuthContext'

function classNames(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}

import type { SidebarState } from '@/hooks/useWindowSize'

interface NavbarProps {
  onNewProject?: () => void
  onToggleSidebar?: () => void
  sidebarState?: SidebarState
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
      {/* Fixed Navbar */}
      <Popover
        as="header"
        className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700"
      >
        <div className="h-16 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-full">
            
            {/* Left Section: Sidebar Toggle + Logo */}
            <div className="flex items-center space-x-4">
              {/* Desktop Sidebar Toggle */}
              <button
                onClick={onToggleSidebar}
                className="hidden lg:flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <Bars3Icon className="h-5 w-5" />
              </button>
              
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-micmac-primary-500 to-micmac-secondary-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">MM</span>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold whitespace-nowrap">
                    <span className="text-micmac-primary-500 dark:text-micmac-primary-400">MIC MAC</span>
                    <span className="text-micmac-secondary-500 dark:text-micmac-secondary-400 ml-1">Pro</span>
                  </h1>
                </div>
              </div>
            </div>
            
            {/* Right Section: Actions */}
            <div className="flex items-center space-x-4">
              
              {/* Desktop Actions */}
              <div className="hidden lg:flex items-center space-x-4">
                {/* New Project Button - Solo para Moderadores */}
                {user.role === 'MODERATOR' && (
                  <button
                    onClick={onNewProject}
                    className="inline-flex items-center rounded-md bg-micmac-primary-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-micmac-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-micmac-primary-500 transition-colors"
                  >
                    Nuevo Proyecto
                  </button>
                )}
                
                {/* Notifications */}
                <button
                  type="button"
                  className="relative rounded-full p-2 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <span className="sr-only">Ver notificaciones</span>
                  <BellIcon aria-hidden="true" className="size-6" />
                </button>

                {/* Profile dropdown */}
                <Menu as="div" className="relative">
                  <MenuButton className="relative flex rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-micmac-primary-500">
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
              </div>
              
              {/* Mobile menu button */}
              <div className="lg:hidden">
                <PopoverButton className="group relative inline-flex items-center justify-center rounded-lg p-2 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline focus:outline-2 focus:-outline-offset-1 focus:outline-micmac-primary-500 transition-colors">
                  <span className="sr-only">Abrir menú</span>
                  <Bars3Icon aria-hidden="true" className="block size-5 group-data-[open]:hidden" />
                  <XMarkIcon aria-hidden="true" className="hidden size-5 group-data-[open]:block" />
                </PopoverButton>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Panel */}
        <PopoverPanel
          as="nav"
          aria-label="Global"
          className="lg:hidden absolute left-0 right-0 z-50 mt-2 mx-4"
        >
          <div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            
            {/* Mobile User Section */}
            <div className="flex items-center space-x-3 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="size-10 rounded-full bg-gradient-to-br from-micmac-primary-500 to-micmac-secondary-500 flex items-center justify-center outline outline-1 -outline-offset-1 outline-black/5 dark:outline-white/10">
                <span className="text-white font-semibold">
                  {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-base font-medium text-gray-800 dark:text-gray-200 truncate">
                  {user.name || user.email.split('@')[0]}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {user.email}
                </div>
                <div className="text-xs text-micmac-primary-500 dark:text-micmac-primary-400 font-medium">
                  {user.role === 'MODERATOR' ? '👨‍💼 Moderador' : '👨‍🔬 Experto'}
                </div>
              </div>
              <button
                type="button"
                className="flex-shrink-0 rounded-full p-2 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <span className="sr-only">Ver notificaciones</span>
                <BellIcon aria-hidden="true" className="size-6" />
              </button>
            </div>
            
            {/* Mobile Actions */}
            <div className="pt-4 space-y-3">
              {/* New Project Button - Solo para Moderadores */}
              {user.role === 'MODERATOR' && (
                <button
                  onClick={onNewProject}
                  className="w-full inline-flex justify-center items-center rounded-md bg-micmac-primary-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-micmac-primary-600 transition-colors"
                >
                  Nuevo Proyecto
                </button>
              )}
              
              {/* Mobile Sidebar Toggle */}
              <button
                onClick={onToggleSidebar}
                className="w-full inline-flex justify-center items-center rounded-md bg-gray-100 dark:bg-gray-800 px-3 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <Bars3Icon className="h-5 w-5 mr-2" />
                Abrir Navegación
              </button>
              
              {/* Mobile User Navigation */}
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                {userNavigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={item.action ? (e: React.MouseEvent) => { e.preventDefault(); item.action!() } : undefined}
                    className="block rounded-md px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
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
