-- Solo lectura. Ejecutar después de la migración en Supabase SQL Editor.
-- authenticated: true SOLO para nombre_completo y telefono; anon: false en todas.
select columna,
  has_column_privilege('authenticated', 'public.profiles', columna, 'UPDATE') as authenticated_update,
  has_column_privilege('anon', 'public.profiles', columna, 'UPDATE') as anon_update
from unnest(array['id', 'nombre_completo', 'correo', 'telefono', 'rol', 'created_at']) as columna;

-- UPDATE de tabla debe ser false; SELECT authenticated true; SELECT anon false.
select
  has_table_privilege('authenticated', 'public.profiles', 'UPDATE') as update_tabla,
  has_table_privilege('authenticated', 'public.profiles', 'SELECT') as directorio_autenticado,
  has_table_privilege('anon', 'public.profiles', 'SELECT') as directorio_anonimo;

select relrowsecurity as rls_activa from pg_class where oid = 'public.profiles'::regclass;
select policyname, permissive, roles, cmd, qual, with_check
from pg_policies where schemaname = 'public' and tablename = 'profiles';
-- Confirmar políticas UPDATE propia/permisiva y propia/restrictiva con auth.uid() = id.
-- Estas consultas no sustituyen las pruebas de dos usuarios a través de la Data API.
