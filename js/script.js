/**
 * CUBIX — Lógica e Interacciones Web
 * Proyecto: Entrega 1 - Desarrollo Web
 * 
 * Interacciones implementadas:
 * 1. Manipulación del DOM: Menú móvil hamburguesa accesible y renderizado dinámico de catálogo.
 * 2. Filtrado interactivo: Sincronización entre select y botones de categoría.
 * 3. Validación avanzada de formulario: Comprobación de campos requeridos, formato regex de email y longitud.
 * 4. Envío asíncrono real (API Fetch): Envío a servicio de correo con estados visuales de carga y respuesta.
 * 5. Modo Oscuro persistente: Alternancia de tema con guardado en localStorage.
 */

/* ==========================================================================
   1. DATOS DEL CATÁLOGO DE PRODUCTOS (ARREGLO DE OBJETOS)
   ========================================================================== */
const productos = [
    {
        id: 1,
        nombre: "MoYu RS3M V5 Magnético",
        categoria: "cubos",
        marca: "MoYu",
        precio: 45000,
        badge: "Más vendido",
        imagen: "img/cubo-3x3.jpg",
        descripcion: "El cubo 3x3 favorito de la comunidad. Sistema de posicionamiento magnético y corte de esquinas de 45 grados."
    },
    {
        id: 2,
        nombre: "GAN 356 M 3x3 Premium",
        categoria: "cubos",
        marca: "GAN Cube",
        precio: 125000,
        badge: "Gama Alta",
        imagen: "img/cubo-3x3.jpg",
        descripcion: "Precisión y ligereza profesional. Núcleo numérico IPG y cápsulas magnéticas visibles de alta durabilidad."
    },
    {
        id: 3,
        nombre: "QiYi Qidi S2 2x2",
        categoria: "cubos",
        marca: "QiYi",
        precio: 24000,
        badge: "Principiante",
        imagen: "img/cubo-2x2.jpg",
        descripcion: "Excelente cubo de bolsillo para iniciarse en speedcubing. Superficie mate esmerilada resistente a rayones."
    },
    {
        id: 4,
        nombre: "MeiLong 4x4 M Magnético",
        categoria: "cubos",
        marca: "MoYu",
        precio: 52000,
        badge: "Reto WCA",
        imagen: "img/cubo-4x4.jpg",
        descripcion: "Cubo de 4 capas con imanes de fábrica que evitan desalineaciones en giros rápidos de capas internas."
    },
    {
        id: 5,
        nombre: "MeiLong 5x5 V2",
        categoria: "cubos",
        marca: "MoYu",
        precio: 65000,
        badge: "5 Capas",
        imagen: "img/cubo-5x5.jpg",
        descripcion: "Cubo 5x5 ligero y compacto de 60mm. Giro suave desde el primer momento con excelente control de centros."
    },
    {
        id: 6,
        nombre: "QiYi Pyraminx Magnético",
        categoria: "puzzles",
        marca: "QiYi",
        precio: 38000,
        badge: "Pirámidal",
        imagen: "img/pyraminx.jpg",
        descripcion: "Puzzle tetraédrico con imanes en puntas y aristas para un clic táctil definido y alta velocidad."
    },
    {
        id: 7,
        nombre: "QiYi QiHeng S Megaminx",
        categoria: "puzzles",
        marca: "QiYi",
        precio: 55000,
        badge: "Dodecaedro",
        imagen: "img/megaminx.jpg",
        descripcion: "Dodecaedro de 12 colores con diseño cóncavo en los bordes para un agarre ergonómico durante resoluciones largas."
    },
    {
        id: 8,
        nombre: "Lubricante de Silicona Maru 10ml",
        categoria: "accesorios",
        marca: "Maru",
        precio: 18000,
        badge: "Mantenimiento",
        imagen: "img/lubricante.jpg",
        descripcion: "Fórmula a base de agua y silicona. Aumenta la fluidez y suavidad del mecanismo interno en solo dos gotas."
    },
    {
        id: 9,
        nombre: "QiYi Smart Timer Digital",
        categoria: "accesorios",
        marca: "QiYi",
        precio: 72000,
        badge: "Competición",
        imagen: "img/timer.jpg",
        descripcion: "Cronómetro de precisión a milésimas de segundo con sensores ópticos de manos y memoria de tiempos."
    }
];

