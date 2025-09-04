"use client";

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getAutoridades } from '@/services/autoridades.service';
import type { Autoridad } from '@/types/db';

export default function AutoridadesPage() {
  const [autoridades, setAutoridades] = useState<Autoridad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getAutoridades()
      .then((data) => {
        if (mounted) setAutoridades(data);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Reusable parser for list-like DB fields
  const parseList = (v: unknown) => {
    if (v == null) return null;
    const s = String(v).trim();
    if (!s) return null;
    const parts = s.split(/\r?\n|•|·|;/).map((p) => p.trim()).filter(Boolean);
    if (parts.length <= 1) return <p className="text-sm leading-relaxed">{s}</p>;
    return (
      <ul className="list-disc list-inside text-sm leading-relaxed space-y-1">
        {parts.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <section className="main-hero relative min-h-screen">
          <div className="absolute inset-0 bg-[url('/2.jpg')] bg-cover bg-no-repeat bg-fixed"></div>
          <div className="absolute inset-0 bg-[#12141d] opacity-80"></div>
          <div className="relative z-10 flex flex-col justify-center h-screen px-12">
            <div className="max-w-[600px]">
              <h1 className="text-6xl font-black text-white mb-6">Autoridades del GAD de SIGCHOS</h1>
              <p className="text-7md text-gray-300 mb-8">El cantón Sigchos cuenta con un equipo de autoridades municipales comprometidas con el desarrollo territorial, social y económico de la región. Estas autoridades, elegidas democráticamente, tienen la responsabilidad de representar a la ciudadanía y gestionar los recursos públicos de manera transparente y eficiente. Desde la alcaldía hasta el concejo municipal, su labor se orienta a impulsar políticas que mejoren la calidad de vida de los habitantes, fomenten la participación ciudadana y fortalezcan el crecimiento sostenible del cantón.</p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  const formSection = document.getElementById('autoridades-section');
                  formSection?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="absolute bottom-24 right-24 w-16 h-16 rounded-full border-2 border-white flex items-center justify-center hover:bg-white hover:text-[#12141d] text-white transition-all duration-300"
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </button>
            </div>
          </div>
        </section>

        <section id="autoridades-section" className="container mx-auto px-4 py-12 bg-gradient-to-r from-green-400 via-yellow-300 to-yellow-500 rounded-xl">
            <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                Autoridades del GAD de{' '}
                <span className="bg-gradient-to-r from-blue-300 via-blue-500 to-pink-600 bg-clip-text text-transparent">
                SIGCHOS
                </span>
            </h2>
            </div>

          {loading && <p className="text-gray-300">Cargando...</p>}

          {!loading && autoridades.length === 0 && (
            <p className="text-gray-300">No se encontraron autoridades.</p>
          )}

          {/* Featured authority (first item) */}
          {(() => {
            const alcalde = autoridades.find(
              (a) => typeof a.Cargo === 'string' && a.Cargo.trim().toLowerCase() === 'alcalde'
            );

            if (!alcalde) return null;

            return (
            <div className="mb-16">
            <div className="bg-gradient-to-br from-[#111317] to-[#0b0d10] rounded-xl p-8 shadow-2xl">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="flex-shrink-0">
                  {alcalde.ImagenUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={String(alcalde.ImagenUrl)}
                  alt={alcalde.Nombre}
                  className="w-56 h-56 md:w-64 md:h-64 rounded-full object-cover ring-4 ring-white shadow-lg"
                />
                  ) : (
                <div className="w-56 h-56 md:w-64 md:h-64 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold">{alcalde.Nombre?.charAt(0)}</div>
                  )}
                </div>

                <div className="flex-1 text-left">
                  <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
                {alcalde.Nombre && alcalde.Apellido ? `${alcalde.Nombre} ${alcalde.Apellido}` : alcalde.Nombre}
                  </h2>
                  {alcalde.Cargo && <p className="text-lg text-[#c7ced6] mt-1">{alcalde.Cargo}</p>}

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 bg-[#0f1720] p-5 rounded-lg text-gray-300">
                    <h3 className="text-white font-semibold mb-2">Instrucción</h3>
                    {alcalde.Descripcion ? (
                        <p className="text-sm leading-relaxed">{String(alcalde.Instruccion)}</p>
                    ) : (
                        <p className="text-sm text-gray-400">Descripción no disponible.</p>
                    )}
                    </div>

                <aside className="bg-[#0f1720] p-4 rounded-lg text-gray-300">
                  {typeof alcalde.Instruccion === 'string' && (
                    <div className="mb-3">
                      <h4 className="text-white font-semibold">Descripción</h4>
                      <div className="mt-2">{parseList(alcalde.Descripcion)}</div>
                    </div>
                  )}

                  {typeof alcalde.AnterioresCargos === 'string' && (
                    <div className="mt-3">
                      <h4 className="text-white font-semibold">Anteriores cargos</h4>
                      <div className="mt-2">{parseList(alcalde.AnterioresCargos)}</div>
                    </div>
                  )}
                </aside>
                  </div>
                </div>
              </div>
            </div>
            </div>
            );
          })()}

        {/* Grid for remaining authorities (excludes any with Cargo === 'alcalde') */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {autoridades
            .filter((a) => !(typeof a.Cargo === 'string' && a.Cargo.trim().toLowerCase() === 'alcalde'))
            .map((a) => (
              <article key={a.Id} className="bg-transparent">
            <div className="transform hover:-translate-y-2 transition rounded-lg overflow-hidden shadow-lg bg-gradient-to-br from-[#0b1220] to-[#071018] p-6">
              <div className="flex flex-col items-center">
                {a.ImagenUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                src={String(a.ImagenUrl)}
                alt={a.Nombre}
                className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-md"
                  />
                ) : (
                  <div className="w-40 h-40 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold">
                {a.Nombre?.charAt(0)}
                  </div>
                )}

                <div className="mt-4 text-center px-2">
                  <h4 className="text-lg font-semibold text-white">
                {a.Nombre && a.Apellido ? `${a.Nombre} ${a.Apellido}` : a.Nombre}
                  </h4>

                  {a.Cargo && (
                <span className="inline-block mt-2 px-3 py-1 text-sm bg-[#ff7b2d] text-white rounded-full">
                  {a.Cargo}
                </span>
                  )}

                  <div className="mt-4 text-sm text-gray-300">
                {a.Descripcion ? (
                  <p className="leading-relaxed max-h-24 overflow-hidden">{String(a.Descripcion)}</p>
                ) : (
                  <p className="text-sm text-gray-400">Descripción no disponible.</p>
                )}
                  </div>
                </div>
              </div>
            </div>
              </article>
            ))}
        </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
