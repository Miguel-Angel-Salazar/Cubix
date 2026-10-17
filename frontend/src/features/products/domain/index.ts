export type ProductCategory = "CUBOS" | "PUZZLES" | "ACCESORIOS";

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: ProductCategory;
  priceCop: number;
  imageUrl: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  category?: ProductCategory;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedProducts {
  pagination: PaginationMeta;
  data: Product[];
}

export interface SingleProductResponse {
  data: Product;
}

export interface CreateProductInput {
  name: string;
  slug?: string;
  description: string;
  category: ProductCategory;
  priceCop: number;
  imageUrl: string;
  isActive?: boolean;
}

export type UpdateProductInput = Partial<CreateProductInput>;
