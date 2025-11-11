// Inicializar Supabase
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);

// Estado de la aplicación
let currentUser = null;
let products = [];
let cart = [];
let codeReader = null;
let productCodeReader = null;

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Verificar configuración
    if (SUPABASE_CONFIG.url === 'TU_SUPABASE_URL') {
        alert('⚠️ IMPORTANTE: Debes configurar tus credenciales de Supabase en config.js');
        return;
    }
    
    // Verificar que ZXing se haya cargado
    console.log('ZXing disponible:', typeof ZXing !== 'undefined');
    console.log('Supabase disponible:', typeof supabase !== 'undefined');
    
    if (typeof ZXing === 'undefined') {
        console.error('ZXing no se cargó correctamente');
        alert('Error: La librería del escáner no se cargó. Por favor recarga la página.');
    }
    
    // Login form
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // Product form
    document.getElementById('productForm').addEventListener('submit', handleProductSubmit);
});

// Utilidades
function showLoading() {
    document.getElementById('loadingOverlay').classList.add('active');
}

function hideLoading() {
    document.getElementById('loadingOverlay').classList.remove('active');
}

function showError(message) {
    alert('Error: ' + message);
}

// Formatear moneda a pesos colombianos (COP)
function formatCurrency(amount) {
    const number = parseFloat(amount);
    if (isNaN(number)) return '$0';
    
    // Formato colombiano: 1.000.000,00
    return '$' + number.toLocaleString('es-CO', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
}

// Login
async function handleLogin(e) {
    e.preventDefault();
    showLoading();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
        const { data, error } = await supabaseClient
            .from('users')
            .select('*')
            .eq('username', username)
            .eq('password', password)
            .single();
        
        if (error || !data) {
            document.getElementById('loginError').textContent = 'Usuario o contraseña incorrectos';
            hideLoading();
            return;
        }
        
        currentUser = data;
        document.getElementById('loginScreen').classList.remove('active');
        document.getElementById('mainScreen').classList.add('active');
        document.getElementById('userInfo').textContent = `Usuario: ${currentUser.username}`;
        
        await loadProducts();
        await loadQuickProducts(); // Cargar productos para la lista rápida
        hideLoading();
    } catch (error) {
        console.error('Error en login:', error);
        showError('Error al iniciar sesión');
        hideLoading();
    }
}

function logout() {
    currentUser = null;
    cart = [];
    stopScanner();
    document.getElementById('mainScreen').classList.remove('active');
    document.getElementById('loginScreen').classList.add('active');
    document.getElementById('loginForm').reset();
    document.getElementById('loginError').textContent = '';
}

// Navegación entre secciones
function showSection(section) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(section + 'Section').classList.add('active');
    
    if (section === 'productos') {
        loadProducts();
    } else if (section === 'reportes') {
        updateReports();
        loadSalesHistory();
    } else if (section === 'ventas') {
        loadQuickProducts();
    }
}

