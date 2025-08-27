# 🚀 MIC MAC Pro - MVP Acelerado

## Descripción del Proyecto
MIC MAC Pro es una plataforma web colaborativa para análisis prospectivos con metodología MIC MAC. **MVP enfocado en funcionalidad core**: autenticación, CRUD de proyectos, selección simple de expertos, votación matricial con cronómetro por variable, y visualización de resultados. Diseño mobile-first optimizado para votación en dispositivos móviles, con testing unitario completo y documentación en español.
## Problema que Resuelve (MVP)
Los análisis MIC MAC tradicionales sufren de:
- ❌ Procesos manuales en Excel propensos a errores
- ❌ Votación no optimizada para móviles
- ❌ Cálculos manuales de motricidad/dependencia
- ❌ Falta de cronómetros para estructurar votación

## Propuesta de Valor MVP
- ✅ **Moderadores**: Crear proyectos MIC MAC digitales con cronómetro
- ✅ **Expertos**: Votar desde móvil con timer por variable
- ✅ **Organizaciones**: Resultados automáticos con gráficos interactivos
- ✅ **Desarrolladores**: Código con testing y docs en español

## Stack Tecnológico MVP
```
🎨 Frontend: Next.js 14 + TypeScript + Tailwind (mobile-first)
🔧 Backend: Next.js API Routes + Prisma ORM
💾 Database: Supabase (PostgreSQL + Auth + Realtime)
📊 Charts: Recharts para visualizaciones
🧪 Testing: Jest + Testing Library (coverage >80%)
🚀 Deploy: Vercel (integración nativa Next.js/Supabase)
📚 Docs: Markdown en español (README, manuales, APIs)
📋 Tracking: Linear App con timestamps automáticos
```

## Funcionalidades MVP
### ✅ Incluidas en MVP
- 🔐 **Autenticación**: Supabase Auth (Moderador/Experto)
- 📊 **CRUD Proyectos**: Wizard 3 pasos mobile-friendly
- 🔢 **Variables**: CRUD con validación (3-10 variables)
- 👥 **Expertos**: Lista simple con selección múltiple
- 🗳️ **Votación**: Matriz NxN con cronómetro por variable (60s)
- 📈 **Resultados**: Cálculo MIC MAC + gráfico cuadrantes
- 📱 **Mobile**: Touch-friendly, responsive design
- 🧪 **Testing**: Unitario completo + E2E
- 📚 **Docs**: Completa en español

### ❌ Excluidas del MVP (v2.0)
- 🤖 Selección "inteligente" de expertos con IA
- 🔄 Realtime avanzado con sincronización global
- 💬 Chat en vivo durante votación
- 📊 Análisis avanzado de consenso
- 📄 Exportación PDF/Excel profesional
- 🎯 Múltiples modos de votación

## Criterios de Éxito MVP
1. ✅ **Demo funcional**: Proyecto completo de inicio a fin
2. ✅ **Mobile UX**: Votación fluida en dispositivos móviles
3. ✅ **Calidad**: Testing >80% coverage + docs completas
4. ✅ **Deploy**: URL pública accesible
5. ✅ **Tracking**: Linear con registro metodológico completo