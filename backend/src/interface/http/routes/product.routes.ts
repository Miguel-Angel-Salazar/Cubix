import { Router, Request, Response, NextFunction } from "express";
import { productService } from "../../../application/product.service";
import { authMiddleware } from "../middlewares/auth.middleware";
import { soloAdmin } from "../middlewares/role.middleware";
import { ProductCategory } from "../../../domain/product.entity";

export const productRouter = Router();

// GET /api/products - Público, con paginación { pagination, data }
productRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = req.query.page ? Number(req.query.page) : undefined;
      const limit = req.query.limit ? Number(req.query.limit) : undefined;
      const category = req.query.category as ProductCategory | undefined;
      const search = req.query.search as string | undefined;
      const minPrice = req.query.minPrice ? Number(req.query.minPrice) : undefined;
      const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;

      const result = await productService.getAll({
        page,
        limit,
        category,
        search,
        minPrice,
        maxPrice,
      });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/products/:id - Público
productRouter.get(
  "/:id",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);
      const product = await productService.getById(id);
      res.status(200).json({ data: product });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/products - Solo admin
productRouter.post(
  "/",
  authMiddleware,
  soloAdmin,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, description, category, priceCop, imageUrl, isActive, slug } = req.body ?? {};
      const product = await productService.create({
        name,
        description,
        category,
        priceCop,
        imageUrl,
        isActive,
        slug,
      });
      res.status(201).json({
        message: "Producto creado exitosamente",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }
);

// PUT /api/products/:id - Solo admin
productRouter.put(
  "/:id",
  authMiddleware,
  soloAdmin,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);
      const { name, description, category, priceCop, imageUrl, isActive } = req.body ?? {};
      const updated = await productService.update(id, {
        name,
        description,
        category,
        priceCop,
        imageUrl,
        isActive,
      });
      res.status(200).json({
        message: "Producto actualizado exitosamente",
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/products/:id - Solo admin
productRouter.delete(
  "/:id",
  authMiddleware,
  soloAdmin,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);
      await productService.delete(id);
      res.status(200).json({
        message: "Producto eliminado exitosamente",
      });
    } catch (error) {
      next(error);
    }
  }
);
