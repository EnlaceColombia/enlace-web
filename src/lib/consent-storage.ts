export const CONSENT_STORAGE_KEY = "enlace-cookie-consent-v1";

export type SiteConsent = {
  necessary: true;
  analytics: boolean;
  updatedAt: string;
};

export function getStoredConsent(): SiteConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SiteConsent;
    if (parsed.necessary !== true || typeof parsed.analytics !== "boolean") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function hasConsentChoice(): boolean {
  return getStoredConsent() !== null;
}

export function saveConsent(analytics: boolean): SiteConsent {
  const consent: SiteConsent = {
    necessary: true,
    analytics,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent));
  applyAnalyticsConsent(analytics);
  window.dispatchEvent(new CustomEvent("enlace:consent-saved", { detail: consent }));
  return consent;
}

/** Carga Google Analytics solo si el usuario aceptó analíticas. */
export function applyAnalyticsConsent(analytics: boolean) {
  if (typeof window === "undefined") return;

  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;
  if (!measurementId) return;

  if (!analytics) {
    window[`ga-disable-${measurementId}`] = true;
    return;
  }

  delete window[`ga-disable-${measurementId}`];

  if (window.gtag) {
    window.gtag("consent", "update", { analytics_storage: "granted" });
    return;
  }

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer ?? [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer?.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("consent", "default", { analytics_storage: "granted" });
  window.gtag("config", measurementId, { anonymize_ip: true });
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}
