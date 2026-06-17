import { createFileRoute } from "@tanstack/react-router";

import { LegalPageLayout, LegalSection } from "@/components/legal-page-layout";
import { DONATION_URL } from "@/lib/site";

export const Route = createFileRoute("/terminos")({
  head: () => ({
    meta: [
      { title: "Términos y condiciones — Enlace Colombia" },
      {
        name: "description",
        content:
          "Términos y condiciones de uso del sitio web de la Corporación Enlace Colombia — CEC.",
      },
    ],
  }),
  component: TerminosPage,
});

function TerminosPage() {
  return (
    <LegalPageLayout
      subtitle="Corporación Enlace Colombia — CEC"
      title="Términos y condiciones de uso"
      effectiveDate="junio de 2025"
    >
      <LegalSection title="1. Aceptación">
        <p>
          Al acceder y utilizar el sitio web de la Corporación Enlace Colombia (enlacecolombia.org),
          usted acepta los presentes Términos y Condiciones en su totalidad. Si no está de acuerdo
          con alguno de ellos, le pedimos que se abstenga de usar el sitio.
        </p>
      </LegalSection>

      <LegalSection title="2. Objeto del sitio">
        <p>
          Este sitio web tiene como propósito informar sobre la labor espiritual y social de la
          Corporación Enlace Colombia, facilitar donaciones voluntarias, compartir reflexiones de
          edificación cristiana y recopilar testimonios de nuestra comunidad.
        </p>
      </LegalSection>

      <LegalSection title="3. Donaciones">
        <ul>
          <li>
            Las donaciones realizadas a través de este sitio son voluntarias, libres e irrevocables.
          </li>
          <li>
            No constituyen un contrato de prestación de servicios ni generan obligaciones de
            resultado por parte de la Corporación.
          </li>
          <li>
            Las donaciones realizadas por personas naturales o jurídicas podrán ser deducibles de
            renta según lo establecido en el Artículo 125 del Estatuto Tributario colombiano,
            siempre que se cumplan los requisitos legales. La Corporación expedirá el certificado de
            donación correspondiente.
          </li>
          <li>
            El procesamiento de pagos se realiza a través de la plataforma{" "}
            <a href={DONATION_URL} target="_blank" rel="noopener noreferrer">
              ZonaPagos
            </a>
            . La Corporación no almacena datos de tarjetas de crédito ni débito.
          </li>
          <li>
            En caso de error técnico en el procesamiento de una donación, comuníquese con nosotros
            al <a href="tel:+576016439200">(601) 6439200</a> o a{" "}
            <a href="mailto:info@enlacecolombia.org">info@enlacecolombia.org</a>.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Consejería espiritual">
        <p>
          El servicio de consejería ofrecido por la Corporación Enlace Colombia está fundamentado en
          principios bíblicos y tiene un propósito exclusivamente espiritual y de acompañamiento.
        </p>
        <p>
          Este servicio no reemplaza ni sustituye la atención profesional médica, psicológica, legal
          o de cualquier otra índole. Si usted atraviesa una situación que requiere atención
          profesional especializada, le instamos a buscarla.
        </p>
      </LegalSection>

      <LegalSection title="5. Testimonios">
        <p>
          Los testimonios publicados en este sitio son experiencias personales compartidas
          voluntariamente por miembros de nuestra comunidad. Representan vivencias de fe
          individuales y no constituyen garantía de resultados específicos para otras personas.
        </p>
      </LegalSection>

      <LegalSection title="6. Reflexiones y contenido del blog">
        <p>
          Los artículos, reflexiones y contenidos publicados en esta sección son de carácter
          espiritual y edificante, basados en la Biblia. Representan la perspectiva cristiana de la
          Corporación y sus colaboradores. No deben interpretarse como asesoramiento profesional en
          ninguna área.
        </p>
      </LegalSection>

      <LegalSection title="7. Propiedad intelectual">
        <p>
          Todo el contenido publicado en este sitio web — incluyendo textos, imágenes, logotipos,
          videos y materiales audiovisuales — es propiedad de la Corporación Enlace Colombia o
          cuenta con las licencias de uso correspondientes. Queda prohibida su reproducción,
          distribución o uso comercial sin autorización expresa y escrita de la Corporación.
        </p>
      </LegalSection>

      <LegalSection title="8. Limitación de responsabilidad">
        <p>La Corporación Enlace Colombia no se responsabiliza por:</p>
        <ul>
          <li>Interrupciones o fallas técnicas del sitio web ajenas a su control.</li>
          <li>
            Errores en el procesamiento de pagos atribuibles a la pasarela de pagos o entidades
            bancarias.
          </li>
          <li>El uso que terceros hagan de la información publicada en el sitio.</li>
          <li>Daños derivados del acceso a enlaces externos referenciados desde este sitio.</li>
        </ul>
      </LegalSection>

      <LegalSection title="9. Enlaces externos">
        <p>
          Este sitio puede contener enlaces a sitios externos (redes sociales, canal de televisión,
          pasarela de pagos). La Corporación no se responsabiliza por el contenido ni las políticas
          de privacidad de dichos sitios.
        </p>
      </LegalSection>

      <LegalSection title="10. Ley aplicable y jurisdicción">
        <p>
          Los presentes Términos y Condiciones se rigen por las leyes de la República de Colombia.
          Para cualquier controversia derivada del uso de este sitio, las partes se someten a la
          jurisdicción de los jueces y tribunales competentes de la ciudad de Bogotá D.C.
        </p>
      </LegalSection>

      <LegalSection title="11. Contacto">
        <p>Para cualquier consulta relacionada con estos términos:</p>
        <ul>
          <li>
            <strong>Dirección:</strong> Calle 124 # 70A – 28, Bogotá D.C.
          </li>
          <li>
            <strong>Teléfono:</strong> <a href="tel:+576016439200">(601) 6439200</a>
          </li>
          <li>
            <strong>Correo:</strong>{" "}
            <a href="mailto:info@enlacecolombia.org">info@enlacecolombia.org</a>
          </li>
          <li>
            <strong>Horario:</strong> Lunes a viernes, 7:00 AM – 5:00 PM
          </li>
          <li>
            <strong>NIT:</strong> 830063469-1
          </li>
        </ul>
      </LegalSection>
    </LegalPageLayout>
  );
}