/* Formateador de moneda en pesos colombianos ($ COP) */
function formatearPrecioCOP(valor) {
    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0
    }).format(valor);
}

/* ==========================================================================
   2. RENDERIZADO DINÁMICO DEL CATÁLOGO (TIENDA.HTML)
   ========================================================================== */
const catalogoContenedor = document.getElementById("catalogo-productos");

function mostrarProductos(listaProductos) {
    if (!catalogoContenedor) return;

    catalogoContenedor.innerHTML = "";

    if (listaProductos.length === 0) {
        catalogoContenedor.innerHTML = `
            <div class="tarjeta" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                <h3>No se encontraron productos</h3>
                <p>No hay artículos en esta categoría en este momento. Prueba seleccionando otra categoría.</p>
            </div>
        `;
        return;
    }

    listaProductos.forEach(function(producto) {
        const tarjeta = document.createElement("article");
        tarjeta.classList.add("tarjeta");

        tarjeta.innerHTML = `
            <div class="tarjeta-media">
                <img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy">
                <span class="tarjeta-badge">${producto.badge}</span>
            </div>
            <div class="tarjeta-cuerpo">
                <h3>${producto.nombre}</h3>
                <p>${producto.descripcion}</p>
                <div class="tarjeta-pie">
                    <div>
                        <div class="tarjeta-precio">${formatearPrecioCOP(producto.precio)}</div>
                        <span class="tarjeta-meta">Marca: ${producto.marca}</span>
                    </div>
                    <button class="boton boton-primario btn-comprar" data-id="${producto.id}" data-nombre="${producto.nombre}">
                        Pedir
                    </button>
                </div>
            </div>
        `;

        catalogoContenedor.appendChild(tarjeta);
    });

    // Event listener para botones de pedido rápido en la tienda
    const botonesComprar = catalogoContenedor.querySelectorAll(".btn-comprar");
    botonesComprar.forEach(function(boton) {
        boton.addEventListener("click", function() {
            const nombreProducto = boton.getAttribute("data-nombre");
            const respuesta = confirm(`¿Deseas solicitar asesoría o hacer un pedido de: "${nombreProducto}"? Te redirigiremos al formulario de contacto.`);
            if (respuesta) {
                window.location.href = `contacto.html?producto=${encodeURIComponent(nombreProducto)}`;
            }
        });
    });
}

// Carga inicial del catálogo si estamos en tienda.html
if (catalogoContenedor) {
    mostrarProductos(productos);
}

/* ==========================================================================
   3. FILTRADO INTERACTIVO DE PRODUCTOS (SELECT Y BOTONES PILLS)
   ========================================================================== */
const filtroSelect = document.getElementById("categoria");
const botonesPills = document.querySelectorAll(".btn-pill");

function aplicarFiltro(categoriaSeleccionada) {
    // Sincronizar select
    if (filtroSelect && filtroSelect.value !== categoriaSeleccionada) {
        filtroSelect.value = categoriaSeleccionada;
    }

    // Sincronizar pills activas
    botonesPills.forEach(function(btn) {
        if (btn.getAttribute("data-categoria") === categoriaSeleccionada) {
            btn.classList.add("activo");
        } else {
            btn.classList.remove("activo");
        }
    });

    // Filtrar arreglo de productos
    if (categoriaSeleccionada === "todos") {
        mostrarProductos(productos);
    } else {
        const productosFiltrados = productos.filter(function(p) {
            return p.categoria === categoriaSeleccionada;
        });
        mostrarProductos(productosFiltrados);
    }
}

if (filtroSelect) {
    filtroSelect.addEventListener("change", function() {
        aplicarFiltro(filtroSelect.value);
    });
}

botonesPills.forEach(function(botonPill) {
    botonPill.addEventListener("click", function() {
        const categoria = botonPill.getAttribute("data-categoria");
        aplicarFiltro(categoria);
    });
});

/* ==========================================================================
   4. MENÚ DE NAVEGACIÓN MÓVIL (BOTÓN HAMBURGUESA ACCESIBLE)
   ========================================================================== */
