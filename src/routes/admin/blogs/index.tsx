import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useRequireAdmin } from "@/lib/admin/use-require-admin";
import { formatBlogDate, mapBlogPostRow, type BlogPost } from "@/lib/blog/types";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export const Route = createFileRoute("/admin/blogs/")({
  component: AdminBlogsPage,
});

function AdminBlogsPage() {
  const { loading, userId, isAdmin } = useRequireAdmin();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || !isAdmin) return;

    let active = true;

    async function loadPosts() {
      setLoadingData(true);
      setError(null);

      try {
        const supabase = getSupabaseBrowserClient();
        const { data, error: fetchError } = await supabase
          .from("blog_posts")
          .select("*")
          .order("updated_at", { ascending: false });

        if (fetchError) throw fetchError;
        if (!active) return;
        setPosts((data ?? []).map(mapBlogPostRow));
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "No se pudieron cargar las entradas.");
      } finally {
        if (active) setLoadingData(false);
      }
    }

    void loadPosts();
    return () => {
      active = false;
    };
  }, [userId, isAdmin]);

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta entrada del blog?")) return;

    setDeletingId(id);
    setError(null);

    try {
      const supabase = getSupabaseBrowserClient();
      const { error: deleteError } = await supabase.from("blog_posts").delete().eq("id", id);
      if (deleteError) throw deleteError;
      setPosts((prev) => prev.filter((post) => post.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar.");
    } finally {
      setDeletingId(null);
    }
  }

  if (loading || loadingData) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        Cargando entradas…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-foreground">Blog / Reflexiones</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Crea artículos con imagen y contenido para la sección pública.
          </p>
        </div>
        <Button asChild className="surface-violet text-white">
          <Link to="/admin/blogs/$id" params={{ id: "nuevo" }}>
            <Plus className="h-4 w-4" />
            Nueva entrada
          </Link>
        </Button>
      </div>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      {posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/60 p-10 text-center">
          <p className="text-muted-foreground">Aún no hay entradas. Crea la primera.</p>
        </div>
      ) : (
        <>
          {posts.some((post) => !post.published) && (
            <div
              className="rounded-xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-foreground mb-4"
              role="status"
            >
              Tienes borradores que <strong>no se ven en el sitio</strong>. Edítalos y activa{" "}
              <strong>Publicado</strong>, luego guarda.
            </div>
          )}
          <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/40 text-left">
                    <th className="px-4 py-3 font-semibold">Título</th>
                    <th className="px-4 py-3 font-semibold hidden sm:table-cell">Estado</th>
                    <th className="px-4 py-3 font-semibold hidden md:table-cell">Actualizado</th>
                    <th className="px-4 py-3 font-semibold text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground">{post.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">/{post.slug}</p>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span
                          className={
                            post.published
                              ? "text-xs font-semibold text-violet"
                              : "text-xs font-semibold text-gold"
                          }
                        >
                          {post.published ? "Publicado · visible" : "Borrador · oculto"}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">
                        {formatBlogDate(post.updatedAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <Button asChild variant="outline" size="sm">
                            <Link to="/admin/blogs/$id" params={{ id: post.id }}>
                              <Pencil className="h-4 w-4" />
                              Editar
                            </Link>
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={deletingId === post.id}
                            onClick={() => void handleDelete(post.id)}
                          >
                            {deletingId === post.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
