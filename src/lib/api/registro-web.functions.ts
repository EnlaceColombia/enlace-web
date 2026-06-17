import { createServerFn } from "@tanstack/react-start";

import {
  DEFAULT_REGISTRO_WEB_CONFIG,
  mapRegistroWebConfigRow,
  mapRegistroWebDocumentRow,
  type RegistroWebConfig,
  type RegistroWebDocument,
} from "@/lib/registro-web/types";
import { createSupabaseServerClient, isSupabaseServerConfigured } from "@/lib/supabase/server";

export type RegistroWebPageData = {
  config: RegistroWebConfig;
  documents: RegistroWebDocument[];
};

export const getRegistroWebPageData = createServerFn({ method: "GET" }).handler(async () => {
  if (!isSupabaseServerConfigured()) {
    return {
      config: DEFAULT_REGISTRO_WEB_CONFIG,
      documents: [],
    } satisfies RegistroWebPageData;
  }

  const supabase = createSupabaseServerClient();

  const [{ data: configRow }, { data: documents }] = await Promise.all([
    supabase.from("registro_web_config").select("*").eq("id", 1).maybeSingle(),
    supabase
      .from("registro_web_documents")
      .select("*")
      .eq("enabled", true)
      .order("sort_order", { ascending: true }),
  ]);

  return {
    config: configRow ? mapRegistroWebConfigRow(configRow) : DEFAULT_REGISTRO_WEB_CONFIG,
    documents: (documents ?? []).map(mapRegistroWebDocumentRow),
  } satisfies RegistroWebPageData;
});
