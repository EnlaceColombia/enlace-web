import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Play,
  Heart,
  HandHeart,
  Radio,
  Globe2,
  ShieldCheck,
  MessageCircle,
  Tv,
  Music2,
  BookOpen,
  Users2,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  Quote,
  Star,
  Headphones,
  Gift,
  UserCheck,
  Newspaper,
  Target,
  Eye,
  Award,
} from "lucide-react";
import heroImg from "@/assets/hero-familia.jpg";
import progBiblia from "@/assets/program-biblia.jpg";
import progMusica from "@/assets/program-musica.jpg";
import progFamilia from "@/assets/program-familia.jpg";
import progPredicas from "@/assets/program-predicas.jpg";
import progJovenes from "@/assets/program-jovenes.jpg";
import progEnlacePlus from "@/assets/program-enlaceplus.jpg";
import nosotrosFamilia from "@/assets/family.png";
import { getSchedule } from "@/lib/api/live.functions";
import { getPublishedBlogPosts } from "@/lib/api/blog.functions";
import type { BlogPost } from "@/lib/blog/types";
import { formatBlogDate } from "@/lib/blog/types";
import { ENLACE_PLUS_LINKS } from "@/lib/enlace-plus-links";
import {
  buildPrayerRequestWhatsAppMessage,
  DONATION_URL,
  getWhatsAppUrl,
  LIVE_URL,
  REGISTRO_WEB_PATH,
  SITE_DESCRIPTION,
  SITE_TITLE,
  type ScheduleData,
} from "@/lib/site";
import { buildPublicPageHead } from "@/lib/seo/meta";
import { formatSchedulePreviewLabel, ScheduleModal } from "@/components/schedule-modal";
import { LivePlayer } from "@/components/live-player";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const donateLinkProps = {
  href: DONATION_URL,
  target: "_blank",
  rel: "noopener noreferrer",
} as const;

const liveLinkProps = {
  href: LIVE_URL,
  target: "_blank",
  rel: "noopener noreferrer",
} as const;

function formatCop(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

/** Etiqueta corta para botones de monto (ej. $50 mil). */
function formatCopCompact(value: number) {
  if (value >= 1000) return `$${(value / 1000).toLocaleString("es-CO")} mil`;
  return formatCop(value);
}

export const Route = createFileRoute("/")({
  loader: async (): Promise<{ schedule: ScheduleData | null; blogPosts: BlogPost[] }> => {
    try {
      const [schedule, blogPosts] = await Promise.all([
        getSchedule(),
        getPublishedBlogPosts().catch(() => [] as BlogPost[]),
      ]);
      return { schedule, blogPosts: blogPosts.slice(0, 3) };
    } catch (error) {
      console.error("No se pudo cargar la programación:", error);
      return { schedule: null, blogPosts: [] };
    }
  },
  head: () =>
    buildPublicPageHead({
      path: "/",
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
    }),
  component: Index,
});

const programs = [
  {
    title: "Prédicas",
    desc: "Enseñanza bíblica diaria",
    img: progPredicas,
    icon: Tv,
    href: ENLACE_PLUS_LINKS.predicas,
  },
  {
    title: "Música",
    desc: "Adoración y alabanza",
    img: progMusica,
    icon: Music2,
    href: ENLACE_PLUS_LINKS.musica,
  },
  {
    title: "Familia",
    desc: "Consejería y vida en familia",
    img: progFamilia,
    icon: Users2,
    href: ENLACE_PLUS_LINKS.familia,
  },
  {
    title: "Biblia",
    desc: "Estudios y devocionales",
    img: progBiblia,
    icon: BookOpen,
    href: ENLACE_PLUS_LINKS.biblia,
  },
  {
    title: "Jóvenes",
    desc: "Generación que adora",
    img: progJovenes,
    icon: Sparkles,
    href: ENLACE_PLUS_LINKS.jovenes,
  },
  {
    title: "Enlace+",
    desc: "Streaming on-demand",
    img: progEnlacePlus,
    icon: Play,
    href: ENLACE_PLUS_LINKS.enlacePlus,
  },
];

function Index() {
  const { schedule, blogPosts } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>
        <Hero />
        <TrustBar />
        <LiveSection schedule={schedule} />
        <Nosotros />
        <NuestraLabor />
        <Programs />
        <PrayerSection />
        <DonateSection />
        <Impact />
        <Testimonials />
        <Reflexiones posts={blogPosts} />
        <Transparency />
        <Mission />
      </main>
      <SiteFooter />
    </div>
  );
}

