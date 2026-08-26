import type { Clasificacion, ResultadoClasificacion } from '../models';
import { MODO_DEMO } from '../services/env';

/**
 * Repositorio de clasificaciones (HU-08, HU-09, HU-10, HU-15).
 *
 * Sprint 3: devuelve datos de ejemplo para poder navegar.
 * Sprint 4 en adelante: `clasificar` llamará a POST /api/classify del backend
 * y `guardar` invocará la función registrar_clasificacion de PostgreSQL.
 */
export interface ClasificacionRepository {
  clasificar(fotoUri: string, token: string): Promise<ResultadoClasificacion>;
  guardar(resultado: ResultadoClasificacion, fotoUri: string, token: string): Promise<void>;
  historial(usuarioId: string, pagina: number): Promise<Clasificacion[]>;
}

const EJEMPLO: Clasificacion[] = [
  {
    id: '1',
    usuarioId: 'demo-1',
    fotoUrl: '',
    tipoResiduo: 'Botella PET',
    caneca: 'blanca',
    explicacion: 'El plástico PET limpio es aprovechable y sí se recicla en Colombia.',
    instrucciones: ['Enjuágala', 'Aplástala', 'Deja la tapa puesta'],
    puntos: 10,
    creadoEn: '2026-08-20T14:32:00-05:00',
  },
  {
    id: '2',
    usuarioId: 'demo-1',
    fotoUrl: '',
    tipoResiduo: 'Cáscara de mango',
    caneca: 'verde',
    explicacion: 'Los restos de comida van en la caneca verde.',
    instrucciones: ['Escúrrela antes de botarla'],
    puntos: 10,
    creadoEn: '2026-08-19T09:10:00-05:00',
  },
  {
    id: '3',
    usuarioId: 'demo-1',
    fotoUrl: '',
    tipoResiduo: 'Pila AA usada',
    caneca: 'especial',
    explicacion: 'Las pilas son residuo peligroso: no van en ninguna caneca común.',
    instrucciones: ['Llévala al punto de recolección del bloque A'],
    puntos: 15,
    creadoEn: '2026-08-18T16:45:00-05:00',
  },
];

class ClasificacionRepositoryDemo implements ClasificacionRepository {
  async clasificar(_fotoUri: string, _token: string): Promise<ResultadoClasificacion> {
    await new Promise((r) => setTimeout(r, 1500));
    return {
      tipoResiduo: 'Botella PET',
      caneca: 'blanca',
      explicacion: 'El plástico PET limpio es aprovechable y sí se recicla en Colombia.',
      instrucciones: [
        'Enjuágala con un poco de agua',
        'Aplástala para que ocupe menos',
        'Deja la tapa puesta, también se recicla',
      ],
      confianza: 0.94,
    };
  }

  async guardar(): Promise<void> {
    await new Promise((r) => setTimeout(r, 400));
  }

  async historial(_usuarioId: string, pagina: number): Promise<Clasificacion[]> {
    await new Promise((r) => setTimeout(r, 400));
    return pagina === 0 ? EJEMPLO : [];
  }
}

// TODO Sprint 4-5: implementar ClasificacionRepositorySupabase con la misma interfaz.
export const clasificacionRepository: ClasificacionRepository = MODO_DEMO
  ? new ClasificacionRepositoryDemo()
  : new ClasificacionRepositoryDemo();
