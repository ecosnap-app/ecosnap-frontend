import { Redirect, Stack } from 'expo-router';
import { Cargando } from '../../src/components';
import { useSesion } from '../../src/viewmodels/SesionProvider';

/**
 * Rutas protegidas.
 *
 * Si no hay sesión, nadie entra: se devuelve al usuario a Bienvenida.
 * Esto cumple el criterio del Sprint 4 de que las pantallas protegidas no
 * sean accesibles con el botón "atrás" después de cerrar sesión.
 */
export default function LayoutApp() {
  const { sesion, cargando } = useSesion();

  if (cargando) return <Cargando />;
  if (!sesion) return <Redirect href="/bienvenida" />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="analizando" options={{ presentation: 'modal' }} />
      <Stack.Screen name="resultado" />
      <Stack.Screen name="impacto" />
      <Stack.Screen name="guia" />
    </Stack>
  );
}
