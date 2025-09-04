"use client";

import React from 'react';
import type { SitioConUbicacion } from '@/types/db';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

type Props = {
  sitioWithUbicacion: SitioConUbicacion;
};

export default function SitioTemplate({ sitioWithUbicacion }: Props) {
  const { sitio, ubicacion, parroquia, categoria } = sitioWithUbicacion as any;
  const hero = sitio.ImagenUrl || '/Home.jpg';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Large contact hero section (inserted at the top) */}
        <section className="main-hero relative min-h-screen">
          <div className="absolute inset-0 bg-[url('/2.jpg')] bg-cover bg-no-repeat bg-fixed"></div>
          <div className="absolute inset-0 bg-[#12141d] opacity-80"></div>
          <div className="relative z-10 flex flex-col justify-center h-screen px-12">
            <div className="max-w-[600px]">
            <h1 className="text-6xl font-black text-white mb-6">{sitio.Nombre}</h1>
            <p className="text-lg text-gray-300 mb-8">
                Descubre los principales atractivos: cascadas, miradores, rutas de senderismo y sitios culturales. Encuentra recomendaciones, consejos y cómo llegar a cada lugar para planificar tu visita.
            </p><button 
                  onClick={() => {
                      const formSection = document.getElementById('atractivos-section');
                      formSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="contactanos-btn py-4 px-8 bg-transparent border-2 border-white text-white rounded-full hover:bg-white hover:text-[#12141d] transition-all duration-300 text-lg font-semibold">
                Explorar
              </button>
            </div>
            <div className="flex justify-end">
              <button 
                onClick={() => {
                  const formSection = document.getElementById('atractivos-section');
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

        {/* Main content split into sections */}
        <div id="atractivos-section" className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-6" style={{ padding: '50px' }}>
            {/* Left column: title, paragraph, and stacked info cards */}
            <div className="flex flex-col gap-6">
              <section aria-labelledby="sitio-title">
                <h1 id="sitio-title" className="text-4xl font-black mb-2 text-white">{sitio.Nombre}</h1>
                <p className="text-white leading-relaxed">{sitio.Descripcion ?? ''}</p>
              </section>

              <div className="space-y-4 max-w-[100%]">
                <div className="p-4 rounded-lg shadow overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
                  <h3 className="font-semibold mb-2">Información del Sitio</h3>
                  <dl className="text-sm">
                    <div className="flex"><dt className="font-medium">Parroquia: </dt><dd className="font-medium"> {parroquia?.Nombre ?? 'N/A'}</dd></div>
                    <div className="flex"><dt className="font-medium">Categoría: </dt><dd className="font-medium"> {categoria?.Nombre ?? categoria?.Valor ?? 'N/A'}</dd></div>
                  </dl>
                </div>

                {ubicacion ? (
                  <div className="p-4 rounded-lg shadow overflow-hidden bg-gradient-to-r from-green-400 via-teal-400 to-blue-500 text-white">
                    <h3 className="font-semibold mb-2">Ubicación</h3>
                    <p className="text-sm">Latitud: <span className="font-medium">{ubicacion.Latitud}</span></p>
                    <p className="text-sm">Longitud: <span className="font-medium">{ubicacion.Longitud}</span></p>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${ubicacion.Latitud},${ubicacion.Longitud}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block mt-2 text-white/90 underline font-medium"
                    >
                      Ver en Google Maps
                    </a>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Right column: large image */}
            <div className="md:col-span-2">
              <section className="mb-6">
                <img src={sitio.ImagenUrl ?? '/file.svg'} alt={sitio.Nombre} className="w-full rounded-lg object-cover shadow-lg" />
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
