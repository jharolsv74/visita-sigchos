// app/mapa/page.tsx
"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCallback, useEffect, useRef, useState } from "react";
import SitioCard from "@/components/SitioCard";
import MapView from "@/components/MapView";
import { getSitiosNaturalesConUbicacion } from "@/services/sitios.service";
import type { SitioConUbicacion, RutaGeoJSON } from "@/types/db";
import type { LatLng } from "@/utils/geo";
import { cacheGet, cacheSet } from "@/utils/cache";
import { makeRouteCacheKey, isValidLatLng } from "@/utils/geo";

type UiError =
  | { code: "GEO_DENIED"; msg: string }
  | { code: "ORS_FAIL"; msg: string }
  | { code: "INVALID_COORDS"; msg: string };

export default function MapaSigchos() {
  const [sitios, setSitios] = useState<SitioConUbicacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [uiError, setUiError] = useState<UiError | null>(null);

  const [selectedRoute, setSelectedRoute] = useState<{
    geojson: RutaGeoJSON;
    user: LatLng;
    destino: LatLng;
    sitioId: number;
    destinoNombre: string;
  } | null>(null);

  // 👉 Ref hacia el contenedor del mapa para hacer scroll
  const mapSectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getSitiosNaturalesConUbicacion();
        if (mounted) setSitios(data);
      } catch (e) {
        console.error("Error cargando sitios:", e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Desplaza la vista al mapa con scroll suave
  const scrollToMap = useCallback(() => {
    // Pequeño delay para asegurar que el DOM y el mapa hayan renderizado la ruta
    requestAnimationFrame(() => {
      const node = mapSectionRef.current ?? document.getElementById("mapa-container");
      if (node) {
        // Opcional: darle foco para accesibilidad con teclado
        (node as HTMLElement).focus?.();
        node.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }, []);

  const handleVerEnMapa = useCallback(
    async (sitioId: number) => {
      setUiError(null);

      const s = sitios.find((x) => x.sitio.Id === sitioId);
      if (!s || !s.ubicacion) {
        setUiError({ code: "INVALID_COORDS", msg: "El sitio no tiene coordenadas válidas." });
        return;
      }
      const destino: LatLng = { lat: s.ubicacion.Latitud, lng: s.ubicacion.Longitud };
      const destinoNombre = s.sitio.Nombre;

      const user = await new Promise<LatLng>((resolve, reject) => {
        if (!("geolocation" in navigator)) {
          reject(new Error("Geolocalización no soportada"));
          return;
        }
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          (err) => reject(err),
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      }).catch((e) => {
        console.warn("Geo error:", e);
        setUiError({
          code: "GEO_DENIED",
          msg: "No se pudo obtener tu ubicación. Revisa permisos de geolocalización del navegador.",
        });
        return null;
      });

      if (!user || !isValidLatLng(user) || !isValidLatLng(destino)) {
        setUiError({
          code: "INVALID_COORDS",
          msg: "Coordenadas inválidas para calcular la ruta.",
        });
        return;
      }

      const cacheKey = makeRouteCacheKey(sitioId, user);
      const cached = cacheGet<RutaGeoJSON>(cacheKey);
      if (cached) {
        setSelectedRoute({ geojson: cached, user, destino, sitioId, destinoNombre });
        scrollToMap(); // 👈 si viene de caché, también scrollea
        return;
      }

      try {
        const res = await fetch("/api/route", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user, sitio: destino }),
        });

        if (!res.ok) {
          const detail = await res.json().catch(() => ({}));
          console.error("ORS fail:", detail);
          setUiError({
            code: "ORS_FAIL",
            msg: "No se pudo calcular la ruta (servicio de direcciones no disponible).",
          });
          return;
        }

        const geojson = (await res.json()) as RutaGeoJSON;
        if (!geojson?.features?.length) {
          setUiError({ code: "ORS_FAIL", msg: "La respuesta de ruta viene vacía." });
          return;
        }

        cacheSet(cacheKey, geojson);
        setSelectedRoute({ geojson, user, destino, sitioId, destinoNombre });
        scrollToMap(); // 👈 scrollea tras dibujar la ruta
      } catch (e) {
        console.error(e);
        setUiError({ code: "ORS_FAIL", msg: "No se pudo calcular la ruta (error de red)." });
      }
    },
    [sitios, scrollToMap]
  );

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-grow">
          {/* Hero Section – NO MODIFICADA */}
          <section className="main-hero relative min-h-screen">
            <div className="absolute inset-0 bg-[url('/Los_Ilinizas.jpg')] bg-cover bg-no-repeat bg-fixed"></div>
            <div className="absolute inset-0 bg-[#12141d] opacity-80"></div>
            <div className="relative z-10 flex flex-col justify-center h-screen px-12">
              <div className="max-w-[600px]">
                <h1 className="text-6xl font-black text-white mb-6">Mapa de SIGCHOS</h1>
                <p className="text-7md text-gray-300 mb-8">
                  Descubre de manera interactiva la ubicación de cada uno de los atractivos turísticos que hacen de Sigchos un destino inolvidable. Desde impresionantes paisajes naturales hasta sitios culturales llenos de historia, este mapa dinámico te permitirá ubicar fácilmente cada lugar, planificar tu ruta y vivir una experiencia completa en el corazón de Cotopaxi. ¡Haz clic en los marcadores y comienza tu recorrido virtual por Sigchos!
                </p>
                <button
                  onClick={() => {
                    const mapSection = document.getElementById('mapa-container');
                    mapSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="mapa-btn py-4 px-8 bg-transparent border-2 border-white text-white rounded-full hover:bg-white hover:text-[#12141d] transition-all duration-300 text-lg font-semibold">
                  MIRAR
                </button>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    const mapSection = document.getElementById('mapa-container');
                    mapSection?.scrollIntoView({ behavior: 'smooth' });
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

          {/* Contenido principal: columna izquierda (cards) + derecha (mapa) */}
          <section id="mapa-container" ref={mapSectionRef} className="relative z-10 px-4 sm:px-8 md:px-12 py-10" >
            <h2 className="text-5xl font-black text-white mb-12 text-center">
              Mapa SIGCHOS <span className="bg-gradient-to-r from-[#99437a] to-[#3e3473] text-transparent bg-clip-text">DINÁMICO</span>
            </h2>
            {uiError && (
              <div
                role="alert"
                className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 text-red-200 px-4 py-3"
              >
                {uiError.msg}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Columna izquierda: LISTA DE CARDS */}
              {/* Cards izquierda (con scroll) */}
              <div className="lg:col-span-5 h-[600px] overflow-y-auto pr-4 space-y-4 custom-scrollbar">
                {loading ? (
                  <div className="text-white/60">Cargando sitios...</div>
                ) : sitios.length === 0 ? (
                  <div className="text-white/60">No hay sitios naturales disponibles.</div>
                ) : (
                  sitios.map((s) => (
                    <SitioCard
                      key={s.sitio.Id}
                      id={s.sitio.Id}
                      nombre={s.sitio.Nombre}
                      descripcion={s.sitio.Descripcion}
                      imagenUrl={s.sitio.ImagenUrl ?? undefined}
                      onVerEnMapa={() => handleVerEnMapa(s.sitio.Id)}
                    />
                  ))
                )}
              </div>
              {/* Columna derecha: MAPA */}
              <div className="lg:col-span-7">
                <div
                  className="h-[520px] w-full rounded-xl overflow-hidden bg-black/20 outline-none"
                  tabIndex={-1} // permite focus por accesibilidad si se desea
                >
                  <MapView
                    sitios={sitios}
                    selectedRoute={
                      selectedRoute
                        ? {
                          geojson: selectedRoute.geojson as unknown as GeoJSON.FeatureCollection,
                          user: selectedRoute.user,
                          destino: selectedRoute.destino,
                          destinoNombre: selectedRoute.destinoNombre,
                        }
                        : null
                    }
                  />
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
