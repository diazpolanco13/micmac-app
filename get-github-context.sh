#!/bin/bash

# Load environment
source .env.github 2>/dev/null || true

echo "📊 CONTEXTO GITHUB PARA IA - $(date)"
echo "=================================="
echo ""

if [ -z "$GITHUB_TOKEN" ]; then
    echo "⚠️ GitHub token no configurado, usando datos básicos"
    echo ""
fi

echo "🔍 DATOS ACTUALES DEL PROYECTO:"
echo ""

# Get project issues
if [ ! -z "$GITHUB_TOKEN" ]; then
    echo "📋 ISSUES DEL PROYECTO:"
    curl -s -H "Authorization: token $GITHUB_TOKEN" \
      "https://api.github.com/repos/diazpolanco13/micmac-app/issues?state=all&per_page=20" | \
      grep -E '"number"|"title"|"state"|"created_at"|"updated_at"' | \
      sed 'N;N;N;N;s/\n/ /g' | head -10
    
    echo ""
    echo "🎯 ESTADO DEL PROYECTO GITHUB:"
    curl -s -X POST \
      -H "Authorization: bearer $GITHUB_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "query": "query { user(login: \"diazpolanco13\") { projectV2(number: 1) { title items(first: 10) { nodes { content { ... on Issue { number title state labels(first: 5) { nodes { name } } } } } } } } }"
      }' \
      https://api.github.com/graphql | grep -v "avatar_url"
    
    echo ""
else
    echo "📋 Issues conocidos (sin API):"
    echo "  #1: Vista de Gestión de Expertos - FASE-4C"
    echo "  #2: Formulario Crear/Editar Experto - FASE-4C" 
    echo "  #3: Sistema Etiquetas Dinámicas - FASE-4C"
    echo "  #4: Configuración Supabase - FASE-4B"
    echo "  #5: Migración MockData→Real - FASE-4B"
    echo ""
fi

echo "📝 ÚLTIMOS 5 COMMITS:"
git log --oneline -5 2>/dev/null || echo "No hay commits disponibles"

echo ""
echo "🔧 ARCHIVOS SIN AGREGAR A GIT (Trabajo en progreso):"
git status --porcelain 2>/dev/null || echo "No hay cambios sin commitear"

echo ""
echo "📊 ARCHIVOS MODIFICADOS RECIENTEMENTE (últimas 24h):"
find . -name "*.tsx" -o -name "*.ts" -o -name "*.md" -o -name "*.js" | grep -v node_modules | xargs ls -lt | head -8

echo ""
echo "🎯 INFORMACIÓN PARA LA IA:"
echo "========================="
echo "✅ Usa estos datos JUNTO con tu análisis inteligente"
echo "✅ Los archivos sin agregar muestran trabajo EN PROGRESO"
echo "✅ Eso te dice exactamente dónde se quedó la última sesión"
echo "✅ Mantén tu redacción y análisis superior"
echo ""
echo "📋 COMANDO COMPLETO PARA LA IA:"
echo '---'
echo 'Lee el contexto de GitHub que generé + lee ESTADO-ACTUAL.md (411 líneas'
echo 'con contexto completo) + revisa últimos commits + revisa si hay archivos'
echo 'que no se han agregado a git a fin de ver qué cambios están en desarrollo.'
echo 'Cuando entiendas todo, actualiza ESTADO-ACTUAL.md conservando TODA la'
echo 'información detallada existente y agregando tu análisis mejorado con los'
echo 'datos más recientes, para saber dónde quedamos en la última sesión.'
echo '---'
echo ""
echo "⚠️ IMPORTANTE: NO actualices GitHub Projects automáticamente"
echo "🎯 Solo actualiza ESTADO-ACTUAL.md con tu análisis superior"