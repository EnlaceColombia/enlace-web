import { ExternalLink, Play } from "lucide-react";

import { LiveProgramImage } from "@/components/schedule-modal";
import type { ScheduleSlot } from "@/lib/site";
import { LIVE_EMBED_URL, LIVE_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

type LivePlayerProps = {
  program: ScheduleSlot | null;
  title: string;
  fallbackSrc: string;
  playing: boolean;
  onPlay: () => void;
  className?: string;
};

export function LivePlayer({
  program,
  title,
  fallbackSrc,
  playing,
  onPlay,
  className,
}: LivePlayerProps) {
  return (
    <div
      className={cn(
        "relative aspect-video rounded-3xl overflow-hidden shadow-lift glow-violet bg-violet-deep",
        className,
      )}
    >
      {playing ? (
        <>
          <iframe
            src={LIVE_EMBED_URL}
            title={`Transmisión en vivo: ${title}`}
            className="absolute inset-0 h-full w-full border-0"
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
            allowFullScreen
          />
          <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500 text-white text-xs font-bold z-10">
            <span className="h-2 w-2 rounded-full bg-white live-dot" /> EN VIVO
          </div>
          <a
            href={LIVE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-4 right-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm hover:bg-black/70 transition"
          >
            Abrir en Enlace+ <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </>
      ) : (
        <button
          type="button"
          onClick={onPlay}
          aria-label={`Reproducir en vivo: ${title}`}
          className="group relative block h-full w-full text-left"
        >
          <LiveProgramImage
            program={program}
            fallbackSrc={fallbackSrc}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl opacity-50"
          />
          <LiveProgramImage
            program={program}
            fallbackSrc={fallbackSrc}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-linear-to-tr from-violet-deep/80 via-violet/30 to-transparent" />
          <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500 text-white text-xs font-bold">
            <span className="h-2 w-2 rounded-full bg-white live-dot" /> EN VIVO
          </div>
          <span
            className="absolute inset-0 m-auto h-20 w-20 rounded-full bg-white/95 grid place-items-center group-hover:scale-110 transition-transform shadow-2xl"
            aria-hidden="true"
          >
            <Play className="h-8 w-8 text-violet-deep fill-current ml-1" />
          </span>
          <div className="absolute bottom-0 inset-x-0 p-6 bg-linear-to-t from-black/80 to-transparent">
            <p className="text-xs font-semibold tracking-widest uppercase text-gold">
              Ahora en vivo
            </p>
            <p className="text-xl font-bold text-white">{title}</p>
            {program?.description ? (
              <p className="mt-1 text-sm text-white/75 line-clamp-2">{program.description}</p>
            ) : null}
          </div>
        </button>
      )}
    </div>
  );
}
