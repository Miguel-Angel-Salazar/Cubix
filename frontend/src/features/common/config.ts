/**
 * Configuración centralizada de variables de entorno y URLs de la API para el frontend
 */
export const API_BASE_URL: string =
  process.env.NEXT_PUBLIC_API_HOST?.replace(/\/+$/, "") || "http://localhost:4000";
