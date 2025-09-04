// components/MapViewInner.tsx
"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L, { LatLngBoundsExpression } from "leaflet";
import { useEffect, useMemo } from "react";
import type { SitioConUbicacion } from "@/types/db";
import type { LatLng } from "@/utils/geo";

// ====== Fallback: icono default de Leaflet (por si falla un PNG) ======
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
    iconUrl: (markerIcon as any).src ?? markerIcon,
    iconRetinaUrl: (markerIcon2x as any).src ?? markerIcon2x,
    shadowUrl: (markerShadow as any).src ?? markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

// Helper para crear un icon y tener fallback si la ruta no existe
function makeIcon(path: string, size: [number, number], anchor: [number, number], popupAnchor: [number, number]) {
    try {
        if (typeof path !== "string" || !path.startsWith("/")) return DefaultIcon; // requiere estar en /public
        return L.icon({ iconUrl: path, iconSize: size, iconAnchor: anchor, popupAnchor });
    } catch {
        return DefaultIcon;
    }
}

// ========== ICONOS PERSONALIZADOS (usa Zapallin por defecto) ==========
// Si luego quieres imágenes distintas, cambia los paths aquí:
const SITIO_ICON_PATH = "/Zapallin_vestido.png";
const USER_ICON_PATH = "/Zapallin_vestido.png";
const DESTINO_ICON_PATH = "/Zapallin_vestido.png";

const SitioIcon = makeIcon(SITIO_ICON_PATH, [36, 36], [18, 36], [0, -36]);
const UserIcon = makeIcon(USER_ICON_PATH, [36, 36], [18, 36], [0, -36]);
const DestinoIcon = makeIcon(DESTINO_ICON_PATH, [40, 40], [20, 40], [0, -40]);

// ========== FIT BOUNDS ==========
function FitOnData({ bounds }: { bounds: LatLngBoundsExpression | null }) {
    const map = useMap();
    useEffect(() => {
        if (bounds) map.fitBounds(bounds, { padding: [20, 20] });
    }, [bounds, map]);
    return null;
}

type Props = {
    sitios: SitioConUbicacion[];
    selectedRoute?: {
        geojson: GeoJSON.FeatureCollection;
        user: LatLng;
        destino: LatLng;
        destinoNombre: string; // 👈 usado en el popup del destino
    } | null;
};

export default function MapViewInner({ sitios, selectedRoute }: Props) {
    const initialCenter: [number, number] = [-0.705, -78.885];
    const initialZoom = 11;

    const bounds = useMemo<LatLngBoundsExpression | null>(() => {
        if (selectedRoute) {
            const coords = (selectedRoute.geojson.features?.[0] as any)?.geometry?.coordinates ?? [];
            if (coords.length) {
                const ll = coords.map(([lng, lat]: [number, number]) => [lat, lng]) as [number, number][];
                return L.latLngBounds(ll);
            }
            return L.latLngBounds(
                [selectedRoute.user.lat, selectedRoute.user.lng],
                [selectedRoute.destino.lat, selectedRoute.destino.lng]
            );
        }
        const pts = sitios
            .map((s) => (s.ubicacion ? [s.ubicacion.Latitud, s.ubicacion.Longitud] as [number, number] : null))
            .filter(Boolean) as [number, number][];
        return pts.length ? L.latLngBounds(pts) : null;
    }, [sitios, selectedRoute]);

    const routeLatLngs = useMemo(() => {
        const coords = (selectedRoute?.geojson.features?.[0] as any)?.geometry?.coordinates ?? [];
        return coords.map(([lng, lat]: [number, number]) => [lat, lng]) as [number, number][];
    }, [selectedRoute]);

    const siteMarkers = useMemo(
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

    const userMarker = selectedRoute ? selectedRoute.user : null;
    const destinoMarker = selectedRoute ? selectedRoute.destino : null;
    const destinoNombre = selectedRoute ? selectedRoute.destinoNombre : null;

    return (
        <MapContainer
            center={initialCenter}
            zoom={initialZoom}
            scrollWheelZoom
            className="w-full h-full rounded-xl overflow-hidden"
        >
            <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* 📍 Sitios turísticos */}
            {siteMarkers.map((m) => (
                <Marker key={m.id} position={[m.lat, m.lng]} icon={SitioIcon}>
                    <Popup>{m.nombre}</Popup>
                </Marker>
            ))}

            {/* 🙋 Usuario */}
            {userMarker && (
                <Marker position={[userMarker.lat, userMarker.lng]} icon={UserIcon}>
                    <Popup>Tu ubicación</Popup>
                </Marker>
            )}

            {/* 🏁 Destino */}
            {destinoMarker && (
                <Marker position={[destinoMarker.lat, destinoMarker.lng]} icon={DestinoIcon}>
                    <Popup>{destinoNombre ?? "Destino"}</Popup>
                </Marker>
            )}

            {/* 🛣️ Ruta */}
            {routeLatLngs.length > 1 && <Polyline positions={routeLatLngs} weight={5} opacity={0.9} />}

            <FitOnData bounds={bounds} />
        </MapContainer>
    );
}
