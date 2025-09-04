"use client";

import React, { useEffect, useState } from 'react';
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
  const [startIdx, setStartIdx] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const DESC_THRESHOLD = 140;
  const visibleCards = 3;
  const router = useRouter();

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

  const total = itemsToUse.length;
  const getVisibleItems = () => {
    if (total === 0) return [];
    return Array.from({ length: visibleCards }, (_, i) => itemsToUse[(startIdx + i) % total]);
  };

  const handlePrev = () => {
    if (animating || total === 0) return;
    setAnimating(true);
    setTimeout(() => {
      setStartIdx((prev) => (prev - 1 + total) % total);
      setAnimating(false);
    }, 350);
  };
  const handleNext = () => {
    if (animating || total === 0) return;
    setAnimating(true);
    setTimeout(() => {
      setStartIdx((prev) => (prev + 1) % total);
      setAnimating(false);
    }, 350);
  };

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
                <a href="/contactos" className="btn primary" style={{ background: 'rgba(7,16,26,0.95)', color: '#fff' }}>Contactar</a>
                <a href="/detalleGaleria" className="btn ghost" style={{ borderColor: 'rgba(7,16,26,0.12)', color: 'rgba(7,16,26,0.95)' }}>Ver galería</a>
              </div>
            </div>
          </aside>
        </div>

        {/* --- INSERT SLIDER BELOW THE LAST ASIDE: DISTINCT DESIGN --- */}
        <section className="carousel-section new-style" style={{ marginTop: 28 }}>
          <div className="carousel-wrapper">
            <button
                className="nav-left"
                onClick={handlePrev}
                aria-label="Anterior"
                disabled={animating}
                style={{ background: '#fff', color: '#07101a', borderColor: 'rgba(0,0,0,0.06)' }}
            >
                &#10094;
            </button>
            <div className="carousel-cards-snap">
              {getVisibleItems().map((item, idx) => {
                const globalIdx = (startIdx + idx) % Math.max(1, total);
                return (
                  <article
                    key={idx}
                    className={`carousel-card-snap ${idx === 1 ? 'center' : ''}`}
                    style={{ backgroundImage: `url(${item.image})` }}
                    role="group"
                    aria-label={String(item.title)}
                  >
                    <div className="card-overlay">
                      <div className="card-meta">
                        <h4 className="card-title">{item.title}</h4>
                        <p className="card-excerpt">{(item.desc || '').slice(0, 90)}</p>
                      </div>
                      <div className="card-actions">
                        <button
                          onClick={() => {
                            try {
                              const slug = normalizeToSlug(String(item.btn || item.title || 'parroquia'));
                              router.push(`/parroquias/${slug}`);
                            } catch (err) {
                              console.error('Failed to navigate to parroquia', err);
                            }
                          }}
                          className="card-cta"
                          aria-label={`Ir a ${item.title}`}
                        >Ver</button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
            <button
                className="nav-left"
                onClick={handleNext}
                aria-label="Siguiente"
                disabled={animating}
                style={{ background: '#fff', color: '#07101a', borderColor: 'rgba(0,0,0,0.06)' }}
            >
                &#10095;
            </button>
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

        /* Carousel (new-style): horizontal scroll-snap cards with image backgrounds */
        .carousel-section.new-style { width:100%; }
        .carousel-wrapper { display:flex; align-items:center; gap:12px; }
        .carousel-cards-snap { display:flex; gap:18px; overflow-x:auto; scroll-snap-type:x mandatory; -webkit-overflow-scrolling:touch; padding:12px 8px; }
        .carousel-card-snap { min-width:300px; height:500px; border-radius:12px; background-size:cover; background-position:center; scroll-snap-align:center; position:relative; flex:0 0 auto; box-shadow: 0 12px 36px rgba(2,6,23,0.12); display:flex; align-items:flex-end; }
        .carousel-card-snap.center { transform: scale(1.04); }
        .card-overlay { width:100%; padding:12px; background: linear-gradient(180deg, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.45) 40%, rgba(0,0,0,0.65) 100%); color:#fff; border-radius:12px; display:flex; justify-content:space-between; align-items:flex-end; }
        .card-title { margin:0; font-size:1rem; font-weight:800; }
        .card-excerpt { margin:0; font-size:0.85rem; opacity:0.95; max-width:140px; }
        .card-cta { background:rgba(255,255,255,0.95); color:#07101a; padding:6px 10px; border-radius:8px; border:none; font-weight:700; cursor:pointer; }
        .nav-left, .nav-right { background:transparent; border:1px solid rgba(0,0,0,0.06); border-radius:8px; padding:8px 10px; cursor:pointer; }
        .nav-left[disabled], .nav-right[disabled] { opacity:0.45; cursor:not-allowed; }
        @media (max-width: 900px) {
          .content-grid { grid-template-columns: 1fr; }
          .card { margin-top:12px; }
        }
      `}</style>
    </div>
  );
}
