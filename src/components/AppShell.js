import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Slot, router, usePathname } from 'expo-router';
import Header from './Header';
import NavBar from './NavBar';
import MenuHamburguesa from './MenuHamburguesa';
import WorkArea from './WorkArea';
import Footer from './Footer';
import Alerta from './Alerta';
import Boton from './Boton';
import useAuth from '../hooks/useAuth';
import useCarrito from '../hooks/useCarrito';
import { cerrarSesion, mensajeError } from '../services/authService';
import { rutas } from '../config/navegacion';
import { colores } from '../styles/theme';
export default function AppShell() {
  const { sesion, usuario } = useAuth();
  const { cantidad, error: errorCarrito, reintentar } = useCarrito();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [error, setError] = useState('');
  const saliendo = useRef(false);
  const scroll = useRef(null);
  const pathname = usePathname();
  const vista = Object.keys(rutas).find((id) => rutas[id] === pathname);
  useEffect(() => { scroll.current?.scrollTo({ y: 0, animated: false }); }, [pathname]);
  function navegar(destino) { setMenuAbierto(false); setError(''); router.navigate(rutas[destino]); }
  async function salir() {
    if (saliendo.current) return;
    saliendo.current = true;
    setMenuAbierto(false);
    try { await cerrarSesion(); router.replace('/'); }
    catch (e) { setError(mensajeError(e)); }
    finally { saliendo.current = false; }
  }
  return <SafeAreaView style={s.raiz} edges={['top', 'bottom', 'left', 'right']}>
    <StatusBar style="light" />
    <Header onAbrirMenu={() => setMenuAbierto(true)} onInicio={() => navegar('inicio')} sesion={sesion} />
    <NavBar vista={vista} autenticado={Boolean(sesion)} cantidad={cantidad} onNavegar={navegar} onSalir={salir} />
    <ScrollView ref={scroll} contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
      <WorkArea><Alerta texto={error} /><Alerta texto={errorCarrito} />
        {errorCarrito ? <Boton titulo="Reintentar guardar carrito" secundario onPress={reintentar} /> : null}<Slot />
      </WorkArea><Footer />
    </ScrollView>
    <MenuHamburguesa visible={menuAbierto} onCerrar={() => setMenuAbierto(false)} autenticado={Boolean(sesion)}
      correo={usuario?.email} cantidad={cantidad} onNavegar={navegar} onSalir={salir} />
  </SafeAreaView>;
}
const s = StyleSheet.create({ raiz: { flex: 1, backgroundColor: colores.fondo }, scroll: { flexGrow: 1 } });
