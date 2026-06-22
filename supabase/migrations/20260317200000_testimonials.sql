-- Testimonios públicos (carrusel en inicio y maratónica)
-- Ejecutar en Supabase → SQL Editor después de 20260317100000_cms.sql

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  place text not null default '',
  text text not null,
  sort_order int not null default 0,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists testimonials_sort_idx
  on public.testimonials (sort_order asc, created_at desc);

alter table public.testimonials enable row level security;

create policy "testimonials_public_read"
  on public.testimonials
  for select
  to anon, authenticated
  using (enabled = true);

create policy "testimonials_admin_select"
  on public.testimonials
  for select
  to authenticated
  using (exists (select 1 from public.admin_users au where au.user_id = auth.uid()));

create policy "testimonials_admin_insert"
  on public.testimonials
  for insert
  to authenticated
  with check (exists (select 1 from public.admin_users au where au.user_id = auth.uid()));

create policy "testimonials_admin_update"
  on public.testimonials
  for update
  to authenticated
  using (exists (select 1 from public.admin_users au where au.user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users au where au.user_id = auth.uid()));

create policy "testimonials_admin_delete"
  on public.testimonials
  for delete
  to authenticated
  using (exists (select 1 from public.admin_users au where au.user_id = auth.uid()));

-- Datos iniciales (los testimonios reales que ya estaban en el sitio)
insert into public.testimonials (name, place, text, sort_order, enabled)
select *
from (
  values
    (
      'Mariela Gómez',
      'Maratónica · Noviembre 2020',
      'Mi hijo estaba preparado para que le amputaran una pierna por la ruptura del nervio ciático. Llamé a Enlace a pedir oración por su sanidad. Dios escuchó: el nervio fue restaurado y ya no le quitaron su pierna. ¡Gloria a Dios!',
      1,
      true
    ),
    (
      'Marina Camargo',
      'Maratónica · Noviembre 2020',
      'Estaba preparada para una cirugía de hernia. Me conecté con la Maratónica de Enlace y ofrendé por mi sanidad. Fui al chequeo médico y la hernia ya no estaba. ¡Desapareció! ¡Gloria a Dios!',
      2,
      true
    ),
    (
      'Ana Florián',
      'Maratónica · Febrero 2020',
      'Después de más de un año sin que mi hija consiguiera empleo, sembré en la Maratónica de febrero 2020. Dios respondió a ese acto de fe y hoy mi hija goza de ese empleo por el cual creí al Señor. ¡Gloria a Dios!',
      3,
      true
    ),
    (
      'Rosalba Barragán',
      'Maratónica · Agosto 2020',
      'Creí la Palabra y recibí un milagro: Dios borró una deuda de 5 millones. ¡Gloria al Señor!',
      4,
      true
    )
) as seed(name, place, text, sort_order, enabled)
where not exists (select 1 from public.testimonials limit 1);
