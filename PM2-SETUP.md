# 🚀 GUÍA DE IMPLEMENTACIÓN PM2 - MIC MAC PRO

## 📋 CONFIGURACIÓN DE PUERTOS
- **Puerto 3000:** 🔍 Sistema de monitoreo
- **Puerto 3001:** 🚀 Producción PM2 (micmac-pro-production)
- **Puerto 3002:** 🛠️ Desarrollo local (npm run dev)

---

## 🔧 INSTALACIÓN PASO A PASO

### 1. Instalar PM2 globalmente
```bash
npm install -g pm2
```

### 2. Crear directorio de logs
```bash
mkdir -p /root/micmac-app/logs
```

### 3. Iniciar aplicación en producción
```bash
# Opción A: Usar script npm (RECOMENDADO)
npm run pm2:start

# Opción B: Manual
npm run build
pm2 start ecosystem.config.json
```

### 4. Configurar auto-inicio en boot del servidor
```bash
# Generar script de startup
pm2 startup

# Ejecutar el comando que te muestre PM2 (ejemplo):
# sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u root --hp /root

# Guardar configuración actual
pm2 save
```

---

## 📊 COMANDOS DE GESTIÓN

### Comandos NPM (Recomendados)
```bash
# Ver estado
npm run pm2:status

# Ver logs en tiempo real
npm run pm2:logs

# Reiniciar aplicación
npm run pm2:restart

# Parar aplicación
npm run pm2:stop
```

### Comandos PM2 Directos
```bash
# Estado general
pm2 status

# Logs específicos
pm2 logs micmac-pro-production

# Reiniciar
pm2 restart micmac-pro-production

# Parar
pm2 stop micmac-pro-production

# Eliminar proceso
pm2 delete micmac-pro-production

# Monitoreo en tiempo real
pm2 monit
```

---

## 🌐 CONFIGURACIÓN DE DOMINIO

### Con Nginx (Recomendado)
Crear archivo `/etc/nginx/sites-available/micmac-pro`:

```nginx
server {
    listen 80;
    server_name tu-dominio.com www.tu-dominio.com;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Activar configuración:**
```bash
sudo ln -s /etc/nginx/sites-available/micmac-pro /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Con Apache
Crear VirtualHost en `/etc/apache2/sites-available/micmac-pro.conf`:

```apache
<VirtualHost *:80>
    ServerName tu-dominio.com
    ServerAlias www.tu-dominio.com
    
    ProxyRequests Off
    ProxyPreserveHost On
    
    ProxyPass / http://localhost:3001/
    ProxyPassReverse / http://localhost:3001/
    
    ErrorLog ${APACHE_LOG_DIR}/micmac-pro_error.log
    CustomLog ${APACHE_LOG_DIR}/micmac-pro_access.log combined
</VirtualHost>
```

**Activar módulos y sitio:**
```bash
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2ensite micmac-pro.conf
sudo systemctl restart apache2
```

---

## 🔒 CONFIGURACIÓN HTTPS CON CERTBOT

```bash
# Instalar Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Obtener certificado SSL
sudo certbot --nginx -d tu-dominio.com -d www.tu-dominio.com

# Renovación automática (opcional)
sudo crontab -e
# Agregar línea:
# 0 12 * * * /usr/bin/certbot renew --quiet
```

---

## 📈 MONITOREO Y LOGS

### Ver logs en tiempo real
```bash
# Todos los logs
pm2 logs

# Solo aplicación específica
pm2 logs micmac-pro-production

# Logs con filtro
pm2 logs micmac-pro-production --lines 100
```

### Monitoreo de recursos
```bash
# Dashboard interactivo
pm2 monit

# Estado detallado
pm2 show micmac-pro-production
```

### Archivos de log
- **Combined:** `/root/micmac-app/logs/micmac-combined.log`
- **Output:** `/root/micmac-app/logs/micmac-out.log`
- **Errors:** `/root/micmac-app/logs/micmac-error.log`

---

## 🚨 RESOLUCIÓN DE PROBLEMAS

### Si el puerto está ocupado
```bash
# Ver qué proceso usa el puerto 3001
sudo lsof -i :3001

# Matar proceso específico
sudo kill -9 [PID]

# Reiniciar PM2
npm run pm2:restart
```

### Si PM2 no encuentra la aplicación
```bash
# Verificar procesos PM2
pm2 list

# Si está vacío, reiniciar
npm run pm2:start
```

### Si hay problemas de memoria
```bash
# Ver uso de memoria
pm2 show micmac-pro-production

# Reiniciar si es necesario
pm2 restart micmac-pro-production
```

---

## ✅ VERIFICACIÓN FINAL

1. **Aplicación corriendo:** `pm2 status` debe mostrar `micmac-pro-production` en estado `online`
2. **Puerto disponible:** `curl http://localhost:3001` debe responder
3. **Auto-restart:** `pm2 save` ejecutado correctamente
4. **Logs funcionando:** `pm2 logs` muestra actividad
5. **Desarrollo independiente:** `npm run dev` funciona en puerto 3002

---

## 🎯 FLUJO DE TRABAJO RECOMENDADO

### Para desarrollo:
```bash
npm run dev
# Trabaja en http://localhost:3002
```

### Para actualizar producción:
```bash
npm run pm2:restart
# Actualiza automáticamente http://localhost:3001
```

### Para monitorear:
```bash
npm run pm2:logs
npm run pm2:status
```
