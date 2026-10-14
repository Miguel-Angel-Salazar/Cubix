import { Request, Response, NextFunction } from "express";
import { Role } from "../../../domain/user.entity";

export function requireRole(...allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: "Acceso no autorizado. Se requiere inicio de sesión.",
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        error: "Acceso denegado. No tienes permisos para realizar esta acción.",
      });
      return;
    }

    next();
  };
}

export const soloAdmin = requireRole("ADMIN");
