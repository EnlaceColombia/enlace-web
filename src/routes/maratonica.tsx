import { createFileRoute } from "@tanstack/react-router";
import { Heart, MapPin, Phone, Quote, Star, Clock, HandHeart } from "lucide-react";

import heroImg from "@/assets/hero-familia.jpg";
import { MaratonicaCountdown } from "@/components/maratonica-countdown";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getMaratonicaPageConfig } from "@/lib/api/maratonica.functions";
import {
  getMaratonicaCountdownTarget,
  getMaratonicaPhase,
  MARATONICA_TESTIMONIALS,
} from "@/lib/maratonica/types";
import { DONATION_URL, getWhatsAppUrl, LIVE_URL, WHATSAPP_DEFAULT_MESSAGE } from "@/lib/site";

export const Route = createFileRoute("/maratonica")({
  loader: async () => {
    const config = await getMaratonicaPageConfig();
    return { config };
  },
  head: () => ({
    meta: [
      { title: "Maratónica — Corporación Enlace Colombia" },
      {
        name: "description",
        content:
          "Participa en la Maratónica de Enlace Colombia: oración, fe y siembra. El Señor tiene una respuesta para ti.",
      },
    ],
  }),
  component: MaratonicaPage,
});

function MaratonicaPage() {
  const { config } = Route.useLoaderData();
  const phase = getMaratonicaPhase(config);
  const countdownTarget = getMaratonicaCountdownTarget(config);

  const countdownTitle =
    phase === "live" ? "Maratónica en curso — termina en" : "Próxima Maratónica en";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="relative -mt-20 pt-20 overflow-hidden surface-hero">
          <div className="absolute inset-0 ring-grid opacity-60" />
          <div className="absolute inset-0" style={{ background: "var(--gradient-radial-glow)" }} />
          <img
            src={heroImg}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-25 mix-blend-luminosity"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-b from-transparent to-background" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24 lg:py-28">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold tracking-widest uppercase backdrop-blur-md">
                Maratónica
              </span>
              <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.08]">
                {(() => {
                  const words = config.headline.trim().split(/\s+/);
                  if (words.length <= 2) {
                    return <span className="text-gradient-gold">{config.headline}</span>;
                  }
                  return (
                    <>
                      {words.slice(0, 2).join(" ")}
                      <br />
                      <span className="text-gradient-gold">{words.slice(2).join(" ")}</span>
                    </>
                  );
                })()}
              </h1>

              <div className="mt-8 grid sm:grid-cols-2 gap-4 max-w-2xl">
                <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-4">
                  <p className="text-[10px] font-semibold tracking-widest uppercase text-gold">
                    Participación
                  </p>
                  <p className="mt-1 text-sm sm:text-base font-semibold text-white">
                    {config.participation}
                  </p>
                </div>
                <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-4">
                  <p className="text-[10px] font-semibold tracking-widest uppercase text-gold">
                    Fecha
                  </p>
                  <p className="mt-1 text-sm sm:text-base font-semibold text-white">
                    {config.eventDateLabel}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/85">
                <span className="inline-flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gold shrink-0" />
                  <span>
                    {config.prayerPhoneHint}:{" "}
                    <a href="tel:+57601439200" className="font-semibold text-white hover:text-gold">
                      {config.prayerPhone}
                    </a>
                  </span>
                </span>
                <span className="inline-flex items-center gap-2">
                  <HandHeart className="h-4 w-4 text-gold shrink-0" />
                  <a
                    href={getWhatsAppUrl(WHATSAPP_DEFAULT_MESSAGE)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-white hover:text-gold"
                  >
                    WhatsApp · Peticiones
                  </a>
                </span>
              </div>
            </div>

            <div className="mt-12 lg:mt-14 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
              {config.enabled && countdownTarget ? (
                <MaratonicaCountdown targetIso={countdownTarget} title={countdownTitle} />
              ) : (
                <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6 max-w-xl">
                  <p className="text-sm text-white/90 leading-relaxed">
                    Pronto anunciaremos la próxima Maratónica. Síguenos en nuestras redes o
                    contáctanos para más información.
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-3 shrink-0">
                <a
                  href={DONATION_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 h-12 px-6 rounded-full btn-gold text-base font-semibold"
                >
                  <Heart className="h-5 w-5" />
                  Donar ahora
                </a>
                <a
                  href={LIVE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 h-12 px-6 rounded-full btn-ghost-light text-base font-semibold"
                >
                  Ver señal en vivo
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Mensaje */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
            <span className="text-xs font-semibold tracking-widest uppercase text-violet">
              Siembra y cosecha
            </span>
            <p className="mt-4 text-lg sm:text-xl text-muted-foreground leading-relaxed">
              {config.description}
            </p>
          </div>
        </section>

        {/* Contador secundario (refuerzo visual como en el sitio anterior) */}
        {config.enabled && countdownTarget && phase !== "ended" && (
          <section className="py-12 sm:py-16 bg-secondary/40 border-y border-border">
            <div className="mx-auto max-w-3xl px-4 sm:px-6">
              <MaratonicaCountdown
                targetIso={countdownTarget}
                title={countdownTitle}
                variant="card"
              />
              <div className="mt-8 flex justify-center">
                <a
                  href={DONATION_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 h-12 px-8 rounded-full btn-gold font-semibold"
                >
                  <Heart className="h-5 w-5" />
                  Donar
                </a>
              </div>
            </div>
          </section>
        )}

        {/* Testimonios */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="max-w-2xl mb-14">
              <span className="text-xs font-semibold tracking-widest uppercase text-violet">
                Testimonios
              </span>
              <h2 className="mt-3 text-4xl sm:text-5xl font-extrabold text-foreground">
                Dios sigue <span className="text-violet">respondiendo</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {MARATONICA_TESTIMONIALS.map((t) => (
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
                    <div className="h-10 w-10 rounded-full surface-violet grid place-items-center font-bold text-white">
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

        {/* Contacto */}
        <section className="py-16 sm:py-20 surface-dark">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
                <MapPin className="h-6 w-6 text-gold mb-3" />
                <p className="text-xs font-semibold tracking-widest uppercase text-white/60">
                  Ubícanos en
                </p>
                <p className="mt-2 text-white font-medium">Calle 124 # 70A – 28</p>
                <p className="text-sm text-white/70">Bogotá, Colombia</p>
              </div>
              <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
                <Clock className="h-6 w-6 text-gold mb-3" />
                <p className="text-xs font-semibold tracking-widest uppercase text-white/60">
                  Horario
                </p>
                <p className="mt-2 text-white font-medium">Lunes a viernes</p>
                <p className="text-sm text-white/70">7:00 a.m. – 5:00 p.m.</p>
              </div>
              <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
                <Phone className="h-6 w-6 text-gold mb-3" />
                <p className="text-xs font-semibold tracking-widest uppercase text-white/60">
                  Contacto
                </p>
                <p className="mt-2 text-white font-medium">
                  <a href="tel:+57601439200" className="hover:text-gold transition">
                    (601) 6439200
                  </a>
                </p>
                <p className="text-sm text-white/70">
                  <a href="mailto:info@enlacecolombia.org" className="hover:text-gold transition">
                    info@enlacecolombia.org
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
