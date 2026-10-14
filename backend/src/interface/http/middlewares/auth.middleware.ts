import { Request, Response, NextFunction } from "express";
import { TokenService } from "../../../infrastructure/security/token.service";
import { AuthTokenPayload } from "../../../domain/user.entity";

declare global {
  namespace Express {
    interface Request {
      user?: AuthTokenPayload;
    }
  }
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({
      error: "Acceso no autorizado. Se requiere token de autenticación.",
    });
    return;
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    res.status(401).json({
      error: "Formato de token inválido. Usa: Authorization: Bearer <token>",
    });
    return;
  }

  try {
    const payload = TokenService.verify(token);
    req.user = payload;
    next();
  } catch {
    res.status(401).json({
      error: "Token inválido o expirado. Inicia sesión nuevamente.",
    });
  }
}
