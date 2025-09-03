#!/usr/bin/env node

import { MemoryClient } from 'mem0ai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración Mem0
const memory = new MemoryClient({
  api_key: process.env.MEM0_API_KEY
});

const USER_ID = "micmac-dev-team";
const PROJECT_CONTEXT = "MIC MAC Pro - Sistema de Gestión de Colaboración Inteligente";

async function createSessionBriefing() {
  try {
    console.log('🧠 Creando briefing completo para próxima sesión...');
    
    // Leer el estado actual del proyecto
    const commitStatusPath = path.join(__dirname, '..', 'COMMIT_STATUS.md');
    const commitStatus = fs.existsSync(commitStatusPath) ? 
      fs.readFileSync(commitStatusPath, 'utf8') : 'Estado no disponible';
    
    // Información crítica para la próxima sesión
    const briefingData = [
      {
        content: `ESTADO CRÍTICO FASE 2 - REGRESIONES FUNCIONALES URGENTES:

ERROR BLOQUEANTE: JavaScript "Cannot read properties of null (reading 'dataset')" en 5.js:12 y 6.js:12 está IMPIDIENDO toda funcionalidad de escritura/actualización.

FUNCIONALIDAD ROTA (era funcional antes):
- Actualización de perfil: botón "Guardando..." infinito
- Edición áreas expertise: no guardan cambios  
- Eliminación áreas expertise: no funciona

CAUSA RAÍZ PROBABLE: Cambios de debugging introdujeron error DOM/event handler que rompe flujo JavaScript.

SOLUCIÓN TEMPORAL APLICADA: RLS deshabilitado en profiles, user_expertise, expertise_areas.

PRIORIDAD MÁXIMA: Identificar y eliminar error dataset antes que cualquier otra tarea.`,
        metadata: { type: "critical_status", phase: "2", priority: "URGENT" }
      },
      
      {
        content: `MCP SUPABASE - HERRAMIENTA CRÍTICA PARA DEBUGGING:

El MCP (Model Context Protocol) de Supabase ha sido FUNDAMENTAL para:
- Ejecutar SQL directo: mcp_supabase_execute_sql
- Verificar esquemas: list_tables, verificar columnas
- Debugging auth: verificar auth.uid(), sesiones
- Gestión RLS: habilitar/deshabilitar políticas
- Monitoreo: get_logs para errores en tiempo real

CONSEJO: Usar MCP como primera herramienta para cualquier problema de BD. Es más rápido y confiable que scripts mjs.

COMANDOS MCP MÁS ÚTILES:
- execute_sql: Para queries directas y verificaciones
- list_tables: Para verificar estructura
- get_logs: Para debugging de errores
- apply_migration: Para cambios de esquema`,
        metadata: { type: "tool_guidance", tool: "supabase_mcp", importance: "high" }
      },
      
      {
        content: `DIAGNÓSTICO TÉCNICO DETALLADO - auth.uid() PROBLEMA:

SÍNTOMA: auth.uid() retorna NULL en consultas SQL aunque usuario esté logueado en frontend.
CAUSA: Desincronización entre sesión frontend y contexto SQL de Supabase.
IMPACTO: RLS policies fallan, bloquean UPDATE/DELETE.

DEBUGGING REALIZADO:
- Verificado: políticas RLS correctas (auth.uid() = id)
- Verificado: sesiones frontend activas
- Problema: auth.uid() = null en contexto SQL

SOLUCIÓN PENDIENTE: 
1. Verificar función auth.uid() en Supabase (puede estar desactualizada)
2. Revisar configuración de JWT/session tokens
3. Posible refresh de sesión programático

WORKAROUND ACTUAL: RLS deshabilitado temporalmente.`,
        metadata: { type: "technical_diagnosis", issue: "auth_uid_null", status: "pending" }
      },
      
      {
        content: `ARQUITECTURA EXITOSA IMPLEMENTADA - NO TOCAR:

HÍBRIDA MOCK/SUPABASE funcionando perfectamente:
- AuthContext.tsx: Selector automático Mock vs Supabase
- Variables control: USE_SUPABASE_AUTH, MIGRATION_PHASE
- SupabaseAuthContext.tsx: Manejo completo auth + profiles
- MockAuthContext.tsx: Fallback funcional

EXPERTISE SYSTEM completamente funcional:
- ExpertiseCalculator.ts: Lógica de scoring robusta
- ExpertiseAreaModal.tsx: UI completa con cálculos dinámicos  
- ExpertiseAreasSection.tsx: OPTIMIZADO con useMemo (no tocar)
- ExpertiseRadarChart.tsx: Visualización sincronizada

ESTA ARQUITECTURA FUNCIONA - Solo necesita arreglar error dataset.`,
        metadata: { type: "architecture_success", phase: "2", status: "stable" }
      },
      
      {
        content: `ESTRATEGIA RECOVERY PARA PRÓXIMA SESIÓN:

PASO 1 (CRÍTICO): Identificar error dataset
- Revisar event handlers recientes en profile/page.tsx
- Buscar manipulación DOM incorrecta
- Posible rollback selectivo de cambios debugging

PASO 2: Restaurar funcionalidad básica
- Test: actualización perfil debe funcionar
- Test: edición expertise areas debe funcionar
- Verificar logs SupabaseAuthContext aparecen

PASO 3: Solución definitiva auth.uid()
- Usar MCP execute_sql para verificar auth functions
- Implementar refresh sesión si necesario
- Re-habilitar RLS con testing completo

PASO 4: Validación completa
- Todos los usuarios demo deben poder editar perfil
- Todas las operaciones CRUD expertise areas
- Preparar para FASE 3

NO HACER: Cambios arquitectónicos, nuevas features, optimizaciones hasta resolver regresiones.`,
        metadata: { type: "recovery_strategy", priority: "critical", next_session: true }
      }
    ];
    
    // Guardar cada elemento en Mem0
    for (const item of briefingData) {
      const result = await memory.add(item.content, {
        user_id: USER_ID,
        metadata: {
          project: PROJECT_CONTEXT,
          session_date: new Date().toISOString().split('T')[0],
          ...item.metadata
        }
      });
      
      console.log(`✅ Guardado en Mem0: ${item.metadata.type}`);
    }
    
    // Crear resumen ejecutivo final
    const executiveSummary = `BRIEFING EJECUTIVO SESIÓN COMPLETADA:

✅ LOGROS FASE 2: Autenticación Supabase funcional, perfiles cargando, expertise system completo con optimizaciones.

🚨 REGRESIÓN CRÍTICA: Error JavaScript "dataset null" introducido durante debugging está BLOQUEANDO toda funcionalidad de escritura. 

🎯 PRÓXIMA SESIÓN: PRIORIDAD ABSOLUTA arreglar error dataset. NO hacer nuevas features hasta restaurar funcionalidad básica.

🛠️ HERRAMIENTAS CLAVE: MCP Supabase esencial para debugging BD. RLS temporalmente deshabilitado.

📁 DOCUMENTACIÓN: COMMIT_STATUS.md tiene detalles completos. Commit d549c27 marca estado actual.`;

    await memory.add(executiveSummary, {
      user_id: USER_ID,
      metadata: {
        project: PROJECT_CONTEXT,
        type: "executive_summary",
        session_date: new Date().toISOString().split('T')[0],
        priority: "CRITICAL",
        next_session: true
      }
    });
    
    console.log('✅ Briefing ejecutivo guardado');
    console.log('🎯 Contexto completo actualizado en Mem0 para próxima sesión');
    
  } catch (error) {
    console.error('❌ Error creando briefing:', error);
    process.exit(1);
  }
}

createSessionBriefing();
