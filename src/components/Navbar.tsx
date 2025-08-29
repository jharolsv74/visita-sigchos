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
      <div className="navbar-logo">
        Visita <span className="navbar-logo-bold">SIGCHOS</span>
      </div>
      <ul className="navbar-links">
        <li><a href="/">INICIO</a></li>
        <li><a href="/atractivos">ATRACTIVOS</a></li>
        <li><a href="/mapa-sigchos">MAPA</a></li>
        <li><a href="#autoridades">AUTORIDADES</a></li>
        <li><a href="/contactos">CONTACTOS</a></li>
      </ul>
    </nav>
  );
}
