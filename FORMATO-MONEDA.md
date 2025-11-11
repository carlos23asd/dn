# 💰 Formato de Moneda - Pesos Colombianos (COP)

## ✅ Cambios Implementados

La aplicación ahora usa el formato de **pesos colombianos (COP)**:

### Formato Anterior (USD):
- $2.50
- $1,234.56

### Formato Nuevo (COP):
- $3.500
- $1.234.567

## 📊 Ejemplos de Precios

Los productos de ejemplo ahora tienen precios en COP:

| Producto | Precio Anterior | Precio Nuevo |
|----------|----------------|--------------|
| Coca Cola 500ml | $2.50 | $3.500 |
| Pan Blanco | $1.20 | $2.000 |
| Leche 1L | $3.80 | $5.500 |
| Arroz 1kg | $4.50 | $8.000 |
| Aceite 1L | $5.20 | $12.000 |

## 🔧 Función de Formateo

Se agregó la función `formatCurrency()` que:
- Usa el formato colombiano: `1.000.000` (punto para miles)
- Sin decimales (los pesos colombianos no usan centavos)
- Agrega el símbolo `$` automáticamente

```javascript
formatCurrency(3500)  // → "$3.500"
formatCurrency(1234567)  // → "$1.234.567"
```

## 📝 Lugares Actualizados

El formato se aplicó en:
- ✅ Carrito de compras (precios y subtotales)
- ✅ Total del carrito
- ✅ Lista de productos
- ✅ Reportes de ventas (hoy, ayer, mes)
- ✅ Historial de ventas
- ✅ Detalles de venta
- ✅ Mensaje de venta finalizada

## 🔄 Actualizar Productos Existentes

Si ya tienes productos con precios en dólares:

### Opción 1: Actualizar en Supabase
1. Ve a tu proyecto en Supabase
2. Abre el **Table Editor**
3. Selecciona la tabla `products`
4. Edita los precios manualmente

### Opción 2: Ejecutar SQL
```sql
-- Multiplicar precios por 1400 (tasa aproximada)
UPDATE products 
SET price = price * 1400;
```

### Opción 3: Eliminar y Recrear
```sql
-- Eliminar productos existentes
DELETE FROM products;

-- Insertar nuevos productos con precios en COP
INSERT INTO products (name, price, stock, barcode) VALUES
('Coca Cola 500ml', 3500, 50, '7501234567890'),
('Pan Blanco', 2000, 30, '7501234567891'),
('Leche 1L', 5500, 25, '7501234567892'),
('Arroz 1kg', 8000, 40, '7501234567893'),
('Aceite 1L', 12000, 20, '7501234567894');
```

## 💡 Agregar Nuevos Productos

Cuando agregues productos, usa precios sin decimales:
- ✅ Correcto: `3500` (tres mil quinientos pesos)
- ❌ Incorrecto: `3.50` (tres pesos con cincuenta)

## 🌍 Cambiar a Otra Moneda

Si necesitas cambiar a otra moneda, edita la función `formatCurrency` en `app.js`:

### Para Dólares (USD):
```javascript
function formatCurrency(amount) {
    return '$' + parseFloat(amount).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}
```

### Para Euros (EUR):
```javascript
function formatCurrency(amount) {
    return parseFloat(amount).toLocaleString('es-ES', {
        style: 'currency',
        currency: 'EUR'
    });
}
```

### Para Pesos Mexicanos (MXN):
```javascript
function formatCurrency(amount) {
    return '$' + parseFloat(amount).toLocaleString('es-MX', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}
```

## 📱 Visualización

El formato se verá así en la app:

### Carrito:
```
Producto          Precio    Cantidad  Subtotal
Coca Cola 500ml   $3.500    2         $7.000
Pan Blanco        $2.000    3         $6.000
                            Total:    $13.000
```

### Reportes:
```
Ventas de Hoy:    $125.000
Ventas de Ayer:   $98.500
Ventas del Mes:   $2.450.000
```

## ✨ Ventajas del Formato Colombiano

- ✅ Más familiar para usuarios colombianos
- ✅ Sin decimales (más simple)
- ✅ Formato estándar del país
- ✅ Fácil de leer números grandes

## 🔍 Verificar el Cambio

Para verificar que funciona:
1. Recarga la página (Ctrl+F5)
2. Ve a la sección de Productos
3. Los precios deben mostrarse como: $3.500, $2.000, etc.
4. Agrega productos al carrito
5. Verifica que los totales usen el mismo formato
