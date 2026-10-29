import { API_BASE_URL } from "./config";

export const TOKEN_STORAGE_KEY = "cubix_token";
export const USER_STORAGE_KEY = "cubix_user";

export class ApiError extends Error {
  statusCode: number;
  details?: unknown;

  constructor(message: string, statusCode: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setStoredToken(token: string | null): void {
  if (typeof window === "undefined") {
    return;
  }
  if (token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    document.cookie = `${TOKEN_STORAGE_KEY}=; path=/; max-age=0; SameSite=Lax`;
  }
}

export interface HttpRequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined | null>;
  skipAuth?: boolean;
}

/**
 * Cliente HTTP centralizado que inyecta automáticamente el token de autenticación
 * y redirige a /login ante un error 401.
 */
export async function httpClient<T = unknown>(
  endpoint: string,
  options: HttpRequestOptions = {}
): Promise<T> {
  const { params, skipAuth = false, headers = {}, ...restOptions } = options;

  let url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString;
    }
  }

  const finalHeaders: Record<string, string> = {
    Accept: "application/json",
    ...(headers as Record<string, string>),
  };

  if (!(restOptions.body instanceof FormData)) {
    finalHeaders["Content-Type"] = finalHeaders["Content-Type"] || "application/json";
  }

  if (!skipAuth) {
    const token = getStoredToken();
    if (token) {
      finalHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...restOptions,
      headers: finalHeaders,
    });
  } catch (error) {
    throw new ApiError(
      "No fue posible conectar con el servidor. Revisa tu conexión a internet o verifica que la API esté corriendo.",
      0,
      error
    );
  }

  // Manejo centralizado del error 401 (no autorizado / expirado)
  if (response.status === 401) {
    setStoredToken(null);
    if (typeof window !== "undefined") {
      // Disparar evento para actualizar estado reactivo en la app
      window.dispatchEvent(new Event("cubix-auth-change"));
      // Si no estamos ya en /login, redirigir
      if (!window.location.pathname.startsWith("/login")) {
        const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
        window.location.replace(`/login?redirect=${returnUrl}`);
      }
    }
    const errorData = await response.json().catch(() => null);
    throw new ApiError(
      errorData?.error || "Sesión expirada o no autorizada. Por favor inicia sesión nuevamente.",
      401,
      errorData
    );
  }

  let data: unknown = null;
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    data = await response.json().catch(() => null);
  } else {
    data = await response.text().catch(() => null);
  }

  if (!response.ok) {
    const message =
      (data as { error?: string })?.error ||
      (data as { message?: string })?.message ||
      `Error HTTP ${response.status}: ${response.statusText}`;
    throw new ApiError(message, response.status, data);
  }

  return data as T;
}
