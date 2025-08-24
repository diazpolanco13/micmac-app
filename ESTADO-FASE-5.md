📋 CHECKLIST FASE 5: SISTEMA DE VOTACIÓN MIC MAC
🎯 OBJETIVO: Completar MVP con sistema de votación funcional
ETAPA 1: PREPARACIÓN Y ESTRUCTURA ⏱️ ~20 min - ✅ COMPLETADA
✅ 1.1 Análisis de Arquitectura - COMPLETADO
✅ Revisar tipos TypeScript existentes para votación
✅ Identificar componentes reutilizables
✅ Definir estructura de datos para matriz de votación
✅ Planificar integración con MockDataContext
✅ 1.2 Crear Tipos de Votación - COMPLETADO
✅ Definir tipos para Evaluation (votación individual)
✅ Definir tipos para VotingSession
✅ Expandir tipos de ProjectStatus (agregar VOTING)
✅ Actualizar interfaces en types/project.ts

ETAPA 2: PÁGINA DE VOTACIÓN BÁSICA ⏱️ ~45 min - ✅ COMPLETADA
✅ 2.1 Crear Ruta de Votación - COMPLETADO
✅ Crear src/app/projects/[id]/vote/page.tsx
✅ Configurar parámetros dinámicos de ruta
✅ Implementar protección de rutas (solo expertos asignados)
✅ Crear layout básico de votación
✅ 2.2 Componente Matriz Básica - COMPLETADO
✅ Crear src/components/voting/VotingMatrix.tsx
✅ Implementar grid NxN de variables
✅ Crear componente VotingCell.tsx para cada par
✅ Implementar escala 0-3 con botones/slider
ETAPA 3: LÓGICA DE VOTACIÓN ⏱️ ~40 min - ✅ COMPLETADA
✅ 3.1 Estado de Votación - COMPLETADO
✅ Implementar estado local para matriz completa
✅ Crear funciones para actualizar votos individuales
✅ Implementar validación de matriz completa
✅ Agregar indicador visual de progreso
✅ 3.2 Persistencia de Votos - COMPLETADO
✅ Expandir MockDataContext con métodos de votación
✅ Implementar saveVote(projectId, expertId, votes)
✅ Implementar getVotingProgress(projectId, expertId)
✅ Auto-save cada cambio de voto
ETAPA 4: CRONÓMETRO Y UX ⏱️ ~35 min - ✅ COMPLETADA
✅ 4.1 Componente Cronómetro - COMPLETADO
✅ Crear src/components/voting/VotingTimer.tsx (integrado en VotingMatrix)
✅ Implementar timer configurable por par de variables
✅ Agregar controles play/pause (eliminado skip por lógica de negocio)
✅ Mostrar progreso visual del tiempo con círculo animado
✅ 4.2 UX Mobile-Friendly - COMPLETADO
✅ Optimizar matriz para touch con botones grandes
✅ Diseño responsivo completo con breakpoints
✅ Vista compacta integrada (timer + votación en un panel)
✅ Responsive design completo con gradientes y animaciones

ETAPA 4.5: MEJORAS UX Y SIMULACIÓN - ✅ COMPLETADA
✅ 4.5.1 Pantalla de Completado Elegante - COMPLETADO
✅ Implementar modal de completado con estadísticas
✅ Diferenciación visual entre votación manual y simulación
✅ Animaciones y gradientes profesionales
✅ Redirección automática con temporizador
✅ 4.5.2 Sistema de Simulación de Expertos - COMPLETADO
✅ Expandir MockDataContext con simulateExpertVoting()
✅ Implementar simulateAllExperts() para 8 expertos
✅ Algoritmo inteligente basado en expertise y contenido
✅ Interfaz visual para ejecutar simulación
✅ 4.5.3 Datos de Prueba Realistas - COMPLETADO
✅ Actualizar mockData.ts con 8 expertos diversos
✅ Variables con texto largo y descripciones detalladas
✅ Proyecto geopolítico para testing realista
✅ Asignación completa de expertos a proyecto

ETAPA 5: CÁLCULOS MIC MAC ⏱️ ~30 min
✅ 5.1 Motor de Cálculo
[ ] Crear src/utils/micmacCalculations.ts
[ ] Implementar cálculo de motricidad (suma filas)
[ ] Implementar cálculo de dependencia (suma columnas)
[ ] Implementar clasificación en cuadrantes
✅ 5.2 Integración con Datos
[ ] Agregar métodos de cálculo a MockDataContext
[ ] Implementar calculateMicMacResults(projectId)
[ ] Cachear resultados calculados
[ ] Actualizar automáticamente con nuevos votos
ETAPA 6: VISUALIZACIÓN DE RESULTADOS ⏱️ ~40 min
✅ 6.1 Página de Resultados
[ ] Crear src/app/projects/[id]/results/page.tsx
[ ] Mostrar tabla de variables con motricidad/dependencia
[ ] Implementar ordenamiento por diferentes criterios
[ ] Agregar estadísticas básicas
✅ 6.2 Gráfico de Dispersión
[ ] Instalar librería de gráficos (Recharts)
[ ] Crear componente MicMacChart.tsx
[ ] Implementar gráfico X=Dependencia, Y=Motricidad
[ ] Agregar cuadrantes con etiquetas
ETAPA 7: ESTADOS DE PROYECTO ⏱️ ~20 min
✅ 7.1 Flujo de Estados Avanzado
[ ] Actualizar estados: SETUP → VOTING → ANALYZING → COMPLETED
[ ] Implementar validaciones para cambio de estado
[ ] Agregar botones de control para moderadores
[ ] Mostrar progreso de votación por experto
✅ 7.2 Dashboard de Progreso
[ ] Agregar métricas de votación al dashboard
[ ] Mostrar % de completitud por proyecto
[ ] Listar expertos pendientes de votar
[ ] Notificaciones de estado
ETAPA 8: TESTING Y REFINAMIENTO ⏱️ ~30 min
✅ 8.1 Testing Funcional
[ ] Probar flujo completo: crear proyecto → asignar expertos → votar → ver resultados
[ ] Verificar cálculos MIC MAC con datos conocidos
[ ] Probar en móvil y desktop
[ ] Validar persistencia de datos
✅ 8.2 Pulimiento Final
[ ] Mejorar mensajes de error y validaciones
[ ] Agregar loading states
[ ] Optimizar performance de cálculos
[ ] Documentar componentes nuevos
ETAPA 9: DOCUMENTACIÓN Y COMMIT ⏱️ ~15 min
✅ 9.1 Actualizar Documentación
[ ] Actualizar ESTADO-ACTUAL.md con Fase 5 completada
[ ] Documentar nuevos componentes
[ ] Actualizar roadmap con MVP completado
✅ 9.2 Commit Final
[ ] Commit con mensaje: "🎯 FASE 5 COMPLETADA - Sistema de Votación MIC MAC + MVP 100%"
[ ] Verificar build exitoso
[ ] Probar demo completa
⏱️ ESTIMACIÓN TOTAL: ~4.5 horas
Con 100k tokens: Perfectamente factible completar 70-80% del checklist
🚀 ESTRATEGIA DE EJECUCIÓN:
Empezar con Etapa 1 (tipos y estructura)
Avanzar secuencialmente documentando cada paso
Hacer commits parciales cada 2-3 etapas completadas
Priorizar funcionalidad core si se agotan tokens
¿Empezamos con la Etapa 1.1: Análisis de Arquitectura? ¡Vamos a completar tu MVP! 🎯