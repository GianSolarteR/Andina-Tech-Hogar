import React from 'react';
import useAuth from '../../hooks/useAuth';
import UsuariosScreen from '../../screens/UsuariosScreen';
export default function Usuarios() {
  const { usuario } = useAuth();
  return usuario ? <UsuariosScreen key={usuario.id} usuario={usuario} /> : null;
}
