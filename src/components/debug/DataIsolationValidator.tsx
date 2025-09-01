/**
 * 🔒 Validador de Aislamiento de Datos
 * Componente para verificar que los datos estén correctamente aislados entre organizaciones
 */

'use client'

import { useState } from 'react'
import { useMockAuth } from '@/contexts/MockAuthContext'
import { useMockData } from '@/contexts/MockDataContext'
import { validateOrganizationAccess, secureOrganizationFilter } from '@/utils/dataIsolation'

interface ValidationResult {
  test: string
  status: 'PASS' | 'FAIL' | 'WARNING'
  message: string
  details?: any
}

export default function DataIsolationValidator() {
  const { user, currentOrganization } = useMockAuth()
  const { projects, experts } = useMockData()
  const [results, setResults] = useState<ValidationResult[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const runValidation = async () => {
    setIsRunning(true)
    const validationResults: ValidationResult[] = []

    // Test 1: Usuario tiene organización activa
    if (!user?.currentOrganizationId) {
      validationResults.push({
        test: 'Usuario - Organización Activa',
        status: 'FAIL',
        message: 'Usuario no tiene organización activa definida',
        details: { user: user?.email, currentOrganizationId: user?.currentOrganizationId }
      })
    } else {
      validationResults.push({
        test: 'Usuario - Organización Activa',
        status: 'PASS',
        message: `Organización activa: ${user.currentOrganizationId}`,
        details: { currentOrganization: currentOrganization?.name }
      })
    }

    // Test 2: Proyectos filtrados correctamente
    const invalidProjects = projects.filter(project => {
      const error = validateOrganizationAccess(project, user?.currentOrganizationId)
      return error !== null
    })

    if (invalidProjects.length > 0) {
      validationResults.push({
        test: 'Proyectos - Filtrado de Organización',
        status: 'FAIL',
        message: `${invalidProjects.length} proyectos de otras organizaciones detectados`,
        details: { invalidProjects: invalidProjects.map(p => ({ id: p.id, name: p.name, orgId: p.organizationId })) }
      })
    } else {
      validationResults.push({
        test: 'Proyectos - Filtrado de Organización',
        status: 'PASS',
        message: `${projects.length} proyectos correctamente filtrados`,
        details: { projectCount: projects.length, organizationId: user?.currentOrganizationId }
      })
    }

    // Test 3: Expertos filtrados correctamente
    const invalidExperts = experts.filter(expert => {
      const error = validateOrganizationAccess(expert, user?.currentOrganizationId)
      return error !== null
    })

    if (invalidExperts.length > 0) {
      validationResults.push({
        test: 'Expertos - Filtrado de Organización',
        status: 'FAIL',
        message: `${invalidExperts.length} expertos de otras organizaciones detectados`,
        details: { invalidExperts: invalidExperts.map(e => ({ id: e.id, name: e.name, orgId: e.organizationId })) }
      })
    } else {
      validationResults.push({
        test: 'Expertos - Filtrado de Organización',
        status: 'PASS',
        message: `${experts.length} expertos correctamente filtrados`,
        details: { expertCount: experts.length, organizationId: user?.currentOrganizationId }
      })
    }

    // Test 4: Verificar acceso a múltiples organizaciones (si aplica)
    if (user?.organizations && user.organizations.length > 1) {
      const otherOrgs = user.organizations.filter(org => org.organizationId !== user.currentOrganizationId)
      validationResults.push({
        test: 'Multi-Org - Acceso a Otras Organizaciones',
        status: 'WARNING',
        message: `Usuario tiene acceso a ${user.organizations.length} organizaciones`,
        details: { 
          currentOrg: user.currentOrganizationId,
          otherOrgs: otherOrgs.map(o => o.organizationId)
        }
      })
    }

    setResults(validationResults)
    setIsRunning(false)
  }

  const getStatusColor = (status: ValidationResult['status']) => {
    switch (status) {
      case 'PASS': return 'text-green-400 bg-green-900/20'
      case 'FAIL': return 'text-red-400 bg-red-900/20'
      case 'WARNING': return 'text-yellow-400 bg-yellow-900/20'
    }
  }

  const getStatusIcon = (status: ValidationResult['status']) => {
    switch (status) {
      case 'PASS': return '✅'
      case 'FAIL': return '❌'
      case 'WARNING': return '⚠️'
    }
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">🔒 Validador de Aislamiento de Datos</h3>
        <button
          onClick={runValidation}
          disabled={isRunning}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isRunning ? 'Validando...' : 'Ejecutar Validación'}
        </button>
      </div>

      {results.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-300">Resultados:</h4>
          {results.map((result, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border ${getStatusColor(result.status)}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{getStatusIcon(result.status)}</span>
                <span className="font-medium">{result.test}</span>
              </div>
              <p className="text-sm text-gray-300 mb-2">{result.message}</p>
              {result.details && (
                <details className="text-xs">
                  <summary className="cursor-pointer text-gray-400 hover:text-gray-300">
                    Ver detalles
                  </summary>
                  <pre className="mt-2 bg-gray-900 p-2 rounded overflow-auto">
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="text-xs text-gray-400 mt-4">
        <p>🔍 Este validador verifica que:</p>
        <ul className="list-disc list-inside ml-2 space-y-1">
          <li>Los usuarios tengan una organización activa</li>
          <li>Los proyectos estén filtrados por organización</li>
          <li>Los expertos estén filtrados por organización</li>
          <li>No haya filtraciones de datos entre organizaciones</li>
        </ul>
      </div>
    </div>
  )
}
