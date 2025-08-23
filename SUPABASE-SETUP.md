# 🔐 Configuración de Supabase para MIC MAC Pro

## 🚀 Pasos para configurar Supabase

### 1. Crear proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto:
   - **Name**: `micmac-pro`
   - **Database Password**: (genera una segura)
   - **Region**: Closest to you

### 2. Configurar variables de entorno
Crea el archivo `.env.local` con:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.tu-proyecto.supabase.co:5432/postgres

# Linear Integration (opcional)
LINEAR_API_KEY=tu_linear_api_key_aqui
LINEAR_TEAM_ID=fd89d142-73d7-4eec-9cad-ff0cf636eb41

# Automation
AUTOMATION_ENABLED=true
NODE_ENV=development
```

### 3. Obtener las claves de Supabase
1. Ve a tu proyecto en Supabase Dashboard
2. **Settings** → **API**
3. Copia:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`

### 4. Configurar la base de datos
```bash
# Generar cliente Prisma
npm run prisma:generate

# Aplicar esquemas a Supabase
npm run prisma:push
```

### 5. Configurar autenticación en Supabase
1. Ve a **Authentication** → **Settings**
2. En **Site URL** agrega: `http://localhost:3000`
3. En **Redirect URLs** agrega: `http://localhost:3000/auth/callback`

### 6. Habilitar Row Level Security (RLS)
Ejecuta estas queries en el SQL Editor de Supabase:

```sql
-- Habilitar RLS en todas las tablas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE variables ENABLE ROW LEVEL SECURITY;
ALTER TABLE experts ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_experts ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

-- Política para users: usuarios pueden ver/editar su propio perfil
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Política para projects: moderadores pueden crear, todos pueden ver los que les pertenecen
CREATE POLICY "Moderators can create projects" ON projects
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'MODERATOR')
  );

CREATE POLICY "Users can view relevant projects" ON projects
  FOR SELECT USING (
    creator_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM project_experts WHERE project_experts.project_id = id AND project_experts.user_id = auth.uid())
  );

-- Más políticas según necesites...
```

### 7. Seed data (opcional)
```bash
# Crear datos de ejemplo
npm run prisma:seed
```

## 🧪 Testing de autenticación

Una vez configurado, puedes probar:

1. **Registro**: Crear cuenta como Moderador o Experto
2. **Login**: Iniciar sesión con las credenciales
3. **Dashboard**: Ver el dashboard según el rol
4. **Logout**: Cerrar sesión correctamente

## 🔧 Troubleshooting

### Error: "Invalid API key"
- Verifica que las claves en `.env.local` sean correctas
- Asegúrate de que no haya espacios extra

### Error: "Database connection failed"
- Verifica la `DATABASE_URL`
- Asegúrate de que la contraseña sea correcta

### Error: "RLS policy violation"
- Verifica que las políticas RLS estén configuradas
- Revisa que el usuario tenga permisos

## 🚀 Próximos pasos

Una vez configurado Supabase:

1. **Probar autenticación**: Crear cuenta y login
2. **Completar API-5**: Marcar como Done en Linear
3. **Continuar con API-7**: Sistema de autenticación completo
4. **Desarrollar features**: CRUD proyectos, expertos, etc.

## 🤖 Automatización

Una vez funcionando la autenticación:
- **@CursorTesting** generará tests automáticamente
- **@CursorGit** hará commits automáticos
- **@CursorLinear** actualizará progreso
- **@CursorDocs** mantendrá docs actualizadas
