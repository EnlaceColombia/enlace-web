import process from "node:process";

import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/database.types";

function getSupabaseUrl() {
  return process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL;
}

function getSupabaseServiceKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;
}

export function isSupabaseServiceRoleConfigured() {
  return Boolean(getSupabaseUrl() && getSupabaseServiceKey());
}

/** Cliente con privilegios elevados — solo en el servidor. */
export function createSupabaseServiceClient() {
  const url = getSupabaseUrl();
  const key = getSupabaseServiceKey();

  if (!url || !key) {
    throw new Error(
      "Falta la clave secreta de Supabase en el servidor (SUPABASE_SERVICE_ROLE_KEY o SUPABASE_SECRET_KEY).",
    );
  }

  return createClient<Database>(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
