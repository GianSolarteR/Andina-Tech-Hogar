import React, { useState } from 'react';
import Boton from './Boton';
import useCarrito from '../hooks/useCarrito';
import { MAX_CANTIDAD } from '../utils/carrito';
import { Image, StyleSheet, Text, View } from 'react-native';
import { formatoPrecio } from '../data/productos';
import { colores } from '../styles/theme';

export default function ProductoCard({ producto, ancho }) {
  const { agregar, lineas, cargando } = useCarrito();
  const [agregado, setAgregado] = useState(false);
  const cantidad = lineas.find((item) => item.id === producto.id)?.cantidad || 0;
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
      <View style={estilos.accion}><Boton titulo={cantidad >= MAX_CANTIDAD ? 'Máximo alcanzado' : 'Agregar al carrito'} etiqueta={`Agregar ${producto.nombre} al carrito`} disabled={cargando || cantidad >= MAX_CANTIDAD} onPress={() => { agregar(producto.id); setAgregado(true); }} /></View>
      <Text style={estilos.aviso} accessibilityLiveRegion="polite">{cantidad ? `${cantidad} en tu carrito${agregado ? ' · Agregado' : ''}` : 'Disponible para agregar'}</Text>
    </View>
  </View>;
}

const estilos = StyleSheet.create({
  card: { overflow: 'hidden', backgroundColor: colores.superficie, borderRadius: 18, borderWidth: 1, borderColor: colores.linea },
  imagenContenedor: { position: 'relative', backgroundColor: '#E7ECF3', aspectRatio: 1.22, alignItems: 'center', justifyContent: 'center' },
  imagen: { width: '76%', height: '76%' },
  etiqueta: { position: 'absolute', top: 12, left: 12, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, backgroundColor: colores.marino },
  etiquetaTexto: { color: '#FFFFFF', fontSize: 10, fontWeight: '800' },
  detalle: { padding: 15, flex: 1 },
  categoria: { color: colores.acentoOscuro, letterSpacing: 1.2, fontSize: 10, fontWeight: '900' },
  nombre: { fontSize: 15, fontWeight: '900', color: colores.texto, marginTop: 7 },
  descripcion: { fontSize: 12, color: colores.secundario, lineHeight: 18, marginTop: 5, minHeight: 36 },
  divisor: { height: 1, backgroundColor: colores.linea, marginVertical: 12 },
  accion: { marginTop: 14 },
  aviso: { color: colores.positivo, fontSize: 11, marginTop: 10, lineHeight: 16 },
  precio: { color: colores.marino, fontSize: 16, fontWeight: '900' }
});
