import { createFileRoute } from "@tanstack/react-router";

import { LegalPageLayout, LegalSection } from "@/components/legal-page-layout";
import { buildPublicPageHead } from "@/lib/seo/meta";
import { DONATION_URL } from "@/lib/site";

export const Route = createFileRoute("/privacidad")({
  head: () =>
    buildPublicPageHead({
      path: "/privacidad",
      title: "Política de tratamiento de datos — Corporación Enlace Colombia",
      description:
        "Política de tratamiento de datos personales de la Corporación Enlace Colombia — CEC, conforme a la Ley 1581 de 2012.",
    }),
  component: PrivacidadPage,
});

function PrivacidadPage() {
  return (
    <LegalPageLayout
      subtitle="Corporación Enlace Colombia — CEC"
      title="Política de tratamiento de datos personales"
      effectiveDate="junio de 2025"
    >
      <LegalSection title="1. Identificación del responsable">
        <ul>
          <li>
            <strong>Razón social:</strong> Corporación Enlace Colombia — CEC
          </li>
          <li>
            <strong>Dirección:</strong> Calle 124 # 70A – 28, Bogotá D.C., Colombia
          </li>
          <li>
            <strong>Teléfono:</strong> <a href="tel:+576016439200">(601) 6439200</a>
          </li>
          <li>
            <strong>Correo electrónico:</strong>{" "}
            <a href="mailto:info@enlacecolombia.org">info@enlacecolombia.org</a>
          </li>
          <li>
            <strong>Horario de atención:</strong> Lunes a viernes, 7:00 AM – 5:00 PM
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="2. Marco legal">
        <p>
          La presente política se rige por la Ley Estatutaria 1581 de 2012, el Decreto 1377 de 2013
          y demás normas que las complementen, modifiquen o sustituyan, relacionadas con la
          protección de datos personales en Colombia.
        </p>
      </LegalSection>

      <LegalSection title="3. Datos que recolectamos">
        <p>Recolectamos los siguientes datos personales según el canal de contacto:</p>
        <p>
          <strong>Formulario de contacto / peticiones de oración:</strong>
        </p>
        <p>Nombre completo, número de teléfono, correo electrónico y motivo de la solicitud.</p>
        <p>
          <strong>Donaciones:</strong>
        </p>
        <p>
          Nombre completo, número de cédula o NIT, ciudad de residencia, teléfono y correo
          electrónico. Estos datos son requeridos para el cumplimiento de obligaciones tributarias
          ante la DIAN.
        </p>
        <p>
          <strong>Navegación en el sitio web:</strong>
        </p>
        <p>
          Datos de uso mediante cookies técnicas y analíticas (ver{" "}
          <a href="/cookies">política de cookies</a>).
        </p>
      </LegalSection>

      <LegalSection title="4. Finalidad del tratamiento">
        <p>Los datos personales recolectados serán utilizados exclusivamente para:</p>
        <ul>
          <li>Brindar consejería espiritual y realizar seguimiento a las peticiones de oración.</li>
          <li>Procesar donaciones y expedir certificados de donación con validez tributaria.</li>
          <li>
            Enviar comunicaciones relacionadas con la labor de la Corporación: reflexiones,
            noticias, eventos y campañas como la Maratónica.
          </li>
          <li>Gestionar el registro y la atención a través de nuestro Contact Center.</li>
          <li>Cumplir con obligaciones legales y tributarias vigentes en Colombia.</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Tratamiento y almacenamiento">
        <p>
          Los datos personales son almacenados en el sistema de gestión interno de la Corporación
          Enlace Colombia. Dicho sistema es de uso exclusivo de la organización y no se comparte
          información con terceros, salvo en los siguientes casos estrictamente necesarios:
        </p>
        <ul>
          <li>
            <strong>Pasarela de pagos (ZonaPagos):</strong> únicamente los datos indispensables para
            procesar la transacción. Esta plataforma tiene sus propias políticas de privacidad. Las
            donaciones se procesan en{" "}
            <a href={DONATION_URL} target="_blank" rel="noopener noreferrer">
              ZonaPagos
            </a>
            .
          </li>
          <li>
            <strong>Autoridades competentes:</strong> cuando exista obligación legal o requerimiento
            de entidad gubernamental.
          </li>
        </ul>
        <p>En ningún caso vendemos, cedemos ni comercializamos datos personales.</p>
      </LegalSection>

      <LegalSection title="6. Tiempo de conservación">
        <ul>
          <li>
            <strong>Datos de donantes:</strong> mínimo 5 años, en cumplimiento de obligaciones
            tributarias (Estatuto Tributario colombiano).
          </li>
          <li>
            <strong>Datos de contacto y consejería:</strong> mientras el titular no solicite su
            eliminación o hasta que cese la finalidad para la que fueron recolectados.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="7. Derechos del titular">
        <p>
          De conformidad con la Ley 1581 de 2012, usted como titular de los datos personales tiene
          derecho a:
        </p>
        <ul>
          <li>Conocer los datos personales que tenemos sobre usted.</li>
          <li>
            Actualizar y rectificar la información cuando sea inexacta, incompleta o desactualizada.
          </li>
          <li>
            Solicitar la supresión de sus datos cuando no exista obligación legal de conservarlos.
          </li>
          <li>Revocar la autorización otorgada para el tratamiento de sus datos.</li>
          <li>
            Presentar quejas ante la Superintendencia de Industria y Comercio (SIC) cuando considere
            que sus derechos han sido vulnerados.
          </li>
        </ul>
        <p>
          <strong>¿Cómo ejercer sus derechos?</strong>
        </p>
        <p>
          Envíe su solicitud al correo{" "}
          <a href="mailto:info@enlacecolombia.org">info@enlacecolombia.org</a> con el asunto
          &quot;Habeas Data&quot;, indicando su nombre completo, número de cédula y la solicitud
          específica. Daremos respuesta en un plazo máximo de 15 días hábiles.
        </p>
      </LegalSection>

      <LegalSection title="8. Cookies">
        <p>
          Nuestro sitio web utiliza cookies técnicas necesarias para su funcionamiento. Podemos
          utilizar herramientas de análisis como Google Analytics para entender el comportamiento de
          los visitantes de forma anónima y mejorar la experiencia del sitio. Usted puede configurar
          su navegador para rechazar las cookies, aunque esto puede afectar algunas funciones del
          sitio.
        </p>
        <p>
          Consulte el detalle en nuestra <a href="/cookies">política de cookies</a>.
        </p>
      </LegalSection>

      <LegalSection title="9. Modificaciones a esta política">
        <p>
          La Corporación Enlace Colombia se reserva el derecho de modificar esta política en
          cualquier momento. Los cambios serán publicados en este sitio web con la fecha de
          actualización. El uso continuado del sitio después de dichos cambios constituye la
          aceptación de la nueva versión.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
