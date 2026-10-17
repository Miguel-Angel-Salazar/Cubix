"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../features/auth/hooks/useAuth";

const publicNavLinks = [
  { href: "/", label: "Inicio" },
  { href: "/cubos", label: "Cubos" },
  { href: "/metodos", label: "Métodos" },
  { href: "/blog", label: "Blog" },
  { href: "/tienda", label: "Tienda" },
  { href: "/contacto", label: "Contacto" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, isLoading, logout } = useAuth();

  function toggleTheme() {
    const isDark = document.documentElement.dataset.theme !== "dark";
    document.documentElement.dataset.theme = isDark ? "dark" : "light";
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("tema", isDark ? "oscuro" : "claro");
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link
          href="/"
          className="site-brand"
          aria-label="CUBIX, inicio"
          onClick={closeMenu}
        >
          <span className="site-brand-icon" aria-hidden="true">
            🧊
          </span>
          <span>
            <span className="site-brand-name">CUBIX</span>
            <span className="site-tagline">El mundo del cubo de Rubik</span>
          </span>
        </Link>

        <button
          type="button"
          className={`menu-toggle${menuOpen ? " is-open" : ""}`}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((isOpen) => !isOpen)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav
          id="primary-navigation"
          aria-label="Navegación principal"
          className={`primary-navigation${menuOpen ? " is-open" : ""}`}
        >
          <ul className="navigation-links">
            {publicNavLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`navigation-link${isActive ? " is-active" : ""}`}
                    onClick={closeMenu}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}

            {/* Enlace a Mis Pedidos si está autenticado */}
            {isAuthenticated && (
              <li>
                <Link
                  href="/mis-pedidos"
                  className={`navigation-link${pathname === "/mis-pedidos" ? " is-active" : ""}`}
                  onClick={closeMenu}
                >
                  Mis Pedidos
                </Link>
              </li>
            )}

            {/* Enlace a Administración solo si es ADMIN */}
            {isAdmin && (
              <li>
                <Link
                  href="/admin"
                  className={`navigation-link${pathname.startsWith("/admin") ? " is-active" : ""}`}
                  onClick={closeMenu}
                >
                  Administración
                </Link>
              </li>
            )}
          </ul>

          <div className="flex items-center gap-3 ml-auto">
            {!isLoading && (
              <>
                {isAuthenticated ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 max-w-[140px] truncate">
                      👤 {user?.name.split(" ")[0]}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        closeMenu();
                      }}
                      className="text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 transition"
                      aria-label="Cerrar sesión"
                    >
                      Salir
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link
                      href="/login"
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition shadow-xs"
                      onClick={closeMenu}
                    >
                      Ingresar
                    </Link>
                  </div>
                )}
              </>
            )}

            <button
              type="button"
              className="theme-toggle"
              aria-label="Cambiar tema de color"
              onClick={toggleTheme}
            >
              <span className="theme-toggle-icon" aria-hidden="true" />
              <span className="theme-toggle-label" />
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
