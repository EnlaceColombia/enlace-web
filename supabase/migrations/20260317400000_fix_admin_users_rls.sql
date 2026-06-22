-- Ejecuta esto en Supabase → SQL Editor si perdiste acceso tras la migración anterior.

drop policy if exists "admin_users_admin_select_all" on public.admin_users;
drop policy if exists "admin_users_admin_delete_others" on public.admin_users;