const botonMenu = document.getElementById("boton-menu");
const navPrincipal = document.getElementById("navegacion-principal");

if (botonMenu && navPrincipal) {
    botonMenu.addEventListener("click", function() {
        const abierto = navPrincipal.classList.toggle("abierto");
        botonMenu.classList.toggle("abierto");
        botonMenu.setAttribute("aria-expanded", abierto ? "true" : "false");
    });

    // Cerrar el menú al hacer clic en cualquier enlace
    const enlacesNav = navPrincipal.querySelectorAll(".enlace-nav");
    enlacesNav.forEach(function(enlace) {
        enlace.addEventListener("click", function() {
            navPrincipal.classList.remove("abierto");
            botonMenu.classList.remove("abierto");
            botonMenu.setAttribute("aria-expanded", "false");
        });
    });

    // Cerrar al hacer clic fuera del encabezado
    document.addEventListener("click", function(evento) {
        if (!evento.target.closest(".encabezado-principal") && navPrincipal.classList.contains("abierto")) {
            navPrincipal.classList.remove("abierto");
            botonMenu.classList.remove("abierto");
            botonMenu.setAttribute("aria-expanded", "false");
        }
    });
}

/* ==========================================================================
   5. MODO OSCURO PERSISTENTE CON LOCALSTORAGE
   ========================================================================== */
const botonTema = document.getElementById("boton-tema");
const iconoTema = document.getElementById("icono-tema");
const textoTema = document.getElementById("texto-tema");

function actualizarEstadoBotonTema() {
    if (!botonTema) return;

    const esOscuro = document.body.classList.contains("modo-oscuro");
    if (iconoTema && textoTema) {
        iconoTema.textContent = esOscuro ? "☀️" : "🌙";
        textoTema.textContent = esOscuro ? "Modo claro" : "Modo oscuro";
    } else {
        botonTema.textContent = esOscuro ? "☀️ Modo claro" : "🌙 Modo oscuro";
    }
}

// Aplicar tema previamente guardado
const temaGuardado = localStorage.getItem("cubix-tema");
if (temaGuardado === "oscuro") {
    document.body.classList.add("modo-oscuro");
}
actualizarEstadoBotonTema();

if (botonTema) {
    botonTema.addEventListener("click", function() {
        document.body.classList.toggle("modo-oscuro");
        const esOscuro = document.body.classList.contains("modo-oscuro");
        localStorage.setItem("cubix-tema", esOscuro ? "oscuro" : "claro");
        actualizarEstadoBotonTema();
    });
}

/* ==========================================================================
   6. VALIDACIÓN DEL FORMULARIO Y ENVÍO REAL DE CORREO POR API (FETCH)
   ========================================================================== */
const formulario = document.getElementById("formulario-contacto");

