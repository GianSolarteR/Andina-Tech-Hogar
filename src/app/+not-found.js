import React from 'react';
import { Text, View } from 'react-native';
import { router } from 'expo-router';
import Boton from '../components/Boton';
export default function NoEncontrada() {
  return <View style={{ gap: 20 }}><Text>Esta página no existe.</Text><Boton titulo="Volver al catálogo" onPress={() => router.replace('/')} /></View>;
}
