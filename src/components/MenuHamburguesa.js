import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { opcionesNavegacion } from '../config/navegacion';
import { colores } from '../styles/theme';

export default function MenuHamburguesa({ visible, onCerrar, autenticado, correo, onNavegar, onSalir, cantidad }) {
  const items = opcionesNavegacion(autenticado, cantidad);

  const navegar = (id) => { onCerrar(); onNavegar(id); };
  const salir = () => { onCerrar(); onSalir(); };

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onCerrar}>
      <View style={estilos.modal}>
        <Pressable style={estilos.fondo} onPress={onCerrar} accessibilityLabel="Cerrar menú" />
        <ScrollView style={estilos.panel} contentContainerStyle={estilos.panelContenido}>
          <View style={estilos.encabezado}>
            <View style={{ flex: 1 }}>
              <Text style={estilos.titulo}>Navegación</Text>
              <Text style={estilos.subtitulo}>ANDINA TECH & HOGAR</Text>
            </View>
            <Pressable style={estilos.cerrar} onPress={onCerrar} accessibilityRole="button" accessibilityLabel="Cerrar menú">
              <Text style={estilos.cerrarTexto}>×</Text>
            </Pressable>
          </View>
          <View style={estilos.estado}>
            <Text style={estilos.estadoTitulo}>{autenticado ? 'Sesión activa' : 'Visitante'}</Text>
            <Text style={estilos.estadoSubtitulo} numberOfLines={2}>{autenticado ? correo : 'Explora nuestros productos sin registrarte.'}</Text>
          </View>
          {items.map((item) => (
            <Pressable key={item.id} onPress={() => navegar(item.id)} style={estilos.opcion} accessibilityRole="button">
              <Text style={estilos.opcionTexto}>{item.titulo}</Text><Text style={estilos.flecha}>›</Text>
            </Pressable>
          ))}
          {autenticado && <Pressable style={estilos.opcion} onPress={salir} accessibilityRole="button">
            <Text style={[estilos.opcionTexto, { color: colores.negativo }]}>Cerrar sesión</Text><Text style={estilos.flecha}>›</Text>
          </Pressable>}
          <View style={estilos.espaciador} />
          <Text style={estilos.pie}>Aplicación académica · Versión 1.0.0</Text>
        </ScrollView>
      </View>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  modal: { flex: 1, flexDirection: 'row', justifyContent: 'flex-end' },
  fondo: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(9, 19, 32, 0.62)' },
  panel: { height: '100%', width: '86%', maxWidth: 350, backgroundColor: colores.superficie },
  panelContenido: { padding: 22, paddingTop: 40, flexGrow: 1 },
  encabezado: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: colores.linea },
  titulo: { fontSize: 24, color: colores.marino, fontWeight: '900' },
  subtitulo: { fontSize: 10, color: colores.secundario, letterSpacing: 1, marginTop: 5 },
  cerrar: { width: 44, height: 44, borderRadius: 12, backgroundColor: colores.fondo, alignItems: 'center', justifyContent: 'center' },
  cerrarTexto: { fontSize: 25, color: colores.marino },
  estado: { backgroundColor: '#F3F6FA', borderRadius: 15, padding: 16, marginVertical: 20 },
  estadoTitulo: { color: colores.marino, fontWeight: '800', fontSize: 14 },
  estadoSubtitulo: { color: colores.secundario, fontSize: 12, marginTop: 5, lineHeight: 18 },
  opcion: { paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: colores.linea, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  opcionTexto: { fontSize: 15, fontWeight: '700', color: colores.texto },
  flecha: { fontSize: 26, color: colores.acentoOscuro },
  espaciador: { flex: 1 },
  pie: { textAlign: 'center', color: colores.secundario, fontSize: 11, paddingBottom: 12 }
});
