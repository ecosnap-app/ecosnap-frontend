import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SesionProvider } from '../src/viewmodels/SesionProvider';

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
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(app)" />
        </Stack>
      </SesionProvider>
    </SafeAreaProvider>
  );
}
