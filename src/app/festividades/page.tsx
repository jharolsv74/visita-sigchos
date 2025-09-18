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
        <div className="relative z-10 flex flex-col justify-center h-screen px-6 md:px-12">
            <div className="max-w-[600px]">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 md:mb-6">Festividades de Sigchos</h1>
            <p className="text-lg md:text-2xl text-gray-300 mb-3 md:mb-4">Conoce las tradiciones, fechas y celebraciones que dan vida a nuestra comunidad.</p>
            <p className="text-sm md:text-md text-gray-200 mb-6 md:mb-8">Explora el cronograma de eventos y acompáñanos en cada fiesta popular.</p><button 
          onClick={() => {
              const formSection = document.getElementById('festividades');
              formSection?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="contactanos-btn py-3 px-6 md:py-4 md:px-8 bg-transparent border-2 border-white text-white rounded-full hover:bg-white hover:text-[#12141d] transition-all duration-300 text-base md:text-lg font-semibold">
          FESTIVIDADES
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
              className="flex flex-col md:flex-row items-stretch w-full bg-white rounded-xl overflow-hidden shadow-lg"
            >
              {/* Left content */}
              <div className="flex-1 p-4 md:p-6 flex flex-col">
              <div>
                <div className="text-gray-700 text-sm md:text-base font-bold mb-2">
                {it.Fecha ? new Date(it.Fecha).toLocaleDateString() : 'Fecha no disponible'}
                </div>
                <h3 className="m-0 text-lg md:text-xl lg:text-2xl font-extrabold text-blue-900">{it.Nombre}</h3>
                <div className="text-blue-900 text-base md:text-lg font-bold">
                {it.Parroquia?.Nombre ?? ''}
                </div>
              </div>

              <p className="text-black text-sm md:text-base lg:text-lg overflow-hidden line-clamp-3 mt-2">
                {it.Historia ?? ''}
              </p>
              </div>

              {/* Right image */}
              <div className="w-full h-48 md:w-80 md:min-w-40 md:max-w-[40%] md:h-auto flex items-stretch">
              <div className="w-full h-full overflow-hidden rounded-b-xl md:rounded-b-none md:rounded-r-xl bg-gray-100 flex items-center justify-center">
                {it.ImagenUrl ? (
                <img
                  src={it.ImagenUrl}
                  alt={it.Nombre}
                  className="w-full h-full object-cover block"
                />
                ) : (
                <div className="text-gray-400 p-3 text-center">Sin imagen</div>
                )}
              </div>
              </div>
            </article>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
