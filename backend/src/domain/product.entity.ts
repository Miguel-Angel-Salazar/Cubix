import { PaginationParams } from "./pagination";

export type ProductCategory = "CUBOS" | "PUZZLES" | "ACCESORIOS";

export interface ProductEntity {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: ProductCategory;
  priceCop: number;
  imageUrl: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductDto {
  slug?: string;
  name: string;
  description: string;
  category: ProductCategory;
  priceCop: number;
  imageUrl: string;
  isActive?: boolean;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  category?: ProductCategory;
  priceCop?: number;
  imageUrl?: string;
  isActive?: boolean;
}

export interface ProductFilterParams extends Partial<PaginationParams> {
  category?: ProductCategory;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}
