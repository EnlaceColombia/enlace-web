/** Enlaces públicos a catálogos y búsquedas en Enlace+. */

export const ENLACE_PLUS_BASE = "https://enlace.plus";

/** Explorar todos los programas (mismo destino que el menú de Enlace+). */
export const ENLACE_PLUS_PROGRAMS = `${ENLACE_PLUS_BASE}/search-v2?format=program`;

/** Catálogo publicado en Enlace+ (IDs desde api.enlace.plus/api/v2/catalog/published). */
type EnlacePlusCatalog = {
  id: string;
  name: string;
  contentType: "program" | "video" | "article";
};

const catalogs = {
  predicas: {
    id: "5cff7200-20c6-4e9d-b046-31c3efca9389",
    name: "Prédicas",
    contentType: "program",
  },
  infantiles: {
    id: "541576bc-8c65-4057-8e9a-7317d99da416",
    name: "Infantiles",
    contentType: "program",
  },
  juvenil: {
    id: "7d632783-373b-44b0-810d-a69cefd45911",
    name: "Juvenil",
    contentType: "program",
  },
  familia: {
    id: "807b097d-bf8f-4fa1-b905-9d8e6ece1950",
    name: "Padres que dejan legado",
    contentType: "video",
  },
  musica: {
    id: "f7aebadd-b57b-41dd-ae85-f1f6bad3b2fd",
    name: "Música",
    contentType: "video",
  },
  originales: {
    id: "e160bb64-05f4-45b7-9500-0b9fd1988d4b",
    name: "ORIGINALES ENLACE",
    contentType: "program",
  },
  bibleProject: {
    id: "e4e80d40-b450-4288-b529-b1fad323f51c",
    name: "BibleProject",
    contentType: "program",
  },
} as const satisfies Record<string, EnlacePlusCatalog>;

/** Página de catálogo en Enlace+ (misma ruta que usa el slider «ver más»). */
export function enlacePlusCatalogUrl(catalog: EnlacePlusCatalog): string {
  const name = encodeURIComponent(catalog.name.trim());
  return `${ENLACE_PLUS_BASE}/catalog/${catalog.contentType}/${catalog.id}/content?name=${name}`;
}

/** Búsqueda de programas en Enlace+. */
export function enlacePlusProgramSearch(query: string): string {
  const params = new URLSearchParams({ format: "program", q: query });
  return `${ENLACE_PLUS_BASE}/search-v2?${params}`;
}

export const ENLACE_PLUS_LINKS = {
  programs: ENLACE_PLUS_PROGRAMS,
  predicas: enlacePlusCatalogUrl(catalogs.predicas),
  ninos: enlacePlusCatalogUrl(catalogs.infantiles),
  jovenes: enlacePlusCatalogUrl(catalogs.juvenil),
  familia: enlacePlusCatalogUrl(catalogs.familia),
  musica: enlacePlusCatalogUrl(catalogs.musica),
  enlacePlus: enlacePlusCatalogUrl(catalogs.originales),
  biblia: enlacePlusCatalogUrl(catalogs.bibleProject),
  bibliaInteractiva: `${ENLACE_PLUS_BASE}/bible`,
  enCasaCon: enlacePlusProgramSearch("en casa con"),
  salmo23: enlacePlusProgramSearch("salmo 23"),
} as const;
