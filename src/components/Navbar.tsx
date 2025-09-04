"use client";

import { useEffect, useState } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar${scrolled ? " navbar-scrolled" : ""}`}>
      <div
        className="navbar-logo"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          cursor: 'url("/head.cur"), pointer' // usa /head.cur para un cursor personalizado; cae a pointer si no existe
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
      <ul className="navbar-links">
        <li><a href="/">INICIO</a></li>
        <li><a href="/atractivos">ATRACTIVOS</a></li>
        <li><a href="/mapa-sigchos">MAPA</a></li>
        <li><a href="/emprendimientos">EMPRENDIMIENTOS</a></li>
        <li><a href="/autoridades">AUTORIDADES</a></li>
        <li><a href="/contactos">CONTACTOS</a></li>
      </ul>
    </nav>
  );
}
