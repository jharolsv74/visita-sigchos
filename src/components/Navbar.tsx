"use client";

import { useEffect, useState } from "react";

const BREAKPOINT = 1100; // debe coincidir con el CSS

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Efecto scroll (cambia fondo/altura)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cerrar menú al pasar a desktop y bloquear scroll al abrir menú móvil
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= BREAKPOINT && menuOpen) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [menuOpen]);

  useEffect(() => {
    const isDesktop = typeof window !== "undefined" && window.innerWidth >= BREAKPOINT;
    document.body.style.overflow = menuOpen && !isDesktop ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <nav
      className={`navbar${scrolled ? " navbar-scrolled" : ""}`}
      role="navigation"
      aria-label="Principal"
    >
      <div
        className="navbar-logo"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          cursor: "pointer",
        }}
        role="link"
        tabIndex={0}
        onClick={() => (window.location.href = "/")}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
            window.location.href = "/";
          }
        }}
      >
        <span className="navbar-logo-text">
          Visita <span className="navbar-logo-bold">SIGCHOS</span>
        </span>
        <img
          src="/logo-gad.png"
          alt="Logo GAD"
          className="navbar-logo-img"
          style={{ height: "2em", width: "auto", display: "block" }}
        />
      </div>

      <button
        className="navbar-toggle"
        aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={menuOpen}
        aria-controls="navbar-links"
        onClick={() => setMenuOpen((v) => !v)}
      >
        <span className="sr-only">{menuOpen ? "Cerrar menú" : "Abrir menú"}</span>
        <div className={`hamburger ${menuOpen ? "open" : ""}`} aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>

      <ul id="navbar-links" className={`navbar-links ${menuOpen ? "open" : ""}`}>
        <li><a href="/" onClick={() => setMenuOpen(false)}>INICIO</a></li>
        <li><a href="/atractivos" onClick={() => setMenuOpen(false)}>ATRACTIVOS</a></li>
        <li><a href="/mapa-sigchos" onClick={() => setMenuOpen(false)}>MAPA</a></li>
        <li><a href="/emprendimientos" onClick={() => setMenuOpen(false)}>EMPRENDIMIENTOS</a></li>
        <li><a href="/autoridades" onClick={() => setMenuOpen(false)}>AUTORIDADES</a></li>
        <li><a href="/contactos" onClick={() => setMenuOpen(false)}>CONTACTOS</a></li>
      </ul>
    </nav>
  );
}