// Escáner de código de barras para ventas
function startScanner() {
    console.log('Iniciando escáner...');
    const video = document.getElementById('video');
    
    // Verificar si ZXing está disponible
    if (typeof ZXing === 'undefined') {
        console.error('ZXing no está definido. Objeto window:', Object.keys(window).filter(k => k.toLowerCase().includes('zx')));
        alert('Error: Librería del escáner no cargada.\n\nSolución:\n1. Recarga la página (Ctrl+F5)\n2. Verifica tu conexión a internet\n3. Revisa la consola (F12) para más detalles');
        return;
    }
    
    try {
        // Configurar hints para mejor detección
        const hints = new Map();
        const formats = [
            ZXing.BarcodeFormat.EAN_13,
            ZXing.BarcodeFormat.EAN_8,
            ZXing.BarcodeFormat.CODE_128,
            ZXing.BarcodeFormat.CODE_39,
            ZXing.BarcodeFormat.UPC_A,
            ZXing.BarcodeFormat.UPC_E
        ];
        hints.set(ZXing.DecodeHintType.POSSIBLE_FORMATS, formats);
        hints.set(ZXing.DecodeHintType.TRY_HARDER, true);
        
        codeReader = new ZXing.BrowserMultiFormatReader(hints);
        console.log('✅ ZXing inicializado con formatos:', formats.map(f => ZXing.BarcodeFormat[f]));
    } catch (error) {
        console.error('Error al crear BrowserMultiFormatReader:', error);
        alert('Error al inicializar el escáner: ' + error.message);
        return;
    }
    
    // Listar cámaras disponibles primero
    codeReader.listVideoInputDevices()
        .then(videoInputDevices => {
            console.log('📷 Cámaras encontradas:', videoInputDevices.length);
            
            if (videoInputDevices.length === 0) {
                alert('No se encontró ninguna cámara en tu dispositivo');
                return;
            }
            
            // Mostrar todas las cámaras disponibles
            videoInputDevices.forEach((device, index) => {
                console.log(`  ${index + 1}. ${device.label || device.deviceId}`);
            });
            
            // Buscar cámara trasera - IGUAL QUE test-simple.html
            let selectedDeviceId = videoInputDevices[0].deviceId;
            let selectedDeviceLabel = videoInputDevices[0].label || 'Cámara 1';
            
            const backCamera = videoInputDevices.find(device => {
                const label = device.label.toLowerCase();
                return label.includes('back') || 
                       label.includes('rear') || 
                       label.includes('trasera') ||
                       label.includes('posterior') ||
                       label.includes('environment') ||
                       label.includes('facing back');
            });
            
            if (backCamera) {
                selectedDeviceId = backCamera.deviceId;
                selectedDeviceLabel = backCamera.label;
                console.log('📱 Usando cámara trasera:', backCamera.label);
            } else if (videoInputDevices.length > 1) {
                // Si hay múltiples cámaras, usar la última
                selectedDeviceId = videoInputDevices[videoInputDevices.length - 1].deviceId;
                selectedDeviceLabel = videoInputDevices[videoInputDevices.length - 1].label;
                console.log('⚠️ Usando última cámara (probablemente trasera)');
            } else {
                console.log('⚠️ Usando primera cámara disponible');
            }
            
            console.log('✅ Cámara seleccionada:', selectedDeviceLabel);
            console.log('🔍 Escaneando... Acerca el código de barras a la cámara');
            
            // Poblar selector de cámaras
            const cameraSelect = document.getElementById('cameraSelect');
            const cameraSelector = document.getElementById('cameraSelector');
            cameraSelect.innerHTML = '';
            
            videoInputDevices.forEach((device, index) => {
                const option = document.createElement('option');
                option.value = device.deviceId;
                option.text = device.label || `Cámara ${index + 1}`;
                if (device.deviceId === selectedDeviceId) {
                    option.selected = true;
                }
                cameraSelect.appendChild(option);
            });
            
            // Mostrar selector solo si hay múltiples cámaras
            if (videoInputDevices.length > 1) {
                cameraSelector.style.display = 'block';
            }
            
            let lastScannedCode = '';
            let lastScannedTime = 0;
            
            // Usar el deviceId de la cámara seleccionada
            console.log('🎥 Iniciando decodificación con deviceId:', selectedDeviceId);
            codeReader.decodeFromVideoDevice(selectedDeviceId, 'video', (result, err) => {
                if (result) {
                    const now = Date.now();
                    // Evitar escaneos duplicados en menos de 2 segundos
                    if (result.text !== lastScannedCode || now - lastScannedTime > 2000) {
                        console.log('✅ Código detectado:', result.text);
                        lastScannedCode = result.text;
                        lastScannedTime = now;
                        
                        // Feedback visual
                        video.style.border = '5px solid green';
                        setTimeout(() => {
                            video.style.border = '2px solid #667eea';
                        }, 500);
                        
                        addProductByCode(result.text);
                    }
                }
                // No mostrar errores de NotFoundException (es normal cuando no hay código)
            });
            
            document.getElementById('startScanner').style.display = 'none';
            document.getElementById('stopScanner').style.display = 'inline-block';
            console.log('✅ Escáner activo - Apunta al código de barras');
        })
        .catch(err => {
            console.error('Error completo:', err);
            if (err.name === 'NotAllowedError') {
                alert('❌ Debes permitir el acceso a la cámara para usar el escáner.\n\nEn Chrome: Haz clic en el icono de cámara en la barra de direcciones.');
            } else if (err.name === 'NotFoundError') {
                alert('❌ No se encontró ninguna cámara en tu dispositivo.');
            } else if (err.name === 'NotReadableError') {
                alert('❌ La cámara está siendo usada por otra aplicación.');
            } else {
                alert('❌ Error al acceder a la cámara: ' + err.message + '\n\nAsegúrate de:\n1. Dar permisos de cámara\n2. Usar HTTPS o localhost\n3. Cerrar otras apps que usen la cámara');
            }
        });
}

