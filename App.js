import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/hooks/useAuth';
import { CarritoProvider } from './src/hooks/useCarrito';
import AppShell from './src/components/AppShell';

// Expo Router reutiliza la composición y los componentes existentes.
export default function App() {
  return <SafeAreaProvider><AuthProvider><CarritoProvider><AppShell /></CarritoProvider></AuthProvider></SafeAreaProvider>;
}
