#!/bin/bash

# Script para inicializar contexto de nueva conversación con IA
# Busca en Mem0 en lugar de leer roadmap completo

echo "🧠 Inicializando contexto desde Mem0..."

# Búsquedas específicas para contextualización completa
echo "📊 Obteniendo estado del proyecto..."
curl -s -X POST http://localhost:8081/memory/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "estado actual proyecto micmac próximas tareas prioridades",
    "user_id": "micmac_user",
    "limit": 3
  }' | python3 -c "
import json, sys
data = json.load(sys.stdin)
if data['status'] == 'success':
    print('🎯 ESTADO ACTUAL:')
    for result in data['results']['results']:
        print(f'   • {result[\"memory\"]} (relevancia: {result[\"score\"]:.2f})')
"

echo ""
echo "🔧 Obteniendo información técnica..."
curl -s -X POST http://localhost:8081/memory/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "tecnologías stack arquitectura funcionalidades",
    "user_id": "micmac_user",
    "limit": 2
  }' | python3 -c "
import json, sys
data = json.load(sys.stdin)
if data['status'] == 'success':
    print('⚙️ STACK TÉCNICO:')
    for result in data['results']['results']:
        print(f'   • {result[\"memory\"]}')
"

echo ""
echo "📝 Obteniendo último desarrollo..."
curl -s -X POST http://localhost:8081/memory/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "último desarrollo commit reciente progreso",
    "user_id": "micmac_user",
    "limit": 2
  }' | python3 -c "
import json, sys
data = json.load(sys.stdin)
if data['status'] == 'success':
    print('🚀 ÚLTIMO DESARROLLO:')
    for result in data['results']['results']:
        print(f'   • {result[\"memory\"]}')
"

echo ""
echo "✅ Contexto cargado desde Mem0 (ahorro de ~2500 tokens vs roadmap completo)"
echo ""
echo "💡 CONTEXTO LISTO PARA IA:"
echo "   - Estado actual del proyecto"
echo "   - Stack técnico y funcionalidades"
echo "   - Último desarrollo realizado"
echo "   - Próximas prioridades"