function stopScanner() {
    if (codeReader) {
        codeReader.reset();
        document.getElementById('startScanner').style.display = 'inline-block';
        document.getElementById('stopScanner').style.display = 'none';
        document.getElementById('cameraSelector').style.display = 'none';
    }
}

function changeScannerCamera() {
    const selectedDeviceId = document.getElementById('cameraSelect').value;
    console.log('🔄 Cambiando a cámara:', selectedDeviceId);
    
    if (codeReader) {
        codeReader.reset();
        
        let lastScannedCode = '';
        let lastScannedTime = 0;
        
        codeReader.decodeFromVideoDevice(selectedDeviceId, 'video', (result, err) => {
            if (result) {
                const now = Date.now();
                if (result.text !== lastScannedCode || now - lastScannedTime > 2000) {
                    console.log('✅ Código detectado:', result.text);
                    lastScannedCode = result.text;
                    lastScannedTime = now;
                    
                    const video = document.getElementById('video');
                    video.style.border = '5px solid green';
                    setTimeout(() => {
                        video.style.border = '2px solid #667eea';
                    }, 500);
                    
                    addProductByCode(result.text);
                }
            }
        });
    }
}

// Agregar producto al carrito
async function addProductByCode(code) {
    if (!code) {
        code = document.getElementById('manualCode').value.trim();
    }
    
    if (!code) {
        alert('Por favor ingrese un código');
        return;
    }
    
    showLoading();
    
    try {
        const { data: product, error } = await supabaseClient             .from('products')
            .select('*')
            .eq('barcode', code)
            .single();
        
        if (error || !product) {
            alert('Producto no encontrado');
            hideLoading();
            return;
        }
        
        if (product.stock <= 0) {
            alert('Producto sin stock');
            hideLoading();
            return;
        }
        
        // Verificar si ya está en el carrito
        const cartItem = cart.find(item => item.barcode === code);
        
        if (cartItem) {
            if (cartItem.quantity < product.stock) {
                cartItem.quantity++;
            } else {
                alert('No hay suficiente stock');
                hideLoading();
                return;
            }
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }
        
        document.getElementById('manualCode').value = '';
        updateCart();
        hideLoading();
    } catch (error) {
        console.error('Error al agregar producto:', error);
        showError('Error al agregar producto');
        hideLoading();
    }
}

