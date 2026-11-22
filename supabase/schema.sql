-- Andina Tech & Hogar · taller Programación de Dispositivos Móviles I
-- EJECUTAR EN UN PROYECTO NUEVO DE SUPABASE (SQL Editor).
-- Las contraseñas permanecen en Supabase Auth (auth.users), nunca en public.profiles.
-- El directorio es visible a TODO usuario autenticado, tal como requiere el taller.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre_completo text not null,
  correo text not null,
  telefono text not null,
  rol text not null default 'cliente',
  created_at timestamptz not null default now(),
  constraint profiles_rol_valido check (rol in ('cliente', 'personal'))
);

alter table public.profiles enable row level security;

-- Sin permiso público ni permisos de escritura desde la aplicación cliente.
revoke all on table public.profiles from public, anon, authenticated;
grant select on table public.profiles to authenticated;

drop policy if exists "Usuarios autenticados consultan perfiles" on public.profiles;
create policy "Usuarios autenticados consultan perfiles"
on public.profiles
for select
to authenticated
using ((select auth.uid()) is not null);

-- El trigger corre con privilegios adecuados al crear cuentas en Supabase Auth.
-- El rol se fija a cliente en SQL: no confiamos en metadatos elegidos por el usuario.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, nombre_completo, correo, telefono, rol)
  values (
    new.id,
    coalesce(nullif(btrim(new.raw_user_meta_data ->> 'nombre_completo'), ''), 'Usuario'),
    coalesce(new.email, ''),
    coalesce(nullif(btrim(new.raw_user_meta_data ->> 'telefono'), ''), 'Sin teléfono'),
    'cliente'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Activa los eventos de cambios para el listado en tiempo real.
-- Evita añadir la tabla dos veces si ejecutas el archivo nuevamente.
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
     and not exists (
       select 1 from pg_publication_tables
       where pubname = 'supabase_realtime'
         and schemaname = 'public'
         and tablename = 'profiles'
     ) then
    alter publication supabase_realtime add table public.profiles;
  end if;
end;
$$;

comment on table public.profiles is 'Directorio académico visible solo a usuarios autenticados. No almacena contraseñas.';
