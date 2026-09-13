# CUBIX — El Mundo del Cubo de Rubik

Sitio web dedicado al universo del cubo de Rubik, speedcubing, puzzles mecánicos, métodos de resolución y tienda de productos, desarrollado con **HTML5 semántico, CSS3 moderno y JavaScript puro** (sin frameworks ni librerías externas) para el curso de **Desarrollo Web (Semestre 2026-2)**.

---

## 🌐 Enlace del Proyecto Desplegado

- **URL en Vercel:** [https://cubix-project.vercel.app](https://cubix-project.vercel.app) *(actualizar con tu URL final de Vercel)*
- **Repositorio en GitHub:** [https://github.com/Miguel-Angel-Salazar/Cubix](https://github.com/Miguel-Angel-Salazar/Cubix)

---

## 📖 Descripción del Proyecto

### ¿Qué es?
**CUBIX** es una plataforma web informativa y comercial centrada en el mundo del cubo de Rubik y el speedcubing (resolución a máxima velocidad). Incluye una guía completa de los diferentes tipos de cubos oficiales de la WCA, métodos paso a paso para aprender o mejorar tiempos, artículos de blog con la historia del puzzle y consejos prácticos, una tienda con catálogo interactivo y un formulario de contacto funcional.

### ¿Para quién es?
Está pensado para dos tipos de usuarios:
1. **Principiantes o curiosos:** Personas que tienen un cubo desarmado en casa o quieren aprender a resolverlo por primera vez sin frustrarse.
2. **Aficionados y speedcubers:** Practicantes que buscan memorizar algoritmos de métodos avanzados (CFOP, Roux, ZZ), entender la notación oficial y adquirir cubos magnéticos de velocidad, lubricantes y cronómetros de competencia.

### ¿Qué problema resuelve?
Muchas veces la información sobre cubos de Rubik está fragmentada en foros en inglés, videos largos o tiendas con catálogos confusos. CUBIX centraliza en un solo lugar guías claras, diagramas visuales de notación y un catálogo con precios reales adaptados al mercado colombiano ($ COP).

---

## 📂 Estructura del Sitio

El proyecto cuenta con 6 páginas independientes conectadas entre sí:

| Archivo | Contenido principal |
|---|---|
| `index.html` | Página de bienvenida con presentación, accesos rápidos y resumen de secciones. |
| `cubos.html` | Guía de tipos de puzzles: 2x2, 3x3, 4x4, 5x5, Pyraminx y Megaminx. |
| `metodos.html` | Explicación de métodos de resolución: Principiante, CFOP (Fridrich), Roux y ZZ con diagramas SVG. |
| `blog.html` | Artículos sobre la historia de Ernő Rubik, torneos WCA, consejos para principiantes y tips para bajar tiempos. |
| `tienda.html` | Catálogo de cubos, puzzles y accesorios renderizado dinámicamente con JavaScript y filtro interactivo. |
| `contacto.html` | Formulario de contacto y asesoría con validación en tiempo real y envío funcional. |
| `css/styles.css` | Hoja de estilos externa con variables CSS, diseño responsive, Flexbox, Grid y modo oscuro. |
| `js/script.js` | Lógica de la aplicación: catálogo dinámico, filtro por categoría, menú móvil, modo oscuro con `localStorage` y validación de formulario. |
| `img/` | Carpeta local con imágenes fotográficas de cubos, retratos históricos, accesorios y diagramas SVG de notación. |

---

## 🛠️ Decisiones Técnicas

### 1. ¿Dónde usé Flexbox y dónde Grid, y por qué en cada caso?

- **Flexbox (unidimensional):** Lo utilicé en todos los componentes donde necesitaba alinear elementos a lo largo de una sola dirección (fila o columna):
  - **Encabezado (`header`):** Para alinear horizontalmente el logo, los enlaces de navegación y el botón de tema, repartiendo el espacio con `justify-content: space-between` y `align-items: center`.
  - **Menú de navegación (`nav ul`):** Para ordenar los enlaces con separación constante (`gap`) y poder reorganizarlos en columna en pantallas de celular.
  - **Filtro de la tienda (`.filtro`):** Para centrar el `<label>` y el `<select>` de forma prolija.
  - **Estructura interna de las tarjetas (`.tarjeta`):** Uso Flexbox en columna (`flex-direction: column`) y en el pie de tarjeta (`.tarjeta-pie`) aplico `margin-top: auto` para que el precio y los datos siempre queden pegados al fondo de la tarjeta, sin importar la cantidad de texto de la descripción.
  - **Formulario (`.formulario`):** Para apilar verticalmente los campos, etiquetas y botones con espaciado uniforme.

- **Grid (bidimensional):** Lo utilicé en las áreas donde el contenido se organiza en cuadrícula de filas y columnas:
  - **Catálogo de productos (`.catalogo`) y tarjetas (`.tarjetas-info`):** Permite crear una cuadrícula limpia de 3 columnas en escritorio (`repeat(3, 1fr)`), que se ajusta fluidamente a 2 columnas en tabletas (`max-width: 1024px`) y a 1 columna en móviles (`max-width: 768px`) sin recurrir a cálculos manuales de márgenes o flotados.

### 2. ¿Qué hace el JavaScript y cómo funciona la validación?

El archivo `script.js` maneja 5 funcionalidades interactivas:
1. **Catálogo generado desde JavaScript:** En lugar de escribir el HTML de cada producto a mano, los datos están en un arreglo de objetos (`productos`). Una función llamada `mostrarProductos()` recorre el arreglo con `.forEach()` y crea dinámicamente las tarjetas con `document.createElement("article")` e `innerHTML`, insertando fotos, nombres, categorías y precios.
2. **Filtro interactivo:** El elemento `<select id="categoria">` escucha el evento `change`. Cuando el usuario elige una categoría (ej. "cubos", "puzzles" o "accesorios"), se utiliza el método `.filter()` para crear una sublista y volver a renderizar únicamente los productos correspondientes.
3. **Menú móvil (Hamburguesa):** En pantallas menores a 768px, el botón `#boton-menu` escucha el evento `click` y añade o quita la clase `.abierto` a la barra de navegación para desplegarla suavemente. Además, se cierra automáticamente cuando el usuario hace clic en cualquier enlace.
4. **Modo oscuro con persistencia:** Al pulsar el botón `#boton-tema`, se alterna la clase `.modo-oscuro` en el `<body>` y se guarda `"oscuro"` o `"claro"` en `localStorage.setItem("tema", ...)`. Cuando el usuario navega a otra página o recarga el navegador, el script lee `localStorage.getItem("tema")` y aplica el tema inmediatamente.
5. **Validación y envío real del formulario:**
   - Se escucha el evento `submit` y se detiene el envío por defecto con `evento.preventDefault()`.
   - Se comprueba que el nombre no esté vacío y tenga mínimo 3 caracteres.
   - Se valida que el correo contenga `@` y `.` para garantizar formato de email.
   - Se exige que el mensaje tenga mínimo 10 caracteres.
   - Los errores no se muestran en un `alert()`, sino dentro de elementos `<span class="error">` junto a cada campo. Además, agregué eventos `input` para que el error desaparezca inmediatamente mientras el usuario escribe.
   - Si todo es correcto, se envía la información de forma asíncrona mediante `fetch()` al servicio de correo Formspree. Mientras se envía, el botón muestra el estado *"Enviando mensaje..."* y al responder satisfactoriamente se limpia el formulario y se muestra un mensaje de confirmación en verde.

### 3. Uso de Inteligencia Artificial y cambios propios

Usé herramientas de inteligencia artificial como un **tutor y asistente de desarrollo**:
- **Para qué la usé:** Le pedí recomendaciones para estructurar variables CSS modernas, resolver dudas sobre cómo hacer la petición `fetch()` asíncrona hacia Formspree para el envío real de correo, y consultar cómo organizar las consultas de medios (`@media`) para tablet y móvil.
- **Qué cambié yo del resultado:** 
  - Descarté imágenes genéricas de stock (como celulares, carreteras o mesas de oficina) y las reemplacé por fotos reales de cubos de velocidad, fotos de Ernő Rubik, el timer oficial StackMat y lubricante marca MoYu.
  - Diseñé y agregué diagramas vectoriales SVG específicos para la notación de los métodos (R, U, R', U', fases de CFOP, bloques de Roux y EO de ZZ).
  - Eliminé textos inflados o con tono corporativo excesivo para mantener una redacción natural, propia y acorde a un proyecto universitario de desarrollo web.
  - Ajusté la lógica del formulario y adapté los precios de la tienda a valores reales en pesos colombianos ($ COP).

### 4. ¿Qué fue lo más difícil y cómo se resolvió?

Lo más difícil del proyecto fueron dos aspectos:
1. **La consistencia del modo oscuro entre 6 páginas distintas:** Al inicio, al pasar de `index.html` a `cubos.html`, el tema volvía a blanco porque la clase se perdía al cambiar de página. Lo resolví usando `localStorage` para guardar el estado del tema y ejecutando la comprobación de `localStorage.getItem("tema")` al inicio del script antes de pintar el botón.
2. **La adaptación responsiva de las tarjetas con imágenes de distinta altura:** Al cargar fotos de productos, algunas imágenes tenían proporciones diferentes y descuadraban la cuadrícula. Lo solucioné estableciendo una altura fija para el contenedor `.tarjeta-media` (220px) con la propiedad CSS `object-fit: cover`, logrando que todas las tarjetas mantuvieran exactamente el mismo tamaño y una alineación impecable.

---

## 📸 Capturas de Pantalla

### Vista en Escritorio (Desktop)
> *(Puedes incluir aquí capturas de pantalla de la página principal y el catálogo en desktop)*
![CUBIX Escritorio](img/hero-cube.jpg)

### Vista en Móvil (Mobile)
> *(Puedes incluir aquí capturas de pantalla de la navegación móvil con el menú abierto)*
![CUBIX Móvil](img/cubo-3x3.jpg)

---

## 🚀 Cómo ejecutar el proyecto localmente

1. Clona el repositorio:
   ```bash
   git clone https://github.com/Miguel-Angel-Salazar/Cubix.git
   ```
2. Entra a la carpeta del proyecto:
   ```bash
   cd Cubix
   ```
3. Abre el archivo `index.html` en tu navegador favorito (o usa la extensión *Live Server* en VS Code).

---

## 📝 Autor

- **Miguel Ángel Salazar** — Estudiante de Desarrollo Web (2026-2)
- Proyecto desarrollado para la **Entrega 1: Sitio Web del Proyecto**.
