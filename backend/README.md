# CUBIX — Backend API REST (Entrega 3)

API RESTful profesional construida con **Node.js, Express, TypeScript, Prisma ORM y PostgreSQL**, implementando **Arquitectura Limpia / Hexagonal** en 4 capas estrictas para el curso de **Desarrollo Web (2026-2)**.

---

## 🌐 Enlaces de Producción

- **API REST Desplegada en Render:** [https://cubix-api-v78n.onrender.com](https://cubix-api-v78n.onrender.com)
- **Frontend en Vercel:** [https://cubix-ruddy.vercel.app](https://cubix-ruddy.vercel.app)
- **Repositorio GitHub:** [https://github.com/Miguel-Angel-Salazar/Cubix](https://github.com/Miguel-Angel-Salazar/Cubix)

---

## 🔑 Credenciales de Prueba (Seed)

La base de datos se inicializa con los siguientes usuarios de prueba:

| Rol | Correo | Contraseña | Permisos |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@cubix.com` | `Admin123!` | CRUD completo de catálogo (`POST/PUT/DELETE /api/products`), consulta global de pedidos (`GET /api/orders`) |
| **USER** | `user@cubix.com` | `User123!` | Catálogo de lectura, creación de pedidos vinculados a su sesión (`POST /api/orders`), consulta de sus pedidos (`GET /api/orders/mias`) |

---

## 🏗️ Arquitectura en 4 Capas (Clean / Hexagonal)

El backend separa estrictamente las responsabilidades para garantizar mantenibilidad, testeabilidad e independencia de frameworks:

```
backend/src/
├── domain/            # 1. Reglas de negocio puras, tipos, entidades e interfaces de repositorio
│   ├── entities/      # User, Product, Order, OrderItem
│   └── repositories/  # IUserRepository, IProductRepository, IOrderRepository
├── application/       # 2. Casos de uso y lógica de aplicación
│   ├── auth/          # AuthService (registro con bcrypt, login con JWT, perfil)
│   ├── products/      # ProductService (catálogo paginado, filtros, CRUD)
│   └── orders/        # OrderService (creación atómica de pedidos, cálculo de totales)
├── infrastructure/    # 3. Implementaciones técnicas externas (Persistencia y ORM)
│   ├── db/            # Instancia singleton de PrismaClient
│   └── repositories/  # PrismaUserRepository, PrismaProductRepository, PrismaOrderRepository
└── interface/         # 4. Capa de entrada y controladores HTTP
    └── http/
        ├── controllers/ # AuthController, ProductController, OrderController
        ├── middlewares/ # authMiddleware (Bearer JWT), roleMiddleware (soloAdmin), errorHandler
        └── routes/      # auth.routes, product.routes, order.routes
```

> **Aislamiento clave:** Prisma Client se encuentra confinado exclusivamente a `infrastructure/`. El dominio y la aplicación no dependen de Prisma, cumpliendo con la regla de dependencias.

---

## ⚙️ Configuración y Ejecución Local

### 1. Requisitos
- Node.js (v18 o superior)
- PostgreSQL (local o instancia en la nube como Supabase)

### 2. Instalación de Dependencias
```bash
cd backend
npm install
```

### 3. Variables de Entorno (`.env`)
Copia la plantilla `.env.example`:
- En Linux / macOS / PowerShell:
  ```bash
  cp .env.example .env
  ```
- En Windows CMD:
  ```cmd
  copy .env.example .env
  ```

Edita `.env` con tus parámetros de base de datos y seguridad:
```env
PORT=4000
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/cubix_db?schema=public"
JWT_SECRET="cubix_super_secret_jwt_key_2026_dev_secreto_minimo_32_chars"
JWT_EXPIRES_IN="7d"
FRONTEND_URL="http://localhost:3000"
```

### 4. Base de Datos: Migraciones y Seed
Aplica las migraciones de Prisma y ejecuta el seed para cargar los 9 productos oficiales de la Entrega 1 y los usuarios de prueba:
```bash
npx prisma migrate dev --name init
npm run seed
```
*(También puedes usar `npm run prisma:migrate` y `npm run prisma:seed`).*

### 5. Pruebas Automatizadas
Ejecuta la suite de pruebas unitarias de middlewares de autenticación y rol (utiliza el test runner nativo de Node.js + tsx):
```bash
npm test
```
*Resultado esperado: 8/8 pruebas pasando con éxito.*

### 6. Iniciar Servidor de Desarrollo
```bash
npm run dev
# Servidor activo en http://localhost:4000
```

Para verificar que la API responde, abre en tu navegador o terminal:
```bash
curl http://localhost:4000/api/health
# {"status":"ok","database":"connected",...}
```

---

## 📡 Catálogo de Endpoints de la API REST

### Autenticación (`/api/auth`)
| Método | Ruta | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Público | Registra un nuevo usuario con contraseña hasheada (bcrypt). Retorna 409 si el email ya existe. |
| `POST` | `/api/auth/login` | Público | Valida credenciales y emite un JWT firmado (`id`, `role`). Retorna 401 genérico ante error. |
| `GET` | `/api/auth/me` | Autenticado | Devuelve los datos del usuario en sesión (`req.user`). |

### Catálogo de Productos (`/api/products`)
| Método | Ruta | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Público | Catálogo con paginación (`page`, `limit`), búsqueda (`search`), categoría (`category`) y rango de precio. Responde `{ pagination, data }`. |
| `GET` | `/api/products/:id` | Público | Detalle de un producto por su identificador. Retorna 404 si no existe. |
| `POST` | `/api/products` | **Solo ADMIN** | Crea un nuevo cubo o accesorio en el catálogo. |
| `PUT` | `/api/products/:id` | **Solo ADMIN** | Actualiza campos o precios de un producto existente. |
| `DELETE`| `/api/products/:id` | **Solo ADMIN** | Elimina un producto del catálogo. Retorna 403 si un usuario normal intenta ejecutarlo. |

### Pedidos / Interacción (`/api/orders`)
| Método | Ruta | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/orders` | Autenticado | Crea un pedido calculando el total a partir de los precios de la BD. El `userId` se extrae del token JWT, nunca del body. |
| `GET` | `/api/orders/mias` | Autenticado | Consulta exclusivamente los pedidos realizados por el usuario en sesión. |
| `GET` | `/api/orders` | **Solo ADMIN** | Consulta el consolidado de todas las órdenes del sistema con datos del cliente. |
| `GET` | `/api/orders/:id` | Autenticado | Detalle de una orden específica (permitido solo a su propietario o a un admin). |

---

## 🧠 Decisiones Técnicas y Criterios de Evaluación

### 1. Flujo completo de un login hasta la respuesta de una ruta protegida
1. El cliente envía `POST /api/auth/login` con `{ email, password }`.
2. `AuthService` busca el usuario en PostgreSQL a través de `UserRepository.findByEmail(email)`. Si no existe, lanza `UnauthorizedError("Credenciales inválidas")`.
3. `bcrypt.compare(password, user.passwordHash)` verifica el hash de la clave. Si no coincide, retorna el mismo 401 genérico para evitar enumeración de usuarios.
4. Se firma el JWT con `JWT_SECRET` conteniendo únicamente `{ id, role }` con expiración configurada (`JWT_EXPIRES_IN`). La contraseña nunca sale en la respuesta.
5. El cliente recibe el token y lo envía en subsecuentes peticiones en la cabecera `Authorization: Bearer <token>`.
6. En una ruta protegida como `GET /api/orders/mias`, el `authMiddleware` valida la firma del token, extrae el payload y lo asigna a `req.user`.
7. El controlador extrae `req.user.id` para consultar únicamente los pedidos de ese usuario y responde con código 200 y sus datos.

### 2. Dónde se guarda el token en el frontend y qué riesgo tiene
- Se almacena en `localStorage` bajo la clave `cubix_token` para garantizar persistencia ante recargas de página.
- **Riesgo:** Vulnerabilidad a ataques **XSS (Cross-Site Scripting)** si un script malicioso lograse ejecutarse en el navegador. La alternativa más segura son cookies `HttpOnly; SameSite=Strict`. Para mitigar riesgos en `localStorage`, la aplicación sanitiza entradas, no usa `dangerouslySetInnerHTML`, el token cuenta con tiempo de expiración y el cliente HTTP lo purga automáticamente ante respuestas 401.

### 3. ¿En qué caso la API responde 401 y en cuál 403?
- **401 Unauthorized (Fallo de Autenticación):** Falta de identificación válida.
  - *Ejemplo real:* Petición a `GET /api/orders/mias` o `POST /api/orders` sin cabecera `Authorization` o con un token manipulado/expirado.
- **403 Forbidden (Fallo de Autorización / Permisos):** Usuario autenticado legítimo, pero sin los privilegios requeridos para la operación.
  - *Ejemplo real:* Usuario autenticado con rol `USER` enviando `DELETE /api/products/:id` o solicitando `GET /api/orders`. El middleware de rol (`soloAdmin`) rechaza la petición con 403.

### 4. Uso de IA y correcciones aplicadas
- **Uso:** Estructuración inicial de capas de Clean Architecture, interfaces DTO tipadas y generación de la suite de pruebas unitarias de middlewares.
- **Correcciones manuales:** Estandarización de las respuestas JSON a `{ data }`, corrección de URLs a `/api/orders/mias` según rúbrica, configuración del pooler IPv4 de Supabase para compatibilidad con Render y tipado estricto sin `any`.

---

## 📸 Captura de Inspección de Red (Authorization Header)

![Captura Network - Authorization Bearer](../docs/network-authorization.png)
