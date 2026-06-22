import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { AdminAuthLayout } from "@/components/admin/admin-auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminSession } from "@/lib/admin/admin-session-context";
import { adminSignIn } from "@/lib/api/admin-auth.functions";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export const Route = createFileRoute("/admin/")({
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const { loading, user, isAdmin, signOut } = useAdminSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const formLoadedAt = useRef(Date.now());

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
      const result = await adminSignIn({
        data: {
          email: email.trim(),
          password,
          honeypot,
          formLoadedAt: formLoadedAt.current,
        },
      });

      const supabase = getSupabaseBrowserClient();
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: result.accessToken,
        refresh_token: result.refreshToken,
      });

      if (sessionError) {
        throw new Error("No se pudo iniciar la sesión. Intenta de nuevo.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar sesión.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <AdminAuthLayout title="Verificando acceso">
        <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Un momento…
        </div>
      </AdminAuthLayout>
    );
  }

  if (user && !isAdmin) {
    return (
      <AdminAuthLayout
        title="Sin permisos"
        description="Tu cuenta no tiene acceso al panel. Pide a un administrador que te invite desde la sección Equipo."
      >
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => void signOut()}
        >
          Cerrar sesión
        </Button>
      </AdminAuthLayout>
    );
  }

  return (
    <AdminAuthLayout
      title="Iniciar sesión"
      description="Ingresa con el correo y contraseña que te compartió el equipo."
    >
      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4" noValidate>
        <div
          className="absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
          aria-hidden
        >
          <label htmlFor="website">Sitio web</label>
          <input
            id="website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Correo</Label>
          <Input
            id="email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={submitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10"
              disabled={submitting}
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {error && (
          <p className="text-sm text-destructive rounded-lg bg-destructive/10 px-3 py-2" role="alert">
            {error}
          </p>
        )}

        <Button
          type="submit"
          className="w-full btn-gold text-violet-deep font-bold h-11"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Verificando…
            </>
          ) : (
            "Entrar al panel"
          )}
        </Button>
      </form>
    </AdminAuthLayout>
  );
}
