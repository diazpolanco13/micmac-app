/**
 * 🧪 Test de Conexión a Supabase
 * Verifica que las credenciales funcionan correctamente
 */

// Cargar variables de entorno
import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

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
    const { data: orgs, error: orgError } = await supabaseAdmin
      .from('organizations')
      .select('id', { count: 'exact', head: true })
    
    if (orgError) {
      console.log('❌ Error consultando organizaciones:', orgError.message)
    } else {
      console.log('🏢 Organizaciones en BD:', orgs?.length || 0)
    }

    // Contar usuarios
    const { data: users, error: userError } = await supabaseAdmin
      .from('users')
      .select('id', { count: 'exact', head: true })
    
    if (userError) {
      console.log('❌ Error consultando usuarios:', userError.message)
    } else {
      console.log('👥 Usuarios en BD:', users?.length || 0)
    }

    // Contar proyectos
    const { data: projects, error: projectError } = await supabaseAdmin
      .from('projects')
      .select('id', { count: 'exact', head: true })
    
    if (projectError) {
      console.log('❌ Error consultando proyectos:', projectError.message)
    } else {
      console.log('📋 Proyectos en BD:', projects?.length || 0)
    }

    console.log('\n🎉 ¡Conexión a Supabase exitosa!')
    
  } catch (error) {
    console.error('💥 Error general:', error.message)
  }
}

testConnection()
