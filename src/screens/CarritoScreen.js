import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import CarritoItem from '../components/CarritoItem';
import Boton from '../components/Boton';
import EstadoCarga from '../components/EstadoCarga';
import useCarrito from '../hooks/useCarrito';
import { formatoPrecio } from '../data/productos';
import { colores } from '../styles/theme';
export default function CarritoScreen() {
  const { lineas, total, cantidad, cargando, vaciar } = useCarrito();
  const [confirmando, setConfirmando] = useState(false);
  if (cargando) return <EstadoCarga texto="Recuperando tu carrito…" />;
  return <View style={s.contenedor}>
    <Text style={s.titulo}>Tu carrito</Text><Text style={s.descripcion}>{cantidad} unidades · Precios en pesos colombianos (COP)</Text>
    {!lineas.length ? <View style={s.vacio}><Text style={s.subtitulo}>Tu carrito está vacío</Text><Text style={s.descripcion}>Encuentra algo para ti y para tu hogar. Puedes agregar productos sin crear una cuenta.</Text><Boton titulo="Explorar catálogo" onPress={() => router.navigate('/')} /></View> : <>
      {lineas.map((item) => <CarritoItem key={item.id} item={item} />)}
      <View style={s.resumen}><Text style={s.subtitulo}>Total de productos</Text><Text style={s.total}>{formatoPrecio(total)}</Text>
        <Text style={s.descripcion}>Demostración académica. No se realizan pedidos, cobros ni transacciones. No incluye cálculo de envío.</Text>
        <Boton titulo="Seguir explorando" onPress={() => router.navigate('/')} />
        {confirmando ? <><Text style={s.descripcion}>¿Quieres eliminar todos los productos del carrito?</Text><Boton titulo="Sí, vaciar carrito" onPress={() => { vaciar(); setConfirmando(false); }} /><Boton titulo="Cancelar" secundario onPress={() => setConfirmando(false)} /></> : <Boton titulo="Vaciar carrito" secundario onPress={() => setConfirmando(true)} />}
      </View>
    </>}
  </View>;
}
const s = StyleSheet.create({ contenedor: { gap: 16, maxWidth: 850, width: '100%', alignSelf: 'center' }, titulo: { fontSize: 30, fontWeight: '900', color: colores.marino }, descripcion: { color: colores.secundario, lineHeight: 21, fontSize: 13 }, vacio: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 24, gap: 20 }, subtitulo: { color: colores.marino, fontWeight: '800', fontSize: 19 }, resumen: { borderWidth: 1, borderColor: colores.linea, borderRadius: 18, backgroundColor: '#FFFFFF', padding: 24, gap: 16 }, total: { color: colores.marino, fontWeight: '900', fontSize: 28 } });
