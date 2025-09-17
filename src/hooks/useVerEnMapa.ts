"use client";

import type { LatLng } from "@/utils/geo";
import { isValidLatLng, makeRouteCacheKeyNS } from "@/utils/geo";
import { cacheGet, cacheSet } from "@/utils/cache";

export type UiError =
  | { code: "GEO_DENIED"; msg: string }
  | { code: "ORS_FAIL"; msg: string }
  | { code: "INVALID_COORDS"; msg: string };

export type RutaGeoJSON = GeoJSON.FeatureCollection;
export type MarkerBasic = { id: number; nombre: string; lat: number; lng: number };

type Params = {
  entityNS: string;                     // "empr" | "sitio" | ...
  getItems: () => MarkerBasic[];        // lista actual normalizada a marcadores
  setUiError: (e: UiError | null) => void;
  setSelectedRoute: (route: {
    geojson: RutaGeoJSON;
    user: LatLng;
    destino: LatLng;
    destinoNombre: string;
    entityId: number;
  } | null) => void;
  scrollToMap?: () => void;
  routeEndpoint?: string;               // default "/api/route"
  setLoading?: (v: boolean) => void;    //  NUEVO: para el overlay
};

export function createVerEnMapaHandler({
  entityNS,
  getItems,
  setUiError,
  setSelectedRoute,
  scrollToMap,
  routeEndpoint = "/api/route",
  setLoading,
}: Params) {
  return async function handleVerEnMapa(entityId: number) {
    setUiError(null);
    setLoading?.(true);

    try {
      const list = getItems();
      const item = list.find((x) => x.id === entityId);
      if (!item) {
        setUiError({ code: "INVALID_COORDS", msg: "No se encontró el destino seleccionado." });
        return;
      }

      const destino: LatLng = { lat: item.lat, lng: item.lng };
      const destinoNombre = item.nombre;

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
        setUiError({ code: "INVALID_COORDS", msg: "Coordenadas inválidas para calcular la ruta." });
        return;
      }

      const cacheKey = makeRouteCacheKeyNS(entityNS, entityId, user);
      const cached = cacheGet<RutaGeoJSON>(cacheKey);
      if (cached) {
        setSelectedRoute({ geojson: cached, user, destino, destinoNombre, entityId });
        scrollToMap?.();
        return;
      }

      // Compatibilidad con tu API actual: body { user, sitio: destino }
      const res = await fetch(routeEndpoint, {
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
      setSelectedRoute({ geojson, user, destino, destinoNombre, entityId });
      scrollToMap?.();
    } catch (e) {
      console.error(e);
      setUiError({ code: "ORS_FAIL", msg: "No se pudo calcular la ruta (error de red)." });
    } finally {
      setLoading?.(false); //  siempre apagamos el overlay
    }
  };
}
