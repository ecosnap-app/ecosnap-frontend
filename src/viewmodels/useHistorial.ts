import { useCallback, useEffect, useState } from 'react';
import type { Clasificacion } from '../models';
import { clasificacionRepository } from '../repositories/ClasificacionRepository';
import { useSesion } from './SesionProvider';

/** VIEWMODEL del Historial (HU-15). Pagina de a 20. */
export function useHistorial() {
  const { sesion } = useSesion();
  const [items, setItems] = useState<Clasificacion[]>([]);
  const [pagina, setPagina] = useState(0);
  const [hayMas, setHayMas] = useState(true);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarPagina = useCallback(
    async (p: number) => {
      if (!sesion) return;
      setCargando(true);
      setError(null);
      try {
        const nuevos = await clasificacionRepository.historial(sesion.usuarioId, p);
        setItems((previos) => (p === 0 ? nuevos : [...previos, ...nuevos]));
        setHayMas(nuevos.length > 0);
      } catch {
        setError('No pudimos cargar tu historial.');
      } finally {
        setCargando(false);
      }
    },
    [sesion]
  );

  useEffect(() => {
    void cargarPagina(0);
  }, [cargarPagina]);

  const siguientePagina = useCallback(() => {
    if (cargando || !hayMas) return;
    const p = pagina + 1;
    setPagina(p);
    void cargarPagina(p);
  }, [cargando, hayMas, pagina, cargarPagina]);

  return { items, cargando, error, hayMas, siguientePagina };
}
