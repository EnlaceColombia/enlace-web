-- REVERTIR políticas que bloqueaban el login (recursión infinita en RLS).
-- La gestión de equipo en /admin/usuarios usa el servidor (service role), no necesita estas políticas.

drop policy if exists "admin_users_admin_select_all" on public.admin_users;
drop policy if exists "admin_users_admin_delete_others" on public.admin_users;
