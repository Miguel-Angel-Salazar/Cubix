import "dotenv/config";

function required(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Falta configurar ${name} en el archivo .env del backend.`);
  }

  return value;
}

function parsePort(value: string | undefined): number {
  const port = Number(value ?? "4000");

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT debe ser un número entre 1 y 65535.");
  }

  return port;
}

function parseUrl(name: string, value: string): string {
  try {
    return new URL(value).origin;
  } catch {
    throw new Error(`${name} debe ser una URL válida.`);
  }
}

const databaseUrl = required("DATABASE_URL");

try {
  const parsedDatabaseUrl = new URL(databaseUrl);

  if (
    parsedDatabaseUrl.protocol !== "postgres:" &&
    parsedDatabaseUrl.protocol !== "postgresql:"
  ) {
    throw new Error();
  }
} catch {
  throw new Error("DATABASE_URL debe ser una URL válida de PostgreSQL.");
}

const jwtSecret = required("JWT_SECRET");

if (jwtSecret.length < 32) {
  throw new Error("JWT_SECRET debe tener al menos 32 caracteres.");
}

const jwtExpiresIn = required("JWT_EXPIRES_IN");

if (!/^\d+\s*(s|m|h|d)$/.test(jwtExpiresIn)) {
  throw new Error("JWT_EXPIRES_IN debe usar un formato como 15m, 1h o 1d.");
}

export const env = {
  port: parsePort(process.env.PORT),
  databaseUrl,
  jwtSecret,
  jwtExpiresIn,
  frontendUrl: parseUrl("FRONTEND_URL", required("FRONTEND_URL")),
};
