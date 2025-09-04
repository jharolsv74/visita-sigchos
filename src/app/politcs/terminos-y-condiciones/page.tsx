import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TerminosPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0f1724] text-white">
      <Navbar />
      <main className="flex-grow container mx-auto px-6 py-16">
  <article className="prose prose-invert max-w-4xl mx-auto text-center">
        <section className="py-24 md:py-32">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-6">Términos y Condiciones</h1>
        </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-2">1. Propósito del Sitio</h2>
            <p className="text-gray-300">Este sitio tiene como propósito principal <strong>difundir información pública y visual</strong> relacionada con el cantón Sigchos con fines educativos, turísticos y de promoción cultural. Toda la información compartida proviene de fuentes públicas, sitios oficiales y contenidos de libre acceso.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-2">2. Uso de Imágenes</h2>
            <p className="text-gray-300">Las imágenes publicadas en este sitio web han sido tomadas de fuentes públicas, redes sociales o enviadas por colaboradores con fines informativos y de difusión turística. Ninguna imagen exhibe rostros claramente identificables de personas, garantizando así la privacidad individual. Si consideras que alguna imagen vulnera tus derechos de autor o privacidad, puedes solicitar su revisión o eliminación escribiendo a: <strong>gadmunicipal@gadmsigchos.gob.ec</strong></p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-2">3. Propiedad Intelectual</h2>
            <p className="text-gray-300">Todos los contenidos de este sitio (textos, imágenes, diseño y estructura) están protegidos por las leyes de propiedad intelectual. El uso, copia o distribución total o parcial de los contenidos deberá contar con autorización previa, salvo en los casos en que se indique lo contrario o el material sea de dominio público.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-2">4. Fuentes de Información</h2>
            <p className="text-gray-300">La información publicada ha sido recopilada de fuentes públicas, como páginas oficiales, medios de comunicación y material turístico. No se garantiza la exactitud total o la actualización permanente de todos los datos, por lo que se recomienda verificar con entidades oficiales en caso de requerir información específica o vigente.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-2">5. Responsabilidad del Usuario</h2>
            <p className="text-gray-300">El usuario acepta utilizar el sitio únicamente con fines informativos y turísticos, comprometiéndose a no utilizarlo para realizar actividades ilícitas o que puedan dañar el sitio, su contenido o a terceros.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-2">6. Modificaciones</h2>
            <p className="text-gray-300">Nos reservamos el derecho de actualizar o modificar estos Términos y Condiciones en cualquier momento y sin previo aviso. Cualquier cambio será publicado en esta misma página, por lo que se recomienda revisarla periódicamente.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-2">7. Contacto</h2>
            <p className="text-gray-300">Para dudas, sugerencias o solicitudes relacionadas con estos Términos y Condiciones, puedes comunicarte con nosotros a través de: <strong>gadmunicipal@gadmsigchos.gob.ec</strong></p>
            <p className="text-gray-400 text-sm mt-4">&copy; {new Date().getFullYear()} GAD Municipal Sigchos</p>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
}
