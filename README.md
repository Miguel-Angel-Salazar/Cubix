# CUBIX

Proyecto de la Entrega 3 para el curso de Desarrollo Web (2026-2). Es una aplicación web full-stack sobre cubos de Rubik y speedcubing, que incluye catálogo de productos, autenticación con JWT y gestión de pedidos.

El proyecto partió del sitio estático desarrollado en la Entrega 1 (HTML, CSS y JavaScript vanilla) y evolucionó a una aplicación completa con frontend en Next.js, TypeScript y Tailwind CSS, y un backend en Node.js con Express, PostgreSQL y Prisma ORM.

---

## Despliegue

- **Frontend en producción (Vercel):** [https://cubix-ruddy.vercel.app](https://cubix-ruddy.vercel.app/)
- **Backend API REST en producción (Render):** [https://cubix-api-v78n.onrender.com](https://cubix-api-v78n.onrender.com)
- **Repositorio Frontend en GitHub:** [https://github.com/Miguel-Angel-Salazar/Cubix](https://github.com/Miguel-Angel-Salazar/Cubix)
- **Repositorio Backend en GitHub:** [https://github.com/Miguel-Angel-Salazar/backend_cubix](https://github.com/Miguel-Angel-Salazar/backend_cubix)

---

## Estructura del proyecto

El repositorio está organizado con separación entre frontend y backend:

```text
Cubix/
├── backend/               # API REST con Express, TypeScript y Prisma
│   ├── prisma/            # Esquema de base de datos, migraciones y seed
│   ├── src/
│   │   ├── domain/        # Entidades del dominio e interfaces de repositorios
│   │   ├── application/   # Servicios con la lógica de negocio (Auth, Products, Orders)
│   │   ├── infrastructure/# Configuración de Prisma y acceso a base de datos
│   │   └── interface/     # Controladores, rutas de Express y middlewares
│   └── tests/             # Pruebas automatizadas de middlewares
│
├── frontend/              # Aplicación web en Next.js (App Router)
│   ├── public/images/     # Fotos e imágenes de los cubos
│   └── src/
│       ├── app/           # Rutas públicas y protegidas de Next.js
│       └── features/      # Organización por módulos (auth, products, orders, common)
│
├── css/, img/, js/        # Archivos originales de la Entrega 1 (conservados como histórico)
└── *.html                 # Páginas HTML de la Entrega 1
```

---

## Usuarios de prueba (Seed)

La base de datos se inicializa con dos usuarios de prueba para poder evaluar los distintos roles y permisos:

| Rol | Correo | Contraseña | Acceso y permisos |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@cubix.com` | `Admin123!` | Acceso completo: panel `/admin`, crear, editar y eliminar productos del catálogo, y revisar todos los pedidos del sistema. |
| **USER** | `user@cubix.com` | `User123!` | Catálogo en `/tienda`, compra de productos mediante modal y consulta de historial en `/mis-pedidos`. No tiene acceso a `/admin`. |

---

## Tecnologías utilizadas

### Backend
- **Node.js y Express** para construir la API REST.
- **TypeScript** para tener tipado estático en todo el servidor.
- **PostgreSQL y Prisma ORM** para el modelado de datos, migraciones y consultas.
- **JWT (jsonwebtoken) y bcryptjs** para manejo de sesiones seguras y hash de contraseñas.
- **Node test runner** (`node --test` + `tsx`) para las pruebas unitarias de middlewares.

### Frontend
- **Next.js 16 (App Router)** con React y TypeScript.
- **Tailwind CSS** para los estilos y soporte de modo claro y oscuro.
- **Arquitectura por módulos / features** (`auth`, `products`, `orders`, `common`) para separar servicios, hooks y componentes.
- **Cliente HTTP centralizado (`http.ts`)** que inyecta automáticamente el token Bearer en las peticiones y redirige a login si recibe un 401.

---

## Instalación y ejecución local

### Requisitos previos
- Node.js (v18 o superior)
- PostgreSQL (puede ser local o una base de datos en la nube como Supabase o Neon)

### 1. Configurar el Backend

1. Entra a la carpeta del backend e instala dependencias:
   ```bash
   cd backend
   npm install
   ```
2. Crea el archivo `.env` a partir del ejemplo:
   ```bash
   cp .env.example .env
   ```
3. Configura tus variables en `.env`:
   ```env
   PORT=4000
   DATABASE_URL="postgresql://usuario:password@localhost:5432/cubix_db?schema=public"
   JWT_SECRET="cubix_super_secret_jwt_key_2026_dev"
   JWT_EXPIRES_IN="7d"
   FRONTEND_URL="http://localhost:3000"
   ```
4. Corre las migraciones de Prisma y carga los datos de prueba:
   ```bash
   npx prisma migrate dev --name init
   npm run seed
   ```
5. Ejecuta las pruebas unitarias:
   ```bash
   npm test
   ```
6. Inicia el servidor en modo desarrollo:
   ```bash
   npm run dev
   # El backend quedará escuchando en http://localhost:4000
   ```

### 2. Configurar el Frontend

1. En otra terminal, entra a la carpeta del frontend e instala dependencias:
   ```bash
   cd frontend
   npm install
   ```
2. Crea el archivo `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Asegúrate de que apunte a la URL del backend:
   ```env
   NEXT_PUBLIC_API_HOST=http://localhost:4000
   ```
3. Verifica la compilación de producción:
   ```bash
   npm run build
   ```
4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   # La aplicación estará disponible en http://localhost:3000
   ```

---

## Páginas de la aplicación

- **`/` (Inicio):** Portada con presentación del sitio, accesos rápidos a las secciones y soporte de modo oscuro.
- **`/cubos`:** Guía informativa sobre las categorías oficiales (2x2 hasta 5x5, Pyraminx y Megaminx).
- **`/metodos`:** Explicación de métodos de resolución (Principiante, CFOP, Roux y ZZ).
- **`/blog`:** Artículos sobre la historia del cubo de Rubik y técnicas de speedcubing.
- **`/tienda`:** Catálogo de productos conectado a la base de datos, con búsqueda por texto, filtro por categoría, paginación y modal para comprar.
- **`/contacto`:** Formulario de contacto con validaciones de campos en tiempo real.
- **`/login` y `/registro`:** Autenticación con JWT y persistencia de sesión en el navegador.
- **`/mis-pedidos` (Protegida - Usuario):** Historial con los pedidos realizados por el usuario que tiene la sesión activa.
- **`/admin` (Protegida - Solo Admin):** Panel de administración para crear, editar y eliminar productos del catálogo, y revisar todos los pedidos del sistema.
- **`404` (`not-found.tsx`):** Página personalizada para rutas que no existen.

---

## Endpoints de la API REST

### Autenticación (`/api/auth`)
- `POST /api/auth/register` — Registra un usuario nuevo (con rol `USER`).
- `POST /api/auth/login` — Valida credenciales y genera el token JWT.
- `GET /api/auth/me` — Devuelve los datos del usuario en sesión a partir del token.

### Catálogo de Productos (`/api/products`)
- `GET /api/products` — Consulta productos con soporte de filtros (`category`, `search`, precios) y paginación (`page`, `limit`).
- `GET /api/products/:id` — Obtiene el detalle de un producto por ID.
- `POST /api/products` — *(Solo ADMIN)* Agrega un nuevo producto al catálogo.
- `PUT /api/products/:id` — *(Solo ADMIN)* Modifica datos o precio de un producto.
- `DELETE /api/products/:id` — *(Solo ADMIN)* Elimina un producto del catálogo.

### Pedidos (`/api/orders`)
- `POST /api/orders` — *(Autenticado)* Crea una orden de compra; el ID del comprador se obtiene directamente del token JWT.
- `GET /api/orders/mias` — *(Autenticado)* Consulta únicamente los pedidos del usuario autenticado.
- `GET /api/orders` — *(Solo ADMIN)* Lista todas las órdenes registradas con la información del comprador.
- `GET /api/orders/:id` — *(Autenticado)* Detalle de un pedido específico (restringido al dueño de la orden o a un admin).

---

## Decisiones técnicas (Criterios de la rúbrica)

### 1. Flujo completo de un login: desde el formulario hasta la respuesta de una ruta protegida

1. **Envío de credenciales:** El usuario llena el formulario en `/login` con su correo y contraseña. El componente `LoginForm` valida que los campos no estén vacíos y llama a `AuthService.login({ email, password })`.
2. **Recepción en el backend:** La solicitud llega a `POST /api/auth/login`. El servicio `AuthService` busca el usuario en PostgreSQL a través de `UserRepository.findByEmail(email)`. Si el correo no existe, devuelve un error 401.
3. **Validación de contraseña:** Con `bcrypt.compare(password, user.passwordHash)` se verifica si la contraseña ingresada coincide con el hash guardado. Si no coincide, devuelve el mismo mensaje genérico 401 ("Credenciales inválidas") para evitar que alguien use el endpoint para adivinar qué correos están registrados.
4. **Firma del token JWT:** Si las credenciales son válidas, se genera un token con `jsonwebtoken.sign()` incluyendo en el payload únicamente el `id` y el `role` del usuario, con un tiempo de expiración definido (`JWT_EXPIRES_IN=7d`). La contraseña nunca se incluye en la respuesta.
5. **Guardado en el cliente:** El frontend recibe el token junto con los datos de perfil (id, nombre, correo, rol), los guarda en el contexto de React (`useAuth`) y guarda el token en el `localStorage` con la clave `cubix_token`.
6. **Consumo de ruta protegida:** Cuando el usuario entra a `/mis-pedidos`, el hook `useMyOrders` llama a `OrderService.getMyOrders()`. El cliente HTTP (`http.ts`) intercepta la petición y añade automáticamente la cabecera `Authorization: Bearer <token>`.
7. **Verificación en el middleware:** En el backend, `authMiddleware` lee la cabecera `Authorization`, verifica la firma del token con `JWT_SECRET` y guarda el payload decodificado en `req.user`. La ruta `/api/orders/mias` toma `req.user.id` para consultar en la base de datos únicamente las compras de ese usuario y responde con código 200 y la lista de pedidos.

### 2. ¿Dónde guardas el token en el frontend y qué riesgo tiene esa decisión?

El token se guarda en el `localStorage` del navegador bajo la clave `cubix_token` y se mantiene sincronizado en el estado del `AuthProvider`.

**Riesgo de esta decisión:**
El riesgo principal de guardar tokens en `localStorage` es la vulnerabilidad a ataques **XSS (Cross-Site Scripting)**. Si un atacante lograra inyectar código JavaScript malicioso en la página (a través de un paquete de terceros vulnerable o contenido sin sanitizar), ese script podría ejecutar `localStorage.getItem("cubix_token")` y extraer el token del usuario.

La alternativa más segura frente a este riesgo es guardar el token en **cookies con las banderas `HttpOnly` y `SameSite=Strict`**, ya que el navegador no permite que el código JavaScript tenga acceso a esas cookies.

**Medidas de mitigación aplicadas:**
- No se utilizan paquetes externos no verificados ni funciones como `dangerouslySetInnerHTML`.
- Todas las entradas de los formularios se validan tanto en el cliente como en el backend.
- El token tiene tiempo de expiración configurado.
- Si la API responde con un código 401, el cliente HTTP limpia de inmediato el token de `localStorage` y redirige al usuario a la pantalla de login.

### 3. ¿En qué caso tu API responde 401 y en cuál 403? Ejemplos reales del proyecto

- **Código 401 Unauthorized (Fallo de autenticación):**
  Se produce cuando el cliente intenta acceder a un recurso protegido sin identificarse o cuando las credenciales no son válidas. Significa que el servidor no sabe quién está haciendo la petición.
  *Ejemplo en CUBIX:* Si una persona sin iniciar sesión hace una petición directa a `GET /api/orders/mias` o a `POST /api/orders` sin enviar la cabecera `Authorization: Bearer <token>`, el `authMiddleware` rechaza la petición con `401: Token de autorización no proporcionado`. Lo mismo ocurre si el token ya expiró o fue alterado.

- **Código 403 Forbidden (Fallo de autorización / permisos):**
  Se produce cuando el usuario **sí está autenticado** (su token es válido y el servidor sabe quién es), pero su rol no cuenta con los permisos necesarios para realizar la acción solicitada.
  *Ejemplo en CUBIX:* Si un usuario con rol `USER` intenta eliminar un producto del catálogo enviando `DELETE /api/products/1` o intenta consultar todos los pedidos del sistema en `GET /api/orders`, el token pasa el filtro de autenticación, pero el `roleMiddleware` comprueba que su rol no es `ADMIN` y responde con `403: Acceso denegado: permisos insuficientes para esta operación`.

### 4. Uso de Inteligencia Artificial: ¿Para qué se usó y qué se corrigió?

**Para qué se usó:**
- Como apoyo para plantear la estructura inicial de carpetas en capas del backend (separando entidades, repositorios y servicios).
- Para agilizar la escritura de interfaces y tipos en TypeScript para los modelos de datos.
- Para ayudar a escribir las pruebas unitarias de los middlewares de autenticación y roles con el runner nativo de Node.js.
- Para adaptar el diseño visual responsivo con Tailwind CSS tomando como base los colores y estilos de la Entrega 1.

**Qué se tuvo que corregir manualmente:**
- **Estandarización de respuestas JSON:** En los primeros borradores los endpoints devolvían formatos dispares (algunos `{ user }`, otros `{ result }` y otros el objeto suelto). Se ajustaron todos los controladores para responder de manera uniforme con `{ data }`, que es lo que espera el cliente HTTP del frontend.
- **Límites de Suspense en Next.js:** Durante la compilación de producción (`npm run build`), Next.js arrojó errores porque componentes que leen parámetros de URL con `useSearchParams()` (como el login, el registro y la tienda con filtros) no estaban envueltos en un boundary de `<Suspense>`. Se envolvieron manualmente con sus respectivos fallbacks de carga.
- **Rutas de la rúbrica:** Las rutas generadas inicialmente usaban `/api/orders/my-orders`, pero la rúbrica del curso solicitaba específicamente `/api/orders/mias`. Se corrigieron las rutas en los controladores de Express y en los servicios del frontend para cumplir con la especificación exacta.

---

## Comprobación de cabecera Authorization en Network

En la siguiente captura de las herramientas de desarrollador del navegador se aprecia el envío automático de la cabecera `Authorization: Bearer <token>` al consultar una ruta protegida (`GET /api/orders/mias`):

![Captura de la pestaña Network con cabecera Authorization Bearer](docs/network-authorization.png)

### Pasos para replicarlo en el navegador:
1. Iniciar sesión en `/login` con `user@cubix.com` (contraseña: `User123!`).
2. Abrir las herramientas de desarrollo (`F12`), ir a la pestaña **Network** (Red) y filtrar por `Fetch/XHR`.
3. Entrar a **Mis Pedidos** (`/mis-pedidos`) o realizar una compra en la **Tienda**.
4. Hacer clic sobre la petición `GET /api/orders/mias` o `POST /api/orders`.
5. En la sección **Request Headers** se puede verificar la cabecera:
   ```http
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

---

## Autor

- **Miguel Ángel Salazar**
- Curso: Desarrollo Web (2026-2)
- Entrega 3: Aplicación Full-Stack (Next.js + Node.js + PostgreSQL + JWT)
