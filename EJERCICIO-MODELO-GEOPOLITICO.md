# 📋 EJERCICIO MODELO - ANÁLISIS GEOPOLÍTICO VENEZUELA

## 🎯 INFORMACIÓN GENERAL
- **Proyecto:** Análisis de Escenarios Geopolíticos
- **Tema:** Posibles escenarios de intervención militar de EE.UU. en Venezuela
- **Variables:** 5 escenarios
- **Expertos:** 8 (ya configurados en la app)

---

## 📊 VARIABLES DEL SISTEMA

### **ESC1 - INVASIÓN MILITAR**
Despliegue de una cabeza de playa por parte del cuerpo de infantería de marina de los EEUU en costas venezolanas, para derrocar al GB. "Esquema Panamá".

### **ESC2 - CUARENTENA NAVAL**
Bloqueo naval por parte de la armada de los EE.UU., a las costas venezolanas para generar asfixia económica y controlar el tráfico marítimo hacia Venezuela.

### **ESC3 - OPERACIÓN QUIRÚRGICA**
Acción mercenaria con el empleo de operadores de fuerzas especiales y el apoyo logístico del dispositivo naval desplegado por los EE.UU.

### **ESC4 - OPERACIÓN PSICOLÓGICA**
Uso de fake-news y guerra cognitiva para quebrar la moral de los funcionarios del aparato de seguridad del estado venezolano.

### **ESC5 - ATAQUE DE FALSA BANDERA**
Los buques de la Armada de EE.UU. simularían un ataque de fuerzas navales venezolanas, similar al "Incidente de Tonkín".

---

## 🎲 MATRIZ DE RESULTADOS ESPERADOS

```
      ESC1  ESC2  ESC3  ESC4  ESC5
ESC1:  -    1     3     1     3     = 8  (Influencia)
ESC2:  3    -     3     2     1     = 9  (Influencia)
ESC3:  2    3     -     1     3     = 9  (Influencia) 
ESC4:  3    1     3     -     3     = 10 (Influencia)
ESC5:  3    3     3     2     -     = 11 (Influencia)
      ---  ---   ---   ---   ---
Dep:   11   8    12    6    10
```

**NOTA:** Los valores mostrados arriba son los originales del ejercicio. Pero en nuestra app tendremos que generar una nueva matriz porque cada experto votará individualmente.

---

## 📈 RESULTADOS FINALES ESPERADOS

### **TOTALES CALCULADOS:**
- **Influencia (Y):** [8, 9, 9, 10, 11]
- **Dependencia (X):** [11, 8, 12, 6, 10]
- **Media Influencia:** 9.4
- **Media Dependencia:** 9.4

### **COORDENADAS:**
- **ESC1:** (11, 8) - Variable de Enlace 🟡
- **ESC2:** (8, 9) - Variable de Enlace 🟡  
- **ESC3:** (12, 9) - Variable de Enlace 🟡
- **ESC4:** (6, 10) - Variable Dependiente 🔵
- **ESC5:** (10, 11) - Variable de Enlace 🟡

---

## 🎯 CLASIFICACIÓN POR CUADRANTES

### 🟡 **VARIABLES DE ENLACE** (Alta Influencia + Alta Dependencia)
- **ESC1 - Invasión Militar**
- **ESC2 - Cuarentena Naval** 
- **ESC3 - Operación Quirúrgica**
- **ESC5 - Ataque Falsa Bandera**

### 🔵 **VARIABLES DEPENDIENTES** (Baja Influencia + Alta Dependencia)
- **ESC4 - Operación Psicológica**

### 🔴 **VARIABLES MOTRICES** (Alta Influencia + Baja Dependencia)
- *Ninguna en este ejercicio*

### 🟢 **VARIABLES AUTÓNOMAS** (Baja Influencia + Baja Dependencia)
- *Ninguna en este ejercicio*

---

## ⚙️ ESCALA DE VOTACIÓN
- **0** = Sin influencia
- **1** = Influencia débil  
- **2** = Influencia moderada
- **3** = Influencia fuerte

---

## 🧮 FÓRMULAS DE CÁLCULO

### **Influencia (Motricidad) - Eje Y:**
```javascript
// Suma de cada fila, excluyendo la diagonal
influencia[i] = suma(fila[i]) - matriz[i][i]
```

### **Dependencia - Eje X:**
```javascript  
// Suma de cada columna, excluyendo la diagonal
dependencia[j] = suma(columna[j]) - matriz[j][j]
```

### **Clasificación:**
```javascript
if (influencia >= mediaInf && dependencia >= mediaDep) return "Variable de Enlace"
if (influencia >= mediaInf && dependencia < mediaDep) return "Variable Motriz"  
if (influencia < mediaInf && dependencia >= mediaDep) return "Variable Dependiente"
return "Variable Autónoma"
```

---

## 🚀 PLAN DE IMPLEMENTACIÓN

### **FASE 1: Configurar el Proyecto**
- [ ] Crear proyecto "Análisis Geopolítico Venezuela"
- [ ] Agregar las 5 variables con descripciones completas
- [ ] Asignar los 8 expertos existentes

### **FASE 2: Simular Votaciones**
- [ ] Ejecutar simulación de los 8 expertos
- [ ] Verificar que se generen 20 comparaciones (5×4)
- [ ] Revisar que los votos sean coherentes con el tema

### **FASE 3: Validar Resultados**  
- [ ] Calcular matriz de influencias
- [ ] Verificar totales de influencia y dependencia
- [ ] Confirmar clasificación por cuadrantes
- [ ] Comparar con resultados esperados

---

## 📝 NOTAS IMPORTANTES

1. **Este ejercicio real nos permitirá validar todo el flujo**
2. **Las descripciones largas probarán el manejo de texto**
3. **Los 8 expertos simularán un escenario realista**
4. **Los resultados deben ser coherentes con el análisis geopolítico**
5. **Servirá como demo para mostrar el potencial de la aplicación**

---

*Este documento será la referencia durante todo el desarrollo de la Fase 5.*
