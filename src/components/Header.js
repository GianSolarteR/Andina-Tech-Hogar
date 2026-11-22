import React from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { colores } from '../styles/theme';

export default function Header({ onAbrirMenu, onInicio, sesion }) {
  const { width } = useWindowDimensions();
  const pequeno = width < 500;
  return (
    <View style={estilos.cabecera}>
      <View style={estilos.contenido}>
        <Pressable onPress={onInicio} style={estilos.marca} accessibilityRole="button" accessibilityLabel="Ir al catálogo de Andina Tech y Hogar">
          <View style={estilos.simbolo}><Text style={estilos.letra}>A</Text></View>
          <View>
            <Text style={estilos.nombre}>ANDINA <Text style={estilos.nombreDorado}>TECH</Text></Text>
            <Text style={estilos.subtitulo}>& HOGAR</Text>
          </View>
        </Pressable>
        <View style={estilos.acciones}>
          {!pequeno && <Text style={estilos.lema}>{sesion ? 'Área de usuarios' : 'Tecnología para cada espacio'}</Text>}
          <Pressable onPress={onAbrirMenu} style={estilos.botonMenu} accessibilityRole="button" accessibilityLabel="Abrir menú de navegación">
            <Text style={estilos.iconoMenu}>☰</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  cabecera: { backgroundColor: colores.marino, paddingVertical: 15, paddingHorizontal: 18 },
  contenido: { maxWidth: 1120, alignSelf: 'center', width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  marca: { flexDirection: 'row', alignItems: 'center' },
  simbolo: { height: 46, width: 46, borderRadius: 14, backgroundColor: colores.acento, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  letra: { fontSize: 28, fontWeight: '900', color: colores.marino },
  nombre: { fontWeight: '900', fontSize: 19, color: '#FFFFFF', letterSpacing: 0.7 },
  nombreDorado: { color: colores.acento },
  subtitulo: { fontSize: 11, color: '#C3CFDE', letterSpacing: 2.7, fontWeight: '700', marginTop: 2 },
  acciones: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  lema: { color: '#BBC8D8', fontSize: 12 },
  botonMenu: { width: 44, height: 44, borderWidth: 1, borderColor: '#3A4A61', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  iconoMenu: { fontSize: 25, color: '#FFFFFF', lineHeight: 30 }
});
