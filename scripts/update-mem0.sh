#!/bin/bash

# Script inteligente MEJORADO para actualizar Mem0 con commits
# Uso: ./scripts/update-mem0.sh "mensaje del commit"
# Captura contexto completo para el "yo del futuro" de la IA

COMMIT_MSG="$1"
DATE=$(date -Iseconds)

if [ -z "$COMMIT_MSG" ]; then
    echo "❌ Error: Proporciona un mensaje de commit"
    echo "Uso: ./scripts/update-mem0.sh 'mensaje del commit'"
    exit 1
fi

echo "🧠 Actualizando Mem0 con información COMPLETA del commit..."

# Extraer información del commit
GIT_HASH=$(git rev-parse --short HEAD)
GIT_BRANCH=$(git branch --show-current)
AUTHOR=$(git config user.name)

# DETECCIÓN AVANZADA de tipo de cambio (incluyendo emojis y contexto)
TYPE="feature"
PRIORITY="high"
CONTEXT="development"

# Debugging y correcciones (PRIORIDAD CRÍTICA)
if [[ $COMMIT_MSG =~ [Dd]ebug|[Ee]rror|🐛|🔧|[Ff]ix|[Bb]ug|[Cc]orrec ]]; then
    TYPE="bugfix"
    PRIORITY="critical"
    CONTEXT="debugging"
# Migración y cambios críticos
elif [[ $COMMIT_MSG =~ [Mm]igra|[Ss]upabase|[Dd]atabase|[Ss]chema|🚀 ]]; then
    TYPE="migration"
    PRIORITY="critical"
    CONTEXT="migration"
# Nuevas funcionalidades
elif [[ $COMMIT_MSG =~ [Ff]eat|[Ii]mplement|[Aa]dd|✅|🎯 ]]; then
    TYPE="feature"
    PRIORITY="high"
    CONTEXT="development"
# Refactoring y mejoras
elif [[ $COMMIT_MSG =~ [Rr]efactor|[Mm]ejor|[Oo]ptimiz|♻️ ]]; then
    TYPE="improvement"
    PRIORITY="medium"
    CONTEXT="optimization"
# Documentación
elif [[ $COMMIT_MSG =~ [Dd]oc|[Rr]eadme|[Gg]uía|📝 ]]; then
    TYPE="documentation"
    PRIORITY="low"
    CONTEXT="documentation"
fi

# Obtener archivos modificados (información clave para contexto)
MODIFIED_FILES=$(git diff --name-only HEAD~1 HEAD | head -5 | tr '\n' ', ' | sed 's/,$//')
FILE_COUNT=$(git diff --name-only HEAD~1 HEAD | wc -l)

# Detectar estado del proyecto basado en archivos modificados
PROJECT_STATE="normal_development"
if [[ $MODIFIED_FILES =~ Context|Auth|Supabase ]]; then
    PROJECT_STATE="migration_active"
elif [[ $MODIFIED_FILES =~ test|spec ]]; then
    PROJECT_STATE="testing_phase"
elif [[ $MODIFIED_FILES =~ package\.json|dependencies ]]; then
    PROJECT_STATE="dependency_update"
fi

# Actualizar Mem0 con INFORMACIÓN COMPLETA del commit
curl -s -X POST http://localhost:8081/memory/add \
  -H "Content-Type: application/json" \
  -d "{
    \"messages\": [
      {\"role\": \"user\", \"content\": \"¿Qué fue lo último que desarrollamos en MIC MAC Pro? ¿En qué estado está el proyecto?\"},
      {\"role\": \"assistant\", \"content\": \"ÚLTIMO DESARROLLO ($GIT_HASH): $COMMIT_MSG\\n\\n📊 CONTEXTO COMPLETO:\\n• Tipo: $TYPE (prioridad: $PRIORITY)\\n• Estado del proyecto: $PROJECT_STATE\\n• Archivos modificados: $MODIFIED_FILES ($FILE_COUNT archivos)\\n• Rama: $GIT_BRANCH | Autor: $AUTHOR\\n• Fecha: $DATE\\n\\n🎯 PARA EL FUTURO: Este commit representa $CONTEXT en el proyecto MIC MAC Pro. El estado actual es $PROJECT_STATE.\"}
    ],
    \"user_id\": \"micmac_user\",
    \"metadata\": {
      \"type\": \"latest_commit\",
      \"module\": \"development\",
      \"commit_type\": \"$TYPE\",
      \"project_state\": \"$PROJECT_STATE\",
      \"context\": \"$CONTEXT\",
      \"modified_files\": \"$MODIFIED_FILES\",
      \"file_count\": $FILE_COUNT,
      \"git_hash\": \"$GIT_HASH\",
      \"branch\": \"$GIT_BRANCH\",
      \"author\": \"$AUTHOR\",
      \"date\": \"$DATE\",
      \"priority\": \"$PRIORITY\"
    }
  }" > /dev/null

# Sincronizar historial reciente automáticamente
echo "🔄 Sincronizando historial reciente..."
./scripts/sync-commits-mem0.sh > /dev/null

echo "✅ Mem0 actualizado con CONTEXTO COMPLETO:"
echo "   📝 Commit: $COMMIT_MSG"
echo "   🏷️  Tipo: $TYPE (prioridad: $PRIORITY)"
echo "   📊 Estado proyecto: $PROJECT_STATE"
echo "   📁 Archivos: $FILE_COUNT modificados"
echo "   🔄 Historial reciente sincronizado"
echo "   🎯 CONTEXTO RICO listo para 'yo del futuro'"
