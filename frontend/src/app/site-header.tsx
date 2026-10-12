"use client";

import { useState } from "react";

const navigationLinks = [
  { href: "#inicio", label: "Inicio" },
  { href: "#cubos", label: "Cubos" },
  { href: "#metodos", label: "Métodos" },
  { href: "#tienda", label: "Tienda" },
];

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  function toggleTheme() {
    const isDark = document.documentElement.dataset.theme !== "dark";
    document.documentElement.dataset.theme = isDark ? "dark" : "light";
    localStorage.setItem("tema", isDark ? "oscuro" : "claro");
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <a
          href="#inicio"
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
        </a>

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
            {navigationLinks.map((link, index) => (
              <li key={link.href}>
                <a
                  className={index === 0 ? "navigation-link is-active" : "navigation-link"}
                  href={link.href}
                  onClick={closeMenu}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="theme-toggle"
            aria-label="Cambiar tema de color"
            onClick={toggleTheme}
          >
            <span className="theme-toggle-icon" aria-hidden="true" />
            <span className="theme-toggle-label" />
          </button>
        </nav>
      </div>
    </header>
  );
}
