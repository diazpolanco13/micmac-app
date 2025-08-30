'use client'

import { clsx } from 'clsx'
import { 
  ArrowPathIcon,
  SparklesIcon 
} from '@heroicons/react/24/outline'

interface PageLoadingProps {
  title?: string
  subtitle?: string
  className?: string
}

/**
 * Loading state para páginas completas
 */
export function PageLoading({ 
  title = "Cargando...", 
  subtitle = "Un momento por favor",
  className 
}: PageLoadingProps) {
  return (
    <div className={clsx(
      "flex flex-col items-center justify-center min-h-[400px] space-y-6",
      className
    )}>
      <div className="relative">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
          <ArrowPathIcon className="h-8 w-8 text-white animate-spin" />
        </div>
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-ping opacity-20"></div>
      </div>
      
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-gray-400 text-sm">{subtitle}</p>
      </div>
      
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"></div>
      </div>
    </div>
  )
}

/**
 * Loading state compacto para sidebar con animaciones suaves
 */
export function NavigationLoading({ route }: { route: string }) {
  const getRouteTitle = (route: string) => {
    const routeMap: Record<string, string> = {
      '/dashboard': 'Dashboard',
      '/profile': 'Mi Perfil',
      '/projects': 'Proyectos',
      '/experts': 'Expertos',
      '/calendar': 'Calendario',
      '/results': 'Resultados',
      '/en-desarrollo': 'En Desarrollo',
      '/analysis/micmac': 'Análisis MIC MAC',
      '/': 'Autenticación'
    }
    return routeMap[route] || 'Cargando página'
  }

  // Para transiciones de auth, usar un loading más elegante
  if (route === '/dashboard' || route === '/') {
    return <AuthTransitionLoading route={route} />
  }

  return (
    <div 
      className="bg-gray-800 border-2 border-blue-500 rounded-xl p-4 shadow-2xl transform transition-all duration-300 pointer-events-none"
      style={{
        backgroundColor: 'rgba(31, 41, 55, 0.95)',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 15px rgba(59, 130, 246, 0.3)'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl"></div>
      <div className="relative flex items-center space-x-3">
        <div className="relative">
          <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse-glow"></div>
          <SparklesIcon className="absolute inset-0 h-5 w-5 text-white animate-spin-slow" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-ping opacity-20"></div>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-white animate-fade-in-delayed">
            Cargando {getRouteTitle(route)}
          </p>
          <div className="w-32 h-1.5 bg-gray-700/50 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full animate-loading-bar-smooth shadow-sm"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Loading elegante para transiciones de autenticación
 */
export function AuthTransitionLoading({ route }: { route: string }) {
  const getAuthMessage = (route: string) => {
    const messages = {
      '/dashboard': {
        title: 'Accediendo a la plataforma',
        subtitle: 'Configurando tu espacio de trabajo...',
        icon: '🚀'
      },
      '/': {
        title: 'Cerrando sesión',
        subtitle: 'Hasta pronto...',
        icon: '👋'
      } as const
    }
    return (messages as Record<string, { title: string; subtitle: string; icon: string }>)[route] || {
      title: 'Cargando',
      subtitle: 'Un momento...',
      icon: '⏳'
    }
  }

  const message = getAuthMessage(route)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Efectos de fondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-purple-900/10"></div>
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="relative z-10 text-center">
        {/* Icono principal */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-2xl animate-bounce">
          <span className="text-3xl">{message.icon}</span>
        </div>
        
        {/* Título */}
        <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
          {message.title}
        </h2>
        
        {/* Subtítulo */}
        <p className="text-gray-400 text-lg mb-8 animate-pulse">
          {message.subtitle}
        </p>
        
        {/* Barra de progreso elegante */}
        <div className="w-64 h-2 bg-gray-700 rounded-full mx-auto overflow-hidden mb-6">
          <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-full animate-loading-bar-smooth shadow-lg"></div>
        </div>
        
        {/* Puntos de carga */}
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  )
}

/**
 * Skeleton para tarjetas
 */
export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div 
          key={index}
          className="bg-gray-800 rounded-lg p-6 border border-gray-700 animate-pulse"
        >
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              <div className="h-3 bg-gray-700 rounded w-1/2"></div>
              <div className="flex space-x-2">
                <div className="h-6 bg-gray-700 rounded w-16"></div>
                <div className="h-6 bg-gray-700 rounded w-12"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Skeleton para tabla/lista
 */
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700">
      <div className="p-6 border-b border-gray-700">
        <div className="h-6 bg-gray-700 rounded w-1/4 animate-pulse"></div>
      </div>
      <div className="divide-y divide-gray-700">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="p-6 animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
              </div>
              <div className="flex space-x-2">
                <div className="w-20 h-8 bg-gray-700 rounded"></div>
                <div className="w-8 h-8 bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Skeleton para dashboard con métricas
 */
export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-8 bg-gray-700 rounded w-1/3"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
      </div>
      
      {/* Métricas skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-700 rounded w-20"></div>
            </div>
            <div className="h-8 bg-gray-700 rounded w-16 mb-2"></div>
            <div className="h-3 bg-gray-700 rounded w-24"></div>
          </div>
        ))}
      </div>
      
      {/* Contenido principal skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CardSkeleton count={2} />
        <div className="space-y-4">
          <div className="h-6 bg-gray-700 rounded w-1/3"></div>
          <TableSkeleton rows={3} />
        </div>
      </div>
    </div>
  )
}

/**
 * Skeleton para página de proyectos
 */
export function ProjectsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 bg-gray-700 rounded w-48"></div>
          <div className="h-4 bg-gray-700 rounded w-64"></div>
        </div>
        <div className="w-32 h-10 bg-gray-700 rounded"></div>
      </div>
      
      {/* Filtros */}
      <div className="flex space-x-4">
        <div className="w-48 h-10 bg-gray-700 rounded"></div>
        <div className="w-32 h-10 bg-gray-700 rounded"></div>
        <div className="w-32 h-10 bg-gray-700 rounded"></div>
      </div>
      
      {/* Grid de proyectos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="h-5 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                </div>
                <div className="w-16 h-6 bg-gray-700 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-700 rounded w-full"></div>
                <div className="h-3 bg-gray-700 rounded w-2/3"></div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <div className="w-6 h-6 bg-gray-700 rounded-full"></div>
                  <div className="w-6 h-6 bg-gray-700 rounded-full"></div>
                </div>
                <div className="w-20 h-8 bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
