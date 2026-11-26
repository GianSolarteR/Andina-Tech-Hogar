import React from 'react';
import { Redirect, router } from 'expo-router';
import useAuth from '../hooks/useAuth';
import LoginScreen from '../screens/LoginScreen';
import EstadoCarga from '../components/EstadoCarga';
export default function Pantalla() {
  const { sesion, cargando } = useAuth();
  if (cargando) return <EstadoCarga />;
  if (sesion) return <Redirect href="/perfil" />;
  return <LoginScreen onRegistrarse={() => router.navigate('/registro')} onExito={() => {}} />;
}
