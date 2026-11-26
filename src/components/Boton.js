import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { colores } from '../styles/theme';

export default function Boton({ titulo, onPress, secundario = false, disabled = false, cargando = false, etiqueta = undefined }) {
  const [resaltado, setResaltado] = useState(false);
  return <Pressable onPress={onPress} disabled={disabled || cargando}
    accessibilityRole="button" accessibilityLabel={etiqueta || titulo}
    accessibilityState={{ disabled: disabled || cargando, busy: cargando }}
    onHoverIn={() => setResaltado(true)} onHoverOut={() => setResaltado(false)}
    onFocus={() => setResaltado(true)} onBlur={() => setResaltado(false)}
    style={({ pressed }) => [s.boton, secundario && s.secundario, resaltado && s.resaltado, pressed && s.pulsado, (disabled || cargando) && s.deshabilitado]}>
    {cargando ? <ActivityIndicator color={secundario ? colores.marino : '#FFFFFF'} /> : <Text style={[s.texto, secundario && s.textoSecundario]}>{titulo}</Text>}
  </Pressable>;
}
const s = StyleSheet.create({
  boton: { minHeight: 46, minWidth: 44, paddingHorizontal: 14, paddingVertical: 12, backgroundColor: colores.marino, borderRadius: 11, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'transparent' },
  secundario: { backgroundColor: '#E9F0F8' }, resaltado: { borderColor: colores.acentoOscuro }, pulsado: { opacity: 0.75 }, deshabilitado: { opacity: 0.5 },
  texto: { color: '#FFFFFF', fontSize: 13, fontWeight: '800', textAlign: 'center' }, textoSecundario: { color: colores.marino }
});
