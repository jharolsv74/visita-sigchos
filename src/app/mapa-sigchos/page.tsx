"use client";

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function MapaSigchos() {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow">
          {/* Hero Section */}
          <section className="main-hero relative min-h-screen">
            <div className="absolute inset-0 bg-[url('/Los_Ilinizas.jpg')] bg-cover bg-no-repeat bg-fixed"></div>
            <div className="absolute inset-0 bg-[#12141d] opacity-80"></div>
            <div className="relative z-10 flex flex-col justify-center h-screen px-12">
              <div className="max-w-[600px]">
                <h1 className="text-6xl font-black text-white mb-6">Mapa de SIGCHOS</h1>
                <p className="text-7md text-gray-300 mb-8">
                  Descubre de manera interactiva la ubicación de cada uno de los atractivos turísticos que hacen de Sigchos un destino inolvidable. Desde impresionantes paisajes naturales hasta sitios culturales llenos de historia, este mapa dinámico te permitirá ubicar fácilmente cada lugar, planificar tu ruta y vivir una experiencia completa en el corazón de Cotopaxi. ¡Haz clic en los marcadores y comienza tu recorrido virtual por Sigchos!
                </p>
                <button 
                    onClick={() => {
                        const mapSection = document.getElementById('map-section');
                        mapSection?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="mapa-btn py-4 px-8 bg-transparent border-2 border-white text-white rounded-full hover:bg-white hover:text-[#12141d] transition-all duration-300 text-lg font-semibold">
                  MIRAR
                </button>
              </div>
              <div className="flex justify-end">
                <button 
                  onClick={() => {
                    const mapSection = document.getElementById('map-section');
                    mapSection?.scrollIntoView({ behavior: 'smooth' });
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

          {/* Map Section */}
          <section id="map-section" className="py-16 bg-[#12141d]">
            <div className="container mx-auto px-4">
              <h2 className="text-5xl font-black text-white mb-12 text-center">
                Mapa SIGCHOS <span className="bg-gradient-to-r from-[#99437a] to-[#3e3473] text-transparent bg-clip-text">DINÁMICO</span>
              </h2>
              
              <div className="grid grid-cols-12 gap-8">
                {/* Location Cards - Left Side */}
                <div className="col-span-5 h-[600px] overflow-y-auto pr-4 space-y-4 custom-scrollbar">
                  <div className="location-card bg-gradient-to-r from-[#99437a] to-[#3e3473] p-6 rounded-xl">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                        <img src="/Los_Ilinizas.jpg" alt="Los Ilinizas" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">Los Ilinizas</h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          Las faldas occidentales del Ilinizas pertenecen al cantón Sigchos, especialmente accesibles desde las parroquias Pastocalle y Toacaso, así como de poblaciones vecinas próximas a El Chaupi y Lasso.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="location-card bg-gradient-to-r from-[#99437a] to-[#3e3473] p-6 rounded-xl">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                        <img src="/Maqui-Machay.webp" alt="Maqui y Machay" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">Maqui y Machay</h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          Este sitio arqueológico está ubicado en la parroquia Chugchilán, en el sector denominado Malqui-Machay, dentro del cantón Sigchos.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="location-card bg-gradient-to-r from-[#99437a] to-[#3e3473] p-6 rounded-xl">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                        <img src="/Bosque_Protector_Sarapullo.jpg" alt="Bosque Protector Sarapullo" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">Bosque Protector Sarapullo</h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          Está situado en la parroquia Palo Quemado, en el recinto Sarapullo, dentro del cantón Sigchos, provincia de Cotopaxi.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="location-card bg-gradient-to-r from-[#99437a] to-[#3e3473] p-6 rounded-xl">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                        <img src="/licamancha.jpeg" alt="Licamancha" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">Licamancha</h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          Se localiza en la parroquia urbana de Sigchos, en el sector Guacusig-Licamancha, a unos 7 km de la cabecera cantonal, siendo un destino de fácil acceso y gran potencial.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Map Container - Right Side */}
                <div className="col-span-7 relative">
                  <div className="absolute right-4 top-4 z-10 flex flex-col gap-2">
                    <button className="w-8 h-8 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors">
                      <span className="text-[#12141d] text-xl font-bold">+</span>
                    </button>
                    <button className="w-8 h-8 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors">
                      <span className="text-[#12141d] text-xl font-bold">−</span>
                    </button>
                  </div>
                  <div className="bg-white rounded-xl shadow-xl h-[600px]">
                    {/* Map will go here */}
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
