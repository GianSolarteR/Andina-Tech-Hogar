export const rutas = { inicio: '/', carrito: '/carrito', perfil: '/perfil', usuarios: '/usuarios', login: '/login', registro: '/registro' };
export function opcionesNavegacion(autenticado, cantidad) {
  return [
    { id: 'inicio', titulo: 'Catálogo' }, { id: 'carrito', titulo: `Carrito (${cantidad})` },
    ...(autenticado ? [{ id: 'perfil', titulo: 'Mi perfil' }, { id: 'usuarios', titulo: 'Usuarios registrados' }]
      : [{ id: 'login', titulo: 'Iniciar sesión' }, { id: 'registro', titulo: 'Registrarse' }])
  ];
}
