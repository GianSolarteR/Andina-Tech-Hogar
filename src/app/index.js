import React from 'react';
import { router } from 'expo-router';
import Catalogo from '../components/Catalogo';
import useAuth from '../hooks/useAuth';
export default function Inicio() {
  const { sesion } = useAuth();
  return <Catalogo autenticado={Boolean(sesion)} onRegistrarse={() => router.navigate(sesion ? '/perfil' : '/registro')} />;
}
