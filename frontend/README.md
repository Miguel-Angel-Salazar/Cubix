# CUBIX — Frontend

Aplicación web desarrollada con **Next.js 16 (App Router), TypeScript y Tailwind CSS** para la Entrega 3 del curso de Desarrollo Web (2026-2).

Migrada y expandida a partir del sitio web de la Entrega 1, manteniendo la temática de cubos de Rubik, ahora conectada a la API REST para autenticación, catálogo y pedidos.

---

## Enlaces

- **Frontend en producción (Vercel):** [https://cubix-ruddy.vercel.app](https://cubix-ruddy.vercel.app)
- **Backend API REST en producción (Render):** [https://cubix-api-v78n.onrender.com](https://cubix-api-v78n.onrender.com)
- **Repositorio Frontend en GitHub:** [https://github.com/Miguel-Angel-Salazar/Cubix](https://github.com/Miguel-Angel-Salazar/Cubix)
- **Repositorio Backend en GitHub:** [https://github.com/Miguel-Angel-Salazar/backend_cubix](https://github.com/Miguel-Angel-Salazar/backend_cubix)

---

## Usuarios de prueba (Seed)

Para probar las distintas vistas y permisos de la aplicación:

| Rol | Correo | Contraseña | Vistas y permisos |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@cubix.com` | `Admin123!` | Acceso a `/admin`: panel para crear, editar y eliminar productos del catálogo, y revisar todos los pedidos del sistema. |
| **USER** | `user@cubix.com` | `User123!` | Navegar catálogo en `/tienda`, comprar con modal y ver historial en `/mis-pedidos`. Si intenta entrar a `/admin`, es redirigido al inicio. |

---

## Estructura del frontend

El código se encuentra organizado por módulos (features):

```text
frontend/
├── src/
│   ├── app/                    # Rutas de Next.js (App Router)
│   │   ├── page.tsx            # Inicio (/)
│   │   ├── cubos/page.tsx      # Guía de cubos (/cubos)
│   │   ├── metodos/page.tsx    # Métodos de resolución (/metodos)
│   │   ├── blog/page.tsx       # Artículos (/blog)
│   │   ├── tienda/page.tsx     # Catálogo con filtros y compra (/tienda)
│   │   ├── contacto/page.tsx   # Formulario de contacto (/contacto)
│   │   ├── login/page.tsx      # Inicio de sesión (/login)
│   │   ├── registro/page.tsx   # Registro (/registro)
│   │   ├── mis-pedidos/page.tsx# Historial de compras (/mis-pedidos - Protegida)
│   │   ├── admin/page.tsx      # Panel de administración (/admin - Protegida ADMIN)
│   │   ├── not-found.tsx       # Error 404 personalizado
│   │   └── layout.tsx          # Navbar, Footer y ThemeProvider
│   │
│   └── features/               # Módulos por dominio
│       ├── common/             # Cliente HTTP (http.ts), componentes compartidos (Navbar, Footer, Modales)
│       ├── auth/               # Servicios, hooks de sesión (useAuth) y formularios de login/registro
│       ├── products/           # Servicios, hooks de catálogo (useProducts) y tarjetas de productos
│       └── orders/             # Servicios y componentes de pedidos y órdenes
```

### Aspectos clave de la implementación:
- **Cliente HTTP (`http.ts`):** Centraliza las llamadas a la API, agrega automáticamente el token Bearer y, si la API responde 401, limpia la sesión y redirige al login.
- **Servicios dedicados:** Los componentes no hacen `fetch` directo; toda la comunicación pasa por los servicios de cada módulo (`AuthService`, `ProductService`, `OrderService`).
- **Estados de carga:** En la tienda y en los pedidos se manejan estados claros para carga, listas vacías y errores con opción de reintentar.

---

## Configuración y ejecución local

### 1. Requisitos
- Node.js (v18+)
- Backend de CUBIX activo en local (puerto 4000) o apuntando a la URL de Render.

### 2. Instalación de dependencias
```bash
cd frontend
npm install
```

### 3. Variables de entorno (`.env.local`)
Copia la plantilla `.env.example`:
```bash
cp .env.example .env.local
```

Asegúrate de definir la URL del backend:
```env
NEXT_PUBLIC_API_HOST=http://localhost:4000
```
*(Si no tienes el backend local activo, puedes apuntar a producción: `NEXT_PUBLIC_API_HOST=https://cubix-api-v78n.onrender.com`).*

### 4. Compilación de producción
Para verificar que Next.js y TypeScript compilen correctamente:
```bash
npm run build
```

### 5. Iniciar servidor de desarrollo
```bash
npm run dev
# Disponible en http://localhost:3000
```

---

## Rutas protegidas y manejo de sesión

- **`/mis-pedidos`:** Requiere tener sesión iniciada. Si un usuario sin sesión intenta entrar, es enviado a `/login`.
- **`/admin`:** Requiere rol `ADMIN`. Si un usuario común (`USER`) o alguien sin sesión entra a la URL, es redirigido al inicio (`/`).
- **`/login` y `/registro`:** Si el usuario ya tiene sesión iniciada, lo redirigen automáticamente al inicio (`/`).
- **Persistencia de sesión:** La sesión se mantiene al recargar la página leyendo el token desde `localStorage`.

---

## Decisiones técnicas (Criterios de la rúbrica)

### 1. Flujo completo de un login hasta la respuesta de una ruta protegida
1. El usuario completa el formulario en `/login` con su email y clave.
2. `LoginForm` valida los campos y llama a `AuthService.login({ email, password })`.
3. El backend valida el hash con bcrypt, genera el JWT con `{ id, role }` y responde con código 200 y el token.
4. El frontend guarda el token en `localStorage` (`cubix_token`) y actualiza el estado del `AuthProvider`.
5. Al acceder a `/mis-pedidos`, el hook `useMyOrders` invoca a `OrderService.getMyOrders()`.
6. El cliente HTTP (`http.ts`) intercepta la petición y añade automáticamente el encabezado `Authorization: Bearer <token>`.
7. El backend valida el token, extrae el `id` y devuelve los pedidos pertenecientes a ese usuario con código 200.

### 2. Dónde se guarda el token y qué riesgo tiene
- Se almacena en `localStorage` bajo la clave `cubix_token` para que la sesión no se pierda al recargar la página.
- **Riesgo:** Vulnerabilidad ante ataques **XSS (Cross-Site Scripting)** si un script malicioso lograse ejecutarse en el navegador. La alternativa más segura son cookies `HttpOnly` y `SameSite=Strict`. Como medidas de mitigación: no se usan librerías externas no auditadas ni `dangerouslySetInnerHTML`, las entradas de texto se validan, el token tiene expiración y `http.ts` borra las credenciales automáticamente si la API devuelve un error 401.

### 3. Códigos 401 vs 403
- **401 Unauthorized:** Cuando no hay token o no es válido (el servidor no sabe quién eres).
  *Ejemplo:* Entrar a `/mis-pedidos` sin haber iniciado sesión o con un token vencido.
- **403 Forbidden:** Cuando el token es válido pero el usuario no tiene los permisos necesarios.
  *Ejemplo:* Un usuario con rol `USER` intentando ingresar al panel `/admin` o intentando borrar un producto con `DELETE /api/products/1`.

### 4. Uso de herramientas de IA y correcciones aplicadas
- **Uso:** Apoyo para maquetar componentes en Tailwind CSS, crear la estructura inicial de carpetas y tipado de interfaces en TypeScript.
- **Correcciones manuales:** Envolver en boundaries de `<Suspense>` las páginas que usan `useSearchParams()` (como login, registro y catálogo) para que el build de producción no fallara en Next.js 16, unificación del formato de respuesta `{ data }` para todas las llamadas del cliente HTTP y ajuste del manejo de errores visuales en los formularios.

---

## Inspección de red (Header Authorization)

Captura de la pestaña Network verificando la inyección del header `Authorization: Bearer <token>` al consultar `/api/orders/mias`:

![Captura de Network en Google Chrome](../docs/network-authorization.png)
