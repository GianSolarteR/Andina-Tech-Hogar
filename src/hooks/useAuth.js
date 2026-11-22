import { useEffect, useState } from 'react';
import { supabase } from '../config/supabase';

export default function useAuth() {
  const [sesion, setSesion] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setCargando(false);
      return;
    }
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
