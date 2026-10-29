"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import SiteHeader from "../site-header";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { useMyOrders } from "../../features/orders/hooks/useOrders";
import { OrderCard } from "../../features/orders/components/OrderCard";
import { Alert, Button, Spinner } from "../../features/common/components";
import Link from "next/link";

export default function MisPedidosPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { orders, isLoading, error, refetch } = useMyOrders(
    !authLoading && isAuthenticated
  );

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login?redirect=/mis-pedidos");
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading || !isAuthenticated) {
    return null;
  }

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
            <p>{error}</p>
            <Button className="mt-3" size="sm" onClick={() => void refetch()}>
              Reintentar
            </Button>
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
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
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
