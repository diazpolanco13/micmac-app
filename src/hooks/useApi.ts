/**
 * 🔗 Custom Hook para API Calls
 * Hook reutilizable para llamadas a APIs con manejo de errores
 */

import { useState } from 'react'
import { useToast } from '@/contexts/ToastContext'

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  details?: string
}

interface UseApiOptions {
  showSuccessToast?: boolean
  showErrorToast?: boolean
  successMessage?: string
}

export function useApi() {
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  const apiCall = async <T = any>(
    url: string,
    options: RequestInit = {},
    uiOptions: UseApiOptions = {}
  ): Promise<{ data: T | null; error: string | null; success: boolean }> => {
    const {
      showSuccessToast = false,
      showErrorToast = true,
      successMessage
    } = uiOptions

    setLoading(true)

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      })

      const result: ApiResponse<T> = await response.json()

      if (!response.ok || !result.success) {
        const errorMessage = result.error || `Error ${response.status}: ${response.statusText}`
        
        if (showErrorToast) {
          toast.error('Error', errorMessage)
        }

        return {
          data: null,
          error: errorMessage,
          success: false
        }
      }

      if (showSuccessToast) {
        const message = successMessage || result.message || 'Operación exitosa'
        toast.success('Éxito', message)
      }

      return {
        data: result.data || null,
        error: null,
        success: true
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error de conexión'
      
      if (showErrorToast) {
        toast.error('Error de conexión', errorMessage)
      }

      return {
        data: null,
        error: errorMessage,
        success: false
      }
    } finally {
      setLoading(false)
    }
  }

  // Métodos específicos para CRUD
  const get = <T = any>(url: string, options?: UseApiOptions) => 
    apiCall<T>(url, { method: 'GET' }, options)

  const post = <T = any>(url: string, data: any, options?: UseApiOptions) =>
    apiCall<T>(url, {
      method: 'POST',
      body: JSON.stringify(data)
    }, { showSuccessToast: true, ...options })

  const put = <T = any>(url: string, data: any, options?: UseApiOptions) =>
    apiCall<T>(url, {
      method: 'PUT',
      body: JSON.stringify(data)
    }, { showSuccessToast: true, ...options })

  const del = <T = any>(url: string, options?: UseApiOptions) =>
    apiCall<T>(url, { method: 'DELETE' }, { showSuccessToast: true, ...options })

  return {
    loading,
    get,
    post,
    put,
    delete: del,
    apiCall
  }
}

// Hook específico para proyectos
export function useProjectsApi() {
  const api = useApi()

  return {
    loading: api.loading,
    
    // Obtener todos los proyectos
    getProjects: (filters?: {
      status?: string[]
      search?: string
      tags?: string[]
      creatorId?: string
    }) => {
      const params = new URLSearchParams()
      
      if (filters?.status) {
        filters.status.forEach(status => params.append('status', status))
      }
      if (filters?.search) params.append('search', filters.search)
      if (filters?.tags) {
        filters.tags.forEach(tag => params.append('tags', tag))
      }
      if (filters?.creatorId) params.append('creatorId', filters.creatorId)

      const url = `/api/projects${params.toString() ? `?${params.toString()}` : ''}`
      return api.get(url)
    },

    // Obtener proyecto por ID
    getProject: (id: string) => api.get(`/api/projects/${id}`),

    // Crear proyecto
    createProject: (data: {
      name: string
      description: string
      type: string
      expectedExperts: number
    }) => api.post('/api/projects', data, {
      successMessage: 'Proyecto creado exitosamente'
    }),

    // Actualizar proyecto
    updateProject: (id: string, data: any) => api.put(`/api/projects/${id}`, data, {
      successMessage: 'Proyecto actualizado exitosamente'
    }),

    // Eliminar proyecto
    deleteProject: (id: string) => api.delete(`/api/projects/${id}`, {
      successMessage: 'Proyecto eliminado exitosamente'
    }),

    // Operaciones de variables
    getVariables: (projectId: string) => api.get(`/api/projects/${projectId}/variables`),
    
    createVariable: (projectId: string, data: {
      name: string
      description?: string
      category?: string
      color?: string
    }) => api.post(`/api/projects/${projectId}/variables`, data, {
      successMessage: 'Variable creada exitosamente'
    }),

    updateVariable: (id: string, data: any) => api.put(`/api/variables/${id}`, data, {
      successMessage: 'Variable actualizada exitosamente'
    }),

    deleteVariable: (id: string) => api.delete(`/api/variables/${id}`, {
      successMessage: 'Variable eliminada exitosamente'
    }),

    reorderVariables: (projectId: string, variableOrders: { id: string; order: number }[]) =>
      api.put(`/api/projects/${projectId}/variables`, { variableOrders }, {
        successMessage: 'Variables reordenadas exitosamente'
      })
  }
}

// Hook específico para expertos
export function useExpertsApi() {
  const api = useApi()

  return {
    loading: api.loading,
    
    // Obtener todos los expertos
    getExperts: (filters?: {
      search?: string
      expertiseAreas?: string[]
    }) => {
      const params = new URLSearchParams()
      
      if (filters?.search) params.append('search', filters.search)
      if (filters?.expertiseAreas) {
        filters.expertiseAreas.forEach(area => params.append('expertiseAreas', area))
      }

      const url = `/api/experts${params.toString() ? `?${params.toString()}` : ''}`
      return api.get(url)
    },

    // Crear experto
    createExpert: (data: {
      name: string
      email: string
      organization?: string
      expertiseAreas: string[]
      avatar?: string
      yearsExperience?: number
      notes?: string
    }) => api.post('/api/experts', data, {
      successMessage: 'Experto creado exitosamente'
    })
  }
}
