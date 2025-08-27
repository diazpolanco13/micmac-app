'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ClearStoragePage() {
  const router = useRouter()

  useEffect(() => {
    // Limpiar localStorage
    if (typeof window !== 'undefined') {
      console.log('🧹 Limpiando localStorage...')
      localStorage.removeItem('micmac_current_user')
      localStorage.removeItem('micmac_mock_users')
      console.log('✅ localStorage limpiado')
      
      // Redireccionar después de limpiar
      setTimeout(() => {
        router.push('/profile')
      }, 1000)
    }
  }, [router])

  return (
    <div className="min-h-screen bg-micmac-dark flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 bg-micmac-primary-500 mx-auto mb-4"></div>
        <h1 className="text-xl font-semibold text-dark-text-primary mb-2">
          Limpiando datos...
        </h1>
        <p className="text-dark-text-secondary">
          Recargando datos de prueba del General Guerdi Lafaurie
        </p>
      </div>
    </div>
  )
}
