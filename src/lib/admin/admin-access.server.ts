import process from "node:process";

import { createClient } from "@supabase/supabase-js";

import { createSupabaseServiceClient } from "@/lib/supabase/service";
import type { Database } from "@/lib/supabase/database.types";

function getSupabaseUrl() {
  return process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL;
}

function getSupabaseAnonKey() {
  return (
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    process.env.SUPABASE_PUBLISHABLE_KEY
  );
}

export async function assertAdminAccess(accessToken: string) {
  const url = getSupabaseUrl();
  const anonKey = getSupabaseAnonKey();

  if (!url || !anonKey) {
    throw new Error("Supabase no configurado en el servidor.");
  }

  const authClient = createClient<Database>(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const {
    data: { user },
    error,
  } = await authClient.auth.getUser(accessToken);

  if (error || !user) {
    throw new Error("Sesión inválida o expirada. Vuelve a iniciar sesión.");
  }

  const service = createSupabaseServiceClient();
  const { data: adminRow, error: adminError } = await service
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (adminError || !adminRow) {
    throw new Error("No tienes permisos de administrador.");
  }

  return user;
}