function updateCart() {
    const cartBody = document.getElementById('cartBody');
    cartBody.innerHTML = '';
    
    let total = 0;
    
    cart.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${formatCurrency(item.price)}</td>
            <td>
                <button onclick="changeQuantity(${index}, -1)">-</button>
                ${item.quantity}
                <button onclick="changeQuantity(${index}, 1)">+</button>
            </td>
            <td>${formatCurrency(subtotal)}</td>
            <td><button class="delete-btn action-btn" onclick="removeFromCart(${index})">Eliminar</button></td>
        `;
        cartBody.appendChild(row);
    });
    
    document.getElementById('cartTotal').textContent = formatCurrency(total).replace('$', '');
}

async function changeQuantity(index, change) {
    const item = cart[index];
    
    showLoading();
    
    try {
        const { data: product, error } = await supabaseClient             .from('products')
            .select('stock')
            .eq('id', item.id)
            .single();
        
        if (error) {
            throw error;
        }
        
        const newQuantity = item.quantity + change;
        
        if (newQuantity <= 0) {
            removeFromCart(index);
            hideLoading();
            return;
        }
        
        if (newQuantity > product.stock) {
            alert('No hay suficiente stock');
            hideLoading();
            return;
        }
        
        item.quantity = newQuantity;
        updateCart();
        hideLoading();
    } catch (error) {
        console.error('Error al cambiar cantidad:', error);
        showError('Error al cambiar cantidad');
        hideLoading();
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function clearCart() {
    if (cart.length === 0) return;
    
    if (confirm('¿Desea limpiar el carrito?')) {
        cart = [];
        updateCart();
    }
}

// Lista rápida de productos en ventas
async function loadQuickProducts() {
    const quickProductList = document.getElementById('quickProductList');
    
    if (!quickProductList) return;
    
    quickProductList.innerHTML = '<div style="padding: 10px; text-align: center;">Cargando productos...</div>';
    
    try {
        const { data, error } = await supabaseClient
            .from('products')
            .select('*')
            .order('name');
        
        if (error) throw error;
        
        if (!data || data.length === 0) {
            quickProductList.innerHTML = '<div style="padding: 10px; text-align: center; color: #666;">No hay productos disponibles</div>';
            return;
        }
        
        displayQuickProducts(data);
    } catch (error) {
        console.error('Error al cargar productos rápidos:', error);
        quickProductList.innerHTML = '<div style="padding: 10px; text-align: center; color: #dc3545;">Error al cargar productos</div>';
    }
}

function displayQuickProducts(productList) {
    const quickProductList = document.getElementById('quickProductList');
    quickProductList.innerHTML = '';
    
    if (productList.length === 0) {
        quickProductList.innerHTML = '<div style="padding: 10px; text-align: center; color: #666;">No se encontraron productos</div>';
        return;
    }
    
    productList.forEach(product => {
        const item = document.createElement('div');
        item.className = 'quick-product-item';
        
        if (product.stock <= 0) {
            item.classList.add('out-of-stock');
        }
        
        const stockClass = product.stock <= 5 ? 'low' : '';
        const stockText = product.stock <= 0 ? 'Sin stock' : `Stock: ${product.stock}`;
        
        item.innerHTML = `
            <div class="quick-product-info">
                <div class="quick-product-name">${product.name}</div>
                <div class="quick-product-price">${formatCurrency(product.price)}</div>
            </div>
            <div>
                <span class="quick-product-stock ${stockClass}">${stockText}</span>
                <button class="quick-product-add" onclick="addProductToCartById('${product.id}', this)" ${product.stock <= 0 ? 'disabled' : ''}>
                    + Agregar
                </button>
            </div>
        `;
        
        quickProductList.appendChild(item);
    });
}

function filterQuickProducts() {
    const search = document.getElementById('searchQuickProduct').value.toLowerCase();
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(search) ||
        product.barcode.includes(search)
    );
    displayQuickProducts(filteredProducts);
}

async function addProductToCartById(productId, buttonElement) {
    showLoading();
    
    try {
        const { data: product, error } = await supabaseClient
            .from('products')
            .select('*')
            .eq('id', productId)
            .single();
        
        if (error) throw error;
        
        if (!product) {
            alert('Producto no encontrado');
            hideLoading();
            return;
        }
        
        if (product.stock <= 0) {
            alert('Producto sin stock');
            hideLoading();
            return;
        }
        
        // Verificar si ya está en el carrito
        const cartItem = cart.find(item => item.id === productId);
        
        if (cartItem) {
            if (cartItem.quantity < product.stock) {
                cartItem.quantity++;
            } else {
                alert('No hay suficiente stock');
                hideLoading();
                return;
            }
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }
        
        updateCart();
        await loadQuickProducts(); // Actualizar la lista para reflejar el stock
        hideLoading();
        
        // Feedback visual
        if (buttonElement) {
            const originalText = buttonElement.textContent;
            const originalBg = buttonElement.style.background;
            buttonElement.textContent = '✓ Agregado';
            buttonElement.style.background = '#28a745';
            setTimeout(() => {
                buttonElement.textContent = originalText;
                buttonElement.style.background = originalBg || '#667eea';
            }, 1000);
        }
    } catch (error) {
        console.error('Error al agregar producto:', error);
        showError('Error al agregar producto: ' + error.message);
        hideLoading();
    }
}

async function finalizeSale() {
    if (cart.length === 0) {
        alert('El carrito está vacío');
        return;
    }
    
    showLoading();
    
    try {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Crear la venta
        const { data: sale, error: saleError } = await supabaseClient             .from('sales')
            .insert({
                total: total,
                user_id: currentUser.id
            })
            .select()
            .single();
        
        if (saleError) throw saleError;
        
        // Crear los items de venta y actualizar stock
        for (const item of cart) {
            // Insertar item de venta
            const { error: itemError } = await supabaseClient                 .from('sale_items')
                .insert({
                    sale_id: sale.id,
                    product_id: item.id,
                    product_name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    subtotal: item.price * item.quantity
                });
            
            if (itemError) throw itemError;
            
            // Actualizar stock
            const { error: stockError } = await supabaseClient                 .from('products')
                .update({ stock: item.stock - item.quantity })
                .eq('id', item.id);
            
            if (stockError) throw stockError;
        }
        
        alert(`Venta finalizada. Total: ${formatCurrency(total)}`);
        
        cart = [];
        updateCart();
        await loadProducts();
        await loadQuickProducts(); // Actualizar lista rápida con nuevo stock
        hideLoading();
    } catch (error) {
        console.error('Error al finalizar venta:', error);
        showError('Error al finalizar venta');
        hideLoading();
    }
}

// Gestión de productos
async function handleProductSubmit(e) {
    e.preventDefault();
    showLoading();
    
    const id = document.getElementById('productId').value;
    const name = document.getElementById('productName').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const stock = parseInt(document.getElementById('productStock').value);
    const barcode = document.getElementById('productBarcode').value;
    
    try {
        if (id) {
            // Editar producto existente
            const { error } = await supabaseClient                 .from('products')
                .update({
                    name,
                    price,
                    stock,
                    barcode,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id);
            
            if (error) throw error;
        } else {
            // Nuevo producto
            const { error } = await supabaseClient                 .from('products')
                .insert({
                    name,
                    price,
                    stock,
                    barcode
                });
            
            if (error) throw error;
        }
        
        document.getElementById('productForm').reset();
        document.getElementById('productId').value = '';
        await loadProducts();
        alert('Producto guardado correctamente');
        hideLoading();
    } catch (error) {
        console.error('Error al guardar producto:', error);
        showError('Error al guardar producto: ' + error.message);
        hideLoading();
    }
}

async function loadProducts() {
    showLoading();
    
    try {
        const { data, error } = await supabaseClient             .from('products')
            .select('*')
            .order('name');
        
        if (error) throw error;
        
        products = data || [];
        
        const productBody = document.getElementById('productBody');
        productBody.innerHTML = '';
        
        products.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.name}</td>
                <td>${formatCurrency(product.price)}</td>
                <td>${product.stock}</td>
                <td>${product.barcode}</td>
                <td>
                    <button class="edit-btn action-btn" onclick="editProduct('${product.id}')">Editar</button>
                    <button class="stock-btn action-btn" onclick="addStock('${product.id}')">+ Stock</button>
                    <button class="delete-btn action-btn" onclick="deleteProduct('${product.id}')">Eliminar</button>
                </td>
            `;
            productBody.appendChild(row);
        });
        
        hideLoading();
    } catch (error) {
        console.error('Error al cargar productos:', error);
        showError('Error al cargar productos');
        hideLoading();
    }
}