/* ---------------- HERO ---------------- */
function Hero() {
  return (
    <section id="inicio" className="relative -mt-20 pt-20 overflow-hidden surface-hero">
      <div className="absolute inset-0 ring-grid opacity-60" />
      <div className="absolute inset-0" style={{ background: "var(--gradient-radial-glow)" }} />
      <img
        src={heroImg}
        alt="Adoración en vivo"
        className="absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-luminosity"
        width={1920}
        height={1080}
      />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent to-background" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-20 pb-32 sm:pt-28 sm:pb-40">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold tracking-wide backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-red-500 live-dot" />
            EN VIVO · Transmitiendo ahora
          </span>
          <h1 className="mt-6 text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05]">
            Llevando <span className="text-gradient-gold">esperanza</span>
            <br />a millones de hogares
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-white/80 max-w-2xl leading-relaxed">
            Transmisión cristiana 24/7, oración y contenido que transforma vidas. Acompáñanos desde
            cualquier lugar del mundo.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href="#en-vivo"
              className="inline-flex items-center gap-2 h-12 px-6 rounded-full btn-gold text-base"
            >
              <Play className="h-5 w-5 fill-current" /> Ver en vivo
            </a>
            <a
              href="#oracion"
              className="inline-flex items-center gap-2 h-12 px-6 rounded-full btn-ghost-light text-base font-semibold"
            >
              <HandHeart className="h-5 w-5" /> Enviar petición
            </a>
            <a
              {...donateLinkProps}
              className="inline-flex items-center gap-2 h-12 px-6 rounded-full bg-white text-violet-deep text-base font-semibold hover:bg-white/90 transition"
            >
              <Heart className="h-5 w-5" /> Donar ahora
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- TRUST BAR ---------------- */
function TrustBar() {
  const items = [
    { icon: Radio, label: "Transmisión 24/7" },
    { icon: Globe2, label: "Presencia internacional" },
    { icon: ShieldCheck, label: "Donaciones seguras" },
    { icon: MessageCircle, label: "Equipo pastoral" },
  ];
  return (
    <section className="relative -mt-16 z-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="rounded-2xl bg-white shadow-lift border border-border grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
          {items.map((i) => (
            <div key={i.label} className="flex items-center gap-3 p-5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl surface-violet">
                <i.icon className="h-5 w-5" />
              </span>
              <span className="text-sm font-semibold text-foreground">{i.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- LIVE ---------------- */
function LiveSection({ schedule }: { schedule: ScheduleData | null }) {
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const live = schedule?.live ?? null;
  const title = live?.title ?? "Enlace TV en vivo";
  const previewSlots = schedule?.upcoming.length
    ? schedule.upcoming
    : [
        { hour: "19:00", title: "Prédica · Pastor invitado", description: "" },
        { hour: "21:00", title: "Noche de adoración", description: "" },
        { hour: "08:00", title: "Devocional matutino", description: "" },
      ];

  return (
    <section id="en-vivo" className="py-20 sm:py-28">
      <ScheduleModal open={scheduleOpen} onOpenChange={setScheduleOpen} schedule={schedule} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-[1.5fr_1fr] gap-10 items-center">
        <LivePlayer
          program={live}
          title={title}
          fallbackSrc={heroImg}
          playing={playing}
          onPlay={() => setPlaying(true)}
        />
        <div>
          <span className="text-xs font-semibold tracking-widest uppercase text-violet">
            Transmisión
          </span>
          <h2 className="mt-3 text-4xl sm:text-5xl font-extrabold text-foreground leading-tight">
            Enlace en vivo, <span className="text-violet">todo el día</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Acompáñanos desde cualquier lugar del mundo. Prédicas, música, familia y mucho más, sin
            interrupciones.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="inline-flex items-center gap-2 h-11 px-5 rounded-full surface-violet text-sm font-semibold"
            >
              <Play className="h-4 w-4 fill-current" /> Ver ahora
            </button>
            <button
              type="button"
              onClick={() => setScheduleOpen(true)}
              className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-secondary text-foreground text-sm font-semibold hover:bg-violet hover:text-white transition"
            >
              Ver programación <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {previewSlots.map((slot) => (
              <button
                key={`${slot.hour}-${slot.title}`}
                type="button"
                onClick={() => setScheduleOpen(true)}
                className="rounded-xl border border-border p-3 bg-card text-left hover:border-violet/40 hover:shadow-card transition"
              >
                <p className="text-xs font-bold text-violet">
                  {schedule ? formatSchedulePreviewLabel(slot.hour) : slot.hour}
                </p>
                <p className="text-xs text-muted-foreground mt-1 leading-snug line-clamp-2">
                  {slot.title}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- PROGRAMS ---------------- */
function Programs() {
  return (
    <section id="programas" className="py-20 sm:py-28 bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold tracking-widest uppercase text-violet">
              Programas destacados
            </span>
            <h2 className="mt-3 text-4xl sm:text-5xl font-extrabold text-foreground">
              Contenido que <span className="text-violet">transforma</span>
            </h2>
          </div>
          <a
            href={ENLACE_PLUS_LINKS.programs}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-violet hover:gap-3 transition-all"
          >
            Ver todo el catálogo <ArrowRight className="h-4 w-4" />
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((p) => (
            <a
              key={p.title}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-4/5 rounded-2xl overflow-hidden shadow-card hover:shadow-lift transition-all"
            >
              <img
                src={p.img}
                alt={p.title}
                className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-linear-to-t from-violet-deep via-violet-deep/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <span className="inline-grid h-9 w-9 place-items-center rounded-lg bg-white/15 backdrop-blur border border-white/20 mb-3">
                  <p.icon className="h-4 w-4 text-white" />
                </span>
                <h3 className="text-2xl font-bold text-white">{p.title}</h3>
                <p className="text-sm text-white/80 mt-1">{p.desc}</p>
              </div>
              <div className="absolute top-4 right-4 h-10 w-10 grid place-items-center rounded-full bg-gold opacity-0 group-hover:opacity-100 transition-opacity">
                <Play className="h-4 w-4 text-violet-deep fill-current ml-0.5" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- PRAYER ---------------- */
function PrayerSection() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    location: "",
    contact: "",
    reason: "",
    wantsContact: false,
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const message = buildPrayerRequestWhatsAppMessage(form);
    window.open(getWhatsAppUrl(message), "_blank", "noopener,noreferrer");
    setSent(true);
  }

  return (
    <section id="oracion" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-start">
        <div>
          <span className="text-xs font-semibold tracking-widest uppercase text-violet">
            Peticiones de oración
          </span>
          <h2 className="mt-3 text-4xl sm:text-5xl font-extrabold text-foreground leading-tight">
            Nuestro equipo está <span className="text-violet">orando por ti</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Comparte con nosotros tu petición. Nuestro equipo pastoral la recibirá con respeto y
            oraremos contigo en privado.
          </p>
          <ul className="mt-8 space-y-4">
            {[
              "Respondemos cada petición personalmente",
              "Confidencial y tratada con cuidado pastoral",
              "Acompañamiento por WhatsApp si lo deseas",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-violet shrink-0 mt-0.5" />
                <span className="text-foreground">{t}</span>
              </li>
            ))}
          </ul>
          <blockquote className="mt-10 p-6 rounded-2xl surface-violet relative overflow-hidden">
            <Quote className="absolute -top-2 -right-2 h-24 w-24 text-white/10" />
            <p className="text-lg italic relative">
              «Si dos de vosotros se pusieren de acuerdo en la tierra acerca de cualquiera cosa que
              pidieren, les será hecho.»
            </p>
            <p className="mt-2 text-sm text-gold font-semibold">Mateo 18:19</p>
          </blockquote>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl bg-card border border-border shadow-card p-6 sm:p-8"
        >
          {sent ? (
            <div className="text-center py-10">
              <div className="mx-auto h-16 w-16 rounded-full surface-violet grid place-items-center mb-4">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold">Continúa en WhatsApp</h3>
              <p className="mt-2 text-muted-foreground">
                Se abrió WhatsApp con tu petición. Solo envía el mensaje para que nuestro equipo
                pueda orar por ti.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSent(false);
                  setForm({ name: "", location: "", contact: "", reason: "", wantsContact: false });
                }}
                className="mt-6 inline-flex items-center justify-center h-11 px-5 rounded-full bg-secondary text-foreground text-sm font-semibold hover:bg-violet hover:text-white transition"
              >
                Enviar otra petición
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <Field
                label="Nombre"
                placeholder="Tu nombre"
                value={form.name}
                onChange={(value) => setForm((prev) => ({ ...prev, name: value }))}
                required
              />
              <Field
                label="País / Ciudad"
                placeholder="Ej. Bogotá, Colombia"
                value={form.location}
                onChange={(value) => setForm((prev) => ({ ...prev, location: value }))}
              />
              <Field
                label="WhatsApp o email (opcional)"
                placeholder="+57 300 000 0000"
                value={form.contact}
                onChange={(value) => setForm((prev) => ({ ...prev, contact: value }))}
              />
              <div>
                <label
                  htmlFor="prayer-reason"
                  className="block text-sm font-semibold text-foreground mb-1.5"
                >
                  Motivo de oración
                </label>
                <textarea
                  id="prayer-reason"
                  rows={4}
                  required
                  value={form.reason}
                  onChange={(e) => setForm((prev) => ({ ...prev, reason: e.target.value }))}
                  placeholder="Comparte aquí tu petición…"
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <label className="flex items-start gap-3 text-sm text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.wantsContact}
                  onChange={(e) => setForm((prev) => ({ ...prev, wantsContact: e.target.checked }))}
                  className="mt-1 accent-[#47009B]"
                />
                <span>Deseo que el equipo pastoral me contacte</span>
              </label>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 h-12 rounded-full surface-violet font-semibold mt-2"
              >
                <HandHeart className="h-5 w-5" /> Enviar petición por WhatsApp
              </button>
              <p className="text-xs text-muted-foreground text-center">
                Tu información es confidencial.
              </p>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
function Field({
  label,
  placeholder,
  value,
  onChange,
  required,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-foreground mb-1.5">{label}</label>
      <input
        type="text"
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-11 rounded-xl border border-input bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}

/* ---------------- DONATE ---------------- */
function DonateSection() {
  const [amount, setAmount] = useState(100_000);
  const amounts = [50_000, 100_000, 200_000, 500_000];

  return (
    <section id="donar" className="relative py-20 sm:py-28 surface-dark overflow-hidden">
      <div className="absolute inset-0 ring-grid opacity-40" />
      <div
        className="absolute -top-40 -right-40 h-96 w-96 rounded-full"
        style={{ background: "var(--gradient-radial-glow)" }}
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="text-xs font-semibold tracking-widest uppercase text-gold">
            Donaciones
          </span>
          <h2 className="mt-3 text-4xl sm:text-5xl font-extrabold text-white leading-tight">
            Tu donación lleva <span className="text-gradient-gold">esperanza</span> a un hogar
          </h2>
          <p className="mt-4 text-lg text-white/75 max-w-xl">
            Cada aporte sostiene la transmisión 24/7, la producción de contenido y el equipo
            pastoral que responde miles de peticiones cada mes.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {[
              { icon: ShieldCheck, t: "Pagos 100% seguros", s: "Pasarela ZonaPagos certificada" },
              { icon: CheckCircle2, t: "Ministerio certificado", s: "Reportes públicos mensuales" },
              { icon: Globe2, t: "PSE y tarjeta", s: "Débito, crédito y PSE" },
              { icon: HandHeart, t: "Donación única", s: "Sin suscripciones mensuales" },
            ].map((x) => (
              <div key={x.t} className="flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/10 border border-white/15">
                  <x.icon className="h-4 w-4 text-gold" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white">{x.t}</p>
                  <p className="text-xs text-white/60">{x.s}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-lift">
          <p className="inline-flex items-center rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-foreground mb-6">
            Donación única · Pesos colombianos (COP)
          </p>
          <p className="text-sm font-semibold text-foreground mb-3">
            Elige un monto sugerido (COP)
          </p>
          <div className="grid grid-cols-4 gap-2 mb-3">
            {amounts.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setAmount(a)}
                className={`h-12 rounded-xl border-2 text-sm font-bold transition ${
                  amount === a
                    ? "border-violet bg-violet text-white"
                    : "border-border bg-background text-foreground hover:border-violet/50"
                }`}
              >
                {formatCopCompact(a)}
              </button>
            ))}
          </div>
          <input
            type="number"
            min={1000}
            step={1000}
            value={amount}
            onChange={(e) => setAmount(Math.max(0, Number(e.target.value) || 0))}
            className="w-full h-12 rounded-xl border-2 border-border px-4 text-lg font-bold text-foreground focus:outline-none focus:border-violet"
            aria-label="Monto en pesos colombianos"
          />
          <p className="mt-2 text-xs text-muted-foreground text-center">
            Confirmas el valor final en la pasarela segura de ZonaPagos.
          </p>
          <a
            {...donateLinkProps}
            className="mt-6 w-full inline-flex items-center justify-center gap-2 h-14 rounded-full btn-gold text-base font-semibold"
          >
            <Heart className="h-5 w-5" />
            Donar {formatCop(amount)}
          </a>
          <div className="mt-4 flex items-center justify-center gap-3 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-violet" />
            Procesado con encriptación de nivel bancario
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- IMPACT ---------------- */
function Impact() {
  const stats = [
    { n: "12M+", l: "Familias alcanzadas" },
    { n: "45", l: "Países conectados" },
    { n: "180K", l: "Peticiones atendidas" },
    { n: "24/7", l: "Transmisión sin pausa" },
  ];
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-semibold tracking-widest uppercase text-violet">
            Nuestro impacto
          </span>
          <h2 className="mt-3 text-4xl sm:text-5xl font-extrabold text-foreground">
            Vidas que <span className="text-violet">han sido tocadas</span>
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.l} className="rounded-2xl p-8 text-center surface-violet glow-violet">
              <p className="text-5xl sm:text-6xl font-extrabold text-gradient-gold">{s.n}</p>
              <p className="mt-2 text-sm font-medium text-white/85">{s.l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- TESTIMONIOS ---------------- */
function Testimonials() {
  const items = [
    {
      name: "Mariela Gómez",
      place: "Maratónica · Noviembre 2020",
      text: "Mi hijo estaba preparado para que le amputaran una pierna por la ruptura del nervio ciático. Llamé a Enlace a pedir oración por su sanidad. Dios escuchó: el nervio fue restaurado y ya no le quitaron su pierna. ¡Gloria a Dios!",
    },
    {
      name: "Marina Camargo",
      place: "Maratónica · Noviembre 2020",
      text: "Estaba preparada para una cirugía de hernia. Me conecté con la Maratónica de Enlace y ofrendé por mi sanidad. Fui al chequeo médico y la hernia ya no estaba. ¡Desapareció! ¡Gloria a Dios!",
    },
    {
      name: "Ana Florián",
      place: "Maratónica · Febrero 2020",
      text: "Después de más de un año sin que mi hija consiguiera empleo, sembré en la Maratónica de febrero 2020. Dios respondió a ese acto de fe y hoy mi hija goza de ese empleo por el cual creí al Señor. ¡Gloria a Dios!",
    },
    {
      name: "Rosalba Barragán",
      place: "Maratónica · Agosto 2020",
      text: "Creí la Palabra y recibí un milagro: Dios borró una deuda de 5 millones. ¡Gloria al Señor!",
    },
  ];
  return (
    <section id="testimonios" className="py-20 sm:py-28 bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-2xl mb-14">
          <span className="text-xs font-semibold tracking-widest uppercase text-violet">
            Testimonios
          </span>
          <h2 className="mt-3 text-4xl sm:text-5xl font-extrabold text-foreground">
            Historias que <span className="text-violet">inspiran</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl bg-card border border-border p-7 shadow-card relative"
            >
              <Quote className="absolute top-6 right-6 h-8 w-8 text-violet/15" />
              <div className="flex gap-1 text-gold mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-foreground leading-relaxed">“{t.text}”</p>
              <div className="mt-6 flex items-center gap-3 pt-5 border-t border-border">
                <div className="h-10 w-10 rounded-full surface-violet grid place-items-center font-bold">
                  {t.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.place}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- TRANSPARENCIA ---------------- */
function Transparency() {
  const faqs = [
    {
      q: "¿En qué se usan las donaciones?",
      a: "Producción de contenido, sostenimiento de la señal 24/7, equipo pastoral y proyectos misioneros.",
    },
    {
      q: "¿Es seguro donar online?",
      a: "Sí. Procesamos con encriptación SSL de nivel bancario y proveedores certificados PCI-DSS.",
    },
    {
      q: "¿Cómo hago mi donación?",
      a: "Haz clic en Donar y completa el pago en ZonaPagos con PSE, tarjeta débito o crédito. El monto lo confirmas en la pasarela.",
    },
    {
      q: "¿Reciben donaciones desde el exterior?",
      a: "Las donaciones en línea se procesan en pesos colombianos. Si estás fuera del país, escríbenos a info@enlacecolombia.org y te orientamos.",
    },
  ];
  return (
    <section id="transparencia" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-[1fr_1.2fr] gap-12">
        <div>
          <span className="text-xs font-semibold tracking-widest uppercase text-violet">
            Transparencia y confianza
          </span>
          <h2 className="mt-3 text-4xl sm:text-5xl font-extrabold text-foreground leading-tight">
            Te rendimos <span className="text-violet">cuentas</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Publicamos reportes mensuales con el detalle de cómo se invierte cada aporte. Creemos en
            la mayordomía con integridad.
          </p>
          <div className="mt-8 space-y-3">
            {[
              "Reportes financieros mensuales públicos",
              "Auditoría externa anual",
              "Donaciones procesadas por pasarelas certificadas",
              "Contacto directo con el área de donantes",
            ].map((x) => (
              <div key={x} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-violet shrink-0 mt-0.5" />
                <span className="text-foreground">{x}</span>
              </div>
            ))}
          </div>
          <Link
            to={REGISTRO_WEB_PATH}
            className="mt-8 inline-flex items-center gap-2 h-11 px-5 rounded-full surface-violet text-sm font-semibold"
          >
            Ver último reporte <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <FAQItem key={i} {...f} defaultOpen={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}
function FAQItem({ q, a, defaultOpen }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left"
      >
        <span className="font-semibold text-foreground">{q}</span>
        <ChevronDown
          className={`h-5 w-5 text-violet transition-transform shrink-0 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="px-5 pb-5 text-muted-foreground leading-relaxed">{a}</div>}
    </div>
  );
}

/* ---------------- MISSION ---------------- */
function Mission() {
  return (
    <section className="py-20 sm:py-28 surface-hero relative overflow-hidden">
      <div className="absolute inset-0 ring-grid opacity-50" />
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 text-center">
        <span className="text-xs font-semibold tracking-widest uppercase text-gold">
          Nuestra misión
        </span>
        <h2 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
          Somos un ministerio comprometido con llevar el mensaje de Jesús a{" "}
          <span className="text-gradient-gold">cada hogar</span>.
        </h2>
        <p className="mt-6 text-lg text-white/80 max-w-2xl mx-auto">
          Una familia global de creyentes, pastores y voluntarios trabajando juntos para que nadie
          quede sin escuchar las buenas noticias.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <a
            {...donateLinkProps}
            className="inline-flex items-center gap-2 h-12 px-6 rounded-full btn-gold"
          >
            <Heart className="h-5 w-5" /> Sumarme con una ofrenda
          </a>
          <a
            href="#oracion"
            className="inline-flex items-center gap-2 h-12 px-6 rounded-full btn-ghost-light font-semibold"
          >
            <HandHeart className="h-5 w-5" /> Pedir oración
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------------- NOSOTROS ---------------- */
function Nosotros() {
  const valores = [
    {
      t: "Servicio",
      d: "Dios nos creó para servir. Oramos, intercedemos y aconsejamos en los principios de la Palabra de Dios.",
    },
    {
      t: "Compromiso",
      d: "Ponemos al máximo nuestra capacidad para sacar adelante las tareas encomendadas.",
    },
    {
      t: "Integridad",
      d: "Obramos con rectitud y apego a los principios enseñados por Jesucristo.",
    },
    {
      t: "Responsabilidad",
      d: "Cumplimos siempre a conciencia con nuestros deberes y obligaciones.",
    },
    {
      t: "Trabajo en equipo",
      d: "Cada uno hace lo que le corresponde para lograr el objetivo común.",
    },
    {
      t: "Respeto",
      d: "Reconocemos la dignidad y el valor de los demás; amabilidad y buen trato con todos.",
    },
  ];
  return (
    <section id="nosotros" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-14 items-center mb-14">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold tracking-widest uppercase text-violet">
              Nosotros
            </span>
            <h2 className="mt-3 text-4xl sm:text-5xl font-extrabold text-foreground leading-tight">
              Una organización <span className="text-violet">sin ánimo de lucro</span>, al servicio
              del Reino
            </h2>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
              La Corporación Enlace Colombia está comprometida voluntaria y públicamente con una
              gestión social y responsable, en llevar a los hogares colombianos la televisión
              cristiana del canal internacional <strong>Enlace</strong>; además, ofrece consejería
              fundamentada en los principios bíblicos como única respuesta a las necesidades de las
              personas.
            </p>
            <blockquote className="mt-6 p-5 rounded-2xl surface-violet relative overflow-hidden">
              <Quote className="absolute -top-2 -right-2 h-20 w-20 text-white/10" />
              <p className="text-base sm:text-lg italic relative">
                «Mas buscad primeramente el reino de Dios y su justicia, y todas estas cosas os
                serán añadidas.»
              </p>
              <p className="mt-2 text-sm text-gold font-semibold">Mateo 6:33</p>
            </blockquote>
            <p className="mt-6 text-base text-muted-foreground">
              <span className="font-semibold text-foreground">Más de 20 años</span> posicionando la
              televisión cristiana a lo largo y ancho de Colombia, con el mensaje de Jesucristo como
              el único camino, la verdad y la vida.
            </p>
          </div>
          <div className="relative">
            <div
              className="absolute -inset-6 rounded-4xl bg-linear-to-br from-sky-200/40 via-sky-400/20 to-transparent blur-2xl"
              aria-hidden
            />
            <img
              src={nosotrosFamilia}
              alt="Familia colombiana disfrutando la televisión cristiana de Enlace"
              loading="lazy"
              width={1024}
              height={780}
              className="relative w-full h-auto rounded-3xl shadow-card object-cover"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="rounded-2xl bg-card border border-border p-7 shadow-card">
            <div className="flex items-center gap-3 mb-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl surface-violet">
                <Target className="h-5 w-5" />
              </span>
              <h3 className="text-2xl font-bold text-foreground">Misión</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Llevar el mensaje de Jesucristo a la población colombiana en general, a través de
              medios masivos de comunicación; con tecnología de punta, mediante la diversidad en la
              programación y contenido de alto impacto.
            </p>
          </div>
          <div className="rounded-2xl bg-card border border-border p-7 shadow-card">
            <div className="flex items-center gap-3 mb-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl surface-violet">
                <Eye className="h-5 w-5" />
              </span>
              <h3 className="text-2xl font-bold text-foreground">Visión</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Ser la organización cristiana líder en satisfacer las necesidades espirituales de las
              personas, con los recursos ofrecidos en la televisión cristiana de Enlace, cuyo
              contenido alabe, adore y glorifique al Señor.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-7 sm:p-10 shadow-card">
          <div className="flex items-center gap-3 mb-2">
            <span className="grid h-11 w-11 place-items-center rounded-xl surface-violet">
              <Award className="h-5 w-5" />
            </span>
            <h3 className="text-2xl font-bold text-foreground">Nuestros valores</h3>
          </div>
          <p className="text-sm italic text-muted-foreground mb-6">
            «Mis ojos pondré en los fieles de la tierra, para que estén conmigo; el que ande en
            camino de la perfección, éste me servirá.» — Salmo 101:6
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {valores.map((v) => (
              <div key={v.t} className="rounded-xl border border-border p-5 bg-background">
                <p className="font-bold text-violet">{v.t}</p>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- NUESTRA LABOR ---------------- */
function NuestraLabor() {
  const pilares = [
    {
      icon: Headphones,
      t: "Servicio al Cliente",
      d: "Por teléfono, email y mensajes de texto saludamos a nuestros ofrendantes para expresarles gratitud y declarar la luz de la Palabra de Dios sobre sus peticiones. Antes de iniciar labores, oramos e intercedemos para que sus peticiones sean contestadas.",
    },
    {
      icon: Gift,
      t: "Celebraciones",
      d: "Estamos atentos a los días de la madre y el padre para enviar felicitaciones. Entregamos Biblias a los convertidos y regalamos libros a quienes vienen a ofrendar a la oficina de Enlace.",
    },
    {
      icon: UserCheck,
      t: "Atención Personalizada",
      d: "Los agentes del Contact Center atienden de lunes a viernes, desde las 7:00 AM hasta las 5:00 PM.",
    },
    {
      icon: HandHeart,
      t: "Consejería",
      d: "Comuníquese con nosotros para encontrar la respuesta de Dios sobre las circunstancias y situaciones que afectan su vida.",
    },
  ];
  return (
    <section id="nuestra-labor" className="py-20 sm:py-28 bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-semibold tracking-widest uppercase text-violet">
            Nuestra labor
          </span>
          <h2 className="mt-3 text-4xl sm:text-5xl font-extrabold text-foreground leading-tight">
            Cuatro pilares de <span className="text-violet">fidelización</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            Trabajamos para que el mensaje de Jesucristo llegue a sus hogares por medio de la
            televisión cristiana <strong>Enlace</strong> y <strong>Enlace Juvenil</strong>. Nuestro
            Contact Center complementa la labor de las iglesias, misiones y ministerios cristianos.
            Solo llame al{" "}
            <a href="tel:+576016439200" className="text-violet font-semibold hover:underline">
              (601) 6439200
            </a>{" "}
            y un consejero lo atenderá.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {pilares.map((p, i) => (
            <div
              key={p.t}
              className="rounded-2xl bg-card border border-border p-7 shadow-card hover:shadow-lift transition"
            >
              <div className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl surface-violet">
                  <p.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-bold tracking-widest uppercase text-gold">
                    Pilar 0{i + 1}
                  </p>
                  <h3 className="mt-1 text-xl font-bold text-foreground">{p.t}</h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed">{p.d}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <blockquote className="mt-10 p-6 sm:p-8 rounded-2xl surface-violet relative overflow-hidden text-center">
          <Quote className="absolute -top-2 -right-2 h-24 w-24 text-white/10" />
          <p className="text-xl sm:text-2xl italic relative">
            «Dios es nuestro amparo y fortaleza, nuestro pronto auxilio en las tribulaciones.»
          </p>
          <p className="mt-3 text-sm text-gold font-semibold">Salmo 46:1</p>
        </blockquote>
      </div>
    </section>
  );
}

/* ---------------- REFLEXIONES ---------------- */
function Reflexiones({ posts: initialPosts }: { posts: BlogPost[] }) {
  const [posts, setPosts] = useState(initialPosts);

  useEffect(() => {
    void getPublishedBlogPosts()
      .then((all) => setPosts(all.slice(0, 3)))
      .catch(() => {
        /* mantiene datos del loader */
      });
  }, []);

  return (
    <section id="reflexiones" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold tracking-widest uppercase text-violet">
              Blog
            </span>
            <h2 className="mt-3 text-4xl sm:text-5xl font-extrabold text-foreground">
              Reflexiones que <span className="text-violet">alimentan el alma</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Devocionales, enseñanzas y palabras de aliento de nuestros pastores y consejeros.
            </p>
          </div>
          {posts.length > 0 && (
            <Link
              to="/reflexiones"
              className="inline-flex items-center gap-2 text-sm font-semibold text-violet hover:underline"
            >
              Ver todas
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        {posts.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-border bg-card/60 p-10 sm:p-14 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl surface-violet">
              <Newspaper className="h-6 w-6" />
            </span>
            <h3 className="mt-5 text-2xl font-bold text-foreground">Próximamente</h3>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Estamos preparando contenido nuevo para esta sección. Mientras tanto, te invitamos a
              ver la transmisión en vivo o a enviarnos tu petición de oración.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a
                {...liveLinkProps}
                className="inline-flex items-center gap-2 h-11 px-5 rounded-full surface-violet text-sm font-semibold"
              >
                <Play className="h-4 w-4 fill-current" /> Ver en vivo
              </a>
              <a
                href="#oracion"
                className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-secondary text-foreground text-sm font-semibold hover:bg-violet hover:text-white transition"
              >
                <HandHeart className="h-4 w-4" /> Enviar petición
              </a>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.id}
                className="group rounded-2xl border border-border bg-card overflow-hidden shadow-card hover:shadow-lift transition"
              >
                {post.coverImageUrl ? (
                  <img
                    src={post.coverImageUrl}
                    alt=""
                    className="aspect-16/10 w-full object-cover"
                  />
                ) : (
                  <div className="aspect-16/10 w-full surface-violet opacity-90" />
                )}
                <div className="p-5">
                  <time className="text-xs font-semibold text-muted-foreground">
                    {formatBlogDate(post.publishedAt)}
                  </time>
                  <h3 className="mt-2 text-lg font-bold text-foreground group-hover:text-violet transition">
                    <Link to="/reflexiones/$slug" params={{ slug: post.slug }}>
                      {post.title}
                    </Link>
                  </h3>
                  {post.excerpt && (
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
