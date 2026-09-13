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
