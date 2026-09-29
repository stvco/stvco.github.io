// ===============================
//   CONFIGURACIÓN Y DATOS GLOBAL
// ===============================
const CONFIG = {
    SITE_ACTIVE: true,  // Cambiar a false para modo mantenimiento
    whatsappBase: "https://wa.me/524776755956",
    cartKey: 'stv_cart',
    themeKey: 'stv_theme'
};

const currency = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' });

function getInitialTheme() {
    try {
        const savedTheme = localStorage.getItem(CONFIG.themeKey);
        if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
    } catch { }

    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

document.documentElement.dataset.theme = getInitialTheme();

// Datos de Servicios
const DATA = {
    categorias: [
        { id: 'cat1', nombre: "Desarrollo Web", imagen: "desarrollo.web.png", link: "desarrollo-web.html" },
        { id: 'cat2', nombre: "Soporte Técnico", imagen: "mantenimiento.jpeg", link: "soporte-reparacion.html" },
        { id: 'cat3', nombre: "Sistemas", imagen: "sistemas.png", link: "sistemas-automatizacion.html" },
        { id: 'cat4', nombre: "Mantenimiento", imagen: "restauracion.png", link: "mantenimiento-optimizacion.html" }
    ],
    web: [
        { id: 101, nombre: "Landing Page HTML/CSS", imagenes: ["web_html.png", "web_html.1.png"], descripcion: "Sitio web estático de alto rendimiento.", stock: 1, precio: 0 },
        { id: 102, nombre: "Sitio Auto-gestivo WordPress", imagenes: ["wordpress.png"], descripcion: "Web administrable con panel de control.", stock: 1, precio: 0 },
        { id: 103, nombre: "E-commerce Completo", imagenes: ["tienda_1.png"], descripcion: "Tienda en línea con carrito y pagos.", stock: 1, precio: 0 },
        { id: 104, nombre: "Optimización SEO y rendimiento", imagenes: ["web_1.jpeg"], descripcion: "Mejora la velocidad, estructura y visibilidad de tu sitio web en buscadores.", stock: 1, precio: 0 }
    ],
    soporte: [

        { id: 201, nombre: "Reparación de Inicio Windows", imagenes: ["mantenimiento.jpeg"], descripcion: "Solución a pantallas azules, bucles de reinicio y errores de sistema.", stock: 1, precio: 0 },
        { id: 202, nombre: "Instalación de Software", imagenes: ["restauracion.png"], descripcion: "Instalación de Office, Antivirus y programas especializados.", stock: 1, precio: 0 },
        { id: 203, nombre: "Limpieza Física PC/Laptop", imagenes: ["mantenimiento.jpeg"], descripcion: "Mantenimiento preventivo de hardware para evitar sobrecalentamiento.", stock: 1, precio: 0 },
        { id: 204, nombre: "Recuperación de Datos", imagenes: ["restauracion.png"], descripcion: "Recuperación de archivos de discos dañados o formateados.", stock: 1, precio: 0 }
    ],
    sistemas: [
        { id: 301, nombre: "Sistema de Inventarios", imagenes: ["sistemas.png"], descripcion: "Control de stock, entradas y salidas para tu negocio.", stock: 1, precio: 0 },
        { id: 302, nombre: "Automatización con Excel/VBA", imagenes: ["sistemas.png"], descripcion: "Macros y hojas de cálculo avanzadas para optimizar procesos.", stock: 1, precio: 0 },
        { id: 303, nombre: "Base de Datos a Medida", imagenes: ["sistemas.png"], descripcion: "Diseño y administración de bases de datos personalizadas.", stock: 1, precio: 0 },
        { id: 304, nombre: "Integración de APIs", imagenes: ["sistemas.png"], descripcion: "Conexión entre diferentes servicios y plataformas software.", stock: 1, precio: 0 }
    ],
    mantenimiento: [
        { id: 401, nombre: "Optimización de Rendimiento", imagenes: ["restauracion.png"], descripcion: "Acelera tu computadora lenta y elimina archivos basura.", stock: 1, precio: 0 },
        { id: 402, nombre: "Limpieza de Virus/Malware", imagenes: ["restauracion.png"], descripcion: "Escaneo profundo y eliminación de amenazas de seguridad.", stock: 1, precio: 0 },
        { id: 403, nombre: "Actualización de Drivers", imagenes: ["restauracion.png"], descripcion: "Instalación de los últimos controladores para tu hardware.", stock: 1, precio: 0 },
        { id: 404, nombre: "Configuración de Redes", imagenes: ["restauracion.png"], descripcion: "Optimización de conexión WiFi y configuración de routers.", stock: 1, precio: 0 }
    ]
};

const PRODUCTOS = Object.values(DATA).flat().filter(item => Number.isInteger(item.id));

function cargarCarrito() {
    try {
        const guardado = JSON.parse(localStorage.getItem(CONFIG.cartKey) || '[]');
        if (!Array.isArray(guardado)) return [];

        return guardado.reduce((carrito, item) => {
            if (!item || typeof item !== 'object') return carrito;
            const producto = PRODUCTOS.find(producto => producto.id === item.id);
            const cantidad = Number(item.cantidad);
            if (producto && Number.isInteger(cantidad) && cantidad > 0) {
                carrito.push({ ...producto, cantidad });
            }
            return carrito;
        }, []);
    } catch {
        return null;
    }
}

// Estado Global
const estado = { carrito: cargarCarrito() || [], productoActual: null, indiceFoto: 0 };

// Selectores DOM cacheados (lazy getters para evitar errores si no existen)
const $ = (id) => document.getElementById(id);
const nodos = {
    get catalogo() { return $("catalogo"); },
    get visor() { return $("visor"); },
    get visorImg() { return $("visor-img"); },
    get visorMiniaturas() { return $("visor-miniaturas"); },
    get visorDescripcion() { return $("visor-descripcion"); },
    get visorStock() { return $("visor-stock"); },
    get carritoContador() { return $("carrito-contador"); },
    get carritoPanel() { return $("carrito"); },
    get carritoItems() { return $("carrito-items"); },
    get carritoTotal() { return $("carrito-total"); },
    get btnAgregar() { return $("btn-agregar-carrito-float"); }
};

// ===============================
//   FUNCIONES AUXILIARES
// ===============================
function formatPrecio(precio) {
    return precio === 0 ? "Consulta personalizada a través de WhatsApp" : currency.format(precio);
}

function obtenerDatosPorPagina() {
    const path = window.location.pathname;
    if (path.includes('desarrollo-web.html')) return DATA.web;
    if (path.includes('soporte-reparacion.html')) return DATA.soporte;
    if (path.includes('sistemas-automatizacion.html')) return DATA.sistemas;
    if (path.includes('mantenimiento-optimizacion.html')) return DATA.mantenimiento;

    // Si es inicio o cualquier otra cosa
    const esInicio = path.endsWith('index.html') || path.endsWith('/') || path === '';
    return esInicio ? 'CATEGORIAS' : DATA.web;
}

// ===============================
//   RENDERIZADO DE CATÁLOGO
// ===============================
function renderCatalogo() {
    if (!nodos.catalogo) return;

    const datos = obtenerDatosPorPagina();

    // Renderizado de Categorías (Inicio)
    if (datos === 'CATEGORIAS') {
        nodos.catalogo.innerHTML = DATA.categorias.map(cat => `
            <a class="card card-categoria" href="${cat.link}">
                <img src="img/${cat.imagen}" class="thumbnail" alt="${cat.nombre}" loading="lazy">
                <h3>${cat.nombre}</h3>
            </a>
        `).join('');
        return;
    }

    // Renderizado de Servicios (Páginas interiores)
    estado.datosActuales = datos;
    nodos.catalogo.innerHTML = datos.map(p => `
        <article class="card">
            <button class="thumbnail-button" type="button" data-producto="${p.id}" aria-label="Ver detalles de ${p.nombre}">
                <img src="img/${p.imagenes[0]}" class="thumbnail" alt="" loading="lazy">
            </button>
            <h3>${p.nombre}</h3>
            <strong class="precio-card">${formatPrecio(p.precio)}</strong>
            <button class="btn btn-full" type="button" data-producto="${p.id}" aria-label="Ver detalles de ${p.nombre}">Ver detalles</button>
        </article>
    `).join('');
}

// ===============================
//   VISOR (MODAL PRODUCTO)
// ===============================
function abrirVisorContexto(id) {
    if (!nodos.visor) return;
    const p = estado.datosActuales.find(item => item.id === id);
    if (!p) return;

    estado.productoActual = p;
    estado.indiceFoto = 0;

    nodos.visorDescripcion.textContent = p.descripcion;
    nodos.visorStock.textContent = p.stock > 0 ? "Disponible" : "Agotado";
    nodos.visorMiniaturas.innerHTML = p.imagenes.map((img, i) => `
        <button class="mini-click ${i === 0 ? 'active' : ''}" type="button" data-foto="${i}" aria-label="Mostrar imagen ${i + 1}">
            <img src="img/${img}" alt="">
        </button>
    `).join('');

    actualizarFotoVisor();
    nodos.visor.classList.remove("oculto");
    document.body.style.overflow = 'hidden'; // Evitar scroll
}

function cambiarFoto(i) {
    estado.indiceFoto = i;
    actualizarFotoVisor();
}

function actualizarFotoVisor() {
    if (!estado.productoActual) return;
    nodos.visorImg.src = `img/${estado.productoActual.imagenes[estado.indiceFoto]}`;
    nodos.visorMiniaturas.querySelectorAll('.mini-click').forEach((button, i) => {
        button.classList.toggle('active', i === estado.indiceFoto);
    });
}

function cerrarVisor() {
    if (nodos.visor) {
        nodos.visor.classList.add("oculto");
        document.body.style.overflow = '';
    }
}

// ===============================
//   CARRITO DE COMPRAS
// ===============================
function actualizarCarrito() {
    if (!nodos.carritoItems) return;

    try {
        localStorage.setItem(CONFIG.cartKey, JSON.stringify(estado.carrito));
    } catch {
        // El carrito sigue funcionando durante la sesión si el almacenamiento está bloqueado.
    }

    if (estado.carrito.length === 0) {
        nodos.carritoItems.innerHTML = `<p class="carrito-vacio">Tu carrito está vacío</p>`;
    } else {
        nodos.carritoItems.innerHTML = estado.carrito.map(p => `
            <div class="carrito-item" data-id="${p.id}">
                <div class="item-info">
                    <span class="item-nombre">${p.nombre}</span>
                    <span class="item-precio">${p.precio === 0 ? 'Cotización' : currency.format(p.precio * p.cantidad)}</span>
                </div>
                <div class="item-controles">
                    <button class="btn-qty" data-accion="restar" aria-label="Disminuir cantidad">-</button>
                    <span class="qty-num">${p.cantidad}</span>
                    <button class="btn-qty" data-accion="sumar" aria-label="Aumentar cantidad">+</button>
                </div>
            </div>
        `).join('');
    }

    const total = estado.carrito.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);
    const totalItems = estado.carrito.reduce((acc, p) => acc + p.cantidad, 0);

    if (nodos.carritoTotal) {
        nodos.carritoTotal.textContent = total === 0 && totalItems > 0 ? 'Cotización' : currency.format(total);
    }
    if (nodos.carritoContador) nodos.carritoContador.textContent = totalItems;
}

