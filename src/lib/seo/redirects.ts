/**
 * Redirecciones 301 desde URLs del sitio WordPress anterior.
 * Se aplican en Vercel vía vercel.json al publicar en enlacecolombia.org.
 */
export const LEGACY_REDIRECTS = [
  { source: "/maratonica/", destination: "/maratonica" },
  { source: "/contactenos/registro-web/", destination: "/registro-web" },
  { source: "/contactenos/registro-web", destination: "/registro-web" },
  { source: "/reflexiones/", destination: "/reflexiones" },
  { source: "/privacidad/", destination: "/privacidad" },
  { source: "/terminos/", destination: "/terminos" },
  { source: "/cookies/", destination: "/cookies" },
] as const;
