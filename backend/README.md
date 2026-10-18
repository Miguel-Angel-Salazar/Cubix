# CUBIX — Backend API REST

API REST para la aplicación CUBIX (Entrega 3 de Desarrollo Web), desarrollada con **Node.js, Express, TypeScript, Prisma ORM y PostgreSQL**.

---

## Enlaces

- **API REST en producción (Render):** [https://cubix-api-v78n.onrender.com](https://cubix-api-v78n.onrender.com)
- **Frontend en producción (Vercel):** [https://cubix-ruddy.vercel.app](https://cubix-ruddy.vercel.app)
- **Repositorio en GitHub:** [https://github.com/Miguel-Angel-Salazar/Cubix](https://github.com/Miguel-Angel-Salazar/Cubix)

---

## Usuarios de prueba (Seed)

La base de datos incluye dos usuarios predeterminados para pruebas:

| Rol | Correo | Contraseña | Permisos |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@cubix.com` | `Admin123!` | CRUD completo de productos (`POST/PUT/DELETE /api/products`) y consulta de todos los pedidos (`GET /api/orders`). |
| **USER** | `user@cubix.com` | `User123!` | Catálogo de lectura, creación de pedidos propios (`POST /api/orders`) y consulta de su historial (`GET /api/orders/mias`). |

---

## Arquitectura y estructura del código

El código del backend está organizado separando responsabilidades en carpetas:

```text
backend/src/
├── domain/            # Entidades puras y contratos de repositorios (User, Product, Order)
├── application/       # Lógica de negocio y casos de uso (AuthService, ProductService, OrderService)
├── infrastructure/    # Implementaciones con Prisma ORM y conexión a la base de datos
└── interface/         # Capa HTTP: controladores, rutas de Express y middlewares
    └── http/
        ├── controllers/ # AuthController, ProductController, OrderController
        ├── middlewares/ # authMiddleware, roleMiddleware, errorHandler
        └── routes/      # auth.routes, product.routes, order.routes
```

Prisma Client se mantiene dentro de `infrastructure/`, mientras que la lógica de aplicación interactúa a través de interfaces de repositorio para mantener el código desacoplado y fácil de testear.

---

## Configuración y ejecución local

### 1. Requisitos
- Node.js (v18+)
- PostgreSQL (local o instancia en la nube como Supabase)

### 2. Instalación
```bash
cd backend
npm install
```

### 3. Variables de entorno (`.env`)
Copia la plantilla `.env.example`:
```bash
cp .env.example .env
```

Configura tus credenciales en `.env`:
```env
PORT=4000
DATABASE_URL="postgresql://usuario:password@localhost:5432/cubix_db?schema=public"
JWT_SECRET="cubix_super_secret_jwt_key_2026_dev_secreto_minimo_32_chars"
JWT_EXPIRES_IN="7d"
FRONTEND_URL="http://localhost:3000"
```

### 4. Base de datos: migraciones y seed
Aplica las migraciones y ejecuta el seed para cargar los productos y usuarios iniciales:
```bash
npx prisma migrate dev --name init
npm run seed
```

### 5. Pruebas automatizadas
Para correr la suite de pruebas unitarias sobre los middlewares de autenticación y roles:
```bash
npm test
```

### 6. Iniciar el servidor
```bash
npm run dev
# Servidor escuchando en http://localhost:4000
```

Para verificar que la API está funcionando:
```bash
curl http://localhost:4000/api/health
```

---

## Endpoints de la API

### Autenticación (`/api/auth`)
| Método | Ruta | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Público | Registra un usuario con contraseña hasheada (bcrypt). Retorna 409 si el correo ya existe. |
| `POST` | `/api/auth/login` | Público | Comprueba credenciales y devuelve el JWT firmado (`id`, `role`). Retorna 401 si los datos son incorrectos. |
| `GET` | `/api/auth/me` | Autenticado | Devuelve los datos del usuario en sesión (`req.user`). |

### Catálogo de productos (`/api/products`)
| Método | Ruta | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Público | Lista productos con paginación (`page`, `limit`), búsqueda por texto y filtro por categoría. Responde `{ pagination, data }`. |
| `GET` | `/api/products/:id` | Público | Devuelve un producto por su ID. Retorna 404 si no existe. |
| `POST` | `/api/products` | Solo ADMIN | Crea un nuevo cubo en el catálogo. |
| `PUT` | `/api/products/:id` | Solo ADMIN | Actualiza campos o precio de un producto. |
| `DELETE` | `/api/products/:id` | Solo ADMIN | Elimina un producto. Retorna 403 si un usuario normal intenta ejecutarlo. |

### Pedidos (`/api/orders`)
| Método | Ruta | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/orders` | Autenticado | Crea un pedido calculando el total según los precios en base de datos. El `userId` se toma del token, nunca del body. |
| `GET` | `/api/orders/mias` | Autenticado | Consulta únicamente los pedidos del usuario autenticado. |
| `GET` | `/api/orders` | Solo ADMIN | Devuelve la lista completa de pedidos con datos de los compradores. |
| `GET` | `/api/orders/:id` | Autenticado | Detalle de un pedido (permitido solo a su dueño o a un admin). |

---

## Decisiones técnicas (Criterios de la rúbrica)

### 1. Flujo completo de un login hasta la respuesta de una ruta protegida
1. El cliente envía `POST /api/auth/login` con email y contraseña.
2. `AuthService` busca el usuario en PostgreSQL por email; si no existe, devuelve un 401 genérico ("Credenciales inválidas").
3. Si existe, `bcrypt.compare` valida la contraseña contra el hash de la base de datos. Si no coincide, devuelve el mismo 401.
4. Con las credenciales verificadas, se genera un JWT firmado con `JWT_SECRET` conteniendo `{ id, role }` con expiración de 7 días. La contraseña nunca se retorna.
5. El cliente guarda el token y lo envía en subsecuentes peticiones en el encabezado `Authorization: Bearer <token>`.
6. En una ruta protegida como `GET /api/orders/mias`, el middleware `authMiddleware` valida la firma del token, extrae el payload y lo guarda en `req.user`.
7. El controlador usa `req.user.id` para consultar en la base de datos únicamente las compras de ese usuario y responde con código 200.

### 2. Dónde se guarda el token y riesgos
- El frontend guarda el token en `localStorage` (`cubix_token`) para persistir la sesión al recargar la página.
- **Riesgo:** Vulnerabilidad ante ataques **XSS (Cross-Site Scripting)** si se lograra inyectar código JavaScript no autorizado en el cliente. La alternativa ideal son cookies con las banderas `HttpOnly` y `SameSite=Strict`. Como mitigación, se sanitizan los inputs, no se usa código inseguro en el cliente, el token tiene expiración y ante cualquier respuesta 401 el token se purga de inmediato.

### 3. Diferencia entre 401 y 403
- **401 Unauthorized (Fallo de autenticación):** No se envió el token, expiró o es inválido.
  *Ejemplo:* Petición a `GET /api/orders/mias` sin la cabecera `Authorization`.
- **403 Forbidden (Fallo de permisos):** El usuario está autenticado correctamente, pero su rol no tiene permiso para la acción.
  *Ejemplo:* Un usuario con rol `USER` enviando `DELETE /api/products/1` o consultando `GET /api/orders`. El middleware de rol (`soloAdmin`) responde con 403.

### 4. Uso de herramientas de IA y correcciones aplicadas
- **Uso:** Estructuración inicial de capas, generación de interfaces en TypeScript y apoyo para armar los tests unitarios de middlewares.
- **Correcciones manuales:** Estandarización de respuestas JSON para que todos los endpoints devuelvan `{ data }`, corrección de URLs a `/api/orders/mias` según la especificación de la rúbrica y ajuste del pooler IPv4 de Supabase para compatibilidad con el entorno de Render.

---

## Inspección de red (Cabecera Authorization)

Captura de las herramientas de desarrollador verificando el envío de `Authorization: Bearer <token>` hacia `GET /api/orders/mias`:

![Captura Network - Authorization Bearer](../docs/network-authorization.png)
