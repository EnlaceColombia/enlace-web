-- CMS: blogs, registro web ESAL, storage
-- Ejecutar en Supabase → SQL Editor después de 20260317000000_backoffice.sql

-- ─── Blog ───────────────────────────────────────────────────────────────────

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  content text not null default '',
  cover_image_url text,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists blog_posts_published_at_idx
  on public.blog_posts (published_at desc)
  where published = true;

-- ─── Registro web ESAL ──────────────────────────────────────────────────────

create table if not exists public.registro_web_config (
  id smallint primary key default 1 check (id = 1),
  year int not null default extract(year from now())::int - 1,
  title text not null default 'Actualización, registro web',
  intro text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.registro_web_documents (
  id uuid primary key default gen_random_uuid(),
  sort_order int not null default 0,
  description text not null,
  file_url text,
  file_name text,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists registro_web_documents_sort_idx
  on public.registro_web_documents (sort_order asc);

-- ─── RLS ────────────────────────────────────────────────────────────────────

alter table public.blog_posts enable row level security;
alter table public.registro_web_config enable row level security;
alter table public.registro_web_documents enable row level security;

-- Blog: lectura pública solo publicados
create policy "blog_posts_public_read"
  on public.blog_posts
  for select
  to anon, authenticated
  using (published = true);

create policy "blog_posts_admin_select"
  on public.blog_posts
  for select
  to authenticated
  using (exists (select 1 from public.admin_users au where au.user_id = auth.uid()));

create policy "blog_posts_admin_insert"
  on public.blog_posts
  for insert
  to authenticated
  with check (exists (select 1 from public.admin_users au where au.user_id = auth.uid()));

create policy "blog_posts_admin_update"
  on public.blog_posts
  for update
  to authenticated
  using (exists (select 1 from public.admin_users au where au.user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users au where au.user_id = auth.uid()));

create policy "blog_posts_admin_delete"
  on public.blog_posts
  for delete
  to authenticated
  using (exists (select 1 from public.admin_users au where au.user_id = auth.uid()));

-- Registro web config
create policy "registro_web_config_public_read"
  on public.registro_web_config
  for select
  to anon, authenticated
  using (true);

create policy "registro_web_config_admin_select"
  on public.registro_web_config
  for select
  to authenticated
  using (exists (select 1 from public.admin_users au where au.user_id = auth.uid()));

create policy "registro_web_config_admin_update"
  on public.registro_web_config
  for update
  to authenticated
  using (exists (select 1 from public.admin_users au where au.user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users au where au.user_id = auth.uid()));

-- Registro web documents
create policy "registro_web_documents_public_read"
  on public.registro_web_documents
  for select
  to anon, authenticated
  using (enabled = true);

create policy "registro_web_documents_admin_select"
  on public.registro_web_documents
  for select
  to authenticated
  using (exists (select 1 from public.admin_users au where au.user_id = auth.uid()));

create policy "registro_web_documents_admin_insert"
  on public.registro_web_documents
  for insert
  to authenticated
  with check (exists (select 1 from public.admin_users au where au.user_id = auth.uid()));

create policy "registro_web_documents_admin_update"
  on public.registro_web_documents
  for update
  to authenticated
  using (exists (select 1 from public.admin_users au where au.user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users au where au.user_id = auth.uid()));

create policy "registro_web_documents_admin_delete"
  on public.registro_web_documents
  for delete
  to authenticated
  using (exists (select 1 from public.admin_users au where au.user_id = auth.uid()));

-- ─── Storage ────────────────────────────────────────────────────────────────

insert into storage.buckets (id, name, public)
values
  ('blog-covers', 'blog-covers', true),
  ('registro-web', 'registro-web', true)
on conflict (id) do update set public = excluded.public;

create policy "storage_blog_covers_public_read"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'blog-covers');

create policy "storage_blog_covers_admin_insert"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'blog-covers'
    and exists (select 1 from public.admin_users au where au.user_id = auth.uid())
  );

create policy "storage_blog_covers_admin_update"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'blog-covers'
    and exists (select 1 from public.admin_users au where au.user_id = auth.uid())
  )
  with check (
    bucket_id = 'blog-covers'
    and exists (select 1 from public.admin_users au where au.user_id = auth.uid())
  );

create policy "storage_blog_covers_admin_delete"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'blog-covers'
    and exists (select 1 from public.admin_users au where au.user_id = auth.uid())
  );

create policy "storage_registro_web_public_read"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'registro-web');

create policy "storage_registro_web_admin_insert"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'registro-web'
    and exists (select 1 from public.admin_users au where au.user_id = auth.uid())
  );

create policy "storage_registro_web_admin_update"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'registro-web'
    and exists (select 1 from public.admin_users au where au.user_id = auth.uid())
  )
  with check (
    bucket_id = 'registro-web'
    and exists (select 1 from public.admin_users au where au.user_id = auth.uid())
  );

create policy "storage_registro_web_admin_delete"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'registro-web'
    and exists (select 1 from public.admin_users au where au.user_id = auth.uid())
  );

-- ─── Datos iniciales ────────────────────────────────────────────────────────

insert into public.registro_web_config (id, year, title, intro)
values (
  1,
  2025,
  'Actualización, registro web',
  'Documentos de transparencia y cumplimiento normativo (ESAL) publicados para consulta.'
)
on conflict (id) do nothing;

insert into public.registro_web_documents (sort_order, description)
select v.sort_order, v.description
from (
  values
    (1, 'ESTADOS FINANCIEROS 2024'),
    (2, 'CERTIFICACION DE CUMPLIMIENTO'),
    (3, 'ACTA DE CONSTITUCION'),
    (4, 'CAMARA DE COMERCIO'),
    (5, 'ACTA 63. ASAMBLEA CORPORADOS'),
    (6, 'ESTATUTOS CEC ULTIMA REFORMA'),
    (7, 'CERTIFICACION ANTECEDENTES'),
    (8, 'RUT CEC'),
    (9, 'FORMULARIO 2530'),
    (10, 'FORMULARIO 2531'),
    (11, 'FORMULARIO 2532'),
    (12, 'FORMULARIO 2533 – NO APLICA'),
    (13, 'FORMULARIO 5245')
) as v(sort_order, description)
where not exists (select 1 from public.registro_web_documents limit 1);
