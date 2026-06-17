import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminSession } from "@/lib/admin/admin-session-context";

export const Route = createFileRoute("/admin/")({
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const { loading, user, isAdmin, signIn } = useAdminSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user && isAdmin) {
      navigate({ to: "/admin/dashboard" });
    }
  }, [loading, user, isAdmin, navigate]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await signIn(email.trim(), password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar sesión.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        Verificando acceso…
      </div>
    );
  }

  if (user && !isAdmin) {
    return (
      <div className="max-w-md mx-auto rounded-2xl border border-border bg-card p-8 shadow-card">
        <h2 className="text-xl font-bold text-foreground">Sin permisos</h2>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          Tu cuenta no está autorizada para el backoffice. Pide a un administrador que te agregue en
          la tabla <code className="text-violet">admin_users</code> de Supabase.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="rounded-2xl border border-border bg-card p-8 shadow-card">
        <p className="text-xs font-semibold tracking-widest uppercase text-violet">Backoffice</p>
        <h2 className="mt-2 text-2xl font-extrabold text-foreground">Iniciar sesión</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Acceso restringido al equipo de Enlace Colombia.
        </p>

        <form onSubmit={(e) => void handleSubmit(e)} className="mt-8 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full surface-violet text-white" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Entrando…
              </>
            ) : (
              "Entrar"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
