import { createServerFn } from "@tanstack/react-start";

import {
  FALLBACK_TESTIMONIALS,
  mapTestimonialRow,
  type Testimonial,
} from "@/lib/testimonials/types";
import { createSupabaseServerClient, isSupabaseServerConfigured } from "@/lib/supabase/server";

export const getPublishedTestimonials = createServerFn({ method: "GET" }).handler(async () => {
  if (!isSupabaseServerConfigured()) {
    console.warn("testimonials: Supabase no configurado en el servidor.");
    return FALLBACK_TESTIMONIALS;
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("enabled", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("testimonials:", error.message);
    return FALLBACK_TESTIMONIALS;
  }

  const items = (data ?? []).map(mapTestimonialRow);
  return items.length > 0 ? items : FALLBACK_TESTIMONIALS;
});

export type { Testimonial };
