-- 🚀 ESQUEMA COMPLETO PARA MIC MAC PRO
-- Fecha: 2025-09-02
-- Propósito: Crear TODAS las tablas y campos necesarios

-- ============================================================================
-- 1. COMPLETAR TABLA USERS CON TODOS LOS CAMPOS
-- ============================================================================

-- Agregar campos faltantes a users
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

-- ============================================================================
-- 2. CREAR TABLA EXPERTISE_AREAS (CRÍTICA)
-- ============================================================================

CREATE TABLE IF NOT EXISTS expertise_areas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  category TEXT DEFAULT 'general',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar áreas de expertise predefinidas
INSERT INTO expertise_areas (name, description, category) VALUES
('Inteligencia Artificial', 'Machine Learning, Deep Learning, IA Generativa', 'technology'),
('Análisis de Datos', 'Big Data, Analytics, Visualización de Datos', 'technology'),
('Ciberseguridad', 'Seguridad Informática, Ethical Hacking, Compliance', 'technology'),
('Desarrollo de Software', 'Programación, Arquitectura, DevOps', 'technology'),
('Gestión de Proyectos', 'PMI, Agile, Scrum, Metodologías', 'management'),
('Finanzas', 'Análisis Financiero, Inversiones, Riesgo', 'business'),
('Marketing Digital', 'SEO, SEM, Redes Sociales, Growth', 'business'),
('Recursos Humanos', 'Gestión de Talento, Cultura Organizacional', 'management'),
('Medicina', 'Especialidades Médicas, Salud Digital', 'healthcare'),
('Derecho', 'Derecho Corporativo, Propiedad Intelectual', 'legal'),
('Educación', 'Pedagogía, E-learning, Formación', 'education'),
('Sostenibilidad', 'ESG, Energías Renovables, Medio Ambiente', 'sustainability')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- 3. CREAR TABLA USER_EXPERTISE (RELACIÓN MUCHOS A MUCHOS)
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_expertise (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expertise_area_id UUID NOT NULL REFERENCES expertise_areas(id) ON DELETE CASCADE,
  level TEXT NOT NULL CHECK (level IN ('novice', 'intermediate', 'advanced', 'expert')),
  years_experience INTEGER DEFAULT 0,
  description TEXT,
  context TEXT[] DEFAULT '{}', -- Profesional, Académico, etc.
  education_level TEXT, -- Grado, Máster, Doctorado, etc.
  score DECIMAL(3,2) DEFAULT 0.0, -- Puntuación calculada automáticamente
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, expertise_area_id)
);

-- ============================================================================
-- 4. COMPLETAR TABLA ORGANIZATIONS (si necesita campos adicionales)
-- ============================================================================

-- Verificar y agregar campos si no existen
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='organizations' AND column_name='plan') THEN
    ALTER TABLE organizations ADD COLUMN plan TEXT DEFAULT 'FREE' CHECK (plan IN ('FREE', 'PRO', 'ENTERPRISE'));
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='organizations' AND column_name='settings') THEN
    ALTER TABLE organizations ADD COLUMN settings JSONB DEFAULT '{}';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='organizations' AND column_name='is_active') THEN
    ALTER TABLE organizations ADD COLUMN is_active BOOLEAN DEFAULT true;
  END IF;
END $$;

-- ============================================================================
-- 5. ÍNDICES PARA PERFORMANCE
-- ============================================================================

-- Índices en user_expertise
CREATE INDEX IF NOT EXISTS idx_user_expertise_user_id ON user_expertise(user_id);
CREATE INDEX IF NOT EXISTS idx_user_expertise_area_id ON user_expertise(expertise_area_id);
CREATE INDEX IF NOT EXISTS idx_user_expertise_level ON user_expertise(level);

-- Índices en users
CREATE INDEX IF NOT EXISTS idx_users_organization_id ON users(organization_id);
CREATE INDEX IF NOT EXISTS idx_users_current_org_id ON users(current_organization_id);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

-- Índices en expertise_areas
CREATE INDEX IF NOT EXISTS idx_expertise_areas_category ON expertise_areas(category);
CREATE INDEX IF NOT EXISTS idx_expertise_areas_active ON expertise_areas(is_active);

-- ============================================================================
-- 6. TRIGGERS PARA UPDATED_AT AUTOMÁTICO
-- ============================================================================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expertise_areas_updated_at BEFORE UPDATE ON expertise_areas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_expertise_updated_at BEFORE UPDATE ON user_expertise
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 7. RLS (Row Level Security) PARA MULTI-TENANT
-- ============================================================================

-- Habilitar RLS en tablas sensibles
ALTER TABLE user_expertise ENABLE ROW LEVEL SECURITY;

-- Política para user_expertise (solo ver sus propias expertise)
CREATE POLICY "Users can view their own expertise" ON user_expertise
    FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- 8. ACTUALIZAR USUARIOS EXISTENTES CON DATOS COMPLETOS
-- ============================================================================

