# 🚀 ROADMAP MIC MAC PRO - NAVEGACIÓN + CALENDARIO + PROGRAMACIÓN
*Actualizado con sistema completo de navegación y programación de consultas*
*Fecha: Enero 2025*

---

## 📊 ESTADO ACTUAL CONSOLIDADO

### ✅ **SISTEMA COMPLETAMENTE FUNCIONAL (98%)**
- **Frontend UI/UX**: Sistema MIC MAC completo con selector de métodos
- **Sistema de Votación**: 2 fases (Influencia + Dependencia) funcional
- **Motor de Cálculo**: Método Clásico + Híbrido implementados
- **Gestión de Expertos**: CRUD completo con métricas avanzadas
- **Visualización**: Gráficos interactivos y análisis profesional
- **MockData**: Sistema completo simulando 320 votos de 8 expertos

### ❌ **PROBLEMAS CRÍTICOS IDENTIFICADOS**
1. **Navegación rota**: Estado activo hardcodeado, enlaces a páginas inexistentes
2. **Routing deficiente**: Auth → Dashboard no funciona correctamente  
3. **Menú sobrecargado**: Muchas opciones sin implementar
4. **Sin calendario**: No existe sistema de programación de consultas
5. **Sin estados de proyecto**: DRAFT vs ACTIVE no afecta visibilidad

---

## 🎯 **ROADMAP PRE-BASE DE DATOS - FUNCIONALIDAD COMPLETA**

### **FASE 1: NAVEGACIÓN INTELIGENTE** ⚡ CRÍTICO
*Duración: 2 días*

#### **1.1 Sistema de Detección de Rutas Activas**
- [ ] **Crear hook `useActiveRoute()`**
  - Detectar pathname actual con useRouter
  - Comparar con rutas del menú
  - Manejar rutas anidadas (/projects/[id])
  - Return estado activo por item de menú

- [ ] **Refactorizar Sidebar.tsx**
  - Eliminar `current: true` hardcodeado
  - Implementar estado dinámico con useActiveRoute
  - Highlight submenu activo automáticamente
  - Animaciones de transición suaves

- [ ] **Arreglar flujo de autenticación**
  - Login exitoso → redirect a /dashboard
  - Register exitoso → redirect a /dashboard  
  - Logout → redirect a /auth
  - Protección de rutas mejorada

#### **1.2 Simplificación del Menú**
- [ ] **Crear página `/en-desarrollo`**
  - Diseño consistente con el tema
  - Mensaje explicativo del roadmap
  - Estimación de funcionalidades futuras
  - Botón "Volver" contextual

- [ ] **Menú MODERADOR simplificado (8→5 items)**
  ```
  📊 Dashboard ✅
  👤 Mi Perfil ✅
  📁 Proyectos ✅
    ├── Todos los Proyectos ✅
    ├── Crear Proyecto → Modal ✅
    └── Plantillas/Archivados → En Desarrollo
  👥 Expertos ✅
    ├── Gestionar Expertos ✅
    └── Invitar/Rendimiento → En Desarrollo
  🗓️ Calendario → NUEVO
  🧪 Análisis MIC MAC → Redirigir a proyecto activo
  📈 Resultados → Redirigir a proyecto activo
  ```

- [ ] **Menú EXPERTO simplificado (7→4 items)**
  ```
  📊 Dashboard ✅
  👤 Mi Perfil ✅
  🗓️ Calendario → NUEVO
  🗳️ Votaciones → Proyectos activos asignados
  ```

#### **1.3 Breadcrumbs Automáticos**
- [ ] **Componente Breadcrumbs.tsx**
  - Generación automática basada en ruta
  - Links funcionales a rutas padre
  - Iconos contextuales por sección
  - Responsive design

### **FASE 2: SISTEMA DE CALENDARIO Y PROGRAMACIÓN** 🗓️ NUEVO
*Duración: 3 días*

#### **2.1 Modelo de Datos para Programación**
- [ ] **Extender tipos TypeScript**
  ```typescript
  interface ProjectSchedule {
    id: string
    projectId: string
    scheduledDate: Date
    endDate?: Date
    status: 'SCHEDULED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
    invitationsSent: boolean
    remindersSent: number
    expertInvitations: ExpertInvitation[]
  }

  interface ExpertInvitation {
    id: string
    expertId: string
    projectScheduleId: string
    invitedAt: Date
    status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED'
    respondedAt?: Date
    reminderCount: number
  }
  ```

- [ ] **Extender MockDataContext**
  - Agregar projectSchedules array
  - Funciones CRUD para programación
  - Simulación de invitaciones
  - Estados de respuesta de expertos

#### **2.2 Wizard de Programación de Proyectos**
- [ ] **Extender CreateProjectModal**
  - Paso 4: "Programación" (opcional)
  - DatePicker para fecha de consulta
  - Duración estimada (días)
  - Selección de expertos a invitar
  - Preview de cronograma

