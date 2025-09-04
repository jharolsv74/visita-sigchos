"use client";

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getTransportesWithParroquia, TransporteRow } from '@/services/transporte.service';

export default function TransportePage() {
  const [items, setItems] = useState<TransporteRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageStart, setPageStart] = useState(0);
  const pageSize = 12;

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const data = await getTransportesWithParroquia(pageStart, pageStart + pageSize - 1);
        if (!mounted) return;
        setItems(data);
      } catch (err) {
        console.error('Failed to load transportes', err);
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
                <h1 className="text-6xl font-black text-white mb-6">Transporte</h1>
                <p className="text-7md text-gray-300 mb-8">
                  A continuación verá información sobre el transporte público en Sigchos, incluyendo rutas, horarios, servicios disponibles y datos de contacto para facilitar sus desplazamientos por la zona.
                </p>
                <button 
                    onClick={() => {
                        const formSection = document.getElementById('transporte-section');
                        formSection?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="contactanos-btn py-4 px-8 bg-transparent border-2 border-white text-white rounded-full hover:bg-white hover:text-[#12141d] transition-all duration-300 text-lg font-semibold">
                  CONTÁCTANOS
                </button>
              </div>
              <div className="flex justify-end">
                <button 
                  onClick={() => {
                    const formSection = document.getElementById('transporte-section');
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

      <section id="transporte-section" style={{ maxWidth: 1100, margin: '28px auto', padding: '0 12px', position: 'relative', borderRadius: 12, overflow: 'hidden',
         background: 'linear-gradient(180deg, rgba(203,54,32,0.92), rgba(179,39,20,0.78))',
         boxShadow: 'inset 0 0 0 2000px rgba(0,0,0,0.0)'
      }}>
        <div style={{ textAlign: 'left', marginBottom: 20, padding: '36px 12px 8px', color: '#fff' }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, margin: 0 }}>Transporte público y servicios</h1>
          <p style={{ color: 'rgba(255,255,255,0.9)', marginTop:8 }}>Rutas, horarios y servicios disponibles en Sigchos</p>
        </div>

        {loading && <div>Cargando transportes...</div>}

        {!loading && items.length === 0 && <div>No se encontraron servicios de transporte.</div>}

        <div style={{ padding: '12px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {items.map(it => (
            <article key={it.Id} style={{ background: 'rgba(255,255,255,0.92)', borderRadius: 10, padding: 12, boxShadow: '0 8px 20px rgba(2,6,23,0.06)', display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  width: '100%',
                  height: 140,
                  borderRadius: 8,
                  overflow: 'hidden',
                  marginBottom: 10,
                  transition: 'height 200ms ease'
                }}
              >
                {it.ImagenUrl ? (
                  <img
                    src={it.ImagenUrl}
                    alt={it.Nombre}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onLoad={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      const img = e.currentTarget as HTMLImageElement;
                      const parent = img.parentElement as HTMLDivElement | null;
                      // Si la imagen es cuadrada, hacemos el contenedor más alto para que se vea más grande (cuadrado)
                      if (parent && img.naturalWidth === img.naturalHeight) {
                        parent.style.height = '220px';
                      }
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      background: 'rgba(243,244,246,0.7)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#9ca3af'
                    }}
                  >
                    Sin imagen
                  </div>
                )}
              </div>

              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0b2e55' }}>{it.Nombre}</h3>
                <div style={{ color: '#374151', fontSize: 13, marginTop: 6 }}>{it.Ruta ?? 'Ruta no disponible'}</div>
                <p style={{ marginTop: 8, color: '#374151', fontSize: 14, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>{it.Descripcion ?? ''}</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                <div style={{ fontSize: 13, color: '#6b7280' }}>{it.Parroquia?.Nombre ?? ''}</div>
                <div style={{ fontSize: 13, color: '#0b2e55' }}>{it.Horario ?? ''}</div>
              </div>
            </article>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
