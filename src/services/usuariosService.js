import { supabase } from '../config/supabase';

export async function consultarUsuarios() {
  if (!supabase) throw new Error('Supabase no está configurado.');
  const { data, error } = await supabase
    .from('profiles')
    .select('id, nombre_completo, correo, telefono, rol, created_at')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export function observarUsuarios(actualizar) {
  if (!supabase) return () => {};
  const canal = supabase
    .channel('profiles-cambios-' + Math.random().toString(36).slice(2))
    .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, actualizar)
    .subscribe();
  return () => { supabase.removeChannel(canal); };
}
