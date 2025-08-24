'use client'

import { useMockAuth } from '@/contexts/MockAuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Welcome from '@/components/Welcome'

export default function Home() {
  const { user, loading } = useMockAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  // Evitar hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-micmac-dark flex items-center justify-center">
        <div className="animate-pulse-slow rounded-full h-12 w-12 bg-micmac-primary-500"></div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-micmac-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse-slow rounded-full h-12 w-12 bg-micmac-primary-500 mx-auto mb-4"></div>
          <p className="text-dark-text-secondary">Cargando MIC MAC Pro...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return null // Se redirigirá al dashboard
  }

  return <Welcome />
}