-- Actualizar usuarios con datos profesionales
UPDATE users SET 
  phone = CASE 
    WHEN email = 'expert1@techcorp.com' THEN '+34 666 123 456'
    WHEN email = 'multi@demo.com' THEN '+34 777 987 654'
    WHEN email = 'expert2@healthplus.org' THEN '+34 888 234 567'
    WHEN email = 'admin@demo.com' THEN '+34 999 345 678'
    ELSE '+34 600 000 000'
  END,
  linkedin_url = CASE 
    WHEN email = 'expert1@techcorp.com' THEN 'https://linkedin.com/in/maria-garcia-techcorp'
    WHEN email = 'multi@demo.com' THEN 'https://linkedin.com/in/alex-multi-org'
    WHEN email = 'expert2@healthplus.org' THEN 'https://linkedin.com/in/juan-medico-healthplus'
    WHEN email = 'admin@demo.com' THEN 'https://linkedin.com/in/carlos-diaz-admin'
    ELSE 'https://linkedin.com/in/usuario-demo'
  END,
  profession = CASE 
    WHEN email = 'expert1@techcorp.com' THEN 'Ingeniera de Software'
    WHEN email = 'multi@demo.com' THEN 'Consultor Multi-Organizacional'
    WHEN email = 'expert2@healthplus.org' THEN 'Doctor en Medicina'
    WHEN email = 'admin@demo.com' THEN 'Director de Análisis'
    ELSE 'Profesional'
  END,
  current_position = CASE 
    WHEN email = 'expert1@techcorp.com' THEN 'Senior Software Engineer'
    WHEN email = 'multi@demo.com' THEN 'Consultor Senior'
    WHEN email = 'expert2@healthplus.org' THEN 'Director Médico'
    WHEN email = 'admin@demo.com' THEN 'Director de Análisis Prospectivos'
    ELSE 'Especialista'
  END,
  years_experience = CASE 
    WHEN role = 'EXPERT' THEN 8
    WHEN role = 'MODERATOR' THEN 12
    ELSE 5
  END,
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
  total_projects_participated = CASE 
    WHEN role = 'EXPERT' THEN 15
    WHEN role = 'MODERATOR' THEN 25
    ELSE 5
  END,
  average_response_time = 2.5,
  is_active = true,
  last_login_at = NOW()
WHERE phone IS NULL;

-- ============================================================================
-- 9. INSERTAR EXPERTISE DE EJEMPLO PARA USUARIOS EXISTENTES
-- ============================================================================

-- Expert1 (María García - Ingeniera de Software)
INSERT INTO user_expertise (user_id, expertise_area_id, level, years_experience, description, context, education_level, score)
SELECT 
  u.id,
  ea.id,
  'expert',
  8,
  'Especialista en desarrollo full-stack con React y Node.js',
  ARRAY['Profesional'],
  'Máster',
  8.5
FROM users u, expertise_areas ea 
WHERE u.email = 'expert1@techcorp.com' AND ea.name = 'Desarrollo de Software'
ON CONFLICT (user_id, expertise_area_id) DO NOTHING;

INSERT INTO user_expertise (user_id, expertise_area_id, level, years_experience, description, context, education_level, score)
SELECT 
  u.id,
  ea.id,
  'advanced',
  5,
  'Experiencia en machine learning y análisis predictivo',
  ARRAY['Profesional'],
  'Máster',
  7.2
FROM users u, expertise_areas ea 
WHERE u.email = 'expert1@techcorp.com' AND ea.name = 'Inteligencia Artificial'
ON CONFLICT (user_id, expertise_area_id) DO NOTHING;

-- Expert2 (Dr. Juan Médico)
INSERT INTO user_expertise (user_id, expertise_area_id, level, years_experience, description, context, education_level, score)
SELECT 
  u.id,
  ea.id,
  'expert',
  15,
  'Director médico con especialización en medicina interna',
  ARRAY['Profesional', 'Académico'],
  'Doctorado',
  9.1
FROM users u, expertise_areas ea 
WHERE u.email = 'expert2@healthplus.org' AND ea.name = 'Medicina'
ON CONFLICT (user_id, expertise_area_id) DO NOTHING;

-- Multi-org (Alex)
INSERT INTO user_expertise (user_id, expertise_area_id, level, years_experience, description, context, education_level, score)
SELECT 
  u.id,
  ea.id,
  'advanced',
  10,
  'Consultor especializado en gestión de proyectos complejos',
  ARRAY['Profesional', 'Consultoría'],
  'Máster',
  8.0
FROM users u, expertise_areas ea 
WHERE u.email = 'multi@demo.com' AND ea.name = 'Gestión de Proyectos'
ON CONFLICT (user_id, expertise_area_id) DO NOTHING;

-- Admin (Carlos Diaz)
INSERT INTO user_expertise (user_id, expertise_area_id, level, years_experience, description, context, education_level, score)
SELECT 
  u.id,
  ea.id,
  'expert',
  12,
  'Director de análisis prospectivos con amplia experiencia en análisis de datos',
  ARRAY['Profesional'],
  'Máster',
  8.8
FROM users u, expertise_areas ea 
WHERE u.email = 'admin@demo.com' AND ea.name = 'Análisis de Datos'
ON CONFLICT (user_id, expertise_area_id) DO NOTHING;

-- ============================================================================
-- VERIFICACIÓN FINAL
-- ============================================================================

-- Mostrar resumen de la migración
SELECT 
  'users' as tabla,
  COUNT(*) as registros,
  COUNT(CASE WHEN phone IS NOT NULL THEN 1 END) as con_telefono,
  COUNT(CASE WHEN profession IS NOT NULL THEN 1 END) as con_profesion
FROM users
UNION ALL
SELECT 
  'expertise_areas' as tabla,
  COUNT(*) as registros,
  COUNT(CASE WHEN is_active = true THEN 1 END) as activas,
  0 as extra
FROM expertise_areas
UNION ALL
SELECT 
  'user_expertise' as tabla,
  COUNT(*) as registros,
  COUNT(DISTINCT user_id) as usuarios_con_expertise,
  0 as extra
FROM user_expertise;
