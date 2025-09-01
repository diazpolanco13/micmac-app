#!/bin/bash

# 🚀 MIC MAC Pro - Nuevo Setup de Supabase
# Configura el nuevo proyecto Supabase desde cero

echo "🔧 Configurando nuevo proyecto Supabase: micmacpro..."

# Nuevas credenciales
SUPABASE_URL="https://lsnevmeibbkclblcsauu.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzbmV2bWVpYmJrY2xibGNzYXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NTcxMDQsImV4cCI6MjA3MjMzMzEwNH0.IkTPGY6c1dyGmWAa3Z7hQpJ5yEHN1l7O0OnrvFzAWYI"
DATABASE_PASSWORD="@piDevs_2317"

# Configurar variables de entorno
export NEXT_PUBLIC_SUPABASE_URL="$SUPABASE_URL"
export NEXT_PUBLIC_SUPABASE_ANON_KEY="$SUPABASE_ANON_KEY"
export DATABASE_URL="postgresql://postgres:$DATABASE_PASSWORD@db.lsnevmeibbkclblcsauu.supabase.co:5432/postgres"

echo "✅ Variables de entorno configuradas"

# Generar cliente Prisma
echo "🔨 Generando cliente Prisma..."
npx prisma generate

# Aplicar schema completo a la base de datos nueva
echo "📊 Aplicando schema multi-organizacional..."
npx prisma db push

echo "✅ ¡Base de datos configurada exitosamente!"
echo "🎯 Proyecto: micmacpro"
echo "🌍 URL: $SUPABASE_URL"
