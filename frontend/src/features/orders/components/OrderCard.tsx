import { Order } from "../domain";

interface OrderCardProps {
  order: Order;
  showBuyer?: boolean;
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

function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(price);
}

export function OrderCard({ order, showBuyer = false }: OrderCardProps) {
  const status = statusLabels[order.status] || statusLabels.PENDING;
  const formattedDate = new Date(order.createdAt).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <article className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            Pedido: {order.id.slice(0, 12)}...
          </p>
          {showBuyer && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Usuario: {order.user?.name || order.user?.email || order.userId.slice(0, 12)}
            </p>
          )}
          <p className="text-xs text-slate-400 dark:text-slate-500">{formattedDate}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${status.className}`}>
            {status.text}
          </span>
          <span className="text-lg font-black text-blue-600 dark:text-blue-400">
            {formatPrice(order.totalCop)}
          </span>
        </div>
      </div>
      {order.items.length > 0 && (
        <ul className="text-xs text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3 space-y-1">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between">
              <span>
                {item.product?.name || item.productId.slice(0, 8)} × {item.quantity}
              </span>
              <span>{formatPrice(item.unitPriceCop * item.quantity)}</span>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}