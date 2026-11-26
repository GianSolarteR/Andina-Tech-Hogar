import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../config/supabase';

function useSesionSupabase() {
  const [sesion, setSesion] = useState(null);
  const [cargando, setCargando] = useState(Boolean(supabase));

  useEffect(() => {
    if (!supabase) return;
    let activo = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_evento, nuevaSesion) => {
      if (activo) {
        setSesion(nuevaSesion);
        setCargando(false);
      }
    });

    supabase.auth.getSession().then(({ data, error }) => {
      if (activo) {
        if (!error) setSesion(data.session);
        setCargando(false);
      }
    }).catch(() => { if (activo) setCargando(false); });

    return () => { activo = false; subscription.unsubscribe(); };
  }, []);

  return { sesion, usuario: sesion?.user || null, cargando };
}

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const estado = useSesionSupabase();
  return <AuthContext.Provider value={estado}>{children}</AuthContext.Provider>;
}
export default function useAuth() {
  const estado = useContext(AuthContext);
  if (!estado) throw new Error('useAuth requiere AuthProvider.');
  return estado;
}
