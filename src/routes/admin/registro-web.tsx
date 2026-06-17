import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ExternalLink, Loader2, Plus, Save, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useRequireAdmin } from "@/lib/admin/use-require-admin";
import {
  DEFAULT_REGISTRO_WEB_CONFIG,
  getRegistroWebPageTitle,
  mapRegistroWebConfigRow,
  mapRegistroWebConfigToRow,
  mapRegistroWebDocumentRow,
  mapRegistroWebDocumentToRow,
  type RegistroWebConfig,
  type RegistroWebDocument,
} from "@/lib/registro-web/types";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { uploadAdminFile } from "@/lib/supabase/storage";

export const Route = createFileRoute("/admin/registro-web")({
  component: AdminRegistroWebPage,
});

function AdminRegistroWebPage() {
  const { loading, userId, isAdmin } = useRequireAdmin();
  const [config, setConfig] = useState<RegistroWebConfig>(DEFAULT_REGISTRO_WEB_CONFIG);
  const [documents, setDocuments] = useState<RegistroWebDocument[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [savingConfig, setSavingConfig] = useState(false);
  const [savingDocId, setSavingDocId] = useState<string | null>(null);
  const [uploadingDocId, setUploadingDocId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || !isAdmin) return;

    let active = true;

    async function loadData() {
      setLoadingData(true);
      setError(null);

      try {
        const supabase = getSupabaseBrowserClient();
        const [{ data: configRow, error: configError }, { data: docs, error: docsError }] =
          await Promise.all([
            supabase.from("registro_web_config").select("*").eq("id", 1).maybeSingle(),
            supabase
              .from("registro_web_documents")
              .select("*")
              .order("sort_order", { ascending: true }),
          ]);

        if (configError) throw configError;
        if (docsError) throw docsError;
        if (!active) return;

        setConfig(configRow ? mapRegistroWebConfigRow(configRow) : DEFAULT_REGISTRO_WEB_CONFIG);
        setDocuments((docs ?? []).map(mapRegistroWebDocumentRow));
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "No se pudo cargar la configuración.");
      } finally {
        if (active) setLoadingData(false);
      }
    }

    void loadData();
    return () => {
      active = false;
    };
  }, [userId, isAdmin]);

  async function handleSaveConfig(event: React.FormEvent) {
    event.preventDefault();
    setSavingConfig(true);
    setMessage(null);
    setError(null);

    try {
      const supabase = getSupabaseBrowserClient();
      const { error: updateError } = await supabase
        .from("registro_web_config")
        .update({
          ...mapRegistroWebConfigToRow(config),
          updated_at: new Date().toISOString(),
        })
        .eq("id", 1);

      if (updateError) throw updateError;
      setMessage("Configuración de la página guardada.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar la configuración.");
    } finally {
      setSavingConfig(false);
    }
  }

  async function handleSaveDocument(doc: RegistroWebDocument) {
    setSavingDocId(doc.id);
    setError(null);

    try {
      const supabase = getSupabaseBrowserClient();
      const { error: updateError } = await supabase
        .from("registro_web_documents")
        .update({
          ...mapRegistroWebDocumentToRow(doc),
          updated_at: new Date().toISOString(),
        })
        .eq("id", doc.id);

      if (updateError) throw updateError;
      setMessage(`Documento «${doc.description}» guardado.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el documento.");
    } finally {
      setSavingDocId(null);
    }
  }

  async function handleUploadDocument(docId: string, event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingDocId(docId);
    setError(null);

    try {
      const { publicUrl, fileName } = await uploadAdminFile("registro-web", file, "docs");
      setDocuments((prev) =>
        prev.map((doc) => (doc.id === docId ? { ...doc, fileUrl: publicUrl, fileName } : doc)),
      );
      setMessage(`Archivo «${fileName}» subido. Guarda el documento para confirmar.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo subir el archivo.");
    } finally {
      setUploadingDocId(null);
      event.target.value = "";
    }
  }

  async function handleAddDocument() {
    setError(null);

    try {
      const supabase = getSupabaseBrowserClient();
      const nextOrder = documents.length
        ? Math.max(...documents.map((doc) => doc.sortOrder)) + 1
        : 1;

      const { data, error: insertError } = await supabase
        .from("registro_web_documents")
        .insert({
          sort_order: nextOrder,
          description: "NUEVO DOCUMENTO",
          file_url: null,
          file_name: null,
          enabled: true,
        })
        .select("*")
        .single();

      if (insertError) throw insertError;
      setDocuments((prev) => [...prev, mapRegistroWebDocumentRow(data)]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear el documento.");
    }
  }

  async function handleDeleteDocument(docId: string) {
    if (!confirm("¿Eliminar este documento?")) return;

    setError(null);

    try {
      const supabase = getSupabaseBrowserClient();
      const { error: deleteError } = await supabase
        .from("registro_web_documents")
        .delete()
        .eq("id", docId);

      if (deleteError) throw deleteError;
      setDocuments((prev) => prev.filter((doc) => doc.id !== docId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar.");
    }
  }

  function updateDocument(id: string, patch: Partial<RegistroWebDocument>) {
    setDocuments((prev) => prev.map((doc) => (doc.id === id ? { ...doc, ...patch } : doc)));
  }

  if (loading || loadingData) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        Cargando registro web…
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-foreground">Registro web ESAL</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Gestiona los documentos de la página «{getRegistroWebPageTitle(config)}».
          </p>
        </div>
        <Button asChild variant="outline">
          <a href="/registro-web" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4" />
            Ver página pública
          </a>
        </Button>
      </div>

      <form onSubmit={(e) => void handleSaveConfig(e)} className="space-y-4">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4">
          <h3 className="text-sm font-bold tracking-widest uppercase text-violet">Página</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Año visible</Label>
              <Input
                id="year"
                type="number"
                min={2000}
                max={2100}
                value={config.year}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, year: Number(e.target.value) || prev.year }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Título base</Label>
              <Input
                id="title"
                value={config.title}
                onChange={(e) => setConfig((prev) => ({ ...prev, title: e.target.value }))}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="intro">Introducción</Label>
            <Textarea
              id="intro"
              rows={3}
              value={config.intro}
              onChange={(e) => setConfig((prev) => ({ ...prev, intro: e.target.value }))}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Título final: <strong>{getRegistroWebPageTitle(config)}</strong>
          </p>
        </section>

        <Button type="submit" disabled={savingConfig} className="surface-violet text-white">
          {savingConfig ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Guardando…
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Guardar página
            </>
          )}
        </Button>
      </form>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-bold tracking-widest uppercase text-violet">Documentos</h3>
          <Button type="button" variant="outline" onClick={() => void handleAddDocument()}>
            <Plus className="h-4 w-4" />
            Agregar fila
          </Button>
        </div>

        <div className="space-y-4">
          {documents.map((doc, index) => (
            <article
              key={doc.id}
              className="rounded-2xl border border-border bg-card p-5 shadow-card space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
                  #{index + 1}
                </p>
                <div className="flex items-center gap-3">
                  <Label htmlFor={`enabled-${doc.id}`} className="text-xs">
                    Visible
                  </Label>
                  <Switch
                    id={`enabled-${doc.id}`}
                    checked={doc.enabled}
                    onCheckedChange={(checked) => updateDocument(doc.id, { enabled: checked })}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-[80px_1fr] gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`order-${doc.id}`}>Orden</Label>
                  <Input
                    id={`order-${doc.id}`}
                    type="number"
                    min={1}
                    value={doc.sortOrder}
                    onChange={(e) =>
                      updateDocument(doc.id, { sortOrder: Number(e.target.value) || 1 })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`desc-${doc.id}`}>Descripción</Label>
                  <Input
                    id={`desc-${doc.id}`}
                    value={doc.description}
                    onChange={(e) => updateDocument(doc.id, { description: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`file-${doc.id}`}>Archivo (PDF u otro)</Label>
                {doc.fileUrl ? (
                  <p className="text-xs text-muted-foreground">
                    Actual:{" "}
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-violet hover:underline"
                    >
                      {doc.fileName ?? "Ver archivo"}
                    </a>
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">Sin archivo cargado.</p>
                )}
                <Input
                  id={`file-${doc.id}`}
                  type="file"
                  accept=".pdf,.doc,.docx,image/*"
                  disabled={uploadingDocId === doc.id}
                  onChange={(e) => void handleUploadDocument(doc.id, e)}
                />
                {uploadingDocId === doc.id && (
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Subiendo archivo…
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  className="surface-violet text-white"
                  disabled={savingDocId === doc.id}
                  onClick={() => void handleSaveDocument(doc)}
                >
                  {savingDocId === doc.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Guardar documento
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => void handleDeleteDocument(doc.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  Eliminar
                </Button>
              </div>
            </article>
          ))}
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
    </div>
  );
}