- [ ] **Componente ScheduleProjectModal**
  - Modal independiente para proyectos existentes
  - Calendar view para seleccionar fecha
  - Lista de expertos disponibles
  - Configuración de recordatorios
  - Validaciones de fechas futuras

#### **2.3 Página de Calendario (/calendar)**
- [ ] **Vista mensual completa**
  - Calendar grid responsive
  - Proyectos programados por día
  - Colores por estado del proyecto
  - Click en día → detalle de proyectos
  - Navegación mes anterior/siguiente

- [ ] **Vista de lista**
  - Proyectos ordenados cronológicamente
  - Filtros por estado y tipo
  - Búsqueda por nombre de proyecto
  - Acciones rápidas (editar, cancelar)

- [ ] **Dashboard de calendario**
  - Próximos 7 días destacados
  - Estadísticas de participación
  - Recordatorios pendientes
  - Invitaciones por responder (Expertos)

### **FASE 3: ESTADOS DE PROYECTO Y VISIBILIDAD** 📊 CRÍTICO  
*Duración: 2 días*

#### **3.1 Lógica de Estados Mejorada**
- [ ] **Estados de proyecto refinados**
  ```typescript
  enum ProjectStatus {
    DRAFT = 'DRAFT',           // Solo visible para creador
    SCHEDULED = 'SCHEDULED',   // Programado, invitaciones enviadas
    ACTIVE = 'ACTIVE',         // En votación, visible para expertos
    COMPLETED = 'COMPLETED',   // Votación terminada
    CANCELLED = 'CANCELLED'    // Cancelado
  }
  ```

- [ ] **Filtrado por rol y estado**
  - MODERADOR: Ve todos sus proyectos
  - EXPERTO: Solo ve ACTIVE donde está invitado
  - Dashboard diferenciado por rol
  - Notificaciones contextuales

#### **3.2 Sistema de Invitaciones Simulado**
- [ ] **Mock de envío de invitaciones**
  - Función `sendInvitations(projectId, expertIds)`
  - Cambio de estado DRAFT → SCHEDULED
  - Simulación de emails enviados
  - Log de actividad de invitaciones

- [ ] **Panel de seguimiento (Moderador)**
  - Lista de invitaciones enviadas
  - Estados de respuesta por experto
  - Recordatorios automáticos simulados
  - Métricas de participación

- [ ] **Panel de invitaciones (Experto)**
  - Proyectos pendientes de respuesta
  - Botones Aceptar/Rechazar
  - Calendario de compromisos
  - Historial de participación

### **FASE 4: PÁGINAS CRÍTICAS FALTANTES** 📄 ESENCIAL
*Duración: 2 días*

#### **4.1 Página de Resultados Global (/results)**
- [ ] **Dashboard de resultados**
  - Lista de proyectos completados
  - Filtros por fecha y tipo
  - Métricas comparativas
  - Exportación de reportes

- [ ] **Integración con proyecto activo**
  - Si hay proyecto activo → mostrar sus resultados
  - Si no hay proyecto → lista general
  - Breadcrumbs contextuales
  - Navegación fluida

#### **4.2 Página de Análisis MIC MAC (/analysis/micmac)**
- [ ] **Redirección inteligente**
  - Si hay proyecto activo → ir a votación
  - Si no hay proyecto → crear nuevo proyecto
  - Lista de proyectos disponibles para análisis
  - Tutorial de metodología MIC MAC

#### **4.3 Optimización de rutas existentes**
- [ ] **Mejorar /projects/new**
  - Redirección correcta después de crear
  - Validación completa del wizard
  - Integración con sistema de programación
  - Estados de loading apropiados

### **FASE 5: MEJORAS DE UX/UI** 🎨 CALIDAD
*Duración: 1 día*

#### **5.1 Estados de Loading y Errores**
- [ ] **Skeletons para navegación**
- [ ] **Loading states** en cambios de ruta
- [ ] **Error boundaries** para rutas rotas
- [ ] **404 page** personalizada

#### **5.2 Animaciones y Transiciones**
- [ ] **Page transitions** suaves
- [ ] **Sidebar animations** mejoradas
- [ ] **Calendar hover effects**
- [ ] **Mobile gestures** para navegación

---

## 📋 **CHECKLIST COMPLETO DE IMPLEMENTACIÓN**

### **🔧 NAVEGACIÓN (Fase 1)**
- [ ] Hook `useActiveRoute()` implementado
- [ ] Sidebar.tsx refactorizado con estado dinámico  
- [ ] Página `/en-desarrollo` creada
- [ ] Menú simplificado (MODERATOR: 5 items, EXPERT: 4 items)
- [ ] Breadcrumbs automáticos funcionando
- [ ] Flujo auth → dashboard arreglado
- [ ] Testing completo de navegación

