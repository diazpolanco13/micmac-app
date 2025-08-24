'use client'

import { useState, useEffect } from 'react'
import { useMockAuth } from '@/contexts/MockAuthContext'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import { Button, Input } from '@/components/ui'
import { useToast } from '@/contexts/ToastContext'

export default function ProfilePage() {
  const { user, loading, updateProfile } = useMockAuth()
  const router = useRouter()
  const toast = useToast()

  // Estados del formulario
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'EXPERT' as 'EXPERT' | 'MODERATOR',
    avatar: '',
    bio: ''
  })

  // Redireccionar si no está autenticado
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  // Cargar datos del usuario
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'EXPERT',
        avatar: user.avatar || '',
        bio: user.bio || ''
      })
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = async () => {
    if (!user) return

    try {
      setIsSaving(true)
      
      // Por ahora usamos MockAuth, pero será compatible con SupabaseAuth
      const result = await updateProfile({
        name: formData.name,
        avatar: formData.avatar,
        // Estos campos adicionales se pueden agregar después
        bio: formData.bio
      })

      if (result.success) {
        toast.success('Perfil actualizado', 'Los cambios se han guardado correctamente')
        setIsEditing(false)
      } else {
        toast.error('Error', result.error || 'No se pudo actualizar el perfil')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Error', 'No se pudo actualizar el perfil')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'EXPERT',
        avatar: user.avatar || '',
        bio: user.bio || ''
      })
    }
    setIsEditing(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-micmac-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse-slow rounded-full h-8 w-8 bg-micmac-primary-500 mx-auto mb-4"></div>
          <p className="text-dark-text-secondary">Cargando perfil...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <AppLayout>
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient mb-2">
            👤 Mi Perfil
          </h1>
          <p className="text-dark-text-secondary">
            Gestiona tu información personal y configuración de cuenta
          </p>
        </div>

        {/* Información de cuenta */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Panel principal */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Información personal */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-dark-text-primary">
                  Información Personal
                </h2>
                {!isEditing ? (
                  <Button 
                    ghost 
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>
                    Editar
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      ghost
                      onClick={handleCancel}
                      disabled={isSaving}
                    >
                      Cancelar
                    </Button>
                    <Button
                      color="primary"
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex items-center gap-2"
                    >
                      {isSaving ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      )}
                      Guardar
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {/* Nombre */}
                <div>
                  <label className="block text-sm font-medium text-dark-text-primary mb-2">
                    Nombre completo
                  </label>
                  {isEditing ? (
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Ingresa tu nombre completo"
                      disabled={isSaving}
                    />
                  ) : (
                    <p className="text-dark-text-primary bg-dark-bg-tertiary p-3 rounded-md">
                      {formData.name || 'No especificado'}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-dark-text-primary mb-2">
                    Correo electrónico
                  </label>
                  <p className="text-dark-text-secondary bg-dark-bg-tertiary p-3 rounded-md">
                    {formData.email}
                    <span className="ml-2 text-xs text-dark-text-muted">
                      (No se puede cambiar)
                    </span>
                  </p>
                </div>

                {/* Avatar URL */}
                <div>
                  <label className="block text-sm font-medium text-dark-text-primary mb-2">
                    Avatar (URL de imagen)
                  </label>
                  {isEditing ? (
                    <Input
                      type="url"
                      name="avatar"
                      value={formData.avatar}
                      onChange={handleInputChange}
                      placeholder="https://ejemplo.com/avatar.jpg"
                      disabled={isSaving}
                    />
                  ) : (
                    <p className="text-dark-text-primary bg-dark-bg-tertiary p-3 rounded-md">
                      {formData.avatar || 'No especificado'}
                    </p>
                  )}
                </div>

                {/* Biografía */}
                <div>
                  <label className="block text-sm font-medium text-dark-text-primary mb-2">
                    Biografía
                  </label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Cuéntanos sobre ti, tu experiencia y áreas de expertise..."
                      rows={4}
                      disabled={isSaving}
                      className="w-full px-3 py-2 bg-dark-bg-tertiary border border-dark-bg-tertiary rounded-md text-dark-text-primary placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-micmac-primary-500 resize-vertical"
                    />
                  ) : (
                    <p className="text-dark-text-primary bg-dark-bg-tertiary p-3 rounded-md min-h-[100px] whitespace-pre-wrap">
                      {formData.bio || 'No hay biografía disponible'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Configuración de cuenta */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-dark-text-primary mb-6">
                Configuración de Cuenta
              </h2>

              <div className="space-y-4">
                {/* Rol */}
                <div className="flex items-center justify-between p-4 bg-dark-bg-tertiary rounded-lg">
                  <div>
                    <h3 className="text-sm font-medium text-dark-text-primary">
                      Rol en el sistema
                    </h3>
                    <p className="text-sm text-dark-text-secondary">
                      Define tus permisos y capacidades en la plataforma
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    formData.role === 'MODERATOR' 
                      ? 'bg-micmac-secondary-500/20 text-micmac-secondary-300'
                      : 'bg-micmac-primary-500/20 text-micmac-primary-300'
                  }`}>
                    {formData.role === 'MODERATOR' ? '🛡️ Moderador' : '👨‍🔬 Experto'}
                  </span>
                </div>

                {/* Estadísticas de sesión */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-dark-bg-tertiary rounded-lg">
                    <h4 className="text-sm font-medium text-dark-text-primary mb-1">
                      Último acceso
                    </h4>
                    <p className="text-sm text-dark-text-secondary">
                      {new Date().toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="p-4 bg-dark-bg-tertiary rounded-lg">
                    <h4 className="text-sm font-medium text-dark-text-primary mb-1">
                      Cuenta desde
                    </h4>
                    <p className="text-sm text-dark-text-secondary">
                      {new Date().toLocaleDateString('es-ES', {
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Panel lateral */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Avatar preview */}
            <div className="card p-6 text-center">
              <div className="mb-4">
                {formData.avatar ? (
                  <img
                    src={formData.avatar}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-dark-bg-tertiary"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'Usuario')}&background=2DD4BF&color=1F2937&size=96`
                    }}
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full mx-auto bg-gradient-to-br from-micmac-primary-500 to-micmac-secondary-500 flex items-center justify-center text-2xl font-bold text-white">
                    {(formData.name || formData.email || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <h3 className="text-lg font-semibold text-dark-text-primary">
                {formData.name || 'Sin nombre'}
              </h3>
              <p className="text-sm text-dark-text-secondary">
                {formData.email}
              </p>
              <div className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-medium ${
                formData.role === 'MODERATOR'
                  ? 'bg-micmac-secondary-500/20 text-micmac-secondary-300'
                  : 'bg-micmac-primary-500/20 text-micmac-primary-300'
              }`}>
                {formData.role === 'MODERATOR' ? 'Moderador' : 'Experto'}
              </div>
            </div>

            {/* Acciones rápidas */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-dark-text-primary mb-4">
                Acciones
              </h3>
              <div className="space-y-3">
                <Button
                  ghost
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => router.push('/dashboard')}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                  </svg>
                  Dashboard
                </Button>
                
                <Button
                  ghost
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => router.push('/projects')}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25H11.379a1.5 1.5 0 01-1.06-.44z" />
                  </svg>
                  Mis Proyectos
                </Button>

                {formData.role === 'MODERATOR' && (
                  <Button
                    ghost
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => router.push('/experts')}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                    </svg>
                    Gestionar Expertos
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
