import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { assertAdminAccess } from "@/lib/admin/admin-access.server";
import {
  createSupabaseServiceClient,
  isSupabaseServiceRoleConfigured,
} from "@/lib/supabase/service";

const accessTokenSchema = z.object({
  accessToken: z.string().min(1),
});

export type AdminUserSummary = {
  userId: string;
  email: string;
  createdAt: string;
};

export const listAdminUsers = createServerFn({ method: "POST" })
  .inputValidator(accessTokenSchema)
  .handler(async ({ data }): Promise<AdminUserSummary[]> => {
    await assertAdminAccess(data.accessToken);

    const service = createSupabaseServiceClient();
    const { data: rows, error } = await service
      .from("admin_users")
      .select("user_id, email, created_at")
      .order("created_at", { ascending: true });

    if (error) throw new Error(error.message);

    return (rows ?? []).map((row) => ({
      userId: row.user_id,
      email: row.email,
      createdAt: row.created_at,
    }));
  });

export const createAdminUser = createServerFn({ method: "POST" })
  .inputValidator(
    accessTokenSchema.extend({
      email: z.string().email("Correo inválido"),
      password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
    }),
  )
  .handler(async ({ data }) => {
    if (!isSupabaseServiceRoleConfigured()) {
      console.error("admin_users: falta clave secreta de Supabase en el servidor.");
      throw new Error(
        "No se pudo crear el acceso en este momento. Si el problema continúa, contacta al soporte técnico del sitio.",
      );
    }

    await assertAdminAccess(data.accessToken);
    const service = createSupabaseServiceClient();
    const email = data.email.trim().toLowerCase();

    const { data: authData, error: authError } = await service.auth.admin.createUser({
      email,
      password: data.password,
      email_confirm: true,
    });

    if (authError) {
      throw new Error(authError.message);
    }

    if (!authData.user) {
      throw new Error("No se pudo crear el usuario.");
    }

    const { error: insertError } = await service.from("admin_users").insert({
      user_id: authData.user.id,
      email,
    });

    if (insertError) {
      await service.auth.admin.deleteUser(authData.user.id);
      throw new Error(insertError.message);
    }

    return {
      userId: authData.user.id,
      email,
    };
  });

export const removeAdminUser = createServerFn({ method: "POST" })
  .inputValidator(
    accessTokenSchema.extend({
      userId: z.string().uuid(),
    }),
  )
  .handler(async ({ data }) => {
    if (!isSupabaseServiceRoleConfigured()) {
      console.error("admin_users: falta clave secreta de Supabase en el servidor.");
      throw new Error(
        "No se pudo crear el acceso en este momento. Si el problema continúa, contacta al soporte técnico del sitio.",
      );
    }

    const currentUser = await assertAdminAccess(data.accessToken);

    if (currentUser.id === data.userId) {
      throw new Error("No puedes quitar tu propio acceso de administrador.");
    }

    const service = createSupabaseServiceClient();

    const { error: deleteRowError } = await service
      .from("admin_users")
      .delete()
      .eq("user_id", data.userId);

    if (deleteRowError) throw new Error(deleteRowError.message);

    const { error: deleteAuthError } = await service.auth.admin.deleteUser(data.userId);
    if (deleteAuthError) {
      console.error("admin_users: usuario quitado de admin_users pero Auth falló:", deleteAuthError);
    }

    return { ok: true as const };
  });
