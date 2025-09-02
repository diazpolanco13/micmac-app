/**
 * 🧪 Test CRUD Completo de Supabase
 * Verifica Create, Read, Update, Delete en todas las tablas principales
 */

import { createClient } from '@supabase/supabase-js'
import { randomUUID } from 'crypto'

// Credenciales de Supabase
const supabaseUrl = 'https://lsnevmeibbkclblcsauu.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzbmV2bWVpYmJrY2xibGNzYXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Njc1NzEwNCwiZXhwIjoyMDcyMzMzMTA0fQ.L1kMarX3WkjodnMBQiHeZ0AcGUI1Kh013qb4CiBBwHE'

// Cliente con permisos administrativos
const supabase = createClient(supabaseUrl, serviceRoleKey)

console.log('🧪 Iniciando test CRUD completo de Supabase...\n')

async function testCRUD() {
  let testOrgId = null
  let testUserId = null
  let testProjectId = null
  let testExpertId = null

  try {
    // ========================================
    // 1. TEST ORGANIZACIONES
    // ========================================
    console.log('🏢 Probando CRUD en tabla ORGANIZATIONS...')
    
    // CREATE - Crear organización de test
    const orgId = randomUUID()
    const now = new Date().toISOString()
    const { data: newOrg, error: createOrgError } = await supabase
      .from('organizations')
      .insert({
        id: orgId,
        name: 'Test Organization CRUD',
        slug: 'test-org-crud-' + Date.now(),
        domain: 'testcrud.com',
        is_active: true,
        created_at: now,
        updated_at: now
      })
      .select()
      .single()

    if (createOrgError) {
      console.log('❌ Error creando organización:', createOrgError.message)
      return
    }
    testOrgId = newOrg.id
    console.log('✅ CREATE - Organización creada:', newOrg.name)

    // READ - Leer organización
    const { data: readOrg, error: readOrgError } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', testOrgId)
      .single()

    if (readOrgError) {
      console.log('❌ Error leyendo organización:', readOrgError.message)
      return
    }
    console.log('✅ READ - Organización leída:', readOrg.name)

    // UPDATE - Actualizar organización
    const { data: updatedOrg, error: updateOrgError } = await supabase
      .from('organizations')
      .update({ name: 'Test Organization CRUD UPDATED' })
      .eq('id', testOrgId)
      .select()
      .single()

    if (updateOrgError) {
      console.log('❌ Error actualizando organización:', updateOrgError.message)
      return
    }
    console.log('✅ UPDATE - Organización actualizada:', updatedOrg.name)

    // ========================================
    // 2. TEST USUARIOS
    // ========================================
    console.log('\n👥 Probando CRUD en tabla USERS...')
    
    // CREATE - Crear usuario de test
    const userId = randomUUID()
    const userNow = new Date().toISOString()
    const { data: newUser, error: createUserError } = await supabase
      .from('users')
      .insert({
        id: userId,
        email: 'test-crud@example.com',
        role: 'EXPERT',
        name: 'Usuario Test CRUD',
        created_at: userNow,
        updated_at: userNow
      })
      .select()
      .single()

    if (createUserError) {
      console.log('❌ Error creando usuario:', createUserError.message)
      return
    }
    testUserId = newUser.id
    console.log('✅ CREATE - Usuario creado:', newUser.email)

    // READ - Leer usuario
    const { data: readUser, error: readUserError } = await supabase
      .from('users')
      .select('*')
      .eq('id', testUserId)
      .single()

    if (readUserError) {
      console.log('❌ Error leyendo usuario:', readUserError.message)
      return
    }
    console.log('✅ READ - Usuario leído:', readUser.email)

    // UPDATE - Actualizar usuario
    const { data: updatedUser, error: updateUserError } = await supabase
      .from('users')
      .update({ name: 'Usuario Test CRUD UPDATED' })
      .eq('id', testUserId)
      .select()
      .single()

    if (updateUserError) {
      console.log('❌ Error actualizando usuario:', updateUserError.message)
      return
    }
    console.log('✅ UPDATE - Usuario actualizado:', updatedUser.name)

    // ========================================
    // 3. TEST PROYECTOS
    // ========================================
    console.log('\n📋 Probando CRUD en tabla PROJECTS...')
    
    // CREATE - Crear proyecto de test
    const projectId = randomUUID()
    const projectNow = new Date().toISOString()
    const { data: newProject, error: createProjectError } = await supabase
      .from('projects')
      .insert({
        id: projectId,
        name: 'Proyecto Test CRUD',
        description: 'Descripción del proyecto test',
        type: 'STRATEGIC',
        status: 'DRAFT',
        expected_experts: 3,
        creator_id: testUserId,
        organization_id: testOrgId,
        is_public: false,
        created_at: projectNow,
        updated_at: projectNow
      })
      .select()
      .single()

    if (createProjectError) {
      console.log('❌ Error creando proyecto:', createProjectError.message)
      return
    }
    testProjectId = newProject.id
    console.log('✅ CREATE - Proyecto creado:', newProject.name)

    // READ - Leer proyecto
    const { data: readProject, error: readProjectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', testProjectId)
      .single()

    if (readProjectError) {
      console.log('❌ Error leyendo proyecto:', readProjectError.message)
      return
    }
    console.log('✅ READ - Proyecto leído:', readProject.name)

    // UPDATE - Actualizar proyecto
    const { data: updatedProject, error: updateProjectError } = await supabase
      .from('projects')
      .update({ 
        name: 'Proyecto Test CRUD UPDATED',
        status: 'ACTIVE'
      })
      .eq('id', testProjectId)
      .select()
      .single()

    if (updateProjectError) {
      console.log('❌ Error actualizando proyecto:', updateProjectError.message)
      return
    }
    console.log('✅ UPDATE - Proyecto actualizado:', updatedProject.name)

    // ========================================
    // 4. TEST EXPERTOS
    // ========================================
    console.log('\n🎓 Probando CRUD en tabla EXPERTS...')
    
    // CREATE - Crear experto de test
    const expertId = randomUUID()
    const expertNow = new Date().toISOString()
    const { data: newExpert, error: createExpertError } = await supabase
      .from('experts')
      .insert({
        id: expertId,
        name: 'Experto Test CRUD',
        email: 'experto-test-crud@example.com',
        organization: 'Universidad Test',
        organization_id: testOrgId,
        expertise_areas: ['Tecnología', 'Estrategia'],
        years_experience: 5,
        created_at: expertNow,
        updated_at: expertNow
      })
      .select()
      .single()

    if (createExpertError) {
      console.log('❌ Error creando experto:', createExpertError.message)
      return
    }
    testExpertId = newExpert.id
    console.log('✅ CREATE - Experto creado:', newExpert.name)

    // READ - Leer experto
    const { data: readExpert, error: readExpertError } = await supabase
      .from('experts')
      .select('*')
      .eq('id', testExpertId)
      .single()

    if (readExpertError) {
      console.log('❌ Error leyendo experto:', readExpertError.message)
      return
    }
    console.log('✅ READ - Experto leído:', readExpert.name)

    // UPDATE - Actualizar experto
    const { data: updatedExpert, error: updateExpertError } = await supabase
      .from('experts')
      .update({ 
        name: 'Experto Test CRUD UPDATED',
        years_experience: 10
      })
      .eq('id', testExpertId)
      .select()
      .single()

    if (updateExpertError) {
      console.log('❌ Error actualizando experto:', updateExpertError.message)
      return
    }
    console.log('✅ UPDATE - Experto actualizado:', updatedExpert.name)

    console.log('\n🎉 ¡Todas las operaciones CREATE, READ, UPDATE fueron exitosas!')

  } catch (error) {
    console.error('💥 Error general en test CRUD:', error.message)
  } finally {
    // ========================================
    // CLEANUP - Limpiar datos de test
    // ========================================
    console.log('\n🧹 Limpiando datos de test...')

    if (testExpertId) {
      const { error: deleteExpertError } = await supabase
        .from('experts')
        .delete()
        .eq('id', testExpertId)
      
      if (deleteExpertError) {
        console.log('⚠️  Error eliminando experto:', deleteExpertError.message)
      } else {
        console.log('✅ DELETE - Experto eliminado')
      }
    }

    if (testProjectId) {
      const { error: deleteProjectError } = await supabase
        .from('projects')
        .delete()
        .eq('id', testProjectId)
      
      if (deleteProjectError) {
        console.log('⚠️  Error eliminando proyecto:', deleteProjectError.message)
      } else {
        console.log('✅ DELETE - Proyecto eliminado')
      }
    }

    if (testUserId) {
      const { error: deleteUserError } = await supabase
        .from('users')
        .delete()
        .eq('id', testUserId)
      
      if (deleteUserError) {
        console.log('⚠️  Error eliminando usuario:', deleteUserError.message)
      } else {
        console.log('✅ DELETE - Usuario eliminado')
      }
    }

    if (testOrgId) {
      const { error: deleteOrgError } = await supabase
        .from('organizations')
        .delete()
        .eq('id', testOrgId)
      
      if (deleteOrgError) {
        console.log('⚠️  Error eliminando organización:', deleteOrgError.message)
      } else {
        console.log('✅ DELETE - Organización eliminada')
      }
    }

    console.log('\n🏁 Test CRUD completado. Base de datos limpia.')
  }
}

testCRUD()
