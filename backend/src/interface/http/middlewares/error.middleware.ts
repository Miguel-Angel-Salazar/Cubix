import { Request, Response, NextFunction } from "express";
import { HttpError } from "../../../domain/errors";
import { Prisma } from "@prisma/client";

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  // Manejo de errores HTTP de dominio propios
  if (err instanceof HttpError) {
    res.status(err.statusCode).json({
      error: err.message,
      ...(err.details && { details: err.details }),
    });
    return;
  }

  // Manejo de errores conocidos de Prisma
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      const target = Array.isArray(err.meta?.target)
        ? (err.meta.target as string[]).join(", ")
        : "campo";
      res.status(409).json({
        error: `Ya existe un registro con ese valor para: ${target}`,
      });
      return;
    }

    if (err.code === "P2025") {
      res.status(404).json({
        error: "El registro solicitado no existe o ya fue eliminado",
      });
      return;
    }

    res.status(400).json({
      error: "Error en la operación de base de datos",
    });
    return;
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    res.status(400).json({
      error: "Datos de entrada inválidos para el modelo de datos",
    });
    return;
  }

  // Errores de sintaxis JSON
  if (err instanceof SyntaxError && "status" in err && (err as { status?: number }).status === 400) {
    res.status(400).json({
      error: "El cuerpo de la solicitud no es un JSON válido",
    });
    return;
  }

  // Error genérico sin exponer stack trace
  console.error("[Unhandled Error]:", err instanceof Error ? err.message : err);
  res.status(500).json({
    error: "Error interno del servidor. Intenta nuevamente más tarde.",
    message: err instanceof Error ? err.message : String(err),
  });
}
