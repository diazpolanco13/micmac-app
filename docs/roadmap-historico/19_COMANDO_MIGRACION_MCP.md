# Comando de Migración para Claude Code

## Instrucciones para Claude Code

Ejecuta los siguientes pasos en orden:

### 1. Preparación
```bash
# Verificar que estamos en la raíz del proyecto
pwd

# Crear backup completo antes de empezar
cp -r . ../backup-proyecto-$(date +%Y%m%d)

# Instalar dependencias necesarias
npm init -y
npm install @modelcontextprotocol/sdk
```

### 2. Ejecutar Migración
```bash
# Guardar el script de migración como migrate-to-mcp.js
# (Ya deberías tener este archivo)

# Hacerlo ejecutable
chmod +x migrate-to-mcp.js

# Ejecutar la migración
node migrate-to-mcp.js .
```

### 3. Verificar Resultados
```bash
# Ver estructura generada
tree .claude -L 2

# Verificar contenido del meta-context
head -n 50 .claude/meta-context.md

# Verificar roadmap consolidado
head -n 30 docs/ROADMAP.md

# Ver reporte de migración
cat MIGRATION_REPORT.md
```

### 4. Instalar MCP Server
```bash
# Copiar el servidor MCP (proyecto-mcp-server.js)
# Ya deberías tenerlo del paso anterior

# Copiar configuración (mcp-config.json)
# Ya deberías tenerlo

# Probar que funciona
node proyecto-mcp-server.js
```

### 5. Limpiar Archivos Viejos (OPCIONAL)
```bash
# SOLO después de verificar que todo funciona
# Mover MDs viejos al archivo
mkdir -p .claude/archive/old-mds
find . -name "*.md" -path "*/sesion*" -exec mv {} .claude/archive/old-mds/ \;
find . -name "*.md" -path "*/session*" -exec mv {} .claude/archive/old-mds/ \;
```

## Verificación Final

Después de la migración, deberías tener:

```
tu-proyecto/
├── .claude/
│   ├── meta-context.md         (< 1KB, ~500 tokens)
│   ├── session-log.jsonl       (histórico compacto)
│   ├── checkpoints/            (snapshots)
│   └── archive/                (backups)
├── docs/
│   ├── ROADMAP.md              (consolidado)
│   └── daily/                  (futuros reportes)
├── proyecto-mcp-server.js      (servidor MCP)
├── mcp-config.json             (config para Cursor)
└── MIGRATION_REPORT.md         (reporte de migración)
```

## Reducción Esperada

- **Antes**: 30,000-45,000 tokens por sesión
- **Después**: 2,000-3,000 tokens por sesión
- **Mejora**: 93% menos tokens

## Primera Prueba en Cursor

Abre Cursor y escribe:
```
Hola Claude, ejecuta iniciar_sesion con objetivo: "Verificar migración exitosa y continuar desarrollo"
```

Si Claude carga el contexto en menos de 30 segundos, ¡la migración fue exitosa!