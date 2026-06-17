import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { applyAnalyticsConsent, getStoredConsent, saveConsent } from "@/lib/consent-storage";
import { cn } from "@/lib/utils";

export function ConsentNotice() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    setMounted(true);

    const stored = getStoredConsent();
    if (stored) {
      applyAnalyticsConsent(stored.analytics);
    } else {
      setVisible(true);
    }

    const openSettings = () => {
      const current = getStoredConsent();
      setAnalytics(current?.analytics ?? false);
      setShowSettings(true);
      setVisible(true);
    };

    window.addEventListener("enlace:open-consent-settings", openSettings);
    return () => window.removeEventListener("enlace:open-consent-settings", openSettings);
  }, []);

  function closeNotice() {
    setVisible(false);
    setShowSettings(false);
  }

  function acceptAll() {
    saveConsent(true);
    closeNotice();
  }

  function rejectOptional() {
    saveConsent(false);
    closeNotice();
  }

  function savePreferences() {
    saveConsent(analytics);
    closeNotice();
  }

  if (!mounted || !visible) return null;

  return createPortal(
    <div
      role="dialog"
      aria-labelledby="consent-notice-title"
      aria-describedby="consent-notice-desc"
      className="fixed bottom-4 left-4 z-100 w-[min(calc(100vw-2rem),20rem)] sm:w-80"
    >
      <div className="rounded-2xl border border-border bg-background p-4 shadow-[0_16px_40px_-12px_rgba(26,8,64,0.35)]">
        {!showSettings ? (
          <>
            <p id="consent-notice-title" className="text-sm font-bold text-foreground">
              Cookies
            </p>
            <p
              id="consent-notice-desc"
              className="mt-2 text-xs text-muted-foreground leading-relaxed"
            >
              Usamos cookies necesarias y, si usted acepta, cookies analíticas para mejorar el
              sitio.{" "}
              <a href="/cookies" className="text-violet font-medium hover:underline">
                Ver política
              </a>
            </p>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={rejectOptional}
                className="inline-flex h-9 flex-1 items-center justify-center rounded-full border border-border bg-background text-xs font-semibold text-foreground hover:bg-secondary transition"
              >
                Rechazar
              </button>
              <button
                type="button"
                onClick={acceptAll}
                className="inline-flex h-9 flex-1 items-center justify-center rounded-full surface-violet text-xs font-semibold"
              >
                Aceptar
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowSettings(true)}
              className="mt-3 w-full text-center text-[11px] font-medium text-muted-foreground hover:text-violet transition"
            >
              Configurar preferencias
            </button>
          </>
        ) : (
          <>
            <p className="text-sm font-bold text-foreground">Preferencias</p>
            <p className="mt-1.5 text-xs text-muted-foreground">
              Las cookies necesarias siempre están activas.
            </p>

            <label
              className={cn(
                "mt-3 flex cursor-pointer items-start gap-2.5 rounded-xl border p-3 transition",
                analytics ? "border-violet bg-violet/5" : "border-border",
              )}
            >
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
                className="mt-0.5 accent-[#47009B]"
              />
              <span>
                <span className="block text-xs font-semibold text-foreground">
                  Cookies analíticas
                </span>
                <span className="mt-0.5 block text-[11px] text-muted-foreground leading-relaxed">
                  Estadísticas anónimas de visitas (p. ej. Google Analytics).
                </span>
              </span>
            </label>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setShowSettings(false)}
                className="inline-flex h-9 flex-1 items-center justify-center rounded-full border border-border text-xs font-semibold hover:bg-secondary transition"
              >
                Volver
              </button>
              <button
                type="button"
                onClick={savePreferences}
                className="inline-flex h-9 flex-1 items-center justify-center rounded-full surface-violet text-xs font-semibold"
              >
                Guardar
              </button>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}

export function openConsentSettings() {
  window.dispatchEvent(new CustomEvent("enlace:open-consent-settings"));
}