function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productStock').value = product.stock;
        document.getElementById('productBarcode').value = product.barcode;
        window.scrollTo(0, 0);
    }
}

function cancelEdit() {
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
}

async function addStock(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        const amount = prompt('¿Cuántas unidades desea agregar?', '10');
        if (amount && !isNaN(amount)) {
            showLoading();
            
            try {
                const newStock = product.stock + parseInt(amount);
                const { error } = await supabaseClient                     .from('products')
                    .update({ stock: newStock })
                    .eq('id', id);
                
                if (error) throw error;
                
                await loadProducts();
                hideLoading();
            } catch (error) {
                console.error('Error al agregar stock:', error);
                showError('Error al agregar stock');
                hideLoading();
            }
        }
    }
}

async function deleteProduct(id) {
    if (confirm('¿Está seguro de eliminar este producto?')) {
        showLoading();
        
        try {
            const { error } = await supabaseClient                 .from('products')
                .delete()
                .eq('id', id);
            
            if (error) throw error;
            
            await loadProducts();
            hideLoading();
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            showError('Error al eliminar producto');
            hideLoading();
        }
    }
}

function filterProducts() {
    const search = document.getElementById('searchProduct').value.toLowerCase();
    const rows = document.querySelectorAll('#productBody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(search) ? '' : 'none';
    });
}

