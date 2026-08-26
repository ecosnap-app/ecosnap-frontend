import { Stack } from 'expo-router';

/** Rutas públicas: no requieren sesión. */
export default function LayoutAuth() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
