-- Backoffice Enlace Web — Maratónica + admins
-- Ejecutar en Supabase → SQL Editor (o `supabase db push` si usas CLI local)

create table if not exists public.maratonica_config (
  id smallint primary key default 1 check (id = 1),
  enabled boolean not null default true,
  headline text not null,
  participation text not null,
  event_date_label text not null,
  countdown_at timestamptz not null,
  event_end_at timestamptz not null,
  description text not null,
  prayer_phone text not null,
  prayer_phone_hint text not null default 'Peticiones de oración',
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

alter table public.maratonica_config enable row level security;
alter table public.admin_users enable row level security;

-- Lectura pública (página /maratonica)
create policy "maratonica_config_public_read"
  on public.maratonica_config
  for select
  to anon, authenticated
  using (true);

-- Solo admins pueden ver la lista de admins (propio registro)
create policy "admin_users_read_own"
  on public.admin_users
  for select
  to authenticated
  using (user_id = auth.uid());

-- Admins: SELECT + UPDATE en maratonica_config
create policy "maratonica_config_admin_select"
  on public.maratonica_config
  for select
  to authenticated
  using (exists (select 1 from public.admin_users au where au.user_id = auth.uid()));

create policy "maratonica_config_admin_update"
  on public.maratonica_config
  for update
  to authenticated
  using (exists (select 1 from public.admin_users au where au.user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users au where au.user_id = auth.uid()));

insert into public.maratonica_config (
  id,
  enabled,
  headline,
  participation,
  event_date_label,
  countdown_at,
  event_end_at,
  description,
  prayer_phone,
  prayer_phone_hint
) values (
  1,
  true,
  'El Señor Tiene una Respuesta',
  'Pastores Internacionales',
  '10 al 21 de Febrero 2026',
  '2026-02-10T05:00:00.000Z',
  '2026-02-22T04:59:59.000Z',
  'Cada vez que apoyas la Maratónica entras en el canal de la promesa de la «Siembra y la Cosecha». Contribuyes a evangelizar el mundo: ayudas a difundir el mensaje del Evangelio de nuestro Señor Jesucristo a las almas que hoy necesitan esperanza y vida eterna.',
  '(601) 6439200 Opc. 2',
  'Peticiones de oración'
)
on conflict (id) do nothing;

-- Tras crear un usuario en Authentication, ejecuta (reemplaza UUID y email):
-- insert into public.admin_users (user_id, email) values ('<auth-user-uuid>', 'tu@email.com');
