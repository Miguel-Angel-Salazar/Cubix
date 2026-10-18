# CUBIX — Frontend Web Application (Entrega 3)

Aplicación web profesional construida con **Next.js 16 (App Router), TypeScript y Tailwind CSS**, organizada mediante **Arquitectura Basada en Características (Feature-Driven Architecture)** para el curso de **Desarrollo Web (2026-2)**.

Evolucionada desde el sitio estático de la **Entrega 1** manteniendo la misma identidad visual, dominio (cubos de Rubik y speedcubing) y contenido real, ahora conectada a la API REST en producción.

---

## 🌐 Enlaces del Proyecto Desplegado

- **Frontend en Producción (Vercel):** [https://cubix-ruddy.vercel.app](https://cubix-ruddy.vercel.app)
- **Backend API REST en Producción (Render):** [https://cubix-api-v78n.onrender.com](https://cubix-api-v78n.onrender.com)
- **Repositorio GitHub:** [https://github.com/Miguel-Angel-Salazar/Cubix](https://github.com/Miguel-Angel-Salazar/Cubix)

---

## 🔑 Credenciales de Prueba (Seed)

Para probar todas las funciones, estados y rutas protegidas:

| Rol | Correo | Contraseña | Permisos y Vistas |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@cubix.com` | `Admin123!` | Acceso a `/admin`: panel CRUD del catálogo (crear, editar, eliminar con modal) y visualización global de pedidos. |
| **USER** | `user@cubix.com` | `User123!` | Catálogo en `/tienda`, creación de órdenes con modal de compra y consulta en `/mis-pedidos`. Si intenta entrar a `/admin`, es redirigido a `/`. |

---

## 🏛️ Organización por Features

El frontend sigue estrictamente el patrón por dominios de negocio:

```
frontend/
├── src/
│   ├── app/                    # Rutas de Next.js (App Router) — Solo componen
│   │   ├── page.tsx            # Inicio (/)
│   │   ├── cubos/page.tsx      # Guía WCA (/cubos)
│   │   ├── metodos/page.tsx    # Métodos de resolución (/metodos)
│   │   ├── blog/page.tsx       # Artículos speedcubing (/blog)
│   │   ├── tienda/page.tsx     # Catálogo con paginación y filtros (/tienda)
│   │   ├── contacto/page.tsx   # Formulario interactivo (/contacto)
│   │   ├── login/page.tsx      # Formulario de inicio de sesión (/login)
│   │   ├── registro/page.tsx   # Formulario de registro de usuario (/registro)
│   │   ├── mis-pedidos/page.tsx# Historial del usuario (/mis-pedidos - Protegida)
│   │   ├── admin/page.tsx      # Panel administrativo (/admin - Protegida ADMIN)
│   │   ├── not-found.tsx       # Página 404 personalizada con diseño CUBIX
│   │   └── layout.tsx          # Estructura global, Navbar reactiva y ThemeProvider
│   │
│   └── features/               # Módulos desacoplados por funcionalidad
│       ├── common/
│       │   ├── config.ts       # API_BASE_URL leída desde NEXT_PUBLIC_API_HOST
│       │   ├── http.ts         # Cliente HTTP centralizado (inyecta token, captura 401)
│       │   └── components/     # Navbar, Footer, ThemeToggle, Button, Modal, Pagination
│       ├── auth/
│       │   ├── domain/         # Tipos: User, LoginRequest, RegisterRequest, AuthResponse
│       │   ├── services/       # AuthService (login, register, me)
│       │   ├── hooks/          # useAuth (estado de sesión reactivo, login, logout)
│       │   └── components/     # LoginForm, RegisterForm, ProtectedRoute
│       ├── products/
│       │   ├── domain/         # Tipos: Product, ProductCategory, ProductFilters, CatalogResponse
│       │   ├── services/       # ProductService (getProducts, getById, create, update, delete)
│       │   ├── hooks/          # useProducts (paginación, filtros combinados, estados UI)
│       │   └── components/     # ProductCard, ProductGrid, ProductFilters, AdminProductTable, ProductModal
│       └── orders/
│           ├── domain/         # Tipos: Order, OrderItem, CreateOrderRequest
│           ├── services/       # OrderService (createOrder, getMyOrders, getAllOrders)
│           ├── hooks/          # useOrders, useMyOrders
│           └── components/     # OrderCard, OrderList, OrderModal
```

### Reglas Clave de Consumo:
1. **Sin fetch sueltos:** Ningún componente invoca `fetch` directamente; todas las comunicaciones se delegan a `services/`.
2. **Cliente HTTP Centralizado (`http.ts`):** Inyecta automáticamente el encabezado `Authorization: Bearer <token>` a cada solicitud autenticada y, si el backend responde `401`, elimina el token de `localStorage` y redirige al usuario a `/login`.
3. **Manejo de Errores en UI:** Los errores del servidor se procesan y se muestran de forma inline junto al campo correspondiente, evitando el uso de alertas nativas (`alert()`).
4. **Estados de UI Visibles:** El catálogo presenta estados claros de **cargando** (esqueletos/indicadores), **vacío** (mensaje informativo si no hay coincidencias) y **error** (con opción de reintento).

---

## ⚙️ Configuración y Ejecución Local

### 1. Requisitos
- Node.js (v18 o superior)
- Backend de CUBIX ejecutándose localmente (puerto 4000) o apuntando a Render.

### 2. Instalación de Dependencias
```bash
cd frontend
npm install
```

### 3. Variables de Entorno (`.env.local`)
Copia el archivo `.env.example`:
- En Linux / macOS / PowerShell:
  ```bash
  cp .env.example .env.local
  ```
- En Windows CMD:
  ```cmd
  copy .env.example .env.local
  ```

Asegúrate de que defina el host de la API:
```env
NEXT_PUBLIC_API_HOST=http://localhost:4000
```
*(Si no tienes el backend local activo, puedes apuntar a producción: `NEXT_PUBLIC_API_HOST=https://cubix-api-v78n.onrender.com`).*

### 4. Compilación de Producción
Verifica que TypeScript y Turbopack compilen sin errores:
```bash
npm run build
```

### 5. Iniciar Servidor de Desarrollo
```bash
npm run dev
# Frontend disponible en http://localhost:3000
```

---

## 🛡️ Rutas Protegidas y Gestión de Sesión

- **`/mis-pedidos`:** Requiere sesión activa. Si un usuario no autenticado entra a la URL, es redirigido automáticamente a `/login`.
- **`/admin`:** Requiere rol `ADMIN`. Si un usuario normal (`USER`) o un visitante sin sesión escribe la URL en el navegador, es redirigido inmediatamente al inicio (`/`).
- **`/login` y `/registro`:** Si el usuario ya cuenta con una sesión activa, ambas rutas lo redirigen automáticamente al inicio (`/`).
- **Persistencia:** La sesión sobrevive al refrescar la página mediante la hidratación desde `localStorage`.
- **Navbar Reactiva:**
  - *Visitante:* Muestra botón "Ingresar".
  - *Usuario:* Muestra el nombre del usuario y botón "Salir".
  - *Admin:* Muestra además el enlace directo a "Administración" (`/admin`).

---

## 🧠 Decisiones Técnicas

### 1. Flujo completo de un login hasta la respuesta de una ruta protegida
1. El usuario completa el formulario en `/login` y envía las credenciales.
2. `LoginForm` valida los campos y llama a `AuthService.login({ email, password })`.
3. El backend valida el hash con bcrypt, genera el JWT con `{ id, role }` y responde con `200 OK` y el token.
4. El frontend guarda el token en `localStorage` (`cubix_token`) y sincroniza el estado de `AuthProvider`.
5. Al acceder a `/mis-pedidos`, el hook `useMyOrders` invoca `OrderService.getMyOrders()`.
6. El cliente HTTP `http.ts` añade automáticamente el encabezado `Authorization: Bearer <token>`.
7. El backend valida el token en su middleware, extrae el `id` del payload y responde con las órdenes del usuario.

### 2. Dónde se guarda el token y qué riesgo tiene
- Se almacena en `localStorage` bajo la clave `cubix_token` para mantener la sesión tras recargar el navegador.
- **Riesgo:** Vulnerabilidad ante ataques **XSS (Cross-Site Scripting)** si se inyectara código de terceros en el cliente. La alternativa ideal son cookies seguras `HttpOnly`. Como medidas de mitigación: no se usan paquetes no verificados, se previene `dangerouslySetInnerHTML`, el token tiene expiración y `http.ts` purga las credenciales si el backend responde 401.

### 3. Códigos 401 vs 403
- **401 Unauthorized:** Cuando no hay token o este no es válido. Ejemplo: consultar `GET /api/orders/mias` sin iniciar sesión.
- **403 Forbidden:** Cuando el token es válido pero el usuario carece de permisos. Ejemplo: usuario con rol `USER` intentando acceder al panel de `/admin` o enviando `DELETE /api/products/:id`.

### 4. Uso de IA y correcciones
- **Uso:** Diseño de interfaces responsivas con Tailwind CSS, esqueletos de componentes y estructuración de los hooks personalizados.
- **Correcciones:** Envoltura obligatoria de componentes que usan `useSearchParams()` en boundaries de `<Suspense>` para habilitar prerenderizado estático en Next.js 16, corrección del cliente HTTP para manejar respuestas de error de Prisma y ajuste de selectores de tema oscuro/claro con `@custom-variant dark`.

---

## 📸 Captura de Petición con Header Authorization

![Captura de Network en Google Chrome](../docs/network-authorization.png)
