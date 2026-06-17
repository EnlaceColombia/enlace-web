import { createServerFn } from "@tanstack/react-start";

import { getMaratonicaConfig } from "../maratonica-config.server";
import type { MaratonicaConfig } from "../maratonica/types";

/** Configuración de Maratónica para la página pública (desde env / futuro backoffice). */
export const getMaratonicaPageConfig = createServerFn({ method: "GET" }).handler(
  async (): Promise<MaratonicaConfig> => getMaratonicaConfig(),
);
