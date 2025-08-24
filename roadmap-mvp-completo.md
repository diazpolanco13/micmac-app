# Roadmap MVP MIC MAC Pro - Completo con Testing y Documentación 🚀

## 🎯 Objetivo: Sistema Funcional + Testing + Documentación + Tracking Linear

### 📋 **Scope MVP Definitivo**

**Funcionalidades Core:**
- ✅ Autenticación Supabase (Moderador/Experto)
- ✅ CRUD de proyectos MIC MAC
- ✅ Gestión de variables del sistema
- ✅ Selección de expertos (lista predefinida)
- ✅ Matriz de votación mobile con **cronómetro por variable**
- ✅ Motor de cálculo MIC MAC (motricidad/dependencia)
- ✅ Visualización gráfica de resultados
- ✅ Deploy funcional en Vercel

**Calidad y Documentación:**
- ✅ **Pruebas unitarias** para cada módulo
- ✅ **Documentación detallada en español** en Git
- ✅ **Registro metodológico progresivo** en Linear
- ✅ **Cobertura de testing** mínima 80%
- ✅ **README completo** en español

---

## 🏗️ **FASE 1: FUNDACIÓN + TESTING**

### 1.1 Setup del Proyecto
**Desarrollo:**
- Inicializar Next.js 14 + TypeScript + Tailwind
- Configurar Supabase proyecto y client
- Setup Prisma con PostgreSQL de Supabase
- Configurar ESLint + Prettier
- Docker setup básico

**Testing:**
- Configurar Jest + Testing Library
- Setup coverage reports
- Configurar CI/CD básico con GitHub Actions

**Documentación:**
```markdown
# 📚 Docs a crear:
├── README.md (español completo)
├── SETUP.md (instalación paso a paso)
├── ARQUITECTURA.md (decisiones técnicas)
├── API.md (endpoints documentados)
└── TESTING.md (estrategia de pruebas)
```

**Linear Tracking:**
- Issue: "Setup proyecto base con testing"
- Acceptance Criteria detallados
- Registro de tiempo inicio/fin automático
- Screenshots de progreso

### 1.2 Base de Datos y Esquemas
**Desarrollo:**
- Esquemas Prisma (Users, Projects, Variables, Experts, Evaluations)
- Migraciones de BD
- Seed data con 20 expertos diversos y realistas
- Relaciones many-to-many configuradas

**Testing:**
```typescript
// Ejemplo test de esquemas
describe('Database Schemas', () => {
  test('debe crear proyecto con variables', async () => {
    const project = await prisma.project.create({
      data: {
        name: 'Test MIC MAC',
        variables: {
          create: [
            { name: 'Variable A', description: 'Test var' }
          ]
        }
      }
    });
    expect(project.variables).toHaveLength(1);
  });
});
```

**Documentación:**
- `DATABASE.md`: Esquema completo documentado
- Diagramas ER en español
- Ejemplos de queries comunes

**Linear:**
- Issue: "Esquemas de BD y seed data"
- Subtasks por cada tabla
- Validación de integridad referencial

### 1.3 Autenticación Supabase
**Desarrollo:**
- Integración Supabase Auth con Next.js
- Middleware de protección de rutas
- Roles: Moderador/Experto
- Session management y persistencia

**Testing:**
```typescript
describe('Authentication', () => {
  test('debe autenticar moderador correctamente', async () => {
    const { user } = await signIn('moderador@test.com', 'password');
    expect(user.role).toBe('moderator');
  });
  
  test('debe proteger rutas de moderador', async () => {
    // Test middleware protection
  });
});
```

**Documentación:**
- `AUTH.md`: Flujo de autenticación explicado
- Diagramas de roles y permisos
- Ejemplos de uso

**Linear:**
- Issue: "Sistema de autenticación completo"
- Testing de flujos de auth
- Documentación de seguridad

---

## 🎨 **FASE 2: GESTIÓN DE PROYECTOS + TESTING**

### 2.1 CRUD de Proyectos MIC MAC
**Desarrollo:**
- API Routes para proyectos (/api/projects)
- Componentes React para CRUD
- Formularios con validación (Zod)
- Estados del proyecto (Draft → Active → Completed)

**Testing:**
```typescript
describe('Projects CRUD', () => {
  test('debe crear proyecto con validación', async () => {
    const projectData = {
      name: 'Futuro Educación',
      description: 'Análisis prospectivo...'
    };
    const response = await createProject(projectData);
    expect(response.status).toBe('created');
  });
  
  test('debe validar campos requeridos', async () => {
    const invalidData = { name: '' };
    await expect(createProject(invalidData)).rejects.toThrow();
  });
});
```

**Documentación:**
- `PROYECTOS.md`: Gestión completa de proyectos
- Estados y transiciones documentadas
- API endpoints con ejemplos

**Linear:**
- Issue: "CRUD proyectos con validación"
- Subtasks por cada operación CRUD
- Testing de validaciones

### 2.2 Gestión de Variables
**Desarrollo:**
- CRUD de variables por proyecto
- Validación mínima (3 variables, máximo 10)
- Reordenamiento drag & drop
- Interfaz mobile-friendly

