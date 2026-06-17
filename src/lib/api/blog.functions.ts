import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { mapBlogPostRow, type BlogPost } from "@/lib/blog/types";
import { createSupabaseServerClient, isSupabaseServerConfigured } from "@/lib/supabase/server";

export const getPublishedBlogPosts = createServerFn({ method: "GET" }).handler(async () => {
  if (!isSupabaseServerConfigured()) {
    console.warn("blog_posts: Supabase no configurado en el servidor.");
    return [] as BlogPost[];
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("updated_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("blog_posts:", error.message);
    return [] as BlogPost[];
  }

  return (data ?? []).map(mapBlogPostRow);
});

export const getBlogPostBySlug = createServerFn({ method: "GET" })
  .inputValidator(z.object({ slug: z.string().min(1) }))
  .handler(async ({ data }) => {
    if (!isSupabaseServerConfigured()) return null;

    const supabase = createSupabaseServerClient();
    const { data: row, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", data.slug)
      .eq("published", true)
      .maybeSingle();

    if (error || !row) return null;
    return mapBlogPostRow(row);
  });
