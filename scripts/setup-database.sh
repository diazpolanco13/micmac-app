#!/bin/bash

# 🚀 MIC MAC Pro - Database Setup Script
# Configura Prisma y ejecuta migraciones para Supabase

echo "🔧 Configurando base de datos Supabase con Prisma..."

# Verificar que las variables de entorno estén configuradas
if [ -z "$DATABASE_URL" ]; then
    echo "❌ ERROR: DATABASE_URL no está configurada"
    echo "Por favor, configura DATABASE_URL en .env.local"
    exit 1
fi

echo "✅ Variables de entorno verificadas"

# Generar cliente Prisma
echo "🔨 Generando cliente Prisma..."
npx prisma generate

# Aplicar cambios al schema (push to database)
echo "📊 Aplicando cambios al schema de la base de datos..."
npx prisma db push

# Verificar conexión
echo "🔍 Verificando conexión a la base de datos..."
npx prisma db execute --command "SELECT 1;"

echo "✅ Base de datos configurada exitosamente!"
echo "🎯 Puedes abrir Prisma Studio con: npm run prisma:studio"
