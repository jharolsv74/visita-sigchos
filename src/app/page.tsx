"use client";

import React, { useState, useEffect, useRef } from "react";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AutoridadesPreview from '../components/AutoridadesPreview';
import { getParroquias } from '@/services/parroquias.service';
import { normalizeToSlug } from '@/services/parroquias.service';
import { getSitiosNaturalesConUbicacion } from '@/services/sitios.service';
import type { SitioConUbicacion } from '@/types/db';
import { getCantones } from '@/services/cantones.service';
import { getHome } from '@/services/home.service';
import type { Parroquia, Canton } from '@/types/db';
import { useRouter } from 'next/navigation';
import { initDevEnv } from '@/utils/dev';

export default function Home() {
  const router = useRouter();

  const visibleCards = 3; // Cuántas tarjetas mostrar a la vez
  const [startIdx, setStartIdx] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [parroquias, setParroquias] = useState<Parroquia[] | null>(null);
  const [sitios, setSitios] = useState<SitioConUbicacion[] | null>(null);
  const [sitiosLoading, setSitiosLoading] = useState(true);
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [canton, setCanton] = useState<Canton | null>(null);
  const [cantonLoaded, setCantonLoaded] = useState(false);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  // Infinite carousel helpers
  const isAdjustingRef = useRef(false);
  const scrollEndTimer = useRef<number | null>(null);
  const DESC_THRESHOLD = 160; // characters before showing "Ver más"

  // Fetch parroquias for the top carousel (prefer parroquias, fall back to sitios)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const ps = await getParroquias();
        if (!mounted) return;
        setParroquias(ps);
      } catch (err) {
        console.error('Failed to fetch parroquias', err);
        if (mounted) setParroquias([]);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Build the carousel items: prefer Parroquias for the top carousel, fall back to Sitios
  const itemsToUse = (parroquias && parroquias.length > 0)
    ? parroquias.map((p) => ({
      image: p.ImagenUrl || '/icon-site-sigchos.png',
      title: p.Nombre || 'Parroquia',
      desc: p.Descripcion || '',
      id: undefined,
    }))
    : (sitios && sitios.length > 0)
      ? sitios.map(({ sitio, ubicacion }) => ({
        image: sitio.ImagenUrl || '/icon-site-sigchos.png',
        title: sitio.Nombre || 'Sitio',
        desc: sitio.Descripcion || '',
        id: sitio.Id,
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

  // Fetch sitios to use in carousels
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setSitiosLoading(true);
        const data = await getSitiosNaturalesConUbicacion();
        if (!mounted) return;
        setSitios(data ?? []);
      } catch (err) {
        console.error('Failed to fetch sitios', err);
        if (mounted) setSitios([]);
      } finally {
        if (mounted) setSitiosLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Infinite carousel: initial middle positioning, wrapping and snap-to-center on scroll end
  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    const slides = (sitios ?? []).length;
    if (slides === 0) return;

    // position at middle group's start
    const groupWidth = el.scrollWidth / 3;
    requestAnimationFrame(() => {
      el.scrollLeft = groupWidth;
    });

    function onScroll() {
      if (!el) return;
      if (isAdjustingRef.current) return;
      if (scrollEndTimer.current) window.clearTimeout(scrollEndTimer.current);
      // debounce end of scroll
      // @ts-ignore - window.setTimeout returns number
      scrollEndTimer.current = window.setTimeout(() => {
        const groupW = el.scrollWidth / 3;
        const left = el.scrollLeft;
        // wrap groups
        if (left < groupW * 0.5) {
          isAdjustingRef.current = true;
          el.scrollLeft = left + groupW;
          isAdjustingRef.current = false;
          return;
        }
        if (left > groupW * 1.5) {
          isAdjustingRef.current = true;
          el.scrollLeft = left - groupW;
          isAdjustingRef.current = false;
          return;
        }

        // snap to nearest child center
        const children = Array.from(el.children) as HTMLElement[];
        const containerCenter = el.scrollLeft + el.clientWidth / 2;
        let nearestIdx = -1;
        let nearestDist = Infinity;
        children.forEach((ch, i) => {
          const chCenter = ch.offsetLeft + ch.clientWidth / 2;
          const dist = Math.abs(chCenter - containerCenter);
          if (dist < nearestDist) {
            nearestDist = dist;
            nearestIdx = i;
          }
        });
        if (nearestIdx >= 0) {
          const ch = children[nearestIdx];
          const target = ch.offsetLeft + ch.clientWidth / 2 - el.clientWidth / 2;
          isAdjustingRef.current = true;
          el.scrollTo({ left: target, behavior: 'smooth' });
          setTimeout(() => (isAdjustingRef.current = false), 300);
        }
      }, 120) as unknown as number;
    }

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      if (scrollEndTimer.current) window.clearTimeout(scrollEndTimer.current);
    };
  }, [sitios]);

  // Infinite carousel for the top carousel (parroquias / sitios) using carouselRef
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const slides = (parroquias ?? []).length;
    if (slides === 0) return;

    // We render 3 copies of the items; position to the middle copy
    const groupWidth = el.scrollWidth / 3;
    requestAnimationFrame(() => {
      el.scrollLeft = groupWidth;
    });

    let scrollEnd: number | null = null;
    function onScroll() {
      if (!el) return;
      if (scrollEnd) window.clearTimeout(scrollEnd);
      scrollEnd = window.setTimeout(() => {
        const left = el.scrollLeft;
        const gw = groupWidth;
        if (left < gw * 0.5) {
          el.scrollLeft = left + gw;
          return;
        }
        if (left > gw * 1.5) {
          el.scrollLeft = left - gw;
          return;
        }
        // optional: snap to nearest child center
        const children = Array.from(el.children) as HTMLElement[];
        const containerCenter = el.scrollLeft + el.clientWidth / 2;
        let nearestIdx = -1;
        let nearestDist = Infinity;
        children.forEach((ch, i) => {
          const chCenter = ch.offsetLeft + ch.clientWidth / 2;
          const dist = Math.abs(chCenter - containerCenter);
          if (dist < nearestDist) { nearestDist = dist; nearestIdx = i; }
        });
        if (nearestIdx >= 0) {
          const ch = children[nearestIdx];
          const target = ch.offsetLeft + ch.clientWidth / 2 - el.clientWidth / 2;
          el.scrollTo({ left: target, behavior: 'smooth' });
        }
      }, 120) as unknown as number;
    }

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      if (scrollEnd) window.clearTimeout(scrollEnd);
    };
  }, [parroquias]);

  // Fetch Canton row to populate Sigchos info section (use first row)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const rows = await getCantones(0, 0);
        if (!mounted) return;
        setCanton((rows && rows.length > 0) ? rows[0] : null);
        setCantonLoaded(true);
      } catch (err) {
        console.error('Failed to fetch Canton row', err);
        if (mounted) setCantonLoaded(true);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Fetch Home row to get hero image
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const home = await getHome();
        if (!mounted) return;
        const img = home && typeof home['ImagenUrl'] === 'string' ? home['ImagenUrl'] as string : null;
        setHeroImage(img);
      } catch (err) {
        console.error('Failed to fetch Home row', err);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Initialize development environment
  useEffect(() => {
    initDevEnv();
  }, []);

  return (
    <>
      <section className="main-hero">
        {/* Background image placed in a dedicated div so we can control scaling responsively */}
        <div className="main-hero-bg" style={heroImage ? { backgroundImage: `url('${heroImage}')` } : undefined} />
        <Navbar />
        {/* Hero content aquí si lo necesitas */}
      </section>

      <style jsx>{`
        @media (max-width: 900px) {
          .sigchos-info-content {
            flex-direction: column;
          }
          .sigchos-info-img {
            width: 100%;
          }
        }
      `}</style>
      <section className="carousel-section">
        <div className="carousel-scroll" ref={carouselRef}>
          {parroquias && parroquias.length > 0 ? (
            // Renderizar 3 copias para scroll infinito
            Array.from({ length: 3 }, (_, copyIndex) =>
              parroquias.map((p, idx) => {
                const title = p.Nombre || 'Parroquia';
                const image = p.ImagenUrl || '/icon-site-sigchos.png';
                const desc = p.Descripcion || '';
                const globalIdx = copyIndex * parroquias.length + idx;
                const isExpanded = expandedIdx === globalIdx;
                const needsToggle = typeof desc === 'string' && desc.length > DESC_THRESHOLD;
                const shortDesc = needsToggle ? desc.slice(0, DESC_THRESHOLD).trim() + '...' : desc;

                return (
                  <div className="carousel-card" key={`parroquia-${copyIndex}-${(p as any)?.Id ?? idx}`}>
                    <div className="carousel-card-bg" />
                    <div className="carousel-card-content" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', height: '100%'}}>
                      <div style={{textAlign: 'center'}}>
                        <div className="carousel-card-image">
                          <img src={image} alt={title} style={{maxWidth: '100%', height: '180px', objectFit: 'cover', borderRadius: 8}} />
                        </div>
                        <h2 className="carousel-title" style={{marginTop: 12}}>{title}</h2>
                        <p className="carousel-desc" style={{marginTop: 8, minHeight: 48, maxWidth: 340, textAlign: 'justify'}}>
                          {isExpanded ? (
                            <>
                              {desc}
                              <button onClick={() => setExpandedIdx(null)} style={{background: 'none', border: 'none', color: 'rgba(255,255,255,1)', cursor: 'pointer', padding: 0, marginLeft: 6, fontSize: '0.95em'}} aria-label="Ver menos">(ver menos)</button>
                            </>
                          ) : needsToggle ? (
                            <>
                              {shortDesc}
                              <button onClick={() => setExpandedIdx(globalIdx)} style={{background: 'none', border: 'none', color: 'rgba(255,255,255,1)', cursor: 'pointer', padding: 0, marginLeft: 6, fontSize: '0.95em'}} aria-label="Ver más">(ver más)</button>
                            </>
                          ) : (
                            desc
                          )}
                        </p>
                      </div>
                      <div style={{width: '100%', display: 'flex', justifyContent: 'center', gap: 8, marginTop: 12}}>
                        <button className="carousel-btn" onClick={() => {
                          try {
                            const slug = normalizeToSlug(String(title || 'parroquia'));
                            router.push(`/parroquias/${slug}`);
                          } catch (err) {
                            console.error('Failed to navigate', err);
                          }
                        }}>{title}</button>
                      </div>
                    </div>
                  </div>
                );
              })
            ).flat()
          ) : (
            <div style={{color: '#fff', padding: '2rem'}}>No hay parroquias disponibles</div>
          )}
        </div>
      </section>

      {/* Sección informativa Sigchos */}
      <section className="sigchos-info-section">
        <h2
          className="sigchos-info-title"
          style={{
            // escala la tipografía según el ancho de la pantalla
            fontSize: 'clamp(1.1rem, 2.8vw, 2.0rem)',
            lineHeight: 1.08,
            margin: '0 0 1rem 0', // margen debajo para separar un poco
          }}
        >
          Conoce un poco más sobre{' '}
          <span
            className="sigchos-info-title-italic"
            style={{
              // sub-título ligeramente más destacado, también responsivo
              fontSize: 'clamp(1rem, 2.2vw, 1.8rem)',
              fontStyle: 'italic',
            }}
          >
            SIGCHOS
          </span>
          <span
            className="sigchos-info-line"
            style={{
              display: 'block',
              width: 'clamp(80px, 28vw, 320px)', // ancho de la línea se escala
              height: 6,
              borderRadius: 4,
              marginTop: 10,
              background: 'linear-gradient(90deg,#ff5e62,#ff9966)',
            }}
          />
        </h2>
        <div className="sigchos-info-content">
          <div className="sigchos-info-img-container">
            <img className="sigchos-info-img" src={canton?.ImagenUrl || '/Home_v2.jpg'} alt={canton?.Nombre || 'Sigchos panorámica'} />
          </div>
          <div className="sigchos-info-textbox">
            {(!cantonLoaded) ? (
              <div style={{color: '#fff'}}>Cargando información...</div>
            ) : (!canton) ? (
              <>
          <h3 className="sigchos-info-heading">Sigchos Cantón de Cotopaxi</h3>
          <p className="sigchos-info-desc">Sigchos es uno de los siete cantones de la provincia de Cotopaxi, Ecuador. Se encuentra al noroeste de Latacunga, en medio de la Cordillera Occidental de los Andes, con un paisaje accidentado y quebrado, situado en las cuencas de los ríos Toachi y Pilatón. Su nombre deriva de "Sigchila", el nombre de un cacique local, cuyo significado se interpreta como "brazo de hierro". La temperatura media anual cercana a 13°C, con fluctuaciones entre 9°C y 20°C. La precipitación anual se sitúa entre 500 y 1000 mm.</p>
              </>
            ) : (
              <>
          <h3 className="sigchos-info-heading">{canton.Nombre}</h3>
          <p className="sigchos-info-desc">{canton.Descripcion}</p>
              </>
            )}
            <h4 className="sigchos-info-subheading">Fecha de Cantonización</h4>
            <p className="sigchos-info-desc">July 21, 1992</p>
            <h4 className="sigchos-info-subheading">Platos Típicos</h4>
            <p className="sigchos-info-desc">
      Chugchucaras, caldo de gallina criolla, cuy asado, llapingachos, tortillas de maíz, habas con queso, caldo de patas, tamales, morocho con leche, colada morada (en temporada), quesillo con miel, empanadas de viento.
            </p>
            <h4 className="sigchos-info-subheading">Agricultura y Ganadería</h4>
            <p className="sigchos-info-desc">
      Agricultura: papa, maíz, cebada, habas, arveja, melloco, ocas, zanahoria blanca, quinua. Ganadería: bovinos (leche y carne), ovinos, porcinos, aves de corral (gallinas, patos), cuyes.
            </p>
          </div>
        </div>
      </section>

      {/* Sección video interactivo */}
      <section className="sigchos-video-section">
        <SigchosVideo />
      </section>

      {/* Sección autoridades */}
      <section className="autoridades-section">
        <h2 className="autoridades-title autoridades-title-gradient">
          AUTORIDADES
        </h2>
        <p className="autoridades-subtitle">
          El <b>Gobierno Autónomo Descentralizado Municipal de Sigchos</b> está conformado por líderes comprometidos con el desarrollo, la transparencia y el bienestar de todos sus habitantes. Conoce a nuestras autoridades, su visión y el trabajo que realizan día a día por un Sigchos más próspero y sostenible.
        </p>
        <AutoridadesPreview />
      </section>
      {/* Sección contacto con gradiente */}
      <section className="contacto-gradient-section" ref={(el) => {
        if (el) {
          const observer = new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting) {
                el.classList.add('contacto-gradient-visible');
              }
            },
            { threshold: 0.1 }
          );
          observer.observe(el);
        }
      }}>
        <div className="contacto-gradient-bar">
          <span className="contacto-gradient-icon">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="24" cy="24" r="24" fill="#fff"/>
              <path d="M16 20L24 26L32 20" stroke="#ff5e62" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="16" y="18" width="16" height="12" rx="2" stroke="#ff5e62" strokeWidth="2"/>
            </svg>
          </span>
          <span
            className="contacto-gradient-text"
            style={{
              fontSize: 'clamp(1rem, 2.6vw, 1.6rem)',
              lineHeight: 1.15,
              display: 'inline-block',
              maxWidth: 'min(640px, 70%)',
              textAlign: 'center',
              padding: '8px 12px',
              boxSizing: 'border-box',
              wordBreak: 'break-word'
            }}
          >
            ¿Necesitas más información?
          </span>
          <button className="contacto-gradient-btn" onClick={() => (window.location.href = "/contactos")}>CONTÁCTANOS</button>
        </div>
      </section>

      {/* Sección atractivos */}
      <section className="atractivos-section">
        <div className="atractivos-content">
          <div className="atractivos-title-group">
            <h2
              className="atractivos-title"
              style={{
                fontSize: 'clamp(1.1rem, 3.2vw, 2.6rem)',
                lineHeight: 1.06,
                margin: 0,
                wordWrap: 'break-word',
              }}
            >
              Conoce los{' '}
              <span className="atractivos-title-gradient" style={{ fontSize: 'inherit' }}>
                Atractivos
              </span>{' '}
              de{' '}
              <span className="atractivos-title-bold" style={{ fontSize: 'inherit' }}>
                SIGCHOS
              </span>
            </h2>
          </div>
          <div className="atractivos-desc-btn">
            <p className="atractivos-desc">
              Desde <b>lagunas mágicas</b> y <b>cascadas imponentes</b> hasta <b>ruinas incas</b> y bosques milenarios, Sigchos te espera con aventuras inolvidables. Haz clic en cada atractivo turístico y descubre la historia, belleza y emociones que cada lugar tiene para ofrecer. ¡Tu próxima experiencia comienza aquí!
            </p>
            <button className="atractivos-btn" onClick={() => (window.location.href = "/atractivos")}>VER ATRACTIVOS</button>
          </div>
        </div>
        <div className="atractivos-slider">
          <div 
            className="atractivos-slider-container"
            ref={sliderRef}
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
                {(sitios && sitios.length > 0 ? sitios : []).map(({ sitio, ubicacion }, index) => (
              <a href={`/atractivos/${sitio.Id}`} key={sitio.Id} className="atractivo-slide">
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

        {/* Slider fill logic: if the number of slides is <= number of columns that fit,
            expand cards to fill the row and center them */}
        {typeof window !== 'undefined' && (
          <SliderFillEffect sliderRef={sliderRef} itemsCount={(sitios ?? []).length} />
        )}
      </section>

      {/* Sección Zapallín */}
      <section className="zapallin-section">
        <div className="zapallin-container">
          <div className="zapallin-content">
            <div className="zapallin-text-bubble">
              <h3 className="zapallin-greeting">¡Hola, viajero curioso!</h3>
              <p className="zapallin-message">
                Me llamo Zapallín, porque nací entre zapallos, tradiciones campesinas y leyendas antiguas. No soy solo una verdura con personalidad: soy el guardián de los festejos, de las danzas, los sabores y los paisajes de <span className="zapallin-highlight">SIGCHOS</span> en el corazón de Cotopaxi. Aquí, cada comunidad tiene su propia forma de celebrar la vida. ¿Te atreves a conocer las fiestas que me dieron vida? acompañame por un recorrido lleno de festividad, color y magia serrana. ¡Vamos que empieza la fiesta!
              </p>
                <button className="zapallin-btn" onClick={() => window.location.href = '/festividades'} style={{ display: 'block', margin: '16px auto 0' }}>VER TODAS LAS FESTIVIDADES</button>
            </div>
            <div className="zapallin-character">
              <img src="/Zapallin_curioso.png" alt="Zapallin" className="zapallin-img" />
            </div>
          </div>
        </div>
      </section>

      {/* Sección Galería */}
      <section className="galeria-section">
        <div className="galeria-container">
          <div className="galeria-text">
            <h2 className="galeria-title">Galería Pequeña</h2>
            <p className="galeria-desc">Cada rincón de Sigchos guarda una historia, una tradición y una vista inolvidable. Disfruta este recorrido visual por nuestros paisajes, costumbres y atractivos turísticos que hacen de este cantón un lugar único por descubrir. Desde imponentes montañas y lagunas cristalinas hasta tesoros ancestrales y senderos naturales, las imágenes capturan la esencia viva de un territorio que enamora a todo visitante. ¡Déjate inspirar y explora todo lo que Sigchos tiene para ofrecer!</p>
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

            {/* Button placed here so on narrow screens the order becomes: title -> paragraph -> images -> button -> social links */}
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                <button
                className="galeria-btn"
                onClick={() => window.location.href = '/detalleGaleria'}
                style={{
                  width: '100%',
                  maxWidth: 420,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center'
                }}
                >
                VER GALERÍA COMPLETA
                </button>
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

      {/* Sección Final */}
      <Footer/>
    </>
  );
}

    // Simple client-side helper component to adjust slider children widths
    function SliderFillEffect({ sliderRef, itemsCount }: { sliderRef: React.RefObject<HTMLDivElement | null>; itemsCount: number }) {
      useEffect(() => {
        function apply() {
          const el = sliderRef.current;
          if (!el) return;
          const containerWidth = el.clientWidth;
          // approximate column widths from CSS breakpoints: try 3, 2, or 1 columns
          const candidateWidths = [3, 2, 1].map((cols) => ({ cols, cardWidth: containerWidth / cols }));
          // pick the first where cardWidth >= 260 (min comfortable width)
          const chosen = candidateWidths.find((c) => c.cardWidth >= 260) || candidateWidths[0];

          const visibleCols = chosen.cols;

          // If we have fewer items than visibleCols, expand them to evenly fill the container
          if (itemsCount > 0 && itemsCount <= visibleCols) {
            const children = Array.from(el.children) as HTMLElement[];
            const newWidth = Math.floor(containerWidth / Math.max(1, itemsCount));
            children.forEach((ch) => {
              ch.style.flex = `0 0 ${newWidth}px`;
              ch.style.minWidth = `${newWidth}px`;
            });
            // ensure no extra negative margins/paddings interfere
            el.style.paddingLeft = '0';
            el.style.marginLeft = '0';
          } else {
            // restore defaults
            const children = Array.from(el.children) as HTMLElement[];
            children.forEach((ch) => {
              ch.style.flex = '';
              ch.style.minWidth = '';
            });
            el.style.paddingLeft = '';
            el.style.marginLeft = '';
          }
        }

        apply();
        window.addEventListener('resize', apply);
        return () => window.removeEventListener('resize', apply);
      }, [sliderRef, itemsCount]);

      return null;
    }

    // Componente de la sección de video
function SigchosVideo() {
  const [showYoutube, setShowYoutube] = useState(false);
  const [mouseX, setMouseX] = useState(0);

  // Movimiento de texto con el mouse
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const x = e.clientX / window.innerWidth;
    setMouseX(x);
  };

  // ID del video de YouTube
  const YOUTUBE_ID = "Ng6wQzV4oP4";

  return (
    <div
      className="sigchos-video-container"
      onMouseMove={handleMouseMove}
    >
      {!showYoutube && (
        <video
          className="sigchos-video-bg"
          src="/video_fondo.mp4" // Cambia por tu video
          autoPlay
            loop
            muted
            playsInline
          />
          )}
          {!showYoutube && <div className="sigchos-video-overlay" />}
          {!showYoutube && (
            <div
              className="sigchos-video-texts-bottom"
              style={{
                transform: `translateX(-${mouseX * 300}px)`
              }}
            >
              {Array.from({ length: 4 }).map((_, i) => (
                <span className="sigchos-video-text-bottom" key={i}>
                  visita <span className="sigchos-video-text-bold">SIGCHOS</span>
                </span>
              ))}
            </div>
          )}
      <div className="sigchos-video-center">
        {showYoutube ? (
          <div className="sigchos-video-iframe-wrapper" style={{zIndex: 10}}>
            <iframe
              src={`https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <button className="sigchos-video-play" onClick={() => setShowYoutube(true)}>
            <svg width="80" height="80" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="38" stroke="#fff" strokeWidth="2" fill="none" />
              <polygon points="34,28 58,40 34,52" fill="#fff" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
