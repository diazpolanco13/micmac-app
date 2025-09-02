# 🚀 PLAN ESTRATÉGICO DE MIGRACIÓN MOCK → SUPABASE

## 📋 ANÁLISIS DEL PROBLEMA ANTERIOR

**¿Por qué falló la migración anterior?**
- ❌ **Migración masiva**: Todo de golpe sin fases
- ❌ **Referencias cruzadas**: Mock y Supabase mezclados
- ❌ **Loading recursivos**: Contextos mal desacoplados  
- ❌ **Datos corruptos**: Funciones mock inyectando datos incorrectos
- ❌ **Sin rollback**: No había puntos de retorno seguros

## 🎯 ESTRATEGIA DE MIGRACIÓN POR FASES

### 📊 ESTADO ACTUAL DETECTADO

**30 archivos** usando contextos Mock:
- `MockAuthContext` - Autenticación simulada
- `MockDataContext` - Datos simulados (proyectos, expertos, votos)
- `useMockAuth()` - Hook de autenticación mock
- `useMockData()` - Hook de datos mock

## 🏗️ PLAN DE MIGRACIÓN (7 FASES)

---

### **FASE 1: PREPARACIÓN Y AISLAMIENTO** 🛡️
**Objetivo**: Crear infraestructura dual sin romper nada

#### ✅ Tareas:
1. **Crear contexto híbrido** `AuthContext` que pueda usar Mock o Supabase
2. **Crear flag de migración** `USE_SUPABASE_AUTH=false` en `.env.local`
3. **Crear adaptadores** para mantener interfaces compatibles
4. **Backup completo** del estado actual

#### 🎯 **Criterio de éxito**: 
- App funciona exactamente igual
- Infraestructura dual lista
- Tests de regresión pasando

---

### **FASE 2: MIGRACIÓN DE AUTENTICACIÓN** 🔐
**Objetivo**: Cambiar solo la autenticación, mantener datos Mock

#### ✅ Tareas:
1. **Activar** `USE_SUPABASE_AUTH=true`
2. **Migrar usuarios demo** a tabla `users` de Supabase
3. **Adaptar** `SupabaseAuthContext` para usar mismas interfaces
4. **Mantener** `MockDataContext` intacto

#### 🎯 **Criterio de éxito**:
- Login/logout funciona con Supabase
- Datos siguen siendo Mock
- No hay loading recursivos

---

### **FASE 3: MIGRACIÓN DE ORGANIZACIONES** 🏢
**Objetivo**: Migrar solo organizaciones, mantener proyectos Mock

#### ✅ Tareas:
1. **Migrar organizaciones** de Mock a Supabase
2. **Crear adaptador** `OrganizationService`
3. **Actualizar** multi-tenant para usar Supabase
4. **Mantener** proyectos y expertos Mock

#### 🎯 **Criterio de éxito**:
- Cambio de organización funciona
- Aislamiento de datos funcional
- Proyectos siguen siendo Mock

---

### **FASE 4: MIGRACIÓN DE PROYECTOS** 📋
**Objetivo**: Migrar proyectos, mantener expertos Mock

#### ✅ Tareas:
1. **Migrar proyectos** de Mock a Supabase
2. **Crear** `ProjectService` con Prisma
3. **Actualizar** CRUD de proyectos
4. **Mantener** expertos y votos Mock

#### 🎯 **Criterio de éxito**:
- CRUD de proyectos con Supabase
- Variables de proyectos funcionando
- Expertos siguen Mock

---

### **FASE 5: MIGRACIÓN DE EXPERTOS** 🎓
**Objetivo**: Migrar expertos, mantener votos Mock

#### ✅ Tareas:
1. **Migrar expertos** de Mock a Supabase
2. **Crear** `ExpertService` con Prisma
3. **Actualizar** formularios de expertos
4. **Mantener** sistema de votos Mock

#### 🎯 **Criterio de éxito**:
- Gestión de expertos con Supabase
- Invitaciones funcionando
- Votos siguen Mock

---

### **FASE 6: MIGRACIÓN DE VOTOS Y MIC MAC** 🗳️
**Objetivo**: Migrar sistema de votación completo

#### ✅ Tareas:
1. **Migrar votos** a tabla `evaluations`
2. **Crear** `VotingService` con Prisma
3. **Actualizar** cálculos MIC MAC
4. **Migrar** resultados y cache

#### 🎯 **Criterio de éxito**:
- Sistema de votos con Supabase
- Cálculos MIC MAC funcionando
- Resultados persistentes

---

### **FASE 7: LIMPIEZA Y OPTIMIZACIÓN** 🧹
**Objetivo**: Eliminar código Mock y optimizar

#### ✅ Tareas:
1. **Eliminar** `MockAuthContext` y `MockDataContext`
2. **Limpiar** imports y referencias Mock
3. **Optimizar** queries y performance
4. **Crear** tests de integración final

#### 🎯 **Criterio de éxito**:
- Sin código Mock residual
- Performance optimizada
- Sistema 100% Supabase

---

## 🛡️ ESTRATEGIAS DE SEGURIDAD

### **ROLLBACK POINTS**
- Cada fase tiene su propio **commit de rollback**
- **Branch por fase** para rollback granular
- **Tests automáticos** antes de cada fase

### **MONITORING**
- **Logs detallados** en cada fase
- **Performance monitoring** en tiempo real
- **Error tracking** específico por fase

### **TESTING**
- **Tests de regresión** después de cada fase
- **Tests de carga** para detectar problemas de performance
- **Tests de integración** para validar funcionalidad

---

## 📈 CRONOGRAMA ESTIMADO

| Fase | Duración | Riesgo | Prioridad |
|------|----------|---------|-----------|
| 1 - Preparación | 2-3 horas | 🟢 Bajo | Alta |
| 2 - Auth | 1-2 horas | 🟡 Medio | Alta |
| 3 - Orgs | 1 hora | 🟢 Bajo | Media |
| 4 - Proyectos | 2-3 horas | 🟡 Medio | Alta |
| 5 - Expertos | 2-3 horas | 🟡 Medio | Alta |
| 6 - Votos | 3-4 horas | 🔴 Alto | Crítica |
| 7 - Limpieza | 1-2 horas | 🟢 Bajo | Media |

**Total estimado: 12-18 horas** distribuidas en varios días

---

## 🚀 PRÓXIMO PASO

**¿Comenzamos con la FASE 1?**

La Fase 1 es completamente segura - solo preparamos la infraestructura dual sin cambiar nada del comportamiento actual.

**Comando para iniciar:**
```bash
# Crear branch para Fase 1
git checkout -b migration-phase-1-preparation
```
