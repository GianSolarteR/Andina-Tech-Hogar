import { supabase } from '../config/supabase';
import { exigirUsuario } from './perfilesService';

export async function consultarUsuarios() {
  await exigirUsuario();
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
