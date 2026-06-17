import { useState, type ImgHTMLAttributes } from "react";
import { Clock, Radio } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ScheduleData, ScheduleSlot } from "@/lib/site";
import { cn } from "@/lib/utils";

function formatHour(hour: string) {
  const [h, m] = hour.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

function ScheduleThumb({ program, className }: { program: ScheduleSlot; className?: string }) {
  const [src, setSrc] = useState(program.imageUrl);

  return (
    <img
      src={src}
      alt=""
      className={cn("object-cover bg-secondary", className)}
      loading="lazy"
      onError={() => {
        if (src !== program.thumbUrl) setSrc(program.thumbUrl);
      }}
    />
  );
}

type ScheduleModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schedule: ScheduleData | null;
};

export function ScheduleModal({ open, onOpenChange, schedule }: ScheduleModalProps) {
  if (!schedule) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(90vh,820px)] max-w-2xl gap-0 overflow-hidden p-0 sm:rounded-2xl">
        <DialogHeader className="border-b border-border px-6 py-5 pr-14 text-left">
          <DialogTitle className="text-2xl font-extrabold text-foreground">
            Programación de hoy
          </DialogTitle>
          <DialogDescription className="text-base">
            {schedule.dayLabel} · Horario Enlace TV (zona Colombia)
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[min(70vh,640px)] overflow-y-auto px-4 py-4 sm:px-6">
          <ul className="space-y-2">
            {schedule.today.map((slot) => {
              const isLive =
                slot.hour === schedule.live.hour &&
                slot.title === schedule.live.title &&
                slot.programId === schedule.live.programId;

              return (
                <li
                  key={`${slot.hour}-${slot.title}`}
                  className={cn(
                    "flex gap-4 rounded-2xl border p-3 transition-colors",
                    isLive
                      ? "border-violet bg-violet/5 shadow-glow-violet"
                      : "border-border bg-card hover:bg-secondary/50",
                  )}
                >
                  <ScheduleThumb program={slot} className="h-16 w-16 shrink-0 rounded-xl" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-sm font-bold text-violet">
                        <Clock className="h-3.5 w-3.5" />
                        {formatHour(slot.hour)}
                      </span>
                      {isLive ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                          <span className="h-1.5 w-1.5 rounded-full bg-white live-dot" />
                          En vivo
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 font-semibold text-foreground">{slot.title}</p>
                    {slot.description ? (
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {slot.description}
                      </p>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="border-t border-border px-6 py-4">
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <Radio className="h-3.5 w-3.5 text-violet" />
            Programación sincronizada con enlace plus
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function LiveProgramImage({
  program,
  fallbackSrc,
  alt,
  className,
  ...props
}: {
  program: ScheduleSlot | null;
  fallbackSrc: string;
  alt: string;
  className?: string;
} & Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt">) {
  const candidates = program ? [program.imageUrl, program.thumbUrl, fallbackSrc] : [fallbackSrc];
  const [index, setIndex] = useState(0);

  return (
    <img
      src={candidates[index]}
      alt={alt}
      className={className}
      loading="eager"
      decoding="async"
      {...props}
      onError={(event) => {
        if (index < candidates.length - 1) {
          setIndex(index + 1);
        }
        props.onError?.(event);
      }}
    />
  );
}

export function formatSchedulePreviewLabel(hour: string) {
  return `Hoy ${hour.slice(0, 5)}`;
}
