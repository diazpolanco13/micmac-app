'use client'

import { useState, useEffect } from 'react'
import { useMockAuth } from '@/contexts/MockAuthContext'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import { Button, Input } from '@/components/ui'
import { useToast } from '@/contexts/ToastContext'
import ExpertiseAreasSection from '@/components/profile/ExpertiseAreasSection'
import ExpertiseRadarChart from '@/components/profile/ExpertiseRadarChart'
import type { ExpertiseArea } from '@/types/project'

export default function ProfilePage() {
  const { user, loading, updateProfile } = useMockAuth()
  const router = useRouter()
  const toast = useToast()

  // Estados del formulario
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'EXPERT' as 'EXPERT' | 'MODERATOR',
    avatar: '',
    bio: '',
    // 🎯 NUEVOS CAMPOS
    organization: '',
    phone: '',
    linkedinUrl: '',
    profession: '',
    currentPosition: '',
    yearsExperience: 0,
    expertiseAreas: [] as ExpertiseArea[]
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
        bio: user.bio || '',
        organization: user.organization || '',
        phone: user.phone || '',
        linkedinUrl: user.linkedinUrl || '',
        profession: user.profession || '',
        currentPosition: user.currentPosition || '',
        yearsExperience: user.yearsExperience || 0,
        expertiseAreas: user.expertiseAreas || []
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
      
      const result = await updateProfile({
        name: formData.name,
        avatar: formData.avatar,
        bio: formData.bio,
        organization: formData.organization,
        phone: formData.phone,
        linkedinUrl: formData.linkedinUrl,
        profession: formData.profession,
        currentPosition: formData.currentPosition,
        yearsExperience: formData.yearsExperience,
        expertiseAreas: formData.expertiseAreas
      })

      if (result.success) {
        toast.success('Perfil actualizado', 'Los cambios se han guardado correctamente')
        setIsEditing(false)
        setShowSidebar(false)
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
        bio: user.bio || '',
        organization: user.organization || '',
        phone: user.phone || '',
        linkedinUrl: user.linkedinUrl || '',
        profession: user.profession || '',
        currentPosition: user.currentPosition || '',
        yearsExperience: user.yearsExperience || 0,
        expertiseAreas: user.expertiseAreas || []
      })
    }
    setIsEditing(false)
    setShowSidebar(false)
  }

  const handleEditClick = () => {
    setIsEditing(true)
    setShowSidebar(true)
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
      <div className="w-full max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient mb-2">
            👤 Mi Perfil
          </h1>
          <p className="text-dark-text-secondary">
            Gestiona tu información personal y configuración de cuenta
          </p>
        </div>

        {/* Perfil compacto */}
        <div className="card p-5 mb-6">
          {/* DIV SUPERIOR - Botón de editar centrado a la derecha */}
          <div className="w-full flex justify-end mb-0">
            <Button 
              ghost 
              onClick={handleEditClick}
              className="flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
              </svg>
              Editar Perfil
            </Button>
          </div>

          {/* CONTENIDO PRINCIPAL - 3 divs separados */}
          <div className="flex gap-6">
            {/* DIV LOGO - Avatar centrado vertical y horizontalmente */}
            <div className="w-50 flex items-center justify-center">
              <div className="flex flex-col items-center">
                {formData.avatar ? (
                  <img
                    src={formData.avatar}
                    alt="Avatar"
                    className="w-32 h-32 rounded-full object-cover border-4 border-dark-bg-tertiary shadow-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'Usuario')}&background=2DD4BF&color=1F2937&size=128`
                    }}
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-micmac-primary-500 to-micmac-secondary-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                    {(formData.name || formData.email || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
            
            {/* DIV INFORMACIÓN - Datos del usuario */}
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-dark-text-primary mb-1">
                  {formData.name || 'Sin nombre'}
                </h2>
                <p className="text-dark-text-secondary mb-2">
                  {formData.email}
                </p>
                <div className={`px-3 py-1 rounded-full text-sm font-medium inline-block ${
                  formData.role === 'MODERATOR'
                    ? 'bg-micmac-secondary-500/20 text-micmac-secondary-300'
                    : 'bg-micmac-primary-500/20 text-micmac-primary-300'
                }`}>
                  {formData.role === 'MODERATOR' ? '🛡️ Moderador' : '👨‍🔬 Experto'}
                </div>
              </div>
              
              {/* Profesión y Cargo */}
              {(formData.profession || formData.currentPosition) && (
                <div className="space-y-2">
                  {formData.profession && (
                    <div className="text-sm text-dark-text-primary font-medium">
                      🎓 {formData.profession}
                    </div>
                  )}
                  {formData.currentPosition && (
                    <div className="text-sm text-dark-text-secondary">
                      💼 {formData.currentPosition}
                    </div>
                  )}
                </div>
              )}
              
              {/* Información de contacto */}
              <div className="space-y-1 text-sm text-dark-text-secondary">
                {formData.organization && (
                  <div>📍 {formData.organization}</div>
                )}
                {formData.phone && (
                  <div>📞 {formData.phone}</div>
                )}
                {formData.linkedinUrl && (
                  <div>
                    <a 
                      href={formData.linkedinUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      💼 LinkedIn
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* DIV RADAR - Chart de expertise separado */}
            <div className="w-80 hidden lg:flex flex-col items-center justify-center">
              <div className="w-full h-64">
                <ExpertiseRadarChart expertiseAreas={formData.expertiseAreas} />
              </div>
            </div>
          </div>
          
          {/* Biografía */}
          {formData.bio && (
            <div className="mt-6 pt-4 border-t border-dark-bg-tertiary">
              <h4 className="text-sm font-medium text-dark-text-primary mb-2">Descripción personal</h4>
              <p className="text-dark-text-secondary text-sm leading-relaxed">
                {formData.bio}
              </p>
            </div>
          )}
        </div>

        {/* Áreas de Expertise - Protagonista */}
        <div className="card p-6">
          <ExpertiseAreasSection
            expertiseAreas={formData.expertiseAreas}
            onAreasChange={(areas) => setFormData(prev => ({ ...prev, expertiseAreas: areas }))}
            isEditing={!showSidebar}
          />
        </div>

        {/* Sidebar de edición */}
        <div className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          showSidebar ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}>
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={handleCancel}
          />
          
          {/* Sidebar */}
          <div className={`absolute top-0 right-0 h-full w-[480px] bg-dark-bg-secondary border-l border-dark-bg-tertiary shadow-2xl transform transition-all duration-300 ease-out ${
            showSidebar ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
          }`}>
              <div className="flex flex-col h-full">
                {/* Header del sidebar */}
                <div className="flex items-center justify-between p-6 border-b border-dark-bg-tertiary">
                  <h3 className="text-lg font-semibold text-dark-text-primary">
                    Editar Información Personal
                  </h3>
                  <button
                    onClick={handleCancel}
                    className="text-dark-text-secondary hover:text-dark-text-primary"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Contenido scrolleable */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Nombre */}
                  <div>
                    <label className="block text-sm font-medium text-dark-text-primary mb-2">
                      Nombre completo
                    </label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Ingresa tu nombre completo"
                      disabled={isSaving}
                    />
                  </div>

                  {/* Avatar URL */}
                  <div>
                    <label className="block text-sm font-medium text-dark-text-primary mb-2">
                      Avatar (URL de imagen)
                    </label>
                    <Input
                      type="url"
                      name="avatar"
                      value={formData.avatar}
                      onChange={handleInputChange}
                      placeholder="https://ejemplo.com/avatar.jpg"
                      disabled={isSaving}
                    />
                  </div>

                  {/* Organización y Teléfono en la misma fila */}
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-dark-text-primary mb-2">
                        Organización
                      </label>
                      <Input
                        type="text"
                        name="organization"
                        value={formData.organization}
                        onChange={handleInputChange}
                        placeholder="Empresa, Universidad..."
                        disabled={isSaving}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-dark-text-primary mb-2">
                        Teléfono
                      </label>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+1 234 567 8900"
                        disabled={isSaving}
                      />
                    </div>
                  </div>

                  {/* LinkedIn */}
                  <div>
                    <label className="block text-sm font-medium text-dark-text-primary mb-2">
                      LinkedIn Profile
                    </label>
                    <Input
                      type="url"
                      name="linkedinUrl"
                      value={formData.linkedinUrl}
                      onChange={handleInputChange}
                      placeholder="https://linkedin.com/in/tu-perfil"
                      disabled={isSaving}
                    />
                  </div>

                  {/* Profesión Principal y Cargo Actual */}
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-dark-text-primary mb-2">
                        Profesión Principal
                      </label>
                      <Input
                        type="text"
                        name="profession"
                        value={formData.profession}
                        onChange={handleInputChange}
                        placeholder="Ej: Ingeniero, Abogado, Médico..."
                        disabled={isSaving}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-dark-text-primary mb-2">
                        Cargo Actual
                      </label>
                      <Input
                        type="text"
                        name="currentPosition"
                        value={formData.currentPosition}
                        onChange={handleInputChange}
                        placeholder="Ej: Director General, Consultor Senior..."
                        disabled={isSaving}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-dark-text-primary mb-2">
                        Años de Experiencia Total
                      </label>
                      <Input
                        type="number"
                        name="yearsExperience"
                        value={formData.yearsExperience}
                        onChange={handleInputChange}
                        placeholder="Ej: 15"
                        min="0"
                        max="60"
                        disabled={isSaving}
                      />
                    </div>
                  </div>

                  {/* Descripción personal */}
                  <div>
                    <label className="block text-sm font-medium text-dark-text-primary mb-2">
                      Descripción personal
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Cuéntanos sobre ti, tu experiencia y áreas de expertise..."
                      rows={4}
                      disabled={isSaving}
                      className="w-full px-3 py-2 bg-dark-bg-tertiary border border-dark-bg-tertiary rounded-md text-dark-text-primary placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-micmac-primary-500 resize-vertical"
                    />
                  </div>
                </div>

                {/* Footer con botones */}
                <div className="p-6 border-t border-dark-bg-tertiary bg-dark-bg-primary">
                  <div className="flex gap-4">
                    <Button
                      ghost
                      onClick={handleCancel}
                      disabled={isSaving}
                      className="flex-1 h-12 text-base font-medium hover:bg-dark-bg-tertiary transition-colors"
                    >
                      Cancelar
                    </Button>
                    <Button
                      color="primary"
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex-1 h-12 text-base font-medium flex items-center justify-center gap-2 bg-micmac-primary-500 hover:bg-micmac-primary-600 transition-colors"
                    >
                      {isSaving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          Guardando...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                          Guardar Cambios
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </AppLayout>
  )
}
