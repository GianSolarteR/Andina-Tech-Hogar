import React from 'react';
import useAuth from '../../hooks/useAuth';
import PerfilScreen from '../../screens/PerfilScreen';
export default function Perfil() {
  const { usuario } = useAuth();
  return usuario ? <PerfilScreen key={usuario.id} usuario={usuario} /> : null;
}