// ===============================
//   EVENT LISTENERS & INIT
// ===============================
document.addEventListener('DOMContentLoaded', () => {
    const headerTop = document.querySelector('.header-top');
    const headerMenuToggle = headerTop?.querySelector('.menu-toggle');
    if (headerTop && !$('theme-toggle')) {
        const button = document.createElement('button');
        button.type = 'button';
        button.id = 'theme-toggle';
        button.className = 'theme-toggle';
        button.innerHTML = `
            <svg class="theme-icon theme-icon-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3.5"></circle><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"></path></svg>
            <span class="theme-switch" aria-hidden="true"><span class="theme-switch-knob"></span></span>
            <svg class="theme-icon theme-icon-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.2 15.4A8.6 8.6 0 0 1 8.6 3.8 8.7 8.7 0 1 0 20.2 15.4Z"></path></svg>
        `;
        headerTop.insertBefore(button, headerMenuToggle);
    }

    const themeToggle = $('theme-toggle');
    if (themeToggle) {
        const updateThemeToggle = () => {
            const isDark = document.documentElement.dataset.theme === 'dark';
            const label = isDark ? 'Cambiar a modo día' : 'Cambiar a modo oscuro';
            themeToggle.setAttribute('aria-pressed', String(isDark));
            themeToggle.setAttribute('aria-label', label);
            themeToggle.title = label;
        };

        updateThemeToggle();
        themeToggle.addEventListener('click', () => {
            const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
            document.documentElement.dataset.theme = nextTheme;
            try {
                localStorage.setItem(CONFIG.themeKey, nextTheme);
            } catch { }
            updateThemeToggle();
        });
    }

    // ==========================================
    //   MODO MANTENIMIENTO
    // ==========================================
    if (!CONFIG.SITE_ACTIVE) {
        // Ocultar todo el contenido de la página
        document.querySelectorAll('header, main, aside, .report-problem-btn').forEach(el => {
            el.style.display = 'none';
        });

        // Asegurar que el fondo LetterGlitch esté visible en todas las páginas
        let glitchContainer = document.getElementById('glitch-canvas-container');
        if (!glitchContainer) {
            glitchContainer = document.createElement('div');
            glitchContainer.id = 'glitch-canvas-container';
            glitchContainer.className = 'glitch-container';
            glitchContainer.setAttribute('aria-hidden', 'true');
            document.body.prepend(glitchContainer);
        }
        initLetterGlitch();

        // Crear overlay de mantenimiento
        const maintenanceOverlay = document.createElement('div');
        maintenanceOverlay.id = 'maintenance-overlay';
        maintenanceOverlay.innerHTML = `
            <div class="maintenance-content">
                <div class="maintenance-icon">⚙️</div>
                <h1 class="maintenance-title">Estamos trabajando en ello :)</h1>
            </div>
            <style>
                #maintenance-overlay {
                    position: fixed;
                    inset: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 50;
                    pointer-events: none;
                }
                .maintenance-content {
                    text-align: center;
                    animation: fadeInMaint 1s ease forwards;
                }
                .maintenance-icon {
                    font-size: 5rem;
                    margin-bottom: 1.5rem;
                    animation: spinGear 4s linear infinite;
                    display: inline-block;
                }
                .maintenance-title {
                    font-family: 'Montserrat', sans-serif;
                    font-size: clamp(2rem, 6vw, 4rem);
                    font-weight: 700;
                    color: #fff;
                    text-shadow: 0 0 30px rgba(78, 201, 255, 0.6), 0 0 60px rgba(78, 201, 255, 0.3);
                    letter-spacing: 2px;
                    margin: 0;
                    padding: 0 1.5rem;
                    line-height: 1.3;
                }
                @keyframes fadeInMaint {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes spinGear {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            </style>
        `;
        document.body.appendChild(maintenanceOverlay);

        return; // No ejecutar nada más
    }

    renderCatalogo();
    actualizarCarrito();

    window.addEventListener('storage', (event) => {
        if (event.key !== CONFIG.cartKey) return;
        const carritoGuardado = cargarCarrito();
        if (!carritoGuardado) return;
        estado.carrito = carritoGuardado;
        actualizarCarrito();
    });

    window.addEventListener('pageshow', (event) => {
        if (!event.persisted) return;
        const carritoGuardado = cargarCarrito();
        if (!carritoGuardado) return;
        estado.carrito = carritoGuardado;
        actualizarCarrito();
    });

    if (nodos.catalogo) {
        nodos.catalogo.addEventListener('click', (event) => {
            const trigger = event.target.closest('[data-producto]');
            if (trigger) abrirVisorContexto(Number.parseInt(trigger.dataset.producto, 10));
        });
    }

    if (nodos.visorMiniaturas) {
        nodos.visorMiniaturas.addEventListener('click', (event) => {
            const trigger = event.target.closest('[data-foto]');
            if (trigger) cambiarFoto(Number.parseInt(trigger.dataset.foto, 10));
        });
    }

    // Eventos Navbar Móvil
    const menuToggle = document.querySelector('.menu-toggle');
    const closeMenu = document.querySelector('.close-menu');
    const navPrincipal = document.querySelector('.nav-principal');

    if (menuToggle && navPrincipal) {
        menuToggle.addEventListener('click', () => navPrincipal.classList.add('open'));
    }
    if (closeMenu && navPrincipal) {
        closeMenu.addEventListener('click', () => navPrincipal.classList.remove('open'));
    }

    // Cerrar menú al hacer click fuera
    document.addEventListener('click', (e) => {
        if (navPrincipal && navPrincipal.classList.contains('open') &&
            !navPrincipal.contains(e.target) && (!menuToggle || !menuToggle.contains(e.target))) {
            navPrincipal.classList.remove('open');
        }
    });

    // Eventos Carrito
    if ($("carrito-btn")) $("carrito-btn").onclick = () => nodos.carritoPanel.classList.toggle("oculto");
    if ($("carrito-cerrar")) $("carrito-cerrar").onclick = () => nodos.carritoPanel.classList.add("oculto");

    if (nodos.carritoItems) {
        nodos.carritoItems.addEventListener("click", (e) => {
            const btn = e.target.closest(".btn-qty");
            if (!btn) return;
            const id = parseInt(e.target.closest(".carrito-item").dataset.id);
            const accion = btn.dataset.accion;
            const index = estado.carrito.findIndex(p => p.id === id);

            if (index === -1) return;

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

    if ($("carrito-comprar")) {
        $("carrito-comprar").onclick = () => {
            const carritoGuardado = cargarCarrito();
            if (carritoGuardado) estado.carrito = carritoGuardado;
            actualizarCarrito();
            if (estado.carrito.length === 0) return alert("El carrito está vacío");
            let msg = "Hola STV, me interesa lo siguiente:\n\n";
            estado.carrito.forEach(p => msg += `- ${p.nombre} (x${p.cantidad})\n`);
            window.open(`${CONFIG.whatsappBase}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
        };
    }

    // Eventos Visor
    if ($("visor-cerrar")) $("visor-cerrar").onclick = cerrarVisor;
    if ($("visor-prev")) $("visor-prev").onclick = () => {
        const total = estado.productoActual.imagenes.length;
        estado.indiceFoto = (estado.indiceFoto - 1 + total) % total;
        actualizarFotoVisor();
    };
    if ($("visor-next")) $("visor-next").onclick = () => {
        const total = estado.productoActual.imagenes.length;
        estado.indiceFoto = (estado.indiceFoto + 1) % total;
        actualizarFotoVisor();
    };

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

});

// ==========================================
//   LETTERGLITCH (JS PURO)
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
        letters = Array.from({ length: total }, () => ({
            char: config.characters[Math.floor(Math.random() * config.characters.length)],
            color: config.glitchColors[Math.floor(Math.random() * config.glitchColors.length)],
            targetColor: config.glitchColors[Math.floor(Math.random() * config.glitchColors.length)],
            colorProgress: 1
        }));
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
                const startRgb = hexToRgb(letter.color.startsWith('rgb') ? '#61dca3' : letter.color);
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
