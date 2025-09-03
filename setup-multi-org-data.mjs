#!/usr/bin/env node

/**
 * Script para configurar datos multi-organizacionales en Supabase
 * Crea organizaciones y membresías para demostrar el sistema multi-org
 */

import { createClient } from '@supabase/supabase-js'

// Configuración de Supabase (usa variables de entorno o fallback)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gkqkgolrxmgqpkqxjhgz.supabase.co'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrcWtnb2xyeG1ncXBrcXhqaGd6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNzA0Mjc0OCwiZXhwIjoyMDUyNjE4NzQ4fQ.x6iDkFJNVhPxCEQwIzFSQpzRNqgJJJWbHJ0pLhPOKQI'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function main() {
  console.log('🏢 Configurando sistema multi-organizacional...\n')

  try {
    // 1. Crear organizaciones
    console.log('📋 Creando organizaciones...')
    const organizations = [
      {
        id: 'org-techcorp',
        name: 'TechCorp Solutions',
        slug: 'techcorp',
        domain: 'techcorp.com',
        settings: {
          plan: 'PRO',
          limits: { projects: 50, experts: 100 }
        }
      },
      {
        id: 'org-healthplus',
        name: 'HealthPlus Medical',
        slug: 'healthplus',
        domain: 'healthplus.org',
        settings: {
          plan: 'ENTERPRISE',
          limits: { projects: 100, experts: 200 }
        }
      },
      {
        id: 'org-startup',
        name: 'StartupInc',
        slug: 'startup',
        domain: 'startupinc.io',
        settings: {
          plan: 'FREE',
          limits: { projects: 5, experts: 20 }
        }
      }
    ]

    for (const org of organizations) {
      const { error } = await supabase
        .from('organizations')
        .upsert(org, { onConflict: 'id' })
      
      if (error) {
        console.error(`❌ Error creando ${org.name}:`, error.message)
      } else {
        console.log(`✅ Organización creada: ${org.name}`)
      }
    }

    // 2. Obtener usuarios existentes
    console.log('\n👤 Obteniendo usuarios existentes...')
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, role, name')

    if (usersError) {
      console.error('❌ Error obteniendo usuarios:', usersError.message)
      return
    }

    console.log(`✅ Encontrados ${users.length} usuarios`)

    // 3. Crear membresías multi-organizacionales
    console.log('\n🔗 Creando membresías...')
    
    const memberships = [
      // admin@demo.com: MODERATOR en TechCorp, MEMBER en HealthPlus
      {
        user_id: users.find(u => u.email === 'admin@demo.com')?.id,
        organization_id: 'org-techcorp',
        role: 'MODERATOR',
        status: 'ACTIVE'
      },
      {
        user_id: users.find(u => u.email === 'admin@demo.com')?.id,
        organization_id: 'org-healthplus',
        role: 'MEMBER',
        status: 'ACTIVE'
      },
      
      // moderator@demo.com: ADMIN en HealthPlus, MODERATOR en StartupInc
      {
        user_id: users.find(u => u.email === 'moderator@demo.com')?.id,
        organization_id: 'org-healthplus',
        role: 'ADMIN',
        status: 'ACTIVE'
      },
      {
        user_id: users.find(u => u.email === 'moderator@demo.com')?.id,
        organization_id: 'org-startup',
        role: 'MODERATOR',
        status: 'ACTIVE'
      },
      
      // expert@demo.com: MEMBER en TechCorp, OWNER en StartupInc
      {
        user_id: users.find(u => u.email === 'expert@demo.com')?.id,
        organization_id: 'org-techcorp',
        role: 'MEMBER',
        status: 'ACTIVE'
      },
      {
        user_id: users.find(u => u.email === 'expert@demo.com')?.id,
        organization_id: 'org-startup',
        role: 'OWNER',
        status: 'ACTIVE'
      },
      
      // Otros usuarios existentes
      {
        user_id: users.find(u => u.email === 'expert1@techcorp.com')?.id,
        organization_id: 'org-techcorp',
        role: 'MEMBER',
        status: 'ACTIVE'
      },
      {
        user_id: users.find(u => u.email === 'expert2@healthplus.org')?.id,
        organization_id: 'org-healthplus',
        role: 'MEMBER',
        status: 'ACTIVE'
      }
    ].filter(m => m.user_id) // Solo membresías con usuarios válidos

    for (const membership of memberships) {
      const { error } = await supabase
        .from('user_organizations')
        .upsert({
          id: `${membership.user_id}-${membership.organization_id}`,
          ...membership
        }, { onConflict: 'id' })
      
      if (error) {
        console.error(`❌ Error creando membresía:`, error.message)
      } else {
        const user = users.find(u => u.id === membership.user_id)
        const org = organizations.find(o => o.id === membership.organization_id)
        console.log(`✅ Membresía: ${user?.email} → ${org?.name} (${membership.role})`)
      }
    }

    // 4. Actualizar current_organization_id en profiles
    console.log('\n🎯 Estableciendo organizaciones activas...')
    
    const currentOrgUpdates = [
      { email: 'admin@demo.com', org_id: 'org-techcorp' },
      { email: 'moderator@demo.com', org_id: 'org-healthplus' },
      { email: 'expert@demo.com', org_id: 'org-startup' },
      { email: 'expert1@techcorp.com', org_id: 'org-techcorp' },
      { email: 'expert2@healthplus.org', org_id: 'org-healthplus' }
    ]

    for (const update of currentOrgUpdates) {
      const user = users.find(u => u.email === update.email)
      if (user) {
        const { error } = await supabase
          .from('profiles')
          .update({ current_organization_id: update.org_id })
          .eq('id', user.id)
        
        if (error) {
          console.error(`❌ Error actualizando org activa para ${update.email}:`, error.message)
        } else {
          console.log(`✅ Org activa: ${update.email} → ${update.org_id}`)
        }
      }
    }

    console.log('\n🎉 ¡Sistema multi-organizacional configurado exitosamente!')
    console.log('\n📊 Resumen:')
    console.log(`   • ${organizations.length} organizaciones creadas`)
    console.log(`   • ${memberships.length} membresías establecidas`)
    console.log(`   • ${currentOrgUpdates.length} organizaciones activas configuradas`)
    
    console.log('\n🔍 Casos de uso demostrados:')
    console.log('   • admin@demo.com: Moderador en TechCorp, Miembro en HealthPlus')
    console.log('   • moderator@demo.com: Admin en HealthPlus, Moderador en StartupInc')
    console.log('   • expert@demo.com: Miembro en TechCorp, Dueño en StartupInc')

  } catch (error) {
    console.error('💥 Error general:', error.message)
    process.exit(1)
  }
}

main()
