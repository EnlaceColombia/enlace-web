import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, FileText, MessageCircleHeart, Newspaper, Radio, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useRequireAdmin } from "@/lib/admin/use-require-admin";

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboardPage,
});

const sections = [
  {
    title: "Blog / Reflexiones",
    description: "Publica artículos con imagen de portada y contenido para el sitio.",
    to: "/admin/blogs",
    icon: Newspaper,
    cta: "Gestionar entradas",
  },
  {
    title: "Testimonios",
    description: "Actualiza las historias del carrusel en inicio y Maratónica.",
    to: "/admin/testimonios",
    icon: MessageCircleHeart,
    cta: "Gestionar testimonios",
  },
  {
    title: "Maratónica",
    description: "Configura fechas, textos y contador de la página del evento.",
    to: "/admin/maratonica",
    icon: Radio,
    cta: "Configurar evento",
  },
  {
    title: "Registro web ESAL",
    description: "Sube los documentos de transparencia y actualiza el año visible.",
    to: "/admin/registro-web",
    icon: FileText,
    cta: "Gestionar documentos",
  },
  {
    title: "Equipo del panel",
    description: "Invita a más personas para que administren el sitio desde aquí.",
    to: "/admin/usuarios",
    icon: Users,
    cta: "Gestionar accesos",
  },
] as const;

function AdminDashboardPage() {
  const { loading } = useRequireAdmin();

  if (loading) {
    return <p className="text-sm text-muted-foreground">Cargando panel…</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold text-foreground">Panel de control</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Administra el contenido publicado en enlacecolombia.org.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map(({ title, description, to, icon: Icon, cta }) => (
          <article
            key={to}
            className="rounded-2xl border border-border bg-card p-6 shadow-card flex flex-col"
          >
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl surface-violet text-white">
              <Icon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 text-lg font-bold text-foreground">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground flex-1">{description}</p>
            <Button asChild className="mt-5 surface-violet text-white w-full sm:w-auto">
              <Link to={to}>
                {cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </article>
        ))}
      </div>
    </div>
  );
}
