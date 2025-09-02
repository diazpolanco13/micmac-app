-- 🚀 Migración: Agregar campos faltantes a tabla users
-- Fecha: 2025-09-02
-- Propósito: Compatibilidad completa con MockAuth para FASE 2

-- 1. Agregar campos faltantes
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

-- 2. Actualizar usuarios existentes con datos por defecto
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
  profession = CASE 
    WHEN email = 'expert1@techcorp.com' THEN 'Ingeniera de Software'
    WHEN email = 'expert2@healthplus.org' THEN 'Doctor en Medicina'
    WHEN email = 'multi@demo.com' THEN 'Consultor Multi-Organizacional'
    WHEN email = 'admin@demo.com' THEN 'Director de Análisis'
    ELSE 'Profesional'
  END,
  current_position = CASE 
    WHEN email = 'expert1@techcorp.com' THEN 'Senior Software Engineer'
    WHEN email = 'expert2@healthplus.org' THEN 'Director Médico'
    WHEN email = 'multi@demo.com' THEN 'Consultor Senior'
    WHEN email = 'admin@demo.com' THEN 'Director de Análisis Prospectivos'
    ELSE 'Especialista'
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
  last_login_at = NOW(),
  phone = '+34 ' || (600000000 + (EXTRACT(EPOCH FROM created_at)::INTEGER % 99999999))::TEXT,
  linkedin_url = 'https://linkedin.com/in/' || LOWER(REPLACE(name, ' ', '-'))
WHERE phone IS NULL;

-- 3. CRÍTICO: Arreglar avatars con emoticonos - cambiar por URLs reales
UPDATE users SET avatar = CASE
  WHEN avatar = '👩‍💻' OR avatar LIKE '%👩%' THEN 'https://images.unsplash.com/photo-1494790108755-2616b612b1e1?w=150&h=150&fit=crop&crop=face'
  WHEN avatar = '👨‍💼' OR avatar LIKE '%👨%' THEN 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  WHEN avatar = '🧑‍⚕️' OR avatar LIKE '%⚕%' THEN 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face'
  WHEN avatar = '👨‍💻' THEN 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  WHEN avatar IS NULL OR LENGTH(avatar) < 10 THEN 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  ELSE avatar
END
WHERE avatar IS NULL OR LENGTH(avatar) < 10 OR avatar ~ '[^\x00-\x7F]'; -- Detecta caracteres no ASCII (emojis)

-- 4. Verificar resultados
SELECT 
  email, 
  name, 
  avatar, 
  organization,
  profession,
  years_experience,
  phone
FROM users 
ORDER BY created_at;
