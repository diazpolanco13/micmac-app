'use client'

import { useState, useEffect } from 'react'
import { useMockAuth } from '@/contexts/MockAuthContext'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import { Button } from '@/components/ui'

export default function ExpertsPage() {
  const { user, loading } = useMockAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-micmac-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse-slow rounded-full h-8 w-8 bg-micmac-primary-500 mx-auto mb-4"></div>
          <p className="text-dark-text-secondary">Cargando expertos...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <AppLayout>
      <div className="w-full max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient mb-2">
            👥 Gestión de Expertos
          </h1>
          <p className="text-dark-text-secondary">
            Administra el panel de expertos para tus proyectos MIC MAC
          </p>
        </div>

        <div className="card p-8">
          <div className="text-center">
            <div className="text-6xl mb-4">👨‍🔬</div>
            <h3 className="text-lg font-medium text-dark-text-primary mb-2">
              Gestión de Expertos
            </h3>
            <p className="text-dark-text-secondary mb-6">
              Esta funcionalidad está integrada en la edición de proyectos.<br/>
              Ve a un proyecto específico para gestionar sus expertos.
            </p>
            <Button 
              color="primary" 
              onClick={() => router.push('/projects')}
            >
              Ver Proyectos
            </Button>
          </div>
        </div>

        {/* Info sobre el sistema de expertos */}
        <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
            </div>
            <div>
              <h4 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-2">
                Sistema de Expertos MIC MAC
              </h4>
              <div className="text-blue-700 dark:text-blue-300 space-y-2">
                <p>
                  <strong>✅ Ya implementado en Fase 4A:</strong>
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Gestión completa de expertos por proyecto (CRUD)</li>
                  <li>Catálogo de 8+ expertos especializados</li>
                  <li>Sistema de invitaciones y estados</li>
                  <li>Filtros por expertise y búsqueda</li>
                  <li>Validaciones metodológicas (3-50 expertos)</li>
                  <li>Progreso de votación y métricas</li>
                </ul>
                <p className="pt-2">
                  <strong>📍 Ubicación:</strong> La gestión se realiza en la pestaña "Expertos" 
                  cuando editas cualquier proyecto desde el dashboard o la página de proyectos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
