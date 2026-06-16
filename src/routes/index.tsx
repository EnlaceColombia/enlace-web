import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Play, Heart, HandHeart, Radio, Globe2, ShieldCheck, MessageCircle,
  ChevronDown, Menu, X, Search, Tv, Music2, BookOpen, Users2, Sparkles,
  Mail, MapPin, Phone, Facebook, Instagram, Youtube, Twitter, Apple,
  CheckCircle2, ArrowRight, Quote, Star, Headphones, Gift, UserCheck,
  Clock, Newspaper, Target, Eye, Award,
} from "lucide-react";
import heroImg from "@/assets/hero-familia.jpg";
import progBiblia from "@/assets/program-biblia.jpg";
import progMusica from "@/assets/program-musica.jpg";
import progFamilia from "@/assets/program-familia.jpg";
import progPredicas from "@/assets/program-predicas.jpg";
import progJovenes from "@/assets/program-jovenes.jpg";
import progEnlacePlus from "@/assets/program-enlaceplus.jpg";
import enlaceLogo from "@/assets/enlace-texto-blanco.svg";
import nosotrosFamilia from "@/assets/nosotros-familia.png.asset.json";

export const Route = createFileRoute("/")({
  component: Index,
});

const programs = [
  { title: "Prédicas", desc: "Enseñanza bíblica diaria", img: progPredicas, icon: Tv },
  { title: "Música", desc: "Adoración y alabanza", img: progMusica, icon: Music2 },
  { title: "Familia", desc: "Consejería y vida en familia", img: progFamilia, icon: Users2 },
  { title: "Biblia", desc: "Estudios y devocionales", img: progBiblia, icon: BookOpen },
  { title: "Jóvenes", desc: "Generación que adora", img: progJovenes, icon: Sparkles },
  { title: "Enlace+", desc: "Streaming on-demand", img: progEnlacePlus, icon: Play },
];

const navItems = [
  { label: "Inicio", href: "#inicio" },
  {
    label: "Nosotros",
    href: "#nosotros",
    mega: {
      cols: [
        {
          title: "Quiénes somos",
          links: [
            { label: "Nosotros", desc: "Misión, visión y valores", icon: Users2, href: "#nosotros" },
            { label: "Nuestra Labor", desc: "Los 4 pilares de fidelización", icon: HandHeart, href: "#nuestra-labor" },
            { label: "Transparencia", desc: "Te rendimos cuentas", icon: ShieldCheck, href: "#transparencia" },
          ],
        },
        {
          title: "Comunidad",
          links: [
            { label: "Oración", desc: "Envía tu petición", icon: HandHeart, href: "#oracion" },
            { label: "Testimonios", desc: "Historias que inspiran", icon: Star, href: "#testimonios" },
            { label: "Reflexiones", desc: "Devocionales y blog", icon: BookOpen, href: "#reflexiones" },
          ],
        },
      ],
      cta: { title: "Más de 20 años", desc: "Llevando esperanza a Colombia", img: progPredicas },
    },
  },
  {
    label: "En Vivo",
    href: "#en-vivo",
    mega: {
      cols: [
        {
          title: "Transmisión",
          links: [
            { label: "Enlace TV en vivo", desc: "Señal 24/7", icon: Radio, href: "#en-vivo" },
            { label: "Programación de hoy", desc: "Guía completa", icon: Tv, href: "#en-vivo" },
            { label: "Eventos especiales", desc: "Conferencias y conciertos", icon: Sparkles, href: "#en-vivo" },
          ],
        },
        {
          title: "On-Demand",
          links: [
            { label: "Enlace+", desc: "Películas y series", icon: Play, href: "#programas" },
            { label: "Música cristiana", desc: "Conciertos y videoclips", icon: Music2, href: "#programas" },
            { label: "Biblia interactiva", desc: "Lecturas guiadas", icon: BookOpen, href: "#programas" },
          ],
        },
      ],
      cta: { title: "Descarga la app", desc: "Lleva Enlace contigo", img: progEnlacePlus },
    },
  },
  {
    label: "Programas",
    href: "#programas",
    mega: {
      cols: [
        {
          title: "Categorías",
          links: [
            { label: "Prédicas", desc: "Enseñanza bíblica", icon: Tv, href: "#programas" },
            { label: "Familia", desc: "Vida en el hogar", icon: Users2, href: "#programas" },
            { label: "Jóvenes", desc: "Nueva generación", icon: Sparkles, href: "#programas" },
          ],
        },
        {
          title: "Destacados",
          links: [
            { label: "En Casa Con…", desc: "Yuri & Rodrigo Espinoza", icon: Star, href: "#programas" },
            { label: "Salmo 23", desc: "Devocional diario", icon: BookOpen, href: "#programas" },
            { label: "Música 24/7", desc: "Adoración sin pausa", icon: Music2, href: "#programas" },
          ],
        },
      ],
      cta: { title: "Estrenos de la semana", desc: "Nuevo contenido cada lunes", img: progPredicas },
    },
  },
  { label: "Donar", href: "#donar" },
  { label: "Contacto", href: "#contacto" },
];

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <TrustBar />
        <LiveSection />
        <Nosotros />
        <NuestraLabor />
        <Programs />
        <PrayerSection />
        <DonateSection />
        <Impact />
        <Testimonials />
        <Reflexiones />
        <Transparency />
        <Mission />
      </main>
      <Footer />
    </div>
  );
}

