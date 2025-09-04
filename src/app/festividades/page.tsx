"use client";

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getFestividadesWithParroquia, FestividadRow } from '@/services/festividades.service';

export default function FestividadesPage() {
  const [items, setItems] = useState<FestividadRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageStart, setPageStart] = useState(0);
  const pageSize = 12;

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const data = await getFestividadesWithParroquia(pageStart, pageStart + pageSize - 1);
        if (!mounted) return;
        setItems(data);
      } catch (err) {
        console.error('Failed to load festividades', err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [pageStart]);

  return (
    <div>
      <Navbar />
    <section className="main-hero relative min-h-screen">
        <div className="absolute inset-0 bg-[url('/2.jpg')] bg-cover bg-no-repeat bg-fixed"></div>
        <div className="absolute inset-0 bg-[#12141d] opacity-80"></div>
        <div className="relative z-10 flex flex-col justify-center h-screen px-12">
            <div className="max-w-[600px]">
            <h1 className="text-6xl font-black text-white mb-6">Festividades de Sigchos</h1>
            <p className="text-2xl text-gray-300 mb-4">Conoce las tradiciones, fechas y celebraciones que dan vida a nuestra comunidad.</p>
            <p className="text-md text-gray-200 mb-8">Explora el cronograma de eventos y acompáñanos en cada fiesta popular.</p><button 
                onClick={() => {
                    const formSection = document.getElementById('festividades');
                    formSection?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="contactanos-btn py-4 px-8 bg-transparent border-2 border-white text-white rounded-full hover:bg-white hover:text-[#12141d] transition-all duration-300 text-lg font-semibold">
                FESTIVIDADES
            </button>
            </div>
            <div className="flex justify-end">
            <button 
                onClick={() => {
                const formSection = document.getElementById('festividades');
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
    <section id="festividades" style={{backgroundColor: 'rgba(249, 116, 22, 0.69)', padding: '50px'}}>
        <div className="mx-auto max-w-3xl text-center" style={{ gridColumn: '1 / -1', marginBottom: 6 }}>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ margin:0, padding: '20px 0 20px'}}>
            Festividades de {' '}
            <span className="bg-gradient-to-r from-blue-300 via-blue-500 to-pink-200 bg-clip-text text-transparent">
              SIGCHOS
            </span>
          </h2>
        </div>

        {loading && <div>Cargando festividades...</div>}

        {!loading && items.length === 0 && <div>No se encontraron festividades.</div>}

        <div style={{
            width: '100%',
            maxWidth: 1100,
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            padding: 24,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #F97316 0%, #FBBF24 50%, #10B981 100%)'
        }}>
          {items.map(it => (
            <article
              key={it.Id}
              style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'stretch',
            width: '100%',
            background: '#fff',
            borderRadius: 12,
            overflow: 'hidden',
            boxShadow: '0 8px 20px rgba(2,6,23,0.06)',
              }}
            >
              {/* Left content */}
              <div style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column'}}>
            <div>
              <div style={{ color: '#1f2a3eff', fontSize: 16, fontWeight: 700, marginBottom: 6 }}>
                {it.Fecha ? new Date(it.Fecha).toLocaleDateString() : 'Fecha no disponible'}
              </div>
              <h3 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#0b2e55' }}>{it.Nombre}</h3>
              <div style={{ color: '#0b2e55', fontSize: 18, fontWeight: 700}}>
                {it.Parroquia?.Nombre ?? ''}
              </div>
            </div>

            <p
              style={{
                color: '#000000ff',
                fontSize: 18,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {it.Historia ?? ''}
            </p>
              </div>

              {/* Right image */}
              <div
            style={{
              width: 320,
              minWidth: 160,
              maxWidth: '40%',
              height: '100%',
              display: 'flex',
              alignItems: 'stretch',
            }}
              >
            <div
              style={{
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                // rounded to the left side of the image
                borderTopLeftRadius: 12,
                borderBottomLeftRadius: 12,
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                background: '#f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {it.ImagenUrl ? (
                <img
                  src={it.ImagenUrl}
                  alt={it.Nombre}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              ) : (
                <div style={{ color: '#9ca3af', padding: 12 }}>Sin imagen</div>
              )}
            </div>
              </div>

              {/* Responsive: stack on narrow screens */}
              <style jsx>{`
            @media (max-width: 768px) {
              article {
                flex-direction: column;
              }
              article > div:nth-child(2) {
                width: 100% !important;
                min-width: 0 !important;
                max-width: 100% !important;
                height: 200px;
              }
              article > div:nth-child(2) > div {
                border-top-left-radius: 0 !important;
                border-bottom-left-radius: 0 !important;
                border-top-right-radius: 12px !important;
                border-bottom-right-radius: 12px !important;
              }
            }
              `}</style>
            </article>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
