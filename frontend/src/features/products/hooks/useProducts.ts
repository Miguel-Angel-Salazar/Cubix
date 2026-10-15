"use client";

import { useCallback, useEffect, useState } from "react";
import { PaginatedProducts, Product, ProductFilters } from "../domain";
import { ProductService } from "../services/product.service";

interface UseProductsOptions extends ProductFilters {
  autoFetch?: boolean;
}

export function useProducts(initialFilters: UseProductsOptions = {}) {
  const [filters, setFilters] = useState<ProductFilters>(initialFilters);
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginatedProducts["pagination"]>({
    total: 0,
    page: filters.page || 1,
    limit: filters.limit || 6,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(
    async (currentFilters: ProductFilters = filters) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await ProductService.getAll(currentFilters);
        setProducts(response.data);
        setPagination(response.pagination);
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "No se pudo cargar el catálogo de productos.";
        setError(message);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    },
    [filters]
  );

  useEffect(() => {
    fetchProducts(filters);
  }, [filters, fetchProducts]);

  const updateFilters = useCallback((newFilters: Partial<ProductFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      // Si cambia filtro de búsqueda o categoría, reiniciar a página 1 salvo que se especifique página
      page: newFilters.page !== undefined ? newFilters.page : 1,
    }));
  }, []);

  const setPage = useCallback((newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  }, []);

  return {
    products,
    pagination,
    isLoading,
    isError: Boolean(error),
    error,
    filters,
    setFilters: updateFilters,
    setPage,
    refetch: () => fetchProducts(filters),
  };
}
