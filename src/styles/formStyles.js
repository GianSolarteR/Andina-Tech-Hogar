import { StyleSheet } from 'react-native';
import { colores } from './theme';

export default StyleSheet.create({
  centrar: { width: '100%', maxWidth: 490, alignSelf: 'center', paddingTop: 15 },
  cabecera: { alignItems: 'center', marginBottom: 24 },
  icono: { width: 56, height: 56, borderRadius: 17, backgroundColor: '#E8EEF7', justifyContent: 'center', alignItems: 'center', marginBottom: 14 },
  iconoTexto: { color: colores.marino, fontWeight: '900', fontSize: 26 },
  titulo: { fontSize: 27, color: colores.marino, fontWeight: '900', textAlign: 'center' },
  descripcion: { marginTop: 9, fontSize: 13, color: colores.secundario, lineHeight: 20, textAlign: 'center' },
  tarjeta: { backgroundColor: '#FFFFFF', padding: 24, borderWidth: 1, borderColor: colores.linea, borderRadius: 19 },
  boton: { backgroundColor: colores.marino, padding: 15, borderRadius: 11, alignItems: 'center', marginTop: 8 },
  botonDeshabilitado: { opacity: 0.65 },
  botonTexto: { color: '#FFFFFF', fontWeight: '900', fontSize: 14 },
  enlaceCentro: { alignSelf: 'center', paddingVertical: 13, paddingHorizontal: 6, marginTop: 8 },
  enlaceTexto: { fontSize: 13, fontWeight: '800', color: colores.acentoOscuro },
  nota: { fontSize: 11, color: colores.secundario, marginTop: 12, lineHeight: 17, textAlign: 'center' }
});
