import { useCallback, useState } from 'react';
import type { ResultadoClasificacion } from '../models';
import { clasificacionRepository } from '../repositories/ClasificacionRepository';
import { useSesion } from './SesionProvider';

type Estado = 'inactivo' | 'analizando' | 'listo' | 'error';

/**
 * VIEWMODEL del flujo de clasificación (HU-07 a HU-10, HU-12).
 *
 * Maneja los cuatro estados que la View tiene que saber pintar:
 * inactivo, analizando, listo y error.
 */
export function useClasificacion() {
  const { sesion } = useSesion();
  const [estado, setEstado] = useState<Estado>('inactivo');
  const [resultado, setResultado] = useState<ResultadoClasificacion | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fotoUri, setFotoUri] = useState<string | null>(null);

  const clasificar = useCallback(
    async (uri: string) => {
      if (!sesion) return;
      setFotoUri(uri);
      setEstado('analizando');
      setError(null);
      try {
        setResultado(await clasificacionRepository.clasificar(uri, sesion.token));
        setEstado('listo');
      } catch (e) {
        setError(e instanceof Error ? e.message : 'No pudimos analizar la foto.');
        setEstado('error');
      }
    },
    [sesion]
  );

  const guardar = useCallback(async () => {
    if (!sesion || !resultado || !fotoUri) return false;
    try {
      await clasificacionRepository.guardar(resultado, fotoUri, sesion.token);
      return true;
    } catch {
      setError('No pudimos guardar la clasificación.');
      return false;
    }
  }, [sesion, resultado, fotoUri]);

  const reiniciar = useCallback(() => {
    setEstado('inactivo');
    setResultado(null);
    setError(null);
    setFotoUri(null);
  }, []);

  return { estado, resultado, error, clasificar, guardar, reiniciar };
}
