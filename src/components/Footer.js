import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { creditos } from '../config/creditos';
import { colores } from '../styles/theme';

export default function Footer() {
  return <View style={estilos.pie}>
    <View style={estilos.contenido}>
      <View style={estilos.bloque}><Text style={estilos.marca}>ANDINA TECH & HOGAR</Text><Text style={estilos.normal}>Aplicación académica · Programación de Dispositivos Móviles I</Text></View>
      <View style={estilos.bloque}><Text style={estilos.normal}>{creditos}</Text><Text style={estilos.normal}>© 2026 · Versión 1.0.0</Text></View>
    </View>
  </View>;
}

const estilos = StyleSheet.create({
  pie: { backgroundColor: colores.marino, paddingHorizontal: 20, paddingVertical: 26 },
  contenido: { maxWidth: 1120, width: '100%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: 18 },
  bloque: { flexShrink: 1, maxWidth: '100%' },
  marca: { color: colores.acento, fontWeight: '900', letterSpacing: 1, marginBottom: 8 },
  normal: { color: '#C1CCDA', fontSize: 12, lineHeight: 20 }
});
