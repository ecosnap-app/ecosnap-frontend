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
    try {
      const [lista, mio] = await Promise.all([
        usuarioRepository.ranking(),
        usuarioRepository.miPosicion(sesion.usuarioId),
      ]);
      setTop(lista);
      setMiPuesto(mio);
    } catch {
      setError('No pudimos cargar el ranking.');
    } finally {
      setCargando(false);
    }
  }, [sesion]);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  return { top, miPuesto, cargando, error, recargar: cargar };
}
