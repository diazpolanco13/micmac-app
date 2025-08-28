'use client'

import { useState, useEffect } from 'react'

import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { useSidebarState, type SidebarState } from '@/hooks/useWindowSize'

interface AppLayoutProps {
  children: React.ReactNode
  onNewProject?: () => void
}

export default function AppLayout({ children, onNewProject }: AppLayoutProps) {
  const [sidebarState, setSidebarState] = useState<SidebarState>('hidden')
  const [mounted, setMounted] = useState(false)
  const [manualOverride, setManualOverride] = useState<SidebarState | null>(null) // Override manual del usuario
  const responsiveSidebarState = useSidebarState()

  useEffect(() => {
    setMounted(true)
    // Recuperar estado del sidebar desde localStorage
    const savedState = localStorage.getItem('micmac-sidebar-state')
    const savedOverride = localStorage.getItem('micmac-sidebar-manual-override')
    
    if (savedState) {
      setSidebarState(JSON.parse(savedState))
    }
    if (savedOverride) {
      setManualOverride(JSON.parse(savedOverride))
    }
  }, [])

  // Efecto para manejar el estado automático basado en el tamaño de pantalla
  useEffect(() => {
    if (mounted && !manualOverride) {
      // Solo aplicar estado automático si no hay override manual
      setSidebarState(responsiveSidebarState)
    }
  }, [responsiveSidebarState, mounted, manualOverride])

  useEffect(() => {
    if (mounted) {
      // Guardar estado del sidebar
      localStorage.setItem('micmac-sidebar-state', JSON.stringify(sidebarState))
      localStorage.setItem('micmac-sidebar-manual-override', JSON.stringify(manualOverride))
    }
  }, [sidebarState, mounted, manualOverride])

  const toggleSidebar = () => {
    // Ciclar entre estados disponibles según el tamaño de pantalla
    let nextState: SidebarState
    
    if (responsiveSidebarState === 'hidden') {
      // En móvil, solo alternar entre hidden y expanded
      nextState = sidebarState === 'hidden' ? 'expanded' : 'hidden'
    } else if (responsiveSidebarState === 'collapsed') {
      // En tablet, alternar entre collapsed y expanded
      nextState = sidebarState === 'collapsed' ? 'expanded' : 'collapsed'
    } else {
      // En desktop, alternar entre expanded y collapsed
      nextState = sidebarState === 'expanded' ? 'collapsed' : 'expanded'
    }
    
    setSidebarState(nextState)
    setManualOverride(nextState)
    
    // Resetear el override manual después de un tiempo para permitir comportamiento automático
    setTimeout(() => {
      setManualOverride(null)
    }, 15000) // 15 segundos
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg-primary flex items-center justify-center">
        <div className="animate-pulse-slow rounded-full h-12 w-12 bg-micmac-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="h-screen overflow-hidden bg-gray-50 dark:bg-dark-bg-primary">
      {/* Fixed Navbar */}
      <Navbar 
        onNewProject={onNewProject} 
        onToggleSidebar={toggleSidebar}
        sidebarState={sidebarState}
      />

      {/* Layout container - ajustado para navbar fijo */}
      <div className="flex h-screen pt-16">
        {/* Sidebar */}
        <Sidebar 
          state={sidebarState} 
          onToggle={toggleSidebar}
        />
        
        {/* Main content area - sin margin left ya que sidebar es static en desktop */}
        <div className="flex-1 overflow-auto">
          <main className="h-full">
            <div className="p-4 sm:p-6 lg:p-8 max-w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
