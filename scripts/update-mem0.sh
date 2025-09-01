#!/bin/bash

# Script inteligente para actualizar Mem0 con commits
# Uso: ./scripts/update-mem0.sh "mensaje del commit"
# También sincroniza automáticamente el historial reciente

COMMIT_MSG="$1"
DATE=$(date -Iseconds)

if [ -z "$COMMIT_MSG" ]; then
    echo "❌ Error: Proporciona un mensaje de commit"
    echo "Uso: ./scripts/update-mem0.sh 'mensaje del commit'"
    exit 1
fi

echo "🧠 Actualizando Mem0 con información del commit..."

# Extraer información del commit
GIT_HASH=$(git rev-parse --short HEAD)
GIT_BRANCH=$(git branch --show-current)
AUTHOR=$(git config user.name)

# Detectar tipo de cambio basado en el mensaje
TYPE="feature"
if [[ $COMMIT_MSG =~ [Ff]ix|[Bb]ug|[Cc]orrec ]]; then
    TYPE="bugfix"
elif [[ $COMMIT_MSG =~ [Rr]efactor|[Mm]ejor|[Oo]ptimiz ]]; then
    TYPE="improvement"
elif [[ $COMMIT_MSG =~ [Dd]oc|[Rr]eadme|[Gg]uía ]]; then
    TYPE="documentation"
fi

# Actualizar Mem0 con el commit actual
curl -s -X POST http://localhost:8081/memory/add \
  -H "Content-Type: application/json" \
  -d "{
    \"messages\": [
      {\"role\": \"user\", \"content\": \"¿Qué fue lo último que desarrollamos en MIC MAC Pro?\"},
      {\"role\": \"assistant\", \"content\": \"Último desarrollo ($GIT_HASH): $COMMIT_MSG. Tipo: $TYPE. Rama: $GIT_BRANCH. Autor: $AUTHOR. Fecha: $DATE. Este es el progreso más reciente del proyecto.\"}
    ],
    \"user_id\": \"micmac_user\",
    \"metadata\": {
      \"type\": \"latest_commit\",
      \"module\": \"development\",
      \"commit_type\": \"$TYPE\",
      \"git_hash\": \"$GIT_HASH\",
      \"branch\": \"$GIT_BRANCH\",
      \"author\": \"$AUTHOR\",
      \"date\": \"$DATE\",
      \"priority\": \"critical\"
    }
  }" > /dev/null

# Sincronizar historial reciente automáticamente
echo "🔄 Sincronizando historial reciente..."
./scripts/sync-commits-mem0.sh > /dev/null

echo "✅ Mem0 actualizado completamente:"
echo "   📝 Commit actual: $COMMIT_MSG"
echo "   🔄 Historial reciente sincronizado"
echo "   🎯 Contexto listo para próxima conversación"
