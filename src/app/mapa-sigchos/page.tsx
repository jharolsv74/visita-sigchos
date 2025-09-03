// app/mapa/page.tsx
"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCallback, useEffect, useMemo, useState } from "react";
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

  // Estado de ruta seleccionada
  const [selectedRoute, setSelectedRoute] = useState<{
    geojson: RutaGeoJSON;
    user: LatLng;
    destino: LatLng;
    sitioId: number;
  } | null>(null);

  // Carga de sitios naturales
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

  const handleVerEnMapa = useCallback(async (sitioId: number) => {
    setUiError(null);

    // 1) Hallar el sitio y su ubicación
    const s = sitios.find((x) => x.sitio.Id === sitioId);
    if (!s || !s.ubicacion) {
      setUiError({ code: "INVALID_COORDS", msg: "El sitio no tiene coordenadas válidas." });
      return;
    }
    const destino: LatLng = { lat: s.ubicacion.Latitud, lng: s.ubicacion.Longitud };

    // 2) Obtener geolocalización del usuario
    const user = await new Promise<LatLng>((resolve, reject) => {
      if (!("geolocation" in navigator)) {
        reject(new Error("Geolocalización no soportada"));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => reject(err),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }).catch((e) => {
      console.warn("Geo error:", e);
      setUiError({
        code: "GEO_DENIED",
        msg:
          "No se pudo obtener tu ubicación. Revisa permisos de geolocalización del navegador.",
      });
      return null;
    });

    if (!user || !isValidLatLng(user) || !isValidLatLng(destino)) {
      if (!uiError) {
        setUiError({
          code: "INVALID_COORDS",
          msg: "Coordenadas inválidas para calcular la ruta.",
        });
      }
      return;
    }

    // 3) Cache local
    const cacheKey = makeRouteCacheKey(sitioId, user);
    const cached = cacheGet<RutaGeoJSON>(cacheKey);
    if (cached) {
      setSelectedRoute({ geojson: cached, user, destino, sitioId });
      return;
    }

    // 4) Llamada al API interno /api/route (proxy ORS)
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
      setSelectedRoute({ geojson, user, destino, sitioId });
    } catch (e) {
      console.error(e);
      setUiError({
        code: "ORS_FAIL",
        msg: "No se pudo calcular la ruta (error de red).",
      });
    }
  }, [sitios, uiError]);

  // Permite cambiar de sitio y limpiar ruta anterior
  const handleMarkerClick = useCallback(
    (sitioId: number) => {
      // Si el usuario hace click en un marcador, simplemente selecciona ese sitio (sin recalcular ruta)
      // o podrías disparar el mismo flujo de "Ver en mapa":
      void handleVerEnMapa(sitioId);
    },
    [handleVerEnMapa]
  );

  // === RENDER ===
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
                {/* Mantén tu copy/CTA exactos si ya los tenías */}
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Explora Sigchos</h1>
                <p className="text-white/80">
                  Descubre sus maravillas naturales y planifica tu ruta fácilmente.
                </p>
              </div>
            </div>
          </section>

          {/* Contenido principal: columna izquierda (cards) + derecha (mapa) */}
          <section className="relative z-10 px-4 sm:px-8 md:px-12 py-10">
            {uiError && (
              <div
                role="alert"
                className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 text-red-200 px-4 py-3"
              >
                {uiError.msg}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Columna izquierda: LISTA DE CARDS – mantengo tu layout */}
              <div className="lg:col-span-5 space-y-4">
                {loading ? (
                  <div className="text-white/60">Cargando sitios...</div>
                ) : sitios.length === 0 ? (
                  <div className="text-white/60">
                    No hay sitios naturales disponibles. {/* TODO: revisar filtro de categoría */}
                  </div>
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

              {/* Columna derecha: MAPA – usa el contenedor de tu diseño */}
              <div className="lg:col-span-7">
                <div className="h-[520px] w-full rounded-xl overflow-hidden bg-black/20">
                  <MapView
                    sitios={sitios}
                    selectedRoute={
                      selectedRoute
                        ? {
                          geojson: selectedRoute.geojson as unknown as GeoJSON.FeatureCollection,
                          user: selectedRoute.user,
                          destino: selectedRoute.destino,
                        }
                        : null
                    }
                    onMarkerClick={handleMarkerClick}
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
