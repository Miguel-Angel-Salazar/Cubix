import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../../config/env";
import { AuthTokenPayload } from "../../domain/user.entity";
import { UnauthorizedError } from "../../domain/errors";

export class TokenService {
  static sign(payload: AuthTokenPayload): string {
    const options: SignOptions = {
      expiresIn: env.jwtExpiresIn as unknown as number, // jsonwebtoken accepts string formats like '1d', '15m'
    };

    return jwt.sign(payload, env.jwtSecret, options);
  }

  static verify(token: string): AuthTokenPayload {
    try {
      const decoded = jwt.verify(token, env.jwtSecret) as jwt.JwtPayload;
      if (!decoded || typeof decoded !== "object" || !decoded.id || !decoded.role) {
        throw new UnauthorizedError("Token inválido");
      }
      return {
        id: decoded.id as string,
        role: decoded.role as AuthTokenPayload["role"],
      };
    } catch {
      throw new UnauthorizedError("Token inválido o expirado");
    }
  }
}
