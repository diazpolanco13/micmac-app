# 📋 Configuración Linear - MIC MAC Pro MVP

## 🎯 Workspace Setup

### Información del Workspace
- **Nombre**: `MIC MAC Pro - MVP Development`
- **Descripción**: `Desarrollo acelerado de plataforma MIC MAC con testing y docs en español`
- **Team**: `MIC MAC Pro Team`

## 📊 Estructura de Projects

### Único Project: MVP MIC MAC Pro
- **Status**: `Active`
- **Priority**: `High` 
- **Description**: `MVP funcional completo con testing >80% y docs en español`

## 🏷️ Labels y Tags

### Por Fase de Desarrollo
- `🏗️ fase-1` - Fundación + Testing + Docs
- `📊 fase-2` - Gestión Proyectos + Testing + Docs  
- `👥 fase-3` - Catálogo Expertos + Testing + Docs
- `🗳️ fase-4` - Votación Cronómetro + Testing + Docs
- `📈 fase-5` - Cálculos Visualización + Testing + Docs
- `🚀 fase-6` - Deploy Documentación + Testing

### Por Tipo de Trabajo
- `💻 desarrollo` - Implementación de features
- `🧪 testing` - Pruebas unitarias y E2E
- `📚 documentacion` - Docs en español
- `🐛 bug` - Corrección de errores
- `📱 mobile` - Optimizaciones móviles
- `⚡ performance` - Optimizaciones de rendimiento

### Por Stack Tecnológico
- `nextjs` - Next.js específico
- `supabase` - Database/Auth/Realtime
- `prisma` - ORM y esquemas
- `tailwind` - Estilos CSS
- `recharts` - Visualizaciones
- `jest` - Testing

## 📋 Custom Fields

### Effort & Complexity
- **Story Points**: `1, 2, 3, 5, 8` (Fibonacci)
- **Complexity**: `Low, Medium, High, Expert`
- **Mobile Impact**: `Critical, Important, Low, None`

### Quality Metrics
- **Test Coverage**: `0-100%` (target >80%)
- **Docs Status**: `Not Started, In Progress, Complete`
- **Deploy Status**: `Local, Staging, Production`

### Timestamps Automáticos
- **Started At**: Auto-timestamp al mover a "In Progress"
- **Completed At**: Auto-timestamp al mover a "Done"
- **Duration**: Cálculo automático de tiempo real

## 📝 Issue Templates

### Template: Development + Testing + Docs
```markdown
## 🎯 Objetivo
[Descripción clara de la funcionalidad a desarrollar]

## 📋 Acceptance Criteria - Desarrollo
- [ ] Feature implementada y funcional
- [ ] Responsive design para móviles
- [ ] Validaciones y error handling
- [ ] Integración con Supabase

## 🧪 Acceptance Criteria - Testing  
- [ ] Unit tests escritos (coverage >80%)
- [ ] Tests de integración
- [ ] Testing manual en móvil
- [ ] Tests E2E (si aplica)

## 📚 Acceptance Criteria - Documentación
- [ ] Código comentado en español
- [ ] README/manual actualizado
- [ ] API documentada (si aplica)
- [ ] Ejemplos de uso incluidos

## 🔧 Technical Requirements
- [ ] Next.js + TypeScript
- [ ] Supabase integration
- [ ] Prisma schema updates (si aplica)
- [ ] Tailwind mobile-first
- [ ] Jest testing setup

## ✅ Definition of Done
- [ ] Code review completado
- [ ] All tests passing (>80% coverage)
- [ ] Mobile testing verificado
- [ ] Documentación actualizada
- [ ] Deploy exitoso a staging
- [ ] Linear issue actualizado con timestamps
```

### Template: Bug Fix + Testing + Docs
```markdown
## 🐛 Bug Description
[Descripción del problema encontrado]

## 🔍 Steps to Reproduce
1. 
2. 
3. 

## 🎯 Expected vs Actual Behavior
**Expected**: [Qué debería pasar]
**Actual**: [Qué está pasando]

## 🧪 Testing Requirements
- [ ] Regression test agregado
- [ ] Fix verificado en móvil
- [ ] Edge cases probados

## 📚 Documentation Updates
- [ ] Bug documentado en CHANGELOG.md
- [ ] Solución explicada si es compleja

## ✅ Definition of Done
- [ ] Bug fixed and tested
- [ ] Regression test added
- [ ] Documentation updated
- [ ] Deploy verified
```

## 🤖 Automation Rules

### Auto-Assignment
1. **Issues con `@Cursor`** → Auto-assign a Cursor integration
2. **Issues con `🐛 bug`** → Auto-assign a developer
3. **Issues con `📚 documentacion`** → Add to docs backlog

### Status Transitions
1. **Issue → "In Progress"** → Auto-timestamp + notification
2. **PR linked** → Move to "In Review"  
3. **PR merged** → Move to "Done" + auto-timestamp
4. **Tests failing** → Move back to "In Progress"

