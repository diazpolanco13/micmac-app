'use client'

/**
 * 📝 Register Form Component
 * Formulario de registro con selección de rol
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMockAuth } from '@/contexts/MockAuthContext'
import { useNavigationLoading } from '@/contexts/NavigationLoadingContext'
import { UserRole } from '@/contexts/MockAuthContext'

interface RegisterFormProps {
  onToggleMode: () => void
  className?: string
}

export default function RegisterForm({ onToggleMode, className = '' }: RegisterFormProps) {
  const { signUp, loading } = useMockAuth()
  const { startLoading } = useNavigationLoading()
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'EXPERT' as UserRole
  })
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validaciones
    if (!formData.name || !formData.email || !formData.password) {
      setError('Por favor completa todos los campos')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    const { error: signUpError } = await signUp(
      formData.email,
      formData.password,
      formData.role as UserRole,
      formData.name
    )
    
    if (signUpError) {
      setError(signUpError)
    } else {
      // ✨ Redirección exitosa con loading visual
      startLoading('/dashboard')
      setTimeout(() => {
        router.push('/dashboard')
      }, 100)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      <div className="card p-6 md:p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-dark-text-primary">
            Crear Cuenta
          </h2>
          <p className="text-dark-text-secondary mt-2">
            Únete a MIC MAC Pro
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-dark-text-secondary mb-1">
              Nombre Completo
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-dark-bg-tertiary border border-dark-bg-tertiary rounded-xl text-dark-text-primary placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-micmac-primary-500 focus:border-transparent transition-all"
              placeholder="Tu nombre completo"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-dark-text-secondary mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-dark-bg-tertiary border border-dark-bg-tertiary rounded-xl text-dark-text-primary placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-micmac-primary-500 focus:border-transparent transition-all"
              placeholder="tu@email.com"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-dark-text-secondary mb-1">
              Rol
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-dark-bg-tertiary border border-dark-bg-tertiary rounded-xl text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-micmac-primary-500 focus:border-transparent transition-all"
              disabled={loading}
            >
              <option value="EXPERT">🧑‍🔬 Experto - Participar en análisis</option>
              <option value="MODERATOR">📊 Moderador - Gestionar proyectos</option>
            </select>
            <p className="text-xs text-dark-text-muted mt-1">
              {formData.role === 'EXPERT' 
                ? 'Podrás participar en estudios MIC MAC y votar en matrices'
                : 'Podrás crear proyectos, seleccionar expertos y gestionar análisis'
              }
            </p>
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
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-dark-bg-tertiary border border-dark-bg-tertiary rounded-xl text-dark-text-primary placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-micmac-primary-500 focus:border-transparent transition-all"
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-dark-text-secondary mb-1">
              Confirmar Contraseña
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
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
                Creando cuenta...
              </div>
            ) : (
              'Crear Cuenta'
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
            ¿Ya tienes cuenta? Inicia sesión
          </button>
        </div>
      </div>
    </div>
  )
}