### **🗓️ CALENDARIO (Fase 2)**
- [ ] Tipos TypeScript para programación
- [ ] MockDataContext extendido
- [ ] Wizard de programación en CreateProject
- [ ] Página `/calendar` completamente funcional
- [ ] Vista mensual + vista de lista
- [ ] Dashboard de calendario integrado
- [ ] Sistema de invitaciones simulado

### **📊 ESTADOS (Fase 3)**
- [ ] Estados de proyecto refinados
- [ ] Filtrado por rol implementado
- [ ] Panel de seguimiento para moderadores
- [ ] Panel de invitaciones para expertos
- [ ] Visibilidad correcta por estado
- [ ] Notificaciones contextuales

### **📄 PÁGINAS (Fase 4)**
- [ ] `/results` página global implementada
- [ ] `/analysis/micmac` redirección inteligente
- [ ] `/projects/new` optimizado
- [ ] Todas las rutas del menú funcionales
- [ ] 404 y error handling

### **🎨 UX/UI (Fase 5)**
- [ ] Loading states implementados
- [ ] Error boundaries configurados
- [ ] Animaciones de transición
- [ ] Mobile gestures optimizados

---

## 🎯 **FUNCIONALIDADES NUEVAS PRINCIPALES**

### **1. PROGRAMACIÓN DE CONSULTAS** 🆕
- **Creación de proyectos** con fecha futura
- **Invitaciones automáticas** en la fecha programada
- **Calendario visual** con todos los proyectos
- **Dashboard de seguimiento** de respuestas

### **2. CALENDARIO INTELIGENTE** 🆕
- **Vista mensual** con proyectos por día
- **Vista de lista** cronológica
- **Filtros avanzados** por estado y tipo
- **Integración** con dashboard principal

### **3. SISTEMA DE INVITACIONES** 🆕
- **Mock de emails** enviados a expertos
- **Estados de respuesta** (Pendiente/Aceptado/Rechazado)
- **Recordatorios automáticos** simulados
- **Panel de seguimiento** para moderadores

### **4. VISIBILIDAD POR ESTADOS** 🆕
- **DRAFT**: Solo visible para creador
- **SCHEDULED**: Programado, invitaciones enviadas
- **ACTIVE**: Visible para expertos invitados
- **COMPLETED**: Resultados disponibles

### **5. NAVEGACIÓN INTELIGENTE** 🆕
- **Estado activo dinámico** basado en ruta actual
- **Breadcrumbs automáticos** contextuales
- **Menú simplificado** con páginas funcionales
- **Redirecciones inteligentes** según contexto

---

## ⏱️ **CRONOGRAMA DE IMPLEMENTACIÓN**

### **SEMANA 1: NAVEGACIÓN + CALENDARIO**
- **Días 1-2**: Fase 1 (Navegación inteligente)
- **Días 3-5**: Fase 2 (Sistema de calendario)

### **SEMANA 2: ESTADOS + PÁGINAS**  
- **Días 1-2**: Fase 3 (Estados de proyecto)
- **Días 3-4**: Fase 4 (Páginas críticas)
- **Día 5**: Fase 5 (Mejoras UX/UI)

### **TOTAL: 10 días de desarrollo**

---

## 🚀 **CRITERIOS DE ÉXITO PRE-BD**

### **✅ NAVEGACIÓN PERFECTA**
- [ ] Todos los enlaces del menú funcionan
- [ ] Estado activo se actualiza automáticamente
- [ ] Breadcrumbs correctos en todas las páginas
- [ ] Auth flow completamente funcional

### **✅ CALENDARIO OPERATIVO**  
- [ ] Proyectos se pueden programar a futuro
- [ ] Calendar view muestra todos los proyectos
- [ ] Invitaciones se "envían" automáticamente
- [ ] Expertos ven solo sus proyectos asignados

### **✅ ESTADOS CORRECTOS**
- [ ] DRAFT no visible para expertos
- [ ] ACTIVE visible solo para invitados
- [ ] Transiciones de estado funcionan
- [ ] Dashboard diferenciado por rol

### **✅ EXPERIENCIA COMPLETA**
- [ ] Demo end-to-end funciona perfectamente
- [ ] Todos los flujos principales operativos
- [ ] Sin enlaces rotos ni páginas vacías
- [ ] UX fluida en desktop y mobile

---

## 💡 **DESPUÉS DE ESTA FASE**

Una vez completado este roadmap, el sistema estará **100% funcional con MockData** y listo para:

1. **Conectar base de datos real** sin cambios de UX
2. **Migrar MockData** a Prisma/Supabase  
3. **Desplegar a producción** con confianza total
4. **Agregar funcionalidades avanzadas** sobre base sólida

**El objetivo es tener un MVP completamente funcional y profesional ANTES de tocar la base de datos.**

---

*Roadmap actualizado: Enero 2025*  
*Versión: Navegación + Calendario + Programación*  
*Estado: 🎯 Pre-implementación - Lista para desarrollo acelerado*
