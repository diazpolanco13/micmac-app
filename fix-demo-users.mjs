#!/usr/bin/env node

/**
 * Script para crear usuarios demo con roles correctos
 * Admin, Moderador, Experto
 */

import { createClient } from '@supabase/supabase-js'

// Variables de entorno con fallbacks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lsnevmeibbkclblcsauu.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzbmV2bWVpYmJrY2xibGNzYXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Njc1NzEwNCwiZXhwIjoyMDcyMzMzMTA0fQ.L1kMarX3WkjodnMBQiHeZ0AcGUI1Kh013qb4CiBBwHE'

console.log('🔧 Configuración Supabase:')
console.log(`   URL: ${supabaseUrl}`)
console.log(`   Service Key: ${supabaseServiceKey.substring(0, 20)}...`)
console.log('')

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createDemoUsers() {
  console.log('🔧 Creando usuarios demo con roles correctos...\n')

  const demoUsers = [
    {
      email: 'admin@demo.com',
      password: 'demo123',
      role: 'MODERATOR', // Admin con privilegios completos
      name: 'Carlos Hernández',
      description: 'Administrador del sistema'
    },
    {
      email: 'moderator@demo.com', 
      password: 'demo123',
      role: 'MODERATOR',
      name: 'Ana García',
      description: 'Moderador de proyectos'
    },
    {
      email: 'expert@demo.com',
      password: 'demo123', 
      role: 'EXPERT',
      name: 'Dr. Luis Experto',
      description: 'Experto en análisis prospectivos'
    }
  ]

  for (const userData of demoUsers) {
    try {
      console.log(`👤 Creando usuario: ${userData.email} (${userData.role})`)
      
      // 1. Crear usuario en auth.users
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
        user_metadata: {
          name: userData.name,
          role: userData.role
        }
      })

      if (authError) {
        if (authError.message.includes('already registered')) {
          console.log(`   ⚠️ Usuario ${userData.email} ya existe, actualizando...`)
          
          // Actualizar usuario existente
          const { data: users } = await supabase.auth.admin.listUsers()
          const existingUser = users.users.find(u => u.email === userData.email)
          
          if (existingUser) {
            // Actualizar en tabla users
            const { error: updateError } = await supabase
              .from('users')
              .upsert({
                id: existingUser.id,
                email: userData.email,
                role: userData.role,
                name: userData.name,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })
            
            if (updateError) {
              console.error(`   ❌ Error actualizando tabla users:`, updateError.message)
            } else {
              console.log(`   ✅ Tabla users actualizada`)
            }

            // Actualizar perfil en profiles
            const { error: profileError } = await supabase
              .from('profiles')
              .upsert({
                id: existingUser.id,
                email: userData.email,
                name: userData.name,
                bio: userData.description,
                is_active: true,
                updated_at: new Date().toISOString()
              })

            if (profileError) {
              console.error(`   ❌ Error actualizando profiles:`, profileError.message)
            } else {
              console.log(`   ✅ Perfil actualizado`)
            }

            console.log(`   ✅ Usuario ${userData.email} completamente actualizado`)
          }
        } else {
          console.error(`   ❌ Error creando ${userData.email}:`, authError.message)
        }
        continue
      }

      if (authData.user) {
        // 2. Crear/actualizar en tabla users  
        const { error: userError } = await supabase
          .from('users')
          .upsert({
            id: authData.user.id,
            email: userData.email,
            role: userData.role,
            name: userData.name,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

        if (userError) {
          console.error(`   ❌ Error en tabla users:`, userError.message)
        }

        // 3. Crear/actualizar perfil en profiles
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: authData.user.id,
            email: userData.email,
            name: userData.name,
            bio: userData.description,
            is_active: true
          })

        if (profileError) {
          console.error(`   ❌ Error en tabla profiles:`, profileError.message)
        }

        console.log(`   ✅ Usuario ${userData.email} creado exitosamente`)
      }

    } catch (error) {
      console.error(`   ❌ Error crítico con ${userData.email}:`, error.message)
    }
  }

  console.log('\n🎉 Proceso completado!')
  console.log('\n📋 Usuarios demo disponibles:')
  console.log('   🔑 admin@demo.com / demo123 (MODERATOR - Admin)')
  console.log('   👨‍💼 moderator@demo.com / demo123 (MODERATOR)')  
  console.log('   🧑‍🔬 expert@demo.com / demo123 (EXPERT)')
}

createDemoUsers().catch(console.error)
