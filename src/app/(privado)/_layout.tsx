import React from 'react';
import { Redirect, Slot } from 'expo-router';
import useAuth from '../../hooks/useAuth';
import EstadoCarga from '../../components/EstadoCarga';
export default function Privado() {
  const { sesion, cargando } = useAuth();
  if (cargando) return <EstadoCarga texto="Restaurando sesión…" />;
  if (!sesion) return <Redirect href="/login" />;
  return <Slot />;
}
