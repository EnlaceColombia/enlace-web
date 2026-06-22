import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Loader2, Trash2, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRequireAdmin } from "@/lib/admin/use-require-admin";
import {
  createAdminUser,
  listAdminUsers,
  removeAdminUser,
  type AdminUserSummary,
} from "@/lib/api/admin-users.functions";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export const Route = createFileRoute("/admin/usuarios")({
  component: AdminUsuariosPage,
});

function formatAdminDate(iso: string) {
  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

function AdminUsuariosPage() {
  const { loading, userId } = useRequireAdmin();
  const [admins, setAdmins] = useState<AdminUserSummary[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [creating, setCreating] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getAccessToken = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    const { data, error: sessionError } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (sessionError || !token) {
      throw new Error("Sesión expirada. Vuelve a iniciar sesión.");
    }
    return token;
  }, []);

  const loadAdmins = useCallback(async () => {
    setLoadingData(true);
    setError(null);

    try {
      const accessToken = await getAccessToken();
      const rows = await listAdminUsers({ data: { accessToken } });
      setAdmins(rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cargar la lista.");
    } finally {
      setLoadingData(false);
    }
  }, [getAccessToken]);

  useEffect(() => {
    if (!userId) return;
    void loadAdmins();
  }, [userId, loadAdmins]);

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setCreating(true);

    try {
      const accessToken = await getAccessToken();
      const created = await createAdminUser({
        data: {
          accessToken,
          email: email.trim(),
          password,
        },
      });

      setMessage(`«${created.email}» ya puede entrar al panel con ese correo y contraseña.`);
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      await loadAdmins();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear el administrador.");
    } finally {
      setCreating(false);
    }
  }

  async function handleRemove(targetUserId: string, targetEmail: string) {
    if (!confirm(`¿Quitar acceso de administrador a «${targetEmail}»?`)) return;

    setRemovingId(targetUserId);
    setMessage(null);
    setError(null);

    try {
      const accessToken = await getAccessToken();
      await removeAdminUser({ data: { accessToken, userId: targetUserId } });
      setMessage(`Se quitó el acceso de «${targetEmail}».`);
      await loadAdmins();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo quitar el administrador.");
    } finally {
      setRemovingId(null);
    }
  }

  if (loading || loadingData) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        Cargando administradores…
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold text-foreground">Equipo del panel</h2>
        <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
          Invita a otras personas para que publiquen contenido, testimonios y documentos sin depender
          de herramientas técnicas.
        </p>
      </div>

      {message && (
        <p className="text-sm text-violet" role="status">
          {message}
        </p>
      )}
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h3 className="text-lg font-bold text-foreground">Equipo con acceso</h3>
          <ul className="mt-4 space-y-3">
            {admins.map((admin) => {
              const isSelf = admin.userId === userId;
              return (
                <li
                  key={admin.userId}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border px-4 py-3"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {admin.email}
                      {isSelf ? (
                        <span className="ml-2 text-xs font-semibold text-violet">(tú)</span>
                      ) : null}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Desde {formatAdminDate(admin.createdAt)}
                    </p>
                  </div>
                  {!isSelf ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={removingId === admin.userId}
                      onClick={() => void handleRemove(admin.userId, admin.email)}
                    >
                      {removingId === admin.userId ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      Quitar
                    </Button>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h3 className="text-lg font-bold text-foreground">Nuevo acceso</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Crea el correo y una contraseña temporal. Compártelos con la persona para que entre al
            panel de administración.
          </p>

          <form onSubmit={(e) => void handleCreate(e)} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-email">Correo</Label>
              <Input
                id="admin-email"
                type="email"
                autoComplete="off"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nombre@enlacecolombia.org"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password">Contraseña temporal</Label>
              <Input
                id="admin-password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password-confirm">Confirmar contraseña</Label>
              <Input
                id="admin-password-confirm"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <Button type="submit" className="surface-violet text-white w-full sm:w-auto" disabled={creating}>
              {creating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <UserPlus className="h-4 w-4" />
              )}
              Crear acceso
            </Button>
          </form>
        </section>
      </div>
    </div>
  );
}
