import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colores } from '../styles/theme';

/** @param {{ titulo: string, valor: string, onCambiar: (valor: string) => void, placeholder?: string, teclado?: import('react-native').TextInputProps['keyboardType'], seguro?: boolean, autoCompletar?: import('react-native').TextInputProps['autoComplete'], autoCapitalize?: import('react-native').TextInputProps['autoCapitalize'], maxLength?: number, editable?: boolean }} props */
export default function CampoFormulario({ titulo, valor, onCambiar, placeholder = '', teclado = undefined, seguro = false, autoCompletar = undefined, autoCapitalize = 'none', maxLength = undefined, editable = true }) {
  return <View style={estilos.grupo}>
    <Text style={estilos.titulo}>{titulo}</Text>
    <TextInput
      style={estilos.input}
      editable={editable}
      placeholder={placeholder}
      placeholderTextColor="#97A1B2"
      value={valor}
      onChangeText={onCambiar}
      keyboardType={teclado || 'default'}
      secureTextEntry={Boolean(seguro)}
      autoCapitalize={autoCapitalize}
      autoComplete={autoCompletar}
      maxLength={maxLength}
      accessibilityLabel={titulo}
    />
  </View>;
}

const estilos = StyleSheet.create({
  grupo: { marginBottom: 15 },
  titulo: { color: colores.marino, fontWeight: '800', fontSize: 13, marginBottom: 8 },
  input: { height: 49, borderRadius: 11, borderWidth: 1, borderColor: '#DDE4ED', backgroundColor: '#FFFFFF', paddingHorizontal: 14, fontSize: 14, color: colores.texto }
});
