import cors from "cors";
import express from "express";
import { env } from "../../config/env";
import { healthRouter } from "./routes/health.routes";
import { authRouter } from "./routes/auth.routes";
import { productRouter } from "./routes/product.routes";
import { orderRouter } from "./routes/order.routes";
import { errorMiddleware } from "./middlewares/error.middleware";

export const app = express();

// Configuración de CORS estricto según la URL del frontend
const allowedOrigins = [env.frontendUrl];
if (process.env.NODE_ENV !== "production") {
  allowedOrigins.push("http://localhost:3000", "http://127.0.0.1:3000");
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir solicitudes sin origin (como Postman o curl) o que pertenezcan a Vercel o localhost
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") ||
        origin.includes("localhost")
      ) {
        callback(null, true);
      } else {
        callback(new Error(`Origen no permitido por CORS: ${origin}`));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Rutas de la API
app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/productos", productRouter);
app.use("/api/orders", orderRouter);
app.use("/api/pedidos", orderRouter);

// Ruta raíz informativa
app.get("/", (_req, res) => {
  res.status(200).json({
    service: "CUBIX API REST",
    status: "online",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      auth: "/api/auth",
      products: "/api/products",
      orders: "/api/orders",
    },
  });
});

// Manejo de ruta 404
app.use((_req, res) => {
  res.status(404).json({
    error: "Ruta no encontrada",
  });
});

// Middleware global de errores
app.use(errorMiddleware);
