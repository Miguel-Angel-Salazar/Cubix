import Image from "next/image";
import React from "react";
import { Button } from "../../common/components";
import { Product } from "../domain";

interface ProductCardProps {
  product: Product;
  onOrderClick?: (product: Product) => void;
}

export function ProductCard({ product, onOrderClick }: ProductCardProps) {
  const formattedPrice = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(product.priceCop);

  const categoryLabels = {
    CUBOS: "Cubos",
    PUZZLES: "Puzzles",
    ACCESORIOS: "Accesorios",
  };

  return (
    <article className="group flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden text-left">
      <div className="relative w-full aspect-4/3 bg-slate-100 dark:bg-slate-800/80 overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-slate-900/80 dark:bg-slate-950/80 text-white backdrop-blur-xs border border-white/10">
            {categoryLabels[product.category] || product.category}
          </span>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1">
          {product.name}
        </h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed flex-1">
          {product.description}
        </p>

        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
          <div>
            <span className="block text-xs uppercase font-medium text-slate-400">
              Precio
            </span>
            <span className="text-lg font-black text-blue-600 dark:text-blue-400">
              {formattedPrice}
            </span>
          </div>

          {onOrderClick && (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => onOrderClick(product)}
            >
              Pedir ahora
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
