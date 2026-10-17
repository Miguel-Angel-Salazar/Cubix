"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getStoredToken,
  USER_STORAGE_KEY,
} from "../../common/http";
import { LoginRequest, RegisterRequest, User } from "../domain";
import { AuthService } from "../services/auth.service";

export interface UseAuthReturn {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadSession = useCallback(() => {
    if (typeof window === "undefined") {
      setIsLoading(false);
      return;
    }

    const currentToken = getStoredToken();
    const storedUserJson = localStorage.getItem(USER_STORAGE_KEY);

    if (currentToken && storedUserJson) {
      try {
        const parsedUser = JSON.parse(storedUserJson) as User;
        setUser(parsedUser);
        setToken(currentToken);
      } catch {
        setUser(null);
        setToken(null);
      }
    } else if (currentToken) {
      setToken(currentToken);
      // Intentar recuperar el perfil
      AuthService.getMe()
        .then((userData) => setUser(userData))
        .catch(() => {
          setUser(null);
          setToken(null);
        });
    } else {
      setUser(null);
      setToken(null);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadSession();

    const handleAuthChange = () => {
      loadSession();
    };

    window.addEventListener("cubix-auth-change", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("cubix-auth-change", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, [loadSession]);

  const login = async (credentials: LoginRequest) => {
    const response = await AuthService.login(credentials);
    setUser(response.data.user);
    setToken(response.data.token);
  };

  const register = async (userData: RegisterRequest) => {
    const response = await AuthService.register(userData);
    setUser(response.data.user);
    setToken(response.data.token);
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
    setToken(null);
  };

  const refreshUser = async () => {
    try {
      const updatedUser = await AuthService.getMe();
      setUser(updatedUser);
    } catch {
      // Ignorar si falla la actualización
    }
  };

  const isAuthenticated = Boolean(token && user);
  const isAdmin = user?.role === "ADMIN";

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  };
}
