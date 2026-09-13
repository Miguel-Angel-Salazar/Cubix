const productos = [
    {
        nombre: "Cubo 2x2",
        categoria: "cubos",
        descripcion: "Cubo pequeño ideal para comenzar."
    },
    {
        nombre: "Cubo 3x3",
        categoria: "cubos",
        descripcion: "El cubo clásico para aprender y practicar."
    },
    {
        nombre: "Cubo 4x4",
        categoria: "cubos",
        descripcion: "Una opción para quienes buscan un reto mayor."
    },
    {
        nombre: "Pyraminx",
        categoria: "puzzles",
        descripcion: "Puzzle con forma de pirámide para variar la experiencia."
    },
    {
        nombre: "Megaminx",
        categoria: "puzzles",
        descripcion: "Un puzzle con muchas caras para aumentar el reto."
    },
    {
        nombre: "Lubricante para cubos",
        categoria: "accesorios",
        descripcion: "Ayuda a mejorar el movimiento de los cubos."
    }
];

const catalogo = document.getElementById("catalogo-productos");

function mostrarProductos(listaProductos) {

    if (!catalogo) {
        return;
    }

    catalogo.innerHTML = "";

    listaProductos.forEach(function(producto) {

        const tarjeta = document.createElement("article");

        tarjeta.classList.add("tarjeta");

        tarjeta.innerHTML = `
            <h3>${producto.nombre}</h3>
            <p>${producto.descripcion}</p>
            <p><strong>Categoría:</strong> ${producto.categoria}</p>
        `;

        catalogo.appendChild(tarjeta);
    });
}

mostrarProductos(productos);

const filtroCategoria = document.getElementById("categoria");

if (filtroCategoria) {

    filtroCategoria.addEventListener("change", function() {

        const categoriaSeleccionada = filtroCategoria.value;

        if (categoriaSeleccionada === "todos") {

            mostrarProductos(productos);

        } else {

            const productosFiltrados = productos.filter(function(producto) {
                return producto.categoria === categoriaSeleccionada;
            });

            mostrarProductos(productosFiltrados);
        }
    });
}


const formulario = document.getElementById("formulario-contacto");

if (formulario) {

    formulario.addEventListener("submit", function(evento) {

        evento.preventDefault();

        const nombre = document.getElementById("nombre");
        const correo = document.getElementById("correo");
        const mensaje = document.getElementById("mensaje");

        const errorNombre = document.getElementById("error-nombre");
        const errorCorreo = document.getElementById("error-correo");
        const errorMensaje = document.getElementById("error-mensaje");
        const mensajeExito = document.getElementById("mensaje-exito");

        errorNombre.textContent = "";
        errorCorreo.textContent = "";
        errorMensaje.textContent = "";
        mensajeExito.textContent = "";

        let formularioValido = true;

        if (nombre.value.trim() === "") {
            errorNombre.textContent = "El nombre es obligatorio.";
            formularioValido = false;
        }

        if (correo.value.trim() === "") {
            errorCorreo.textContent = "El correo es obligatorio.";
            formularioValido = false;
        } else if (!correo.value.includes("@")) {
            errorCorreo.textContent = "Ingresa un correo válido.";
            formularioValido = false;
        }

        if (mensaje.value.trim() === "") {
            errorMensaje.textContent = "El mensaje es obligatorio.";
            formularioValido = false;
        } else if (mensaje.value.trim().length < 10) {
            errorMensaje.textContent = "El mensaje debe tener mínimo 10 caracteres.";
            formularioValido = false;
        }

        if (formularioValido) {

            mensajeExito.textContent = "Mensaje enviado correctamente.";

            formulario.reset();
        }
    });
}

