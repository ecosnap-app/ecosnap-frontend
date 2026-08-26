import { env } from './env';

/**
 * Cliente HTTP del backend propio (ecosnap-backend en Render).
 *
 * Solo se usa para lo que necesita secreto: la clasificación con Gemini.
 * La llave de la IA vive en el servidor, nunca dentro del APK.
 */
export class ErrorApi extends Error {
  constructor(
    mensaje: string,
    public readonly estado?: number
  ) {
    super(mensaje);
    this.name = 'ErrorApi';
  }
}

const TIMEOUT_MS = 15000;

export async function pedirApi<T>(
  ruta: string,
  opciones: RequestInit & { token?: string } = {}
): Promise<T> {
  if (!env.apiUrl) {
    throw new ErrorApi('Falta EXPO_PUBLIC_API_URL en el archivo .env');
  }

  const { token, headers, ...resto } = opciones;
  const control = new AbortController();
  const temporizador = setTimeout(() => control.abort(), TIMEOUT_MS);

  try {
    const respuesta = await fetch(`${env.apiUrl}${ruta}`, {
      ...resto,
      signal: control.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    });

    if (!respuesta.ok) {
      throw new ErrorApi(`El servidor respondió ${respuesta.status}`, respuesta.status);
    }

    return (await respuesta.json()) as T;
  } catch (error) {
    if (error instanceof ErrorApi) throw error;
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ErrorApi('La petición tardó demasiado. Intenta de nuevo.');
    }
    throw new ErrorApi('No pudimos conectarnos. Revisa tu conexión.');
  } finally {
    clearTimeout(temporizador);
  }
}
