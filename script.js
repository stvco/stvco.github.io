// ===============================
//   CONFIGURACIÓN Y DATOS
// ===============================
const WHATSAPP_BASE = "https://wa.me/524776755956";
const currency = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' });

// 1. DATOS PARA EL INICIO (CATEGORÍAS)
const categoriasInicio = [
    { id: 'cat1', nombre: "Desarrollo Web", imagen: "desarrollo.web.png", link: "desarrollo-web.html" },
    { id: 'cat2', nombre: "Soporte Técnico", imagen: "mantenimiento.jpeg", link: "soporte-reparacion.html" },
    { id: 'cat3', nombre: "Sistemas", imagen: "sistemas.png", link: "sistemas-automatizacion.html" },
    { id: 'cat4', nombre: "Mantenimiento", imagen: "restauracion.png", link: "mantenimiento-optimizacion.html" }
];

// 2. DATOS PARA DESARROLLO WEB (SERVICIOS INDIVIDUALES)
const serviciosWeb = [
    { id: 101, nombre: "Landing Page HTML/CSS", imagenes: ["web_html.png", "web_html.1.png"], descripcion: "Sitio web estático de alto rendimiento.", stock: 1, precio: 0 },
    { id: 102, nombre: "Sitio Auto-gestivo WordPress", imagenes: ["wordpress.png"], descripcion: "Web administrable con panel de control.", stock: 1, precio: 0 },
    { id: 103, nombre: "E-commerce Completo", imagenes: ["tienda_1.png"], descripcion: "Tienda en línea con carrito y pagos.", stock: 1, precio: 0 },
    { id: 104, nombre: "prueba 4", imagenes: ["prueba.png"], descripcion: "prueba para cuerto slot de producto.", stock: 1, precio: 0 }
];

// 3. DATOS PARA SOPORTE Y REPARACIÓN
const serviciosSoporte = [
    { id: 201, nombre: "Reparación de Inicio Windows", imagenes: ["mantenimiento.jpeg"], descripcion: "Solución a pantallas azules, bucles de reinicio y errores de sistema.", stock: 1, precio: 0 },
    { id: 202, nombre: "Instalación de Software", imagenes: ["restauracion.png"], descripcion: "Instalación de Office, Antivirus y programas especializados.", stock: 1, precio: 0 },
    { id: 203, nombre: "Limpieza Física PC/Laptop", imagenes: ["mantenimiento.jpeg"], descripcion: "Mantenimiento preventivo de hardware para evitar sobrecalentamiento.", stock: 1, precio: 0 },
    { id: 204, nombre: "Recuperación de Datos", imagenes: ["restauracion.png"], descripcion: "Recuperación de archivos de discos dañados o formateados.", stock: 1, precio: 0 }
];

// 4. DATOS PARA SISTEMAS Y AUTOMATIZACIÓN
const serviciosSistemas = [
    { id: 301, nombre: "Sistema de Inventarios", imagenes: ["sistemas.png"], descripcion: "Control de stock, entradas y salidas para tu negocio.", stock: 1, precio: 0 },
    { id: 302, nombre: "Automatización con Excel/VBA", imagenes: ["sistemas.png"], descripcion: "Macros y hojas de cálculo avanzadas para optimizar procesos.", stock: 1, precio: 0 },
    { id: 303, nombre: "Base de Datos a Medida", imagenes: ["sistemas.png"], descripcion: "Diseño y administración de bases de datos personalizadas.", stock: 1, precio: 0 },
    { id: 304, nombre: "Integración de APIs", imagenes: ["sistemas.png"], descripcion: "Conexión entre diferentes servicios y plataformas software.", stock: 1, precio: 0 }
];

// 5. DATOS PARA MANTENIMIENTO Y OPTIMIZACIÓN
const serviciosMantenimiento = [
    { id: 401, nombre: "Optimización de Rendimiento", imagenes: ["restauracion.png"], descripcion: "Acelera tu computadora lenta y elimina archivos basura.", stock: 1, precio: 0 },
    { id: 402, nombre: "Limpieza de Virus/Malware", imagenes: ["restauracion.png"], descripcion: "Escaneo profundo y eliminación de amenazas de seguridad.", stock: 1, precio: 0 },
    { id: 403, nombre: "Actualización de Drivers", imagenes: ["restauracion.png"], descripcion: "Instalación de los últimos controladores para tu hardware.", stock: 1, precio: 0 },
    { id: 404, nombre: "Configuración de Redes", imagenes: ["restauracion.png"], descripcion: "Optimización de conexión WiFi y configuración de routers.", stock: 1, precio: 0 }
];

