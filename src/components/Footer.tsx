"use client";

import { useEffect, useRef } from 'react';

export default function Footer() {
  const textsRef = useRef<HTMLElement | null>(null);

  // Attach ref after mount to avoid querying on every mouse move
  useEffect(() => {
    textsRef.current = document.querySelector('.final-texts') as HTMLElement | null;

    // Reset transform when resizing to ensure mobile layout doesn't keep desktop transform
    const onResize = () => {
      if (textsRef.current) textsRef.current.style.transform = '';
    };

    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // Only apply mouse move transform on pointer-capable, large screens
  const handleMouseMove = (e: React.MouseEvent) => {
    // disable on small screens
    if (window.innerWidth <= 768) return;
    const x = e.clientX / window.innerWidth;
    if (textsRef.current) {
      // limit the translation to a reasonable range
      const max = 300;
      const translateX = Math.max(-max, Math.min(0, -x * max));
      textsRef.current.style.transform = `translateX(${translateX}px)`;
    }
  };

  return (
    <footer className="final-section" onMouseMove={handleMouseMove}>
      <div className="final-container">
        <div className="final-content">
          <div className="final-logo">
            <img src="/logo-gad.png" alt="GAD Municipal Sigchos logo" className="final-logo-img" style={{ height: "2em", width: "auto", display: "block" }}/>
            Visita <span className="final-logo-bold">SIGCHOS</span>
          </div>
          <nav className="final-nav">
            <a href="/">INICIO</a>
            <a href="/contactos">CONTACTO</a>
            <a href="/mapa-sigchos">MAPA DE SIGCHOS</a>
          </nav>
          <div className="final-legal">
            <a href="/politcs/terminos-y-condiciones">Términos y Condiciones</a>
            <a href="/politcs/politica-privacidad">Política de Privacidad</a>
            <a href="/politcs/aviso-cookies">Política de Cookies</a>
          </div>
          <div className="final-copyright">
            Powered by GAD Municipal Sigchos © 2025 Visita{' '}
            <span className="final-copyright-bold">SIGCHOS</span>
          </div>
        </div>
      </div>
      <div className="final-texts" aria-hidden>
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} className="final-text">
            visita <span className="final-text-bold">SIGCHOS</span>
          </span>
        ))}
      </div>
    </footer>
  );
}
