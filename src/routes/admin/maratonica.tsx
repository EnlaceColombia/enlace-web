import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ExternalLink, Loader2, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useRequireAdmin } from "@/lib/admin/use-require-admin";
import { DEFAULT_MARATONICA_CONFIG, type MaratonicaConfig } from "@/lib/maratonica/types";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  fromDatetimeLocalValue,
  mapMaratonicaConfigToRow,
  mapMaratonicaRow,
  toDatetimeLocalValue,
} from "@/lib/supabase/maratonica-map";

export const Route = createFileRoute("/admin/maratonica")({
  component: AdminMaratonicaPage,
});

function AdminMaratonicaPage() {
  const { loading, userId, isAdmin } = useRequireAdmin();
  const [form, setForm] = useState<MaratonicaConfig>(DEFAULT_MARATONICA_CONFIG);
  const [countdownLocal, setCountdownLocal] = useState("");
  const [eventEndLocal, setEventEndLocal] = useState("");
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || !isAdmin) return;

    let active = true;

    async function loadConfig() {
      setLoadingData(true);
      setError(null);

      try {
        const supabase = getSupabaseBrowserClient();
        const { data, error: fetchError } = await supabase
          .from("maratonica_config")
          .select("*")
          .eq("id", 1)
          .maybeSingle();

        if (!active) return;
        if (fetchError) throw fetchError;
        if (!data) throw new Error("No hay configuración de Maratónica. Ejecuta la migración SQL.");

        const mapped = mapMaratonicaRow(data);
        setForm(mapped);
        setCountdownLocal(toDatetimeLocalValue(mapped.countdownAt));
        setEventEndLocal(toDatetimeLocalValue(mapped.eventEndAt));
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "No se pudo cargar la configuración.");
      } finally {
        if (active) setLoadingData(false);
      }
    }

    void loadConfig();

    return () => {
      active = false;
    };
  }, [userId, isAdmin]);

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const payload: MaratonicaConfig = {
        ...form,
        countdownAt: fromDatetimeLocalValue(countdownLocal),
        eventEndAt: fromDatetimeLocalValue(eventEndLocal),
      };

      const supabase = getSupabaseBrowserClient();
      const { error: updateError } = await supabase
        .from("maratonica_config")
        .update({
          ...mapMaratonicaConfigToRow(payload),
          updated_at: new Date().toISOString(),
        })
        .eq("id", 1);

      if (updateError) throw updateError;

      setForm(payload);
      setMessage("Cambios guardados. La página pública usará estos datos al recargar.");
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
        Cargando configuración…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-foreground">Maratónica</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Controla fechas, textos y contador de la página pública.
          </p>
        </div>
        <Button asChild variant="outline">
          <a href="/maratonica" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4" />
            Ver página pública
          </a>
        </Button>
      </div>

      <form onSubmit={(e) => void handleSave(e)} className="space-y-6">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Label htmlFor="enabled">Evento activo</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Si está desactivado, la página muestra un aviso sin contador.
              </p>
            </div>
            <Switch
              id="enabled"
              checked={form.enabled}
              onCheckedChange={(checked) => setForm((prev) => ({ ...prev, enabled: checked }))}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="headline">Titular principal</Label>
              <Input
                id="headline"
                value={form.headline}
                onChange={(e) => setForm((prev) => ({ ...prev, headline: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="participation">Participación</Label>
              <Input
                id="participation"
                value={form.participation}
                onChange={(e) => setForm((prev) => ({ ...prev, participation: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eventDateLabel">Texto de fechas (visible)</Label>
              <Input
                id="eventDateLabel"
                value={form.eventDateLabel}
                onChange={(e) => setForm((prev) => ({ ...prev, eventDateLabel: e.target.value }))}
                placeholder="10 al 21 de Febrero 2026"
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4">
          <h3 className="text-sm font-bold tracking-widest uppercase text-violet">Contador</h3>
          <p className="text-xs text-muted-foreground">
            Usa la hora de tu navegador al guardar; se almacena en UTC en la base de datos.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="countdownAt">Inicio (cuenta regresiva hasta aquí)</Label>
              <Input
                id="countdownAt"
                type="datetime-local"
                required
                value={countdownLocal}
                onChange={(e) => setCountdownLocal(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eventEndAt">Fin del evento</Label>
              <Input
                id="eventEndAt"
                type="datetime-local"
                required
                value={eventEndLocal}
                onChange={(e) => setEventEndLocal(e.target.value)}
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Mensaje / descripción</Label>
            <Textarea
              id="description"
              rows={5}
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prayerPhoneHint">Etiqueta teléfono peticiones</Label>
              <Input
                id="prayerPhoneHint"
                value={form.prayerPhoneHint}
                onChange={(e) => setForm((prev) => ({ ...prev, prayerPhoneHint: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prayerPhone">Teléfono peticiones</Label>
              <Input
                id="prayerPhone"
                value={form.prayerPhone}
                onChange={(e) => setForm((prev) => ({ ...prev, prayerPhone: e.target.value }))}
              />
            </div>
          </div>
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

        <Button type="submit" disabled={saving} className="surface-violet text-white">
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Guardando…
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Guardar cambios
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