**Testing:**
```typescript
describe('Variables Management', () => {
  test('debe permitir mínimo 3 variables', async () => {
    const project = await createTestProject();
    const variables = await addVariables(project.id, 2);
    await expect(validateProject(project.id)).rejects.toThrow('Mínimo 3 variables');
  });
});
```

**Documentación:**
- `VARIABLES.md`: Metodología MIC MAC aplicada
- Criterios de validación explicados

**Linear:**
- Issue: "Gestión de variables del sistema"
- Testing de validaciones metodológicas

---

## 👥 **FASE 3: EXPERTOS Y SELECCIÓN + TESTING**

### 3.1 Catálogo de Expertos
**Desarrollo:**
- Lista de expertos con filtros básicos
- Perfiles con expertise areas
- Selección multiple con validación
- Interfaz responsive tipo cards

**Testing:**
```typescript
describe('Expert Selection', () => {
  test('debe filtrar expertos por área', async () => {
    const experts = await getExpertsByArea('tecnología');
    expect(experts.every(e => e.expertise.includes('tecnología'))).toBe(true);
  });
  
  test('debe validar mínimo 3 expertos', async () => {
    const selection = [expert1, expert2];
    await expect(validateExpertPanel(selection)).rejects.toThrow();
  });
});
```

**Documentación:**
- `EXPERTOS.md`: Metodología de selección
- Criterios de expertise documentados

**Linear:**
- Issue: "Catálogo y selección de expertos"
- Testing de filtros y validaciones

---

## 🗳️ **FASE 4: VOTACIÓN CON CRONÓMETRO + TESTING**

### 4.1 Matriz de Votación Mobile
**Desarrollo:**
- Matriz NxN responsive y touch-friendly
- Modal de votación por celda
- Escala 0-3 con descriptores claros
- Auto-save progresivo

**Testing:**
```typescript
describe('Voting Matrix', () => {
  test('debe renderizar matriz NxN correctamente', () => {
    const variables = createTestVariables(4);
    render(<VotingMatrix variables={variables} />);
    expect(screen.getAllByRole('button')).toHaveLength(16);
  });
  
  test('debe validar votos en rango 0-3', async () => {
    await expect(submitVote(varA, varB, 5)).rejects.toThrow('Valor inválido');
  });
});
```

### 4.2 Sistema de Cronómetro
**Desarrollo:**
- Timer por variable (60s default, configurable)
- Progress indicator visual
- Auto-avance a siguiente variable
- Alerta a 10 segundos restantes
- Vibración en móvil (si disponible)

**Testing:**
```typescript
describe('Voting Timer', () => {
  test('debe iniciar timer al abrir modal', () => {
    render(<VotingModal duration={60} />);
    expect(screen.getByText('60')).toBeInTheDocument();
  });
  
  test('debe auto-votar 0 en timeout', async () => {
    const onVote = jest.fn();
    render(<VotingModal duration={1} onVote={onVote} />);
    await waitFor(() => expect(onVote).toHaveBeenCalledWith(0), { timeout: 2000 });
  });
});
```

**Documentación:**
- `VOTACION.md`: UX de votación explicada
- Metodología del cronómetro justificada

**Linear:**
- Issue: "Matriz votación con cronómetro"
- Testing de timer y auto-save
- Pruebas en dispositivos móviles

---

## 📊 **FASE 5: CÁLCULOS Y VISUALIZACIÓN + TESTING**

### 5.1 Motor de Cálculo MIC MAC
**Desarrollo:**
- Algoritmos de motricidad y dependencia
- Clasificación en cuadrantes
- Validación de completitud de votos
- Optimización para recálculos

**Testing:**
```typescript
describe('MIC MAC Calculations', () => {
  test('debe calcular motricidad correctamente', () => {
    const evaluations = createTestEvaluations();
    const result = calculateMotricidad(evaluations);
    expect(result.variable1.motricidad).toBe(7);
  });
  
  test('debe clasificar en cuadrantes correctos', () => {
    const variable = { motricidad: 8, dependencia: 3 };
    expect(getQuadrant(variable)).toBe('variables_clave');
  });
});
```

**Documentación:**
- `ALGORITMOS.md`: Matemática MIC MAC explicada
- Ejemplos de cálculo paso a paso

### 5.2 Visualización Interactiva
**Desarrollo:**
- Gráfico de cuadrantes con Recharts
- Puntos interactivos con tooltips
- Responsive para móvil
- Colores distintivos por cuadrante

**Testing:**
```typescript
describe('MIC MAC Visualization', () => {
  test('debe renderizar gráfico con datos', () => {
    const data = createTestMICMACData();
    render(<MICMACChart data={data} />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });
});
```

**Linear:**
- Issue: "Motor cálculo MIC MAC"
- Issue: "Visualización interactiva"
- Testing matemático exhaustivo

---

## 🚀 **FASE 6: DEPLOY Y DOCUMENTACIÓN FINAL + TESTING**

### 6.1 Deploy y CI/CD
**Desarrollo:**
- Deploy a Vercel con configuración optimizada
- Variables de entorno configuradas
- GitHub Actions para testing automático
- Monitoring básico

