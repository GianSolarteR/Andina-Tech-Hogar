import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import ProductoCard from './ProductoCard';
import { productos } from '../data/productos';
import { colores } from '../styles/theme';

const filtros = ['Todos', 'Tecnología', 'Hogar'];

export default function Catalogo({ onRegistrarse }) {
  const { width } = useWindowDimensions();
  const [filtro, setFiltro] = useState('Todos');
  const mostrados = useMemo(() => productos.filter((p) => filtro === 'Todos' || p.categoria === filtro), [filtro]);
  const anchoArea = Math.min(width - 36, 1120 - 36);
  const columnas = anchoArea >= 850 ? 4 : anchoArea >= 560 ? 3 : 2;
  const anchoCard = (anchoArea - (columnas - 1) * 12) / columnas;

  return <>
    <View style={[estilos.hero, width < 600 && estilos.heroMovil]}>
      <View style={estilos.heroTexto}>
        <Text style={estilos.superior}>CATÁLOGO DIGITAL</Text>
        <Text style={[estilos.heroTitulo, width < 600 && { fontSize: 31 }]}>Tu mundo tech.{'\n'}Tu espacio ideal.</Text>
        <Text style={estilos.heroDescripcion}>Explora artículos de tecnología y hogar en un mismo lugar. Sin necesidad de crear una cuenta.</Text>
        <Pressable onPress={onRegistrarse} style={estilos.boton} accessibilityRole="button">
          <Text style={estilos.botonTexto}>Crear una cuenta  →</Text>
        </Pressable>
      </View>
      {width >= 600 && <View style={estilos.decoracion}>
        <View style={estilos.circuloExterior}><View style={estilos.circuloInterior}><Text style={estilos.decoracionTexto}>A</Text></View></View>
        <Text style={estilos.decoracionSub}>TECH  ·  HOGAR</Text>
      </View>}
    </View>
    <View style={estilos.meta}>
      <View><Text style={estilos.titulo}>Descubre nuestros productos</Text><Text style={estilos.bajada}>Encuentra inspiración para tu día a día.</Text></View>
      <Text style={estilos.contador}>{mostrados.length} productos</Text>
    </View>
    <View style={estilos.filtros}>
      {filtros.map((item) => <Pressable key={item} onPress={() => setFiltro(item)}
        style={[estilos.filtro, filtro === item && estilos.filtroActivo]}
        accessibilityRole="button" accessibilityState={{ selected: filtro === item }}>
        <Text style={[estilos.filtroTexto, filtro === item && estilos.filtroTextoActivo]}>{item}</Text>
      </Pressable>)}
    </View>
    <View style={estilos.grid}>
      {mostrados.map((producto) => <ProductoCard key={producto.id} producto={producto} ancho={anchoCard} />)}
    </View>
    <Text style={estilos.nota}>* Catálogo y precios ilustrativos elaborados para el taller académico.</Text>
  </>;
}

const estilos = StyleSheet.create({
  hero: { backgroundColor: colores.marinoClaro, borderRadius: 23, padding: 34, minHeight: 260, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', overflow: 'hidden' },
  heroMovil: { padding: 24, minHeight: 272 },
  heroTexto: { flex: 1, zIndex: 1 },
  superior: { fontSize: 11, fontWeight: '900', color: colores.acento, letterSpacing: 2, marginBottom: 13 },
  heroTitulo: { color: '#FFFFFF', fontWeight: '900', fontSize: 40, lineHeight: 45, letterSpacing: -0.8 },
  heroDescripcion: { color: '#D5E0EC', fontSize: 13, lineHeight: 21, maxWidth: 440, marginTop: 14 },
  boton: { alignSelf: 'flex-start', marginTop: 19, backgroundColor: colores.acento, borderRadius: 11, paddingVertical: 12, paddingHorizontal: 17 },
  botonTexto: { color: colores.marino, fontSize: 13, fontWeight: '900' },
  decoracion: { width: 280, alignItems: 'center', justifyContent: 'center' },
  circuloExterior: { height: 205, width: 205, borderRadius: 105, borderWidth: 22, borderColor: '#3D506A', justifyContent: 'center', alignItems: 'center', transform: [{ rotate: '-15deg' }] },
  circuloInterior: { height: 140, width: 140, borderRadius: 70, backgroundColor: colores.acento, justifyContent: 'center', alignItems: 'center' },
  decoracionTexto: { color: colores.marino, fontWeight: '900', fontSize: 92 },
  decoracionSub: { color: '#9AAEC7', fontSize: 11, letterSpacing: 4, fontWeight: '900', marginTop: 7 },
  meta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 8, marginTop: 35 },
  titulo: { fontSize: 24, fontWeight: '900', color: colores.marino },
  bajada: { fontSize: 13, color: colores.secundario, marginTop: 7 },
  contador: { fontSize: 12, color: colores.secundario, fontWeight: '800' },
  filtros: { flexDirection: 'row', gap: 9, marginTop: 22, marginBottom: 18, flexWrap: 'wrap' },
  filtro: { borderWidth: 1, borderColor: colores.linea, backgroundColor: '#FFFFFF', paddingHorizontal: 17, paddingVertical: 10, borderRadius: 11 },
  filtroActivo: { backgroundColor: colores.marino, borderColor: colores.marino },
  filtroTexto: { fontSize: 12, color: colores.secundario, fontWeight: '800' },
  filtroTextoActivo: { color: '#FFFFFF' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, alignItems: 'stretch' },
  nota: { fontSize: 11, color: colores.secundario, marginTop: 22 }
});
