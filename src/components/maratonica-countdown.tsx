import { useEffect, useState } from "react";

type CountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  complete: boolean;
};

function getCountdownParts(targetIso: string, nowMs: number): CountdownParts {
  const target = new Date(targetIso).getTime();
  const diff = Math.max(0, target - nowMs);

  if (Number.isNaN(target)) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, complete: true };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days,
    hours,
    minutes,
    seconds,
    complete: diff === 0,
  };
}

const UNITS = [
  { key: "days", label: "Días" },
  { key: "hours", label: "Horas" },
  { key: "minutes", label: "Minutos" },
  { key: "seconds", label: "Segundos" },
] as const;

type MaratonicaCountdownProps = {
  targetIso: string;
  title?: string;
  variant?: "hero" | "card";
};

export function MaratonicaCountdown({
  targetIso,
  title = "Próxima Maratónica en",
  variant = "hero",
}: MaratonicaCountdownProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const parts = getCountdownParts(targetIso, now);
  const isHero = variant === "hero";

  return (
    <div className={isHero ? "w-full max-w-2xl" : "w-full"}>
      <p
        className={
          isHero
            ? "text-xs font-semibold tracking-widest uppercase text-gold mb-4 text-center sm:text-left"
            : "text-xs font-semibold tracking-widest uppercase text-violet mb-4 text-center"
        }
      >
        {title}
      </p>
      <div
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        role="timer"
        aria-live="polite"
        aria-label={title}
      >
        {UNITS.map(({ key, label }) => (
          <div
            key={key}
            className={
              isHero
                ? "rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 px-3 py-4 sm:px-4 sm:py-5 text-center"
                : "rounded-2xl bg-secondary border border-border px-3 py-4 sm:px-4 sm:py-5 text-center"
            }
          >
            <span
              className={
                isHero
                  ? "block text-3xl sm:text-4xl font-extrabold text-gold tabular-nums leading-none"
                  : "block text-3xl sm:text-4xl font-extrabold text-violet tabular-nums leading-none"
              }
            >
              {String(parts[key]).padStart(2, "0")}
            </span>
            <span
              className={
                isHero
                  ? "mt-2 block text-[10px] sm:text-xs font-semibold tracking-widest uppercase text-white/70"
                  : "mt-2 block text-[10px] sm:text-xs font-semibold tracking-widest uppercase text-muted-foreground"
              }
            >
              {label}
            </span>
          </div>
        ))}
      </div>
      {parts.complete && (
        <p
          className={
            isHero
              ? "mt-4 text-center sm:text-left text-sm font-semibold text-gold"
              : "mt-4 text-center text-sm font-semibold text-violet"
          }
        >
          ¡Es hora de conectarte!
        </p>
      )}
    </div>
  );
}
