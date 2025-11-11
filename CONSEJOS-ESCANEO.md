# 📸 Consejos para Escanear Códigos de Barras

## ✅ Mejoras Implementadas

Acabo de mejorar el escáner con:
- ✅ Soporte para múltiples formatos (EAN-13, EAN-8, CODE-128, etc.)
- ✅ Modo "TRY_HARDER" para mejor detección
- ✅ Mayor resolución de cámara (1280x720)
- ✅ Feedback visual (borde verde cuando detecta)
- ✅ Prevención de escaneos duplicados
- ✅ Mensajes en consola para debugging

## 🎯 Cómo Escanear Correctamente

### 1. Iluminación
- ✅ Usa buena luz (natural o artificial)
- ❌ Evita sombras sobre el código
- ❌ Evita reflejos brillantes

### 2. Distancia
- 📏 Mantén el código a **15-30 cm** de la cámara
- Si está muy cerca → Se ve borroso
- Si está muy lejos → No se detecta

### 3. Posición
- ➡️ Mantén el código **horizontal**
- 📐 Código perpendicular a la cámara (no inclinado)
- 🎯 Centra el código en la pantalla

### 4. Movimiento
- ⏸️ Mantén el código **quieto** 1-2 segundos
- 🐌 Muévelo lentamente si no detecta
- ❌ No lo muevas rápido

### 5. Calidad del Código
- ✅ Código limpio y sin daños
- ✅ Barras bien definidas
- ❌ Códigos arrugados o manchados pueden fallar

## 🧪 Prueba con Estos Códigos

Los productos de ejemplo tienen estos códigos:
```
7501234567890 - Coca Cola 500ml
7501234567891 - Pan Blanco
7501234567892 - Leche 1L
7501234567893 - Arroz 1kg
7501234567894 - Aceite 1L
```

### Cómo Probar:
1. Busca en Google Images: "codigo de barras 7501234567890"
2. Muestra la imagen en tu teléfono
3. Escanea desde la pantalla del teléfono

O genera códigos en: https://barcode.tec-it.com/es

## 🔍 Verificar que Funciona

Abre la consola (F12) y deberías ver:
```
✅ ZXing inicializado con formatos: [...]
📷 Cámaras encontradas: 1
🎥 Usando cámara: [nombre]
🔍 Escaneando... Acerca el código de barras a la cámara
✅ Código detectado: 7501234567890
```

## 🐛 Si No Detecta

### Opción 1: Ingreso Manual
Simplemente escribe el código en el campo de texto y haz clic en "Agregar"

### Opción 2: Ajustar Cámara
- Limpia el lente de la cámara
- Prueba con otra cámara si tienes
- Ajusta el enfoque (acerca/aleja el código)

### Opción 3: Probar con Otro Código
- Algunos códigos muy pequeños son difíciles
- Prueba con un código más grande
- Imprime un código de prueba

## 📱 En Dispositivos Móviles

Si usas un teléfono o tablet:
- La app intentará usar la cámara trasera automáticamente
- Mantén el dispositivo estable
- Usa ambas manos si es necesario

## 💡 Truco Profesional

Para mejor detección:
1. Coloca el código sobre una superficie plana
2. Mantén la cámara paralela al código
3. Asegúrate de que todo el código esté visible
4. Espera 1-2 segundos sin mover

## 🎨 Feedback Visual

Cuando el escáner detecta un código:
- El borde del video se pone **verde** por medio segundo
- Verás el mensaje en consola
- El producto se agrega automáticamente

## ⚡ Velocidad de Escaneo

El escáner intenta detectar códigos **varias veces por segundo**.
Si no detecta en 5 segundos:
- Ajusta la distancia
- Mejora la iluminación
- Verifica que el código esté completo en la imagen
