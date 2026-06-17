import { Link, Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";

import { AdminNav } from "@/components/admin/admin-nav";
import { Button } from "@/components/ui/button";
import { AdminSessionProvider, useAdminSession } from "@/lib/admin/admin-session-context";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ name: "robots", content: "noindex, nofollow" }],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <AdminSessionProvider>
      <AdminLayoutContent />
    </AdminSessionProvider>
  );
}

function AdminLayoutContent() {
  const navigate = useNavigate();
  const { loading, configured, user, isAdmin, signOut } = useAdminSession();

  async function handleSignOut() {
    await signOut();
    navigate({ to: "/admin" });
  }

  if (!configured) {
    return (
      <AdminShell showNav={false}>
        <div className="max-w-lg mx-auto rounded-2xl border border-border bg-card p-8 shadow-card">
          <h1 className="text-xl font-bold text-foreground">Backoffice no configurado</h1>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Agrega <code className="text-violet">VITE_SUPABASE_URL</code> y{" "}
            <code className="text-violet">VITE_SUPABASE_PUBLISHABLE_KEY</code> en tu archivo{" "}
            <code className="text-violet">.env</code> y reinicia el servidor de desarrollo.
          </p>
        </div>
      </AdminShell>
    );
  }

  if (loading) {
    return (
      <AdminShell showNav={false}>
        <p className="text-sm text-muted-foreground">Cargando sesión…</p>
      </AdminShell>
    );
  }

  if (!user || !isAdmin) {
    return (
      <AdminShell showNav={false}>
        <Outlet />
      </AdminShell>
    );
  }

  return (
    <AdminShell showNav>
      <header className="border-b border-white/10 surface-hero">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-gold">Backoffice</p>
            <h1 className="text-lg font-bold text-white">Enlace Colombia</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <AdminNav />
            <Button
              type="button"
              variant="secondary"
              className="bg-white/10 text-white border-0 hover:bg-white/20"
              onClick={() => void handleSignOut()}
            >
              <LogOut className="h-4 w-4" />
              Salir
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <Outlet />
      </main>
    </AdminShell>
  );
}

function AdminShell({ children, showNav }: { children: React.ReactNode; showNav: boolean }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <div className="flex-1">{children}</div>
      <footer className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        <Link to="/" className="hover:text-violet transition">
          Volver al sitio público
        </Link>
        {showNav && (
          <>
            {" · "}
            <Link to="/admin/dashboard" className="hover:text-violet transition">
              Panel de control
            </Link>
          </>
        )}
      </footer>
    </div>
  );
}