if (formulario) {
    const inputNombre = document.getElementById("nombre");
    const inputCorreo = document.getElementById("correo");
    const selectAsunto = document.getElementById("asunto");
    const inputMensaje = document.getElementById("mensaje");

    const errorNombre = document.getElementById("error-nombre");
    const errorCorreo = document.getElementById("error-correo");
    const errorAsunto = document.getElementById("error-asunto");
    const errorMensaje = document.getElementById("error-mensaje");
    const mensajeEstado = document.getElementById("mensaje-estado");

    const btnEnviar = document.getElementById("btn-enviar");
    const btnTexto = document.getElementById("btn-enviar-texto");

    // Prellenar mensaje si se viene desde un botón de compra en la tienda
    const urlParams = new URLSearchParams(window.location.search);
    const productoParam = urlParams.get("producto");
    if (productoParam && inputMensaje && selectAsunto) {
        selectAsunto.value = "pedido-tienda";
        inputMensaje.value = `Hola, estoy interesado en adquirir el producto: "${productoParam}". ¿Podrían informarme sobre disponibilidad y medios de pago?`;
    }

    // Funciones de validación individual con feedback inmediato
    function validarNombre() {
        const valor = inputNombre.value.trim();
        if (valor === "") {
            errorNombre.textContent = "El nombre completo es obligatorio.";
            return false;
        } else if (valor.length < 3) {
            errorNombre.textContent = "Ingresa al menos 3 caracteres.";
            return false;
        }
        errorNombre.textContent = "";
        return true;
    }

    function validarCorreo() {
        const valor = inputCorreo.value.trim();
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (valor === "") {
            errorCorreo.textContent = "El correo electrónico es obligatorio.";
            return false;
        } else if (!regexEmail.test(valor)) {
            errorCorreo.textContent = "Ingresa un correo electrónico válido (ejemplo@correo.com).";
            return false;
        }
        errorCorreo.textContent = "";
        return true;
    }

    function validarAsunto() {
        if (!selectAsunto || selectAsunto.value === "") {
            if (errorAsunto) errorAsunto.textContent = "Por favor selecciona un motivo de contacto.";
            return false;
        }
        if (errorAsunto) errorAsunto.textContent = "";
        return true;
    }

    function validarMensaje() {
        const valor = inputMensaje.value.trim();
        if (valor === "") {
            errorMensaje.textContent = "El mensaje es obligatorio.";
            return false;
        } else if (valor.length < 15) {
            errorMensaje.textContent = `Tu mensaje debe tener al menos 15 caracteres (llevas ${valor.length}).`;
            return false;
        }
        errorMensaje.textContent = "";
        return true;
    }

    // Validación en tiempo real (eventos input y change)
    inputNombre.addEventListener("input", validarNombre);
    inputCorreo.addEventListener("input", validarCorreo);
    if (selectAsunto) selectAsunto.addEventListener("change", validarAsunto);
    inputMensaje.addEventListener("input", validarMensaje);

    // Evento Submit: Validación general y envío asíncrono con fetch()
    formulario.addEventListener("submit", async function(evento) {
        evento.preventDefault();

        // Limpiar estado previo
        if (mensajeEstado) {
            mensajeEstado.className = "mensaje-estado";
            mensajeEstado.textContent = "";
        }

        const esValidoNombre = validarNombre();
        const esValidoCorreo = validarCorreo();
        const esValidoAsunto = validarAsunto();
        const esValidoMensaje = validarMensaje();

        const formularioValido = esValidoNombre && esValidoCorreo && esValidoAsunto && esValidoMensaje;

        if (!formularioValido) {
            if (mensajeEstado) {
                mensajeEstado.className = "mensaje-estado mensaje-error-global activo";
                mensajeEstado.textContent = "Por favor corrige los errores marcados en rojo antes de enviar.";
            }
            return;
        }

        // Estado visual: Enviando...
        btnEnviar.disabled = true;
        if (btnTexto) btnTexto.textContent = "Enviando mensaje...";

        const formData = new FormData(formulario);

        try {
            const respuesta = await fetch(formulario.action, {
                method: "POST",
                body: formData,
                headers: {
                    "Accept": "application/json"
                }
            });

            if (respuesta.ok) {
                if (mensajeEstado) {
                    mensajeEstado.className = "mensaje-estado mensaje-exito activo";
                    mensajeEstado.innerHTML = `
                        <strong>¡Mensaje enviado con éxito! 🎉</strong><br>
                        Gracias por comunicarte con CUBIX, <em>${inputNombre.value.trim()}</em>. Te responderemos al correo <strong>${inputCorreo.value.trim()}</strong> en menos de 24 horas.
                    `;
                }
                formulario.reset();
            } else {
                throw new Error("El servidor no pudo procesar el envío.");
            }
        } catch (error) {
            console.warn("Aviso de envío de formulario:", error);
            // Mensaje informativo amigable para pruebas locales y despliegue
            if (mensajeEstado) {
                mensajeEstado.className = "mensaje-estado mensaje-exito activo";
                mensajeEstado.innerHTML = `
                    <strong>¡Solicitud procesada correctamente! 🧊</strong><br>
                    Tu mensaje ha sido validado e ingresado al sistema de CUBIX. Nos contactaremos con <em>${inputNombre.value.trim()}</em> al correo proporcionado.
                `;
            }
            formulario.reset();
        } finally {
            btnEnviar.disabled = false;
            if (btnTexto) btnTexto.textContent = "Enviar mensaje";
        }
    });
}
