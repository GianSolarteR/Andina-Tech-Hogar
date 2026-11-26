import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { colores } from '../styles/theme';
export default function EstadoCarga({ texto = 'Cargando…' }) {
  return <View style={{ alignItems: 'center', paddingVertical: 50, gap: 14 }} accessibilityLiveRegion="polite">
    <ActivityIndicator size="large" color={colores.marino} /><Text style={{ color: colores.secundario }}>{texto}</Text>
  </View>;
}
