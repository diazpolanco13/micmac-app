#!/usr/bin/env node

/**
 * Script rápido para arreglar roles de usuarios existentes
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lsnevmeibbkclblcsauu.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzbmV2bWVpYmJrY2xibGNzYXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Njc1NzEwNCwiZXhwIjoyMDcyMzMzMTA0fQ.L1kMarX3WkjodnMBQiHeZ0AcGUI1Kh013qb4CiBBwHE'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function fixUserRoles() {
  console.log('🔧 Arreglando roles de usuarios existentes...\n')

  try {
    // 1. Obtener todos los usuarios de auth
    console.log('📋 Obteniendo usuarios de auth.users...')
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
    
    if (authError) {
      console.error('❌ Error obteniendo usuarios auth:', authError.message)
      return
    }

    console.log(`✅ Encontrados ${authUsers.users.length} usuarios en auth`)

    // 2. Verificar tabla users
    console.log('\n📋 Verificando tabla public.users...')
    const { data: publicUsers, error: publicError } = await supabase
      .from('users')
      .select('*')

    if (publicError) {
      console.error('❌ Error consultando tabla users:', publicError.message)
    } else {
      console.log(`✅ Encontrados ${publicUsers.length} usuarios en tabla users`)
    }

    // 3. Sincronizar usuarios
    console.log('\n🔄 Sincronizando usuarios...')
    
    const rolesMap = {
      'admin@demo.com': 'MODERATOR',
      'moderator@demo.com': 'MODERATOR', 
      'expert@demo.com': 'EXPERT'
    }

    for (const authUser of authUsers.users) {
      const email = authUser.email
      const targetRole = rolesMap[email] || 'EXPERT'
      
      console.log(`👤 Procesando: ${email} → ${targetRole}`)

      // Insertar/actualizar en tabla users
      const { error: upsertError } = await supabase
        .from('users')
        .upsert({
          id: authUser.id,
          email: email,
          role: targetRole,
          name: authUser.user_metadata?.name || authUser.email.split('@')[0],
          created_at: authUser.created_at,
          updated_at: new Date().toISOString()
        })

      if (upsertError) {
        console.error(`   ❌ Error: ${upsertError.message}`)
      } else {
        console.log(`   ✅ Usuario ${email} sincronizado`)
      }
    }

    console.log('\n🎉 Sincronización completada!')

  } catch (error) {
    console.error('❌ Error crítico:', error.message)
  }
}

fixUserRoles().catch(console.error)
