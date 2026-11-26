import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { productos } from '../data/productos';
import { cambiarCantidad, normalizarCarrito, resumirCarrito } from '../utils/carrito';

export const CLAVE_CARRITO = 'andina:carrito:v1';
const CarritoContext = createContext(null);
export function CarritoProvider({ children }) {
  const [items, setItems] = useState([]);
  const actuales = useRef([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const cola = useRef(Promise.resolve());
  useEffect(() => {
    let activo = true;
    AsyncStorage.getItem(CLAVE_CARRITO).then((valor) => {
      if (activo) {
        actuales.current = normalizarCarrito(valor ? JSON.parse(valor) : [], productos);
        setItems(actuales.current);
      }
    }).catch(() => {
      if (activo) setError('No se pudo recuperar el carrito guardado. Puedes seguir comprando; revisa el almacenamiento del dispositivo.');
    }).finally(() => { if (activo) setCargando(false); });
    return () => { activo = false; };
  }, []);

  // No escribir antes de hidratar; serializar evita persistir una versión anterior.
  const cambiar = (transformar) => {
    if (cargando) return;
    const siguientes = transformar(actuales.current);
    actuales.current = siguientes;
    setItems(siguientes);
    cola.current = cola.current.then(() => AsyncStorage.setItem(CLAVE_CARRITO, JSON.stringify(siguientes)))
      .then(() => setError('')).catch(() => setError('El carrito cambió, pero no pudo guardarse. No cierres la página y vuelve a intentar.'));
  };
  const valor = { ...resumirCarrito(items, productos), cargando, error,
    agregar: (id) => cambiar((actual) => cambiarCantidad(actual, id, 1, productos)),
    disminuir: (id) => cambiar((actual) => cambiarCantidad(actual, id, -1, productos)),
    eliminar: (id) => cambiar((actual) => actual.filter((item) => item.id !== id)),
    vaciar: () => cambiar(() => []), reintentar: () => cambiar((actual) => actual)
  };
  return <CarritoContext.Provider value={valor}>{children}</CarritoContext.Provider>;
}
export default function useCarrito() {
  const contexto = useContext(CarritoContext);
  if (!contexto) throw new Error('useCarrito requiere CarritoProvider.');
  return contexto;
}
