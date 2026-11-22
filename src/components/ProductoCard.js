import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { formatoPrecio } from '../data/productos';
import { colores } from '../styles/theme';

export default function ProductoCard({ producto, ancho }) {
  return <View style={[estilos.card, { width: ancho }]}>
    <View style={estilos.imagenContenedor}>
      <Image source={producto.imagen} style={estilos.imagen} resizeMode="contain" accessibilityLabel={'Ilustración de ' + producto.nombre} />
      {producto.etiqueta && <View style={estilos.etiqueta}><Text style={estilos.etiquetaTexto}>{producto.etiqueta}</Text></View>}
    </View>
    <View style={estilos.detalle}>
      <Text style={estilos.categoria}>{producto.categoria.toUpperCase()}</Text>
      <Text style={estilos.nombre}>{producto.nombre}</Text>
      <Text style={estilos.descripcion} numberOfLines={2}>{producto.descripcion}</Text>
      <View style={estilos.divisor} />
      <Text style={estilos.precio}>{formatoPrecio(producto.precio)}</Text>
    </View>
  </View>;
}

const estilos = StyleSheet.create({
  card: { overflow: 'hidden', backgroundColor: colores.superficie, borderRadius: 18, borderWidth: 1, borderColor: colores.linea },
  imagenContenedor: { position: 'relative', backgroundColor: '#E7ECF3', aspectRatio: 1.22, alignItems: 'center', justifyContent: 'center' },
  imagen: { width: '76%', height: '76%' },
  etiqueta: { position: 'absolute', top: 12, left: 12, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, backgroundColor: colores.marino },
  etiquetaTexto: { color: '#FFFFFF', fontSize: 10, fontWeight: '800' },
  detalle: { padding: 15, minHeight: 154 },
  categoria: { color: colores.acentoOscuro, letterSpacing: 1.2, fontSize: 10, fontWeight: '900' },
  nombre: { fontSize: 15, fontWeight: '900', color: colores.texto, marginTop: 7 },
  descripcion: { fontSize: 12, color: colores.secundario, lineHeight: 18, marginTop: 5, minHeight: 36 },
  divisor: { height: 1, backgroundColor: colores.linea, marginVertical: 12 },
  precio: { color: colores.marino, fontSize: 18, fontWeight: '900' }
});
