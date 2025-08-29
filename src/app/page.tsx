"use client";

import React, { useState } from "react";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Home() {

  // Datos del carrusel (puedes agregar más items aquí)
  const carouselItems = [
    {
      image: "/parroquias/1.jpg",
      title: <>Ciudad de Sigchos</>,
      desc: <>Es conocida como el <b>"Jardín colgante de los Andes"</b> por su belleza natural y ubicación entre montañas.</>,
      btn: "CIUDAD DE SIGCHOS"
    },
    {
      image: "/parroquias/4.jpg",
      title: <>LAS PAMPAS</>,
      desc: <>Es una de las mayores productoras de leche de Cotopaxi, con una cultura profundamente campesina.</>,
      btn: "LAS PAMPAS"
    },
    {
      image: "/parroquias/3.jpg",
      title: <>Isinliví</>,
      desc: <>Pueblo de caminos sagrados y miradores infinitos, ideal para senderistas y buscadores de paz.</>,
      btn: "Isinliví"
    },
    {
      image: "/parroquias/2.jpg",
      title: <>CHUGCHILÁN</>,
      desc: <>Punto estratégico en la ruta del <b>Quilotoa Loop</b>, famosa por sus senderos de trekking y vistas espectaculares a la laguna del Quilotoa.</>,
      btn: "CHUGCHILÁN"
    },
    {
      image: "/parroquias/5.jpg",
      title: <>PALO QUEMADO</>,
      desc: <>Aquí la Sierra y la Costa se abrazan, creando una mezcla única de climas, sabores y culturas.</>,
      btn: "PALO QUEMADO"
    },
    // Puedes agregar más objetos aquí
  ];  // Configuración
  const visibleCards = 3; // Cuántas tarjetas mostrar a la vez
  const [startIdx, setStartIdx] = useState(0);
  const [animating, setAnimating] = useState(false);
  const total = carouselItems.length;

  // Función para obtener los items visibles, con repetición infinita
  const getVisibleItems = () => {
    return Array.from({ length: visibleCards }, (_, i) => carouselItems[(startIdx + i) % total]);
  };

  // Animación y cambio de índice
  const handlePrev = () => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setStartIdx((prev) => (prev - 1 + total) % total);
      setAnimating(false);
    }, 350);
  };
  const handleNext = () => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setStartIdx((prev) => (prev + 1) % total);
      setAnimating(false);
    }, 350);
  };

  return (
    <>
      <section className="main-hero">
        <Navbar />
        {/* Hero content aquí si lo necesitas */}
      </section>
      <section className="carousel-section">
        <div className="carousel-nav carousel-nav-left">
          <button className="carousel-arrow" onClick={handlePrev} disabled={animating}>&#8592;</button>
        </div>
        <div className={`carousel-cards${animating ? " carousel-animating" : ""}`}>
          {getVisibleItems().map((item, idx) => (
            <div className={`carousel-card${idx === 1 ? " carousel-card-center" : ""}`} key={idx}>
              <div className="carousel-card-bg" />
              <div className="carousel-card-content">
                <div className="carousel-card-image">
                  <img src={item.image} alt={typeof item.title === 'string' ? item.title : 'Parroquia'} />
                </div>
                <h2 className="carousel-title">{item.title}</h2>
                <p className="carousel-desc">{item.desc}</p>
                <button className="carousel-btn">{item.btn}</button>
              </div>
            </div>
          ))}
        </div>
        <div className="carousel-nav carousel-nav-right">
          <button className="carousel-arrow" onClick={handleNext} disabled={animating}>&#8594;</button>
        </div>
      </section>

      {/* Sección informativa Sigchos */}
      <section className="sigchos-info-section">
        <h2 className="sigchos-info-title">
          Conoce un poco más sobre <span className="sigchos-info-title-italic">SIGCHOS</span>
          <span className="sigchos-info-line" />
        </h2>
        <div className="sigchos-info-content">
          <img className="sigchos-info-img" src="/Home_v2.jpg" alt="Sigchos panorámica" />
          <div className="sigchos-info-textbox">
            <h3 className="sigchos-info-heading">Sigchos Cantón de Cotopaxi</h3>
            <p className="sigchos-info-desc">
Sigchos es uno de los siete cantones de la provincia de Cotopaxi, Ecuador. Se encuentra al noroeste de Latacunga, en medio de la Cordillera Occidental de los Andes, con un paisaje accidentado y quebrado, situado en las cuencas de los ríos Toachi y Pilatón. Su nombre deriva de "Sigchila", el nombre de un cacique local, cuyo significado se interpreta como “brazo de hierro”. La temperatura media anual cercana a 13°C, con fluctuaciones entre 9°C y 20°C. La precipitación anual se sitúa entre 500 y 1000 mm.
            </p>
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
        <div className="autoridades-cards">
          <div className="autoridad-card">
            <img className="autoridad-img" src="/Carlos Lisintuña.jpg" alt="Autoridad 1" />
            <div className="autoridad-info">
              <div className="autoridad-nombre">Sr. Carlos Armando Lisiñtuña Lutuala</div>
              <div className="autoridad-cargo">Concejal</div>
              <div className="autoridad-desc">Concejal y Preside la comisión de Turismo, Ambiente, Educación, Cultura, Deportes y Recreación.</div>
            </div>
          </div>
          <div className="autoridad-card">
            <img className="autoridad-img" src="/Marco Granja.jpg" alt="Autoridad 2" />
            <div className="autoridad-info">
              <div className="autoridad-nombre">Sr. Marco Rafael Granja Maldonado</div>
              <div className="autoridad-cargo">Concejal</div>
              <div className="autoridad-desc">Concejal, integra las comisiones de Legislación & Fiscalización e Igualdad y Género; también lidera Servicios Públicos, Plazas, Mercados y Camales.</div>
            </div>
          </div>
          <div className="autoridad-card">
            <img className="autoridad-img" src="/Mario Porras.jpg" alt="Autoridad 3" />
            <div className="autoridad-info">
              <div className="autoridad-nombre">Sr. Mario Germán Porras Pérez</div>
              <div className="autoridad-cargo">Concejal</div>
              <div className="autoridad-desc">Concejal y Preside la Comisión de Planificación y Obras Públicas y participa en las comisiones de Legislación y Turismo & Ambiente.</div>
            </div>
          </div>
        </div>
        <div className="autoridades-btn-container">
          <button className="autoridades-btn">VER TODAS LAS AUTORIDADES</button>
        </div>
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
          <span className="contacto-gradient-text">¿Necesitas más información?</span>
          <button className="contacto-gradient-btn">CONTÁCTANOS</button>
        </div>
      </section>

      {/* Sección atractivos */}
      <section className="atractivos-section">
        <div className="atractivos-content">
          <div className="atractivos-title-group">
            <h2 className="atractivos-title">
              Conoce los <span className="atractivos-title-gradient">Atractivos</span> de <span className="atractivos-title-bold">SIGCHOS</span>
            </h2>
          </div>
          <div className="atractivos-desc-btn">
            <p className="atractivos-desc">
              Desde <b>lagunas mágicas</b> y <b>cascadas imponentes</b> hasta <b>ruinas incas</b> y bosques milenarios, Sigchos te espera con aventuras inolvidables. Haz clic en cada atractivo turístico y descubre la historia, belleza y emociones que cada lugar tiene para ofrecer. ¡Tu próxima experiencia comienza aquí!
            </p>
            <button className="atractivos-btn">VER ATRACTIVOS</button>
          </div>
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
            {[
              {
                image: '/Maqui-Machay.webp',
                title: 'Maqui y Machay',
                subtitle: 'Maqui y Machay',
                url: '/atractivos/maqui-y-machay'
              },
              {
                image: '/Bosque_Protector_Sarapullo.jpg',
                title: 'Bosque Protector',
                subtitle: 'Palo Quemado',
                url: '/atractivos/sarapullo'
              },
              {
                image: '/licamancha.jpeg',
                title: 'Licamancha',
                subtitle: 'Guacusig',
                url: '/atractivos/licamancha'
              },
              {
                image: '/Toachi.jpg',
                title: 'Cañón del Toachi',
                subtitle: 'Guacusig',
                url: '/atractivos/canon-del-toachi'
              },
              {
                image: '/Los_Ilinizas.jpg',
                title: 'Los Ilinizas',
                subtitle: 'Guacusig',
                url: '/atractivos/los-ilinizas'
              }
            ].map((item, index) => (
              <a href={item.url} key={index} className="atractivo-slide">
                <div className="atractivo-slide-content">
                  <img src={item.image} alt={item.title} className="atractivo-slide-img" />
                  <div className="atractivo-slide-overlay">
                    <h3 className="atractivo-slide-title">{item.title}</h3>
                    <p className="atractivo-slide-subtitle">{item.subtitle}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
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
              <button className="zapallin-btn">VER TODAS LAS FESTIVIDADES</button>
            </div>
            <div className="zapallin-character">
              <img src="/Zapallín_curioso.png" alt="Zapallín" className="zapallin-img" />
            </div>
          </div>
        </div>
      </section>

      {/* Sección Galería */}
      <section className="galeria-section">
        <div className="galeria-container">
          <div className="galeria-text">
            <h2 className="galeria-title">Galería Pequeña</h2>
            <p className="galeria-desc">
              Cada rincón de Sigchos guarda una historia, una tradición y una vista inolvidable. Disfruta este recorrido visual por nuestros paisajes, costumbres y atractivos turísticos que hacen de este cantón un lugar único por descubrir. Desde imponentes montañas y lagunas cristalinas hasta tesoros ancestrales y senderos naturales, las imágenes capturan la esencia viva de un territorio que enamora a todo visitante. ¡Déjate inspirar y explora todo lo que Sigchos tiene para ofrecer!
            </p>
            <button className="galeria-btn">VER GALERÍA COMPLETA</button>
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

      {/* Sección Final */}
      <Footer/>
    </>
  );
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
