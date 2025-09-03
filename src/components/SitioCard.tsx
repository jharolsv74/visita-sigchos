// components/SitioCard.tsx
"use client";

import Image from "next/image";

type Props = {
    id: number;
    nombre: string;
    descripcion?: string | null;
    imagenUrl?: string | null;
    onVerEnMapa: () => void;
};

export default function SitioCard({ id, nombre, descripcion, imagenUrl, onVerEnMapa }: Props) {
    // Mantén tus clases actuales; ajusta los nombres si ya existen en tu CSS.
    return (
        <article
            className="place-card rounded-xl overflow-hidden shadow-md bg-white/5 border border-white/10 backdrop-blur"
            data-sitio-id={id}
        >
            {/* Mantengo layout típico de tus cards; no cambio estilos clave */}
            <div className="relative w-full aspect-[16/9]">
                {imagenUrl ? (
                    <Image src={imagenUrl} alt={nombre} fill className="object-cover" />
                ) : (
                    <div className="w-full h-full bg-gray-800" />
                )}
            </div>

            <div className="p-4 space-y-2">
                <h3 className="text-white font-semibold text-base">{nombre}</h3>
                {descripcion ? (
                    <p className="text-white/70 text-sm line-clamp-3">{descripcion}</p>
                ) : (
                    <p className="text-white/40 text-sm italic">Sin descripción</p>
                )}

                <button
                    type="button"
                    className="mt-2 inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg bg-[#543fb2] hover:opacity-90 text-white transition"
                    onClick={onVerEnMapa}
                    aria-label={`Ver ${nombre} en el mapa`}
                >
                    Ver en mapa
                </button>
            </div>
        </article>
    );
}
