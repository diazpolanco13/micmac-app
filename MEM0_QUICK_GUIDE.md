# 🧠 MEM0 - GUÍA RÁPIDA PARA IA

## ✅ **ESTADO: SISTEMA COMPLETO FUNCIONANDO**

### 🎯 **LO ESENCIAL:**
- **Mem0 API**: `http://localhost:8081` (funcionando)
- **Contexto completo**: Roadmap + commits + decisiones guardados
- **Scripts listos**: Automatización para commits y contexto
- **Ahorro**: 96% tokens vs leer documentos largos

---

## 🚀 **COMANDOS CLAVE PARA IA:**

### **1. INICIALIZAR CONTEXTO (nueva sesión):**
```bash
cd /root/micmac-app/scripts && ./context-init.sh
```
→ Obtiene contexto completo proyecto en 150 tokens vs 3500+

### **2. LEER ÚLTIMOS COMMITS:**
```bash
cd /root/micmac-app/scripts && ./sync-commits-mem0.sh
```
→ **OBLIGATORIO después de inicializar** - sincroniza últimos commits con Mem0

### **3. BUSCAR INFORMACIÓN ESPECÍFICA:**
```bash
curl -X POST http://localhost:8081/memory/search \
  -H "Content-Type: application/json" \
  -d '{"query": "tu búsqueda", "user_id": "micmac_user", "limit": 3}'
```

### **4. GUARDAR DECISIONES IMPORTANTES:**
```bash
curl -X POST http://localhost:8081/memory/add \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "pregunta"}, {"role": "assistant", "content": "respuesta"}], "user_id": "micmac_user"}'
```

---

## 📋 **QUÉ CONTIENE MEM0:**
- ✅ **Roadmap completo** (Fases 0-20)
- ✅ **Historial commits** recientes
- ✅ **Decisiones técnicas** importantes
- ✅ **Estado actual** del proyecto
- ✅ **Problemas conocidos** y soluciones

---

## 🎯 **FLUJO OBLIGATORIO PARA IA:**

### **Al iniciar conversación:**
1. **SIEMPRE ejecutar**: `./context-init.sh` 
2. **INMEDIATAMENTE después**: `./sync-commits-mem0.sh`
3. Revisar ambos resultados para contexto completo
4. Proceder con conocimiento actualizado

### **Durante desarrollo:**
1. Buscar contexto relevante antes de responder
2. **DESPUÉS de cada avance importante**: Sugerir al usuario actualizar Mem0
3. **DESPUÉS de cada commit**: Sugerir ejecutar `./sync-commits-mem0.sh`
4. Guardar decisiones importantes automáticamente

### **RECORDAR AL USUARIO:**
- **Crear commit** después de cambios importantes
- **Actualizar Mem0** después de cada commit:
  ```bash
  git add . && git commit -m "mensaje descriptivo"
  cd scripts && ./sync-commits-mem0.sh
  ```

---

## 💡 **RESULTADO:**
**Contexto completo instantáneo** sin leer 700+ líneas de documentación cada vez.

**¡Sistema listo para desarrollo ultra-eficiente!** 🚀
