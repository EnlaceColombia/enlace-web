import process from "node:process";

import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/database.types";

function getSupabaseUrl() {
  return process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL;
}

function getSupabaseServerKey() {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
    process.env.SUPABASE_ANON_KEY
  );
}

export function isSupabaseServerConfigured() {
  return Boolean(getSupabaseUrl() && getSupabaseServerKey());
}

export function createSupabaseServerClient() {
  const url = getSupabaseUrl();
  const key = getSupabaseServerKey();

  if (!url || !key) {
    throw new Error("Supabase no configurado en el servidor (URL o clave faltante).");
  }

  return createClient<Database>(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
