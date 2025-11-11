# 📱 Guía para Usar desde el Celular

## ✅ Configuración Actualizada

Acabo de configurar la app para que **use automáticamente la cámara trasera** en dispositivos móviles.

## 🚀 Cómo Acceder desde tu Celular

### Opción 1: Servidor Local en la Misma Red

1. **En tu PC, inicia el servidor:**
   ```bash
   python -m http.server 8000
   ```

2. **Encuentra la IP de tu PC:**
   - Windows: Abre CMD y escribe `ipconfig`
   - Busca "Dirección IPv4" (ejemplo: 192.168.1.100)

3. **En tu celular:**
   - Abre el navegador (Chrome, Safari, etc.)
   - Ve a: `http://192.168.1.100:8000`
   - Reemplaza `192.168.1.100` con tu IP real

### Opción 2: Subir a un Hosting Gratuito (Recomendado)

#### A) Netlify (Más Fácil)
1. Ve a https://app.netlify.com/drop
2. Arrastra toda tu carpeta del proyecto
3. Te dará una URL como: `https://tu-app.netlify.app`
4. Abre esa URL en tu celular

#### B) GitHub Pages
1. Sube los archivos a un repositorio de GitHub
2. Ve a Settings > Pages
3. Activa GitHub Pages
4. Accede desde tu celular

#### C) Vercel
1. Ve a https://vercel.com
2. Importa tu proyecto
3. Despliega
4. Accede desde tu celular

## 📸 Usar el Escáner en el Celular

1. **Abre la app en tu celular**
2. **Inicia sesión** (admin/admin)
3. **Ve a la sección Ventas**
4. **Haz clic en "Iniciar Escáner"**
5. **Permite el acceso a la cámara** cuando te lo pida
6. **La cámara trasera se activará automáticamente** 📱
7. **Apunta al código de barras**

## 💡 Consejos para Escanear en Móvil

### ✅ Hacer:
- Mantén el celular estable con ambas manos
- Distancia: 10-20 cm del código
- Buena iluminación
- Código horizontal y centrado
- Espera 1-2 segundos sin mover

### ❌ Evitar:
- Mover el celular rápidamente
- Muy cerca (se ve borroso)
- Muy lejos (no detecta)
- Poca luz
- Código inclinado

## 🔧 Si No Usa la Cámara Trasera

Si por alguna razón usa la cámara frontal:

1. **Abre la consola del navegador en el celular:**
   - Chrome Android: Ve a `chrome://inspect` en tu PC
   - Safari iOS: Conecta el iPhone a Mac y usa Safari > Develop

2. **Verifica los logs:**
   - Debe decir: "📱 Usando cámara trasera"
   - Si dice otra cosa, compárteme el mensaje

3. **Alternativa manual:**
   - Toma foto del código con la cámara normal
   - Lee el número del código
   - Ingrésalo manualmente en el campo de texto

## 📊 Ventajas de Usar el Celular

- ✅ Cámara de mejor calidad
- ✅ Más fácil de mover y apuntar
- ✅ Mejor para escanear productos en estantes
- ✅ Portabilidad

## 🌐 Acceso Remoto Seguro

Si quieres acceder desde cualquier lugar:

### Opción 1: Ngrok (Temporal)
```bash
# Instala ngrok
# Luego ejecuta:
ngrok http 8000
```
Te dará una URL pública temporal

### Opción 2: Hosting (Permanente)
Sube a Netlify, Vercel o GitHub Pages para tener una URL permanente

## 🔒 Importante

- HTTPS es requerido para usar la cámara
- Los hostings gratuitos (Netlify, Vercel) ya incluyen HTTPS
- Si usas IP local, algunos navegadores pueden bloquear la cámara

## 📱 Navegadores Recomendados

- ✅ Chrome (Android)
- ✅ Safari (iOS)
- ✅ Firefox (Android/iOS)
- ⚠️ Navegadores in-app pueden tener problemas

## 🆘 Solución de Problemas

### "No se puede acceder a la cámara"
- Verifica permisos en Configuración > Apps > [Navegador] > Permisos
- Asegúrate de usar HTTPS o localhost

### "Usa la cámara frontal en vez de la trasera"
- Algunos dispositivos no soportan selección automática
- Usa el ingreso manual como alternativa

### "La página no carga"
- Verifica que tu celular esté en la misma red WiFi que tu PC
- Verifica que el firewall no bloquee el puerto 8000

## 🎯 Prueba Rápida

1. Abre `test-simple.html` en tu celular
2. Haz clic en "Iniciar Escáner"
3. Verifica en el log que diga "📱 Usando cámara trasera"
4. Si funciona, la app principal también funcionará
