import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import Alerta from '../components/Alerta';
import { mensajeError } from '../services/authService';
import { consultarUsuarios, observarUsuarios } from '../services/usuariosService';
import { colores } from '../styles/theme';

export default function UsuariosScreen({ usuario }) {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cargar = useCallback(async () => {
    try {
      const datos = await consultarUsuarios();
      setUsuarios(datos);
      setError('');
    } catch (e) { setError(mensajeError(e)); }
    finally { setCargando(false); }
  }, []);

  useEffect(() => {
    cargar();
    const cancelar = observarUsuarios(() => { cargar(); });
    return cancelar;
  }, [cargar]);

  return <View>
    <View style={estilos.cabecera}>
      <View style={{ flex: 1 }}><Text style={estilos.sobrelinea}>ÁREA PRIVADA · SESIÓN AUTENTICADA</Text><Text style={estilos.titulo}>Usuarios registrados</Text>
        <Text style={estilos.bajada}>Consulta en tiempo real los perfiles guardados en Supabase.</Text></View>
      <View style={estilos.contador}><Text style={estilos.numero}>{usuarios.length}</Text><Text style={estilos.numeroTexto}>Registros</Text></View>
    </View>
    <View style={estilos.barraSesion}><Text style={estilos.barraSesionTexto}>Sesión: {usuario?.email || 'Usuario autenticado'}</Text>
      <Pressable onPress={cargar} accessibilityRole="button" style={estilos.refrescar}><Text style={estilos.refrescarTexto}>Actualizar ↻</Text></Pressable>
    </View>
    <Alerta texto={error} />
    {cargando ? <View style={estilos.cargando}><ActivityIndicator size="large" color={colores.marino} /><Text style={estilos.bajada}>Cargando usuarios…</Text></View>
      : usuarios.length === 0 ? <View style={estilos.vacio}><Text style={estilos.vacioTitulo}>Aún no hay perfiles visibles</Text><Text style={estilos.bajada}>Crea una cuenta o revisa las políticas SQL de Supabase.</Text></View>
      : <View style={estilos.lista}>
        {usuarios.map((perfil) => <View key={perfil.id} style={estilos.fila}>
          <View style={estilos.avatar}><Text style={estilos.avatarTexto}>{(perfil.nombre_completo || 'U').charAt(0).toUpperCase()}</Text></View>
          <View style={estilos.info}>
            <Text style={estilos.nombre}>{perfil.nombre_completo}</Text>
            <Text style={estilos.correo}>{perfil.correo}</Text>
            <Text style={estilos.telefono}>Tel. {perfil.telefono || 'No registrado'}</Text>
          </View>
          <View style={estilos.rol}><Text style={estilos.rolTexto}>{perfil.rol || 'cliente'}</Text></View>
        </View>)}
      </View>}
    <View style={estilos.privacidad}><Text style={estilos.privacidadTexto}>Este directorio es visible únicamente con sesión iniciada. Las contraseñas nunca se consultan ni se muestran.</Text></View>
  </View>;
}

const estilos = StyleSheet.create({
  cabecera: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 21 },
  sobrelinea: { fontSize: 11, fontWeight: '900', color: colores.acentoOscuro, letterSpacing: 1.6, marginBottom: 8 },
  titulo: { fontSize: 28, fontWeight: '900', color: colores.marino },
  bajada: { color: colores.secundario, fontSize: 13, lineHeight: 21, marginTop: 7 },
  contador: { backgroundColor: colores.marino, borderRadius: 15, minWidth: 95, alignItems: 'center', padding: 16 },
  numero: { color: '#FFFFFF', fontWeight: '900', fontSize: 27 },
  numeroTexto: { color: '#D8E3F0', fontSize: 11, marginTop: 2 },
  barraSesion: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 9, backgroundColor: '#E9F0F8', paddingVertical: 11, paddingHorizontal: 14, borderRadius: 12, marginBottom: 15 },
  barraSesionTexto: { color: colores.marinoClaro, fontSize: 12, fontWeight: '700', flexShrink: 1 },
  refrescar: { paddingVertical: 6, paddingHorizontal: 11 },
  refrescarTexto: { color: colores.acentoOscuro, fontSize: 12, fontWeight: '900' },
  cargando: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  vacio: { alignItems: 'center', padding: 40, backgroundColor: '#FFFFFF', borderRadius: 15 },
  vacioTitulo: { color: colores.marino, fontWeight: '900', fontSize: 17 },
  lista: { backgroundColor: '#FFFFFF', borderRadius: 17, borderWidth: 1, borderColor: colores.linea, overflow: 'hidden' },
  fila: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderColor: colores.linea, gap: 13 },
  avatar: { width: 45, height: 45, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: '#E9F0F8' },
  avatarTexto: { color: colores.marino, fontSize: 20, fontWeight: '900' },
  info: { flex: 1, minWidth: 0 },
  nombre: { color: colores.marino, fontWeight: '900', fontSize: 14 },
  correo: { color: colores.secundario, fontSize: 12, marginTop: 4 },
  telefono: { color: colores.secundario, fontSize: 11, marginTop: 4 },
  rol: { backgroundColor: colores.positivoFondo, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 9 },
  rolTexto: { color: colores.positivo, fontSize: 10, fontWeight: '900' },
  privacidad: { paddingVertical: 15, paddingHorizontal: 6 },
  privacidadTexto: { fontSize: 11, color: colores.secundario, lineHeight: 19 }
});
