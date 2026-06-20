import { createFileRoute } from "@tanstack/react-router";

import { LegalPageLayout, LegalSection } from "@/components/legal-page-layout";
import { openConsentSettings } from "@/components/consent-notice";
import { buildPublicPageHead } from "@/lib/seo/meta";

export const Route = createFileRoute("/cookies")({
  head: () =>
    buildPublicPageHead({
      path: "/cookies",
      title: "Política de cookies — Corporación Enlace Colombia",
      description:
        "Información sobre el uso de cookies en el sitio web de la Corporación Enlace Colombia — CEC.",
    }),
  component: CookiesPage,
});

function CookiesPage() {
  return (
    <LegalPageLayout
      subtitle="Corporación Enlace Colombia — CEC"
      title="Política de cookies"
      effectiveDate="junio de 2025"
    >
      <LegalSection title="1. ¿Qué son las cookies?">
        <p>
          Las cookies son pequeños archivos de texto que un sitio web almacena en su dispositivo
          (computador, tablet o teléfono) cuando usted lo visita. Permiten que el sitio recuerde
          información sobre su visita, como preferencias básicas o datos de navegación, para mejorar
          su experiencia.
        </p>
      </LegalSection>

      <LegalSection title="2. ¿Qué cookies utilizamos?">
        <p>
          <strong>Cookies técnicas (necesarias)</strong>
        </p>
        <p>
          Son imprescindibles para el funcionamiento del sitio. Permiten la navegación, la seguridad
          básica y el uso de funciones esenciales. Sin ellas, algunas partes del sitio podrían no
          operar correctamente.
        </p>
        <p>
          <strong>Cookies analíticas</strong>
        </p>
        <p>
          Podemos utilizar herramientas como Google Analytics para comprender, de forma agregada y
          anónima, cómo los visitantes usan el sitio: páginas visitadas, tiempo de permanencia y
          origen del tráfico. Esta información nos ayuda a mejorar el contenido y la experiencia de
          navegación.
        </p>
      </LegalSection>

      <LegalSection title="3. ¿Compartimos datos de cookies con terceros?">
        <p>
          Las cookies analíticas pueden ser procesadas por proveedores externos (por ejemplo,
          Google) conforme a sus propias políticas de privacidad. La Corporación Enlace Colombia no
          utiliza cookies para vender datos personales ni para publicidad personalizada.
        </p>
      </LegalSection>

      <LegalSection title="4. ¿Cómo puede gestionar las cookies?">
        <p>
          Usted puede configurar su navegador para bloquear, eliminar o recibir avisos antes de
          aceptar cookies. Tenga en cuenta que desactivar las cookies técnicas puede afectar el
          funcionamiento de algunas secciones del sitio.
        </p>
        <p>Instrucciones generales según su navegador:</p>
        <ul>
          <li>
            <strong>Chrome:</strong> Configuración → Privacidad y seguridad → Cookies y otros datos
            de sitios.
          </li>
          <li>
            <strong>Safari:</strong> Preferencias → Privacidad → Cookies y datos de sitios web.
          </li>
          <li>
            <strong>Firefox:</strong> Opciones → Privacidad y seguridad → Cookies y datos del sitio.
          </li>
          <li>
            <strong>Edge:</strong> Configuración → Cookies y permisos del sitio.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Relación con la política de privacidad">
        <p>
          El tratamiento de datos personales derivado del uso de cookies se complementa con lo
          dispuesto en nuestra <a href="/privacidad">Política de tratamiento de datos personales</a>
          , conforme a la Ley 1581 de 2012 y normas complementarias en Colombia.
        </p>
      </LegalSection>

      <LegalSection title="6. Cambios y contacto">
        <p>
          Podemos actualizar esta política de cookies en cualquier momento. La versión vigente
          estará publicada en esta página con su fecha de actualización.
        </p>
        <p>
          Si tiene preguntas sobre el uso de cookies, escríbanos a{" "}
          <a href="mailto:info@enlacecolombia.org">info@enlacecolombia.org</a> o comuníquese al{" "}
          <a href="tel:+576016439200">(601) 6439200</a>.
        </p>
        <p>
          <button
            type="button"
            onClick={openConsentSettings}
            className="inline-flex h-10 items-center rounded-full surface-violet px-5 text-sm font-semibold text-white"
          >
            Gestionar preferencias de cookies
          </button>
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
