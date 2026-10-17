import { Router, Request, Response, NextFunction } from "express";
import { authService } from "../../../application/auth.service";
import { authMiddleware } from "../middlewares/auth.middleware";

export const authRouter = Router();

authRouter.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, email, password } = req.body ?? {};
      const result = await authService.register({ name, email, password });
      res.status(201).json({
        message: "Usuario registrado exitosamente",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
);

authRouter.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body ?? {};
      const result = await authService.login({ email, password });
      res.status(200).json({
        message: "Inicio de sesión exitoso",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
);

authRouter.get(
  "/me",
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const user = await authService.getProfile(userId);
      res.status(200).json({ data: user });
    } catch (error) {
      next(error);
    }
  }
);