// Escáner para agregar código de barras a producto
function scanBarcodeForProduct() {
    console.log('Abriendo escáner de productos...');
    const modal = document.getElementById('barcodeModal');
    modal.classList.add('active');
    
    const video = document.getElementById('productVideo');
    
    if (typeof ZXing === 'undefined') {
        alert('Error: Librería ZXing no cargada. Recarga la página.');
        closeBarcodeModal();
        return;
    }
    
    try {
        // Configurar hints para mejor detección
        const hints = new Map();
        const formats = [
            ZXing.BarcodeFormat.EAN_13,
            ZXing.BarcodeFormat.EAN_8,
            ZXing.BarcodeFormat.CODE_128,
            ZXing.BarcodeFormat.CODE_39,
            ZXing.BarcodeFormat.UPC_A,
            ZXing.BarcodeFormat.UPC_E
        ];
        hints.set(ZXing.DecodeHintType.POSSIBLE_FORMATS, formats);
        hints.set(ZXing.DecodeHintType.TRY_HARDER, true);
        
        productCodeReader = new ZXing.BrowserMultiFormatReader(hints);
        console.log('✅ Escáner de productos inicializado');
    } catch (error) {
        console.error('Error:', error);
        alert('Error al inicializar: ' + error.message);
        closeBarcodeModal();
        return;
    }
    
    // Listar cámaras disponibles
    productCodeReader.listVideoInputDevices()
        .then(videoInputDevices => {
            console.log('📷 Cámaras:', videoInputDevices.length);
            
            if (videoInputDevices.length === 0) {
                alert('No se encontró ninguna cámara');
                closeBarcodeModal();
                return;
            }
            
            // Mostrar todas las cámaras
            videoInputDevices.forEach((device, index) => {
                console.log(`  ${index}: ${device.label || device.deviceId}`);
            });
            
            // Buscar cámara trasera - IGUAL QUE test-simple.html
            let selectedDeviceId = videoInputDevices[0].deviceId;
            let selectedDeviceLabel = videoInputDevices[0].label || 'Cámara 1';
            
            const backCamera = videoInputDevices.find(device => {
                const label = device.label.toLowerCase();
                return label.includes('back') || 
                       label.includes('rear') || 
                       label.includes('trasera') ||
                       label.includes('posterior') ||
                       label.includes('environment') ||
                       label.includes('facing back');
            });
            
            if (backCamera) {
                selectedDeviceId = backCamera.deviceId;
                selectedDeviceLabel = backCamera.label;
                console.log('📱 Usando cámara trasera:', backCamera.label);
            } else if (videoInputDevices.length > 1) {
                selectedDeviceId = videoInputDevices[videoInputDevices.length - 1].deviceId;
                selectedDeviceLabel = videoInputDevices[videoInputDevices.length - 1].label;
                console.log('⚠️ Usando última cámara (probablemente trasera)');
            } else {
                console.log('⚠️ Usando primera cámara');
            }
            
            console.log('✅ Cámara seleccionada:', selectedDeviceLabel);
            console.log('🔍 Escaneando producto...');
            
            // Poblar selector de cámaras para productos
            const productCameraSelect = document.getElementById('productCameraSelect');
            const productCameraSelector = document.getElementById('productCameraSelector');
            productCameraSelect.innerHTML = '';
            
            videoInputDevices.forEach((device, index) => {
                const option = document.createElement('option');
                option.value = device.deviceId;
                option.text = device.label || `Cámara ${index + 1}`;
                if (device.deviceId === selectedDeviceId) {
                    option.selected = true;
                }
                productCameraSelect.appendChild(option);
            });
            
            // Mostrar selector solo si hay múltiples cámaras
            if (videoInputDevices.length > 1) {
                productCameraSelector.style.display = 'block';
            }
            
            console.log('🎥 Iniciando decodificación de producto con deviceId:', selectedDeviceId);
            productCodeReader.decodeFromVideoDevice(selectedDeviceId, 'productVideo', (result, err) => {
                if (result) {
                    console.log('✅ Código detectado:', result.text);
                    
                    // Feedback visual
                    video.style.border = '5px solid green';
                    
                    document.getElementById('productBarcode').value = result.text;
                    
                    // Pequeño delay para que se vea el feedback
                    setTimeout(() => {
                        stopProductScanner();
                    }, 500);
                }
            });
        })
        .catch(err => {
            console.error('Error:', err);
            if (err.name === 'NotAllowedError') {
                alert('❌ Debes permitir el acceso a la cámara.');
            } else {
                alert('❌ Error: ' + err.message);
            }
            closeBarcodeModal();
        });
}

function stopProductScanner() {
    if (productCodeReader) {
        productCodeReader.reset();
    }
    closeBarcodeModal();
}

function closeBarcodeModal() {
    document.getElementById('barcodeModal').classList.remove('active');
    document.getElementById('productCameraSelector').style.display = 'none';
}