const estado = { carrito: [], productoActual: null, indiceFoto: 0 };

const $ = (id) => document.getElementById(id);
const nodos = {
    catalogo: $("catalogo"),
    visor: $("visor"),
    visorImg: $("visor-img"),
    visorMiniaturas: $("visor-miniaturas"),
    visorDescripcion: $("visor-descripcion"),
    visorStock: $("visor-stock"),
    carritoContador: $("carrito-contador"),
    carritoPanel: $("carrito"),
    carritoItems: $("carrito-items"),
    carritoTotal: $("carrito-total"),
    btnAgregar: $("btn-agregar-carrito-float")
};

// Función de precio especial
function formatPrecio(precio) {
    if (precio === 0) return "Consulta personalizada a través de WhatsApp";
    return currency.format(precio);
}

function renderCatalogo() {
    if (!nodos.catalogo) return;

    const path = window.location.pathname;
    let datos = [];

    // Simplificación para detectar página actual
    if (path.endsWith('index.html') || path.endsWith('/') || path === '') {
        // Renderizar Categorías en Inicio
        nodos.catalogo.innerHTML = categoriasInicio.map(cat => `
            <article class="card card-categoria" onclick="window.location.href='${cat.link}'">
                <img src="img/${cat.imagen}" class="thumbnail">
                <h3>${cat.nombre}</h3>
            </article>
        `).join('');
        return;
    } else if (path.includes('desarrollo-web.html')) {
        datos = serviciosWeb;
    } else if (path.includes('soporte-reparacion.html')) {
        datos = serviciosSoporte;
    } else if (path.includes('sistemas-automatizacion.html')) {
        datos = serviciosSistemas;
    } else if (path.includes('mantenimiento-optimizacion.html')) {
        datos = serviciosMantenimiento;
    } else {
        // Default o fallback
        datos = serviciosWeb;
    }

    nodos.catalogo.innerHTML = datos.map((p, index) => `
        <article class="card">
            <!-- NOTA: Pasamos el objeto productos globalmente si queremos usar abrirVisor con índice,
                 pero como tenemos múltiples arrays, necesitamos saber CUAL array usar en abrirVisor.
                 Para simplificar, asignaremos el array activo a una variable global o pasaremos el dato directo.
                 Aquí usaremos una estrategia simple:
                 Guardamos el array actual en una variable global temporal para el visor.
            -->
            <img src="img/${p.imagenes[0]}" class="thumbnail" onclick="abrirVisorContexto(${p.id})">
            <h3>${p.nombre}</h3>
            <strong class="precio-card">${formatPrecio(p.precio)}</strong>
            <button class="btn btn-full" onclick="abrirVisorContexto(${p.id})">Ver detalles</button>
        </article>
    `).join('');

    // Guardamos referencia a los datos actuales para el visor
    window.datosActuales = datos;
}

// Nueva función para abrir visor buscando por ID en los datos actuales
function abrirVisorContexto(id) {
    if (!nodos.visor) return;
    const p = window.datosActuales.find(item => item.id === id);
    if (!p) return;

    estado.productoActual = p;
    estado.indiceFoto = 0;
    nodos.visorDescripcion.textContent = p.descripcion;
    nodos.visorStock.textContent = p.stock > 0 ? "Disponible" : "Agotado";
    nodos.visorMiniaturas.innerHTML = p.imagenes.map((img, i) => `
        <img src="img/${img}" class="mini-click ${i === 0 ? 'active' : ''}" onclick="cambiarFoto(${i})">
    `).join('');
    actualizarFotoVisor();
    nodos.visor.classList.remove("oculto");
}

