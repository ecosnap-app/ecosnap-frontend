import { useEffect, useState } from 'react';
import type { Usuario } from '../models';
import { usuarioRepository } from '../repositories/UsuarioRepository';
import { useSesion } from './SesionProvider';

/** VIEWMODEL del Perfil (HU-06). */
export function usePerfil() {
  const { sesion, salir } = useSesion();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!sesion) return;
    let vivo = true;
    usuarioRepository
      .perfil(sesion.usuarioId)
      .then((u) => vivo && setUsuario(u))
      .finally(() => vivo && setCargando(false));
    return () => {
      vivo = false;
    };
  }, [sesion]);

  return { usuario, cargando, cerrarSesion: salir };
}