function changeProductCamera() {
    const selectedDeviceId = document.getElementById('productCameraSelect').value;
    console.log('🔄 Cambiando cámara de producto:', selectedDeviceId);
    
    if (productCodeReader) {
        productCodeReader.reset();
        const video = document.getElementById('productVideo');
        
        productCodeReader.decodeFromVideoDevice(selectedDeviceId, 'productVideo', (result, err) => {
            if (result) {
                console.log('✅ Código detectado:', result.text);
                video.style.border = '5px solid green';
                document.getElementById('productBarcode').value = result.text;
                setTimeout(() => {
                    stopProductScanner();
                }, 500);
            }
        });
    }
}

// Reportes
async function updateReports() {
    showLoading();
    
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        
        // Ventas de hoy
        const { data: todaySales, error: todayError } = await supabaseClient             .from('sales')
            .select('total')
            .gte('created_at', today.toISOString())
            .lt('created_at', tomorrow.toISOString());
        
        if (todayError) throw todayError;
        
        const todayTotal = todaySales.reduce((sum, sale) => sum + parseFloat(sale.total), 0);
        document.getElementById('todaySales').textContent = formatCurrency(todayTotal).replace('$', '');
        document.getElementById('todayCount').textContent = todaySales.length;
        
        // Ventas de ayer
        const { data: yesterdaySales, error: yesterdayError } = await supabaseClient             .from('sales')
            .select('total')
            .gte('created_at', yesterday.toISOString())
            .lt('created_at', today.toISOString());
        
        if (yesterdayError) throw yesterdayError;
        
        const yesterdayTotal = yesterdaySales.reduce((sum, sale) => sum + parseFloat(sale.total), 0);
        document.getElementById('yesterdaySales').textContent = formatCurrency(yesterdayTotal).replace('$', '');
        document.getElementById('yesterdayCount').textContent = yesterdaySales.length;
        
        // Ventas del mes
        const { data: monthSales, error: monthError } = await supabaseClient             .from('sales')
            .select('total')
            .gte('created_at', monthStart.toISOString());
        
        if (monthError) throw monthError;
        
        const monthTotal = monthSales.reduce((sum, sale) => sum + parseFloat(sale.total), 0);
        document.getElementById('monthSales').textContent = formatCurrency(monthTotal).replace('$', '');
        document.getElementById('monthCount').textContent = monthSales.length;
        
        hideLoading();
    } catch (error) {
        console.error('Error al actualizar reportes:', error);
        showError('Error al actualizar reportes');
        hideLoading();
    }
}

async function loadSalesHistory() {
    showLoading();
    
    try {
        const { data: sales, error } = await supabaseClient             .from('sales')
            .select(`
                *,
                sale_items (*)
            `)
            .order('created_at', { ascending: false })
            .limit(50);
        
        if (error) throw error;
        
        const salesBody = document.getElementById('salesBody');
        salesBody.innerHTML = '';
        
        sales.forEach(sale => {
            const date = new Date(sale.created_at);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${date.toLocaleDateString('es-CO')}</td>
                <td>${date.toLocaleTimeString('es-CO')}</td>
                <td>${formatCurrency(sale.total)}</td>
                <td>${sale.sale_items.length} productos</td>
                <td><button class="view-btn action-btn" onclick='showSaleDetail(${JSON.stringify(sale).replace(/'/g, "&apos;")})'>Ver</button></td>
            `;
            salesBody.appendChild(row);
        });
        
        hideLoading();
    } catch (error) {
        console.error('Error al cargar historial:', error);
        showError('Error al cargar historial');
        hideLoading();
    }
}

function showSaleDetail(sale) {
    const modal = document.getElementById('saleDetailModal');
    const content = document.getElementById('saleDetailContent');
    
    let html = '<h3>Productos:</h3>';
    
    sale.sale_items.forEach(item => {
        html += `
            <div class="sale-detail-item">
                <span>${item.product_name} x${item.quantity}</span>
                <span>${formatCurrency(item.subtotal)}</span>
            </div>
        `;
    });
    
    html += `<div class="sale-detail-total">Total: ${formatCurrency(sale.total)}</div>`;
    
    content.innerHTML = html;
    modal.classList.add('active');
}

function closeSaleDetailModal() {
    document.getElementById('saleDetailModal').classList.remove('active');
}


