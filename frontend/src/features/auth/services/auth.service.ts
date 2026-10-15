import { httpClient, setStoredToken, USER_STORAGE_KEY } from "../../common/http";
import {
  AuthResponse,
  LoginRequest,
  ProfileResponse,
  RegisterRequest,
  User,
} from "../domain";

export class AuthService {
  /**
   * Inicia sesión con email y contraseña
   */
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await httpClient<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
      skipAuth: true,
    });

    if (response?.data?.token) {
      setStoredToken(response.data.token);
      if (typeof window !== "undefined") {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.data.user));
        window.dispatchEvent(new Event("cubix-auth-change"));
      }
    }

    return response;
  }

  /**
   * Registra un nuevo usuario
   */
  static async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await httpClient<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
      skipAuth: true,
    });

    if (response?.data?.token) {
      setStoredToken(response.data.token);
      if (typeof window !== "undefined") {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.data.user));
        window.dispatchEvent(new Event("cubix-auth-change"));
      }
    }

    return response;
  }

  /**
   * Obtiene el perfil actual del usuario autenticado
   */
  static async getMe(): Promise<User> {
    const response = await httpClient<ProfileResponse>("/api/auth/me");
    if (response?.data && typeof window !== "undefined") {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.data));
    }
    return response.data;
  }

  /**
   * Cierra sesión y elimina tokens del almacenamiento
   */
  static logout(): void {
    setStoredToken(null);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("cubix-auth-change"));
    }
  }
}
