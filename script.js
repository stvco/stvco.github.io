// ===============================
//   CONFIGURACIÓN Y DATOS GLOBAL
// ===============================
const CONFIG = {
    whatsappBase: "https://wa.me/524776755956",
    betaKey: 'stv_beta_notice_accepted'
};

const currency = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' });

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
        { id: 104, nombre: "prueba 4", imagenes: ["prueba.png"], descripcion: "prueba para cuerto slot de producto.", stock: 1, precio: 0 }
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

// Estado Global
const estado = { carrito: [], productoActual: null, indiceFoto: 0 };
window.datosActuales = []; // Referencia global para el visor

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
            <article class="card card-categoria" onclick="window.location.href='${cat.link}'">
                <img src="img/${cat.imagen}" class="thumbnail" alt="${cat.nombre}" loading="lazy">
                <h3>${cat.nombre}</h3>
            </article>
        `).join('');
        return;
    }

    // Renderizado de Servicios (Páginas interiores)
    window.datosActuales = datos;
    nodos.catalogo.innerHTML = datos.map(p => `
        <article class="card">
            <img src="img/${p.imagenes[0]}" class="thumbnail" onclick="abrirVisorContexto(${p.id})" alt="${p.nombre}" loading="lazy">
            <h3>${p.nombre}</h3>
            <strong class="precio-card">${formatPrecio(p.precio)}</strong>
            <button class="btn btn-full" onclick="abrirVisorContexto(${p.id})" aria-label="Ver detalles de ${p.nombre}">Ver detalles</button>
        </article>
    `).join('');
}

// ===============================
//   VISOR (MODAL PRODUCTO)
// ===============================
function abrirVisorContexto(id) {
    if (!nodos.visor) return;
    const p = window.datosActuales.find(item => item.id === id);
    if (!p) return;

    estado.productoActual = p;
    estado.indiceFoto = 0;

    nodos.visorDescripcion.textContent = p.descripcion;
    nodos.visorStock.textContent = p.stock > 0 ? "Disponible" : "Agotado";
    nodos.visorMiniaturas.innerHTML = p.imagenes.map((img, i) => `
        <img src="img/${img}" class="mini-click ${i === 0 ? 'active' : ''}" onclick="cambiarFoto(${i})" alt="Miniatura ${i + 1}">
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
    document.querySelectorAll('.mini-click').forEach((img, i) => {
        img.classList.toggle('active', i === estado.indiceFoto);
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
                    <button class="btn-qty" data-accion="restar" aria-label="Disminuir cantidad">-</button>
                    <span class="qty-num">${p.cantidad}</span>
                    <button class="btn-qty" data-accion="sumar" aria-label="Aumentar cantidad">+</button>
                </div>
            </div>
        `).join('');
    }

    const total = estado.carrito.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);
    const totalItems = estado.carrito.reduce((acc, p) => acc + p.cantidad, 0);

    if (nodos.carritoTotal) nodos.carritoTotal.textContent = currency.format(total);
    if (nodos.carritoContador) nodos.carritoContador.textContent = totalItems;
}

// ===============================
//   EVENT LISTENERS & INIT
// ===============================
document.addEventListener('DOMContentLoaded', () => {
    renderCatalogo();
    actualizarCarrito();

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
            !navPrincipal.contains(e.target) && !menuToggle.contains(e.target)) {
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
            if (estado.carrito.length === 0) return alert("El carrito está vacío");
            let msg = "Hola STV, me interesa lo siguiente:\n\n";
            estado.carrito.forEach(p => msg += `- ${p.nombre} (x${p.cantidad})\n`);
            window.open(`${CONFIG.whatsappBase}?text=${encodeURIComponent(msg)}`, "_blank");
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

    // ==========================================
    //   INIT: NOTIFICACIÓN FASE BETA (Modal)
    // ==========================================
    const esInicio = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/') || window.location.pathname === '';

    if (esInicio) {
        // Init LetterGlitch
        initLetterGlitch();

        // Init Beta Notice
        if (!sessionStorage.getItem(CONFIG.betaKey)) {
            const modalHTML = `
                <div id="modal-advertencia" class="modal-overlay">
                    <div class="modal-content">
                        <h2 class="modal-title">FASE BETA</h2>
                        <p class="modal-message">
                            Este sitio web está actualmente en desarrollo. Si encuentra algún error o fallo, por favor, infórmelo al desarrollador.
                        </p>
                        <button id="btn-aceptar-beta" class="btn-beta">Aceptar</button>
                    </div>
                    <style>
                        .modal-overlay {
                            position: fixed; inset: 0; background: var(--bg-overlay, rgba(0, 0, 0, 0.9));
                            backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
                            display: flex; justify-content: center; align-items: center;
                            z-index: 9999; padding: 20px; animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                        }
                        .modal-content {
                            background: rgba(24, 24, 24, 0.85); border: 1px solid var(--primary, #4ec9ff);
                            box-shadow: 0 0 40px rgba(78, 201, 255, 0.15); padding: 40px 30px;
                            border-radius: 1.5rem; max-width: 480px; width: 100%; text-align: center;
                            color: #e8e8e8; font-family: 'Montserrat', sans-serif;
                            transform: translateY(0); animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                            position: relative;
                        }
                        .modal-title {
                            color: var(--primary, #4ec9ff); text-transform: uppercase;
                            font-size: 1.8rem; margin: 0 0 15px 0; letter-spacing: 2px; font-weight: 700;
                        }
                        .modal-message { font-size: 1rem; line-height: 1.6; margin-bottom: 30px; color: #ccc; }
                        .btn-beta {
                            background: var(--accent, #92ff4e); color: #000; border: none; padding: 14px 40px;
                            border-radius: 0.75rem; font-weight: 800; font-size: 1rem; cursor: pointer;
                            text-transform: uppercase; transition: transform 0.2s ease, box-shadow 0.2s ease;
                            letter-spacing: 1px;
                        }
                        .btn-beta:hover {
                            transform: scale(1.05); box-shadow: 0 0 20px rgba(146, 255, 78, 0.4); background: #3fb9ed;
                        }
                        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                        @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                    </style>
                </div>
            `;

            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = modalHTML;
            document.body.appendChild(tempDiv);

            const modal = document.getElementById('modal-advertencia');
            const btnAceptar = document.getElementById('btn-aceptar-beta');

            if (btnAceptar && modal) {
                btnAceptar.addEventListener('click', () => {
                    modal.style.transition = "opacity 0.3s ease";
                    modal.style.opacity = "0";
                    setTimeout(() => tempDiv.remove(), 300);
                    sessionStorage.setItem(CONFIG.betaKey, "true");
                });
            }
        }
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
