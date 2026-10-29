"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SiteHeader from "../site-header";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { useProducts } from "../../features/products/hooks/useProducts";
import { useProductMutations } from "../../features/products/hooks/useProductMutations";
import { useAllOrders } from "../../features/orders/hooks/useOrders";
import { OrderCard } from "../../features/orders/components/OrderCard";
import { Alert, Button, Input, Modal, Spinner } from "../../features/common/components";
import { Product, ProductCategory, CreateProductInput } from "../../features/products/domain";

const emptyProduct: CreateProductInput = {
  name: "",
  slug: "",
  description: "",
  category: "CUBOS",
  priceCop: 0,
  imageUrl: "/images/cubo-3x3.jpg",
  isActive: true,
};

export default function AdminPage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin, isLoading: authLoading } = useAuth();

  // Protección de ruta: solo admin
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.replace("/login?redirect=/admin");
      } else if (!isAdmin) {
        router.replace("/");
      }
    }
  }, [authLoading, isAuthenticated, isAdmin, router]);

  const {
    products,
    isLoading: productsLoading,
    isError: productsError,
    error: productsErrorMessage,
    refetch: refetchProducts,
  } = useProducts({ limit: 50 });
  const {
    orders,
    isLoading: ordersLoading,
    error: ordersError,
    refetch: refetchOrders,
  } = useAllOrders(!authLoading && isAuthenticated && isAdmin);
  const { createProduct, updateProduct, deleteProduct } = useProductMutations();

  // Estado para CRUD de productos
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<CreateProductInput>(emptyProduct);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Estado para confirmación de borrado
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Tabs del admin
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");

  if (authLoading || !isAuthenticated || !isAdmin) {
    return null;
  }

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setIsCreating(true);
    setFormData(emptyProduct);
    setFormError(null);
    setFormSuccess(null);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setIsCreating(true);
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description,
      category: product.category,
      priceCop: product.priceCop,
      imageUrl: product.imageUrl,
      isActive: product.isActive,
    });
    setFormError(null);
    setFormSuccess(null);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.description || !formData.priceCop) {
      setFormError("Completa todos los campos requeridos (nombre, descripción, precio).");
      return;
    }
    setIsSaving(true);
    setFormError(null);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
        setFormSuccess("Producto actualizado exitosamente.");
      } else {
        await createProduct(formData);
        setFormSuccess("Producto creado exitosamente.");
      }
      refetchProducts();
      setTimeout(() => {
        setIsCreating(false);
        setFormSuccess(null);
      }, 1500);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Error al guardar el producto.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteProduct(deleteTarget.id);
      refetchProducts();
      setDeleteTarget(null);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Error al eliminar el producto.");
    } finally {
      setIsDeleting(false);
    }
  };

  const formattedPrice = (price: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <>
      <SiteHeader />
      <main className="min-h-[calc(100vh-160px)] max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <section className="text-center max-w-3xl mx-auto mb-8">
          <span className="text-xs uppercase font-extrabold tracking-widest text-blue-600 dark:text-blue-400 mb-2 block">
            Panel de control
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Administración
          </h1>
          <p className="mt-2 text-base text-slate-600 dark:text-slate-400">
            Gestiona el catálogo de productos y revisa todos los pedidos del sistema.
          </p>
        </section>

        <div className="flex justify-center gap-2 mb-8">
          <button
            type="button"
            onClick={() => setActiveTab("products")}
            className={`px-5 py-2.5 text-sm font-semibold rounded-xl transition ${
              activeTab === "products"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
            }`}
          >
            🛒 Productos ({products.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            className={`px-5 py-2.5 text-sm font-semibold rounded-xl transition ${
              activeTab === "orders"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
            }`}
          >
            📦 Pedidos ({orders.length})
          </button>
        </div>

        {formError && !isCreating && (
          <Alert type="error" className="mb-4">{formError}</Alert>
        )}

        {activeTab === "products" && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Catálogo de productos
              </h2>
              <Button variant="primary" size="sm" onClick={handleOpenCreate}>
                + Nuevo producto
              </Button>
            </div>

            {productsLoading ? (
              <div className="flex justify-center py-12">
                <Spinner size="lg" />
              </div>
            ) : productsError ? (
              <Alert type="error" title="No se pudo cargar el catálogo">
                <p>{productsErrorMessage}</p>
                <Button className="mt-3" size="sm" onClick={() => void refetchProducts()}>
                  Reintentar
                </Button>
              </Alert>
            ) : products.length === 0 ? (
              <Alert type="info">No hay productos en el catálogo.</Alert>
            ) : (
              <div className="overflow-x-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      <th className="px-5 py-3 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Nombre</th>
                      <th className="px-5 py-3 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Categoría</th>
                      <th className="px-5 py-3 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Precio</th>
                      <th className="px-5 py-3 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Estado</th>
                      <th className="px-5 py-3 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b border-slate-50 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
                      >
                        <td className="px-5 py-3 font-medium text-slate-800 dark:text-slate-200 max-w-[200px] truncate">
                          {product.name}
                        </td>
                        <td className="px-5 py-3 text-slate-600 dark:text-slate-400 capitalize">
                          {product.category.toLowerCase()}
                        </td>
                        <td className="px-5 py-3 text-slate-700 dark:text-slate-300 font-semibold">
                          {formattedPrice(product.priceCop)}
                        </td>
                        <td className="px-5 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                            product.isActive
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                              : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-500"
                          }`}>
                            {product.isActive ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenEdit(product)}
                            >
                              Editar
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => setDeleteTarget(product)}
                            >
                              Eliminar
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* ──── Tab de Pedidos ──── */}
        {activeTab === "orders" && (
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
              Todos los pedidos
            </h2>

            {ordersLoading ? (
              <div className="flex justify-center py-12">
                <Spinner size="lg" />
              </div>
            ) : ordersError ? (
              <Alert type="error" title="No se pudieron cargar los pedidos">
                <p>{ordersError}</p>
                <Button className="mt-3" size="sm" onClick={() => void refetchOrders()}>
                  Reintentar
                </Button>
              </Alert>
            ) : orders.length === 0 ? (
              <Alert type="info">No hay pedidos registrados en el sistema.</Alert>
            ) : (
              <div className="flex flex-col gap-4">
                {orders.map((order) => (
                  <OrderCard key={order.id} order={order} showBuyer />
                ))}
              </div>
            )}
          </section>
        )}

        {/* ──── Modal de Crear / Editar Producto ──── */}
        {isCreating && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 overflow-y-auto max-h-[90vh]">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                {editingProduct ? "Editar producto" : "Crear nuevo producto"}
              </h3>

              {formError && <Alert type="error" className="mb-3">{formError}</Alert>}
              {formSuccess && <Alert type="success" className="mb-3">{formSuccess}</Alert>}

              <div className="flex flex-col gap-3.5">
                <Input
                  label="Nombre"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Cubo 3x3 MoYu RS3M"
                />
                <Input
                  label="Slug (URL amigable)"
                  name="slug"
                  value={formData.slug || ""}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="cubo-3x3-moyu-rs3m-v5"
                />
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Descripción
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descripción del producto..."
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-slate-300 dark:border-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Categoría
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                      className="w-full px-4 py-2.5 rounded-xl border text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-slate-300 dark:border-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                    >
                      <option value="CUBOS">Cubos</option>
                      <option value="PUZZLES">Puzzles</option>
                      <option value="ACCESORIOS">Accesorios</option>
                    </select>
                  </div>
                  <Input
                    label="Precio (COP)"
                    name="priceCop"
                    type="number"
                    value={String(formData.priceCop)}
                    onChange={(e) => setFormData({ ...formData, priceCop: Number(e.target.value) })}
                    placeholder="45000"
                  />
                </div>
                <Input
                  label="URL de imagen"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="/images/cubo-3x3.jpg"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-5 mt-4 border-t border-slate-100 dark:border-slate-800">
                <Button
                  variant="outline"
                  onClick={() => { setIsCreating(false); setFormError(null); setFormSuccess(null); }}
                  disabled={isSaving}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSave}
                  isLoading={isSaving}
                >
                  {editingProduct ? "Guardar cambios" : "Crear producto"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ──── Modal de Confirmación de Borrado ──── */}
        <Modal
          isOpen={Boolean(deleteTarget)}
          onClose={() => setDeleteTarget(null)}
          title="Eliminar producto"
          confirmText="Sí, eliminar"
          confirmVariant="danger"
          onConfirm={handleDelete}
          isLoading={isDeleting}
        >
          <p>
            ¿Estás seguro de que deseas eliminar <strong>{deleteTarget?.name}</strong>?
            Esta acción no se puede deshacer.
          </p>
        </Modal>
      </main>

      <footer className="site-footer">
        <div className="site-footer-inner">
          <p><strong>CUBIX</strong> · El mundo del cubo de Rubik</p>
        </div>
      </footer>
    </>
  );
}
