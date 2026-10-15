import Link from "next/link";
import React from "react";

interface PaginationProps {
  page: number;
  totalPages: number;
  baseUrl?: string;
  queryParamName?: string;
  extraParams?: Record<string, string | number | undefined>;
  onPageChange?: (page: number) => void;
}

export function Pagination({
  page,
  totalPages,
  baseUrl = "",
  queryParamName = "page",
  extraParams = {},
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const buildUrl = (targetPage: number) => {
    const params = new URLSearchParams();
    Object.entries(extraParams).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") {
        params.append(k, String(v));
      }
    });
    params.set(queryParamName, String(targetPage));
    return `${baseUrl}?${params.toString()}`;
  };

  const pagesArray = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      className="flex items-center justify-center gap-2 my-8"
      aria-label="Paginación del catálogo"
    >
      {/* Botón anterior */}
      {page > 1 ? (
        onPageChange ? (
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            className="px-3.5 py-2 text-sm font-medium rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            ← Anterior
          </button>
        ) : (
          <Link
            href={buildUrl(page - 1)}
            className="px-3.5 py-2 text-sm font-medium rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            ← Anterior
          </Link>
        )
      ) : (
        <span className="px-3.5 py-2 text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-400 cursor-not-allowed">
          ← Anterior
        </span>
      )}

      {/* Páginas intermedias */}
      <div className="flex items-center gap-1.5">
        {pagesArray.map((p) => {
          const isActive = p === page;
          if (onPageChange) {
            return (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                className={`min-w-10 h-10 flex items-center justify-center text-sm font-semibold rounded-xl transition ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {p}
              </button>
            );
          }

          return (
            <Link
              key={p}
              href={buildUrl(p)}
              className={`min-w-10 h-10 flex items-center justify-center text-sm font-semibold rounded-xl transition ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              {p}
            </Link>
          );
        })}
      </div>

      {/* Botón siguiente */}
      {page < totalPages ? (
        onPageChange ? (
          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            className="px-3.5 py-2 text-sm font-medium rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            Siguiente →
          </button>
        ) : (
          <Link
            href={buildUrl(page + 1)}
            className="px-3.5 py-2 text-sm font-medium rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            Siguiente →
          </Link>
        )
      ) : (
        <span className="px-3.5 py-2 text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-400 cursor-not-allowed">
          Siguiente →
        </span>
      )}
    </nav>
  );
}
