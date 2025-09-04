"use client";

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { getGaleriasWithDetalles, GaleriaWithDetalles } from '@/services/galeria.service';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function DetalleGaleriaPage() {
  const [galerias, setGalerias] = useState<GaleriaWithDetalles[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<{ galId: number; idx: number } | null>(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Limit initial fetch to first 10 galerias to reduce payload and speed up page
        const pageSize = 10;
        const data = await getGaleriasWithDetalles(0, pageSize - 1);
        if (!mounted) return;
        setGalerias(data);
        setHasMore((data?.length ?? 0) >= pageSize);
      } catch (err) {
        console.error('Failed to fetch galerias', err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Memoize a map for O(1) gallery lookup to avoid repeated array.find during navigation
  const galMap = useMemo(() => new Map<number, GaleriaWithDetalles>(galerias.map(g => [g.Id, g])), [galerias]);

  const open = useCallback((galId: number, idx: number) => setSelected({ galId, idx }), []);
  const close = useCallback(() => setSelected(null), []);

  const next = useCallback(() => {
    if (!selected) return;
    const g = galMap.get(selected.galId);
    const len = g?.GaleriaDetalle?.length ?? 0;
    if (len === 0) return;
    setSelected({ galId: selected.galId, idx: (selected.idx + 1) % len });
  }, [selected, galMap]);

  const prev = useCallback(() => {
    if (!selected) return;
    const g = galMap.get(selected.galId);
    const len = g?.GaleriaDetalle?.length ?? 0;
    if (len === 0) return;
    setSelected({ galId: selected.galId, idx: (selected.idx - 1 + len) % len });
  }, [selected, galMap]);

  // Load next page (append). Keeps initial render fast and lets user fetch more on demand.
  const loadMore = useCallback(async () => {
    if (!hasMore) return;
    setLoading(true);
    try {
      const start = galerias.length;
      const end = start + 9; // page size = 10
      const data = await getGaleriasWithDetalles(start, end);
      setGalerias(prev => [...prev, ...data]);
      setHasMore((data?.length ?? 0) >= 10);
    } catch (err) {
      console.error('Failed to load more galerias', err);
    } finally {
      setLoading(false);
    }
  }, [galerias.length, hasMore]);

  return (
    <div className="detalle-galeria-page">
      <Navbar />

      {/* Hero section requested by user - placed before the gallery */}
      <section className="main-hero relative min-h-screen">
        <div className="absolute inset-0 bg-[url('/Quilotoa.jpg')] bg-cover bg-no-repeat bg-fixed"></div>
        <div className="absolute inset-0 bg-[#12141d] opacity-80"></div>
        <div className="relative z-10 flex flex-col justify-center h-screen px-12">
          <div className="max-w-[600px]">
            <h1 className="text-6xl font-black text-white mb-6">Galería</h1>
            <p className="text-7md text-gray-300 mb-8">Cada fotografía cuenta una historia de Sigchos: sus montañas, su gente y sus tradiciones. No te pierdas la galería completa y déjate cautivar por su encanto.</p>
            <button 
                onClick={() => {
                    const formSection = document.getElementById('galerias-grid');
                    formSection?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="contactanos-btn py-4 px-8 bg-transparent border-2 border-white text-white rounded-full hover:bg-white hover:text-[#12141d] transition-all duration-300 text-lg font-semibold">
              Mira la Galería completa
            </button>
          </div>
          <div className="flex justify-end">
            <button 
              onClick={() => {
                const formSection = document.getElementById('galerias-grid');
                formSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="absolute bottom-24 right-24 w-16 h-16 rounded-full border-2 border-white flex items-center justify-center hover:bg-white hover:text-[#12141d] text-white transition-all duration-300"
            >
              <svg 
                className="w-8 h-8" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>

      <h1 className="page-title">Galería</h1>

      {loading && galerias.length === 0 && <p>Cargando galerías...</p>}
      {!loading && galerias.length === 0 && <p>No hay galerías disponibles.</p>}

      <div id="galerias-grid" className="galerias-grid">
        {galerias.map((g) => {
          const heroImg = g.GaleriaDetalle && g.GaleriaDetalle.length > 0 ? g.GaleriaDetalle[0].ImagenUrl : '/icon-site-sigchos.png';
          return (
            <article key={g.Id} className="galeria-card group">
              <button aria-label={`Abrir galería ${g.Nombre}`} onClick={() => open(g.Id, 0)} className="featured-btn">
                <div className="featured-img" style={{ backgroundImage: `url(${heroImg})` }} />
                <div className="featured-overlay">
                <h3 className="galeria-name text-2xl md:text-3xl font-extrabold text-white">{g.Nombre}</h3>
                  <p className="galeria-desc text-sm md:text-base text-gray-200 max-w-lg">{g.Descripcion}</p>
                </div>
              </button>

              <div className="galeria-thumbs" aria-hidden={false}>
                {(g.GaleriaDetalle || []).slice(0, 6).map((d, i) => (
                  <button key={d.Id} className="thumb-btn" onClick={() => open(g.Id, i + (g.GaleriaDetalle && g.GaleriaDetalle.length > 0 ? 0 : 0))}>
                    <img src={d.ImagenUrl || '/icon-site-sigchos.png'} alt={`${g.Nombre} - imagen ${i + 1}`} className="thumb-img" loading="lazy" decoding="async" />
                  </button>
                ))}
                { (g.GaleriaDetalle?.length ?? 0) > 6 && <div className="more-count">+{(g.GaleriaDetalle!.length - 6)}</div> }
              </div>
            </article>
          );
        })}
      </div>

      {/* Load more button to paginate */}
      <div className="load-more-wrap" style={{ textAlign: 'center', marginTop: 20 }}>
        {hasMore ? (
          <button className="load-more-btn py-3 px-6 rounded-md bg-white text-[#12141d] font-semibold" onClick={loadMore} disabled={loading}>
            {loading ? 'Cargando...' : 'Cargar más'}
          </button>
        ) : (
          galerias.length > 0 && <div className="text-gray-400">No hay más galerías.</div>
        )}
      </div>

      {selected && (() => {
        const g = galMap.get(selected.galId);
        const item = g?.GaleriaDetalle?.[selected.idx];
        if (!g || !item) return null;
        return (
          <div className="lightbox" onClick={close}>
            <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
              <button className="lightbox-close" onClick={close}>✕</button>
              <button className="lightbox-prev" onClick={prev}>‹</button>
              <img src={item.ImagenUrl || '/icon-site-sigchos.png'} alt={g.Nombre} className="lightbox-img" loading="eager" decoding="async" />
              <button className="lightbox-next" onClick={next}>›</button>
              <div className="lightbox-caption">{g.Nombre} — {selected.idx + 1} / {g.GaleriaDetalle?.length}</div>
            </div>
          </div>
        );
      })()}

      <style jsx>{`
        :root{ --card-bg: rgba(18,20,29,0.72); --accent: #ffffff; }
        .galerias-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 28px; align-items:start; }
        .galeria-card { background: var(--card-bg); border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.45); transform: translateZ(0); transition: transform .35s cubic-bezier(.2,.9,.2,1), box-shadow .35s ease; }
        .galeria-card:hover { transform: translateY(-6px); box-shadow: 0 18px 36px rgba(0,0,0,0.5); }

        .featured-btn { display:block; border: none; padding:0; margin:0; cursor:pointer; text-align:left; width:100%; position:relative; }
        .featured-img { height: 220px; background-size: cover; background-position: center; transition: transform .6s cubic-bezier(.2,.9,.2,1); filter: brightness(0.86); }
        .galeria-card.group:hover .featured-img { transform: scale(1.04) translateY(-4px); }

        /* Overlay sits absolutely over the image to ensure text is always on top */
        .featured-overlay { position:absolute; inset:0; display:flex; flex-direction:column; justify-content:flex-end; padding:18px; color: var(--accent); z-index:2; pointer-events:none; background: linear-gradient(180deg, rgba(0,0,0,0.0) 10%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.75) 100%); }
        .featured-overlay .galeria-desc { opacity: 0.95; }
        .galeria-name { margin: 0 0 6px 0; }
        .galeria-desc { margin: 0; color: #e6e7ea; }

        /* Improve legibility with a subtle text-shadow */
        .galeria-name, .galeria-desc { text-shadow: 0 2px 6px rgba(0, 0, 0, 1); }

        .galeria-thumbs { display:flex; gap:8px; flex-wrap:wrap; padding: 12px; align-items:center; }
        .thumb-btn { border: none; padding:0; background: transparent; border-radius:8px; overflow:hidden; cursor:pointer; transition: transform .28s ease, box-shadow .28s ease; }
        .thumb-btn:focus { outline: 2px solid rgba(255,255,255,0.12); }
        .thumb-btn:hover { transform: translateY(-6px) scale(1.03); box-shadow: 0 8px 20px rgba(0,0,0,0.35); }
        .thumb-img { width:100px; height:72px; object-fit:cover; display:block; border-radius:6px; }

        .more-count { display:flex; align-items:center; justify-content:center; min-width:100px; height:72px; background: rgba(0,0,0,0.25); color: #fff; border-radius:6px; font-weight:600; }

        /* lightbox improvements */
        .lightbox { position:fixed; inset:0; background:rgba(0,0,0,0.88); display:flex; align-items:center; justify-content:center; z-index:1000; animation:fadeIn .18s ease forwards; }
        .lightbox-inner { position:relative; max-width:92%; max-height:92%; padding: 12px; }
        .lightbox-img { max-width:100%; max-height:82vh; display:block; margin:0 auto; border-radius:8px; box-shadow: 0 12px 40px rgba(0,0,0,0.6); transition: transform .25s ease; }
        .lightbox-inner:focus { outline:none; }
        .lightbox-img-enter { transform: scale(.98); }
        .lightbox-close, .lightbox-prev, .lightbox-next { position:absolute; top:8px; background:rgba(0,0,0,0.2); border:none; color:#fff; font-size:28px; cursor:pointer; padding:8px; border-radius:8px; }
        .lightbox-prev { left:-48px; top:50%; transform:translateY(-50%); }
        .lightbox-next { right:-48px; top:50%; transform:translateY(-50%); }
        .lightbox-close { right:8px; }
        .lightbox-caption { color:#fff; text-align:center; margin-top:8px; font-weight:600; }

        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }

        /* Hero tweaks to ensure text is readable on smaller screens */
        .main-hero { position:relative; }
        @media (max-width: 768px) {
          .main-hero .text-6xl { font-size: 2rem; }
          .main-hero .max-w-[600px] { max-width: 90%; }
          .main-hero .absolute.bottom-24.right-24 { right: 1.5rem; bottom: 6rem; }
          .featured-img { height:160px; }
        }
      `}</style>

      <Footer />
    </div>
  );
}
