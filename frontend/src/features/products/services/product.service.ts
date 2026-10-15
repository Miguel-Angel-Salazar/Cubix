import { httpClient } from "../../common/http";
import {
  CreateProductInput,
  PaginatedProducts,
  Product,
  ProductFilters,
  SingleProductResponse,
  UpdateProductInput,
} from "../domain";

export class ProductService {
  /**
   * Obtiene la lista de productos paginada y filtrada
   */
  static async getAll(filters: ProductFilters = {}): Promise<PaginatedProducts> {
    return httpClient<PaginatedProducts>("/api/products", {
      params: {
        page: filters.page,
        limit: filters.limit,
        category: filters.category,
        search: filters.search,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
      },
    });
  }

  /**
   * Obtiene un producto por ID o slug
   */
  static async getById(id: string): Promise<Product> {
    const response = await httpClient<SingleProductResponse>(`/api/products/${id}`);
    return response.data;
  }

  /**
   * Crea un producto (requiere rol ADMIN)
   */
  static async create(productData: CreateProductInput): Promise<Product> {
    const response = await httpClient<{ data: Product }>("/api/products", {
      method: "POST",
      body: JSON.stringify(productData),
    });
    return response.data;
  }

  /**
   * Actualiza un producto existente (requiere rol ADMIN)
   */
  static async update(
    id: string,
    productData: UpdateProductInput
  ): Promise<Product> {
    const response = await httpClient<{ data: Product }>(`/api/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    });
    return response.data;
  }

  /**
   * Elimina un producto (requiere rol ADMIN)
   */
  static async delete(id: string): Promise<void> {
    await httpClient<{ message: string }>(`/api/products/${id}`, {
      method: "DELETE",
    });
  }
}
