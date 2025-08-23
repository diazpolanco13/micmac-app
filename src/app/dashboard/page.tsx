'use client'

/**
 * 📊 Dashboard Page
 * Panel principal para usuarios autenticados
 */

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Se redirigirá a /auth
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                🚀 MIC MAC Pro
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user.name || user.email}
                </p>
                <p className="text-xs text-gray-500">
                  {user.role === 'MODERATOR' ? '📊 Moderador' : '🧑‍🔬 Experto'}
                </p>
              </div>
              
              <button
                onClick={signOut}
                className="px-3 py-1 text-sm text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 rounded transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Bienvenido{user.role === 'MODERATOR' ? ', Moderador' : ''}!
          </h2>
          <p className="text-gray-600">
            {user.role === 'MODERATOR' 
              ? 'Gestiona proyectos MIC MAC y coordina análisis prospectivos'
              : 'Participa en análisis prospectivos como experto en tu área'
            }
          </p>
        </div>

        {/* Role-based content */}
        {user.role === 'MODERATOR' ? (
          <ModeratorDashboard />
        ) : (
          <ExpertDashboard />
        )}

        {/* Status de Automatización */}
        <div className="mt-12 bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <h3 className="text-lg font-semibold text-green-800">
              🤖 Sistema de Automatización Activo
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-green-600">🧪</span>
              <span className="text-green-700">@CursorTesting</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">📝</span>
              <span className="text-green-700">@CursorGit</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">📊</span>
              <span className="text-green-700">@CursorLinear</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">📚</span>
              <span className="text-green-700">@CursorDocs</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function ModeratorDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Crear Proyecto */}
      <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-blue-600 text-lg">📊</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Crear Proyecto
          </h3>
        </div>
        <p className="text-gray-600 mb-4">
          Inicia un nuevo análisis prospectivo MIC MAC
        </p>
        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
          Nuevo Proyecto
        </button>
      </div>

      {/* Mis Proyectos */}
      <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <span className="text-green-600 text-lg">📋</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Mis Proyectos
          </h3>
        </div>
        <p className="text-gray-600 mb-4">
          Gestiona tus análisis en curso
        </p>
        <button className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
          Ver Proyectos
        </button>
      </div>

      {/* Expertos */}
      <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <span className="text-purple-600 text-lg">👥</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Catálogo de Expertos
          </h3>
        </div>
        <p className="text-gray-600 mb-4">
          Explora y selecciona expertos
        </p>
        <button className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors">
          Ver Expertos
        </button>
      </div>
    </div>
  )
}

function ExpertDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Invitaciones */}
      <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <span className="text-orange-600 text-lg">📩</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Invitaciones Pendientes
          </h3>
        </div>
        <p className="text-gray-600 mb-4">
          Proyectos que requieren tu expertise
        </p>
        <div className="text-center py-4">
          <p className="text-gray-500 text-sm">No hay invitaciones pendientes</p>
        </div>
      </div>

      {/* Participaciones */}
      <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-blue-600 text-lg">🗳️</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Mis Participaciones
          </h3>
        </div>
        <p className="text-gray-600 mb-4">
          Proyectos en los que participas
        </p>
        <div className="text-center py-4">
          <p className="text-gray-500 text-sm">No hay participaciones activas</p>
        </div>
      </div>
    </div>
  )
}
