import {
  CreateUserDto,
  LoginDto,
  AuthResponse,
  UserResponse,
} from "../domain/user.entity";
import {
  BadRequestError,
  ConflictError,
  UnauthorizedError,
  NotFoundError,
} from "../domain/errors";
import { userRepository, UserRepository } from "../infrastructure/repositories/user.repository";
import { PasswordService } from "../infrastructure/security/password.service";
import { TokenService } from "../infrastructure/security/token.service";

export class AuthService {
  constructor(private userRepo: UserRepository = userRepository) {}

  async register(dto: CreateUserDto): Promise<AuthResponse> {
    if (!dto.name || dto.name.trim().length < 2) {
      throw new BadRequestError("El nombre debe tener al menos 2 caracteres");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!dto.email || !emailRegex.test(dto.email.trim())) {
      throw new BadRequestError("Debes proporcionar un correo electrónico válido");
    }

    if (!dto.password || dto.password.length < 6) {
      throw new BadRequestError("La contraseña debe tener al menos 6 caracteres");
    }

    const existingUser = await this.userRepo.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictError("El correo electrónico ya está registrado");
    }

    const passwordHash = await PasswordService.hash(dto.password);
    const user = await this.userRepo.create({
      name: dto.name,
      email: dto.email,
      passwordHash,
      role: dto.role ?? "USER",
    });

    const token = TokenService.sign({
      id: user.id,
      role: user.role,
    });

    const userResponse: UserResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return { token, user: userResponse };
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    if (!dto.email || !dto.password) {
      throw new BadRequestError("Debes ingresar correo y contraseña");
    }

    const user = await this.userRepo.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedError("Credenciales inválidas");
    }

    const isPasswordValid = await PasswordService.compare(
      dto.password,
      user.passwordHash
    );

    if (!isPasswordValid) {
      throw new UnauthorizedError("Credenciales inválidas");
    }

    const token = TokenService.sign({
      id: user.id,
      role: user.role,
    });

    const userResponse: UserResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return { token, user: userResponse };
  }

  async getProfile(userId: string): Promise<UserResponse> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError("Usuario no encontrado");
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

export const authService = new AuthService();
