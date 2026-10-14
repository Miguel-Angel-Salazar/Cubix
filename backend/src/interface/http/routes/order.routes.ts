import { Router, Request, Response, NextFunction } from "express";
import { orderService } from "../../../application/order.service";
import { authMiddleware } from "../middlewares/auth.middleware";
import { soloAdmin } from "../middlewares/role.middleware";
import { ForbiddenError } from "../../../domain/errors";

export const orderRouter = Router();

// Todas las rutas de pedidos requieren estar autenticado
orderRouter.use(authMiddleware);

// POST /api/orders - Crear pedido a nombre del usuario autenticado en el token
orderRouter.post(
  "/",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const { items } = req.body ?? {};
      const order = await orderService.create(userId, { items });
      res.status(201).json({
        message: "Pedido creado exitosamente",
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/orders/mias - Ver solo los pedidos del usuario autenticado
orderRouter.get(
  "/mias",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const orders = await orderService.getMyOrders(userId);
      res.status(200).json({ data: orders });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/orders - Solo admin: ver todos los pedidos del sistema
orderRouter.get(
  "/",
  soloAdmin,
  async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orders = await orderService.getAllOrders();
      res.status(200).json({ data: orders });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/orders/:id - Detalle de un pedido (dueño o admin)
orderRouter.get(
  "/:id",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);
      const order = await orderService.getOrderById(id);

      if (req.user!.role !== "ADMIN" && order.userId !== req.user!.id) {
        throw new ForbiddenError("No tienes permiso para ver este pedido");
      }

      res.status(200).json({ data: order });
    } catch (error) {
      next(error);
    }
  }
);
