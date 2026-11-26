-- Ejecutar manualmente en SQL Editor después del schema.sql existente.
-- No modifica filas, usuarios, trigger de registro ni la política SELECT del directorio.
begin;
alter table public.profiles enable row level security;
-- Un permiso UPDATE de tabla prevalece sobre permisos por columna: revocarlo primero.
revoke update on table public.profiles from public, anon, authenticated;
revoke update (id, nombre_completo, correo, telefono, rol, created_at)
  on public.profiles from public, anon, authenticated;
grant update (nombre_completo, telefono) on public.profiles to authenticated;

drop policy if exists "Actualizar perfil propio" on public.profiles;
create policy "Actualizar perfil propio" on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);
-- Restrictiva: mantiene el límite incluso si posteriormente se agrega una política permisiva.
drop policy if exists "Limitar actualizaciones al propietario" on public.profiles;
create policy "Limitar actualizaciones al propietario" on public.profiles
  as restrictive for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);
commit;
