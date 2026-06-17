import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export type StorageBucket = "blog-covers" | "registro-web";

export async function uploadAdminFile(bucket: StorageBucket, file: File, folder?: string) {
  const supabase = getSupabaseBrowserClient();
  const safeName = file.name.replace(/[^\w.-]+/g, "-").toLowerCase();
  const path = folder ? `${folder}/${Date.now()}-${safeName}` : `${Date.now()}-${safeName}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: true,
    contentType: file.type || undefined,
  });

  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { publicUrl: data.publicUrl, path, fileName: file.name };
}
