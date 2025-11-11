# 🔧 Solución al Error de Foreign Key en Supabase

## ❌ El Error

```
ERROR: 23503: update or delete on table "products" violates foreign key constraint 
"sale_items_product_id_fkey" on table "sale_items"
```

## 🤔 ¿Qué Significa?

Este error ocurre porque:
1. Ya tienes **ventas registradas** en la base de datos
2. Esas ventas hacen referencia a los productos
3. No puedes eliminar productos que tienen ventas asociadas

## ✅ Soluciones

### Opción 1: Solo Actualizar Precios (Recomendado)

**Ventaja:** Mantiene el historial de ventas

Ejecuta este SQL en Supabase:

```sql
-- Actualizar precios a pesos colombianos
UPDATE products SET price = 3500 WHERE barcode = '7501234567890';
UPDATE products SET price = 2000 WHERE barcode = '7501234567891';
UPDATE products SET price = 5500 WHERE barcode = '7501234567892';
UPDATE products SET price = 8000 WHERE barcode = '7501234567893';
UPDATE products SET price = 12000 WHERE barcode = '7501234567894';
```

### Opción 2: Limpiar Todo y Empezar de Cero

**⚠️ ADVERTENCIA:** Esto eliminará TODAS las ventas y productos

```sql
-- 1. Eliminar items de venta primero
DELETE FROM sale_items;

-- 2. Eliminar ventas
DELETE FROM sales;

-- 3. Eliminar productos
DELETE FROM products;

-- 4. Insertar productos nuevos
INSERT INTO products (name, price, stock, barcode) VALUES
('Coca Cola 500ml', 3500, 50, '7501234567890'),
('Pan Blanco', 2000, 30, '7501234567891'),
('Leche 1L', 5500, 25, '7501234567892'),
('Arroz 1kg', 8000, 40, '7501234567893'),
('Aceite 1L', 12000, 20, '7501234567894');
```

### Opción 3: Convertir Precios Automáticamente

Si tienes muchos productos y quieres convertir de USD a COP:

```sql
-- Multiplicar todos los precios por 4000 (tasa aproximada USD a COP)
UPDATE products 
SET price = ROUND(price * 4000);
```

## 📋 Pasos para Ejecutar

1. **Ve a Supabase:**
   - Abre https://supabase.com/dashboard
   - Selecciona tu proyecto

2. **Abre SQL Editor:**
   - Haz clic en "SQL Editor" en el menú lateral
   - Crea una nueva query

3. **Copia y pega** el SQL de la opción que prefieras

4. **Ejecuta:**
   - Haz clic en "Run" o presiona Ctrl+Enter

5. **Verifica:**
   - Ve a "Table Editor" > "products"
   - Verifica que los precios estén actualizados

## 🔍 Verificar en la App

Después de actualizar:
1. Recarga la aplicación (Ctrl+F5)
2. Ve a la sección "Productos"
3. Los precios deben mostrarse en formato colombiano: $3.500, $2.000, etc.

## 💡 Recomendación

**Usa la Opción 1** si:
- ✅ Quieres mantener el historial de ventas
- ✅ Solo necesitas actualizar los precios
- ✅ Estás en producción

**Usa la Opción 2** si:
- ✅ Estás en desarrollo/pruebas
- ✅ No te importa perder las ventas de prueba
- ✅ Quieres empezar limpio

**Usa la Opción 3** si:
- ✅ Tienes muchos productos
- ✅ Todos están en USD
- ✅ Quieres convertirlos automáticamente

## 🆘 Si Tienes Problemas

Si el error persiste:

1. **Verifica las tablas:**
   ```sql
   -- Ver cuántas ventas tienes
   SELECT COUNT(*) FROM sales;
   
   -- Ver cuántos items de venta
   SELECT COUNT(*) FROM sale_items;
   
   -- Ver productos
   SELECT * FROM products;
   ```

2. **Elimina ventas de prueba:**
   ```sql
   -- Solo si quieres eliminar ventas específicas
   DELETE FROM sale_items WHERE sale_id IN (
       SELECT id FROM sales WHERE created_at < '2025-01-01'
   );
   
   DELETE FROM sales WHERE created_at < '2025-01-01';
   ```

## 📝 Nota sobre Ventas Antiguas

Las ventas antiguas seguirán mostrando los precios viejos (en USD) porque se guardaron con esos valores. Esto es normal y correcto - es un registro histórico.

Solo las **nuevas ventas** usarán los precios actualizados en COP.

## 🔄 Archivo de Ayuda

He creado el archivo `actualizar-precios.sql` con todas las opciones listas para copiar y pegar.
