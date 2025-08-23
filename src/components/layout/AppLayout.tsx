'use client'

import { useState, useEffect } from 'react'

import Navbar from './Navbar'
import Sidebar from './Sidebar'

interface AppLayoutProps {
  children: React.ReactNode
  onNewProject?: () => void
}

export default function AppLayout({ children, onNewProject }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Recuperar estado del sidebar desde localStorage
    const saved = localStorage.getItem('micmac-sidebar-collapsed')
    if (saved) {
      setSidebarCollapsed(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      // Guardar estado del sidebar
      localStorage.setItem('micmac-sidebar-collapsed', JSON.stringify(sidebarCollapsed))
    }
  }, [sidebarCollapsed, mounted])

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-micmac-dark flex items-center justify-center">
        <div className="animate-pulse-slow rounded-full h-12 w-12 bg-micmac-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-micmac-dark">
      {/* Clean Navbar */}
      <Navbar 
        onNewProject={onNewProject} 
        onToggleSidebar={toggleSidebar}
        sidebarCollapsed={sidebarCollapsed}
      />

      <div className="flex h-screen lg:pt-16">
        {/* Sidebar */}
        <Sidebar 
          isCollapsed={sidebarCollapsed} 
          onToggle={toggleSidebar}
        />
        
        {/* Main content */}
        <div className="flex-1 min-w-0 overflow-auto">
          <main className="h-full">
            {/* Page content */}
            <div className="px-4 py-8 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
