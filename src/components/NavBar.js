import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colores } from '../styles/theme';

export default function NavBar({ vista, autenticado, onNavegar, onSalir }) {
  const items = autenticado
    ? [{ id: 'inicio', titulo: 'Catálogo' }, { id: 'usuarios', titulo: 'Usuarios registrados' }]
    : [{ id: 'inicio', titulo: 'Catálogo' }, { id: 'login', titulo: 'Iniciar sesión' }, { id: 'registro', titulo: 'Registrarse' }];
  return (
    <View style={estilos.fondo}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={estilos.barra}>
        {items.map((item) => (
          <Pressable key={item.id} onPress={() => onNavegar(item.id)}
            style={[estilos.enlace, vista === item.id && estilos.activo]}
            accessibilityRole="button" accessibilityState={{ selected: vista === item.id }}>
            <Text style={[estilos.texto, vista === item.id && estilos.textoActivo]}>{item.titulo}</Text>
          </Pressable>
        ))}
        {autenticado && <Pressable onPress={onSalir} style={estilos.enlace} accessibilityRole="button">
          <Text style={estilos.salir}>Cerrar sesión</Text>
        </Pressable>}
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  fondo: { backgroundColor: '#FFFFFF', borderBottomColor: colores.linea, borderBottomWidth: 1 },
  barra: { minWidth: '100%', maxWidth: 1120, alignSelf: 'center', paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', minHeight: 54 },
  enlace: { paddingVertical: 16, paddingHorizontal: 15, borderBottomWidth: 3, borderBottomColor: 'transparent' },
  activo: { borderBottomColor: colores.acentoOscuro },
  texto: { color: colores.secundario, fontSize: 13, fontWeight: '700' },
  textoActivo: { color: colores.marino },
  salir: { color: colores.negativo, fontSize: 13, fontWeight: '700' }
});
