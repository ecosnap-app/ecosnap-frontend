import { Redirect } from 'expo-router';
import { Cargando } from '../src/components';
import { useSesion } from '../src/viewmodels/SesionProvider';

/**
 * Puerta de entrada: decide a dónde mandar al usuario.
 *
 * Este es el guard de rutas del Sprint 4 (HU-04). Ya funciona: mientras el
 * repositorio esté en modo demo devuelve `null` y manda a Bienvenida; cuando
 * Supabase esté configurado devolverá la sesión guardada en SecureStore y
 * el usuario entrará directo a Inicio.
 */
export default function Entrada() {
  const { sesion, cargando } = useSesion();

  if (cargando) return <Cargando />;
  return <Redirect href={sesion ? '/inicio' : '/bienvenida'} />;
}
