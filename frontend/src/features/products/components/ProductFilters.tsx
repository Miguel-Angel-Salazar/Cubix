"use client";

import React, { useState } from "react";
import { Button, Input } from "../../common/components";
import { ProductCategory, ProductFilters as FilterType } from "../domain";

interface ProductFiltersProps {
  currentFilters: FilterType;
  onFilterChange: (filters: Partial<FilterType>) => void;
}

export function ProductFilters({
  currentFilters,
  onFilterChange,
}: ProductFiltersProps) {
  const [search, setSearch] = useState(currentFilters.search || "");
  const [minPrice, setMinPrice] = useState(
    currentFilters.minPrice ? String(currentFilters.minPrice) : ""
  );
  const [maxPrice, setMaxPrice] = useState(
    currentFilters.maxPrice ? String(currentFilters.maxPrice) : ""
  );

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onFilterChange({
      category: value === "TODOS" ? undefined : (value as ProductCategory),
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({
      search: search.trim() ? search.trim() : undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    });
  };

  const handleReset = () => {
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    onFilterChange({
      category: undefined,
      search: undefined,
      minPrice: undefined,
      maxPrice: undefined,
    });
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 mb-8 shadow-sm">
      <form onSubmit={handleSearchSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          {/* Búsqueda por texto */}
          <div>
            <label
              htmlFor="filter-search"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Buscar producto
            </label>
            <Input
              id="filter-search"
              placeholder="Ej: MoYu, Pyraminx, GAN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filtro por categoría */}
          <div>
            <label
              htmlFor="filter-category"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Categoría
            </label>
            <select
              id="filter-category"
              value={currentFilters.category || "TODOS"}
              onChange={handleCategoryChange}
              className="w-full px-4 py-2.5 rounded-xl border text-sm transition-all duration-200 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-slate-300 dark:border-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="TODOS">Todas las categorías</option>
              <option value="CUBOS">Cubos</option>
              <option value="PUZZLES">Puzzles</option>
              <option value="ACCESORIOS">Accesorios</option>
            </select>
          </div>

          {/* Rango de precio mínimo */}
          <div>
            <label
              htmlFor="filter-min-price"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Precio mín. ($ COP)
            </label>
            <Input
              id="filter-min-price"
              type="number"
              placeholder="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </div>

          {/* Rango de precio máximo */}
          <div>
            <label
              htmlFor="filter-max-price"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Precio máx. ($ COP)
            </label>
            <Input
              id="filter-max-price"
              type="number"
              placeholder="150000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="ghost" size="sm" onClick={handleReset}>
            Limpiar filtros
          </Button>
          <Button type="submit" variant="primary" size="sm">
            Aplicar filtros
          </Button>
        </div>
      </form>
    </div>
  );
}
