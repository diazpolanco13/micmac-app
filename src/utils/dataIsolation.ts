/**
 * 🔒 Utilidades para Aislamiento de Datos Multi-Organizacional
 * Funciones para validar y asegurar la separación de datos entre organizaciones
 */

export interface DataIsolationError {
  type: 'CROSS_ORG_ACCESS' | 'MISSING_ORG_FILTER' | 'INVALID_ORG_ID'
  message: string
  context?: any
}

/**
 * Valida que un objeto tenga organizationId y coincida con la organización activa
 */
export function validateOrganizationAccess(
  data: { organizationId?: string },
  currentOrganizationId: string | undefined | null
): DataIsolationError | null {
  if (!currentOrganizationId) {
    return {
      type: 'INVALID_ORG_ID',
      message: 'Usuario no tiene organización activa',
      context: { currentOrganizationId }
    }
  }

  if (!data.organizationId) {
    return {
      type: 'MISSING_ORG_FILTER',
      message: 'Datos sin organizationId - posible filtración',
      context: { data, currentOrganizationId }
    }
  }

  if (data.organizationId !== currentOrganizationId) {
    return {
      type: 'CROSS_ORG_ACCESS',
      message: 'Intento de acceso a datos de otra organización',
      context: { 
        dataOrganizationId: data.organizationId,
        currentOrganizationId,
        data 
      }
    }
  }

  return null
}

/**
 * Filtra un array de datos asegurando que solo se devuelvan datos de la organización activa
 */
export function secureOrganizationFilter<T extends { organizationId?: string }>(
  data: T[],
  currentOrganizationId: string | undefined | null
): T[] {
  if (!currentOrganizationId) {
    // Debug: Usuario sin organización activa (silenciado en producción)
    return []
  }

  const filtered = data.filter(item => {
    const error = validateOrganizationAccess(item, currentOrganizationId)
    if (error) {
      // Debug: Error de aislamiento de datos (silenciado en producción)
      return false
    }
    return true
  })

  // Debug: Filtrado de datos por organización (silenciado en producción)
  return filtered
}

/**
 * Wrapper para operaciones que requieren aislamiento de datos
 */
export function withDataIsolation<T>(
  operation: () => T,
  currentOrganizationId: string | undefined | null,
  operationName: string
): T | null {
  if (!currentOrganizationId) {
    console.error(`🚨 AISLAMIENTO DE DATOS: ${operationName} - Usuario sin organización activa`)
    return null
  }

  try {
    // Debug: Ejecutando operación con aislamiento de datos (silenciado en producción)
    return operation()
  } catch (error) {
    console.error(`🚨 AISLAMIENTO DE DATOS: Error en ${operationName}:`, error)
    return null
  }
}

/**
 * Valida que un usuario tenga acceso a una organización específica
 */
export function validateUserOrganizationAccess(
  user: { 
    organizations?: Array<{ organizationId: string; status: string }>,
    currentOrganizationId?: string 
  },
  targetOrganizationId: string
): boolean {
  if (!user.organizations) {
    return false
  }

  // Verificar que el usuario pertenece a la organización objetivo
  const hasAccess = user.organizations.some(
    org => org.organizationId === targetOrganizationId && org.status === 'ACTIVE'
  )

  if (!hasAccess) {
    // Debug: Usuario no tiene acceso a organización (silenciado en producción)
  }

  return hasAccess
}