/* ---------------- HEADER + MEGA MENU ---------------- */
function Header() {
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 border-b ${
        scrolled ? "border-white/10 shadow-lift" : "border-transparent"
      }`}
      style={{
        background: scrolled
          ? "linear-gradient(135deg, rgba(108,0,192,0.96), rgba(42,0,92,0.96))"
          : "var(--gradient-hero)",
        backdropFilter: scrolled ? "blur(14px)" : undefined,
      }}
      onMouseLeave={() => setOpen(null)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-3 h-18 py-3 w-full lg:grid lg:grid-cols-[auto_1fr_auto] lg:gap-4">
          <a href="#inicio" className="flex items-center self-center shrink-0">
            <img src={enlaceLogo} alt="Enlace+" className="h-11 sm:h-12 lg:h-14 w-auto block" />
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center justify-center gap-1 min-w-0">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpen(item.mega ? item.label : null)}
              >
                <a
                  href={item.href}
                  className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-white/90 hover:text-white transition-colors rounded-md"
                >
                  {item.label}
                  {item.mega && <ChevronDown className="h-3.5 w-3.5 opacity-70" />}
                </a>
              </div>
            ))}
          </nav>

          <div className="flex-1 min-w-2 lg:hidden" aria-hidden="true" />

          <div className="flex items-center gap-2 shrink-0">
            <button className="hidden md:inline-flex h-9 w-9 items-center justify-center rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors" aria-label="Buscar">
              <Search className="h-4 w-4" />
            </button>
            <a href="#en-vivo" className="hidden md:inline-flex items-center gap-2 h-9 px-3 rounded-full btn-ghost-light text-sm">
              <span className="h-2 w-2 rounded-full bg-red-500 live-dot" />
              EN VIVO
            </a>
            <a href="#donar" className="inline-flex items-center gap-2 h-10 px-4 sm:px-5 rounded-full btn-gold text-sm">
              <Heart className="h-4 w-4" />
              Donar
            </a>
          </div>
          <button
            className="lg:hidden shrink-0 h-10 w-10 grid place-items-center rounded-md text-white hover:bg-white/10 -mr-1"
            onClick={() => setMobile(true)}
            aria-label="Abrir menú"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* Mega menu panel */}
        {open && navItems.find((n) => n.label === open)?.mega && (
          <MegaMenu data={navItems.find((n) => n.label === open)!.mega!} />
        )}
      </div>

      {mobile && <MobileMenu onClose={() => setMobile(false)} />}
    </header>
  );
}

function MegaMenu({ data }: { data: NonNullable<(typeof navItems)[0]["mega"]> }) {
  return (
    <div className="absolute left-0 right-0 top-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-6">
        <div className="rounded-2xl bg-white shadow-lift border border-border overflow-hidden grid grid-cols-1 md:grid-cols-[1fr_1fr_320px]">
          {data.cols.map((col) => (
            <div key={col.title} className="p-6 border-r border-border last:border-r-0">
              <p className="text-xs font-semibold tracking-widest uppercase text-violet mb-4">
                {col.title}
              </p>
              <ul className="space-y-1">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={(l as { href?: string }).href ?? "#"}
                      className="group flex items-start gap-3 rounded-lg p-3 hover:bg-secondary transition-colors"
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg surface-violet">
                        <l.icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-foreground group-hover:text-violet">
                          {l.label}
                        </span>
                        <span className="block text-xs text-muted-foreground">{l.desc}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="relative min-h-[220px] surface-violet p-6 flex flex-col justify-end">
            <img
              src={data.cta.img}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-luminosity"
              loading="lazy"
            />
            <div className="relative">
              <p className="text-xs font-semibold tracking-widest uppercase text-gold mb-2">
                Destacado
              </p>
              <h4 className="text-lg font-bold text-white mb-1">{data.cta.title}</h4>
              <p className="text-sm text-white/80 mb-4">{data.cta.desc}</p>
              <a href="#" className="inline-flex items-center gap-2 text-sm font-semibold text-gold hover:gap-3 transition-all">
                Explorar <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-[88%] max-w-sm surface-dark p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <span className="text-2xl font-extrabold text-white">enlace<span className="text-gold">+</span></span>
          <button onClick={onClose} className="h-10 w-10 grid place-items-center rounded-md text-white hover:bg-white/10" aria-label="Cerrar">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="space-y-1">
          {navItems.map((n) => (
            <a key={n.label} href={n.href} onClick={onClose} className="block py-3 px-3 rounded-lg text-white/90 hover:bg-white/10 text-base font-medium">
              {n.label}
            </a>
          ))}
        </nav>
        <a href="#donar" onClick={onClose} className="mt-6 inline-flex w-full items-center justify-center gap-2 h-12 rounded-full btn-gold">
          <Heart className="h-4 w-4" /> Donar ahora
        </a>
      </div>
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
            Llevando <span className="text-gradient-gold">esperanza</span><br />
            a millones de hogares
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-white/80 max-w-2xl leading-relaxed">
            Transmisión cristiana 24/7, oración y contenido que transforma vidas.
            Acompáñanos desde cualquier lugar del mundo.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a href="#en-vivo" className="inline-flex items-center gap-2 h-12 px-6 rounded-full btn-gold text-base">
              <Play className="h-5 w-5 fill-current" /> Ver en vivo
            </a>
            <a href="#oracion" className="inline-flex items-center gap-2 h-12 px-6 rounded-full btn-ghost-light text-base font-semibold">
              <HandHeart className="h-5 w-5" /> Enviar petición
            </a>
            <a href="#donar" className="inline-flex items-center gap-2 h-12 px-6 rounded-full bg-white text-violet-deep text-base font-semibold hover:bg-white/90 transition">
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
function LiveSection() {
  return (
    <section id="en-vivo" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-[1.5fr_1fr] gap-10 items-center">
        <div className="relative aspect-video rounded-3xl overflow-hidden shadow-lift glow-violet group">
          <img src={heroImg} alt="Transmisión en vivo" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-linear-to-tr from-violet-deep/80 via-violet/30 to-transparent" />
          <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500 text-white text-xs font-bold">
            <span className="h-2 w-2 rounded-full bg-white live-dot" /> EN VIVO
          </div>
          <button className="absolute inset-0 m-auto h-20 w-20 rounded-full bg-white/95 grid place-items-center group-hover:scale-110 transition-transform shadow-2xl" aria-label="Reproducir">
            <Play className="h-8 w-8 text-violet-deep fill-current ml-1" />
          </button>
          <div className="absolute bottom-0 inset-x-0 p-6 bg-linear-to-t from-black/80 to-transparent">
            <p className="text-xs font-semibold tracking-widest uppercase text-gold">Ahora en vivo</p>
            <p className="text-xl font-bold text-white">En Casa Con… Yuri & Rodrigo Espinoza</p>
          </div>
        </div>
        <div>
          <span className="text-xs font-semibold tracking-widest uppercase text-violet">Transmisión</span>
          <h2 className="mt-3 text-4xl sm:text-5xl font-extrabold text-foreground leading-tight">
            Enlace en vivo, <span className="text-violet">todo el día</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Acompáñanos desde cualquier lugar del mundo. Prédicas, música, familia y mucho más, sin interrupciones.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#" className="inline-flex items-center gap-2 h-11 px-5 rounded-full surface-violet text-sm font-semibold">
              <Play className="h-4 w-4 fill-current" /> Ver ahora
            </a>
            <a href="#" className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-secondary text-foreground text-sm font-semibold hover:bg-violet hover:text-white transition">
              Ver programación <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              { t: "Hoy 19:00", s: "Prédica · Pastor invitado" },
              { t: "Hoy 21:00", s: "Noche de adoración" },
              { t: "Mañana 08:00", s: "Devocional matutino" },
            ].map((p) => (
              <div key={p.t} className="rounded-xl border border-border p-3 bg-card">
                <p className="text-xs font-bold text-violet">{p.t}</p>
                <p className="text-xs text-muted-foreground mt-1 leading-snug">{p.s}</p>
              </div>
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
            <span className="text-xs font-semibold tracking-widest uppercase text-violet">Programas destacados</span>
            <h2 className="mt-3 text-4xl sm:text-5xl font-extrabold text-foreground">
              Contenido que <span className="text-violet">transforma</span>
            </h2>
          </div>
          <a href="#" className="inline-flex items-center gap-2 text-sm font-semibold text-violet hover:gap-3 transition-all">
            Ver todo el catálogo <ArrowRight className="h-4 w-4" />
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((p) => (
            <a key={p.title} href="#" className="group relative aspect-4/5 rounded-2xl overflow-hidden shadow-card hover:shadow-lift transition-all">
              <img src={p.img} alt={p.title} className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
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
  return (
    <section id="oracion" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-start">
        <div>
          <span className="text-xs font-semibold tracking-widest uppercase text-violet">Peticiones de oración</span>
          <h2 className="mt-3 text-4xl sm:text-5xl font-extrabold text-foreground leading-tight">
            Nuestro equipo está <span className="text-violet">orando por ti</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Comparte con nosotros tu petición. Nuestro equipo pastoral la recibirá con respeto y oraremos contigo en privado.
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
              «Si dos de vosotros se pusieren de acuerdo en la tierra acerca de cualquiera cosa que pidieren, les será hecho.»
            </p>
            <p className="mt-2 text-sm text-gold font-semibold">Mateo 18:19</p>
          </blockquote>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); setSent(true); }}
          className="rounded-3xl bg-card border border-border shadow-card p-6 sm:p-8"
        >
          {sent ? (
            <div className="text-center py-10">
              <div className="mx-auto h-16 w-16 rounded-full surface-violet grid place-items-center mb-4">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold">Petición recibida</h3>
              <p className="mt-2 text-muted-foreground">Estaremos orando por ti. Que la paz del Señor te acompañe.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <Field label="Nombre" placeholder="Tu nombre" />
              <Field label="País / Ciudad" placeholder="Ej. Bogotá, Colombia" />
              <Field label="WhatsApp o email (opcional)" placeholder="+57 300 000 0000" />
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Motivo de oración</label>
                <textarea
                  rows={4}
                  placeholder="Comparte aquí tu petición…"
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <label className="flex items-start gap-3 text-sm text-foreground cursor-pointer">
                <input type="checkbox" className="mt-1 accent-[#47009B]" />
                <span>Deseo que el equipo pastoral me contacte</span>
              </label>
              <button type="submit" className="w-full inline-flex items-center justify-center gap-2 h-12 rounded-full surface-violet font-semibold mt-2">
                <HandHeart className="h-5 w-5" /> Enviar petición
              </button>
              <p className="text-xs text-muted-foreground text-center">Tu información es confidencial.</p>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
function Field({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-foreground mb-1.5">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        className="w-full h-11 rounded-xl border border-input bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}

/* ---------------- DONATE ---------------- */
function DonateSection() {
  const [freq, setFreq] = useState<"once" | "month">("month");
  const [amount, setAmount] = useState(50);
  const amounts = [25, 50, 100, 250];

  return (
    <section id="donar" className="relative py-20 sm:py-28 surface-dark overflow-hidden">
      <div className="absolute inset-0 ring-grid opacity-40" />
      <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full" style={{ background: "var(--gradient-radial-glow)" }} />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="text-xs font-semibold tracking-widest uppercase text-gold">Donaciones</span>
          <h2 className="mt-3 text-4xl sm:text-5xl font-extrabold text-white leading-tight">
            Tu donación lleva <span className="text-gradient-gold">esperanza</span> a un hogar
          </h2>
          <p className="mt-4 text-lg text-white/75 max-w-xl">
            Cada aporte sostiene la transmisión 24/7, la producción de contenido y el equipo pastoral que responde miles de peticiones cada mes.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {[
              { icon: ShieldCheck, t: "Pagos 100% seguros", s: "Encriptación bancaria SSL" },
              { icon: CheckCircle2, t: "Ministerio certificado", s: "Reportes públicos mensuales" },
              { icon: Globe2, t: "Donaciones internacionales", s: "Tarjeta · PayPal · Transferencia" },
              { icon: HandHeart, t: "Cancela cuando quieras", s: "Sin permanencia" },
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
          <div className="grid grid-cols-2 p-1 rounded-full bg-secondary mb-6">
            {(["month", "once"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFreq(f)}
                className={`h-10 rounded-full text-sm font-semibold transition ${
                  freq === f ? "surface-violet shadow-glow-violet" : "text-foreground"
                }`}
              >
                {f === "month" ? "Mensual" : "Una vez"}
              </button>
            ))}
          </div>
          <p className="text-sm font-semibold text-foreground mb-3">Elige un monto (USD)</p>
          <div className="grid grid-cols-4 gap-2 mb-3">
            {amounts.map((a) => (
              <button
                key={a}
                onClick={() => setAmount(a)}
                className={`h-12 rounded-xl border-2 font-bold transition ${
                  amount === a
                    ? "border-violet bg-violet text-white"
                    : "border-border bg-background text-foreground hover:border-violet/50"
                }`}
              >
                ${a}
              </button>
            ))}
          </div>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full h-12 rounded-xl border-2 border-border px-4 text-lg font-bold text-foreground focus:outline-none focus:border-violet"
          />
          <button className="mt-6 w-full inline-flex items-center justify-center gap-2 h-14 rounded-full btn-gold text-base">
            <Heart className="h-5 w-5" />
            Donar ${amount} {freq === "month" ? "/ mes" : "ahora"}
          </button>
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
          <span className="text-xs font-semibold tracking-widest uppercase text-violet">Nuestro impacto</span>
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
    { name: "Mariela Gómez", place: "Maratónica · Noviembre 2020", text: "Mi hijo estaba preparado para que le amputaran una pierna por la ruptura del nervio ciático. Llamé a Enlace a pedir oración por su sanidad. Dios escuchó: el nervio fue restaurado y ya no le quitaron su pierna. ¡Gloria a Dios!" },
    { name: "Marina Camargo", place: "Maratónica · Noviembre 2020", text: "Estaba preparada para una cirugía de hernia. Me conecté con la Maratónica de Enlace y ofrendé por mi sanidad. Fui al chequeo médico y la hernia ya no estaba. ¡Desapareció! ¡Gloria a Dios!" },
    { name: "Ana Florián", place: "Maratónica · Febrero 2020", text: "Después de más de un año sin que mi hija consiguiera empleo, sembré en la Maratónica de febrero 2020. Dios respondió a ese acto de fe y hoy mi hija goza de ese empleo por el cual creí al Señor. ¡Gloria a Dios!" },
    { name: "Rosalba Barragán", place: "Maratónica · Agosto 2020", text: "Creí la Palabra y recibí un milagro: Dios borró una deuda de 5 millones. ¡Gloria al Señor!" },
  ];
  return (
    <section id="testimonios" className="py-20 sm:py-28 bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-2xl mb-14">
          <span className="text-xs font-semibold tracking-widest uppercase text-violet">Testimonios</span>
          <h2 className="mt-3 text-4xl sm:text-5xl font-extrabold text-foreground">
            Historias que <span className="text-violet">inspiran</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((t) => (
            <div key={t.name} className="rounded-2xl bg-card border border-border p-7 shadow-card relative">
              <Quote className="absolute top-6 right-6 h-8 w-8 text-violet/15" />
              <div className="flex gap-1 text-gold mb-4">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
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
    { q: "¿En qué se usan las donaciones?", a: "Producción de contenido, sostenimiento de la señal 24/7, equipo pastoral y proyectos misioneros." },
    { q: "¿Es seguro donar online?", a: "Sí. Procesamos con encriptación SSL de nivel bancario y proveedores certificados PCI-DSS." },
    { q: "¿Puedo cancelar mi donación mensual?", a: "Por supuesto. Puedes pausar o cancelar en cualquier momento desde tu panel de donante." },
    { q: "¿Reciben donaciones internacionales?", a: "Sí, aceptamos tarjeta, PayPal y transferencia desde más de 45 países." },
  ];
  return (
    <section id="transparencia" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-[1fr_1.2fr] gap-12">
        <div>
          <span className="text-xs font-semibold tracking-widest uppercase text-violet">Transparencia y confianza</span>
          <h2 className="mt-3 text-4xl sm:text-5xl font-extrabold text-foreground leading-tight">
            Te rendimos <span className="text-violet">cuentas</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Publicamos reportes mensuales con el detalle de cómo se invierte cada aporte. Creemos en la mayordomía con integridad.
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
          <a href="#" className="mt-8 inline-flex items-center gap-2 h-11 px-5 rounded-full surface-violet text-sm font-semibold">
            Ver último reporte <ArrowRight className="h-4 w-4" />
          </a>
        </div>
        <div className="space-y-3">
          {faqs.map((f, i) => <FAQItem key={i} {...f} defaultOpen={i === 0} />)}
        </div>
      </div>
    </section>
  );
}
function FAQItem({ q, a, defaultOpen }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 text-left">
        <span className="font-semibold text-foreground">{q}</span>
        <ChevronDown className={`h-5 w-5 text-violet transition-transform shrink-0 ${open ? "rotate-180" : ""}`} />
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
        <span className="text-xs font-semibold tracking-widest uppercase text-gold">Nuestra misión</span>
        <h2 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
          Somos un ministerio comprometido con llevar el mensaje de Jesús a <span className="text-gradient-gold">cada hogar</span>.
        </h2>
        <p className="mt-6 text-lg text-white/80 max-w-2xl mx-auto">
          Una familia global de creyentes, pastores y voluntarios trabajando juntos para que nadie quede sin escuchar las buenas noticias.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <a href="#donar" className="inline-flex items-center gap-2 h-12 px-6 rounded-full btn-gold">
            <Heart className="h-5 w-5" /> Sumarme con una ofrenda
          </a>
          <a href="#oracion" className="inline-flex items-center gap-2 h-12 px-6 rounded-full btn-ghost-light font-semibold">
            <HandHeart className="h-5 w-5" /> Pedir oración
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------------- FOOTER ---------------- */
function Footer() {
  return (
    <footer id="contacto" className="surface-dark pt-20 pb-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10 pb-12 border-b border-white/10">
          <div>
            <a href="#inicio" className="text-3xl font-extrabold text-white">enlace<span className="text-gold">+</span></a>
            <p className="mt-4 text-white/70 max-w-sm">
              Corporación Enlace Colombia · Llevando el mensaje de Jesucristo a los hogares colombianos a través de la televisión cristiana Enlace.
            </p>
            <div className="mt-6 flex gap-3">
              <a href="https://facebook.com/CorporacionEnlaceColombia" target="_blank" rel="noreferrer" className="h-10 w-10 grid place-items-center rounded-full bg-white/10 hover:bg-gold hover:text-violet-deep text-white transition" aria-label="Facebook"><Facebook className="h-4 w-4" /></a>
              <a href="https://instagram.com/corpenlaceco" target="_blank" rel="noreferrer" className="h-10 w-10 grid place-items-center rounded-full bg-white/10 hover:bg-gold hover:text-violet-deep text-white transition" aria-label="Instagram"><Instagram className="h-4 w-4" /></a>
              <a href="#" target="_blank" rel="noreferrer" className="h-10 w-10 grid place-items-center rounded-full bg-white/10 hover:bg-gold hover:text-violet-deep text-white transition" aria-label="YouTube"><Youtube className="h-4 w-4" /></a>
              <a href="https://twitter.com/CorpEnlaceCo" target="_blank" rel="noreferrer" className="h-10 w-10 grid place-items-center rounded-full bg-white/10 hover:bg-gold hover:text-violet-deep text-white transition" aria-label="Twitter / X"><Twitter className="h-4 w-4" /></a>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#" className="inline-flex items-center gap-2 h-11 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm transition">
                <Apple className="h-5 w-5" />
                <span><span className="block text-[10px] opacity-70">Descargar en</span><span className="block font-semibold -mt-0.5">App Store</span></span>
              </a>
              <a href="#" className="inline-flex items-center gap-2 h-11 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm transition">
                <Play className="h-5 w-5" />
                <span><span className="block text-[10px] opacity-70">Disponible en</span><span className="block font-semibold -mt-0.5">Google Play</span></span>
              </a>
            </div>
          </div>
          <FooterCol title="Explorar" links={["En vivo", "Programas", "Enlace+", "Música", "Biblia"]} />
          <FooterCol title="Ministerio" links={["Nosotros", "Nuestra Labor", "Oración", "Donaciones", "Transparencia", "Testimonios"]} />
          <div>
            <p className="text-sm font-bold tracking-widest uppercase text-white mb-4">Contacto</p>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 text-gold shrink-0" />Calle 124 # 70A – 28, Bogotá</li>
              <li className="flex items-start gap-2"><Phone className="h-4 w-4 mt-0.5 text-gold shrink-0" />(601) 6439200</li>
              <li className="flex items-start gap-2"><MessageCircle className="h-4 w-4 mt-0.5 text-gold shrink-0" />WhatsApp peticiones: 318 306 0745</li>
              <li className="flex items-start gap-2"><Mail className="h-4 w-4 mt-0.5 text-gold shrink-0" />info@enlacecolombia.org</li>
              <li className="flex items-start gap-2"><Clock className="h-4 w-4 mt-0.5 text-gold shrink-0" />Lun a Vie · 7:00 AM – 5:00 PM</li>
            </ul>
            <a href="https://www.zonapagos.com/t_corpenlace/pagos.asp" target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 h-10 px-4 rounded-full btn-gold text-sm">
              <Heart className="h-4 w-4" /> Donar online
            </a>
          </div>
        </div>
        <div className="pt-6 flex flex-wrap justify-between gap-4 text-xs text-white/50">
          <p>© {new Date().getFullYear()} Corporación Enlace Colombia. Todos los derechos reservados.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-white">Privacidad</a>
            <a href="#" className="hover:text-white">Términos</a>
            <a href="#" className="hover:text-white">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <p className="text-sm font-bold tracking-widest uppercase text-white mb-4">{title}</p>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l}><a href="#" className="text-sm text-white/70 hover:text-gold transition">{l}</a></li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------- NOSOTROS ---------------- */
function Nosotros() {
  const valores = [
    { t: "Servicio", d: "Dios nos creó para servir. Oramos, intercedemos y aconsejamos en los principios de la Palabra de Dios." },
    { t: "Compromiso", d: "Ponemos al máximo nuestra capacidad para sacar adelante las tareas encomendadas." },
    { t: "Integridad", d: "Obramos con rectitud y apego a los principios enseñados por Jesucristo." },
    { t: "Responsabilidad", d: "Cumplimos siempre a conciencia con nuestros deberes y obligaciones." },
    { t: "Trabajo en equipo", d: "Cada uno hace lo que le corresponde para lograr el objetivo común." },
    { t: "Respeto", d: "Reconocemos la dignidad y el valor de los demás; amabilidad y buen trato con todos." },
  ];
  return (
    <section id="nosotros" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-14 items-center mb-14">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold tracking-widest uppercase text-violet">Nosotros</span>
            <h2 className="mt-3 text-4xl sm:text-5xl font-extrabold text-foreground leading-tight">
              Una organización <span className="text-violet">sin ánimo de lucro</span>, al servicio del Reino
            </h2>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
              La Corporación Enlace Colombia está comprometida voluntaria y públicamente con una gestión social y responsable, en llevar a los hogares colombianos la televisión cristiana del canal internacional <strong>Enlace</strong>; además, ofrece consejería fundamentada en los principios bíblicos como única respuesta a las necesidades de las personas.
            </p>
            <blockquote className="mt-6 p-5 rounded-2xl surface-violet relative overflow-hidden">
              <Quote className="absolute -top-2 -right-2 h-20 w-20 text-white/10" />
              <p className="text-base sm:text-lg italic relative">«Mas buscad primeramente el reino de Dios y su justicia, y todas estas cosas os serán añadidas.»</p>
              <p className="mt-2 text-sm text-gold font-semibold">Mateo 6:33</p>
            </blockquote>
            <p className="mt-6 text-base text-muted-foreground">
              <span className="font-semibold text-foreground">Más de 20 años</span> posicionando la televisión cristiana a lo largo y ancho de Colombia, con el mensaje de Jesucristo como el único camino, la verdad y la vida.
            </p>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 rounded-4xl bg-linear-to-br from-sky-200/40 via-sky-400/20 to-transparent blur-2xl" aria-hidden />
            <img
              src={nosotrosFamilia.url}
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
              <span className="grid h-11 w-11 place-items-center rounded-xl surface-violet"><Target className="h-5 w-5" /></span>
              <h3 className="text-2xl font-bold text-foreground">Misión</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Llevar el mensaje de Jesucristo a la población colombiana en general, a través de medios masivos de comunicación; con tecnología de punta, mediante la diversidad en la programación y contenido de alto impacto.
            </p>
          </div>
          <div className="rounded-2xl bg-card border border-border p-7 shadow-card">
            <div className="flex items-center gap-3 mb-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl surface-violet"><Eye className="h-5 w-5" /></span>
              <h3 className="text-2xl font-bold text-foreground">Visión</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Ser la organización cristiana líder en satisfacer las necesidades espirituales de las personas, con los recursos ofrecidos en la televisión cristiana de Enlace, cuyo contenido alabe, adore y glorifique al Señor.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-7 sm:p-10 shadow-card">
          <div className="flex items-center gap-3 mb-2">
            <span className="grid h-11 w-11 place-items-center rounded-xl surface-violet"><Award className="h-5 w-5" /></span>
            <h3 className="text-2xl font-bold text-foreground">Nuestros valores</h3>
          </div>
          <p className="text-sm italic text-muted-foreground mb-6">
            «Mis ojos pondré en los fieles de la tierra, para que estén conmigo; el que ande en camino de la perfección, éste me servirá.» — Salmo 101:6
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
    { icon: Headphones, t: "Servicio al Cliente", d: "Por teléfono, email y mensajes de texto saludamos a nuestros ofrendantes para expresarles gratitud y declarar la luz de la Palabra de Dios sobre sus peticiones. Antes de iniciar labores, oramos e intercedemos para que sus peticiones sean contestadas." },
    { icon: Gift, t: "Celebraciones", d: "Estamos atentos a los días de la madre y el padre para enviar felicitaciones. Entregamos Biblias a los convertidos y regalamos libros a quienes vienen a ofrendar a la oficina de Enlace." },
    { icon: UserCheck, t: "Atención Personalizada", d: "Los agentes del Contact Center atienden de lunes a viernes, desde las 7:00 AM hasta las 5:00 PM." },
    { icon: HandHeart, t: "Consejería", d: "Comuníquese con nosotros para encontrar la respuesta de Dios sobre las circunstancias y situaciones que afectan su vida." },
  ];
  return (
    <section id="nuestra-labor" className="py-20 sm:py-28 bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-semibold tracking-widest uppercase text-violet">Nuestra labor</span>
          <h2 className="mt-3 text-4xl sm:text-5xl font-extrabold text-foreground leading-tight">
            Cuatro pilares de <span className="text-violet">fidelización</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            Trabajamos para que el mensaje de Jesucristo llegue a sus hogares por medio de la televisión cristiana <strong>Enlace</strong> y <strong>Enlace Juvenil</strong>. Nuestro Contact Center complementa la labor de las iglesias, misiones y ministerios cristianos. Solo llame al <a href="tel:+576016439200" className="text-violet font-semibold hover:underline">(601) 6439200</a> y un consejero lo atenderá.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {pilares.map((p, i) => (
            <div key={p.t} className="rounded-2xl bg-card border border-border p-7 shadow-card hover:shadow-lift transition">
              <div className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl surface-violet">
                  <p.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-bold tracking-widest uppercase text-gold">Pilar 0{i + 1}</p>
                  <h3 className="mt-1 text-xl font-bold text-foreground">{p.t}</h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed">{p.d}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <blockquote className="mt-10 p-6 sm:p-8 rounded-2xl surface-violet relative overflow-hidden text-center">
          <Quote className="absolute -top-2 -right-2 h-24 w-24 text-white/10" />
          <p className="text-xl sm:text-2xl italic relative">«Dios es nuestro amparo y fortaleza, nuestro pronto auxilio en las tribulaciones.»</p>
          <p className="mt-3 text-sm text-gold font-semibold">Salmo 46:1</p>
        </blockquote>
      </div>
    </section>
  );
}

/* ---------------- REFLEXIONES ---------------- */
function Reflexiones() {
  return (
    <section id="reflexiones" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold tracking-widest uppercase text-violet">Blog</span>
            <h2 className="mt-3 text-4xl sm:text-5xl font-extrabold text-foreground">
              Reflexiones que <span className="text-violet">alimentan el alma</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Pronto compartiremos aquí devocionales, enseñanzas y palabras de aliento de nuestros pastores y consejeros.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border-2 border-dashed border-border bg-card/60 p-10 sm:p-14 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl surface-violet">
            <Newspaper className="h-6 w-6" />
          </span>
          <h3 className="mt-5 text-2xl font-bold text-foreground">Próximamente</h3>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Estamos preparando contenido nuevo para esta sección. Mientras tanto, te invitamos a ver la transmisión en vivo o a enviarnos tu petición de oración.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a href="#en-vivo" className="inline-flex items-center gap-2 h-11 px-5 rounded-full surface-violet text-sm font-semibold">
              <Play className="h-4 w-4 fill-current" /> Ver en vivo
            </a>
            <a href="#oracion" className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-secondary text-foreground text-sm font-semibold hover:bg-violet hover:text-white transition">
              <HandHeart className="h-4 w-4" /> Enviar petición
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
