import React, { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import Alerta from '../components/Alerta';
import CampoFormulario from '../components/CampoFormulario';
import { supabaseConfigurado } from '../config/supabase';
import { iniciarSesion, mensajeError } from '../services/authService';
import estilos from '../styles/formStyles';
import { colores } from '../styles/theme';
import { validarLogin } from '../utils/validaciones';

export default function LoginScreen({ onRegistrarse, onExito }) {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  async function enviar() {
    const aviso = validarLogin({ correo, contrasena });
    if (aviso) { setError(aviso); return; }
    setCargando(true);
    setError('');
    try {
      await iniciarSesion({ correo, contrasena });
      onExito();
    } catch (e) {
      setError(mensajeError(e));
    } finally { setCargando(false); }
  }

  return <View style={estilos.centrar}>
    <View style={estilos.cabecera}>
      <View style={estilos.icono}><Text style={estilos.iconoTexto}>↪</Text></View>
      <Text style={estilos.titulo}>Bienvenido de nuevo</Text>
      <Text style={estilos.descripcion}>Accede con tu cuenta para consultar el panel de usuarios registrados.</Text>
    </View>
    <View style={estilos.tarjeta}>
      {!supabaseConfigurado && <Alerta texto="Configura las variables de Supabase en .env para activar el inicio de sesión." />}
      <CampoFormulario titulo="Correo electrónico" valor={correo} onCambiar={setCorreo} placeholder="correo@ejemplo.com" teclado="email-address" autoCompletar="email" />
      <CampoFormulario titulo="Contraseña" valor={contrasena} onCambiar={setContrasena} placeholder="Tu contraseña" seguro autoCompletar="current-password" />
      <Alerta texto={error} />
      <Pressable onPress={enviar} disabled={cargando || !supabaseConfigurado} style={[estilos.boton, (cargando || !supabaseConfigurado) && estilos.botonDeshabilitado]} accessibilityRole="button">
        {cargando ? <ActivityIndicator color="#FFFFFF" /> : <Text style={estilos.botonTexto}>Iniciar sesión</Text>}
      </Pressable>
      <Pressable onPress={onRegistrarse} style={estilos.enlaceCentro} accessibilityRole="button">
        <Text style={estilos.enlaceTexto}>¿No tienes cuenta? Regístrate</Text>
      </Pressable>
    </View>
    <Text style={[estilos.nota, { color: colores.secundario }]}>Tu contraseña se verifica mediante Supabase Auth; no se muestra en el panel.</Text>
  </View>;
}
