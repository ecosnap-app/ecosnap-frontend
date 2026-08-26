/**
 * MODEL — entidades del dominio.
 * Estos tipos reflejan exactamente las tablas de PostgreSQL (ver modelo_base_datos.md).
 */

export type Caneca = 'blanca' | 'negra' | 'verde' | 'especial';

export interface Usuario {
  id: string;
  nombre: string;
  carrera: string | null;
  fotoUrl: string | null;
  ecoPuntos: number;
  rachaActual: number;
  rachaMejor: number;
  ultimaClasificacion: string | null;
  creadoEn: string;
}

export interface Clasificacion {
  id: string;
  usuarioId: string;
  fotoUrl: string;
  tipoResiduo: string;
  caneca: Caneca;
  explicacion: string;
  instrucciones: string[];
  puntos: number;
  creadoEn: string;
}

/** Lo que devuelve POST /api/classify del backend. */
export interface ResultadoClasificacion {
  tipoResiduo: string;
  caneca: Caneca;
  explicacion: string;
  instrucciones: string[];
  confianza: number;
}

export interface PuestoRanking {
  posicion: number;
  usuarioId: string;
  nombre: string;
  fotoUrl: string | null;
  ecoPuntos: number;
}

/** Sesión activa. En el Sprint 4 el token viene de Supabase Auth. */
export interface Sesion {
  usuarioId: string;
  email: string;
  token: string;
}

export const ETIQUETAS_CANECA: Record<Caneca, string> = {
  blanca: 'Caneca blanca',
  negra: 'Caneca negra',
  verde: 'Caneca verde',
  especial: 'Punto de recolección especial',
};
