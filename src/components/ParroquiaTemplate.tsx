"use client";

import React, { useEffect, useRef, useState } from 'react';
import type { Parroquia } from '@/types/db';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getParroquias, normalizeToSlug } from '@/services/parroquias.service';
import { useRouter } from 'next/navigation';

type Props = {
  parroquia: Parroquia;
};

export default function ParroquiaTemplate({ parroquia }: Props) {
  const hero = parroquia.ImagenUrl || '/Home.jpg';

  // Carousel state for parroquias list
  const [parroquiasList, setParroquiasList] = useState<Parroquia[]>([]);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const router = useRouter();
  const carouselRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getParroquias(0, 11);
        if (!mounted) return;
        setParroquiasList(data);
      } catch (err) {
        console.error('Failed to fetch parroquias for slider', err);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const itemsToUse = (parroquiasList && parroquiasList.length > 0)
    ? parroquiasList.map((p) => ({
        image: p.ImagenUrl || '/icon-site-sigchos.png',
        title: p.Nombre || 'Parroquia',
        desc: p.Descripcion || '',
        btn: p.Nombre || 'Ver'
      }))
    : [];

  // Infinite carousel for parroquias using carouselRef - simplified
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const slides = itemsToUse.length;
    if (slides === 0) return;

    // Position at middle group initially
    const groupWidth = el.scrollWidth / 3;
    requestAnimationFrame(() => {
      el.scrollLeft = groupWidth;
    });

    let scrollEndTimer: number | null = null;
    let isAdjusting = false;

    function onScroll() {
      if (!el || isAdjusting) return;
      
      // Clear any pending timer
      if (scrollEndTimer) window.clearTimeout(scrollEndTimer);
      
      // Only handle wrapping when scroll stops for a moment
      scrollEndTimer = window.setTimeout(() => {
        const left = el.scrollLeft;
        const gw = groupWidth;
        
        // Handle infinite wrapping only
        if (left < gw * 0.1) {
          isAdjusting = true;
          el.scrollLeft = left + gw;
          isAdjusting = false;
        } else if (left > gw * 1.9) {
          isAdjusting = true;
          el.scrollLeft = left - gw;
          isAdjusting = false;
        }
      }, 150) as unknown as number; // Longer delay to avoid interrupting user scroll
    }

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      if (scrollEndTimer) window.clearTimeout(scrollEndTimer);
    };
  }, [itemsToUse]);

  return (
    <div className="parroquia-page">
      <Navbar />

      {/* Full-bleed hero */}
      <header
        className="hero-full"
        style={{ backgroundImage: `url(${hero})`, padding: '150px 0' }}
      >
        <div className="hero-overlay" />
        <div className="hero-content" style={{ padding: '96px 20px' }}>
          <h1 className="hero-title">{parroquia.Nombre}</h1>
          <p className="hero-sub">
            {parroquia.Descripcion
              ? parroquia.Descripcion.length > 130
                ? parroquia.Descripcion.slice(0, 130) + '…'
                : parroquia.Descripcion
              : ''}
          </p>
          <button
            className="hero-cta"
            onClick={() => {
              const el = document.getElementById('sobre-la-parroquia');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Más información
          </button>
        </div>
      </header>

      {/* Content area: main + sidebar */}
      <main className="container">
        <div className="content-grid">
          <article className="main-col">
            <section
              id="sobre-la-parroquia"
              className="section-card sobre-parroquia"
              style={{
                padding: '28px',
                borderRadius: '14px',
                background: 'linear-gradient(180deg, #fff7e6 0%, #e6f3ff 100%)',
                boxShadow: '0 18px 40px rgba(2,6,23,0.06)'
              }}
            >
              <h2
                style={{
                  fontSize: 'clamp(24px, 4.5vw, 40px)',
                  margin: '0 0 12px',
                  color: '#07101a',
                  fontWeight: 800,
                  letterSpacing: '-0.5px',
                }}
              >
                Sobre la parroquia
              </h2>
              <p
                className="lead"
                style={{
                  color: '#233042',
                  lineHeight: 1.85,
                  margin: 0,
                  fontSize: '1rem',
                  textAlign: 'justify',
                  textJustify: 'inter-word'
                }}
              >
                {parroquia.Descripcion || 'No hay descripción disponible para esta parroquia.'}
              </p>
            </section>

            {/* Optional: if more info appears later, this area will expand with galleries, puntos, etc. */}
          </article>

          <aside className="side-col">
            <div
              className="card"
              style={{
                background: 'linear-gradient(135deg, #ff7eb3 0%, #7afcff 50%, #ffde7a 100%)',
                color: '#07101a',
                boxShadow: '0 10px 30px rgba(2,6,23,0.12)'
              }}
            >
              <h3>Conoce</h3>
              <p className="muted" style={{ color: 'rgba(7,16,26,0.85)' }}>
                Descubre cada rincón de esta parroquia a través de imágenes que muestran su cultura, paisajes y tradiciones. ¡Visita la galería completa!
              </p>
              <div className="card-actions">
                <a href="/transporte" className="btn primary" style={{ background: 'rgba(7,16,26,0.95)', color: '#fff' }}>Transporte</a>
                <a href="/detalleGaleria" className="btn ghost" style={{ borderColor: 'rgba(7,16,26,0.12)', color: 'rgba(7,16,26,0.95)' }}>Ver galería</a>
              </div>
            </div>
          </aside>
        </div>

        {/* --- CAROUSEL DE PARROQUIAS --- */}
        <section className="carousel-section-parroquias" style={{ marginTop: 48 }}>
          <h3 style={{ 
            fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', 
            fontWeight: 800, 
            color: '#ffffffff', 
            textAlign: 'center', 
            marginBottom: '2rem',
            letterSpacing: '-0.5px'
          }}>
            Otras Parroquias de Sigchos
          </h3>
          <div className="carousel-scroll-parroquias" ref={carouselRef}>
            {itemsToUse.length > 0 ? (
              // Renderizar 3 copias para scroll infinito
              Array.from({ length: 3 }, (_, copyIndex) =>
                itemsToUse.map((item, idx) => {
                  const globalIdx = copyIndex * itemsToUse.length + idx;
                  const isExpanded = expandedIdx === globalIdx;
                  return (
                    <div 
                      className="parroquia-card" 
                      key={`parroquia-${copyIndex}-${idx}`}
                      style={{ backgroundImage: `url(${item.image})` }}
                    >
                      <div className="parroquia-card-overlay">
                        <div className="parroquia-card-content">
                          <h4 className="parroquia-card-title">{item.title}</h4>
                          <p className="parroquia-card-desc">
                            {(item.desc || '').slice(0, 90)}...
                          </p>
                          <button
                            onClick={() => {
                              try {
                                const slug = normalizeToSlug(String(item.title || 'parroquia'));
                                router.push(`/parroquias/${slug}`);
                              } catch (err) {
                                console.error('Failed to navigate to parroquia', err);
                              }
                            }}
                            className="parroquia-card-btn"
                          >
                            Ver Parroquia
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ).flat()
            ) : (
              <div style={{color: '#666', padding: '2rem', textAlign: 'center'}}>
                Cargando parroquias...
              </div>
            )}
          </div>
        </section>

      </main>

      <Footer />

      <style jsx>{`
        .hero-full { position:relative; background-size:cover; background-position:center; min-height:56vh; display:flex; align-items:center; }
        .hero-overlay { position:absolute; inset:0; background:linear-gradient(180deg, rgba(0,0,0,0.45), rgba(0,0,0,0.6)); }
        .hero-content { position:relative; z-index:2; width:100%; max-width:1100px; margin: 0 auto; padding: 56px 20px; text-align:center; color:#fff; }
        .hero-title { font-size: clamp(28px, 6vw, 56px); margin:0 0 12px; font-weight:900; text-shadow: 0 6px 18px rgba(0,0,0,0.6); }
        .hero-sub { margin:0 auto 18px; max-width:900px; color: rgba(255,255,255,0.9); }
        .hero-cta { background: #fff; color:#12141d; border:none; padding:10px 18px; border-radius:999px; font-weight:700; cursor:pointer; }

        .container { max-width:1100px; margin: 36px auto; padding: 0 20px 60px; }
        .content-grid { display:grid; grid-template-columns: 1fr 320px; gap: 28px; align-items:start; }
        .main-col { }
        .side-col { }

        .section-card { background: #fff; padding:20px; border-radius:10px; box-shadow: 0 10px 30px rgba(2,6,23,0.06); }
        .section-card h2 { margin:0 0 8px; }
        .lead { color:#333; line-height:1.7; }

        .card { background: linear-gradient(180deg, #0b1220, #07101a); color:#fff; padding:18px; border-radius:10px; box-shadow: 0 10px 30px rgba(2,6,23,0.35); }
        .card h3 { margin:0 0 6px; font-size:1.1rem; }
        .muted { color: rgba(255,255,255,0.85); }
        .card-actions { margin-top:12px; display:flex; gap:10px; }
        .btn { text-decoration:none; padding:8px 12px; border-radius:8px; font-weight:700; display:inline-block; }
        .btn.primary { background:#fff; color:#12141d; }
        .btn.ghost { background:transparent; border:1px solid rgba(255,255,255,0.12); color:#fff; }

        /* Carousel de Parroquias - Nuevo diseño limpio */
        .carousel-section-parroquias { 
          width: 100%; 
          margin: 48px 0; 
          padding: 0 20px; 
        }
        
        .carousel-scroll-parroquias {
          display: flex;
          overflow-x: auto;
          overflow-y: hidden;
          scroll-behavior: smooth;
          gap: 1.5rem;
          padding: 1.5rem 0;
          /* Hide scrollbars */
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE and Edge */
        }
        
        .carousel-scroll-parroquias::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
        
        .parroquia-card {
          flex: 0 0 320px;
          width: 320px;
          height: 400px;
          border-radius: 16px;
          background-size: cover;
          background-position: center;
          position: relative;
          box-shadow: 0 8px 32px rgba(0,0,0,0.15);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          scroll-snap-align: center;
        }
        
        .parroquia-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 16px 48px rgba(0,0,0,0.25);
        }
        
        .parroquia-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, 
            rgba(0,0,0,0) 0%, 
            rgba(0,0,0,0.3) 50%, 
            rgba(0,0,0,0.8) 100%
          );
          border-radius: 16px;
          display: flex;
          align-items: flex-end;
          padding: 24px;
        }
        
        .parroquia-card-content {
          color: white;
          width: 100%;
        }
        
        .parroquia-card-title {
          font-size: 1.4rem;
          font-weight: 800;
          margin: 0 0 8px 0;
          color: white;
          text-shadow: 0 2px 8px rgba(0,0,0,0.5);
        }
        
        .parroquia-card-desc {
          font-size: 0.9rem;
          margin: 0 0 16px 0;
          opacity: 0.9;
          line-height: 1.4;
          color: rgba(255,255,255,0.95);
        }
        
        .parroquia-card-btn {
          background: white;
          color: #07101a;
          border: none;
          padding: 10px 20px;
          border-radius: 25px;
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        
        .parroquia-card-btn:hover {
          background: #f0f0f0;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0,0,0,0.3);
        }
        
        @media (max-width: 768px) {
          .parroquia-card {
            flex: 0 0 280px;
            width: 280px;
            height: 360px;
          }
          
          .carousel-scroll-parroquias {
            gap: 1rem;
            padding: 1rem 0;
          }
          
          .parroquia-card-overlay {
            padding: 20px;
          }
          
          .parroquia-card-title {
            font-size: 1.2rem;
          }
        }
        @media (max-width: 900px) {
          .content-grid { grid-template-columns: 1fr; }
          .card { margin-top:12px; }
        }
      `}</style>
    </div>
  );
}
