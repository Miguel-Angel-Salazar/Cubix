# CUBIX — El Mundo del Cubo de Rubik

Proyecto web sobre cubos de Rubik, métodos de resolución y tienda de productos, hecho con **HTML, CSS y JavaScript puro** (sin frameworks ni librerías) para la **Entrega 1 de Desarrollo Web (2026-2)**.

---

## Enlaces del proyecto

- **Sitio publicado en Vercel:** [https://cubix-project.vercel.app](https://cubix-ruddy.vercel.app/)
- **Repositorio en GitHub:** [https://github.com/Miguel-Angel-Salazar/Cubix](https://github.com/Miguel-Angel-Salazar/Cubix)

---

## ¿De qué trata el proyecto?

**CUBIX** es una página web pensada para personas interesadas en los cubos de Rubik, tanto principiantes que quieren aprender a armar su primer cubo como aficionados al speedcubing que quieren mejorar sus tiempos.

El sitio cuenta con 6 secciones:
1. **Inicio (`index.html`):** Presentación del sitio y accesos rápidos a las secciones principales.
2. **Cubos (`cubos.html`):** Guía con los tipos de cubos más conocidos (2x2, 3x3, 4x4, 5x5, Pyraminx y Megaminx).
3. **Métodos (`metodos.html`):** Explicación con diagramas de los métodos más usados (Principiante, CFOP, Roux y ZZ).
4. **Blog (`blog.html`):** Artículos sobre la historia de Ernő Rubik, torneos de speedcubing, una infografía de consejos y tips para bajar tiempos.
5. **Tienda (`tienda.html`):** Catálogo interactivo de cubos y accesorios cargado dinámicamente con JavaScript y con filtro por categoría.
6. **Contacto (`contacto.html`):** Formulario para dudas o pedidos con validación propia y envío funcional.

---

## Decisiones técnicas

### ¿Dónde usé Flexbox y dónde Grid, y por qué?
- **Flexbox:** Lo usé para organizar elementos en una sola línea o dirección. Lo apliqué en el `header` para separar el logo del menú de navegación, en los botones de inicio, en el filtro de la tienda y en la parte inferior de las tarjetas (`.tarjeta-pie`) con `margin-top: auto` para que los precios siempre queden alineados abajo sin importar el tamaño del texto.
- **Grid:** Lo usé en los listados y cuadrículas (el catálogo de la tienda, la lista de cubos, los artículos del blog y los métodos). Me sirvió mucho para definir fácilmente 3 columnas en pantalla de computador, 2 columnas en tablet y 1 columna en celular de forma responsive.

### ¿Qué hace el JavaScript y cómo funciona la validación?
En `script.js` tengo programadas las siguientes funciones:
- **Catálogo dinámico:** Los productos están guardados en un arreglo de objetos con nombre, precio en pesos colombianos ($ COP), categoría, descripción y foto. Una función recorre ese arreglo y crea las tarjetas en el HTML.
- **Filtro de productos:** El selector de categorías escucha el evento `change` y usa `.filter()` para mostrar solo los cubos o accesorios seleccionados sin tener que recargar la página.
- **Menú para celular:** Un botón hamburguesa que abre y cierra el menú de navegación en pantallas móviles y se cierra solo al hacer clic en un enlace.
- **Modo oscuro con memoria:** Guarda la preferencia en `localStorage` con la clave `"tema"`. Así, si cambias a modo oscuro y pasas a otra página o recargas, el color se mantiene.
- **Validación y envío del formulario:** Al intentar enviar el formulario, revisa con JavaScript que el nombre no esté vacío (mínimo 3 letras), que el correo tenga `@` y punto, y que el mensaje tenga al menos 10 caracteres. Si falta algo, muestra un mensaje de error en rojo debajo del campo correspondiente (sin usar `alert()`). Si todo está correcto, se envía usando `fetch()` a Formspree mostrando un aviso de *"Enviando..."* y un mensaje de confirmación al terminar.

### Uso de Inteligencia Artificial
La gran mayoría de la página ya la tenía construida yo (toda la estructura de las 6 páginas HTML, la temática de los cubos, los textos del blog y la idea del catálogo con el formulario). 

Utilicé la IA como apoyo principalmente en dos partes:
- **En el CSS:** Para ayudarme a pulir el diseño visual, definir una paleta de colores coherente con variables (`:root`) para el modo claro y oscuro, y organizar las medidas requeridas para que no se rompiera en celular ni tablet.
- **En el JavaScript:** Para apoyarme en la lógica de conectar el envío real del formulario con `fetch()` hacia Formspree y mejorar la interacción del menú móvil.


### ¿Qué fue lo más difícil y cómo lo solucioné?
Lo más difícil fue hacer que el modo oscuro se mantuviera funcionando en las 6 páginas sin parpadear al cambiar de una a otra, lo cual resolví leyendo el `localStorage` apenas carga el script. También me costó que las tarjetas del catálogo se vieran parejas cuando las fotos tenían proporciones distintas, lo que solucioné poniéndole una altura fija al contenedor de la foto con `object-fit: cover` en CSS.

---

## Capturas de pantalla

### Vista en Computador (Desktop)
![CUBIX Desktop]

<img width="921" height="518" alt="image" src="https://github.com/user-attachments/assets/c77bdd4d-fd5f-4362-b199-45348176db51" />

<img width="921" height="518" alt="image" src="https://github.com/user-attachments/assets/d37e7c58-a1ff-43cb-8203-fad41bf4ef6d" />

<img width="921" height="519" alt="image" src="https://github.com/user-attachments/assets/7bf1d322-c087-4a27-981a-3e989f7290b4" />

<img width="921" height="520" alt="image" src="https://github.com/user-attachments/assets/30aed3d0-4166-4fc7-b44d-7729515fb8e3" />

<img width="921" height="518" alt="image" src="https://github.com/user-attachments/assets/c8e6da34-acf2-4e0b-941e-f57fafd61904" />

### Vista en Celular (Mobile)
![CUBIX Mobile]

<img width="720" height="1100" alt="image" src="https://github.com/user-attachments/assets/757792a7-3acb-4180-9ca4-fc5f3950811d" />

<img width="720" height="1100" alt="image" src="https://github.com/user-attachments/assets/6902d779-c498-43fc-8e46-63de923cdb03" />

<img width="720" height="1100" alt="image" src="https://github.com/user-attachments/assets/79fb1d70-6ed0-46d9-bcca-6efe9b6d24a3" />

<img width="720" height="1100" alt="image" src="https://github.com/user-attachments/assets/67168a77-d3af-4b02-b98f-acab7160aaf1" />

<img width="720" height="1100" alt="image" src="https://github.com/user-attachments/assets/567faf8b-d411-4f1c-b0db-00942eef9d1e" />

<img width="720" height="1100" alt="image" src="https://github.com/user-attachments/assets/9494ce85-f2ef-4163-8ad5-f96ca0e017ea" />

<img width="720" height="1100" alt="image" src="https://github.com/user-attachments/assets/2782c524-33f7-4347-b133-2624bf62a17c" />

<img width="720" height="1100" alt="image" src="https://github.com/user-attachments/assets/14d1068d-7ad3-4cad-97fb-059c81828bd2" />


## Cómo abrir el proyecto

1. Descarga o clona el repositorio de GitHub.
2. Abre la carpeta en tu editor de código.
3. Abre el archivo `index.html` en cualquier navegador web.

---

## Autor

- **Miguel Ángel Salazar**
- Curso: Desarrollo Web (2026-2)
