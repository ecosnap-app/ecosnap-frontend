import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SesionProvider, useSesion } from '../src/viewmodels/SesionProvider';

/**
 * Layout raíz de la aplicación.
 *
 * Aquí se monta el ViewModel de sesión, que envuelve toda la app: cualquier
 * pantalla puede preguntar si hay usuario autenticado.
 */
export default function LayoutRaiz() {
  return (
    <SafeAreaProvider>
      <SesionProvider>
        <StatusBar style="dark" />
        <Rutas />
      </SesionProvider>
    </SafeAreaProvider>
  );
}

/**
 * #46: grupos protegidos de Expo Router.
 *
 * Con sesión solo existe (app); sin sesión solo existe (auth). Al cerrar
 * sesión, Expo Router saca del historial todas las pantallas de (app), así
 * que el botón "atrás" de Android ya no puede volver a ellas.
 */
function Rutas() {
  const { sesion } = useSesion();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Protected guard={!sesion}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
      <Stack.Protected guard={!!sesion}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>
    </Stack>
  );
}
