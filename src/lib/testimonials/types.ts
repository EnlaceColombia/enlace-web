import type { TestimonialRow } from "@/lib/supabase/database.types";

export type Testimonial = {
  id: string;
  name: string;
  place: string;
  text: string;
  sortOrder: number;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
};

/** Respaldo si Supabase no está configurado o la tabla está vacía. */
export const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: "fallback-1",
    name: "Mariela Gómez",
    place: "Maratónica · Noviembre 2020",
    text: "Mi hijo estaba preparado para que le amputaran una pierna por la ruptura del nervio ciático. Llamé a Enlace a pedir oración por su sanidad. Dios escuchó: el nervio fue restaurado y ya no le quitaron su pierna. ¡Gloria a Dios!",
    sortOrder: 1,
    enabled: true,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "fallback-2",
    name: "Marina Camargo",
    place: "Maratónica · Noviembre 2020",
    text: "Estaba preparada para una cirugía de hernia. Me conecté con la Maratónica de Enlace y ofrendé por mi sanidad. Fui al chequeo médico y la hernia ya no estaba. ¡Desapareció! ¡Gloria a Dios!",
    sortOrder: 2,
    enabled: true,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "fallback-3",
    name: "Ana Florián",
    place: "Maratónica · Febrero 2020",
    text: "Después de más de un año sin que mi hija consiguiera empleo, sembré en la Maratónica de febrero 2020. Dios respondió a ese acto de fe y hoy mi hija goza de ese empleo por el cual creí al Señor. ¡Gloria a Dios!",
    sortOrder: 3,
    enabled: true,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "fallback-4",
    name: "Rosalba Barragán",
    place: "Maratónica · Agosto 2020",
    text: "Creí la Palabra y recibí un milagro: Dios borró una deuda de 5 millones. ¡Gloria al Señor!",
    sortOrder: 4,
    enabled: true,
    createdAt: "",
    updatedAt: "",
  },
];

export function mapTestimonialRow(row: TestimonialRow): Testimonial {
  return {
    id: row.id,
    name: row.name,
    place: row.place,
    text: row.text,
    sortOrder: row.sort_order,
    enabled: row.enabled,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapTestimonialToRow(
  testimonial: Pick<Testimonial, "name" | "place" | "text" | "sortOrder" | "enabled">,
) {
  return {
    name: testimonial.name.trim(),
    place: testimonial.place.trim(),
    text: testimonial.text.trim(),
    sort_order: testimonial.sortOrder,
    enabled: testimonial.enabled,
  };
}
