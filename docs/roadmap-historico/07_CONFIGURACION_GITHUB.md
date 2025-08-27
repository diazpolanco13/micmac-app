# 🚀 Setup GitHub para MIC MAC Pro

## Pasos para configurar GitHub automáticamente:

### 1. Crear repositorio en GitHub
```bash
# Opción A: Via GitHub CLI (si tienes gh instalado)
gh repo create micmac-app --public --description "🚀 MIC MAC Pro - Plataforma de Análisis Prospectivos con Automatización"

# Opción B: Manual en github.com
# 1. Ve a https://github.com/new
# 2. Repository name: micmac-app
# 3. Description: 🚀 MIC MAC Pro - Plataforma de Análisis Prospectivos con Automatización
# 4. Public
# 5. NO inicializar con README (ya tenemos archivos)
# 6. Create repository
```

### 2. Conectar repositorio local con GitHub
```bash
# Agregar remote origin
git remote add origin https://github.com/tu-usuario/micmac-app.git

# O si prefieres SSH
git remote add origin git@github.com:tu-usuario/micmac-app.git

# Verificar remote
git remote -v
```

### 3. Hacer push inicial
```bash
# Push del commit inicial
git push -u origin main
```

### 4. Configurar GitHub Actions (automático)
Una vez que hagas push, GitHub Actions se activará automáticamente con nuestro workflow `.github/workflows/automation.yml` que incluye:

- 🧪 **@CursorTesting** - Tests automáticos con coverage
- 📝 **@CursorGit** - Tracking de commits  
- 📊 **@CursorLinear** - Sincronización con Linear
- 📚 **@CursorDocs** - Documentación automática

### 5. Variables de entorno en GitHub
Ve a Settings → Secrets and variables → Actions y agrega:

```
LINEAR_API_KEY=tu_linear_api_key_aqui
SUPABASE_URL=tu_supabase_url_aqui  
SUPABASE_ANON_KEY=tu_supabase_anon_key_aqui
```

## 🤖 Automatización Completa Activada

Una vez configurado GitHub, cada commit automático activará:

1. **GitHub Actions** ejecuta tests y actualiza Linear
2. **@CursorGit** hace commits con formato consistente
3. **@CursorLinear** sincroniza progreso automáticamente  
4. **@CursorTesting** reporta coverage en tiempo real
5. **@CursorDocs** mantiene documentación actualizada

## 🎯 Próximo Comando

Después de crear el repo en GitHub, ejecuta:
```bash
npm run automation:git
```

Esto hará push automático y activará toda la automatización! 🚀
