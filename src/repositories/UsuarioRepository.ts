import type { PuestoRanking, Usuario } from '../models';
import { MODO_DEMO } from '../services/env';

/**
 * Repositorio de perfil, puntos y ranking (HU-06, HU-13, HU-14, HU-16, HU-17).
 */
export interface UsuarioRepository {
  perfil(usuarioId: string): Promise<Usuario>;
  ranking(): Promise<PuestoRanking[]>;
  miPosicion(usuarioId: string): Promise<PuestoRanking>;
}

const USUARIO_DEMO: Usuario = {
  id: 'demo-1',
  nombre: 'Brandon Linares',
  carrera: 'Ingeniería de Sistemas',
  fotoUrl: null,
  ecoPuntos: 340,
  rachaActual: 5,
  rachaMejor: 12,
  ultimaClasificacion: '2026-08-20',
  creadoEn: '2026-08-01T10:00:00-05:00',
};

const RANKING_DEMO: PuestoRanking[] = [
  { posicion: 1, usuarioId: 'u2', nombre: 'Sarihat Moreno', fotoUrl: null, ecoPuntos: 720 },
  { posicion: 2, usuarioId: 'u3', nombre: 'Adriana Rueda', fotoUrl: null, ecoPuntos: 655 },
  { posicion: 3, usuarioId: 'u4', nombre: 'Camilo Tenorio', fotoUrl: null, ecoPuntos: 487 },
  { posicion: 4, usuarioId: 'u5', nombre: 'Mariana Vélez', fotoUrl: null, ecoPuntos: 412 },
  { posicion: 5, usuarioId: 'u6', nombre: 'Julián Quintero', fotoUrl: null, ecoPuntos: 368 },
];

class UsuarioRepositoryDemo implements UsuarioRepository {
  async perfil(_usuarioId: string): Promise<Usuario> {
    await new Promise((r) => setTimeout(r, 300));
    return USUARIO_DEMO;
  }

  async ranking(): Promise<PuestoRanking[]> {
    await new Promise((r) => setTimeout(r, 400));
    return RANKING_DEMO;
  }

  async miPosicion(usuarioId: string): Promise<PuestoRanking> {
    await new Promise((r) => setTimeout(r, 200));
    return {
      posicion: 7,
      usuarioId,
      nombre: USUARIO_DEMO.nombre,
      fotoUrl: null,
      ecoPuntos: USUARIO_DEMO.ecoPuntos,
    };
  }
}

// TODO Sprint 4-5: implementar UsuarioRepositorySupabase con la misma interfaz.
export const usuarioRepository: UsuarioRepository = MODO_DEMO
  ? new UsuarioRepositoryDemo()
  : new UsuarioRepositoryDemo();
