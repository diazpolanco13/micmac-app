#!/bin/bash

# Script MEJORADO para sincronizar historial de commits con Mem0
# Captura contexto completo para el "yo del futuro" de la IA

echo "🔄 Sincronizando commits recientes con CONTEXTO COMPLETO..."

# Obtener últimos 5 commits con información detallada
COMMITS=$(git log --oneline -5 --pretty=format:"%h|%s|%an|%ar|%aI")

# Procesar cada commit con análisis inteligente
while IFS='|' read -r hash message author date iso_date; do
    if [ ! -z "$hash" ]; then
        echo "📝 Analizando commit: $hash - $message"
        
        # ANÁLISIS INTELIGENTE del commit (igual lógica que update-mem0.sh)
        TYPE="feature"
        PRIORITY="medium"
        CONTEXT="development"
        
        # Debugging y correcciones (PRIORIDAD CRÍTICA)
        if [[ $message =~ [Dd]ebug|[Ee]rror|🐛|🔧|[Ff]ix|[Bb]ug|[Cc]orrec ]]; then
            TYPE="bugfix"
            PRIORITY="critical"
            CONTEXT="debugging"
        # Migración y cambios críticos
        elif [[ $message =~ [Mm]igra|[Ss]upabase|[Dd]atabase|[Ss]chema|🚀 ]]; then
            TYPE="migration"
            PRIORITY="critical"
            CONTEXT="migration"
        # Nuevas funcionalidades
        elif [[ $message =~ [Ff]eat|[Ii]mplement|[Aa]dd|✅|🎯 ]]; then
            TYPE="feature"
            PRIORITY="high"
            CONTEXT="development"
        # Refactoring y mejoras
        elif [[ $message =~ [Rr]efactor|[Mm]ejor|[Oo]ptimiz|♻️ ]]; then
            TYPE="improvement"
            PRIORITY="medium"
            CONTEXT="optimization"
        # Documentación
        elif [[ $message =~ [Dd]oc|[Rr]eadme|[Gg]uía|📝 ]]; then
            TYPE="documentation"
            PRIORITY="low"
            CONTEXT="documentation"
        fi
        
        # Obtener archivos modificados para este commit específico
        MODIFIED_FILES=$(git diff --name-only $hash~1 $hash 2>/dev/null | head -3 | tr '\n' ', ' | sed 's/,$//' || echo "N/A")
        FILE_COUNT=$(git diff --name-only $hash~1 $hash 2>/dev/null | wc -l || echo "0")
        
        # Guardar en Mem0 con CONTEXTO RICO
        curl -s -X POST http://localhost:8081/memory/add \
          -H "Content-Type: application/json" \
          -d "{
            \"messages\": [
              {\"role\": \"user\", \"content\": \"¿Qué cambios importantes hubo en el desarrollo reciente?\"},
              {\"role\": \"assistant\", \"content\": \"COMMIT HISTÓRICO ($hash): $message\\n\\n📊 ANÁLISIS:\\n• Tipo: $TYPE (prioridad: $PRIORITY)\\n• Contexto: $CONTEXT\\n• Archivos: $MODIFIED_FILES ($FILE_COUNT archivos)\\n• Autor: $author | Hace: $date\\n\\n🎯 RELEVANCIA: Este commit es parte del historial de $CONTEXT en MIC MAC Pro.\"}
            ],
            \"user_id\": \"micmac_user\",
            \"metadata\": {
              \"type\": \"commit_history\",
              \"module\": \"development\",
              \"commit_type\": \"$TYPE\",
              \"context\": \"$CONTEXT\",
              \"modified_files\": \"$MODIFIED_FILES\",
              \"file_count\": $FILE_COUNT,
              \"git_hash\": \"$hash\",
              \"author\": \"$author\",
              \"relative_date\": \"$date\",
              \"iso_date\": \"$iso_date\",
              \"priority\": \"$PRIORITY\"
            }
          }" > /dev/null
    fi
done <<< "$COMMITS"

echo "✅ Sincronización de commits completada con análisis inteligente"

# Crear RESUMEN INTELIGENTE del progreso reciente
RECENT_PROGRESS=$(git log --oneline -3 --pretty=format:"- %s (%ar)")

# Detectar tendencias en los últimos commits
DEBUGGING_COMMITS=$(git log --oneline -5 --grep="[Dd]ebug\|[Ff]ix\|[Ee]rror\|🐛\|🔧" | wc -l)
MIGRATION_COMMITS=$(git log --oneline -5 --grep="[Mm]igra\|[Ss]upabase\|[Dd]atabase\|🚀" | wc -l)
FEATURE_COMMITS=$(git log --oneline -5 --grep="[Ff]eat\|[Ii]mplement\|[Aa]dd\|✅" | wc -l)

# Determinar estado del proyecto basado en tendencias
PROJECT_TREND="normal_development"
if [ $DEBUGGING_COMMITS -ge 2 ]; then
    PROJECT_TREND="debugging_intensive"
elif [ $MIGRATION_COMMITS -ge 2 ]; then
    PROJECT_TREND="migration_active"
elif [ $FEATURE_COMMITS -ge 3 ]; then
    PROJECT_TREND="feature_development"
fi

curl -s -X POST http://localhost:8081/memory/add \
  -H "Content-Type: application/json" \
  -d "{
    \"messages\": [
      {\"role\": \"user\", \"content\": \"¿Cuál ha sido el progreso reciente y tendencias del proyecto?\"},
      {\"role\": \"assistant\", \"content\": \"📊 PROGRESO RECIENTE MIC MAC Pro:\\n$RECENT_PROGRESS\\n\\n🎯 ANÁLISIS DE TENDENCIAS:\\n• Commits debugging: $DEBUGGING_COMMITS\\n• Commits migración: $MIGRATION_COMMITS\\n• Commits features: $FEATURE_COMMITS\\n• Tendencia actual: $PROJECT_TREND\\n\\n💡 PARA EL FUTURO: El proyecto está en fase de $PROJECT_TREND. Esta información es crucial para entender el contexto actual.\"}
    ],
    \"user_id\": \"micmac_user\",
    \"metadata\": {
      \"type\": \"recent_progress\",
      \"module\": \"summary\",
      \"project_trend\": \"$PROJECT_TREND\",
      \"debugging_commits\": $DEBUGGING_COMMITS,
      \"migration_commits\": $MIGRATION_COMMITS,
      \"feature_commits\": $FEATURE_COMMITS,
      \"priority\": \"critical\",
      \"date\": \"$(date -Iseconds)\"
    }
  }" > /dev/null

echo "🎯 Resumen INTELIGENTE de progreso guardado en Mem0"
echo "   📈 Tendencia detectada: $PROJECT_TREND"
echo "   🔍 Debugging: $DEBUGGING_COMMITS | Migración: $MIGRATION_COMMITS | Features: $FEATURE_COMMITS"
