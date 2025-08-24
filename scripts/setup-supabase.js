#!/usr/bin/env node

/**
 * 🚀 Setup Script para Supabase + Prisma
 * Configura automáticamente la integración de base de datos
 */

const { exec } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🚀 Iniciando setup de Supabase + Prisma...\n')

async function runCommand(command, description) {
  return new Promise((resolve, reject) => {
    console.log(`⏳ ${description}...`)
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Error: ${error.message}`)
        reject(error)
        return
      }
      if (stderr) {
        console.warn(`⚠️ Warning: ${stderr}`)
      }
      console.log(`✅ ${description} completado`)
      resolve(stdout)
    })
  })
}

async function checkEnvironmentFile() {
  const envPath = path.join(process.cwd(), '.env.local')
  
  if (!fs.existsSync(envPath)) {
    console.log('❌ Archivo .env.local no encontrado')
    console.log('📝 Creando .env.local desde template...\n')
    
    const envExample = fs.readFileSync(path.join(process.cwd(), '.env.example'), 'utf8')
    fs.writeFileSync(envPath, envExample)
    
    console.log('✅ .env.local creado')
    console.log('⚠️  IMPORTANTE: Debes configurar las variables de Supabase manualmente:\n')
    console.log('   1. Ve a tu proyecto en Supabase Dashboard')
    console.log('   2. Settings → API → copia URL y claves')
    console.log('   3. Reemplaza los valores en .env.local\n')
    
    return false
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8')
  
  if (envContent.includes('your_supabase_url_here') || envContent.includes('your-project.supabase.co')) {
    console.log('⚠️  Variables de Supabase aún no configuradas en .env.local')
    console.log('📝 Por favor configura las claves reales antes de continuar\n')
    return false
  }
  
  console.log('✅ Variables de entorno configuradas correctamente')
  return true
}

async function setupDatabase() {
  try {
    // 1. Verificar archivo de entorno
    const envConfigured = await checkEnvironmentFile()
    
    if (!envConfigured) {
      console.log('\n🛑 Setup pausado: Configura .env.local primero')
      console.log('\nPasos siguientes:')
      console.log('1. Configura las variables de Supabase en .env.local')
      console.log('2. Ejecuta: npm run supabase:setup')
      process.exit(1)
    }

    // 2. Generar cliente Prisma
    await runCommand('npx prisma generate', 'Generando cliente Prisma')

    // 3. Aplicar esquema a Supabase (solo si las variables están configuradas)
    console.log('\n⚠️  El siguiente paso aplicará el esquema a tu base de datos Supabase')
    console.log('   Esto creará las tablas necesarias para MIC MAC Pro')
    console.log('\n   Si estás seguro, ejecuta: npm run prisma:push')
    console.log('   Si quieres seed data, ejecuta: npm run db:seed\n')

  } catch (error) {
    console.error('\n❌ Error durante el setup:', error.message)
    process.exit(1)
  }
}

async function main() {
  console.log('📊 MIC MAC Pro - Setup de Base de Datos\n')
  console.log('Este script configura la integración Supabase + Prisma\n')
  
  await setupDatabase()
  
  console.log('\n🎉 Setup de base de datos completado!')
  console.log('\n📋 Próximos pasos:')
  console.log('   1. Configura .env.local con tus claves de Supabase')
  console.log('   2. Ejecuta: npm run prisma:push (aplica esquema)')
  console.log('   3. Ejecuta: npm run db:seed (datos de ejemplo)')
  console.log('   4. Ejecuta: npm run dev (inicia aplicación)')
  console.log('\n📚 Consulta SUPABASE-SETUP.md para más detalles\n')
}

main().catch(console.error)
