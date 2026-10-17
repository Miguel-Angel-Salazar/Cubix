# CUBIX — El Mundo del Cubo de Rubik

Proyecto web profesional sobre cubos de Rubik, métodos de resolución, tienda de speedcubing y gestión de pedidos.
Evolucionado desde **Entrega 1 (HTML/CSS/JS)** a **Entrega 3 (Next.js + TypeScript + Tailwind + Node.js/Express + PostgreSQL + JWT)** para el curso de **Desarrollo Web (2026-2)**.

---

## 🌐 Enlaces del Proyecto Desplegado

- **Frontend en Producción (Vercel):** [https://cubix-ruddy.vercel.app](https://cubix-ruddy.vercel.app/)
- **Backend API REST en Producción (Render):** [https://cubix-api-v78n.onrender.com](https://cubix-api-v78n.onrender.com)
- **Repositorio GitHub:** [https://github.com/Miguel-Angel-Salazar/Cubix](https://github.com/Miguel-Angel-Salazar/Cubix)

---

## 🚀 Arquitectura General (Entrega 3)

El proyecto cuenta con una separación estricta y modular entre Frontend y Backend:

```
Cubix/
├── backend/               # API REST con Arquitectura Hexagonal / Limpia
│   ├── prisma/            # Schema PostgreSQL, migraciones y seed
│   ├── src/
│   │   ├── domain/        # Entidades puras y reglas de negocio (Product, User, Order)
│   │   ├── application/   # Casos de uso y servicios (Auth, Product, Order)
│   │   ├── infrastructure/# Prisma Client, repositorios y persistencia
│   │   └── interface/     # Controladores HTTP, rutas Express y middlewares
│   └── tests/             # Pruebas automatizadas (Node test runner + tsx)
│
├── frontend/              # Aplicación Next.js (App Router) + TypeScript + Tailwind
│   ├── public/images/     # Recursos estáticos y fotografías de alta resolución
│   └── src/
│       ├── app/           # Rutas públicas y protegidas (Next.js App Router)
│       └── features/      # Organización modular por dominio (auth, products, orders)
│
├── css/, img/, js/        # Sitio original de la Entrega 1 (preservado como histórico)
└── *.html                 # Páginas originales de la Entrega 1
```

---

## 🔑 Credenciales de Prueba (Seed)

La base de datos se inicializa con los siguientes usuarios para evaluación:

| Rol | Correo | Contraseña | Permisos |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@cubix.com` | `Admin123!` | Gestión total: CRUD de catálogo de productos y vista global de pedidos |
| **USER** | `user@cubix.com` | `User123!` | Catálogo interactivo, creación de pedidos y consulta en `/mis-pedidos` |

---

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js & Express:** Servidor HTTP RESTful.
- **TypeScript:** Tipado estático riguroso de extremo a extremo.
- **PostgreSQL & Prisma ORM:** Base de datos relacional y modelado declarativo.
- **JWT & bcrypt:** Autenticación segura basada en tokens y hash de contraseñas.
- **Clean Architecture:** Desacoplamiento entre dominio, aplicación e infraestructura.
- **Pruebas Automatizadas:** Tests para middlewares de autenticación, validación de roles y captura de errores.

### Frontend
- **Next.js 16 (App Router):** Renderizado híbrido optimizado y streaming con `Suspense`.
- **TypeScript & Tailwind CSS:** Interfaz moderna, accesible, responsiva y con modo oscuro persistente.
- **Feature-driven Architecture:** Módulos organizados en `domain`, `services`, `hooks` y `components`.
- **Cliente HTTP Centralizado (`http.ts`):** Inyección automática de cabecera `Authorization: Bearer <token>` y redirección a `/login` ante respuestas `401`.

---

## ⚙️ Configuración y Ejecución Local

### 1. Requisitos Previos
- Node.js (v18+)
- PostgreSQL (local o instancia en Supabase / Neon)

### 2. Backend

1. Entra al directorio del backend:
   ```bash
   cd backend
   npm install
   ```
2. Crea tu archivo `.env` basado en `.env.example`:
   ```bash
   cp .env.example .env
   ```
3. Configura tus variables en `.env`:
   ```env
   PORT=4000
   DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/cubix_db?schema=public"
   JWT_SECRET="cubix_super_secret_jwt_key_2026_dev"
   JWT_EXPIRES_IN="7d"
   FRONTEND_URL="http://localhost:3000"
   ```
4. Aplica las migraciones y puebla la base de datos con los datos iniciales:
   ```bash
   npx prisma migrate dev --name init
   npm run seed
   ```
5. Corre las pruebas automatizadas del backend:
   ```bash
   npm test
   ```
6. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   # Backend escuchando en http://localhost:4000
   ```

### 3. Frontend

1. Entra al directorio del frontend:
   ```bash
   cd ../frontend
   npm install
   ```
2. Crea tu archivo `.env.local` basado en `.env.example`:
   ```bash
   cp .env.example .env.local
   ```
   Asegúrate de que apunte al backend:
   ```env
   NEXT_PUBLIC_API_HOST=http://localhost:4000
   ```
3. Compila y verifica el build de producción:
   ```bash
   npm run build
   ```
4. Inicia el entorno de desarrollo:
   ```bash
   npm run dev
   # Frontend disponible en http://localhost:3000
   ```

---

## 📄 Páginas y Rutas del Frontend

- **`/` (Inicio):** Presentación del sitio, propuesta de valor y accesos rápidos con animaciones y modo claro/oscuro.
- **`/cubos`:** Guía detallada de categorías oficiales WCA (2x2, 3x3, 4x4, 5x5, Pyraminx, Megaminx).
- **`/metodos`:** Diagramas y etapas de los métodos de resolución (Principiante, CFOP, Roux, ZZ).
- **`/blog`:** Artículos informativos sobre la historia de Ernő Rubik, speedcubing, lookahead y técnicas.
- **`/tienda`:** Catálogo dinámico conectado al backend con búsqueda, filtrado por categorías, paginación y modal para realizar pedidos.
- **`/contacto`:** Formulario interactivo con validaciones en tiempo real y notificaciones al usuario.
- **`/login` y `/registro`:** Autenticación con JWT, persistencia de sesión en localStorage y redirección inteligente.
- **`/mis-pedidos` (Protegida - Usuario):** Historial de compras y pedidos en tiempo real del usuario autenticado.
- **`/admin` (Protegida - Rol ADMIN):** Panel de control con CRUD completo de productos del catálogo (crear, editar, eliminar con confirmación modal) y visualización consolidada de todas las órdenes del sistema.
- **`404`:** Página personalizada de ruta no encontrada con estética CUBIX (`not-found.tsx`).

---

## 🔗 Endpoints Principales de la API REST

### Autenticación (`/api/auth`)
- `POST /api/auth/register` — Registro de nuevo usuario (asigna rol `USER`).
- `POST /api/auth/login` — Inicio de sesión y generación de token JWT.
- `GET /api/auth/me` — Datos del usuario autenticado actual (requiere token).

### Catálogo de Productos (`/api/products`)
- `GET /api/products` — Consulta de productos con filtros (`category`, `search`, precios) y paginación (`page`, `limit`).
- `GET /api/products/:id` — Detalle de un producto por ID.
- `POST /api/products` — *(Solo ADMIN)* Crear un nuevo producto en el catálogo.
- `PUT /api/products/:id` — *(Solo ADMIN)* Actualizar datos o precio de un producto.
- `DELETE /api/products/:id` — *(Solo ADMIN)* Eliminar un producto del catálogo.

### Pedidos / Interacción (`/api/orders`)
- `POST /api/orders` — *(Autenticado)* Crear una nueva orden de compra vinculada al usuario extraído del token.
- `GET /api/orders/mias` — *(Autenticado)* Consultar pedidos exclusivos del usuario en sesión.
- `GET /api/orders` — *(Solo ADMIN)* Consultar todas las órdenes registradas en el sistema con datos del comprador.
- `GET /api/orders/:id` — *(Autenticado)* Detalle de una orden específica (restringido a su dueño o a un admin).

---

## 🧠 Decisiones Técnicas (Criterios Rúbrica)

### 1. Flujo completo de un login: desde el formulario hasta la respuesta de una ruta protegida
1. **Envío de credenciales:** El usuario ingresa email y contraseña en `/login`. El componente `LoginForm` valida el formato del correo y la longitud de la contraseña en el cliente y delega la petición a `AuthService.login({ email, password })`.
2. **Recepción en Backend:** La petición llega a `POST /api/auth/login`. El servicio `AuthService` busca el usuario en la base de datos vía `UserRepository.findByEmail(email)`. Si no existe, lanza `UnauthorizedError("Credenciales inválidas")`.
3. **Comparación de Hash:** Con `bcrypt.compare(password, user.passwordHash)`, verifica que la clave coincida. Si es incorrecta, devuelve exactamente el mismo error genérico `401` para prevenir enumeración de usuarios.
4. **Firma del JWT:** Se genera un token firmado con `jsonwebtoken.sign()` incluyendo únicamente el `id` y el `role` en el payload, con expiración configurada (`JWT_EXPIRES_IN`). La contraseña nunca se retorna en la respuesta.
5. **Almacenamiento en Cliente:** El frontend recibe el token y los datos de perfil (`id`, `name`, `email`, `role`), guardándolos en el estado de React (`useAuth`) y persistiendo el token en `localStorage` con la clave `cubix_token`.
6. **Consumo de Ruta Protegida:** Al ingresar a `/mis-pedidos`, el hook `useMyOrders` llama a `OrderService.getMyOrders()`. El cliente HTTP intercepta la petición y añade automáticamente el encabezado `Authorization: Bearer <token>`.
7. **Verificación en Middleware:** En el backend, `authMiddleware` extrae el Bearer token, valida la firma con `JWT_SECRET` y monta la entidad decodificada en `req.user`. La ruta `/api/orders/mias` toma `req.user.id` directamente del token para consultar solo los pedidos de ese usuario y responde con código `200` y sus datos correspondientes.

### 2. ¿Dónde guardas el token en el frontend y qué riesgo tiene esa decisión?
- **Ubicación:** El token se almacena en el `localStorage` del navegador bajo la clave `cubix_token`, y sincronizado en memoria dentro del `AuthProvider`.
- **Análisis de riesgo:**
  - El principal riesgo de guardar tokens en `localStorage` es la vulnerabilidad a ataques **XSS (Cross-Site Scripting)**: si un script malicioso de un tercero logra ejecutarse en la aplicación, puede acceder directamente a `localStorage.getItem("cubix_token")` y extraer el token del usuario.
  - La alternativa más robusta es usar **cookies `HttpOnly` y `SameSite=Strict`**, las cuales son inaccesibles desde código JavaScript del navegador. Para mitigar el riesgo en nuestra implementación con `localStorage`: no se utilizan librerías externas no auditadas ni `dangerouslySetInnerHTML`, se sanitizan todas las entradas, el token tiene expiración configurada y el cliente HTTP borra automáticamente el token ante cualquier respuesta `401`.

### 3. ¿En qué caso tu API responde 401 y en cuál 403? Ejemplos reales del proyecto
- **Código 401 (Unauthorized - Falta o fallo de autenticación):**
  - Ocurre cuando el cliente intenta acceder a un recurso protegido sin identificarse o con credenciales inválidas.
  - *Ejemplo real CUBIX:* Si un visitante no autenticado hace una petición directa a `GET /api/orders/mias` o a `POST /api/orders` sin enviar la cabecera `Authorization: Bearer <token>`, el `authMiddleware` responde inmediatamente con `401: "Token de autorización no proporcionado"`. También ocurre si el token expiró o la firma está manipulada.
- **Código 403 (Forbidden - Falta de autorización o privilegios):**
  - Ocurre cuando el usuario **está correctamente autenticado** (el token es 100% válido), pero su rol no posee los permisos necesarios para realizar la acción solicitada.
  - *Ejemplo real CUBIX:* Si un usuario autenticado con rol `USER` intenta eliminar un producto del catálogo ejecutando `DELETE /api/products/123` o consultar todas las órdenes del sistema en `GET /api/orders`, el `roleMiddleware(soloAdmin)` detecta que `req.user.role !== 'ADMIN'` y rechaza la petición con `403: "Acceso denegado: permisos insuficientes para esta operación"`.

### 4. Uso de Inteligencia Artificial: ¿Para qué se usó y qué se corrigió?
- **Para qué se usó:**
  - Para acelerar la estructuración de la arquitectura hexagonal en TypeScript y generar interfaces estrictas para los DTOs de dominio.
  - Para escribir las pruebas unitarias automatizadas con el test runner nativo de Node.js (`tests/middlewares.test.ts`).
  - Para asistir en la maquetación responsiva con Tailwind CSS replicando la identidad visual y colores de la Entrega 1.
- **Qué se tuvo que corregir manualmente:**
  - **Estandarización de respuestas:** La IA inicialmente devolvía estructuras heterogéneas (`{ user }` en una ruta y `{ data }` en otra). Se corrigieron todos los controladores del backend para responder con el estándar consistente `{ data }` requerido por el cliente HTTP del frontend.
  - **Prerendering y límites de Suspense en Next.js:** Durante la compilación con Turbopack (`npm run build`), Next.js rechazó páginas cliente que usaban `useSearchParams()` fuera de un `<Suspense>`. Se envolvieron manualmente `LoginForm`, `RegisterForm` y `TiendaContent` en boundaries de `<Suspense>` con fallbacks de carga accesibles.
  - **Alineación de rutas REST:** La guía solicitaba `/api/orders/mias` para las órdenes del usuario. Se corrigieron los servicios y routers para que coincidieran con la especificación exacta de la rúbrica.

---

## 📸 Inspección de Red (Network Header Authorization)

Para comprobar la inyección automática del token JWT en peticiones protegidas:
1. Inicia sesión como `user@cubix.com` en `/login`.
2. Abre las herramientas de desarrollador (`F12`), pestaña **Network** (Red), y filtra por `Fetch/XHR`.
3. Navega a **Mis Pedidos** (`/mis-pedidos`) o realiza una orden en la **Tienda**.
4. Haz clic sobre la petición `GET /api/orders/mias` o `POST /api/orders`.
5. En la sección **Request Headers** se evidencia la cabecera:
   ```http
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

---

## 👤 Autor

- **Miguel Ángel Salazar**
- Curso: Desarrollo Web (2026-2)
- Entrega 3: Aplicación Full-Stack Profesional (Next.js + Node.js + PostgreSQL + JWT)
