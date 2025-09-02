#!/bin/bash

# Script para inicializar contexto de nueva conversación con IA
# Busca en Mem0 PRIORIZANDO información reciente vs relevancia semántica

echo "🧠 Inicializando contexto desde Mem0..."

# 1. PRIMERO: Obtener commits más recientes (prioridad crítica/alta)
echo "📊 Obteniendo estado ACTUAL del proyecto..."
curl -s -X POST http://localhost:8081/memory/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "último desarrollo commit debugging migración supabase",
    "user_id": "micmac_user",
    "limit": 5
  }' | python3 -c "
import json, sys
from datetime import datetime, timedelta
data = json.load(sys.stdin)
if data['status'] == 'success':
    print('🎯 ESTADO ACTUAL (Información Reciente):')
    # Filtrar por metadatos de fecha reciente y prioridad alta
    recent_results = []
    for result in data['results']['results']:
        metadata = result.get('metadata', {})
        priority = metadata.get('priority', 'low')
        result_type = metadata.get('type', '')
        
        # Priorizar: latest_commit, project_status_correction, development_phase
        if priority in ['critical', 'high'] or result_type in ['latest_commit', 'project_status_correction', 'development_phase']:
            recent_results.append(result)
    
    # Mostrar máximo 3 más relevantes por fecha/prioridad
    for result in recent_results[:3]:
        metadata = result.get('metadata', {})
        priority = metadata.get('priority', 'unknown')
        print(f'   • {result[\"memory\"]} (prioridad: {priority})')
"

echo ""
echo "🔧 Obteniendo información técnica ACTUAL..."
curl -s -X POST http://localhost:8081/memory/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "supabase arquitectura multi-organizacional funcionalidades stack",
    "user_id": "micmac_user",
    "limit": 4
  }' | python3 -c "
import json, sys
data = json.load(sys.stdin)
if data['status'] == 'success':
    print('⚙️ STACK TÉCNICO (Información Actual):')
    # Priorizar información técnica reciente y relevante
    tech_results = []
    for result in data['results']['results']:
        metadata = result.get('metadata', {})
        result_type = metadata.get('type', '')
        
        # Priorizar información técnica actual vs histórica
        if any(keyword in result['memory'].lower() for keyword in ['supabase', 'migración', 'multi-organizacional', 'debugging']):
            tech_results.append(result)
    
    # Mostrar información técnica más relevante y actual
    for result in (tech_results[:2] if tech_results else data['results']['results'][:2]):
        print(f'   • {result[\"memory\"]}')
"

echo ""
echo "📝 Obteniendo ÚLTIMO desarrollo y prioridades..."
curl -s -X POST http://localhost:8081/memory/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "prioridades inmediatas debugging errores funciones pendientes",
    "user_id": "micmac_user",
    "limit": 4
  }' | python3 -c "
import json, sys
data = json.load(sys.stdin)
if data['status'] == 'success':
    print('🚀 PRIORIDADES INMEDIATAS (Estado Real):')
    # Filtrar por información de prioridades y estado actual
    priority_results = []
    for result in data['results']['results']:
        metadata = result.get('metadata', {})
        result_type = metadata.get('type', '')
        
        # Priorizar información de prioridades inmediatas, debugging, errores
        if result_type in ['immediate_priorities', 'development_phase'] or any(keyword in result['memory'].lower() for keyword in ['debugging', 'errores', 'pendientes', 'prioridades']):
            priority_results.append(result)
    
    # Mostrar las prioridades más actuales
    for result in (priority_results[:2] if priority_results else data['results']['results'][:2]):
        print(f'   • {result[\"memory\"]}')
"

echo ""
echo "✅ Contexto ACTUALIZADO cargado desde Mem0 (información reciente priorizada)"
echo ""
echo "💡 CONTEXTO LISTO PARA IA (INFORMACIÓN ACTUAL):"
echo "   - Estado REAL del proyecto (debugging activo vs info histórica)"
echo "   - Stack técnico ACTUAL (Supabase, migración)"
echo "   - Prioridades INMEDIATAS (errores específicos, funciones pendientes)"
echo "   - Información filtrada por fecha/prioridad vs solo relevancia semántica"