function actualizarCarrito() {
    if (!nodos.carritoItems) return;
    if (estado.carrito.length === 0) {
        nodos.carritoItems.innerHTML = `<p style="text-align:center; opacity:0.5; margin-top:30px;">Tu carrito está vacío</p>`;
    } else {
        nodos.carritoItems.innerHTML = estado.carrito.map(p => `
            <div class="carrito-item" data-id="${p.id}">
                <div class="item-info">
                    <span class="item-nombre">${p.nombre}</span>
                    <span class="item-precio">${p.precio === 0 ? 'Cotización' : currency.format(p.precio * p.cantidad)}</span>
                </div>
                <div class="item-controles">
                    <button class="btn-qty" data-accion="restar">-</button>
                    <span class="qty-num">${p.cantidad}</span>
                    <button class="btn-qty" data-accion="sumar">+</button>
                </div>
            </div>
        `).join('');
    }
    const total = estado.carrito.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);
    nodos.carritoTotal.textContent = currency.format(total);
    nodos.carritoContador.textContent = estado.carrito.reduce((acc, p) => acc + p.cantidad, 0);
}

if (nodos.carritoItems) {
    nodos.carritoItems.addEventListener("click", (e) => {
        const btn = e.target.closest(".btn-qty");
        if (!btn) return;
        const id = parseInt(e.target.closest(".carrito-item").dataset.id);
        const accion = btn.dataset.accion;
        const index = estado.carrito.findIndex(p => p.id === id);

        if (accion === "sumar") {
            estado.carrito[index].cantidad++;
        } else if (accion === "restar") {
            if (estado.carrito[index].cantidad > 1) {
                estado.carrito[index].cantidad--;
            } else {
                estado.carrito.splice(index, 1);
            }
        }
        actualizarCarrito();
    });
}

// Antigua función abrirVisor reemplazada por abrirVisorContexto
// Conservamos la función original por si acaso, pero vacía o redirigiendo
function abrirVisor(index) {
    // Legacy support logic if needed, otherwise using abrirVisorContexto
}

function cambiarFoto(i) {
    estado.indiceFoto = i;
    actualizarFotoVisor();
}

function actualizarFotoVisor() {
    nodos.visorImg.src = `img/${estado.productoActual.imagenes[estado.indiceFoto]}`;
    document.querySelectorAll('.mini-click').forEach((img, i) => {
        img.classList.toggle('active', i === estado.indiceFoto);
    });
}

if ($("visor-prev")) {
    $("visor-prev").onclick = () => {
        const total = estado.productoActual.imagenes.length;
        estado.indiceFoto = (estado.indiceFoto - 1 + total) % total;
        actualizarFotoVisor();
    };
}
if ($("visor-next")) {
    $("visor-next").onclick = () => {
        const total = estado.productoActual.imagenes.length;
        estado.indiceFoto = (estado.indiceFoto + 1) % total;
        actualizarFotoVisor();
    };
}

if (nodos.btnAgregar) {
    nodos.btnAgregar.onclick = () => {
        const existente = estado.carrito.find(p => p.id === estado.productoActual.id);
        if (existente) existente.cantidad++;
        else estado.carrito.push({ ...estado.productoActual, cantidad: 1 });
        actualizarCarrito();
        nodos.btnAgregar.textContent = "✔ Agregado";
        setTimeout(() => nodos.btnAgregar.textContent = "➕ Agregar al carrito", 1000);
    };
}

$("carrito-btn").onclick = () => nodos.carritoPanel.classList.toggle("oculto");
$("carrito-cerrar").onclick = () => nodos.carritoPanel.classList.add("oculto");
if ($("visor-cerrar")) $("visor-cerrar").onclick = () => nodos.visor.classList.add("oculto");

$("carrito-comprar").onclick = () => {
    if (estado.carrito.length === 0) return alert("El carrito está vacío");
    let msg = "Hola STV, me interesa lo siguiente:\n\n";
    estado.carrito.forEach(p => msg += `- ${p.nombre} (x${p.cantidad})\n`);
    window.open(`${WHATSAPP_BASE}?text=${encodeURIComponent(msg)}`, "_blank");
};

