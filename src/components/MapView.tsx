// components/MapView.tsx
"use client";

import dynamic from "next/dynamic";
import type { SitioConUbicacion } from "@/types/db";
import type { LatLng } from "@/utils/geo";

type Props = {
    sitios: SitioConUbicacion[];
    selectedRoute?: { geojson: GeoJSON.FeatureCollection; user: LatLng; destino: LatLng } | null;
    onMarkerClick?: (sitioId: number) => void;
};

// Carga dinámica de Leaflet con ssr: false
const MapViewInner = dynamic(() => import("./MapViewInner"), {
    ssr: false,
});

export default function MapView(props: Props) {
    return <MapViewInner {...props} />;
}
