# 📋 METODOLOGÍA DE REGISTRO DE EXPERTOS - SISTEMA MIC MAC

## 🎯 **FLUJOS DE REGISTRO DEFINIDOS**

### **Opción A: Registro Administrativo (RECOMENDADO)**
**📍 Ubicación:** `/experts` - Panel de Gestión de Expertos  
**👤 Quién:** Solo moderadores y administradores  
**🎯 Propósito:** Registro centralizado y controlado

#### **✅ Ventajas:**
- **Control de calidad:** Solo moderadores registran expertos verificados
- **Datos completos:** Formulario extenso con toda la información necesaria
- **Validación previa:** Se verifica la experiencia y credenciales antes del registro
- **Base de datos curada:** Solo expertos realmente calificados

#### **📋 Proceso:**
1. **Moderador accede a `/experts`**
2. **Clic en "Nuevo Experto"**
3. **Completa formulario extenso:**
   - Información personal completa
   - Verificación de credenciales
   - Áreas de expertise validadas
   - Rol asignado (EXPERT/MODERATOR)
4. **Sistema valida email único**
5. **Experto queda registrado y disponible para proyectos**

---

### **Opción B: Auto-registro (FUTURO)**
**📍 Ubicación:** `/auth/register` (expandido)  
**👤 Quién:** Los propios expertos  
**🎯 Propósito:** Registro abierto con validación posterior

#### **✅ Ventajas:**
- **Escalabilidad:** Los expertos se registran directamente
- **Menor carga administrativa:** Menos trabajo para moderadores
- **Acceso inmediato:** Expertos pueden acceder más rápido

#### **⚠️ Desventajas:**
- **Requiere validación:** Moderadores deben aprobar cada registro
- **Calidad variable:** Información puede ser incompleta o inexacta
- **Sistema más complejo:** Necesita flujo de aprobación

#### **📋 Proceso (Futuro):**
1. **Experto va a `/auth/register`**
2. **Selecciona "Registrarse como Experto"**
3. **Completa formulario básico**
4. **Sistema envía para aprobación**
5. **Moderador revisa y aprueba/rechaza**
6. **Experto recibe notificación de estado**

---

## 🎯 **METODOLOGÍA ACTUAL IMPLEMENTADA**

### **🏗️ SOLO REGISTRO ADMINISTRATIVO (Opción A)**

**Estado actual:** El sistema implementa únicamente el registro administrativo por las siguientes razones metodológicas:

#### **✅ Justificación Metodológica MIC MAC:**
1. **Calidad del Panel:** La metodología MIC MAC requiere expertos verdaderamente calificados
2. **Diversidad Controlada:** Los moderadores pueden balancear las áreas de expertise
3. **Validación Previa:** Se evitan expertos no calificados que afecten la calidad del análisis
4. **Gestión Eficiente:** Para proyectos de 3-50 expertos, el registro manual es manejable

#### **📊 Flujo de Trabajo Actual:**
```
1. MODERADOR → Accede a /experts
2. MODERADOR → Crea nuevo experto con datos completos
3. SISTEMA → Valida y registra en base de expertos
4. MODERADOR → Al crear proyecto, selecciona de pool de expertos registrados
5. SISTEMA → Envía invitaciones a expertos seleccionados
6. EXPERTOS → Reciben invitación y se unen al proyecto específico
```

#### **🔄 Integración con Sistema de Proyectos:**
- **Paso 1:** Moderador registra expertos en `/experts` (una sola vez)
- **Paso 2:** Al crear/editar proyecto, selecciona expertos del pool registrado
- **Paso 3:** Sistema maneja invitaciones y participación por proyecto

---

## 🚀 **RECOMENDACIONES DE IMPLEMENTACIÓN**

### **📋 Para el MVP Actual:**
**Mantener solo Registro Administrativo (Opción A)**

**Razones:**
- ✅ Más simple de implementar y mantener
- ✅ Mayor control de calidad
- ✅ Adecuado para el tamaño típico de proyectos MIC MAC
- ✅ Evita complejidad de sistema de aprobación

### **📋 Para Versiones Futuras:**
**Implementar Auto-registro (Opción B) cuando:**
- El sistema tenga > 50 expertos activos
- Se requiera escalabilidad mayor
- Haya equipo dedicado para validar registros
- Se implementen sistemas de rating/reputación

---

## 📝 **DOCUMENTACIÓN EN LA INTERFAZ**

### **Agregar en `/experts`:**
```
💡 INFORMACIÓN: ¿Cómo funciona el registro de expertos?

Los expertos se registran de forma centralizada por moderadores para garantizar 
la calidad del panel de expertos MIC MAC. 

Proceso:
1. Los moderadores registran expertos verificados en este panel
2. Al crear proyectos, se seleccionan expertos del pool registrado
3. Los expertos reciben invitaciones específicas por proyecto
4. Participan solo en los proyectos para los que fueron invitados

Esto asegura que cada análisis MIC MAC tenga expertos verdaderamente 
calificados y relevantes para el tema específico.
```

### **Agregar en formulario de expertos:**
```
ℹ️ NOTA: Este experto quedará disponible para ser invitado a proyectos MIC MAC. 
Los moderadores pueden seleccionarlo para proyectos relevantes a sus áreas de expertise.
```

---

## 🎯 **FLUJO COMPLETO VALIDADO**

```
📊 SISTEMA ACTUAL (100% Implementado):

MODERADOR:
1. Va a /experts
2. Clic "Nuevo Experto" 
3. Completa formulario completo
4. Experto queda en pool del sistema

MODERADOR (al crear proyecto):
1. Va a /projects → "Nuevo Proyecto"
2. En pestaña "Expertos" selecciona del pool
3. Sistema envía invitaciones automáticas
4. Expertos confirman participación

EXPERTO:
1. Recibe invitación por email/app
2. Acepta participar en proyecto específico
3. Accede solo a ese proyecto para votar
4. Completa matriz de votación MIC MAC
```

**✅ Este flujo está 100% alineado con la metodología MIC MAC real y asegura la calidad del panel de expertos.**
