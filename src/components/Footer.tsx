"use client";

import { useEffect } from 'react';

export default function Footer() {
  return (
    <footer className="final-section" onMouseMove={(e) => {
      const x = e.clientX / window.innerWidth;
      const texts = document.querySelector('.final-texts') as HTMLElement;
      if (texts) {
        texts.style.transform = `translateX(-${x * 300}px)`;
      }
    }}>
      <div className="final-container">
        <div className="final-content">
          <div className="final-logo">
        <img src="/logo-gad.png" alt="GAD Municipal Sigchos logo" className="final-logo-img" style={{ height: "2em", width: "auto", display: "block" }}/>
        Visita <span className="final-logo-bold">SIGCHOS</span>
          </div>
          <nav className="final-nav">
        <a href="/">INICIO</a>
        <a href="/contactos">CONTACTO</a>
        <a href="/admin">ADMIN PANEL</a>
          </nav>
          <div className="final-legal">
        <a href="/terms">Terms & Conditions</a>
        <a href="/privacy">Privacy Policy</a>
        <a href="/cookies">Cookie Policy</a>
          </div>
          <div className="final-copyright">
        Powered by GAD Municipal Sigchos © 2025 Visita{" "}
        <span className="final-copyright-bold">SIGCHOS</span>
          </div>
        </div>
      </div>
      <div className="final-texts">
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} className="final-text">
        visita <span className="final-text-bold">SIGCHOS</span>
          </span>
        ))}
      </div>
    </footer>
  );
}
