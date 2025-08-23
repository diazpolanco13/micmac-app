'use client'

/**
 * 🏠 Welcome Component - Página de bienvenida con diseño premium
 * Componente principal con modo oscuro y efectos interactivos
 */

import { useState } from 'react'

interface WelcomeProps {
  title?: string
  subtitle?: string
}

export default function Welcome({ 
  title = "🚀 MIC MAC Pro", 
  subtitle = "Análisis Prospectivos Automatizados" 
}: WelcomeProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) {
    return null
  }

  return (
    <div className="min-h-screen bg-micmac-dark flex items-center justify-center p-4 relative overflow-hidden">
      {/* Efectos de fondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-micmac-primary-900/20 via-transparent to-micmac-secondary-900/20"></div>
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-micmac-primary-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-micmac-secondary-500/10 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
      
      <div className="container-app relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          {/* Card principal */}
          <div className="card-glow p-8 md:p-12 mb-8">
            {/* Header con logo y título */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-micmac-primary-500 to-micmac-secondary-500 rounded-2xl mb-6 glow-effect">
                <span className="text-3xl">🚀</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                <span className="text-gradient">MIC MAC Pro</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-dark-text-secondary font-light">
                {subtitle}
              </p>
            </div>

            {/* Descripción */}
            <div className="mb-8 p-6 bg-dark-bg-tertiary/30 rounded-xl border border-dark-bg-tertiary">
              <p className="text-dark-text-secondary leading-relaxed">
                Plataforma avanzada para análisis prospectivos colaborativos con metodología MIC MAC. 
                Desarrollada con automatización completa y tecnología de vanguardia.
              </p>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button 
                onClick={() => window.location.href = '/auth'}
                className="btn-primary group"
              >
                <span className="flex items-center gap-2">
                  Iniciar Sesión
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
              
              <button 
                onClick={() => setIsVisible(false)}
                className="btn-secondary group"
              >
                <span className="flex items-center gap-2">
                  Explorar Demo
                  <svg className="w-5 h-5 transform group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </span>
              </button>
            </div>

            {/* Demo users */}
            <div className="text-center text-dark-text-muted text-sm">
              <p className="mb-2">👥 <strong>Usuarios Demo:</strong></p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <span className="px-3 py-1 bg-micmac-primary-500/20 rounded-full text-micmac-primary-300">
                  📊 Moderador: mod@micmac.com / demo123
                </span>
                <span className="px-3 py-1 bg-micmac-secondary-500/20 rounded-full text-micmac-secondary-300">
                  🧑‍🔬 Experto: expert@micmac.com / demo123
                </span>
              </div>
            </div>
          </div>
          
          {/* Status de automatización */}
          <div className="card p-6">
            <div className="flex items-center justify-center gap-4">
              <div className="status-indicator status-active"></div>
              <span className="text-dark-text-secondary font-medium">
                🤖 Agentes de Automatización Activos
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-center">
              <div className="p-3 bg-dark-bg-tertiary/30 rounded-lg">
                <div className="text-micmac-secondary-400 font-semibold">@CursorTesting</div>
                <div className="text-xs text-dark-text-muted">Pruebas</div>
              </div>
              <div className="p-3 bg-dark-bg-tertiary/30 rounded-lg">
                <div className="text-micmac-secondary-400 font-semibold">@CursorGit</div>
                <div className="text-xs text-dark-text-muted">Git</div>
              </div>
              <div className="p-3 bg-dark-bg-tertiary/30 rounded-lg">
                <div className="text-micmac-secondary-400 font-semibold">@CursorLinear</div>
                <div className="text-xs text-dark-text-muted">Tracking</div>
              </div>
              <div className="p-3 bg-dark-bg-tertiary/30 rounded-lg">
                <div className="text-micmac-secondary-400 font-semibold">@CursorDocs</div>
                <div className="text-xs text-dark-text-muted">Docs</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}