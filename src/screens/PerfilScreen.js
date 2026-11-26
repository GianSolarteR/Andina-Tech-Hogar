import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Alerta from '../components/Alerta';
import Boton from '../components/Boton';
import CampoFormulario from '../components/CampoFormulario';
import EstadoCarga from '../components/EstadoCarga';
import { consultarMiPerfil, actualizarMiPerfil } from '../services/perfilesService';
import { mensajeError } from '../services/authService';
import { validarPerfil } from '../utils/validaciones';
import form from '../styles/formStyles';
import { colores } from '../styles/theme';

export default function PerfilScreen({ usuario }) {
  const [perfil, setPerfil] = useState(null);
  const [datos, setDatos] = useState({ nombre: '', telefono: '' });
  const [cargando, setCargando] = useState(true);
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const activo = useRef(false);
  const bloqueo = useRef(false);
  const cargar = useCallback(async () => {
    if (!usuario?.id) return;
    try { const data = await consultarMiPerfil(); if (activo.current) { setPerfil(data); setError(''); } }
    catch (e) { if (activo.current) setError(mensajeError(e)); }
    finally { if (activo.current) setCargando(false); }
  }, [usuario?.id]);
  useEffect(() => {
    activo.current = true;
    // La función solo actualiza estado después de completar la petición asíncrona.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void cargar();
    return () => { activo.current = false; };
  }, [cargar]);
  function editar() {
    setDatos({ nombre: perfil.nombre_completo, telefono: perfil.telefono });
    setError(''); setExito(''); setEditando(true);
  }
  async function guardar() {
    if (bloqueo.current) return;
    const aviso = validarPerfil(datos);
    if (aviso) { setError(aviso); return; }
    bloqueo.current = true; setGuardando(true); setError(''); setExito('');
    try {
      const actualizado = await actualizarMiPerfil(datos);
      if (activo.current) { setPerfil(actualizado); setEditando(false); setExito('Tu perfil se actualizó correctamente.'); }
    } catch (e) { if (activo.current) setError(mensajeError(e)); }
    finally { bloqueo.current = false; if (activo.current) setGuardando(false); }
  }
  if (!usuario) return null;
  if (cargando) return <EstadoCarga texto="Cargando tu perfil…" />;
  const fecha = perfil?.created_at || usuario.created_at;
  const fechaTexto = fecha && !Number.isNaN(Date.parse(fecha)) ? new Date(fecha).toLocaleDateString('es-CO') : 'No disponible';
  return <View style={form.centrar}>
    <View style={form.cabecera}><Text style={form.titulo}>Mi perfil</Text><Text style={form.descripcion}>Tu información personal, siempre a mano.</Text></View>
    <View style={form.tarjeta}>
      <Alerta texto={error} /><Alerta texto={exito} tipo="exito" />
      {!perfil ? <Boton titulo="Reintentar cargar perfil" onPress={() => { setCargando(true); setError(''); cargar(); }} /> : <>
        {editando ? <>
          <CampoFormulario titulo="Nombre completo" valor={datos.nombre} onCambiar={(nombre) => setDatos((d) => ({ ...d, nombre }))} autoCapitalize="words" autoCompletar="name" maxLength={90} editable={!guardando} />
          <CampoFormulario titulo="Teléfono" valor={datos.telefono} onCambiar={(telefono) => setDatos((d) => ({ ...d, telefono }))} teclado="phone-pad" autoCompletar="tel" maxLength={20} editable={!guardando} />
        </> : <><Dato titulo="Nombre completo" valor={perfil.nombre_completo} /><Dato titulo="Teléfono" valor={perfil.telefono || 'No registrado'} /></>}
        <Dato titulo="Correo electrónico · solo lectura" valor={perfil.correo} />
        <Dato titulo="Rol registrado · solo lectura" valor={perfil.rol} />
        <Dato titulo="Cuenta creada" valor={fechaTexto} />
        <View style={s.acciones}>{editando ? <>
          <Boton titulo="Guardar cambios" onPress={guardar} cargando={guardando} />
          <Boton titulo="Cancelar" secundario disabled={guardando} onPress={() => { setEditando(false); setError(''); }} />
        </> : <Boton titulo="Editar perfil" onPress={editar} />}</View>
      </>}
    </View>
    <Text style={form.nota}>Por el alcance académico, tu nombre, correo y teléfono son visibles para los demás usuarios registrados.</Text>
  </View>;
}
function Dato({ titulo, valor }) { return <View style={s.dato}><Text style={s.etiqueta}>{titulo}</Text><Text selectable style={s.valor}>{valor}</Text></View>; }
const s = StyleSheet.create({ dato: { marginBottom: 20 }, etiqueta: { color: colores.secundario, fontSize: 12, marginBottom: 7 }, valor: { color: colores.marino, fontSize: 16, fontWeight: '700', flexShrink: 1 }, acciones: { gap: 10, marginTop: 10 } });