// ==========================================
//   IMPLEMENTACIÓN LETTERGLITCH (JS PURO)
// ==========================================
function initLetterGlitch() {
    const container = $("glitch-canvas-container");
    if (!container) return;

    const canvas = document.createElement('canvas');
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    const config = {
        glitchColors: ['#2b4539', '#61dca3', '#61b3dc'],
        glitchSpeed: 50,
        smooth: true,
        characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789',
        fontSize: 16,
        charWidth: 10,
        charHeight: 20
    };

    let letters = [];
    let grid = { columns: 0, rows: 0 };
    let lastGlitchTime = Date.now();

    const hexToRgb = hex => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
    };

    const interpolateColor = (start, end, factor) => {
        const r = Math.round(start.r + (end.r - start.r) * factor);
        const g = Math.round(start.g + (end.g - start.g) * factor);
        const b = Math.round(start.b + (end.b - start.b) * factor);
        return `rgb(${r}, ${g}, ${b})`;
    };

    const initializeLetters = () => {
        const total = grid.columns * grid.rows;
        letters = Array.from({ length: total }, () => {
            const color = config.glitchColors[Math.floor(Math.random() * config.glitchColors.length)];
            return {
                char: config.characters[Math.floor(Math.random() * config.characters.length)],
                color: color,
                targetColor: color,
                colorProgress: 1
            };
        });
    };

    const resize = () => {
        const dpr = window.devicePixelRatio || 1;
        const rect = container.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        grid.columns = Math.ceil(rect.width / config.charWidth);
        grid.rows = Math.ceil(rect.height / config.charHeight);
        initializeLetters();
    };

    const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = `${config.fontSize}px monospace`;
        ctx.textBaseline = 'top';

        letters.forEach((letter, index) => {
            const x = (index % grid.columns) * config.charWidth;
            const y = Math.floor(index / grid.columns) * config.charHeight;
            ctx.fillStyle = letter.color;
            ctx.fillText(letter.char, x, y);
        });
    };

    const update = () => {
        const updateCount = Math.max(1, Math.floor(letters.length * 0.05));
        for (let i = 0; i < updateCount; i++) {
            const idx = Math.floor(Math.random() * letters.length);
            if (!letters[idx]) continue;
            letters[idx].char = config.characters[Math.floor(Math.random() * config.characters.length)];
            letters[idx].targetColor = config.glitchColors[Math.floor(Math.random() * config.glitchColors.length)];
            letters[idx].colorProgress = config.smooth ? 0 : 1;
        }
    };

    const processTransitions = () => {
        letters.forEach(letter => {
            if (letter.colorProgress < 1) {
                letter.colorProgress += 0.05;
                if (letter.colorProgress > 1) letter.colorProgress = 1;
                const startRgb = hexToRgb(letter.color.startsWith('rgb') ? '#61dca3' : letter.color); // Simplificación
                const endRgb = hexToRgb(letter.targetColor);
                if (startRgb && endRgb) {
                    letter.color = interpolateColor(startRgb, endRgb, letter.colorProgress);
                }
            }
        });
    };

    const animate = () => {
        const now = Date.now();
        if (now - lastGlitchTime >= config.glitchSpeed) {
            update();
            lastGlitchTime = now;
        }
        if (config.smooth) processTransitions();
        draw();
        requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    animate();
}

// Inicialización de la App
renderCatalogo();
actualizarCarrito();

// Activar LetterGlitch solo en Inicio
const esInicio = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/') || window.location.pathname === '';
if (esInicio) {
    initLetterGlitch();
}

// ==========================================
//   LOGICA MENU MOBILE
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const closeMenu = document.querySelector('.close-menu');
    const navPrincipal = document.querySelector('.nav-principal');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && navPrincipal) {
        menuToggle.addEventListener('click', () => {
            navPrincipal.classList.add('open');
        });
    }

    if (closeMenu && navPrincipal) {
        closeMenu.addEventListener('click', () => {
            navPrincipal.classList.remove('open');
        });
    }

    // Cerrar menú al hacer clic en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navPrincipal) navPrincipal.classList.remove('open');
        });
    });

    // Cerrar menú al hacer click fuera (opcional)
    document.addEventListener('click', (e) => {
        if (navPrincipal &&
            navPrincipal.classList.contains('open') &&
            !navPrincipal.contains(e.target) &&
            !menuToggle.contains(e.target)) {
            navPrincipal.classList.remove('open');
        }
    });
});
