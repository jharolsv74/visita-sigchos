"use client";

import dynamic from "next/dynamic";
import type { SitioConUbicacion } from "@/types/db";
import type { LatLng, MarkerBasic } from "@/utils/geo";

type Props = {
    // Naturaleza
    sitios?: SitioConUbicacion[];
    // Emprendimientos u otros
    markers?: MarkerBasic[];
    selectedRoute?: {
        geojson: GeoJSON.FeatureCollection;
        user: LatLng;
        destino: LatLng;
        destinoNombre: string;
    } | null;
};

const MapViewInner = dynamic(() => import("./MapViewInner"), { ssr: false });

export default function MapView(props: Props) {
    return <MapViewInner {...props} />;
}
