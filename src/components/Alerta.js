import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colores } from '../styles/theme';

export default function Alerta({ texto, tipo = 'error' }) {
  if (!texto) return null;
  const exito = tipo === 'exito';
  return <View accessibilityRole="alert" accessibilityLiveRegion="polite" style={[estilos.caja, { backgroundColor: exito ? colores.positivoFondo : colores.negativoFondo, borderColor: exito ? '#BDE2CC' : '#F6C8CC' }]}>
    <Text style={[estilos.texto, { color: exito ? colores.positivo : colores.negativo }]}>{texto}</Text>
  </View>;
}

const estilos = StyleSheet.create({
  caja: { padding: 13, borderRadius: 11, borderWidth: 1, marginVertical: 12 },
  texto: { fontSize: 12, lineHeight: 19, fontWeight: '600' }
});
