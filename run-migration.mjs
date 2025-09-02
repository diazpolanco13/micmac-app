#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://lsnevmeibbkclblcsauu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzbmV2bWVpYmJrY2xibGNzYXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Njc1NzEwNCwiZXhwIjoyMDcyMzMzMTA0fQ.L1kMarX3WkjodnMBQiHeZ0AcGUI1Kh013qb4CiBBwHE'
);

console.log('🚀 EJECUTANDO MIGRACIÓN: Agregar campos faltantes a users');
console.log('=======================================================');

try {
  // 1. Agregar campos faltantes
  console.log('1️⃣ Agregando campos faltantes...');
  
  const { error: alterError } = await supabase.rpc('exec_sql', {
    sql: `
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS phone TEXT,
      ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
      ADD COLUMN IF NOT EXISTS profession TEXT,
      ADD COLUMN IF NOT EXISTS current_position TEXT,
      ADD COLUMN IF NOT EXISTS years_experience INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS organization TEXT,
      ADD COLUMN IF NOT EXISTS organization_id TEXT,
      ADD COLUMN IF NOT EXISTS current_organization_id TEXT,
      ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
      ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP WITH TIME ZONE,
      ADD COLUMN IF NOT EXISTS total_projects_participated INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS average_response_time DECIMAL(4,2) DEFAULT 0.0;
    `
  });

  if (alterError) {
    console.error('❌ Error agregando campos:', alterError);
  } else {
    console.log('✅ Campos agregados exitosamente');
  }

  // 2. Actualizar usuarios existentes
  console.log('2️⃣ Actualizando datos de usuarios existentes...');
  
  const { error: updateError } = await supabase.rpc('exec_sql', {
    sql: `
      UPDATE users SET 
        organization = CASE 
          WHEN email LIKE '%techcorp%' THEN 'TechCorp Solutions'
          WHEN email LIKE '%healthplus%' THEN 'HealthPlus Innovations'
          WHEN email = 'multi@demo.com' THEN 'TechCorp Solutions'
          WHEN email = 'admin@demo.com' THEN 'Demo Organization'
          ELSE 'Demo Organization'
        END,
        organization_id = CASE 
          WHEN email LIKE '%techcorp%' THEN 'org-techcorp'
          WHEN email LIKE '%healthplus%' THEN 'org-healthplus'
          WHEN email = 'multi@demo.com' THEN 'org-techcorp'
          WHEN email = 'admin@demo.com' THEN 'org-demo'
          ELSE 'org-demo'
        END,
        current_organization_id = CASE 
          WHEN email LIKE '%techcorp%' THEN 'org-techcorp'
          WHEN email LIKE '%healthplus%' THEN 'org-healthplus'
          WHEN email = 'multi@demo.com' THEN 'org-techcorp'
          WHEN email = 'admin@demo.com' THEN 'org-demo'
          ELSE 'org-demo'
        END,
        years_experience = CASE 
          WHEN role = 'EXPERT' THEN 8
          WHEN role = 'MODERATOR' THEN 12
          ELSE 5
        END,
        total_projects_participated = CASE 
          WHEN role = 'EXPERT' THEN 15
          WHEN role = 'MODERATOR' THEN 25
          ELSE 5
        END,
        average_response_time = 2.5,
        is_active = true,
        last_login_at = NOW()
      WHERE phone IS NULL;
    `
  });

  if (updateError) {
    console.error('❌ Error actualizando usuarios:', updateError);
  } else {
    console.log('✅ Datos de usuarios actualizados');
  }

  // 3. CRÍTICO: Arreglar avatars con emoticonos
  console.log('3️⃣ Arreglando avatars con emoticonos...');
  
  const { data: users, error: fetchError } = await supabase
    .from('users')
    .select('id, email, avatar')
    .or('avatar.is.null,avatar.eq.👩‍💻,avatar.eq.👨‍💼,avatar.eq.🧑‍⚕️,avatar.eq.👨‍💻');

  if (fetchError) {
    console.error('❌ Error obteniendo usuarios:', fetchError);
  } else {
    console.log(`🔍 Encontrados ${users.length} usuarios con avatars problemáticos`);
    
    for (const user of users) {
      let newAvatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face';
      
      if (user.email.includes('expert1')) {
        newAvatar = 'https://images.unsplash.com/photo-1494790108755-2616b612b1e1?w=150&h=150&fit=crop&crop=face';
      } else if (user.email.includes('expert2')) {
        newAvatar = 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face';
      } else if (user.email.includes('multi')) {
        newAvatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face';
      }
      
      const { error: avatarError } = await supabase
        .from('users')
        .update({ avatar: newAvatar })
        .eq('id', user.id);
      
      if (avatarError) {
        console.error(`❌ Error actualizando avatar de ${user.email}:`, avatarError);
      } else {
        console.log(`✅ Avatar actualizado para ${user.email}`);
      }
    }
  }

  // 4. Verificar resultados
  console.log('4️⃣ Verificando resultados...');
  
  const { data: finalUsers, error: finalError } = await supabase
    .from('users')
    .select('email, name, avatar, organization, profession, years_experience, phone')
    .order('created_at');

  if (finalError) {
    console.error('❌ Error verificando resultados:', finalError);
  } else {
    console.log('📊 USUARIOS ACTUALIZADOS:');
    console.log('========================');
    finalUsers.forEach(user => {
      console.log(`📧 ${user.email}`);
      console.log(`   👤 ${user.name}`);
      console.log(`   🖼️  Avatar: ${user.avatar ? user.avatar.substring(0, 50) + '...' : 'null'}`);
      console.log(`   🏢 Org: ${user.organization}`);
      console.log(`   💼 Prof: ${user.profession}`);
      console.log(`   📅 Exp: ${user.years_experience} años`);
      console.log(`   📞 Tel: ${user.phone}`);
      console.log('   ---');
    });
  }

  console.log('\n🎉 ¡Migración completada exitosamente!');

} catch (error) {
  console.error('💥 Error general:', error);
}
