import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Catalogo from './src/components/Catalogo';
import Footer from './src/components/Footer';
import Header from './src/components/Header';
import MenuHamburguesa from './src/components/MenuHamburguesa';
import NavBar from './src/components/NavBar';
import WorkArea from './src/components/WorkArea';
import useAuth from './src/hooks/useAuth';
import LoginScreen from './src/screens/LoginScreen';
import RegistroScreen from './src/screens/RegistroScreen';
import UsuariosScreen from './src/screens/UsuariosScreen';
import { cerrarSesion, mensajeError } from './src/services/authService';
import { colores } from './src/styles/theme';

export default function App() {
  const [vista, setVista] = useState('inicio');
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [ingresoPendiente, setIngresoPendiente] = useState(false);
  const { sesion, usuario, cargando } = useAuth();
  const desplazamiento = useRef(null);

  // Regla adicional a la interfaz: Supabase restringe SELECT con RLS.
  useEffect(() => {
    if (!cargando && !sesion && vista === 'usuarios') setVista('inicio');
    if (!cargando && sesion && (vista === 'login' || vista === 'registro' || ingresoPendiente)) {
      setVista('usuarios');
      setIngresoPendiente(false);
    }
  }, [cargando, sesion, vista, ingresoPendiente]);

  function navegar(destino) {
    setMenuAbierto(false);
    setIngresoPendiente(false);
    setVista(destino === 'usuarios' && !sesion ? 'login' : destino);
    desplazamiento.current?.scrollTo({ y: 0, animated: true });
  }

  async function salir() {
    try {
      await cerrarSesion();
      navegar('inicio');
    } catch (error) {
      Alert.alert('No se pudo cerrar sesión', mensajeError(error));
    }
  }

  function mostrarPantalla() {
    if (cargando) return <View style={estilos.cargando}><ActivityIndicator size="large" color={colores.marino} /><Text style={estilos.cargandoTexto}>Restaurando sesión…</Text></View>;
    if (vista === 'login' && !sesion) return <LoginScreen onRegistrarse={() => navegar('registro')} onExito={() => setIngresoPendiente(true)} />;
    if (vista === 'registro' && !sesion) return <RegistroScreen onIrLogin={() => navegar('login')} onExito={() => setIngresoPendiente(true)} />;
    if (vista === 'usuarios' && sesion) return <UsuariosScreen usuario={usuario} />;
    // La página Index pública se resuelve directamente desde App.js.
    return <Catalogo onRegistrarse={() => navegar(sesion ? 'usuarios' : 'registro')} />;
  }

  return <SafeAreaProvider>
    <SafeAreaView style={estilos.raiz} edges={['top', 'left', 'right']}>
      <StatusBar style="light" backgroundColor={colores.marino} />
      <Header onAbrirMenu={() => setMenuAbierto(true)} onInicio={() => navegar('inicio')} sesion={sesion} />
      <NavBar vista={vista} autenticado={Boolean(sesion)} onNavegar={navegar} onSalir={salir} />
      <ScrollView ref={desplazamiento} contentContainerStyle={estilos.scroll} keyboardShouldPersistTaps="handled">
        <WorkArea>{mostrarPantalla()}</WorkArea>
        <Footer />
      </ScrollView>
      <MenuHamburguesa visible={menuAbierto} onCerrar={() => setMenuAbierto(false)}
        autenticado={Boolean(sesion)} correo={usuario?.email} onNavegar={navegar} onSalir={salir} />
    </SafeAreaView>
  </SafeAreaProvider>;
}

const estilos = StyleSheet.create({
  raiz: { flex: 1, backgroundColor: colores.fondo },
  scroll: { flexGrow: 1 },
  cargando: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 70 },
  cargandoTexto: { marginTop: 13, color: colores.secundario, fontSize: 13 }
});
