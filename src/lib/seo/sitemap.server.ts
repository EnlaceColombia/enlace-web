import { getSiteUrl } from "@/lib/site";
import { createSupabaseServerClient, isSupabaseServerConfigured } from "@/lib/supabase/server";

export type SitemapEntry = {
  loc: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
};

/** Rutas estáticas indexables (excluye /admin). */
export const STATIC_SITEMAP_PATHS: Array<Pick<SitemapEntry, "loc" | "changefreq" | "priority">> = [
  { loc: "/", changefreq: "daily", priority: 1 },
  { loc: "/maratonica", changefreq: "weekly", priority: 0.9 },
  { loc: "/registro-web", changefreq: "monthly", priority: 0.85 },
  { loc: "/reflexiones", changefreq: "weekly", priority: 0.8 },
  { loc: "/privacidad", changefreq: "yearly", priority: 0.3 },
  { loc: "/terminos", changefreq: "yearly", priority: 0.3 },
  { loc: "/cookies", changefreq: "yearly", priority: 0.3 },
];

function formatSitemapDate(iso: string) {
  return iso.slice(0, 10);
}

function absoluteUrl(path: string) {
  const base = getSiteUrl();
  if (path === "/") return `${base}/`;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function getSitemapEntries(): Promise<SitemapEntry[]> {
  const today = formatSitemapDate(new Date().toISOString());
  const entries: SitemapEntry[] = STATIC_SITEMAP_PATHS.map((page) => ({
    ...page,
    loc: absoluteUrl(page.loc),
    lastmod: today,
  }));

  if (!isSupabaseServerConfigured()) return entries;

  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("slug, updated_at, published_at")
      .eq("published", true)
      .order("published_at", { ascending: false });

    if (error) throw error;

    for (const post of data ?? []) {
      entries.push({
        loc: absoluteUrl(`/reflexiones/${post.slug}`),
        lastmod: formatSitemapDate(post.updated_at ?? post.published_at ?? today),
        changefreq: "monthly",
        priority: 0.7,
      });
    }
  } catch (error) {
    console.error("sitemap: no se pudieron cargar entradas del blog", error);
  }

  return entries;
}

export function buildSitemapXml(entries: SitemapEntry[]) {
  const urls = entries
    .map((entry) => {
      const parts = [
        "  <url>",
        `    <loc>${escapeXml(entry.loc)}</loc>`,
        entry.lastmod ? `    <lastmod>${entry.lastmod}</lastmod>` : "",
        entry.changefreq ? `    <changefreq>${entry.changefreq}</changefreq>` : "",
        entry.priority != null ? `    <priority>${entry.priority.toFixed(1)}</priority>` : "",
        "  </url>",
      ];
      return parts.filter(Boolean).join("\n");
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function buildRobotsTxt() {
  const siteUrl = getSiteUrl();

  return `User-agent: *
Allow: /

Disallow: /admin
Disallow: /admin/

Sitemap: ${siteUrl}/sitemap.xml
`;
}
