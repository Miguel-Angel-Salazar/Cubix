import {
  ProductEntity,
  CreateProductDto,
  UpdateProductDto,
  ProductFilterParams,
} from "../domain/product.entity";
import { PaginatedResponse } from "../domain/pagination";
import { BadRequestError, NotFoundError } from "../domain/errors";
import { productRepository, ProductRepository } from "../infrastructure/repositories/product.repository";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export class ProductService {
  constructor(private productRepo: ProductRepository = productRepository) {}

  async getAll(params: ProductFilterParams): Promise<PaginatedResponse<ProductEntity>> {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(params.limit) || 6));

    const { items, total } = await this.productRepo.findAll({
      ...params,
      page,
      limit,
    });

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      data: items,
    };
  }

  async getById(id: string): Promise<ProductEntity> {
    const product = await this.productRepo.findById(id);
    if (!product) {
      throw new NotFoundError("Producto no encontrado");
    }
    return product;
  }

  async create(dto: CreateProductDto): Promise<ProductEntity> {
    if (!dto.name || dto.name.trim().length < 2) {
      throw new BadRequestError("El nombre del producto es obligatorio (mínimo 2 caracteres)");
    }

    if (!dto.category || !["CUBOS", "PUZZLES", "ACCESORIOS"].includes(dto.category)) {
      throw new BadRequestError("Categoría inválida. Debe ser CUBOS, PUZZLES o ACCESORIOS");
    }

    if (dto.priceCop === undefined || isNaN(Number(dto.priceCop)) || Number(dto.priceCop) < 0) {
      throw new BadRequestError("El precio debe ser un número mayor o igual a 0");
    }

    if (!dto.imageUrl || dto.imageUrl.trim() === "") {
      throw new BadRequestError("La imagen del producto es obligatoria");
    }

    const baseSlug = dto.slug ? slugify(dto.slug) : slugify(dto.name);
    let finalSlug = baseSlug;
    const existing = await this.productRepo.findBySlug(finalSlug);
    if (existing) {
      finalSlug = `${baseSlug}-${Date.now().toString(36)}`;
    }

    return this.productRepo.create({
      ...dto,
      name: dto.name.trim(),
      description: dto.description?.trim() ?? "",
      priceCop: Number(dto.priceCop),
      slug: finalSlug,
    });
  }

  async update(id: string, dto: UpdateProductDto): Promise<ProductEntity> {
    const existing = await this.productRepo.findById(id);
    if (!existing) {
      throw new NotFoundError("Producto no encontrado");
    }

    if (dto.category && !["CUBOS", "PUZZLES", "ACCESORIOS"].includes(dto.category)) {
      throw new BadRequestError("Categoría inválida. Debe ser CUBOS, PUZZLES o ACCESORIOS");
    }

    if (dto.priceCop !== undefined && (isNaN(Number(dto.priceCop)) || Number(dto.priceCop) < 0)) {
      throw new BadRequestError("El precio debe ser un número mayor o igual a 0");
    }

    return this.productRepo.update(id, {
      ...dto,
      ...(dto.name && { name: dto.name.trim() }),
      ...(dto.description !== undefined && { description: dto.description.trim() }),
      ...(dto.priceCop !== undefined && { priceCop: Number(dto.priceCop) }),
    });
  }

  async delete(id: string): Promise<void> {
    const existing = await this.productRepo.findById(id);
    if (!existing) {
      throw new NotFoundError("Producto no encontrado");
    }
    await this.productRepo.delete(id);
  }
}

export const productService = new ProductService();
