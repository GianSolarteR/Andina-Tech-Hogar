import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim();
const clave = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

// El catálogo se puede explorar sin credenciales configuradas.
export const supabaseConfigurado = Boolean(
  url && clave && url.startsWith('https://') && !url.includes('TU_PROYECTO') && !clave.startsWith('TU_')
);

export const supabase = supabaseConfigurado
  ? createClient(url, clave, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false
      }
    })
  : null;