**Testing:**
```typescript
describe('Production Build', () => {
  test('debe construir sin errores', async () => {
    const build = await runBuild();
    expect(build.errors).toHaveLength(0);
  });
});
```

### 6.2 Documentación Completa en Español
**Archivos a crear:**
```
📚 Documentación Final:
├── README.md - Introducción completa
├── INSTALACION.md - Setup paso a paso
├── MANUAL-USUARIO.md - Guía de uso
├── MANUAL-TECNICO.md - Arquitectura y APIs
├── METODOLOGIA-MICMAC.md - Fundamentos teóricos
├── TESTING.md - Estrategia de pruebas
├── DEPLOYMENT.md - Guía de despliegue
└── CHANGELOG.md - Historial de cambios
```

### 6.3 Testing End-to-End
**Scenarios completos:**
```typescript
describe('Complete MIC MAC Flow', () => {
  test('flujo completo: crear proyecto → votar → ver resultados', async () => {
    // 1. Login como moderador
    // 2. Crear proyecto con variables
    // 3. Seleccionar expertos
    // 4. Login como experto y votar
    // 5. Ver resultados como moderador
    // 6. Validar cálculos correctos
  });
});
```

---

## 📊 **REGISTRO METODOLÓGICO EN LINEAR**

### Estructura de Issues
```
🎯 Epic: [Fase] - Nombre de la fase
├── 📋 Story: [Desarrollo] Feature específica
├── 🧪 Story: [Testing] Pruebas de la feature
├── 📚 Story: [Docs] Documentación de la feature
└── ✅ Story: [Validación] Testing E2E
```

### Templates de Issue
**Template: Development Story**
```markdown
## 🎯 Objetivo
[Qué vamos a desarrollar]

## 📋 Acceptance Criteria
- [ ] Funcionalidad implementada
- [ ] Responsive en móvil
- [ ] Validaciones incluidas
- [ ] Error handling

## 🧪 Testing Requirements
- [ ] Unit tests escritos
- [ ] Coverage > 80%
- [ ] Tests pasando en CI

## 📚 Documentation
- [ ] Código comentado
- [ ] README actualizado
- [ ] API documentada (si aplica)

## ✅ Definition of Done
- [ ] Code review completado
- [ ] Tests pasando
- [ ] Documentación actualizada
- [ ] Deploy exitoso
```

### Tracking Automático
- **Started At**: Timestamp al mover a "In Progress"
- **Completed At**: Timestamp al mover a "Done"  
- **Commits**: Auto-link con GitHub
- **Coverage**: Reporte automático de testing
- **Deploy Status**: Estado de deployment

### Métricas de Calidad
```
📊 Dashboard MVP:
├── 🧪 Test Coverage: >80%
├── 🐛 Bugs Open: <5
├── 📚 Docs Updated: 100%
├── 🚀 Deploy Status: ✅
└── 📱 Mobile Tests: ✅
```

---

## 🎯 **Criterios de MVP Completado**

### Demo Funcional
1. ✅ Crear cuenta y login
2. ✅ Crear proyecto "Futuro de la Educación Digital"
3. ✅ Definir 5 variables del sistema
4. ✅ Seleccionar 5 expertos diversos
5. ✅ Votar como experto con cronómetro en móvil
6. ✅ Ver resultados MIC MAC con gráfico interactivo

### Calidad Técnica
- ✅ **Test Coverage**: Mínimo 80%
- ✅ **Documentación**: 100% en español
- ✅ **Mobile**: Funcional en iOS/Android
- ✅ **Performance**: <3s carga inicial
- ✅ **Deploy**: URL pública accesible

### Linear Tracking
- ✅ **Issues**: 100% documentados y cerrados
- ✅ **Timestamps**: Registro completo de desarrollo
- ✅ **Coverage**: Métricas de calidad tracked
- ✅ **Documentation**: Links a docs actualizadas

---

## 🎯 **ESTADO ACTUAL - 24 Agosto 2025**

### ✅ **LOGROS RECIENTES:**

**FASE 3 COMPLETADA (95%)**:
- ✅ **CRUD Completo de Proyectos** funcionando
- ✅ **VariableManager** con drag & drop implementado
- ✅ **Modales responsive** (CreateProject + EditProject)
- ✅ **Validación metodológica MIC MAC** (3-10 variables)
- ✅ **UX Premium** con iconos grandes y feedback visual
- ✅ **Dashboard integrado** con todas las funcionalidades

### 🟡 **PRÓXIMO PASO:**

**FASE 4 - Gestión de Estados + Expertos**:
- ⏳ Estados del proyecto (Draft → Setup → Active → Completed)
- ⏳ Gestión completa de expertos (CRUD)
- ⏳ Validaciones según estado
- ⏳ Preparación para matriz de votación

### 📊 **Progreso Global**: 65% completado

**Estimación**: MVP funcional en 4-5 días más

---

## 🔥 **¡FASE 3 EXITOSAMENTE COMPLETADA!**

**Sistema CRUD totalmente operativo** ✅
**Siguiente etapa**: Gestión de estados y expertos 🚀
