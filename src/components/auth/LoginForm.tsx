'use client'

/**
 * 🔐 Login Form Component
 * Formulario de login responsive y accesible
 */

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { UserRole } from '@/lib/supabase'

interface LoginFormProps {
  onToggleMode: () => void
  className?: string
}

export default function LoginForm({ onToggleMode, className = '' }: LoginFormProps) {
  const { signIn, loading } = useAuth()
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
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Iniciar Sesión
          </h2>
          <p className="text-gray-600 mt-2">
            Accede a MIC MAC Pro
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="tu@email.com"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="flex items-center">
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
            className="text-blue-600 hover:text-blue-500 text-sm font-medium transition-colors"
            disabled={loading}
          >
            ¿No tienes cuenta? Regístrate
          </button>
        </div>

        {/* Demo users para testing */}
        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <p className="text-xs text-gray-600 mb-2 font-medium">Demo Users:</p>
          <div className="space-y-1 text-xs text-gray-500">
            <div>📊 Moderador: mod@micmac.com / demo123</div>
            <div>👨‍🔬 Experto: expert@micmac.com / demo123</div>
          </div>
        </div>
      </div>
    </div>
  )
}
