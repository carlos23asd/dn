# 🔧 Solución al Error de ZXing

## Pasos para Solucionar

### 1. Verifica que estés usando un servidor local

**NO abras el archivo directamente** (`file://`). Usa uno de estos métodos:

```bash
# Python
python -m http.server 8000

# Node.js
npx http-server -p 8000

# PHP
php -S localhost:8000
```

Luego abre: `http://localhost:8000`

### 2. Prueba el escáner simple primero

Abre `test-scanner.html` en tu navegador (con servidor local).

- Si ves "✅ ZXing cargado correctamente" → La librería funciona
- Si ves "❌ ZXing NO cargado" → Hay un problema de conexión

### 3. Verifica la consola del navegador

1. Presiona **F12** para abrir las herramientas de desarrollo
2. Ve a la pestaña **Console**
3. Recarga la página (**Ctrl+F5** o **Cmd+Shift+R**)
4. Busca estos mensajes:
   - `=== VERIFICACIÓN DE LIBRERÍAS ===`
   - `ZXing disponible: true` o `false`

### 4. Si ZXing no se carga

**Posibles causas:**

#### A) Problema de conexión a internet
- Verifica tu conexión
- Intenta abrir: https://unpkg.com/@zxing/library@0.20.0
- Si no carga, tu firewall o antivirus puede estar bloqueando

#### B) Bloqueador de anuncios o extensiones
- Desactiva temporalmente AdBlock, uBlock, etc.
- Algunas extensiones bloquean CDNs

#### C) Caché del navegador
- Presiona **Ctrl+Shift+Delete** (Chrome/Edge)
- Limpia caché e imágenes
- Recarga con **Ctrl+F5**

### 5. Solución Alternativa: Descargar ZXing localmente

Si las CDNs no funcionan, descarga la librería:

1. Ve a: https://unpkg.com/@zxing/library@0.20.0/umd/index.min.js
2. Guarda el archivo como `zxing.min.js` en tu carpeta del proyecto
3. Edita `index.html` y cambia:
   ```html
   <script src="https://unpkg.com/@zxing/library@0.20.0"></script>
   ```
   Por:
   ```html
   <script src="zxing.min.js"></script>
   ```

## 🧪 Comandos de Diagnóstico

Abre la consola (F12) y ejecuta estos comandos:

```javascript
// Verificar ZXing
console.log(typeof ZXing);
// Debe mostrar: "object"

// Ver métodos disponibles
console.log(ZXing);

// Probar crear el lector
try {
    const reader = new ZXing.BrowserMultiFormatReader();
    console.log('✅ Lector creado:', reader);
} catch(e) {
    console.error('❌ Error:', e);
}
```

## 📞 Si Nada Funciona

Comparte estos datos:

1. Sistema operativo y navegador (ej: Windows 11, Chrome 120)
2. ¿Estás usando servidor local? ¿Cuál?
3. Mensajes de la consola (F12 > Console)
4. ¿El test-scanner.html funciona?
5. ¿Puedes abrir https://unpkg.com/@zxing/library@0.20.0 en tu navegador?