### Quality Gates
1. **Move to Done** → Require test coverage >80%
2. **Move to Done** → Require docs updated
3. **Critical bugs** → Block deployment

## 📊 Dashboard y Métricas

### MVP Progress Dashboard
```
📊 MIC MAC Pro MVP Dashboard
├── 🎯 Progreso General: [% completado]
├── 📅 Tiempo Desarrollo: [días activos]  
├── 🧪 Test Coverage: [% actual vs target 80%]
├── 📚 Docs Status: [% completado]
├── 🐛 Bugs Abiertos: [count]
├── 🚀 Deploy Status: [Local/Staging/Prod]
└── 📱 Mobile Tests: [Pass/Fail]
```

### Velocity Tracking
- **Issues por día**: Promedio móvil 7 días
- **Story points por fase**: Comparativa
- **Time to completion**: Por tipo de issue
- **Quality metrics**: Coverage y bugs over time

## 🔗 Integración Git/GitHub

### Branch Naming Convention
```bash
# Formato: tipo/linear-issue-descripcion-corta
feature/MIC-123-auth-supabase-setup
bugfix/MIC-456-mobile-voting-matrix-fix
docs/MIC-789-readme-spanish-update
test/MIC-012-unit-tests-crud-projects
```

### Commit Message Format
```bash
# Formato con Linear tracking
tipo(scope): descripción (Linear: MIC-123)

feat(auth): implement Supabase authentication (Linear: MIC-123)
test(voting): add unit tests for matrix component (Linear: MIC-456)
docs(readme): update installation guide in Spanish (Linear: MIC-789)

# Auto-update Linear:
- Started: [timestamp]
- Commits: [list with links]
- Coverage: [percentage]
```

### PR Template
```markdown
## 📋 Linear Issue
Closes: [Linear Issue URL]

## 🔧 Changes Made
### Development
- 
- 

### Testing  
- Coverage: [percentage]%
- Tests added: [count]

### Documentation
- Files updated: [list]
- Language: Spanish ✅

## 🧪 Testing Done
- [ ] Unit tests added/updated
- [ ] Integration tests passing  
- [ ] Manual testing completed
- [ ] Mobile testing verified
- [ ] E2E tests (if applicable)

## 📱 Mobile Testing
- [ ] iOS Safari tested
- [ ] Android Chrome tested
- [ ] Touch gestures working
- [ ] Responsive layout verified

## 📚 Documentation
- [ ] Code comments in Spanish
- [ ] README updated
- [ ] API docs updated (if applicable)
- [ ] Examples included

## 🚀 Deployment
- [ ] Build successful
- [ ] Environment variables configured
- [ ] Database migrations (if applicable)
- [ ] Vercel deployment tested
```

## 🎯 Milestones del MVP

### Milestone 1: Fundación (25%)
- Setup completo + Auth + BD
- Testing framework configurado  
- Docs básicas en español

### Milestone 2: CRUD + Expertos (50%)
- Gestión proyectos y variables
- Catálogo expertos simple
- Testing unitario >80%

### Milestone 3: Votación + Cronómetro (75%)  
- Matriz votación mobile
- Timer por variable
- Testing móvil completo

### Milestone 4: Resultados + Deploy (100%)
- Cálculos MIC MAC
- Visualización interactiva
- Deploy público + docs finales

## 🔥 Configuración Rápida

### Pasos de Setup Linear
1. **Crear Workspace**: "MIC MAC Pro - MVP Development"
2. **Importar Labels**: Copiar tags de este documento
3. **Crear Custom Fields**: Story points, coverage, etc.
4. **Setup Templates**: Copiar templates de issues
5. **Configurar Automation**: Rules de timestamps
6. **GitHub Integration**: Conectar repositorio
7. **Dashboard Setup**: Métricas de MVP

### Primera Sprint - Issues a Crear
```
🏗️ MIC-001: Setup proyecto Next.js + Supabase + Prisma
🧪 MIC-002: Configurar Jest + Testing Library + CI
📚 MIC-003: README inicial en español
🔐 MIC-004: Autenticación Supabase con roles
💾 MIC-005: Esquemas BD + seed data expertos
🧪 MIC-006: Tests unitarios auth + BD
📚 MIC-007: Documentación AUTH.md + DATABASE.md
```

## 🚀 ¡Listo para Empezar!

Con esta configuración tendremos:
- ✅ **Tracking metodológico** completo
- ✅ **Timestamps automáticos** de desarrollo  
- ✅ **Quality gates** para testing y docs
- ✅ **Integración Git** perfecta
- ✅ **Métricas en tiempo real** del MVP
- ✅ **Templates** consistentes en español

**Próximo paso**: Crear workspace Linear y comenzar con MIC-001 🎯
