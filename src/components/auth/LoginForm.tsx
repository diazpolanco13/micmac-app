'use client'

/**
 * 🔐 Login Form Component
 * Formulario de login responsive y accesible
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigationLoading } from '@/contexts/NavigationLoadingContext'

interface LoginFormProps {
  onToggleMode: () => void
  className?: string
}

export default function LoginForm({ onToggleMode, className = '' }: LoginFormProps) {
  const { signIn, loading } = useAuth()
  const { startLoading } = useNavigationLoading()
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.email || !formData.password) {
      setError('Por favor completa todos los campos')
      return
    }

    const { error: signInError } = await signIn(formData.email, formData.password)
    
    if (signInError) {
      setError(signInError)
    } else {
      // ✨ Redirección exitosa con loading visual
      startLoading('/dashboard', true)
      setTimeout(() => {
        router.push('/dashboard')
      }, 100)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  // Función para login rápido con usuarios demo
  const handleDemoLogin = async (email: string, password: string) => {
    setFormData({ email, password })
    setError(null)
    
    const { error: signInError } = await signIn(email, password)
    
    if (signInError) {
      setError(signInError)
    } else {
      startLoading('/dashboard', true)
      setTimeout(() => {
        router.push('/dashboard')
      }, 100)
    }
  }

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      <div className="card p-6 md:p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-dark-text-primary">
            Iniciar Sesión
          </h2>
          <p className="text-dark-text-secondary mt-2">
            Accede a MIC MAC Pro
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-dark-text-secondary mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="username"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-dark-bg-tertiary border border-dark-bg-tertiary rounded-xl text-dark-text-primary placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-micmac-primary-500 focus:border-transparent transition-all"
              placeholder="tu@email.com"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-dark-text-secondary mb-1">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-dark-bg-tertiary border border-dark-bg-tertiary rounded-xl text-dark-text-primary placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-micmac-primary-500 focus:border-transparent transition-all"
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                Iniciando sesión...
              </div>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={onToggleMode}
            className="text-micmac-primary-400 hover:text-micmac-primary-300 text-sm font-medium transition-colors"
            disabled={loading}
          >
            ¿No tienes cuenta? Regístrate
          </button>
        </div>

        {/* Demo users para testing con login rápido */}
        <div className="mt-6 p-4 bg-dark-bg-tertiary/30 rounded-xl border border-dark-bg-tertiary">
          <p className="text-xs text-dark-text-secondary mb-3 font-medium">🚀 Acceso Rápido Demo:</p>
          <div className="space-y-2">
            <button
              onClick={() => handleDemoLogin('admin@demo.com', 'demo123')}
              disabled={loading}
              className="w-full text-left p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg border border-red-500/20 hover:border-red-500/40 transition-all disabled:opacity-50"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">🔑</span>
                <div>
                  <div className="text-sm font-medium text-red-300">Carlos Hernández - ADMIN</div>
                  <div className="text-xs text-dark-text-muted">admin@demo.com (Todos los permisos)</div>
                </div>
              </div>
            </button>
            
            <button
              onClick={() => handleDemoLogin('moderator@demo.com', 'demo123')}
              disabled={loading}
              className="w-full text-left p-2 bg-micmac-primary-500/10 hover:bg-micmac-primary-500/20 rounded-lg border border-micmac-primary-500/20 hover:border-micmac-primary-500/40 transition-all disabled:opacity-50"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">👨‍💼</span>
                <div>
                  <div className="text-sm font-medium text-micmac-primary-300">Ana García - MODERADOR</div>
                  <div className="text-xs text-dark-text-muted">moderator@demo.com (Gestionar proyectos)</div>
                </div>
              </div>
            </button>
            
            <button
              onClick={() => handleDemoLogin('expert@demo.com', 'demo123')}
              disabled={loading}
              className="w-full text-left p-2 bg-micmac-secondary-500/10 hover:bg-micmac-secondary-500/20 rounded-lg border border-micmac-secondary-500/20 hover:border-micmac-secondary-500/40 transition-all disabled:opacity-50"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">🧑‍🔬</span>
                <div>
                  <div className="text-sm font-medium text-micmac-secondary-300">Dr. Luis Experto - EXPERTO</div>
                  <div className="text-xs text-dark-text-muted">expert@demo.com (Participar en análisis)</div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
