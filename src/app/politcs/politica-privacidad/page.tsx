import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PoliticaPrivacidad() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0f1724] text-white">
      <Navbar />
      <main className="flex-grow container mx-auto px-6 py-16">
  <article className="prose prose-invert max-w-4xl mx-auto text-center">
        <section className="py-24 md:py-32">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-6 text-center">Aviso sobre Cookies y Tratamiento de Datos</h1>
        </section>

          <section>
            <h2 className="text-2xl font-bold mt-6 mb-2">1. Responsable del Tratamiento</h2>
            <p className="text-gray-300">El responsable del tratamiento de los datos personales es:</p>
            <ul className="text-gray-300 ml-4 list-disc mx-auto text-left max-w-3xl">
              <li>Nombre del sitio o proyecto: <strong>www.visita-sigchos.com</strong></li>
              <li>Correo electrónico de contacto: <strong>gadmunicipal@gadmsigchos.gob.ec</strong></li>
              <li>Ubicación: Cantón Sigchos, Cotopaxi, Ecuador.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-6 mb-2">2. Base legal para el Tratamiento</h2>
            <p className="text-gray-300">Tratamos los datos personales de acuerdo con la normativa aplicable, entre ellas:</p>
            <ul className="text-gray-300 ml-4 list-disc mx-auto text-left max-w-3xl">
              <li>El Reglamento General de Protección de Datos (GDPR), cuando aplique.</li>
              <li>La normativa nacional vigente en materia de protección de datos personales.</li>
            </ul>
            <p className="text-gray-300">La recopilación y tratamiento se basa en el consentimiento explícito del usuario cuando sea requerido, y en el interés legítimo para mejorar la experiencia del visitante y garantizar la seguridad del sitio.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-6 mb-2">3. Datos que Recopilamos</h2>
            <p className="text-gray-300">Este sitio no recopila datos personales sensibles de forma identificativa de los visitantes de forma directa. Sin embargo, se pueden recopilar datos técnicos y de uso, por ejemplo:</p>
            <ul className="text-gray-300 ml-4 list-disc mx-auto text-left max-w-3xl">
              <li>Dirección IP o identificador anónimo.</li>
              <li>Tipo y versión de navegador.</li>
              <li>Páginas visitadas y tiempo de permanencia.</li>
              <li>Fecha y hora de acceso.</li>
              <li>Datos de geolocalización aproximada cuando el usuario lo proporciona o el dispositivo lo facilita.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-6 mb-2">4. Finalidad del Tratamiento</h2>
            <p className="text-gray-300">Los datos recopilados se utilizan para:</p>
            <ul className="text-gray-300 ml-4 list-disc mx-auto text-left max-w-3xl">
              <li>Mejorar el contenido y la funcionalidad del sitio.</li>
              <li>Analizar tendencias y estadísticas de uso (análisis anónimo).</li>
              <li>Detectar y corregir errores técnicos y de seguridad.</li>
              <li>Responder a consultas enviadas por los usuarios a través de formularios de contacto.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-6 mb-2">5. Cookies</h2>
            <p className="text-gray-300">Este sitio puede utilizar cookies técnicas y analíticas para mejorar la navegación y obtener estadísticas de uso. No utilizamos cookies con fines publicitarios personalizados por terceros en este sitio.</p>
            <p className="text-gray-300">Puedes aceptar o rechazar el uso de cookies a través de la configuración de tu navegador. Ten en cuenta que desactivar cookies puede afectar la funcionalidad del sitio.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-6 mb-2">6. Compartición de Datos</h2>
            <p className="text-gray-300">No compartimos, vendemos ni alquilamos tus datos personales a terceros para fines comerciales. En algunos casos, podemos compartir información con proveedores de servicios que nos ayudan a operar el sitio (por ejemplo, servicios de hosting, analítica o mapas). Estos proveedores actúan como encargados del tratamiento y están sujetos a contrato.</p>
            <p className="text-gray-300">Ejemplos: Google Analytics, Google Maps u otros servicios de terceros integrados en el sitio que procesan datos de forma limitada para proporcionar funcionalidad.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-6 mb-2">7. Derechos del Usuario</h2>
            <p className="text-gray-300">De acuerdo con la normativa aplicable, los usuarios tienen derecho a:</p>
            <ul className="text-gray-300 ml-4 list-disc mx-auto text-left max-w-3xl">
              <li>Acceder a sus datos.</li>
              <li>Solicitar la rectificación de datos inexactos.</li>
              <li>Solicitar la supresión u "derecho al olvido" cuando proceda.</li>
              <li>Solicitar la limitación u oposición al tratamiento.</li>
              <li>Solicitar la portabilidad de los datos, cuando corresponda.</li>
              <li>Retirar el consentimiento en cualquier momento sin perjuicio de la licitud del tratamiento previo.</li>
            </ul>
            <p className="text-gray-300">Para ejercer estos derechos, puedes escribir a: <strong>gadmunicipal@gadmsigchos.gob.ec</strong></p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-6 mb-2">8. Seguridad</h2>
            <p className="text-gray-300">Implementamos medidas de seguridad técnicas y organizativas para proteger los datos personales. No obstante, ningún sistema es 100% seguro, por lo que recomendamos prudencia en el envío de información sensible a través de internet.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-6 mb-2">9. Enlaces a Terceros</h2>
            <p className="text-gray-300">El sitio contiene enlaces a sitios de terceros. No somos responsables de las prácticas de privacidad ni del contenido de esos sitios. Recomendamos revisar las políticas de privacidad de los sitios externos antes de facilitar información personal.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-6 mb-2">10. Modificaciones a esta Política</h2>
            <p className="text-gray-300">Nos reservamos el derecho de actualizar esta política en cualquier momento. Las modificaciones se publicarán en esta misma página y entrarán en vigor desde su publicación.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-6 mb-2">11. Contacto</h2>
            <p className="text-gray-300">Para consultas relacionadas con esta política o para ejercer tus derechos, puedes escribir a: <strong>gadmunicipal@gadmsigchos.gob.ec</strong></p>
            <p className="text-gray-400 text-sm mt-4">&copy; {new Date().getFullYear()} GAD Municipal Sigchos</p>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
}
