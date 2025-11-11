# Sistema de Cajero Web con Supabase

Sistema completo de punto de venta conectado a Supabase con gestión de inventario y reportes en tiempo real.

## 🚀 Características

- ✅ Inicio de sesión con base de datos
- ✅ Escaneo de códigos de barras mediante cámara web (lineales y EAN-8)
- ✅ Gestión de productos con código de barras
- ✅ Carrito de compras con tabla de productos
- ✅ Control de stock automático en tiempo real
- ✅ Reportes de ventas (hoy, ayer, mes completo)
- ✅ Historial de ventas con detalles
- ✅ Búsqueda y filtrado de productos
- ✅ Persistencia de datos en Supabase

## 📋 Requisitos Previos

1. Cuenta en [Supabase](https://supabase.com) (gratis)
2. Navegador web moderno con soporte para cámara

## ⚙️ Configuración

### 1. Configurar Supabase

1. Crea una cuenta en [Supabase](https://supabase.com)
2. Crea un nuevo proyecto
3. Ve a **SQL Editor** y ejecuta el script `supabase-setup.sql`
4. Ve a **Settings > API** y copia:
   - Project URL
   - anon/public key

### 2. Configurar la Aplicación

1. Abre el archivo `config.js`
2. Reemplaza los valores:
   ```javascript
   const SUPABASE_CONFIG = {
       url: 'https://tu-proyecto.supabase.co',
       anonKey: 'tu-clave-publica-aqui'
   };
   ```

### 3. Ejecutar la Aplicación

1. Abre `index.html` en tu navegador
2. Inicia sesión con:
   - **Usuario:** `admin`
   - **Contraseña:** `admin`

## 📱 Uso de la Aplicación

### Sección Ventas
- Haz clic en "Iniciar Escáner" para usar la cámara
- Escanea productos o ingresa el código manualmente
- Ajusta cantidades en el carrito
- Finaliza la venta (actualiza stock automáticamente)

### Sección Productos
- Agrega nuevos productos
- Usa "Escanear Código" para capturar códigos de barras
- Edita productos existentes
- Agrega stock con el botón "+ Stock"
- Elimina productos

### Sección Reportes
- Visualiza ganancias del día, ayer y del mes
- Revisa el historial de ventas
- Haz clic en "Ver" para detalles de cada venta

## 🗄️ Estructura de la Base de Datos

### Tablas

- **users**: Usuarios del sistema
- **products**: Catálogo de productos
- **sales**: Registro de ventas
- **sale_items**: Detalles de cada venta

## 🔒 Seguridad

- Las políticas RLS están configuradas para permitir acceso completo
- En producción, debes implementar autenticación real de Supabase
- Considera usar Supabase Auth para mayor seguridad

## 🛠️ Tecnologías

- HTML5
- CSS3
- JavaScript (Vanilla)
- [Supabase](https://supabase.com) - Backend y base de datos
- [ZXing](https://github.com/zxing-js/library) - Escaneo de códigos de barras

## 📝 Notas

- Los datos se almacenan en Supabase (persistencia real)
- Se incluyen 5 productos de ejemplo en el script SQL
- Compatible con códigos de barras lineales y EAN-8
- Requiere permisos de cámara para escanear códigos
- Funciona en tiempo real con múltiples usuarios

## 🐛 Solución de Problemas

### Error de conexión a Supabase
- Verifica que las credenciales en `config.js` sean correctas
- Asegúrate de haber ejecutado el script SQL
- Revisa la consola del navegador para más detalles

### La cámara no funciona
- Permite permisos de cámara en el navegador
- Usa HTTPS o localhost (requerido por navegadores modernos)
- Verifica que tu dispositivo tenga cámara

### Productos no se agregan
- Verifica que el código de barras exista en la base de datos
- Asegúrate de que haya stock disponible
- Revisa la consola para errores

## 📄 Licencia

Este proyecto es de código abierto y está disponible para uso personal y comercial.
