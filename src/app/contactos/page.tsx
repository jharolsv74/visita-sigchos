"use client";

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Contactos() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    mensaje: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí irá la lógica para enviar el formulario
    console.log('Formulario enviado:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow">
          {/* Hero Section */}
          <section className="main-hero relative min-h-screen">
            <div className="absolute inset-0 bg-[url('/2.jpg')] bg-cover bg-no-repeat bg-fixed"></div>
            <div className="absolute inset-0 bg-[#12141d] opacity-80"></div>
            <div className="relative z-10 flex flex-col justify-center h-screen px-12">
              <div className="max-w-[600px]">
                <h1 className="text-6xl font-black text-white mb-6">¡Hablemos de Sigchos!</h1>
                <p className="text-7md text-gray-300 mb-8">¿Tienes preguntas sobre qué hacer en Sigchos?</p>
                <button 
                    onClick={() => {
                        const formSection = document.getElementById('contact-form-section');
                        formSection?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="contactanos-btn py-4 px-8 bg-transparent border-2 border-white text-white rounded-full hover:bg-white hover:text-[#12141d] transition-all duration-300 text-lg font-semibold">
                  CONTÁCTANOS
                </button>
              </div>
              <div className="flex justify-end">
                <button 
                  onClick={() => {
                    const formSection = document.getElementById('contact-form-section');
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

          {/* Formulario y Detalles de Contacto */}
          <section id="contact-form-section" className="py-16 bg-[#202127]">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Formulario */}
                <div className="bg-[#23242b] p-8 rounded-lg shadow-xl">
                  <h2 className="text-3xl font-bold text-white mb-6">¿Aún indeciso?</h2>
                  <p className="text-gray-300 mb-8">
                    Cuéntanos tus dudas sobre SIGCHOS, o escribe tu mensaje si quieres tener más información.
                  </p>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <input
                          type="text"
                          name="nombre"
                          placeholder="Nombre"
                          className="w-full p-3 bg-[#2a2b33] text-white rounded-md border border-gray-700 focus:border-[#ff5e62] focus:ring-1 focus:ring-[#ff5e62] outline-none transition"
                          value={formData.nombre}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          name="apellido"
                          placeholder="Apellido"
                          className="w-full p-3 bg-[#2a2b33] text-white rounded-md border border-gray-700 focus:border-[#ff5e62] focus:ring-1 focus:ring-[#ff5e62] outline-none transition"
                          value={formData.apellido}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div>
                      <input
                        type="email"
                        name="email"
                        placeholder="Dirección de correo electrónico"
                        className="w-full p-3 bg-[#2a2b33] text-white rounded-md border border-gray-700 focus:border-[#ff5e62] focus:ring-1 focus:ring-[#ff5e62] outline-none transition"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <textarea
                        name="mensaje"
                        placeholder="Escribe tu mensaje o duda sobre SIGCHOS"
                        rows={6}
                        className="w-full p-3 bg-[#2a2b33] text-white rounded-md border border-gray-700 focus:border-[#ff5e62] focus:ring-1 focus:ring-[#ff5e62] outline-none transition"
                        value={formData.mensaje}
                        onChange={handleChange}
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="bg-[#fc7303] hover:bg-[#f53d00] text-white font-semibold py-3 px-8 rounded-full transition duration-300 w-full"
                    >
                      ENVIAR
                    </button>
                  </form>
                </div>

                {/* Información de Contacto */}
                <div className="space-y-8">
                  <div className="bg-[#23242b] p-8 rounded-lg shadow-xl">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="bg-[#fc7303] p-3 rounded-full">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">Correo Electrónico</h3>
                        <p className="text-gray-400">gadmunicipal@sigchos.gob.ec</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#23242b] p-8 rounded-lg shadow-xl">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="bg-[#fc7303] p-3 rounded-full">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">Teléfono</h3>
                        <p className="text-gray-400">(+593) 03 271 44 44</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#23242b] p-8 rounded-lg shadow-xl">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="bg-[#fc7303] p-3 rounded-full">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">Dirección</h3>
                        <p className="text-gray-400">Calle Rodrigo Iturralde y pasaje 14 de Noviembre</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#23242b] p-8 rounded-lg shadow-xl">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="bg-[#fc7303] p-3 rounded-full">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">Horario de Atención</h3>
                        <p className="text-gray-400">Lunes a Viernes: 8:00 AM - 5:00 PM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
