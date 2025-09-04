'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

export default function TestSupabasePage() {
  const { user } = useAuth()
  const [testValue, setTestValue] = useState('')
  const [savedValue, setSavedValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  
  // Función para agregar logs con timestamp
  const addLog = (message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
    const timestamp = new Date().toISOString().split('T')[1].substring(0, 12)
    const emoji = type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warning' ? '⚠️' : '📝'
    const logMessage = `[${timestamp}] ${emoji} ${message}`
    console.log(logMessage)
    setLogs(prev => [...prev, logMessage])
  }

  // Cargar valor inicial desde la BD
  useEffect(() => {
    if (user) {
      loadCurrentValue()
    }
  }, [user])

  const loadCurrentValue = async () => {
    if (!user) {
      addLog('No hay usuario autenticado', 'error')
      return
    }

    addLog(`Cargando valor actual para usuario: ${user.email}`)
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('name, bio, organization')
        .eq('id', user.id)
        .single()

      if (error) {
        addLog(`Error cargando: ${error.message}`, 'error')
        return
      }

      if (data) {
        const displayValue = data.name || data.bio || data.organization || ''
        setSavedValue(displayValue)
        setTestValue(displayValue)
        addLog(`Valor cargado: "${displayValue}"`, 'success')
      } else {
        addLog('No hay datos en el perfil', 'info')
      }
    } catch (error) {
      addLog(`Error inesperado: ${error}`, 'error')
    }
  }

  // Guardar valor usando botón HTML nativo
  const handleSave = async () => {
    if (!user) {
      addLog('No hay usuario autenticado', 'error')
      return
    }

    setLoading(true)
    addLog('========== INICIANDO GUARDADO ==========', 'info')
    addLog(`Usuario ID: ${user.id}`)
    addLog(`Email: ${user.email}`)
    addLog(`Valor a guardar: "${testValue}"`)

    try {
      // 1. Verificar sesión
      addLog('Verificando sesión de Supabase...')
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        addLog(`Error de sesión: ${sessionError.message}`, 'error')
      } else if (!session) {
        addLog('No hay sesión activa', 'warning')
      } else {
        addLog(`Sesión válida para: ${session.user.email}`, 'success')
      }

      // 2. Intentar actualizar directamente (RLS ya está corregido)
      addLog('Ejecutando UPDATE directo con RLS corregido...')
      
      const updatePromise = supabase
        .from('profiles')
        .update({ 
          name: testValue,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout: UPDATE tardó más de 5s')), 5000)
      )

      const result = await Promise.race([
        updatePromise,
        timeoutPromise
      ]) as any

      if (result.error) {
        addLog(`Error actualizando: ${result.error.message}`, 'error')
        addLog(`Código error: ${result.error.code}`, 'error')
        addLog(`Detalles: ${JSON.stringify(result.error.details)}`, 'error')
      } else if (result.data) {
        addLog('UPDATE completado exitosamente', 'success')
        addLog(`Datos actualizados: ${JSON.stringify(result.data[0])}`, 'success')
        setSavedValue(testValue)
        
        // 3. Verificar que se guardó
        addLog('Verificando que el cambio persistió...')
        const { data: checkData, error: checkError } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', user.id)
          .single()
        
        if (checkError) {
          addLog(`Error verificando: ${checkError.message}`, 'error')
        } else if (checkData?.name === testValue) {
          addLog('✅ CAMBIO VERIFICADO Y PERSISTIDO', 'success')
        } else {
          addLog(`⚠️ Valor en BD: "${checkData?.name}" vs esperado: "${testValue}"`, 'warning')
        }
      }
      
    } catch (error) {
      if (error instanceof Error) {
        addLog(`Error: ${error.message}`, 'error')
        if (error.message.includes('Timeout')) {
          addLog('La operación tardó demasiado. Posible problema de conexión o RLS', 'warning')
        }
      } else {
        addLog(`Error inesperado: ${error}`, 'error')
      }
    } finally {
      setLoading(false)
      addLog('========== FIN DE OPERACIÓN ==========', 'info')
    }
  }

  // Limpiar logs
  const clearLogs = () => {
    setLogs([])
    addLog('Logs limpiados', 'info')
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">No autenticado</h1>
          <p className="text-gray-400">Por favor, inicia sesión primero</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">
          🧪 Test Supabase - Campo Simple
        </h1>
        
        {/* Panel de información */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">📋 Información del Usuario</h2>
          <div className="space-y-2 text-gray-300">
            <div><span className="text-gray-400">ID:</span> {user.id}</div>
            <div><span className="text-gray-400">Email:</span> {user.email}</div>
            <div><span className="text-gray-400">Rol:</span> {user.role}</div>
            <div><span className="text-gray-400">Valor guardado:</span> "{savedValue}"</div>
          </div>
        </div>

        {/* Campo de prueba - HTML NATIVO sin HeadlessUI */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">✏️ Campo de Prueba</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="test-field" className="block text-sm font-medium text-gray-300 mb-2">
                Valor de prueba (se guardará en campo 'name' del perfil)
              </label>
              <input
                id="test-field"
                type="text"
                value={testValue}
                onChange={(e) => setTestValue(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Escribe algo aquí..."
                disabled={loading}
              />
            </div>

            <div className="flex gap-4">
              {/* Botón HTML NATIVO - sin componentes externos */}
              <button
                onClick={handleSave}
                disabled={loading || testValue === savedValue}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  loading || testValue === savedValue
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                }`}
              >
                {loading ? '⏳ Guardando...' : '💾 Guardar en Supabase'}
              </button>

              <button
                onClick={loadCurrentValue}
                disabled={loading}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
              >
                🔄 Recargar
              </button>

              <button
                onClick={clearLogs}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
              >
                🗑️ Limpiar Logs
              </button>
            </div>
          </div>
        </div>

        {/* Panel de Logs */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">📊 Logs en Tiempo Real</h2>
          <div className="bg-black rounded-lg p-4 font-mono text-sm max-h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="text-gray-500">No hay logs aún...</div>
            ) : (
              logs.map((log, index) => (
                <div 
                  key={index} 
                  className={`mb-1 ${
                    log.includes('❌') ? 'text-red-400' :
                    log.includes('✅') ? 'text-green-400' :
                    log.includes('⚠️') ? 'text-yellow-400' :
                    'text-gray-300'
                  }`}
                >
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Instrucciones */}
        <div className="mt-6 p-4 bg-blue-900/30 border border-blue-700 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-300 mb-2">📌 Instrucciones:</h3>
          <ul className="text-sm text-blue-200 space-y-1">
            <li>1. Esta página usa HTML nativo, sin HeadlessUI ni componentes externos</li>
            <li>2. El campo se conecta directamente con Supabase</li>
            <li>3. Los logs muestran exactamente qué está pasando</li>
            <li>4. Si funciona aquí pero no en /profile, el problema es HeadlessUI</li>
            <li>5. Si NO funciona aquí, el problema es la configuración de Supabase/RLS</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
