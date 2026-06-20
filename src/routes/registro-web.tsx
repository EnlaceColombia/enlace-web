import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, FileText } from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getRegistroWebPageData } from "@/lib/api/registro-web.functions";
import { getRegistroWebPageTitle } from "@/lib/registro-web/types";
import { buildPublicPageHead } from "@/lib/seo/meta";

export const Route = createFileRoute("/registro-web")({
  loader: async () => getRegistroWebPageData(),
  head: ({ loaderData }) => {
    const pageTitle = loaderData ? getRegistroWebPageTitle(loaderData.config) : "Registro web";
    return buildPublicPageHead({
      path: "/registro-web",
      title: `${pageTitle} — Corporación Enlace Colombia`,
      description:
        "Documentos de transparencia y cumplimiento normativo (ESAL) de Corporación Enlace Colombia.",
    });
  },
  component: RegistroWebPage,
});

function RegistroWebPage() {
  const { config, documents } = Route.useLoaderData();
  const pageTitle = getRegistroWebPageTitle(config);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-16 sm:py-20">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet/10 text-violet text-xs font-semibold tracking-widest uppercase">
            <FileText className="h-3.5 w-3.5" />
            Transparencia ESAL
          </span>
          <h1 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight">
            {pageTitle}
          </h1>
          {config.intro && (
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">{config.intro}</p>
          )}
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-card shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="px-4 py-3 text-left font-bold tracking-wide text-foreground w-16">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left font-bold tracking-wide text-foreground">
                    DESCRIPCIÓN
                  </th>
                  <th className="px-4 py-3 text-left font-bold tracking-wide text-foreground w-32">
                    LINK
                  </th>
                </tr>
              </thead>
              <tbody>
                {documents.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-10 text-center text-muted-foreground">
                      Los documentos se publicarán pronto.
                    </td>
                  </tr>
                ) : (
                  documents.map((doc, index) => (
                    <tr key={doc.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-4 text-muted-foreground font-medium">{index + 1}</td>
                      <td className="px-4 py-4 font-semibold text-foreground uppercase tracking-wide">
                        {doc.description}
                      </td>
                      <td className="px-4 py-4">
                        {doc.fileUrl ? (
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 font-bold text-gold hover:text-violet transition"
                          >
                            Ver Aquí
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          ¿Necesitas ayuda?{" "}
          <a href="/#contacto" className="text-violet font-semibold hover:underline">
            Contáctanos
          </a>
          .
        </p>
      </main>

      <SiteFooter />
    </div>
  );
}
