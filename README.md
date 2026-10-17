# CUBIX — El Mundo del Cubo de Rubik

Proyecto web profesional sobre cubos de Rubik, métodos de resolución, tienda de speedcubing y gestión de pedidos.
Evolucionado desde **Entrega 1 (HTML/CSS/JS)** a **Entrega 3 (Next.js + TypeScript + Tailwind + Node.js/Express + PostgreSQL + JWT)** para el curso de **Desarrollo Web (2026-2)**.

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
| **ADMIN** | `admin@cubix.com` | `admin123` | Gestión total: CRUD de catálogo de productos y vista global de pedidos |
| **USER** | `user@cubix.com` | `user123` | Catálogo interactivo, creación de pedidos y consulta en `/mis-pedidos` |

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
- **Axios HTTP Client:** Cliente centralizado con interceptor automático para inyección de JWT Bearer token y refresco de sesión.

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
   NEXT_PUBLIC_API_URL=http://localhost:4000/api
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
- **`/login` y `/registro`:** Autenticación con JWT, persistencia de sesión en cookies/localStorage y redirección inteligente.
- **`/mis-pedidos` (Protegida - Usuario):** Historial de compras y pedidos en tiempo real del usuario autenticado.
- **`/admin` (Protegida - Rol ADMIN):** Panel de control con CRUD completo de productos del catálogo (crear, editar, eliminar con confirmación modal) y visualización consolidada de todas las órdenes del sistema.
- **`404`:** Página personalizada de ruta no encontrada con estética CUBIX.

---

## 🔗 Endpoints Principales de la API REST

### Autenticación (`/api/auth`)
- `POST /api/auth/register` — Registro de nuevo usuario (asigna rol `USER`).
- `POST /api/auth/login` — Inicio de sesión y generación de token JWT.
- `GET /api/auth/me` — Datos del usuario autenticado actual (requiere token).

### Productos (`/api/products`)
- `GET /api/products` — Consulta de productos con filtros (`category`, `search`) y paginación (`page`, `limit`).
- `GET /api/products/:id` — Detalle de un producto por ID.
- `POST /api/products` — *(Solo ADMIN)* Crear un nuevo producto en el catálogo.
- `PUT /api/products/:id` — *(Solo ADMIN)* Actualizar datos o precio de un producto.
- `DELETE /api/products/:id` — *(Solo ADMIN)* Eliminar un producto del catálogo.

### Pedidos (`/api/orders`)
- `POST /api/orders` — *(Autenticado)* Crear una nueva orden de compra vinculada al usuario.
- `GET /api/orders/my-orders` — *(Autenticado)* Consultar pedidos del usuario en sesión.
- `GET /api/orders` — *(Solo ADMIN)* Consultar todas las órdenes registradas en el sistema con datos del comprador.

---

## 👤 Autor

- **Miguel Ángel Salazar**
- Curso: Desarrollo Web (2026-2)
- Entrega 3: Aplicación Full-Stack Profesional (Next.js + Node.js + PostgreSQL + JWT)
