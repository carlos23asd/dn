-- Script para actualizar precios a pesos colombianos (COP)
-- Ejecuta este script en el SQL Editor de Supabase

-- OPCIÓN 1: Solo actualizar los precios de productos existentes
-- (Mantiene el historial de ventas)
UPDATE products SET price = 3500 WHERE barcode = '7501234567890';
UPDATE products SET price = 2000 WHERE barcode = '7501234567891';
UPDATE products SET price = 5500 WHERE barcode = '7501234567892';
UPDATE products SET price = 8000 WHERE barcode = '7501234567893';
UPDATE products SET price = 12000 WHERE barcode = '7501234567894';

-- OPCIÓN 2: Limpiar TODO y empezar de cero
-- ⚠️ ADVERTENCIA: Esto eliminará TODAS las ventas y productos
-- Descomenta las siguientes líneas solo si quieres borrar todo:

/*
-- Eliminar items de venta primero (por la foreign key)
DELETE FROM sale_items;

-- Eliminar ventas
DELETE FROM sales;

-- Eliminar productos
DELETE FROM products;

-- Insertar productos nuevos con precios en COP
INSERT INTO products (name, price, stock, barcode) VALUES
('Coca Cola 500ml', 3500, 50, '7501234567890'),
('Pan Blanco', 2000, 30, '7501234567891'),
('Leche 1L', 5500, 25, '7501234567892'),
('Arroz 1kg', 8000, 40, '7501234567893'),
('Aceite 1L', 12000, 20, '7501234567894');
*/

-- OPCIÓN 3: Multiplicar precios actuales por tasa de cambio
-- (Útil si tienes muchos productos)
-- Descomenta si quieres convertir de USD a COP (tasa ~4000)

/*
UPDATE products 
SET price = ROUND(price * 4000);
*/
