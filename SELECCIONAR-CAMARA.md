# 📷 Cómo Seleccionar la Cámara Correcta

## ✅ Mejoras Implementadas

Acabo de agregar:
1. **Detección automática mejorada** de cámara trasera
2. **Selector manual de cámara** si la detección falla
3. **Logs detallados** para ver qué cámara se está usando

## 🎯 Cómo Funciona Ahora

### Detección Automática (3 Estrategias):

1. **Busca por nombre**: "back", "rear", "trasera", "posterior", "environment"
2. **Si hay múltiples cámaras**: Usa la última (generalmente es la trasera)
3. **Fallback**: Usa la primera disponible

### Selector Manual:

Si tienes múltiples cámaras, verás un **selector desplegable** que te permite cambiar entre ellas.

## 📱 Usar desde el Celular

1. **Abre la app en tu celular**
2. **Inicia sesión** (admin/admin)
3. **Ve a Ventas**
4. **Haz clic en "Iniciar Escáner"**
5. **Abre la consola del navegador** (si puedes):
   - Chrome Android: Conecta el celular a la PC y usa `chrome://inspect`
   - Safari iOS: Conecta a Mac y usa Safari > Develop

6. **Verifica en la consola**:
   ```
   📷 Cámaras encontradas: 2
     0: Front Camera
     1: Back Camera
   ✅ Cámara seleccionada: Back Camera
   ```

7. **Si usa la cámara incorrecta**:
   - Verás un selector desplegable arriba del video
   - Selecciona "Back Camera" o "Cámara trasera"
   - La cámara cambiará automáticamente

## 🔍 Verificar Qué Cámara Está Usando

### Método 1: Visual
- Cámara frontal: Te ves a ti mismo
- Cámara trasera: Ves lo que está frente al celular

### Método 2: Consola (Recomendado)
Abre la consola y busca:
```
✅ Cámara seleccionada: [nombre]
```

## 🛠️ Si Sigue Usando la Cámara Frontal

### Opción 1: Usar el Selector Manual
1. Cuando inicies el escáner, busca el selector desplegable
2. Cambia a la otra cámara disponible
3. Prueba hasta encontrar la trasera

### Opción 2: Verificar Permisos
- Android: Configuración > Apps > [Navegador] > Permisos > Cámara
- iOS: Configuración > [Navegador] > Cámara

### Opción 3: Probar Otro Navegador
- Chrome (recomendado)
- Firefox
- Safari (iOS)

## 📊 Información de Debug

Cuando inicies el escáner, verás en la consola:

```
🚀 Iniciando escáner...
✅ ZXing inicializado con formatos: [...]
📷 Cámaras encontradas: 2
  0: Front Camera (0x123...)
  1: Back Camera (0x456...)
✅ Cámara seleccionada: Back Camera
🔍 Escaneando... Acerca el código de barras a la cámara
```

Si ves algo diferente, compártelo para ayudarte mejor.

## 💡 Consejos Adicionales

### Para Móviles:
- Mantén el celular horizontal
- Usa ambas manos para estabilidad
- Distancia: 10-20 cm del código
- Buena iluminación

### Si No Detecta:
- Verifica que el código esté completo en la imagen
- Acerca o aleja lentamente
- Prueba diferentes ángulos
- Asegúrate de que el código no esté dañado

## 🔄 Cambiar de Cámara Durante el Escaneo

Si ya iniciaste el escáner y quieres cambiar:
1. Usa el selector desplegable (si aparece)
2. O detén el escáner y vuelve a iniciarlo
3. La app recordará tu selección

## 📝 Alternativa: Ingreso Manual

Si el escáner no funciona bien:
1. Toma foto del código con la cámara normal
2. Lee el número manualmente
3. Escríbelo en el campo de texto
4. Haz clic en "Agregar"

## 🆘 Reportar Problema

Si sigue sin funcionar, comparte:
1. Modelo de celular
2. Navegador y versión
3. Mensajes de la consola (los que empiezan con 📷, ✅, ⚠️)
4. Captura de pantalla del selector de cámaras
