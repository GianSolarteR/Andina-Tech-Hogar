import { supabase } from '../config/supabase';

function obtenerCliente() {
  if (!supabase) {
    throw new Error('Falta configurar Supabase. Revisa tu archivo .env y reinicia Expo.');
  }
  return supabase;
}

export async function registrarUsuario({ nombre, correo, telefono, contrasena }) {
  const { data, error } = await obtenerCliente().auth.signUp({
    email: correo.trim().toLowerCase(),
    password: contrasena,
    options: {
      data: { nombre_completo: nombre.trim(), telefono: telefono.trim() }
    }
  });
  if (error) throw error;
  return data;
}

export async function iniciarSesion({ correo, contrasena }) {
  const { data, error } = await obtenerCliente().auth.signInWithPassword({
    email: correo.trim().toLowerCase(), password: contrasena
  });
  if (error) throw error;
  return data;
}

export async function cerrarSesion() {
  const { error } = await obtenerCliente().auth.signOut();
  if (error) throw error;
}

export function mensajeError(error) {
  const texto = String(error?.message || 'Ocurrió un error. Inténtalo nuevamente.');
  if (/invalid login credentials/i.test(texto)) return 'Correo o contraseña incorrectos.';
  if (/email not confirmed/i.test(texto)) return 'Confirma tu correo electrónico antes de ingresar.';
  if (/user already registered/i.test(texto)) return 'Este correo ya está registrado.';
  if (/password should be at least/i.test(texto)) return 'La contraseña no cumple la longitud mínima.';
  if (/rate limit/i.test(texto)) return 'Demasiados intentos. Inténtalo más tarde.';
  return texto;
}
