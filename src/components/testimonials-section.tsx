import { useEffect, useState, type ReactNode } from "react";
import { Quote, Star } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import type { Testimonial } from "@/lib/testimonials/types";

const AUTOPLAY_MS = 6000;

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="rounded-2xl bg-card border border-border p-7 shadow-card relative h-full flex flex-col">
      <Quote className="absolute top-6 right-6 h-8 w-8 text-violet/15" aria-hidden />
      <div className="flex gap-1 text-gold mb-4" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-current" />
        ))}
      </div>
      <p className="text-foreground leading-relaxed flex-1">“{testimonial.text}”</p>
      <div className="mt-6 flex items-center gap-3 pt-5 border-t border-border">
        <div className="h-10 w-10 rounded-full surface-violet grid place-items-center font-bold text-white shrink-0">
          {testimonial.name[0]}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-foreground text-sm truncate">{testimonial.name}</p>
          {testimonial.place ? (
            <p className="text-xs text-muted-foreground truncate">{testimonial.place}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

type TestimonialsSectionProps = {
  testimonials: Testimonial[];
  id?: string;
  className?: string;
  eyebrow?: string;
  title: ReactNode;
};

export function TestimonialsSection({
  testimonials,
  id = "testimonios",
  className,
  eyebrow = "Testimonios",
  title,
}: TestimonialsSectionProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const items = testimonials.filter((t) => t.text.trim().length > 0);
  if (items.length === 0) return null;

  useEffect(() => {
    if (!api) return;

    const onSelect = () => setCurrent(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!api || items.length <= 3 || paused) return;

    const timer = window.setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, AUTOPLAY_MS);

    return () => window.clearInterval(timer);
  }, [api, items.length, paused]);

  return (
    <section id={id} className={cn("py-20 sm:py-28 bg-secondary/40", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-2xl mb-10 sm:mb-14">
          <span className="text-xs font-semibold tracking-widest uppercase text-violet">
            {eyebrow}
          </span>
          <h2 className="mt-3 text-4xl sm:text-5xl font-extrabold text-foreground">{title}</h2>
        </div>

        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <Carousel
            setApi={setApi}
            opts={{ align: "start", loop: items.length > 3 }}
            className="w-full"
            aria-label="Carrusel de testimonios"
          >
            <CarouselContent className="items-stretch">
              {items.map((testimonial) => (
                <CarouselItem
                  key={testimonial.id}
                  className="basis-full md:basis-1/3 flex"
                >
                  <TestimonialCard testimonial={testimonial} />
                </CarouselItem>
              ))}
            </CarouselContent>

            {items.length > 3 ? (
              <div className="mt-8 flex items-center justify-center gap-4">
                <CarouselPrevious className="static left-auto top-auto translate-x-0 translate-y-0 shrink-0 h-10 w-10 border-border bg-card hover:bg-secondary" />
                <div className="flex gap-2" role="tablist" aria-label="Testimonios">
                  {items.map((testimonial, index) => (
                    <button
                      key={testimonial.id}
                      type="button"
                      role="tab"
                      aria-selected={current === index}
                      aria-label={`Testimonio de ${testimonial.name}`}
                      onClick={() => api?.scrollTo(index)}
                      className={cn(
                        "h-2 rounded-full transition-all",
                        current === index ? "w-8 bg-violet" : "w-2 bg-border hover:bg-violet/40",
                      )}
                    />
                  ))}
                </div>
                <CarouselNext className="static right-auto top-auto translate-x-0 translate-y-0 shrink-0 h-10 w-10 border-border bg-card hover:bg-secondary" />
              </div>
            ) : null}
          </Carousel>
        </div>
      </div>
    </section>
  );
}
