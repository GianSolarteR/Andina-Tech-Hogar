import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function WorkArea({ children }) {
  return <View style={estilos.contenedor}>{children}</View>;
}

const estilos = StyleSheet.create({
  contenedor: { width: '100%', maxWidth: 1120, alignSelf: 'center', paddingHorizontal: 18, paddingTop: 28, paddingBottom: 36, flexGrow: 1 }
});
