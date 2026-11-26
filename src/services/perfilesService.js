import { supabase } from '../config/supabase';
import { validarPerfil } from '../utils/validaciones';
const campos = 'id, nombre_completo, correo, telefono, rol, created_at';

// La identidad se obtiene de Auth, nunca de un ID enviado por el formulario.
export async function exigirUsuario() {
  if (!supabase) throw new Error('Supabase no está configurado.');
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new Error('Tu sesión no está disponible. Inicia sesión nuevamente.');
  return data.user;
}
export async function consultarMiPerfil() {
  const usuario = await exigirUsuario();
  const { data, error } = await supabase.from('profiles').select(campos).eq('id', usuario.id).single();
  if (error) throw error;
  return data;
}
export async function actualizarMiPerfil({ nombre, telefono }) {
  const aviso = validarPerfil({ nombre, telefono });
  if (aviso) throw new Error(aviso);
  const usuario = await exigirUsuario();
  const { data, error } = await supabase.from('profiles')
    .update({ nombre_completo: nombre.trim(), telefono: telefono.trim() })
    .eq('id', usuario.id).select(campos).single();
  if (error) {
    if (error.code === '42501') throw new Error('No tienes permiso para guardar el perfil. Solicita al responsable que revise los permisos de edición.');
    throw error;
  }
  return data;
}
