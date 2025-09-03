import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getAutoridades } from '@/services/autoridades.service';
import type { Autoridad } from '@/types/db';

export default async function AutoridadesPage() {
  const autoridades: Autoridad[] = await getAutoridades();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-16 bg-[#202127]">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-8">Autoridades</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {autoridades.length === 0 && (
              <p className="text-gray-300">No se encontraron autoridades.</p>
            )}

            {autoridades.map((a) => (
              <div key={a.Id} className="bg-[#23242b] p-6 rounded-lg shadow-xl">
                {a.ImagenUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={String(a.ImagenUrl)} alt={a.Nombre} className="w-full h-48 object-cover rounded-md mb-4" />
                )}
                <h2 className="text-xl font-semibold text-white">{a.Nombre}</h2>
                {a.Cargo && <p className="text-gray-400">{a.Cargo}</p>}
                <div className="mt-4 space-y-1 text-gray-300">
                  {a.Email && <p>Email: {String(a.Email)}</p>}
                  {a.Telefono && <p>Tel: {String(a.Telefono)}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
