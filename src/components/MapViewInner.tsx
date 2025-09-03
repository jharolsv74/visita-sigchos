// components/MapViewInner.tsx
"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L, { LatLngBoundsExpression } from "leaflet";
import { useEffect, useMemo } from "react";
import type { SitioConUbicacion } from "@/types/db";
import type { LatLng } from "@/utils/geo";

// Fix íconos de Leaflet en Next
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
    iconUrl: markerIcon.src ?? markerIcon,
    iconRetinaUrl: markerIcon2x.src ?? markerIcon2x,
    shadowUrl: markerShadow.src ?? markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

function FitOnData({ bounds }: { bounds: LatLngBoundsExpression | null }) {
    const map = useMap();
    useEffect(() => {
        if (bounds) {
            map.fitBounds(bounds, { padding: [20, 20] });
        }
    }, [bounds, map]);
    return null;
}

type Props = {
    sitios: SitioConUbicacion[];
    selectedRoute?: { geojson: GeoJSON.FeatureCollection; user: LatLng; destino: LatLng } | null;
    onMarkerClick?: (sitioId: number) => void;
};

export default function MapViewInner({ sitios, selectedRoute, onMarkerClick }: Props) {
    const initialCenter: [number, number] = [-0.705, -78.885];
    const initialZoom = 11;

    const bounds = useMemo<LatLngBoundsExpression | null>(() => {
        if (selectedRoute) {
            const coords =
                (selectedRoute.geojson.features?.[0] as any)?.geometry?.coordinates ?? [];
            if (coords.length) {
                const ll = coords.map(([lng, lat]: [number, number]) => [lat, lng]) as [number, number][];
                return L.latLngBounds(ll);
            }
            return L.latLngBounds([
                [selectedRoute.user.lat, selectedRoute.user.lng],
                [selectedRoute.destino.lat, selectedRoute.destino.lng],
            ]);
        }
        const pts = sitios
            .map((s) =>
                s.ubicacion ? [s.ubicacion.Latitud, s.ubicacion.Longitud] as [number, number] : null
            )
            .filter(Boolean) as [number, number][];
        return pts.length ? L.latLngBounds(pts) : null;
    }, [sitios, selectedRoute]);

    const routeLatLngs = useMemo(() => {
        const coords =
            (selectedRoute?.geojson.features?.[0] as any)?.geometry?.coordinates ?? [];
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

    return (
        <MapContainer
            center={initialCenter}
            zoom={initialZoom}
            scrollWheelZoom
            className="w-full h-full rounded-xl overflow-hidden"
        >
            <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {siteMarkers.map((m) => (
                <Marker
                    key={m.id}
                    position={[m.lat, m.lng]}
                    eventHandlers={{ click: () => onMarkerClick?.(m.id) }}
                >
                    <Popup>{m.nombre}</Popup>
                </Marker>
            ))}

            {userMarker && (
                <Marker position={[userMarker.lat, userMarker.lng]}>
                    <Popup>Tu ubicación</Popup>
                </Marker>
            )}

            {destinoMarker && (
                <Marker position={[destinoMarker.lat, destinoMarker.lng]}>
                    <Popup>Destino</Popup>
                </Marker>
            )}

            {routeLatLngs.length > 1 && (
                <Polyline positions={routeLatLngs} weight={5} opacity={0.9} />
            )}

            <FitOnData bounds={bounds} />
        </MapContainer>
    );
}
