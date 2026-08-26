import { useCallback, useEffect, useState } from 'react';
import { usuarioRepository } from '../repositories/UsuarioRepository';
import { useSesion } from './SesionProvider';

/** VIEWMODEL de la pantalla Mi impacto (HU-16). */
export function useImpacto() {
  const { sesion } = useSesion();
  const [conteo, setConteo] = useState<Record<string, number>>({});
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    if (!sesion) return;
    setCargando(true);
    setError(null);
    try {
      setConteo(await usuarioRepository.conteoPorCaneca(sesion.usuarioId));
    } catch {
      setError('No pudimos calcular tus estadísticas.');
    } finally {
      setCargando(false);
    }
  }, [sesion]);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  const total = Object.values(conteo).reduce((a, b) => a + b, 0);
  return { conteo, total, cargando, error, recargar: cargar };
}
