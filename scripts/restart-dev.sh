#!/bin/bash

# 🔄 Script para reiniciar completamente el servidor de desarrollo
# Mata todos los procesos relacionados y reinicia limpio

echo "🔄 Reiniciando servidor de desarrollo..."

# 1. Matar procesos por puerto 3002
echo "🚫 Matando procesos en puerto 3002..."
lsof -ti:3002 | xargs -r kill -9
sleep 1

# 2. Matar procesos Next.js específicos
echo "🚫 Matando procesos Next.js..."
pkill -f "next dev" 2>/dev/null || true
pkill -f "npm run dev" 2>/dev/null || true
pkill -f "node.*next" 2>/dev/null || true
sleep 1

# 3. Matar cualquier proceso Node relacionado con el proyecto
echo "🚫 Limpiando procesos Node del proyecto..."
pkill -f "micmac-app" 2>/dev/null || true
sleep 1

# 4. Verificar que el puerto esté libre
echo "🔍 Verificando puerto 3002..."
if lsof -Pi :3002 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  Puerto 3002 aún ocupado, forzando limpieza..."
    lsof -ti:3002 | xargs -r kill -9
    sleep 2
fi

# 5. Limpiar cache de Next.js (opcional pero útil)
echo "🧹 Limpiando cache Next.js..."
rm -rf .next 2>/dev/null || true
rm -rf node_modules/.cache 2>/dev/null || true

# 6. Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encontró package.json. ¿Estás en el directorio del proyecto?"
    exit 1
fi

# 7. Reiniciar servidor
echo "🚀 Iniciando servidor de desarrollo..."
echo "📍 URL: http://localhost:3002"
echo "🔄 Presiona Ctrl+C para detener"
echo "-------------------------------------------"

# Usar npm run dev que ya tiene PORT=3002 configurado
npm run dev
