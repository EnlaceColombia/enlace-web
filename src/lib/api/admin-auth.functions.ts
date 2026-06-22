import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

import {
  assertLoginNotLocked,
  clearLoginFailures,
  delayLoginResponse,
  getLoginLockStatus,
  recordLoginFailure,
} from "@/lib/admin/login-rate-limit.server";
import type { Database } from "@/lib/supabase/database.types";

const GENERIC_LOGIN_ERROR =
  "Correo o contraseña incorrectos. Verifica tus datos e intenta de nuevo.";

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

const signInInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  honeypot: z.string().optional(),
  formLoadedAt: z.number(),
});

export const getAdminLoginLockStatus = createServerFn({ method: "POST" })
  .inputValidator(z.object({ email: z.string().email() }))
  .handler(async ({ data }) => {
    return getLoginLockStatus(data.email.trim().toLowerCase());
  });

export const adminSignIn = createServerFn({ method: "POST" })
  .inputValidator(signInInputSchema)
  .handler(async ({ data }) => {
    const url = getSupabaseUrl();
    const anonKey = getSupabaseAnonKey();

    if (!url || !anonKey) {
      throw new Error("El servicio de acceso no está disponible en este momento.");
    }

    if (data.honeypot?.trim()) {
      await delayLoginResponse();
      throw new Error(GENERIC_LOGIN_ERROR);
    }

    if (Date.now() - data.formLoadedAt < 2_000) {
      await delayLoginResponse();
      throw new Error(GENERIC_LOGIN_ERROR);
    }

    const email = data.email.trim().toLowerCase();
    assertLoginNotLocked(email);

    const supabase = createClient<Database>(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email,
      password: data.password,
    });

    if (error || !authData.session || !authData.user) {
      recordLoginFailure(email);
      await delayLoginResponse();
      throw new Error(GENERIC_LOGIN_ERROR);
    }

    const authedClient = createClient<Database>(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        headers: { Authorization: `Bearer ${authData.session.access_token}` },
      },
    });

    const { data: adminRow, error: adminError } = await authedClient
      .from("admin_users")
      .select("user_id")
      .eq("user_id", authData.user.id)
      .maybeSingle();

    if (adminError || !adminRow) {
      await supabase.auth.signOut();
      recordLoginFailure(email);
      await delayLoginResponse();
      throw new Error(GENERIC_LOGIN_ERROR);
    }

    clearLoginFailures(email);

    return {
      accessToken: authData.session.access_token,
      refreshToken: authData.session.refresh_token,
    };
  });
