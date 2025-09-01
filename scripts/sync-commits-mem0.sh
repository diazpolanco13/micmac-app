#!/bin/bash

# Script para sincronizar historial de commits con Mem0
# Captura los últimos commits y los guarda en memoria persistente

echo "🔄 Sincronizando commits recientes con Mem0..."

# Obtener últimos 5 commits con información detallada
COMMITS=$(git log --oneline -5 --pretty=format:"%h|%s|%an|%ar")

# Procesar cada commit
while IFS='|' read -r hash message author date; do
    if [ ! -z "$hash" ]; then
        echo "📝 Procesando commit: $hash - $message"
        
        # Guardar en Mem0
        curl -s -X POST http://localhost:8081/memory/add \
          -H "Content-Type: application/json" \
          -d "{
            \"messages\": [
              {\"role\": \"user\", \"content\": \"¿Cuál fue el último cambio importante en el desarrollo?\"},
              {\"role\": \"assistant\", \"content\": \"Commit $hash: $message. Autor: $author. Hace: $date. Este commit representa progreso en el desarrollo del proyecto MIC MAC Pro.\"}
            ],
            \"user_id\": \"micmac_user\",
            \"metadata\": {
              \"type\": \"commit_history\",
              \"module\": \"development\",
              \"git_hash\": \"$hash\",
              \"author\": \"$author\",
              \"date\": \"$date\",
              \"priority\": \"high\"
            }
          }" > /dev/null
    fi
done <<< "$COMMITS"

echo "✅ Sincronización de commits completada"

# Crear resumen del progreso reciente
RECENT_PROGRESS=$(git log --oneline -3 --pretty=format:"- %s (%ar)")

curl -s -X POST http://localhost:8081/memory/add \
  -H "Content-Type: application/json" \
  -d "{
    \"messages\": [
      {\"role\": \"user\", \"content\": \"¿Cuál ha sido el progreso reciente del proyecto?\"},
      {\"role\": \"assistant\", \"content\": \"Progreso reciente en MIC MAC Pro:\\n$RECENT_PROGRESS\\n\\nEste es el desarrollo más actual del proyecto, útil para contextualización rápida.\"}
    ],
    \"user_id\": \"micmac_user\",
    \"metadata\": {
      \"type\": \"recent_progress\",
      \"module\": \"summary\",
      \"priority\": \"critical\",
      \"date\": \"$(date -Iseconds)\"
    }
  }" > /dev/null

echo "🎯 Resumen de progreso reciente guardado en Mem0"
