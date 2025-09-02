#!/usr/bin/env node
/**
 * Script para ver usuarios de Supabase con detalles completos
 */

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://lsnevmeibbkclblcsauu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzbmV2bWVpYmJrY2xibGNzYXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Njc1NzEwNCwiZXhwIjoyMDcyMzMzMTA0fQ.L1kMarX3WkjodnMBQiHeZ0AcGUI1Kh013qb4CiBBwHE'
);

async function listUsers() {
  console.log('👥 USUARIOS DISPONIBLES PARA LOGIN:');
  console.log('=====================================\n');
  
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('❌ Error:', error.message);
      return;
    }

    users.forEach((user, index) => {
      console.log(`${index + 1}. 📧 Email: ${user.email}`);
      console.log(`   👤 Nombre: ${user.name || 'Sin nombre'}`);
      console.log(`   🎭 Rol: ${user.role}`);
      console.log(`   🆔 ID: ${user.id.substring(0,8)}...`);
      console.log(`   📅 Creado: ${new Date(user.created_at).toLocaleString('es-ES')}`);
      if (user.bio) console.log(`   📝 Bio: ${user.bio}`);
      if (user.avatar) console.log(`   🖼️  Avatar: ${user.avatar}`);
      console.log('   ---');
    });
    
    console.log(`\n🎯 Total usuarios: ${users.length}`);
    console.log('\n💡 INSTRUCCIONES PARA PROBAR LOGIN:');
    console.log('1. Ve a la aplicación web (localhost:3002)');
    console.log('2. Haz logout si estás logueado');
    console.log('3. Usa cualquiera de los emails de arriba');
    console.log('4. La contraseña depende de cómo se crearon las cuentas');
    console.log('\n⚠️  Si no tienes las contraseñas, podemos crear usuarios de prueba nuevos.');
    
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
  }
}

listUsers();
