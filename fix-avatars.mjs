import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://lsnevmeibbkclblcsauu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzbmV2bWVpYmJrY2xibGNzYXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Njc1NzEwNCwiZXhwIjoyMDcyMzMzMTA0fQ.L1kMarX3WkjodnMBQiHeZ0AcGUI1Kh013qb4CiBBwHE'
);

console.log('🔧 ARREGLANDO AVATARS CON EMOTICONOS...');

const { data: users, error } = await supabase.from('users').select('*');

if (error) {
  console.error('Error:', error);
  process.exit(1);
}

console.log('📊 USUARIOS ACTUALES:');
users.forEach((user, i) => {
  console.log(`${i+1}. ${user.email} - Avatar: ${user.avatar}`);
});

// Arreglar avatars problemáticos
for (const user of users) {
  let needsUpdate = false;
  let newAvatar = user.avatar;
  
  // Detectar emoticonos o URLs inválidas
  if (!user.avatar || user.avatar.length < 10 || /[^\x00-\x7F]/.test(user.avatar)) {
    needsUpdate = true;
    
    if (user.email.includes('expert1')) {
      newAvatar = 'https://images.unsplash.com/photo-1494790108755-2616b612b1e1?w=150&h=150&fit=crop&crop=face';
    } else if (user.email.includes('expert2')) {
      newAvatar = 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face';
    } else if (user.email.includes('multi')) {
      newAvatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face';
    } else {
      newAvatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face';
    }
  }
  
  if (needsUpdate) {
    const { error: updateError } = await supabase
      .from('users')
      .update({ avatar: newAvatar })
      .eq('id', user.id);
      
    if (updateError) {
      console.error(`❌ Error actualizando ${user.email}:`, updateError);
    } else {
      console.log(`✅ Avatar actualizado para ${user.email}`);
    }
  }
}

console.log('\n🎉 Avatars arreglados!');
