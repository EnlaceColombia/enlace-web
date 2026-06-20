import { getSiteOgImageUrl, getSiteUrl, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

type SeoHeadOptions = {
  /** Ruta pública, ej. `/maratonica` */
  path: string;
  title: string;
  description?: string;
};

/** Meta + canonical para páginas públicas. */
export function buildPublicPageHead({ path, title, description }: SeoHeadOptions) {
  const siteUrl = getSiteUrl();
  const canonicalPath = path === "/" ? "/" : path.replace(/\/$/, "");
  const canonical = canonicalPath === "/" ? `${siteUrl}/` : `${siteUrl}${canonicalPath}`;
  const desc = description ?? SITE_DESCRIPTION;

  return {
    meta: [
      { title },
      { name: "description", content: desc },
      { property: "og:title", content: title },
      { property: "og:description", content: desc },
      { property: "og:url", content: canonical },
      { property: "og:type", content: "website" },
      { property: "og:image", content: getSiteOgImageUrl() },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: desc },
      { name: "twitter:image", content: getSiteOgImageUrl() },
    ],
    links: [{ rel: "canonical", href: canonical }],
  };
}

export function buildOrganizationJsonLd() {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: siteUrl,
    logo: `${siteUrl}/favicon.png`,
    sameAs: [
      "https://www.facebook.com/enlacecolombia",
      "https://www.instagram.com/enlacecolombia",
      "https://www.youtube.com/enlacecolombia",
    ],
  };
}
