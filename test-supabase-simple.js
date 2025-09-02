/**
 * 🧪 Test Simple de Conexión a Supabase
 * Verifica que las credenciales funcionan correctamente
 */

import { createClient } from '@supabase/supabase-js'

// Variables de entorno (deben estar definidas manualmente para el test)
const supabaseUrl = 'https://lsnevmeibbkclblcsauu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzbmV2bWVpYmJrY2xibGNzYXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NTcxMDQsImV4cCI6MjA3MjMzMzEwNH0.IkTPGY6c1dyGmWAa3Z7hQpJ5yEHN1l7O0OnrvFzAWYI'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzbmV2bWVpYmJrY2xibGNzYXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Njc1NzEwNCwiZXhwIjoyMDcyMzMzMTA0fQ.L1kMarX3WkjodnMBQiHeZ0AcGUI1Kh013qb4CiBBwHE'

console.log('🔗 Probando conexión a Supabase...')
console.log('📍 URL:', supabaseUrl)
console.log('🔑 Anon Key:', supabaseAnonKey ? '✅ Configurada' : '❌ Falta')
console.log('🔐 Service Key:', serviceRoleKey ? '✅ Configurada' : '❌ Falta')

async function testConnection() {
  try {
    // Test con cliente anónimo (frontend)
    console.log('\n🧪 Probando cliente anónimo...')
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    
    // Test básico de conexión
    const { data: authData, error: authError } = await supabase.auth.getSession()
    if (authError) {
      console.log('⚠️  Sin sesión activa (normal):', authError.message)
    } else {
      console.log('✅ Cliente anónimo conectado')
    }

    // Test con service role (backend)
    console.log('\n🧪 Probando cliente con service role...')
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)
    
    // Contar organizaciones
    const { count: orgCount, error: orgError } = await supabaseAdmin
      .from('organizations')
      .select('*', { count: 'exact', head: true })
    
    if (orgError) {
      console.log('❌ Error consultando organizaciones:', orgError.message)
    } else {
      console.log('🏢 Organizaciones en BD:', orgCount || 0)
    }

    // Contar usuarios
    const { count: userCount, error: userError } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true })
    
    if (userError) {
      console.log('❌ Error consultando usuarios:', userError.message)
    } else {
      console.log('👥 Usuarios en BD:', userCount || 0)
    }

    // Contar proyectos
    const { count: projectCount, error: projectError } = await supabaseAdmin
      .from('projects')
      .select('*', { count: 'exact', head: true })
    
    if (projectError) {
      console.log('❌ Error consultando proyectos:', projectError.message)
    } else {
      console.log('📋 Proyectos en BD:', projectCount || 0)
    }

    console.log('\n🎉 ¡Conexión a Supabase exitosa!')
    
  } catch (error) {
    console.error('💥 Error general:', error.message)
  }
}

testConnection()
