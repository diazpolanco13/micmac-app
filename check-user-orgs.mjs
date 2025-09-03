#!/usr/bin/env node

/**
 * Script para verificar el estado de organizaciones de usuarios demo
 */

import { createClient } from '@supabase/supabase-js'

// Configuración de Supabase
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gkqkgolrxmgqpkqxjhgz.supabase.co'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrcWtnb2xyeG1ncXBrcXhqaGd6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNzA0Mjc0OCwiZXhwIjoyMDUyNjE4NzQ4fQ.x6iDkFJNVhPxCEQwIzFSQpzRNqgJJJWbHJ0pLhPOKQI'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function main() {
  console.log('🔍 Verificando estado de usuarios demo...\n')

  try {
    // 1. Verificar usuarios en profiles
    console.log('📋 Usuarios en profiles:')
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, current_organization_id')
      .in('email', ['admin@demo.com', 'moderator@demo.com', 'expert@demo.com'])
      .order('email')

    if (profilesError) {
      console.error('❌ Error obteniendo profiles:', profilesError.message)
      return
    }

    profiles.forEach(profile => {
      console.log(`  👤 ${profile.email}`)
      console.log(`     ID: ${profile.id}`)
      console.log(`     Org Activa: ${profile.current_organization_id || 'N/A'}`)
      console.log()
    })

    // 2. Verificar membresías
    console.log('🏢 Membresías de organizaciones:')
    const { data: memberships, error: membershipsError } = await supabase
      .from('user_organizations')
      .select(`
        user_id,
        organization_id,
        role,
        status,
        users!inner(email)
      `)
      .in('users.email', ['admin@demo.com', 'moderator@demo.com', 'expert@demo.com'])

    if (membershipsError) {
      console.error('❌ Error obteniendo membresías:', membershipsError.message)
      return
    }

    const groupedMemberships = {}
    memberships.forEach(membership => {
      const email = membership.users.email
      if (!groupedMemberships[email]) {
        groupedMemberships[email] = []
      }
      groupedMemberships[email].push(membership)
    })

    Object.entries(groupedMemberships).forEach(([email, userMemberships]) => {
      console.log(`  👤 ${email}:`)
      userMemberships.forEach(membership => {
        console.log(`     → ${membership.organization_id} (${membership.role}) - ${membership.status}`)
      })
      console.log()
    })

    // 3. Verificar organizaciones
    console.log('🏢 Organizaciones disponibles:')
    const { data: organizations, error: orgsError } = await supabase
      .from('organizations')
      .select('id, name, is_active')
      .eq('is_active', true)
      .order('name')

    if (orgsError) {
      console.error('❌ Error obteniendo organizaciones:', orgsError.message)
      return
    }

    organizations.forEach(org => {
      console.log(`  🏢 ${org.name} (${org.id})`)
    })

    console.log('\n✅ Verificación completada')

  } catch (error) {
    console.error('💥 Error general:', error.message)
    process.exit(1)
  }
}

main()
