export type Role = "ADMIN" | "USER";

export interface UserEntity {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export type UserResponse = Omit<UserEntity, "passwordHash">;

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role?: Role;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthTokenPayload {
  id: string;
  role: Role;
}

export interface AuthResponse {
  token: string;
  user: UserResponse;
}
