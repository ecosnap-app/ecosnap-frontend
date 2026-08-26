/**
 * Configuración leída de variables de entorno.
 *
 * Expo expone al bundle solo las variables que empiezan por EXPO_PUBLIC_.
 * Los valores reales van en el archivo .env (que NO se sube a GitHub).
 * Ver .env.example para saber qué llenar.
 */

export const env = {
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? '',
};

/**
 * Mientras no existan las credenciales, la app corre en modo demo:
 * los repositorios responden con datos de mentira y la navegación
 * se puede demostrar igual (entregable del Sprint 3).
 *
 * En el Sprint 4 basta con llenar el .env para que esto pase a `false`
 * y la app empiece a hablar con Supabase de verdad.
 */
export const MODO_DEMO = !env.supabaseUrl || !env.supabaseAnonKey;
