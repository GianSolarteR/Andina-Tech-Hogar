import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Boton from './Boton';
import useCarrito from '../hooks/useCarrito';
import { MAX_CANTIDAD } from '../utils/carrito';
import { formatoPrecio } from '../data/productos';
import { colores } from '../styles/theme';
export default function CarritoItem({ item }) {
  const { agregar, disminuir, eliminar } = useCarrito();
  const { producto, cantidad, subtotal } = item;
  return <View style={s.tarjeta}>
    <View style={s.producto}><Image source={producto.imagen} resizeMode="contain" style={s.imagen} accessibilityLabel={producto.nombre} />
      <View style={s.info}><Text style={s.nombre}>{producto.nombre}</Text><Text style={s.precio}>{formatoPrecio(producto.precio)} / unidad</Text></View>
    </View>
    <View style={s.pie}>
      <View style={s.cantidad}>
        <Boton titulo="−" etiqueta={`Disminuir cantidad de ${producto.nombre}`} secundario disabled={cantidad <= 1} onPress={() => disminuir(item.id)} />
        <Text style={s.numero} accessibilityLabel={`Cantidad: ${cantidad}`}>{cantidad}</Text>
        <Boton titulo="+" etiqueta={`Aumentar cantidad de ${producto.nombre}`} secundario disabled={cantidad >= MAX_CANTIDAD} onPress={() => agregar(item.id)} />
      </View>
      <Text style={s.subtotal}>Subtotal: {formatoPrecio(subtotal)}</Text>
      <Boton titulo="Eliminar" etiqueta={`Eliminar ${producto.nombre}`} secundario onPress={() => eliminar(item.id)} />
    </View>
    {cantidad >= MAX_CANTIDAD && <Text style={s.precio}>Máximo {MAX_CANTIDAD} unidades por producto.</Text>}
  </View>;
}
const s = StyleSheet.create({
  tarjeta: { backgroundColor: '#FFFFFF', borderColor: colores.linea, borderWidth: 1, borderRadius: 16, padding: 16, gap: 16 },
  producto: { flexDirection: 'row', alignItems: 'center', gap: 16 }, imagen: { width: 80, height: 80, backgroundColor: '#F5F7FB', borderRadius: 12 }, info: { flex: 1 },
  nombre: { fontSize: 16, fontWeight: '800', color: colores.marino }, precio: { fontSize: 12, color: colores.secundario, marginTop: 6, lineHeight: 19 },
  pie: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }, cantidad: { flexDirection: 'row', alignItems: 'center', gap: 12 }, numero: { fontWeight: '800', color: colores.marino, minWidth: 24, textAlign: 'center' }, subtotal: { color: colores.marino, fontWeight: '800', fontSize: 14 }
});
