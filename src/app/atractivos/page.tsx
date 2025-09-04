"use client";

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
// removed unused local JSON import; this page now loads sitios from the DB
import { useEffect, useState } from 'react';
import { getSitiosNaturalesConUbicacion } from '@/services/sitios.service';
import type { SitioConUbicacion } from '@/types/db';

export default function AtractivosTuristicos() {
  const [sitiosSlider, setSitiosSlider] = useState<SitioConUbicacion[] | null>(null);

  useEffect(() => {
    let mounted = true;
    getSitiosNaturalesConUbicacion()
      .then((data) => {
        if (!mounted) return;
        setSitiosSlider(data ?? []);
      })
      .catch((err) => {
        console.error('[atractivos.page] error loading slider sitios:', err);
      });
    return () => {
      mounted = false;
    };
  }, []);
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow">
          {/* Hero Section */}
          <section className="main-hero relative min-h-screen">
            <div className="absolute inset-0 bg-[url('/Maqui-Machay.webp')] bg-cover bg-no-repeat bg-fixed"></div>
            <div className="absolute inset-0 bg-[#12141d] opacity-80"></div>
            <div className="relative z-10 flex flex-col justify-center h-screen px-12">
              <div className="max-w-[800px]">
                <h1 className="text-6xl font-black text-white mb-6">
                  Atractivos Turísticos de <span className="bg-gradient-to-r from-[#a12f7d] to-[#325f66] text-transparent bg-clip-text">SIGCHOS</span>
                </h1>
                <p className="text-7md text-gray-300 mb-8 leading-relaxed">
                  Sigchos es un rincón privilegiado de la provincia de Cotopaxi, rodeado de paisajes andinos, cultura ancestral y maravillas naturales. En esta sección encontrarás los destinos más representativos del cantón: lagunas volcánicas, cascadas, senderos arqueológicos, bosques protegidos y montañas imponentes. Cada atractivo es una invitación a vivir experiencias únicas en contacto con la naturaleza y la historia. ¡Descúbrelos y anímate a visitarlos!
                </p>
                <button 
                  onClick={() => {
                    const atractivosSection = document.getElementById('atractivos-section');
                    atractivosSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="atractivos-btn py-4 px-8 bg-transparent border-2 border-white text-white rounded-full hover:bg-white hover:text-[#12141d] transition-all duration-300 text-lg font-semibold"
                >
                  EXPLORAR
                </button>
              </div>
              <div className="flex justify-end">
                <button 
                  onClick={() => {
                    const atractivosSection = document.getElementById('atractivos-section');
                    atractivosSection?.scrollIntoView({ behavior: 'smooth' });
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

          {/* Atractivos Section */}
          <section id="atractivos-section" className="relative py-16 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 opacity-90"></div>
            <div className="relative container mx-auto px-4">
              <h2 className="text-5xl font-black text-white mb-16 text-center tracking-wide">TODOS LOS SITIOS</h2>

              <SiteCards />
            </div>
            <div className="atractivos-slider">
              <div 
                className="atractivos-slider-container"
                onMouseDown={(e) => {
                  const slider = e.currentTarget;
                  let startX = e.pageX - slider.offsetLeft;
                  let scrollLeft = slider.scrollLeft;

                  function handleMouseMove(e: MouseEvent) {
                    const x = e.pageX - slider.offsetLeft;
                    const walk = (x - startX) * 2;
                    slider.scrollLeft = scrollLeft - walk;
                  }

                  function handleMouseUp() {
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                    slider.style.cursor = 'grab';
                  }

                  slider.style.cursor = 'grabbing';
                  document.addEventListener('mousemove', handleMouseMove);
                  document.addEventListener('mouseup', handleMouseUp);
                }}>
                {(sitiosSlider ?? []).map(({ sitio }, index) => (
                  <a href={`/atractivos/${sitio.Id}`} key={sitio.Id ?? index} className="atractivo-slide">
                    <div className="atractivo-slide-content">
                      <img src={sitio.ImagenUrl ?? '/file.svg'} alt={sitio.Nombre} className="atractivo-slide-img" />
                      <div className="atractivo-slide-overlay">
                        <h3 className="atractivo-slide-title">{sitio.Nombre}</h3>
                        <p className="atractivo-slide-subtitle">{(sitio as any).Barrio ?? ''}</p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* Sección Descubre */}
          <section className="galeria-section">
            <div className="galeria-container">
              <div className="galeria-text">
                <h2 className="galeria-title">Descubre...</h2>
                <p className="galeria-desc">
                  Sigchos es un destino lleno de riqueza natural, cultural e histórica. Desde la majestuosa Laguna del Quilotoa hasta parajes escondidos como Licamancha o el Churo de Amanta, cada atractivo ofrece experiencias únicas para los amantes de la aventura, la tranquilidad y la tradición andina. Visitar Sigchos es descubrir un cantón donde la naturaleza y la identidad local se entrelazan en cada sendero, cada mirador y cada comunidad.
                </p>
              </div>

              <div className="galeria-content">
                <div className="galeria-imagenes">
                  <div className="galeria-grid">
                    <div className="galeria-item">
                      <img src="/galeria/Bosque_Protector_Sarapullo_2.jpg" alt="Bosque Protector Sarapullo" />
                    </div>
                    <div className="galeria-item">
                      <img src="/galeria/Bosque_Protector_Sarapullo_4.jpg" alt="Vista del Bosque Protector" />
                    </div>
                    <div className="galeria-item">
                      <img src="/galeria/Churo de Amanta_3.webp" alt="Churo de Amanta" />
                    </div>
                    <div className="galeria-item">
                      <img src="/galeria/Churo de Amanta.webp" alt="Vista del Churo de Amanta" />
                    </div>
                    <div className="galeria-item">
                      <img src="/galeria/IMG_7585.jpg" alt="Paisaje de Sigchos" />
                    </div>
                    <div className="galeria-item">
                      <img src="/galeria/IMG_7599.jpg" alt="Vista panorámica de Sigchos" />
                    </div>
                  </div>
                </div>

                <div className="redes-sociales-grid">
                  <a href="https://twitter.com/DeSigchos" target="_blank" rel="noopener noreferrer" className="red-social-card twitter">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    <span>@DeSigchos</span>
                  </a>
                  <a href="https://instagram.com/gad_muni.sigchos" target="_blank" rel="noopener noreferrer" className="red-social-card instagram">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 0 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/></svg>
                    <span>@gad_muni.sigchos</span>
                  </a>
                  <a href="https://www.tiktok.com/@gad.municipal.sig" target="_blank" rel="noopener noreferrer" className="red-social-card tiktok">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                    <span>GAD Municipal Sigchos</span>
                  </a>
                  <a href="https://www.facebook.com/GADMunicipalSigchos" target="_blank" rel="noopener noreferrer" className="red-social-card facebook">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z"/></svg>
                    <span>Gad Sigchos</span>
                  </a>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}

function SiteCards() {
  const [sitios, setSitios] = useState<SitioConUbicacion[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getSitiosNaturalesConUbicacion()
      .then((data) => {
        if (!mounted) return;
        setSitios(data ?? []);
      })
      .catch((err) => {
        console.error('Error loading sitios:', err);
        if (!mounted) return;
        setError(err?.message ?? String(err));
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <div className="text-center text-white">Cargando sitios...</div>;
  if (error) return <div className="text-center text-red-300">Error cargando sitios: {error}</div>;
  if (!sitios || sitios.length === 0) return <div className="text-center text-white">No se encontraron sitios.</div>;

  return (
    <div className="space-y-6">
      {sitios.map(({ sitio, ubicacion }) => (
        <div key={sitio.Id} className="bg-[#12141d] rounded-lg overflow-hidden max-w-[1000px] mx-auto p-4">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="md:w-[400px] h-[250px] flex-shrink-0 flex items-center rounded-lg overflow-hidden">
              <img src={sitio.ImagenUrl ?? '/file.svg'} alt={sitio.Nombre} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">{sitio.Nombre}</h3>
                <p className="text-gray-300 mb-6">{sitio.Descripcion ?? ''}</p>
                {ubicacion ? (
                  <p className="text-gray-300">Coordenadas: {ubicacion.Latitud}, {ubicacion.Longitud}</p>
                ) : null}
              </div>

              <a href={`/atractivos/${sitio.Id}`} className="mt-6 px-6 py-2 text-white border-2 border-white rounded-full hover:bg-white hover:text-[#12141d] transition-all duration-300 w-fit">
                CONOCER MÁS
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
