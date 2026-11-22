const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validarLogin({ correo, contrasena }) {
  if (!EMAIL.test(correo.trim())) return 'Escribe un correo electrónico válido.';
  if (!contrasena) return 'Ingresa tu contraseña.';
  return '';
}

export function validarRegistro({ nombre, correo, telefono, contrasena, confirmar }) {
  if (nombre.trim().length < 3) return 'El nombre debe tener al menos 3 caracteres.';
  if (!EMAIL.test(correo.trim())) return 'Escribe un correo electrónico válido.';
  const digitos = telefono.replace(/\D/g, '');
  if (!/^\+?[0-9\s()-]{7,20}$/.test(telefono.trim()) || digitos.length < 7 || digitos.length > 15) {
    return 'Ingresa un teléfono válido (7 a 20 caracteres).';
  }
  if (contrasena.length < 8) return 'La contraseña debe tener mínimo 8 caracteres.';
  if (contrasena !== confirmar) return 'Las contraseñas no coinciden.';
  return '';
}
