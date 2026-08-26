import { useCallback, useEffect, useState } from 'react';
import type { Clasificacion, Usuario } from '../models';
import { usuarioRepository } from '../repositories/UsuarioRepository';
import { clasificacionRepository } from '../repositories/ClasificacionRepository';
import { useSesion } from './SesionProvider';

/** VIEWMODEL de la pantalla Inicio (HU-13, HU-14). */
export function useInicio() {
  const { sesion } = useSesion();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [recientes, setRecientes] = useState<Clasificacion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    if (!sesion) return;
    setCargando(true);
    setError(null);
    try {
      const [u, c] = await Promise.all([
        usuarioRepository.perfil(sesion.usuarioId),
        clasificacionRepository.historial(sesion.usuarioId, 0),
      ]);
      setUsuario(u);
      setRecientes(c.slice(0, 3));
    } catch {
      setError('No pudimos cargar tus datos.');
    } finally {
      setCargando(false);
    }
  }, [sesion]);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  return { usuario, recientes, cargando, error, recargar: cargar };
}
