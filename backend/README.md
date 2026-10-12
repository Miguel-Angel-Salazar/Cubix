# Backend de CUBIX

API de la Entrega 3: Node.js, Express, TypeScript, Prisma y PostgreSQL. Las variables reales se guardan localmente en `backend/.env`; ese archivo está ignorado por Git.

## Configuración local

1. Copia `.env.example` como `.env` o completa el `.env` local.
2. En Supabase, copia la cadena de conexión PostgreSQL y úsala como `DATABASE_URL`.
3. Genera un secreto aleatorio de al menos 32 caracteres para `JWT_SECRET` con `node -e "console.log(require('node:crypto').randomBytes(32).toString('base64'))"`.
4. Deja `JWT_EXPIRES_IN=1d` y `FRONTEND_URL=http://localhost:3000` para desarrollo local.
5. Instala dependencias con `npm install`.
6. Inicia la API con `npm run dev`.

La cadena de conexión y el secreto JWT son confidenciales: no los compartas ni los subas a GitHub.

## Modelo de datos

- `User`: nombre, email único, hash de contraseña y rol (`ADMIN` o `USER`).
- `Product`: catálogo CUBIX con categoría, precio entero en pesos colombianos y ruta de imagen.
- `Order`: pedido asociado a un usuario autenticado.
- `OrderItem`: productos, cantidades y precio unitario guardado al momento del pedido.

El carrito podrá incluir varios productos. La API validará cantidades y calculará el total usando los precios guardados en la base; no confiará en totales enviados desde el navegador. Los productos referencian imágenes estáticas del frontend mediante rutas como `/images/cubo-3x3.jpg`; las imágenes no se guardan como binarios en PostgreSQL.

## Migración y catálogo inicial

Tras revisar el esquema generado en `prisma/migrations/`, aplica la migración con `npm run prisma:migrate` y luego carga el catálogo con `npm run prisma:seed`. El seed es repetible: actualiza o crea cada producto por su `slug`.

## Comprobación

Con la API en ejecución, abre `http://localhost:4000/api/health`. La conexión a Supabase se valida al ejecutar migraciones o el seed.
