import React, { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import Alerta from '../components/Alerta';
import CampoFormulario from '../components/CampoFormulario';
import { supabaseConfigurado } from '../config/supabase';
import { mensajeError, registrarUsuario } from '../services/authService';
import estilos from '../styles/formStyles';
import { validarRegistro } from '../utils/validaciones';

const inicial = { nombre: '', correo: '', telefono: '', contrasena: '', confirmar: '' };

export default function RegistroScreen({ onIrLogin, onExito }) {
  const [datos, setDatos] = useState(inicial);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [confirmarCorreo, setConfirmarCorreo] = useState(false);

  function cambiar(campo, valor) { setDatos((actual) => ({ ...actual, [campo]: valor })); }

  async function enviar() {
    const aviso = validarRegistro(datos);
    if (aviso) { setError(aviso); return; }
    setError('');
    setCargando(true);
    try {
      const resultado = await registrarUsuario(datos);
      setDatos(inicial);
      if (resultado.session) onExito();
      else setConfirmarCorreo(true);
    } catch (e) {
      setError(mensajeError(e));
    } finally { setCargando(false); }
  }

  return <View style={estilos.centrar}>
    <View style={estilos.cabecera}>
      <View style={estilos.icono}><Text style={estilos.iconoTexto}>＋</Text></View>
      <Text style={estilos.titulo}>Crea tu cuenta</Text>
      <Text style={estilos.descripcion}>Regístrate para acceder a la información de usuarios en el panel privado.</Text>
    </View>
    <View style={estilos.tarjeta}>
      {!supabaseConfigurado && <Alerta texto="Configura las variables de Supabase en .env para habilitar el registro." />}
      {confirmarCorreo ? <>
        <Alerta tipo="exito" texto="Registro recibido. Revisa tu correo para confirmar la cuenta (si la verificación está activada) y después inicia sesión." />
        <Pressable onPress={onIrLogin} style={estilos.boton} accessibilityRole="button"><Text style={estilos.botonTexto}>Ir a iniciar sesión</Text></Pressable>
      </> : <>
        <CampoFormulario titulo="Nombre completo" valor={datos.nombre} onCambiar={(v) => cambiar('nombre', v)} placeholder="Tu nombre y apellido" autoCapitalize="words" maxLength={90} autoCompletar="name" />
        <CampoFormulario titulo="Correo electrónico" valor={datos.correo} onCambiar={(v) => cambiar('correo', v)} placeholder="correo@ejemplo.com" teclado="email-address" autoCompletar="email" maxLength={160} />
        <CampoFormulario titulo="Teléfono" valor={datos.telefono} onCambiar={(v) => cambiar('telefono', v)} placeholder="300 123 4567" teclado="phone-pad" autoCompletar="tel" maxLength={20} />
        <CampoFormulario titulo="Contraseña" valor={datos.contrasena} onCambiar={(v) => cambiar('contrasena', v)} placeholder="Mínimo 8 caracteres" seguro autoCompletar="new-password" />
        <CampoFormulario titulo="Confirmar contraseña" valor={datos.confirmar} onCambiar={(v) => cambiar('confirmar', v)} placeholder="Escribe de nuevo la contraseña" seguro autoCompletar="new-password" />
        <Alerta texto={error} />
        <Pressable onPress={enviar} disabled={cargando || !supabaseConfigurado} style={[estilos.boton, (cargando || !supabaseConfigurado) && estilos.botonDeshabilitado]} accessibilityRole="button">
          {cargando ? <ActivityIndicator color="#FFFFFF" /> : <Text style={estilos.botonTexto}>Registrarme</Text>}
        </Pressable>
        <Pressable onPress={onIrLogin} style={estilos.enlaceCentro} accessibilityRole="button"><Text style={estilos.enlaceTexto}>¿Ya tienes cuenta? Inicia sesión</Text></Pressable>
        <Text style={estilos.nota}>El rol inicial es «cliente». La contraseña se almacena de forma segura en Supabase Auth, no en la tabla de perfiles.</Text>
      </>}
    </View>
  </View>;
}
