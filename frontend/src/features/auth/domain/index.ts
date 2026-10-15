export type UserRole = "ADMIN" | "USER";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface ProfileResponse {
  data: User;
}

export interface AuthValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}
