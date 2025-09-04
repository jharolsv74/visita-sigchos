import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AvisoCookies() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0f1724] text-white">
      <Navbar />
      <main className="flex-grow container mx-auto px-6 py-16">
  <article className="prose prose-invert max-w-4xl mx-auto text-center">
        <section className="py-20 md:py-32">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-6">¿Qué son las Cookies?</h1>
        </section>

          <section>
            <p className="text-gray-300">Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo (ordenador, smartphone o tablet) cuando visitas un sitio web. Permiten recordar información sobre tu visita, como idioma preferido, configuración, o comportamiento de navegación.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-6 mb-2">2. ¿Qué tipos de Cookies utilizamos?</h2>
            <p className="text-gray-300">En este sitio utilizamos los siguientes tipos de cookies:</p>
            <ol className="text-gray-300 ml-4 list-decimal mx-auto text-left max-w-3xl">
              <li className="mb-2"><strong>Cookies Técnicas o Necesarias</strong><br/>Estas cookies son esenciales para el correcto funcionamiento del sitio web y no requieren consentimiento del usuario. Permiten, por ejemplo, la navegación, la seguridad o el acceso a funcionalidades básicas.</li>
              <li className="mb-2"><strong>Cookies de Análisis (Opcionales)</strong><br/>Estas cookies recopilan información anónima sobre cómo los usuarios interactúan con el sitio (por ejemplo, páginas visitadas, tiempo de permanencia, errores). Utilizamos servicios como <strong>Google Analytics</strong>, que pueden recopilar datos no identificativos bajo sus propias políticas de privacidad.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-6 mb-2">3. Finalidad del uso de Cookies</h2>
            <p className="text-gray-300">Las cookies nos ayudan a:</p>
            <ul className="text-gray-300 ml-4 list-disc mx-auto text-left max-w-3xl">
              <li>Entender cómo interactúan los visitantes con el sitio.</li>
              <li>Mejorar la estructura, contenido y accesibilidad del sitio.</li>
              <li>Garantizar que el sitio funcione de manera óptima.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-6 mb-2">4. ¿Cómo gestionar o desactivar las Cookies?</h2>
            <p className="text-gray-300">Puedes permitir, bloquear o eliminar las cookies desde la configuración de tu navegador. A continuación, enlaces a los principales navegadores:</p>
            <ul className="text-gray-300 ml-4 list-disc mx-auto text-left max-w-3xl">
              <li><a className="underline text-gray-200" href="https://support.google.com/chrome/answer/95647">Google Chrome</a></li>
              <li><a className="underline text-gray-200" href="https://support.mozilla.org/firefox">Mozilla Firefox</a></li>
              <li><a className="underline text-gray-200" href="https://support.microsoft.com/microsoft-edge">Microsoft Edge</a></li>
              <li><a className="underline text-gray-200" href="https://support.apple.com/safari">Safari</a></li>
            </ul>
            <p className="text-gray-300">Ten en cuenta que desactivar ciertas cookies puede afectar el funcionamiento del sitio.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-6 mb-2">5. Terceros que usan Cookies</h2>
            <p className="text-gray-300">Este sitio puede incluir contenido o servicios de terceros, como mapas de Google, vídeos embebidos o enlaces externos, los cuales pueden utilizar sus propias cookies bajo sus políticas:</p>
            <ul className="text-gray-300 ml-4 list-disc mx-auto text-left max-w-3xl">
              <li>Google Maps</li>
              <li>Google Fonts</li>
              <li>YouTube u otros servicios de terceros (si aplica)</li>
            </ul>
            <p className="text-gray-300">No tenemos control sobre estas cookies; recomendamos consultar directamente las políticas de dichos servicios.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-6 mb-2">6. Cambios en esta Política</h2>
            <p className="text-gray-300">Nos reservamos el derecho de modificar esta Política de Cookies para adaptarla a futuras exigencias normativas o cambios en el sitio. Los cambios se notificarán en esta misma página.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-6 mb-2">7. Contacto</h2>
            <p className="text-gray-300">Si tienes dudas sobre nuestra Política de Cookies, puedes escribirnos a: <strong>gadmunicipal@gadmsigchos.gob.ec</strong></p>
            <p className="text-gray-400 text-sm mt-4">&copy; {new Date().getFullYear()} GAD Municipal Sigchos</p>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
}
