# 📷 Instrucciones para usar el Escáner de Códigos de Barras

## ⚠️ Requisitos Importantes

### 1. Permisos de Cámara
- El navegador te pedirá permiso para usar la cámara
- **Debes hacer clic en "Permitir"**
- Si bloqueaste el permiso por error:
  - Chrome: Haz clic en el icono de cámara 🎥 en la barra de direcciones
  - Firefox: Haz clic en el icono de candado 🔒 y ajusta permisos

### 2. Protocolo HTTPS o Localhost
Los navegadores modernos solo permiten acceso a la cámara en:
- ✅ `https://` (sitios seguros)
- ✅ `http://localhost` o `http://127.0.0.1`
- ❌ `file://` (abrir archivo directamente) - **NO FUNCIONA**

## 🚀 Cómo Ejecutar la Aplicación Correctamente

### Opción 1: Servidor Local Simple (Recomendado)

#### Con Python (si lo tienes instalado):
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

#### Con Node.js (si lo tienes instalado):
```bash
# Instalar http-server globalmente
npm install -g http-server

# Ejecutar
http-server -p 8000
```

#### Con PHP (si lo tienes instalado):
```bash
php -S localhost:8000
```

Luego abre: `http://localhost:8000`

### Opción 2: Extensión de VS Code
Si usas Visual Studio Code:
1. Instala la extensión "Live Server"
2. Haz clic derecho en `index.html`
3. Selecciona "Open with Live Server"

### Opción 3: Usar un Servicio Online
Sube los archivos a:
- GitHub Pages (gratis)
- Netlify (gratis)
- Vercel (gratis)

## 🔍 Cómo Usar el Escáner

### En la Sección de Ventas:
1. Haz clic en **"Iniciar Escáner"**
2. Permite el acceso a la cámara cuando te lo pida
3. Apunta la cámara al código de barras
4. Mantén el código centrado y enfocado
5. El producto se agregará automáticamente cuando lo detecte

### En la Sección de Productos:
1. Completa el formulario (nombre, precio, stock)
2. Haz clic en **"Escanear Código"**
3. Permite el acceso a la cámara
4. Escanea el código de barras del producto
5. El código se agregará automáticamente al campo
6. Haz clic en "Guardar Producto"

## 🐛 Solución de Problemas

### El botón no hace nada:
1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Console"
3. Busca mensajes de error en rojo
4. Comparte esos mensajes para ayudarte mejor

### "No se encontró ninguna cámara":
- Verifica que tu dispositivo tenga cámara
- Conecta una cámara USB si es una PC de escritorio
- Prueba con otro navegador

### "Debes permitir el acceso a la cámara":
- Haz clic en "Permitir" cuando el navegador lo pida
- Si ya lo bloqueaste, cambia los permisos en la configuración del navegador

### El escáner no detecta el código:
- Asegúrate de tener buena iluminación
- Mantén el código de barras centrado en la cámara
- Acerca o aleja el código hasta que esté enfocado
- Prueba con diferentes ángulos
- Algunos códigos muy pequeños o dañados pueden no funcionar

### Alternativa: Ingreso Manual
Si el escáner no funciona, siempre puedes:
- Escribir el código manualmente en el campo de texto
- Usar códigos de ejemplo: `7501234567890`, `7501234567891`, etc.

## 📱 Códigos de Barras de Prueba

Si no tienes códigos físicos, puedes:
1. Buscar en Google Images: "codigo de barras ean-13"
2. Mostrar la imagen en tu teléfono
3. Escanear desde la pantalla del teléfono con la cámara de la PC

O usar estos códigos de los productos de ejemplo:
- `7501234567890` - Coca Cola 500ml
- `7501234567891` - Pan Blanco
- `7501234567892` - Leche 1L
- `7501234567893` - Arroz 1kg
- `7501234567894` - Aceite 1L

## 💡 Consejos

- La primera vez que uses el escáner, el navegador pedirá permisos
- Mantén el código de barras horizontal
- Evita reflejos de luz en el código
- Si tienes múltiples cámaras, la app usará la primera disponible
- En móviles, intentará usar la cámara trasera automáticamente
