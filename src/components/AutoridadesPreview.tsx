"use client";

import React, { useEffect, useState } from 'react';
import { getAutoridades } from '@/services/autoridades.service';
import type { Autoridad } from '@/types/db';

export default function AutoridadesPreview() {
  const [autoridades, setAutoridades] = useState<Autoridad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getAutoridades();
        if (mounted) setAutoridades(data ?? []);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const getText = (a: Autoridad, ...fields: string[]) => {
    for (const f of fields) {
      const v = (a as any)[f];
      if (typeof v === 'string' && v.trim()) return v;
    }
    return undefined;
  };

  const items = loading ? Array.from({ length: 3 }) : autoridades.slice(0, 3);

  return (
    <>
      <div className="autoridades-cards">
        {items.map((a, i) => {
          if (loading) {
            return (
              <div className="autoridad-card" key={i}>
                <div className="autoridad-img placeholder" />
                <div className="autoridad-info">
                  <div className="autoridad-nombre placeholder-line" />
                  <div className="autoridad-cargo placeholder-line short" />
                  <div className="autoridad-desc placeholder-line small" />
                </div>
              </div>
            );
          }

          const nombre = getText(a as Autoridad, 'Nombre', 'nombre') ?? '—';
          const cargo = getText(a as Autoridad, 'Cargo', 'cargo') ?? '';
          const imagen = getText(a as Autoridad, 'ImagenUrl', 'imagenUrl', 'imagen') ?? '/icon-site-sigchos.png';
          const descripcion = getText(a as Autoridad, 'Descripcion', 'descripcion') ?? '';

          return (
            <div className="autoridad-card" key={(a as any).Id ?? i}>
              <img className="autoridad-img" src={imagen} alt={nombre} />
              <div className="autoridad-info">
                <div className="autoridad-nombre">{nombre}</div>
                <div className="autoridad-cargo">{cargo}</div>
                {descripcion && <div className="autoridad-desc">{descripcion}</div>}
              </div>
            </div>
          );
        })}
      </div>
      <div className="autoridades-btn-container">
        <a className="autoridades-btn" href="/autoridades">VER TODAS LAS AUTORIDADES</a>
      </div>
    </>
  );
}
