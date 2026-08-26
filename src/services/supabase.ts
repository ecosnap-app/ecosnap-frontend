import 'react-native-url-polyfill/auto';
import * as SecureStore from 'expo-secure-store';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env, MODO_DEMO } from './env';

/**
 * Almacén seguro para el token de sesión.
 *
 * Criterio "Seguridad Móvil" del Sprint 4: el token NUNCA se guarda en texto
 * plano. SecureStore usa el Keychain en iOS y el Keystore en Android.
 */
const almacenSeguro = {
  getItem: (clave: string) => SecureStore.getItemAsync(clave),
  setItem: (clave: string, valor: string) => SecureStore.setItemAsync(clave, valor),
  removeItem: (clave: string) => SecureStore.deleteItemAsync(clave),
};

/**
 * Cliente de Supabase.
 *
 * Es `null` mientras no existan las credenciales en .env (modo demo del
 * Sprint 3). Los repositorios ya preguntan por esto, así que en el Sprint 4
 * solo hay que llenar el .env: no se cambia una línea de este archivo.
 */
export const supabase: SupabaseClient | null = MODO_DEMO
  ? null
  : createClient(env.supabaseUrl, env.supabaseAnonKey, {
      auth: {
        storage: almacenSeguro,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });

/** Devuelve el cliente o lanza un error claro si falta configurarlo. */
export function exigirSupabase(): SupabaseClient {
  if (!supabase) {
    throw new Error(
      'Supabase no está configurado. Copia .env.example a .env y llena ' +
        'EXPO_PUBLIC_SUPABASE_URL y EXPO_PUBLIC_SUPABASE_ANON_KEY.'
    );
  }
  return supabase;
}
