import { prisma } from "../database/prisma";
import {
  ProductEntity,
  ProductCategory,
  CreateProductDto,
  UpdateProductDto,
  ProductFilterParams,
} from "../../domain/product.entity";
import { Prisma } from "@prisma/client";

export class ProductRepository {
  async findAll(params: ProductFilterParams): Promise<{ items: ProductEntity[]; total: number }> {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(params.limit) || 6));
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      isActive: true,
    };

    if (params.category) {
      where.category = params.category;
    }

    if (params.search && params.search.trim() !== "") {
      const searchTerm = params.search.trim();
      where.OR = [
        { name: { contains: searchTerm, mode: "insensitive" } },
        { description: { contains: searchTerm, mode: "insensitive" } },
      ];
    }

    if (params.minPrice !== undefined || params.maxPrice !== undefined) {
      where.priceCop = {};
      if (params.minPrice !== undefined) {
        where.priceCop.gte = Number(params.minPrice);
      }
      if (params.maxPrice !== undefined) {
        where.priceCop.lte = Number(params.maxPrice);
      }
    }

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      items: items.map((p) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        description: p.description,
        category: p.category as ProductCategory,
        priceCop: p.priceCop,
        imageUrl: p.imageUrl,
        isActive: p.isActive,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      })),
      total,
    };
  }

  async findById(id: string): Promise<ProductEntity | null> {
    const product = await prisma.product.findUnique({
      where: { id },
    });
    if (!product) return null;
    return {
      id: product.id,
      slug: product.slug,
      name: product.name,
      description: product.description,
      category: product.category as ProductCategory,
      priceCop: product.priceCop,
      imageUrl: product.imageUrl,
      isActive: product.isActive,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  async findBySlug(slug: string): Promise<ProductEntity | null> {
    const product = await prisma.product.findUnique({
      where: { slug },
    });
    if (!product) return null;
    return {
      id: product.id,
      slug: product.slug,
      name: product.name,
      description: product.description,
      category: product.category as ProductCategory,
      priceCop: product.priceCop,
      imageUrl: product.imageUrl,
      isActive: product.isActive,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  async create(data: CreateProductDto & { slug: string }): Promise<ProductEntity> {
    const product = await prisma.product.create({
      data: {
        slug: data.slug,
        name: data.name,
        description: data.description,
        category: data.category,
        priceCop: data.priceCop,
        imageUrl: data.imageUrl,
        isActive: data.isActive ?? true,
      },
    });

    return {
      id: product.id,
      slug: product.slug,
      name: product.name,
      description: product.description,
      category: product.category as ProductCategory,
      priceCop: product.priceCop,
      imageUrl: product.imageUrl,
      isActive: product.isActive,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  async update(id: string, data: UpdateProductDto): Promise<ProductEntity> {
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description && { description: data.description }),
        ...(data.category && { category: data.category }),
        ...(data.priceCop !== undefined && { priceCop: data.priceCop }),
        ...(data.imageUrl && { imageUrl: data.imageUrl }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    });

    return {
      id: product.id,
      slug: product.slug,
      name: product.name,
      description: product.description,
      category: product.category as ProductCategory,
      priceCop: product.priceCop,
      imageUrl: product.imageUrl,
      isActive: product.isActive,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  async delete(id: string): Promise<void> {
    await prisma.product.delete({
      where: { id },
    });
  }
}

export const productRepository = new ProductRepository();
