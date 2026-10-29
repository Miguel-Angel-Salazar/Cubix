"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import SiteHeader from "../site-header";
import { Alert, Modal, Pagination } from "../../features/common/components";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { ProductFilters } from "../../features/products/components/ProductFilters";
import { ProductGrid } from "../../features/products/components/ProductGrid";
import { ProductCategory, Product } from "../../features/products/domain";
import { useProducts } from "../../features/products/hooks/useProducts";
import { useOrderMutations } from "../../features/orders/hooks/useOrderMutations";

function parsePrice(value: string | null): number | undefined {
  if (!value) return undefined;
  const price = Number(value);
  return Number.isFinite(price) && price >= 0 ? price : undefined;
}

function TiendaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  const { createOrder } = useOrderMutations();

  const requestedPage = Number(searchParams.get("page") || "1");
  const urlPage = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const categoryParam = searchParams.get("categoria")?.toUpperCase();
  const urlCategory: ProductCategory | undefined =
    categoryParam === "CUBOS" || categoryParam === "PUZZLES" || categoryParam === "ACCESORIOS"
      ? categoryParam
      : undefined;
  const urlSearch = searchParams.get("q") || undefined;
  const urlMinPrice = parsePrice(searchParams.get("minPrice"));
  const urlMaxPrice = parsePrice(searchParams.get("maxPrice"));

  const {
    products,
    pagination,
    isLoading,
    isError,
    error,
    filters,
    setFilters,
    refetch,
  } = useProducts({
    page: urlPage,
    limit: 6,
    category: urlCategory,
    search: urlSearch,
    minPrice: urlMinPrice,
    maxPrice: urlMaxPrice,
  });

  useEffect(() => {
    if (
      filters.page !== urlPage ||
      filters.category !== urlCategory ||
      filters.search !== urlSearch ||
      filters.minPrice !== urlMinPrice ||
      filters.maxPrice !== urlMaxPrice
    ) {
      setFilters({
        page: urlPage,
        category: urlCategory,
        search: urlSearch,
        minPrice: urlMinPrice,
        maxPrice: urlMaxPrice,
      });
    }
  }, [
    filters,
    setFilters,
    urlCategory,
    urlMaxPrice,
    urlMinPrice,
    urlPage,
    urlSearch,
  ]);

  // Estado para el modal de compra / pedido rápido
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);

  // Sincronizar cambios en los filtros con la URL
  const handleFilterChange = (newFilters: Parameters<typeof setFilters>[0]) => {
    const nextFilters = { ...filters, ...newFilters, page: 1 };
    const params = new URLSearchParams();
    if (nextFilters.page > 1) {
      params.set("page", String(nextFilters.page));
    }
    if (nextFilters.category) {
      params.set("categoria", nextFilters.category.toLowerCase());
    }
    if (nextFilters.search) {
      params.set("q", nextFilters.search);
    }
    if (nextFilters.minPrice !== undefined) {
      params.set("minPrice", String(nextFilters.minPrice));
    }
    if (nextFilters.maxPrice !== undefined) {
      params.set("maxPrice", String(nextFilters.maxPrice));
    }
    const query = params.toString();
    router.push(`/tienda${query ? `?${query}` : ""}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`/tienda?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOrderClick = (product: Product) => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent("/tienda")}`);
      return;
    }
    setSelectedProduct(product);
    setOrderQuantity(1);
    setOrderSuccess(null);
    setOrderError(null);
  };

  const handleConfirmOrder = async () => {
    if (!selectedProduct) return;
    setIsOrdering(true);
    setOrderError(null);
    try {
      await createOrder({
        items: [
          {
            productId: selectedProduct.id,
            quantity: orderQuantity,
          },
        ],
      });
      setOrderSuccess(
        `¡Pedido registrado exitosamente! Se agregó ${orderQuantity}x "${selectedProduct.name}" a tus pedidos.`
      );
      setTimeout(() => {
        setSelectedProduct(null);
        setOrderSuccess(null);
      }, 2500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "No se pudo procesar el pedido.";
      setOrderError(msg);
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <>
      <SiteHeader />

      <main className="min-h-[calc(100vh-160px)] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <section className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs uppercase font-extrabold tracking-widest text-blue-600 dark:text-blue-400 mb-2 block">
            Catálogo Oficial CUBIX
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Tienda CUBIX
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            Encuentra cubos de Rubik, puzzles de velocidad y accesorios oficiales para practicar, aprender y bajar tus tiempos.
          </p>
        </section>

        {orderSuccess && (
          <div className="max-w-2xl mx-auto mb-6">
            <Alert type="success" title="¡Pedido confirmado!">
              {orderSuccess}
            </Alert>
          </div>
        )}

        {/* Filtros combinados */}
        <ProductFilters
          key={searchParams.toString()}
          currentFilters={filters}
          onFilterChange={handleFilterChange}
        />

        {/* Catálogo con estados de cargando, vacío, error y éxito */}
        <ProductGrid
          products={products}
          isLoading={isLoading}
          isError={isError}
          error={error}
          onRetry={refetch}
          onOrderClick={handleOrderClick}
        />

        {/* Paginación interactiva */}
        {!isLoading && !isError && pagination.totalPages > 1 && (
          <div className="mt-12">
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              baseUrl="/tienda"
              onPageChange={handlePageChange}
            />
          </div>
        )}

        {/* Modal de confirmación de pedido */}
        <Modal
          isOpen={Boolean(selectedProduct)}
          onClose={() => setSelectedProduct(null)}
          title="Confirmar pedido en CUBIX"
          confirmText="Confirmar pedido"
          onConfirm={handleConfirmOrder}
          isLoading={isOrdering}
        >
          {selectedProduct && (
            <div className="flex flex-col gap-3">
              <p>
                Estás a punto de solicitar <strong>{selectedProduct.name}</strong> a tu nombre.
              </p>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-sm font-medium">Cantidad:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setOrderQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm font-bold"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-bold text-sm">
                    {orderQuantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setOrderQuantity((q) => Math.min(10, q + 1))}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm font-bold pt-1">
                <span>Total a pagar:</span>
                <span className="text-blue-600 dark:text-blue-400 text-base">
                  {new Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                    maximumFractionDigits: 0,
                  }).format(selectedProduct.priceCop * orderQuantity)}
                </span>
              </div>
              {orderError && (
                <Alert type="error" className="mt-2">
                  {orderError}
                </Alert>
              )}
            </div>
          )}
        </Modal>
      </main>

      <footer className="site-footer">
        <div className="site-footer-inner">
          <p>
            <strong>CUBIX</strong> · El mundo del cubo de Rubik
          </p>
        </div>
      </footer>
    </>
  );
}

export default function TiendaPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-slate-400">Cargando tienda...</div>
        </div>
      }
    >
      <TiendaContent />
    </Suspense>
  );
}
