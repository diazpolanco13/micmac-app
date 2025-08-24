#!/bin/bash

echo "🔧 Reparando Linear MCP..."
echo ""

# 1. Detener cualquier servidor MCP antiguo
echo "1️⃣ Deteniendo servidores MCP antiguos..."
pkill -f "linear-server" 2>/dev/null || true
pkill -f "mcp.*linear" 2>/dev/null || true
echo "   ✅ Procesos antiguos detenidos"
echo ""

# 2. Verificar configuración actual
echo "2️⃣ Verificando configuración MCP..."
CONFIG_FILE="$HOME/.config/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json"

if [ -f "$CONFIG_FILE" ]; then
    echo "   ✅ Archivo de configuración encontrado"
    echo "   📍 Ubicación: $CONFIG_FILE"
    echo ""
    echo "   📋 Configuración actual:"
    cat "$CONFIG_FILE" | grep -A 4 "linear"
else
    echo "   ❌ No se encontró archivo de configuración"
    echo "   Creando configuración nueva..."
    mkdir -p "$(dirname "$CONFIG_FILE")"
    cat > "$CONFIG_FILE" << 'EOF'
{
  "mcpServers": {
    "linear": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.linear.app/sse"],
      "disabled": false,
      "autoApprove": []
    }
  }
}
EOF
    echo "   ✅ Configuración creada"
fi
echo ""

# 3. Limpiar caché de autenticación
echo "3️⃣ Limpiando caché de autenticación..."
rm -rf ~/.mcp-auth 2>/dev/null || true
echo "   ✅ Caché limpiado"
echo ""

# 4. Verificar API de Linear
echo "4️⃣ Verificando conexión con Linear API..."
if [ -f "/root/micmac-app/test-linear.js" ]; then
    node /root/micmac-app/test-linear.js 2>&1 | head -20
else
    echo "   ⚠️ Script de prueba no encontrado"
fi
echo ""

echo "✅ ¡Reparación completada!"
echo ""
echo "📝 PRÓXIMOS PASOS:"
echo "   1. Cierra VS Code completamente"
echo "   2. Abre VS Code de nuevo"
echo "   3. En la primera conexión se abrirá el navegador para OAuth"
echo "   4. Autoriza todos los permisos solicitados"
echo ""
echo "🧪 COMANDOS DE PRUEBA en Claude/Cline:"
echo '   • "Muéstrame mis issues de Linear del equipo API"'
echo '   • "Dame detalles del issue API-13"'
echo '   • "Actualiza el progreso del issue API-13 a 85%"'
echo ""
echo "💡 Si aún hay problemas, ejecuta:"
echo "   node /root/micmac-app/scripts/complete-linear-mcp-setup.js"