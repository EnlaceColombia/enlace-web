import type { RegistroWebConfigRow, RegistroWebDocumentRow } from "@/lib/supabase/database.types";

export type RegistroWebConfig = {
  year: number;
  title: string;
  intro: string;
};

export type RegistroWebDocument = {
  id: string;
  sortOrder: number;
  description: string;
  fileUrl: string | null;
  fileName: string | null;
  enabled: boolean;
};

export const DEFAULT_REGISTRO_WEB_CONFIG: RegistroWebConfig = {
  year: new Date().getFullYear() - 1,
  title: "Actualización, registro web",
  intro: "Documentos de transparencia y cumplimiento normativo (ESAL) publicados para consulta.",
};

export function getRegistroWebPageTitle(config: RegistroWebConfig) {
  return `${config.title} ${config.year}`;
}

export function mapRegistroWebConfigRow(row: RegistroWebConfigRow): RegistroWebConfig {
  return {
    year: row.year,
    title: row.title,
    intro: row.intro,
  };
}

export function mapRegistroWebConfigToRow(config: RegistroWebConfig) {
  return {
    year: config.year,
    title: config.title,
    intro: config.intro,
  };
}

export function mapRegistroWebDocumentRow(row: RegistroWebDocumentRow): RegistroWebDocument {
  return {
    id: row.id,
    sortOrder: row.sort_order,
    description: row.description,
    fileUrl: row.file_url,
    fileName: row.file_name,
    enabled: row.enabled,
  };
}

export function mapRegistroWebDocumentToRow(doc: RegistroWebDocument) {
  return {
    sort_order: doc.sortOrder,
    description: doc.description,
    file_url: doc.fileUrl,
    file_name: doc.fileName,
    enabled: doc.enabled,
  };
}
