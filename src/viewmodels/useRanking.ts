import { useCallback, useEffect, useState } from 'react';
import type { PuestoRanking } from '../models';
import { usuarioRepository } from '../repositories/UsuarioRepository';
import { useSesion } from './SesionProvider';

/** VIEWMODEL del Ranking (HU-17). */
export function useRanking() {
  const { sesion } = useSesion();
  const [top, setTop] = useState<PuestoRanking[]>([]);
  const [miPuesto, setMiPuesto] = useState<PuestoRanking | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    if (!sesion) return;
    setCargando(true);
    setError(null);
    // allSettled y no all: si falla "mi posición", el ranking público
    // se muestra igual (#41). Cada promesa se evalúa por separado.
    const [lista, mio] = await Promise.allSettled([
      usuarioRepository.ranking(),
      usuarioRepository.miPosicion(sesion.usuarioId),
    ]);

    if (lista.status === 'fulfilled') {
      setTop(lista.value);
    } else {
      setError('No pudimos cargar el ranking.');
    }
    setMiPuesto(mio.status === 'fulfilled' ? mio.value : null);
    setCargando(false);
  }, [sesion]);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  return { top, miPuesto, cargando, error, recargar: cargar };
}
