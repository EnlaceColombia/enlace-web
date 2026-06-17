import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ExternalLink, Loader2, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { BlogMarkdown } from "@/components/blog-markdown";
import { useRequireAdmin } from "@/lib/admin/use-require-admin";
import { mapBlogPostRow, mapBlogPostToRow, slugifyTitle, type BlogPost } from "@/lib/blog/types";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { uploadAdminFile } from "@/lib/supabase/storage";

export const Route = createFileRoute("/admin/blogs/$id")({
  component: AdminBlogEditPage,
});

const emptyPost: Omit<BlogPost, "createdAt" | "updatedAt"> = {
  id: "",
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  coverImageUrl: null,
  published: true,
  publishedAt: null,
};

function AdminBlogEditPage() {
  const { id } = Route.useParams();
  const isNew = id === "nuevo";
  const navigate = useNavigate();
  const { loading, userId, isAdmin } = useRequireAdmin();
  const [form, setForm] = useState(emptyPost);
  const [slugTouched, setSlugTouched] = useState(false);
  const [loadingData, setLoadingData] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isNew || !userId || !isAdmin) return;

    let active = true;

    async function loadPost() {
      setLoadingData(true);
      setError(null);

      try {
        const supabase = getSupabaseBrowserClient();
        const { data, error: fetchError } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (fetchError) throw fetchError;
        if (!data) throw new Error("Entrada no encontrada.");

        if (!active) return;
        setForm(mapBlogPostRow(data));
        setSlugTouched(true);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "No se pudo cargar la entrada.");
      } finally {
        if (active) setLoadingData(false);
      }
    }

    void loadPost();
    return () => {
      active = false;
    };
  }, [id, isNew, userId, isAdmin]);

  async function handleCoverUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const { publicUrl } = await uploadAdminFile("blog-covers", file, "covers");
      setForm((prev) => ({ ...prev, coverImageUrl: publicUrl }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo subir la imagen.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    const slug = form.slug.trim() || slugifyTitle(form.title);
    if (!form.title.trim()) {
      setError("El título es obligatorio.");
      setSaving(false);
      return;
    }
    if (!slug) {
      setError("El slug es obligatorio.");
      setSaving(false);
      return;
    }

    const payload = {
      ...form,
      slug,
      title: form.title.trim(),
      excerpt: form.excerpt.trim(),
      content: form.content.trim(),
      publishedAt: form.published ? (form.publishedAt ?? new Date().toISOString()) : null,
    };

    try {
      const supabase = getSupabaseBrowserClient();
      const row = {
        ...mapBlogPostToRow(payload),
        updated_at: new Date().toISOString(),
      };

      if (isNew) {
        const { data, error: insertError } = await supabase
          .from("blog_posts")
          .insert(row)
          .select("*")
          .single();

        if (insertError) throw insertError;
        setMessage(
          payload.published
            ? "Entrada publicada. Ya visible en /reflexiones."
            : "Entrada guardada como borrador. Activa «Publicado» para que aparezca en el sitio.",
        );
        navigate({ to: "/admin/blogs/$id", params: { id: data.id }, replace: true });
      } else {
        const { error: updateError } = await supabase.from("blog_posts").update(row).eq("id", id);
        if (updateError) throw updateError;
        setForm((prev) => ({ ...payload, id: prev.id }));
        setMessage(
          payload.published
            ? "Cambios guardados. Visible en /reflexiones."
            : "Guardado como borrador. No aparece en el sitio hasta activar «Publicado».",
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar.");
    } finally {
      setSaving(false);
    }
  }

  if (loading || loadingData) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        Cargando entrada…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-foreground">
            {isNew ? "Nueva entrada" : "Editar entrada"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            La entrada publicada aparecerá en /reflexiones.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link to="/admin/blogs">Volver al listado</Link>
          </Button>
          {!isNew && form.published && (
            <Button asChild variant="outline">
              <a href={`/reflexiones/${form.slug}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
                Ver publicada
              </a>
            </Button>
          )}
        </div>
      </div>

      <form onSubmit={(e) => void handleSave(e)} className="space-y-6">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Label htmlFor="published">Publicado</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Debe estar activo para aparecer en el home y en{" "}
                <code className="text-violet">/reflexiones</code>.
              </p>
            </div>
            <Switch
              id="published"
              checked={form.published}
              onCheckedChange={(checked) =>
                setForm((prev) => ({
                  ...prev,
                  published: checked,
                  publishedAt: checked ? (prev.publishedAt ?? new Date().toISOString()) : null,
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              required
              value={form.title}
              onChange={(e) => {
                const title = e.target.value;
                setForm((prev) => ({
                  ...prev,
                  title,
                  slug: slugTouched ? prev.slug : slugifyTitle(title),
                }));
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">URL (slug)</Label>
            <Input
              id="slug"
              required
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true);
                setForm((prev) => ({ ...prev, slug: slugifyTitle(e.target.value) }));
              }}
              placeholder="mi-reflexion"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Resumen</Label>
            <Textarea
              id="excerpt"
              rows={2}
              value={form.excerpt}
              onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value }))}
              placeholder="Breve descripción para tarjetas y SEO"
            />
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4">
          <h3 className="text-sm font-bold tracking-widest uppercase text-violet">
            Imagen de portada
          </h3>
          {form.coverImageUrl && (
            <img
              src={form.coverImageUrl}
              alt=""
              className="w-full max-h-64 object-cover rounded-xl border border-border"
            />
          )}
          <div>
            <Label htmlFor="cover" className="sr-only">
              Subir imagen
            </Label>
            <Input
              id="cover"
              type="file"
              accept="image/*"
              disabled={uploading}
              onChange={(e) => void handleCoverUpload(e)}
            />
            {uploading && (
              <p className="mt-2 text-xs text-muted-foreground flex items-center gap-2">
                <Loader2 className="h-3 w-3 animate-spin" />
                Subiendo imagen…
              </p>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content">Contenido (Markdown)</Label>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Usa <code className="text-violet">**negrita**</code>,{" "}
              <code className="text-violet">*cursiva*</code>,{" "}
              <code className="text-violet">## subtítulo</code>, listas con{" "}
              <code className="text-violet">- item</code> y enlaces{" "}
              <code className="text-violet">[texto](url)</code>.
            </p>
            <Textarea
              id="content"
              rows={14}
              value={form.content}
              onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
              placeholder={`## Introducción

Dios tiene un plan para tu vida.

**Recuerda:** puedes usar *cursiva*, listas y [enlaces](https://enlacecolombia.org).`}
              className="font-mono text-sm"
            />
          </div>
          {form.content.trim() && (
            <div className="rounded-xl border border-border bg-background/60 p-5">
              <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-4">
                Vista previa
              </p>
              <BlogMarkdown content={form.content} />
            </div>
          )}
        </section>

        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        {message && (
          <p className="text-sm text-violet font-medium" role="status">
            {message}
          </p>
        )}

        <Button type="submit" disabled={saving || uploading} className="surface-violet text-white">
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Guardando…
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Guardar entrada
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
