import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://lsnevmeibbkclblcsauu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzbmV2bWVpYmJrY2xibGNzYXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Njc1NzEwNCwiZXhwIjoyMDcyMzMzMTA0fQ.L1kMarX3WkjodnMBQiHeZ0AcGUI1Kh013qb4CiBBwHE'
);

console.log('🚀 AGREGANDO CAMPOS DE PERFIL FALTANTES...');

// Actualizar usuarios existentes con datos completos
const updates = [
  {
    email: 'expert1@techcorp.com',
    data: {
      phone: '+34 666 123 456',
      linkedin_url: 'https://linkedin.com/in/maria-garcia-techcorp',
      profession: 'Ingeniera de Software',
      current_position: 'Senior Software Engineer',
      years_experience: 8,
      organization: 'TechCorp Solutions',
      organization_id: 'org-techcorp',
      current_organization_id: 'org-techcorp',
      is_active: true,
      last_login_at: new Date().toISOString(),
      total_projects_participated: 25,
      average_response_time: 2.1
    }
  },
  {
    email: 'multi@demo.com',
    data: {
      phone: '+34 777 987 654',
      linkedin_url: 'https://linkedin.com/in/alex-multi-org',
      profession: 'Consultor Multi-Organizacional',
      current_position: 'Consultor Senior',
      years_experience: 10,
      organization: 'TechCorp Solutions',
      organization_id: 'org-techcorp',
      current_organization_id: 'org-techcorp',
      is_active: true,
      last_login_at: new Date().toISOString(),
      total_projects_participated: 35,
      average_response_time: 1.8
    }
  },
  {
    email: 'expert2@healthplus.org',
    data: {
      phone: '+34 888 234 567',
      linkedin_url: 'https://linkedin.com/in/juan-medico-healthplus',
      profession: 'Doctor en Medicina',
      current_position: 'Director Médico',
      years_experience: 15,
      organization: 'HealthPlus Innovations',
      organization_id: 'org-healthplus',
      current_organization_id: 'org-healthplus',
      is_active: true,
      last_login_at: new Date().toISOString(),
      total_projects_participated: 18,
      average_response_time: 3.2
    }
  },
  {
    email: 'admin@demo.com',
    data: {
      phone: '+34 999 345 678',
      linkedin_url: 'https://linkedin.com/in/carlos-diaz-admin',
      profession: 'Director de Análisis',
      current_position: 'Director de Análisis Prospectivos',
      years_experience: 12,
      organization: 'Demo Organization',
      organization_id: 'org-demo',
      current_organization_id: 'org-demo',
      is_active: true,
      last_login_at: new Date().toISOString(),
      total_projects_participated: 42,
      average_response_time: 2.5
    }
  }
];

for (const update of updates) {
  console.log(`📝 Actualizando ${update.email}...`);
  
  const { error } = await supabase
    .from('users')
    .update(update.data)
    .eq('email', update.email);
  
  if (error) {
    console.error(`❌ Error actualizando ${update.email}:`, error);
  } else {
    console.log(`✅ ${update.email} actualizado exitosamente`);
  }
}

// Verificar resultados
console.log('\n📊 VERIFICANDO RESULTADOS...');
const { data: users, error } = await supabase
  .from('users')
  .select('email, name, phone, profession, organization, years_experience')
  .order('email');

if (error) {
  console.error('❌ Error verificando:', error);
} else {
  console.log('\n✅ USUARIOS ACTUALIZADOS:');
  users.forEach(user => {
    console.log(`📧 ${user.email}`);
    console.log(`   👤 ${user.name}`);
    console.log(`   📞 ${user.phone || 'N/A'}`);
    console.log(`   💼 ${user.profession || 'N/A'}`);
    console.log(`   🏢 ${user.organization || 'N/A'}`);
    console.log(`   📅 ${user.years_experience || 0} años`);
    console.log('   ---');
  });
}

console.log('\n🎉 ¡Campos de perfil agregados exitosamente!');
