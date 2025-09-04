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
    return (
        <article
            data-sitio-id={id}
            className="location-card bg-gradient-to-r from-[#99437a] to-[#3e3473] p-6 rounded-xl shadow-md border border-white/10"
        >
            <div className="flex items-center gap-6">
                {/* Avatar circular 80x80 */}
                <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white/20">
                    {imagenUrl ? (
                        <div className="relative w-full h-full">
                            <Image
                                src={imagenUrl}
                                alt={nombre}
                                fill
                                className="object-cover"
                                sizes="80px"
                                priority={false}
                            />
                        </div>
                    ) : (
                        <img
                            src="/Los_Ilinizas.jpg" // fallback local; cambia si deseas
                            alt="imagen del sitio"
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>

                {/* Texto + botón */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-2xl font-bold text-white mb-2">{nombre}</h3>
                    <p className="text-gray-200/90 text-sm leading-relaxed line-clamp-4">
                        {descripcion || "Sin descripción disponible."}
                    </p>

                    <div className="mt-4">
                        <button
                            type="button"
                            onClick={onVerEnMapa}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/15 hover:bg-white/25 text-white text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                            aria-label={`Ver ${nombre} en el mapa`}
                        >
                            Ver en mapa
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
}
