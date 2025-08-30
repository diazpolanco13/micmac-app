'use client'

import { useState, useEffect } from 'react'
import { useMockAuth } from '@/contexts/MockAuthContext'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
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
      router.push('/')
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
      <div className="container-app relative">
        {/* Breadcrumbs */}
        <Breadcrumbs />
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient mb-2">
            👤 Mi Perfil
          </h1>
          <p className="text-dark-text-secondary">
            Gestiona tu información personal y configuración de cuenta
          </p>
        </div>

        {/* PERFIL UNIFICADO - Un solo panel con toda la información */}
        <div className="card p-8 mb-6">
          {/* Header con botón de editar */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-dark-text-primary">Información Personal</h2>
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

          {/* Layout unificado con toda la información */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Avatar y datos básicos */}
            <div className="lg:col-span-3 text-center">
              {formData.avatar ? (
                <img
                  src={formData.avatar}
                  alt="Avatar"
                  className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-micmac-primary-500/20 shadow-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'Usuario')}&background=2DD4BF&color=1F2937&size=128`
                  }}
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-micmac-primary-500 to-micmac-secondary-500 flex items-center justify-center text-3xl font-bold text-white mx-auto mb-4 shadow-lg">
                  {(formData.name || formData.email || 'U').charAt(0).toUpperCase()}
                </div>
              )}
              
              <h1 className="text-2xl font-bold text-dark-text-primary mb-2">
                {formData.name || 'Sin nombre'}
              </h1>
              
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-6 ${
                formData.role === 'MODERATOR'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-blue-500/20 text-blue-400'
              }`}>
                {formData.role === 'MODERATOR' ? 'Moderador' : 'Experto'}
              </div>

              {/* Información de contacto */}
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-gray-400">📧</span>
                  <span className="text-dark-text-secondary">{formData.email}</span>
                </div>
                {formData.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-gray-400">📱</span>
                    <span className="text-dark-text-secondary">{formData.phone}</span>
                  </div>
                )}
                {formData.linkedinUrl && (
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-gray-400">💼</span>
                    <a 
                      href={formData.linkedinUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Ver perfil ↗
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Información profesional */}
            <div className="lg:col-span-6">
              <h3 className="text-lg font-semibold text-dark-text-primary mb-4 flex items-center gap-2">
                💼 Información Profesional
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {formData.profession && (
                  <div className="p-3 bg-dark-bg-tertiary/20 rounded-lg">
                    <p className="text-xs text-dark-text-muted mb-1">Profesión</p>
                    <p className="text-dark-text-primary font-medium">{formData.profession}</p>
                  </div>
                )}
                
                {formData.currentPosition && (
                  <div className="p-3 bg-dark-bg-tertiary/20 rounded-lg">
                    <p className="text-xs text-dark-text-muted mb-1">Cargo Actual</p>
                    <p className="text-dark-text-primary font-medium">{formData.currentPosition}</p>
                  </div>
                )}
                
                {formData.organization && (
                  <div className="p-3 bg-dark-bg-tertiary/20 rounded-lg">
                    <p className="text-xs text-dark-text-muted mb-1">Organización</p>
                    <p className="text-dark-text-primary font-medium">{formData.organization}</p>
                  </div>
                )}
                
                {formData.yearsExperience > 0 && (
                  <div className="p-3 bg-dark-bg-tertiary/20 rounded-lg">
                    <p className="text-xs text-dark-text-muted mb-1">Experiencia</p>
                    <p className="text-dark-text-primary font-medium">{formData.yearsExperience} años</p>
                  </div>
                )}
              </div>

              {/* Descripción */}
              {formData.bio && (
                <div>
                  <h4 className="text-sm font-semibold text-dark-text-primary mb-2">📝 Descripción</h4>
                  <div className="p-4 bg-dark-bg-tertiary/20 rounded-lg">
                    <p className="text-dark-text-secondary text-sm leading-relaxed">{formData.bio}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Fortalezas */}
            <div className="lg:col-span-3">
              <h3 className="text-lg font-semibold text-dark-text-primary mb-4 text-center flex items-center justify-center gap-2">
                📊 Fortalezas
              </h3>
              <div className="h-80 flex items-center justify-center">
                <ExpertiseRadarChart expertiseAreas={formData.expertiseAreas} />
              </div>
            </div>
          </div>
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
          <div className={`absolute top-0 right-0 h-full w-[420px] bg-dark-bg-secondary border-l border-dark-bg-tertiary shadow-2xl transform transition-all duration-300 ease-out ${
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
                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                  
                  {/* SECCIÓN: Información Básica */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-dark-text-primary border-b border-dark-bg-tertiary pb-2">
                      Información Básica
                    </h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-dark-text-primary mb-2">
                        Nombre completo
                      </label>
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Tu nombre completo"
                        disabled={isSaving}
                      />
                    </div>

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

                    <div>
                      <label className="block text-sm font-medium text-dark-text-primary mb-2">
                        Descripción personal
                      </label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        placeholder="Cuéntanos sobre ti, tu experiencia..."
                        rows={3}
                        disabled={isSaving}
                        className="w-full px-3 py-2 bg-dark-bg-tertiary border border-dark-bg-tertiary rounded-md text-dark-text-primary placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-micmac-primary-500 resize-vertical"
                      />
                    </div>
                  </div>

                  {/* SECCIÓN: Información Profesional */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-dark-text-primary border-b border-dark-bg-tertiary pb-2">
                      Información Profesional
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-dark-text-primary mb-2">
                          Profesión
                        </label>
                        <Input
                          type="text"
                          name="profession"
                          value={formData.profession}
                          onChange={handleInputChange}
                          placeholder="Ingeniero, Abogado..."
                          disabled={isSaving}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-dark-text-primary mb-2">
                          Años de Experiencia
                        </label>
                        <Input
                          type="number"
                          name="yearsExperience"
                          value={formData.yearsExperience}
                          onChange={handleInputChange}
                          placeholder="15"
                          min="0"
                          max="60"
                          disabled={isSaving}
                        />
                      </div>
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
                        placeholder="Director, Consultor Senior..."
                        disabled={isSaving}
                      />
                    </div>

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
                  </div>

                  {/* SECCIÓN: Información de Contacto */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-dark-text-primary border-b border-dark-bg-tertiary pb-2">
                      Información de Contacto
                    </h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-dark-text-primary mb-2">
                        Teléfono
                      </label>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+57 300 123 4567"
                        disabled={isSaving}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-dark-text-primary mb-2">
                        LinkedIn
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
