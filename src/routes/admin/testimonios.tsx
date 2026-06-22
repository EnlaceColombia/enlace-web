import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useRequireAdmin } from "@/lib/admin/use-require-admin";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  mapTestimonialRow,
  mapTestimonialToRow,
  type Testimonial,
} from "@/lib/testimonials/types";

export const Route = createFileRoute("/admin/testimonios")({
  component: AdminTestimoniosPage,
});

function emptyTestimonial(sortOrder: number): Omit<Testimonial, "id" | "createdAt" | "updatedAt"> {
  return {
    name: "",
    place: "",
    text: "",
    sortOrder,
    enabled: true,
  };
}

function AdminTestimoniosPage() {
  const { loading, userId, isAdmin } = useRequireAdmin();
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || !isAdmin) return;

    let active = true;

    async function loadItems() {
      setLoadingData(true);
      setError(null);

      try {
        const supabase = getSupabaseBrowserClient();
        const { data, error: fetchError } = await supabase
          .from("testimonials")
          .select("*")
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: false });

        if (fetchError) throw fetchError;
        if (!active) return;
        setItems((data ?? []).map(mapTestimonialRow));
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "No se pudieron cargar los testimonios.");
      } finally {
        if (active) setLoadingData(false);
      }
    }

    void loadItems();
    return () => {
      active = false;
    };
  }, [userId, isAdmin]);

  function updateItem(id: string, patch: Partial<Testimonial>) {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  async function handleSave(item: Testimonial) {
    if (!item.name.trim() || !item.text.trim()) {
      setError("Nombre y testimonio son obligatorios.");
      return;
    }

    setSavingId(item.id);
    setMessage(null);
    setError(null);

    try {
      const supabase = getSupabaseBrowserClient();
      const row = {
        ...mapTestimonialToRow(item),
        updated_at: new Date().toISOString(),
      };

      const { error: updateError } = await supabase
        .from("testimonials")
        .update(row)
        .eq("id", item.id);

      if (updateError) throw updateError;
      setMessage(`Testimonio de «${item.name}» guardado.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar.");
    } finally {
      setSavingId(null);
    }
  }

  async function handleAdd() {
    setError(null);
    setMessage(null);

    try {
      const supabase = getSupabaseBrowserClient();
      const nextOrder = items.length > 0 ? Math.max(...items.map((i) => i.sortOrder)) + 1 : 1;
      const draft = emptyTestimonial(nextOrder);

      const { data, error: insertError } = await supabase
        .from("testimonials")
        .insert(mapTestimonialToRow(draft))
        .select("*")
        .single();

      if (insertError) throw insertError;
      setItems((prev) => [...prev, mapTestimonialRow(data)]);
      setMessage("Nuevo testimonio creado. Completa los campos y guarda.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear el testimonio.");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este testimonio?")) return;

    setDeletingId(id);
    setError(null);

    try {
      const supabase = getSupabaseBrowserClient();
      const { error: deleteError } = await supabase.from("testimonials").delete().eq("id", id);
      if (deleteError) throw deleteError;
      setItems((prev) => prev.filter((item) => item.id !== id));
      setMessage("Testimonio eliminado.");
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
        Cargando testimonios…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-foreground">Testimonios</h2>
          <p className="mt-1 text-sm text-muted-foreground max-w-xl">
            Administra las historias del carrusel en la página de inicio y en Maratónica. Los
            testimonios visibles rotan automáticamente cada pocos segundos.
          </p>
        </div>
        <Button type="button" className="surface-violet text-white" onClick={() => void handleAdd()}>
          <Plus className="h-4 w-4" />
          Nuevo testimonio
        </Button>
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

      {items.some((item) => !item.enabled) && (
        <div className="rounded-xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-foreground">
          Hay testimonios <strong>ocultos</strong> que no aparecen en el carrusel público.
        </div>
      )}

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/60 p-10 text-center">
          <p className="text-muted-foreground">Aún no hay testimonios. Crea el primero.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-card space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-bold text-foreground">
                  {item.name.trim() || "Sin nombre"}
                  {!item.enabled ? (
                    <span className="ml-2 text-xs font-semibold text-gold">· Oculto</span>
                  ) : null}
                </h3>
                <div className="flex items-center gap-2">
                  <Label htmlFor={`enabled-${item.id}`} className="text-sm text-muted-foreground">
                    Visible
                  </Label>
                  <Switch
                    id={`enabled-${item.id}`}
                    checked={item.enabled}
                    onCheckedChange={(enabled) => updateItem(item.id, { enabled })}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={`name-${item.id}`}>Nombre</Label>
                  <Input
                    id={`name-${item.id}`}
                    value={item.name}
                    onChange={(e) => updateItem(item.id, { name: e.target.value })}
                    placeholder="Ej. María González"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`place-${item.id}`}>Contexto</Label>
                  <Input
                    id={`place-${item.id}`}
                    value={item.place}
                    onChange={(e) => updateItem(item.id, { place: e.target.value })}
                    placeholder="Ej. Maratónica · Noviembre 2020"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`text-${item.id}`}>Testimonio</Label>
                <Textarea
                  id={`text-${item.id}`}
                  value={item.text}
                  onChange={(e) => updateItem(item.id, { text: e.target.value })}
                  rows={4}
                  placeholder="Historia o testimonio completo…"
                />
              </div>

              <div className="space-y-2 max-w-32">
                <Label htmlFor={`order-${item.id}`}>Orden</Label>
                <Input
                  id={`order-${item.id}`}
                  type="number"
                  min={0}
                  value={item.sortOrder}
                  onChange={(e) =>
                    updateItem(item.id, { sortOrder: Number.parseInt(e.target.value, 10) || 0 })
                  }
                />
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <Button
                  type="button"
                  className="surface-violet text-white"
                  disabled={savingId === item.id}
                  onClick={() => void handleSave(item)}
                >
                  {savingId === item.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Guardar
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={deletingId === item.id}
                  onClick={() => void handleDelete(item.id)}
                >
                  {deletingId === item.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  Eliminar
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
