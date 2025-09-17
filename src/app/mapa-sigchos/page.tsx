"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import SitioCard from "@/components/SitioCard";
import MapView from "@/components/MapView";
import RouteOverlay from "@/components/RouteOverlay";
import { getSitiosNaturalesConUbicacion } from "@/services/sitios.service";
import type { SitioConUbicacion } from "@/types/db";
import type { LatLng, MarkerBasic } from "@/utils/geo";
import { createVerEnMapaHandler, type UiError } from "@/hooks/useVerEnMapa";

export default function MapaSigchos() {
  const [sitios, setSitios] = useState<SitioConUbicacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [uiError, setUiError] = useState<UiError | null>(null);

  const [selectedRoute, setSelectedRoute] = useState<{
    geojson: GeoJSON.FeatureCollection;
    user: LatLng;
    destino: LatLng;
    sitioId: number;
    destinoNombre: string;
  } | null>(null);

  // Overlay “Dibujando ruta…”
  const [dibujandoRuta, setDibujandoRuta] = useState(false);

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
    requestAnimationFrame(() => {
      const node = mapSectionRef.current ?? document.getElementById("mapa-container");
      node?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  // 🔁 Normaliza sitios → MarkerBasic (solo para el handler genérico)
  const markers = useMemo<MarkerBasic[]>(
    () =>
      sitios
        .filter((s) => !!s.ubicacion)
        .map((s) => ({
          id: s.sitio.Id,
          nombre: s.sitio.Nombre,
          lat: s.ubicacion!.Latitud,
          lng: s.ubicacion!.Longitud,
        })),
    [sitios]
  );

  // ✅ Handler reutilizable (misma API /api/route con body { user, sitio })
  const handleVerEnMapa = useMemo(
    () =>
      createVerEnMapaHandler({
        entityNS: "sitio",
        getItems: () => markers,
        setUiError,
        setSelectedRoute: (r) => {
          if (!r) return setSelectedRoute(null);
          setSelectedRoute({
            geojson: r.geojson,
            user: r.user,
            destino: r.destino,
            sitioId: r.entityId,
            destinoNombre: r.destinoNombre,
          });
        },
        scrollToMap,
        setLoading: setDibujandoRuta, // 🔔 Overlay ON/OFF
      }),
    [markers, scrollToMap]
  );

  return (
    <>
      {/* Overlay “Dibujando ruta…” */}
      {dibujandoRuta && <RouteOverlay message="Dibujando ruta…" />}

      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-grow">
          {/* Hero Section – sin cambios */}
          <section className="main-hero relative min-h-screen">
            <div className="absolute inset-0 bg-[url('/Los_Ilinizas.jpg')] bg-cover bg-no-repeat bg-fixed"></div>
            <div className="absolute inset-0 bg-[#12141d] opacity-80"></div>
            <div className="relative z-10 flex flex-col justify-center h-screen px-12">
              <div className="max-w-[600px]">
                <h1 className="text-6xl font-black text-white mb-6">Mapa de SIGCHOS</h1>
                <p className="text-7md text-gray-300 mb-8">
                  Descubre de manera interactiva la ubicación de cada uno de los atractivos turísticos que hacen de
                  Sigchos un destino inolvidable…
                </p>
                <button
                  onClick={() => {
                    const mapSection = document.getElementById("mapa-container");
                    mapSection?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="mapa-btn py-4 px-8 bg-transparent border-2 border-white text-white rounded-full hover:bg-white hover:text-[#12141d] transition-all duration-300 text-lg font-semibold"
                >
                  MIRAR
                </button>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    const mapSection = document.getElementById("mapa-container");
                    mapSection?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="absolute bottom-24 right-24 w-16 h-16 rounded-full border-2 border-white flex items-center justify-center hover:bg-white hover:text-[#12141d] text-white transition-all duration-300"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>
              </div>
            </div>
          </section>

          {/* Contenido principal: columna izquierda (cards) + derecha (mapa) */}
          <section id="mapa-container" ref={mapSectionRef} className="relative z-10 px-4 sm:px-8 md:px-12 py-10">
            <h2 className="text-5xl font-black text-white mb-12 text-center">
              Mapa SIGCHOS{" "}
              <span className="bg-gradient-to-r from-[#99437a] to-[#3e3473] text-transparent bg-clip-text">
                DINÁMICO
              </span>
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
                <div className="h-[520px] w-full rounded-xl overflow-hidden bg-black/20 outline-none" tabIndex={-1}>
                  <MapView
                    // Naturaleza sigue usando "sitios" (no markers)
                    sitios={sitios}
                    selectedRoute={
                      selectedRoute
                        ? {
                          geojson: selectedRoute.geojson,
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
