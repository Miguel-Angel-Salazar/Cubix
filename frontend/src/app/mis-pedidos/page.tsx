"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import SiteHeader from "../site-header";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { useMyOrders } from "../../features/orders/hooks/useOrders";
import { Alert, Spinner } from "../../features/common/components";
import Link from "next/link";

export default function MisPedidosPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { orders, isLoading, error, refetch } = useMyOrders();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login?redirect=/mis-pedidos");
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading || !isAuthenticated) {
    return null;
  }

  const statusLabels: Record<string, { text: string; className: string }> = {
    PENDING: {
      text: "Pendiente",
      className: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
    },
    CONFIRMED: {
      text: "Confirmado",
      className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
    },
    CANCELLED: {
      text: "Cancelado",
      className: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
    },
  };

  return (
    <>
      <SiteHeader />
      <main className="min-h-[calc(100vh-160px)] max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <section className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs uppercase font-extrabold tracking-widest text-blue-600 dark:text-blue-400 mb-2 block">
            Tu historial
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Mis Pedidos
          </h1>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-400">
            Aquí puedes revisar todos los pedidos que has realizado en CUBIX.
          </p>
        </section>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Spinner size="lg" />
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
              Cargando tus pedidos...
            </p>
          </div>
        )}

        {!isLoading && error && (
          <Alert type="error" title="Error al cargar los pedidos">
            {error}
          </Alert>
        )}

        {!isLoading && !error && orders.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8">
            <span className="text-5xl select-none" aria-hidden="true">📦</span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-4">
              Aún no tienes pedidos
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">
              Explora nuestra tienda y realiza tu primer pedido de cubos y accesorios.
            </p>
            <div className="mt-6">
              <Link
                href="/tienda"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition shadow-sm"
              >
                Ir a la tienda
              </Link>
            </div>
          </div>
        )}

        {!isLoading && !error && orders.length > 0 && (
          <div className="flex flex-col gap-6">
            {orders.map((order) => {
              const status = statusLabels[order.status] || statusLabels.PENDING;
              const formattedTotal = new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
                maximumFractionDigits: 0,
              }).format(order.totalCop);
              const formattedDate = new Date(order.createdAt).toLocaleDateString(
                "es-CO",
                { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }
              );

              return (
                <article
                  key={order.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                        ID: {order.id.slice(0, 12)}...
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {formattedDate}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${status.className}`}>
                        {status.text}
                      </span>
                      <span className="text-lg font-black text-blue-600 dark:text-blue-400">
                        {formattedTotal}
                      </span>
                    </div>
                  </div>

                  {order.items && order.items.length > 0 && (
                    <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                        Productos
                      </p>
                      <ul className="flex flex-col gap-2">
                        {order.items.map((item) => (
                          <li
                            key={item.id}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="text-slate-700 dark:text-slate-300">
                              {item.product?.name || `Producto ${item.productId.slice(0, 8)}`}
                              <span className="text-slate-400 ml-1">
                                × {item.quantity}
                              </span>
                            </span>
                            <span className="text-slate-600 dark:text-slate-400 font-medium">
                              {new Intl.NumberFormat("es-CO", {
                                style: "currency",
                                currency: "COP",
                                maximumFractionDigits: 0,
                              }).format(item.unitPriceCop * item.quantity)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </main>

      <footer className="site-footer">
        <div className="site-footer-inner">
          <p><strong>CUBIX</strong> · El mundo del cubo de Rubik</p>
        </div>
      </footer>
    </>
  );
}
