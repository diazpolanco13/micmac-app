'use client'

/**
 * 🔐 Auth Page
 * Página de autenticación con login/register
 */

import React, { useState } from 'react'
import LoginForm from '@/components/auth/LoginForm'
import RegisterForm from '@/components/auth/RegisterForm'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen bg-micmac-dark flex items-center justify-center p-4 relative overflow-hidden">
      {/* Efectos de fondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-micmac-primary-900/20 via-transparent to-micmac-secondary-900/20"></div>
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-micmac-primary-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-micmac-secondary-500/10 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-micmac-primary-500 to-micmac-secondary-500 rounded-2xl mb-4 glow-effect">
            <span className="text-2xl">🚀</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            <span className="text-gradient">MIC MAC Pro</span>
          </h1>
          <p className="text-dark-text-secondary">
            Plataforma de Análisis Prospectivos
          </p>
        </div>

        {/* Forms */}
        {isLogin ? (
          <LoginForm onToggleMode={() => setIsLogin(false)} />
        ) : (
          <RegisterForm onToggleMode={() => setIsLogin(true)} />
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-dark-text-muted">
            Desarrollado con automatización completa
          </p>
          <div className="flex justify-center items-center gap-2 mt-2">
            <div className="status-indicator status-active"></div>
            <span className="text-xs text-micmac-secondary-400 font-medium">
              🤖 Agentes activos
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
