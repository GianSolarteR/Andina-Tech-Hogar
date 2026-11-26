import React from 'react';
import { Redirect, router } from 'expo-router';
import useAuth from '../hooks/useAuth';
import RegistroScreen from '../screens/RegistroScreen';
import EstadoCarga from '../components/EstadoCarga';
export default function Pantalla() {
  const { sesion, cargando } = useAuth();
  if (cargando) return <EstadoCarga />;
  if (sesion) return <Redirect href="/perfil" />;
  return <RegistroScreen onIrLogin={() => router.navigate('/login')} onExito={() => {}} />;
}
