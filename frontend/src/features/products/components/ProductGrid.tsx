import React from "react";
import { Alert, Button, Spinner } from "../../common/components";
import { Product } from "../domain";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  isError: boolean;
  error?: string | null;
  onRetry?: () => void;
  onOrderClick?: (product: Product) => void;
}

export function ProductGrid({
  products,
  isLoading,
  isError,
  error,
  onRetry,
  onOrderClick,
}: ProductGridProps) {
  // Estado de carga (Loading)
  if (isLoading) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20">
        <Spinner size="lg" label="Cargando catálogo de cubos y puzzles..." />
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 animate-pulse">
          Obteniendo productos desde la API...
        </p>
      </div>
    );
  }

  // Estado de error (Error)
  if (isError) {
    return (
      <div className="w-full max-w-lg mx-auto my-12 text-center">
        <Alert type="error" title="No se pudo cargar el catálogo">
          {error || "Ocurrió un error al consultar los productos en el servidor."}
        </Alert>
        {onRetry && (
          <div className="mt-4">
            <Button variant="secondary" onClick={onRetry}>
              Reintentar carga
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Estado vacío (Empty)
  if (!products || products.length === 0) {
    return (
      <div className="w-full py-16 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xs">
        <span className="text-5xl select-none" aria-hidden="true">
          🔍
        </span>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-4">
          No se encontraron productos
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">
          Intenta ajustar tus criterios de búsqueda, cambiar de categoría o limpiar los filtros.
        </p>
      </div>
    );
  }

  // Cuadrícula de productos
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onOrderClick={onOrderClick}
        />
      ))}
    </div>
  );
}
